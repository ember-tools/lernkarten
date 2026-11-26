/**
 * The signs of the library's catalogue as learning items, and the names of their building blocks
 * as the recommendations print them, looked up in the catalogue rather than written again.
 */

import {
    TACTICAL_SIGN_CATALOG, type BasicForm, type CatalogEntry, type SignOrganisation, type SignSize, type Supplement, type TacticalSignSpec,
} from '@emberbox/ui'
import type {Item} from '../../learning/model'

/** A sign of the catalogue as a learning item. */
export interface SignItem extends Item {
    entry: CatalogEntry
    /** The chapter or annex the sign belongs to: "1" to "6", "C" or "D", or "G" for the group of a fire service. */
    chapter: string
    /** The section within it, such as "4.3" or "C.1", for distractors from the same neighbourhood. */
    section: string
}

/** The part of a number before its last step: "4.3" of "4.3.1", "C.1" of "C.1.6", "5" of "5.3". */
function sectionOf(number: string): string {
    const parts = number.split('.')
    return parts.length > 2 ? parts.slice(0, -1).join('.') : parts[0]!
}

/**
 * Every sign of the recommendations in the catalogue, then the group of a fire service the library
 * builds after their system; the water supply marks are left out.
 */
export const SIGN_ITEMS: readonly SignItem[] = TACTICAL_SIGN_CATALOG.filter(entry => entry.recommended || entry.number.startsWith('G.')).map(entry => ({
    id: entry.id,
    area: 'signs',
    name: entry.name,
    entry,
    chapter: entry.number.split('.')[0]!,
    section: sectionOf(entry.number),
}))

/** The signs of a chapter or annex, such as "4" or "G". */
export function chapterItems(chapter: string): SignItem[] {
    return SIGN_ITEMS.filter(item => item.chapter === chapter)
}

/** The item of a catalogue id. */
export function signItem(id: string): SignItem | undefined {
    return SIGN_ITEMS.find(item => item.id === id)
}

/** The spec a catalogue entry draws, if it is drawn from building blocks. */
export function specOf(item: SignItem): TacticalSignSpec | undefined {
    return 'sign' in item.entry.drawing ? item.entry.drawing.sign : undefined
}

/** The signs of some sections or whole chapters, such as "4.3" or "C". */
export function inSections(...sections: string[]): SignItem[] {
    return SIGN_ITEMS.filter(item => sections.some(section => item.section === section || item.chapter === section))
}

/** The name of the entry in a chapter whose spec has a property, such as the size of 5.4.3. */
function nameWhere<K extends keyof TacticalSignSpec>(chapters: readonly string[], key: K, value: unknown): string {
    const found = inSections(...chapters).find(item => (key === 'supplements' ? specOf(item)?.supplements?.[0] : specOf(item)?.[key]) === value)
    return found?.name ?? String(value)
}

/** The printed name of a basic form (chapter 1). */
export const formName = (form: BasicForm) => nameWhere(['1'], 'form', form)
/** The printed name of an organisation (chapter 2). */
export const organisationName = (organisation: SignOrganisation) => nameWhere(['2'], 'organisation', organisation)
/** The printed name of a unit size or association (5.4, 5.5). */
export const sizeName = (size: SignSize) => nameWhere(['5.4', '5.5'], 'size', size)
/** The printed name of a supplementary sign (chapter 3). */
export const supplementName = (supplement: Supplement) => nameWhere(['3'], 'supplements', supplement)
