/**
 * The learner's choice of services and stage as it travels in an address and in the browser:
 * readable German words in the query (`?fachdienst=feuerwehr,thw&stufe=einsatzabteilung`), and the
 * signs that choice keeps.
 */

import type {Item} from '../../learning/model'
import {SERVICES, STAGES, matches, tagsOf, type Service, type SignFilter, type Stage} from './tags'

/** The services a learner can choose; signs of every organisation always count. */
export const CHOSEN_SERVICES = SERVICES.filter(service => service !== 'all')

const SERVICE_WORDS: Readonly<Record<Service, string>> = {
    all: 'alle', fire: 'feuerwehr', thw: 'thw', medical: 'sanitaet', command: 'fuehrung', other: 'weitere',
}

const STAGE_WORDS: Readonly<Record<Stage, string>> = {
    youth: 'jugendfeuerwehr', crew: 'einsatzabteilung', lead: 'fuehrung',
}

/** Every service at the highest stage: nothing is left out. */
export const EVERYTHING: SignFilter = {services: CHOSEN_SERVICES, stage: 'lead'}

/** Whether a filter leaves nothing out. */
export function isEverything(filter: SignFilter): boolean {
    return filter.stage === 'lead' && CHOSEN_SERVICES.every(service => filter.services.includes(service))
}

/** The query of a filter, for an address. */
export function filterQuery(filter: SignFilter): {fachdienst: string, stufe: string} {
    const services = CHOSEN_SERVICES.filter(service => filter.services.includes(service))
    return {fachdienst: services.map(service => SERVICE_WORDS[service]).join(','), stufe: STAGE_WORDS[filter.stage]}
}

/** The words of a query value, which may come once, repeated or not at all. */
function wordsOf(value: unknown): string[] | undefined {
    if (typeof value === 'string') return value.split(',')
    if (Array.isArray(value)) return value.filter(entry => typeof entry === 'string').flatMap(entry => entry.split(','))
    return undefined
}

/**
 * The filter a query names, or undefined when it names neither services nor a stage, or a stage it
 * does not know. Without services every service counts, without a stage every stage; unknown
 * services are dropped.
 */
export function parseFilterQuery(services: unknown, stage: unknown): SignFilter | undefined {
    const serviceWords = wordsOf(services)
    const stageWord = wordsOf(stage)?.[0]
    if (serviceWords === undefined && stageWord === undefined) return undefined
    const stageFound = stageWord === undefined ? 'lead' : STAGES.find(entry => STAGE_WORDS[entry] === stageWord)
    if (!stageFound) return undefined
    const chosen = serviceWords === undefined ? CHOSEN_SERVICES : CHOSEN_SERVICES.filter(service => serviceWords.includes(SERVICE_WORDS[service]))
    return {services: chosen, stage: stageFound}
}

/** The stored text of a filter. */
export function serializeFilter(filter: SignFilter): string {
    return JSON.stringify(filterQuery(filter))
}

/** The filter of a stored text, or undefined when there is none or it cannot be read. */
export function parseFilter(text: string | null): SignFilter | undefined {
    if (!text) return undefined
    try {
        const stored = JSON.parse(text) as {fachdienst?: unknown, stufe?: unknown}
        return parseFilterQuery(stored.fachdienst, stored.stufe)
    } catch {
        return undefined
    }
}

/** What a page does with the filter when it loads: which one applies, whether to store it and what to write into the address. */
export interface FilterResolution {
    filter: SignFilter
    store: boolean
    address: {fachdienst: string, stufe: string} | undefined
}

/**
 * Decides the filter of a page that loads: the one its address names wins and is stored; otherwise
 * the stored one, else the one this visit already chose (where the browser refuses its storage),
 * else everything. A filter that does not come from the address is written into it so the address
 * can be passed on, unless it leaves nothing out.
 */
export function resolveFilter(fromAddress: SignFilter | undefined, stored: SignFilter | undefined, current: SignFilter | undefined): FilterResolution {
    if (fromAddress) return {filter: fromAddress, store: true, address: undefined}
    const filter = stored ?? current ?? EVERYTHING
    return {filter, store: false, address: isEverything(filter) ? undefined : filterQuery(filter)}
}

/** The items a filter keeps; items without tags are kept, so nothing disappears unnoticed. */
export function filterItems<T extends Item>(items: readonly T[], filter: SignFilter): T[] {
    return items.filter(item => {
        const tags = tagsOf(item)
        return !tags || matches(tags, filter)
    })
}
