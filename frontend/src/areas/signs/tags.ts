/**
 * Who a sign matters to: the services it belongs to and the stage of training from which on it is
 * worth learning. A rule per section of the catalogue sets both, and a few signs add a service or
 * move to another stage. Stages build on each other, so a crew member also learns the signs of
 * the youth fire brigade.
 */

import type {Item} from '../../learning/model'

/** The services a sign can belong to; `all` matters to every organisation. */
export const SERVICES = ['all', 'fire', 'thw', 'medical', 'command', 'other'] as const

/** A service a sign belongs to. */
export type Service = typeof SERVICES[number]

/** The stages of training, each including the ones before it. */
export const STAGES = ['youth', 'crew', 'lead'] as const

/** A stage of training. */
export type Stage = typeof STAGES[number]

/** The services and the stage of a sign. */
export interface SignTags {
    services: readonly Service[]
    stage: Stage
}

/** What a learner chose: their services and their stage. Signs of every organisation always count. */
export interface SignFilter {
    services: readonly Service[]
    stage: Stage
}

/** A change to the rule of its section for one sign: another service it belongs to, or another stage. */
interface Exception {
    also?: readonly Service[]
    stage?: Stage
}

const tags = (stage: Stage, ...services: Service[]): SignTags => ({services, stage})

/** The rule of each section, found by the longest matching start of a sign's number. */
const SECTION_RULES: Readonly<Record<string, SignTags>> = {
    '1': tags('youth', 'all'),
    '2': tags('youth', 'all'),
    '3': tags('crew', 'all'),
    '4.1': tags('crew', 'fire', 'thw'),
    '4.2': tags('crew', 'medical'),
    '4.3': tags('youth', 'fire'),
    '4.4': tags('crew', 'all'),
    '4.5': tags('crew', 'fire', 'thw'),
    '4.6': tags('crew', 'medical'),
    '4.7': tags('crew', 'thw'),
    '4.8': tags('lead', 'thw'),
    '4.9': tags('crew', 'command'),
    '4.10': tags('lead', 'other'),
    '5': tags('lead', 'command'),
    '5.1': tags('crew', 'all'),
    '5.2': tags('crew', 'command'),
    '5.4': tags('youth', 'all'),
    '5.5': tags('lead', 'all'),
    '5.7': tags('lead', 'command'),
    '5.8': tags('lead', 'all'),
    '5.8.1': tags('crew', 'all'),
    '5.8.5': tags('crew', 'fire'),
    '5.8.8': tags('crew', 'all', 'medical'),
    '5.8.9': tags('crew', 'all'),
    '6': tags('lead', 'command'),
    'C': tags('crew', 'fire'),
    'D': tags('lead', 'command'),
    'G': tags('youth', 'fire'),
    'strength': tags('crew', 'command'),
    'time': tags('lead', 'command'),
    'identification': tags('lead', 'command'),
    'note': tags('crew', 'all'),
}

const YOUTH: Exception = {stage: 'youth'}
const CREW: Exception = {stage: 'crew'}
const LEAD: Exception = {stage: 'lead'}
const ALSO_FIRE: Exception = {also: ['fire']}
const ALSO_MEDICAL: Exception = {also: ['medical']}
const ALSO_THW: Exception = {also: ['thw']}

/** The vehicles every member should know (annex C.2): KdoW, ELW, (H)LF, TLF, DLAK, RW and MTF. */
export const COMMON_VEHICLES = ['C.2.1', 'C.2.2', 'C.2.3', 'C.2.8', 'C.2.9', 'C.2.10', 'C.2.11', 'C.2.12', 'C.2.13', 'C.2.14', 'C.2.15',
    'C.2.16', 'C.2.18', 'C.2.23'] as const

/** The technical help a fire service does every day: lighting, ventilation, lifting, pumping, pulling and more. */
const FIRE_SERVICE_TECHNICAL_HELP = ['4.7.3', '4.7.4', '4.7.5', '4.7.9', '4.7.10', '4.7.13', '4.7.14', '4.7.18', '4.7.20', '4.7.22',
    '4.7.26', '4.7.28'] as const

/** The signs that differ from the rule of their section. */
export const EXCEPTIONS: Readonly<Record<string, Exception>> = {
    '1.14': CREW,
    '3.1': YOUTH,
    '4.1.6': LEAD, '4.1.7': LEAD, '4.1.8': LEAD,
    '4.3.3': CREW, '4.3.4': CREW, '4.3.5': CREW,
    '4.5.8': {also: ['other']},
    '4.6.1': {also: ['all'], stage: 'youth'},
    ...Object.fromEntries(FIRE_SERVICE_TECHNICAL_HELP.map(id => [id, ALSO_FIRE])),
    '4.8.13': ALSO_MEDICAL, '4.8.14': ALSO_MEDICAL, '4.8.15': ALSO_MEDICAL, '4.8.16': ALSO_MEDICAL,
    '5.3': CREW,
    '5.1.1.1': YOUTH, '5.1.1.2': YOUTH, '5.1.1.3': YOUTH, '5.1.2.1': YOUTH,
    '5.8.1.6': YOUTH, '5.8.1.7': YOUTH, '5.8.1.9': YOUTH, '5.8.1.11': YOUTH,
    '5.8.8.3': YOUTH, '5.8.8.7': YOUTH, '5.8.8.8': YOUTH, '5.8.8.10': YOUTH,
    'C.1.1': YOUTH, 'C.1.2': YOUTH, 'C.1.3': YOUTH,
    ...Object.fromEntries(COMMON_VEHICLES.map(id => [id, YOUTH])),
    'D.1.8': ALSO_FIRE, 'D.3.7': ALSO_FIRE, 'D.4.2': ALSO_FIRE,
    'D.1.9': ALSO_MEDICAL, 'D.3.9': ALSO_MEDICAL, 'D.3.10': ALSO_MEDICAL, 'D.3.11': ALSO_MEDICAL, 'D.3.12': ALSO_MEDICAL,
    'D.3.13': ALSO_MEDICAL, 'D.3.15': ALSO_MEDICAL,
    'D.3.3': ALSO_MEDICAL, 'D.3.4': ALSO_MEDICAL,
    'D.3.8': ALSO_THW, 'D.3.14': ALSO_THW,
    'note-hazard': YOUTH,
    'note-strength': {also: ['command']},
}

/**
 * The rule of the longest section an id starts with: "5.8.1" for "5.8.1.6", "5.1" for
 * "5.1.1-unprotected", "strength" for the worked example "strength-total".
 */
function sectionRule(id: string): SignTags | undefined {
    const parts = id.split('-')[0]!.split('.')
    for (let length = parts.length; length > 0; length--) {
        const rule = SECTION_RULES[parts.slice(0, length).join('.')]
        if (rule) return rule
    }
    return undefined
}

/** The services and the stage of a sign item, or undefined for an item no rule covers. */
export function tagsOf(item: Item): SignTags | undefined {
    const rule = sectionRule(item.id)
    if (!rule) return undefined
    const exception = EXCEPTIONS[item.id] ?? {}
    return {services: [...new Set([...rule.services, ...exception.also ?? []])], stage: exception.stage ?? rule.stage}
}

/** Whether a sign counts for a filter: it belongs to every organisation or a chosen service, at the chosen stage or below. */
export function matches(tags: SignTags, filter: SignFilter): boolean {
    const service = tags.services.some(entry => entry === 'all' || filter.services.includes(entry))
    return service && STAGES.indexOf(tags.stage) <= STAGES.indexOf(filter.stage)
}
