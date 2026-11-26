/**
 * The learning progress kept in the browser: one entry per card under a versioned key, and the
 * settings under their own. Reading never throws: a stored value that does not parse counts as no
 * progress. Export writes the progress as a file to move it to another device; import checks every
 * entry before anything is replaced. The storage itself is reached in `useLearningState`.
 */

import {LAST_BOX, type CardProgress} from './leitner'

const FORMAT = 'lernkarten-progress'
const VERSION = 1

/** The progress of every card answered so far, by card id. */
export type Progress = Record<string, CardProgress>

/** What the learner set: the number of questions in a quiz. */
export interface Settings {
    quizLength: 10 | 20
}

/** The settings of a learner who set nothing. */
export const DEFAULT_SETTINGS: Settings = {quizLength: 10}

const DAY = /^\d{4}-\d{2}-\d{2}$/

/** Whether a value is a valid card progress. */
function isCardProgress(value: unknown): value is CardProgress {
    if (typeof value !== 'object' || value === null) return false
    const entry = value as Record<string, unknown>
    return Number.isInteger(entry.box) && (entry.box as number) >= 0 && (entry.box as number) <= LAST_BOX
        && typeof entry.due === 'string' && DAY.test(entry.due)
        && Number.isInteger(entry.seen) && (entry.seen as number) >= 1
        && (entry.last === 'right' || entry.last === 'wrong')
}

/** The valid entries of a parsed progress object, or undefined when it is not one. */
function parseCards(value: unknown): Progress | undefined {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) return undefined
    const entries = Object.entries(value)
    if (!entries.every(([, entry]) => isCardProgress(entry))) return undefined
    return Object.fromEntries(entries.map(([id, entry]: [string, CardProgress]) => [id, {box: entry.box, due: entry.due, seen: entry.seen, last: entry.last}]))
}

function parse(text: string | null): unknown {
    try {
        return text ? JSON.parse(text) : undefined
    } catch {
        return undefined
    }
}

/** The progress in the stored text, empty when there is none or it does not parse. */
export function parseProgress(text: string | null): Progress {
    const stored = parse(text) as {version?: unknown, cards?: unknown} | undefined
    return (stored?.version === VERSION ? parseCards(stored.cards) : undefined) ?? {}
}

/** The progress as the text to store. */
export function serializeProgress(progress: Progress): string {
    return JSON.stringify({version: VERSION, cards: progress})
}

/** The settings in the stored text, the defaults for anything missing or invalid. */
export function parseSettings(text: string | null): Settings {
    const stored = parse(text) as Partial<Settings> | undefined
    return {quizLength: stored?.quizLength === 20 ? 20 : DEFAULT_SETTINGS.quizLength}
}

/** The settings as the text to store. */
export function serializeSettings(settings: Settings): string {
    return JSON.stringify(settings)
}

/** The progress as the text of an export file. */
export function exportProgress(progress: Progress, now: Date): string {
    return JSON.stringify({format: FORMAT, version: VERSION, exportedAt: now.toISOString(), cards: progress}, null, 2)
}

/** The progress in an export file, or undefined when the text is not one. */
export function importProgress(text: string): Progress | undefined {
    try {
        const parsed = JSON.parse(text) as {format?: unknown, version?: unknown, cards?: unknown}
        return parsed?.format === FORMAT && parsed.version === VERSION ? parseCards(parsed.cards) : undefined
    } catch {
        return undefined
    }
}

/** The progress without the cards of a deck, to start that deck over. */
export function withoutCards(progress: Progress, cardIds: readonly string[]): Progress {
    const remove = new Set(cardIds)
    return Object.fromEntries(Object.entries(progress).filter(([id]) => !remove.has(id)))
}
