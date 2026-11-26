/**
 * The data of the dangerous goods area: the hazard identification numbers of ADR 5.3.2.3.2 with
 * their meanings and the meaning of each digit (5.3.2.3.1), a hand-kept list of common substances,
 * and the list of UN numbers, which is large and therefore loaded only where it is needed.
 */

import COMMON from '../../data/hazmat/common-substances.json'
import TABLE from '../../data/hazmat/hazard-numbers.json'
import type {Level} from '../../learning/model'

/** A hazard identification number with its meaning after the ADR. */
export interface HazardNumber {
    code: string
    meaning: string
}

/** A common substance with the numbers of its plate. */
export interface CommonSubstance {
    un: string
    hazard: string
    name: string
    level: Level
}

/**
 * An entry of the list of UN numbers: its hazard numbers (none for class 1, where the list is unsure,
 * marked `uncertain`, or where it gives none), its class (empty where the list gives none) and name.
 */
export interface UnEntry {
    un: string
    hazard: string[]
    class: string
    name: string
    uncertain?: boolean
}

/** Every hazard identification number of 5.3.2.3.2, in the order of the ADR. */
export const HAZARD_NUMBERS: readonly HazardNumber[] = TABLE.numbers

/** What each digit of a hazard number generally points to (5.3.2.3.1). */
export const HAZARD_DIGITS: Readonly<Record<string, string>> = TABLE.digits

/** The combinations whose meaning differs from reading their digits one by one. */
export const SPECIAL_HAZARD_NUMBERS: readonly string[] = TABLE.special

/** Where the meanings come from. */
export const HAZARD_SOURCE = {text: TABLE.source, url: TABLE.url}

/** What the ADR says about water where the number starts with X. */
export const WATER_NOTE = TABLE.waterNote

/** The common substances, from the youth fire brigade upwards. */
export const COMMON_SUBSTANCES: readonly CommonSubstance[] = COMMON.substances as CommonSubstance[]

/** The meaning of a hazard number, if the ADR lists it. */
export function hazardMeaning(code: string): string | undefined {
    return HAZARD_NUMBERS.find(entry => entry.code === code)?.meaning
}

/** The list of UN numbers, loaded on first use. */
export async function loadUnNumbers(): Promise<readonly UnEntry[]> {
    return (await import('../../data/hazmat/un.json')).default as UnEntry[]
}

/**
 * The one hazard number of an entry the ADR table knows, or undefined where the entry has none,
 * several, or one the table does not list; only such entries can be asked as a plate.
 */
export function plateHazard(entry: UnEntry): string | undefined {
    const [only, ...rest] = entry.hazard
    return only !== undefined && rest.length === 0 && hazardMeaning(only) !== undefined ? only : undefined
}
