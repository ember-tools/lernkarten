/**
 * What changed against the recommendations of 2010, as flashcards, so learners can place older
 * material: the swapped triangles of hazard and measure, the colour of the armed forces and the
 * strength with five numbers.
 */

import type {TacticalSignSpec} from '@emberbox/ui'
import type {Item} from '../../learning/model'

/** A change against 2010. */
export interface NoteItem extends Item {
    sign: TacticalSignSpec
    prompt: string
    back: string
}

/** The changes worth knowing when reading older material. */
export const NOTE_ITEMS: readonly NoteItem[] = [
    {
        id: 'note-hazard', area: 'signs', name: 'Gefahr und Maßnahme seit 2024', sign: {form: 'hazard'},
        prompt: 'Wofür steht das rote Dreieck mit der Spitze nach oben, und wie war es 2010?',
        back: 'Für eine Gefahr. In den Empfehlungen von 2010 war es umgekehrt: Dort zeigte die Spitze der Gefahr nach unten und die der Maßnahme nach oben.',
    },
    {
        id: 'note-military', area: 'signs', name: 'Farbe der Bundeswehr seit 2024', sign: {form: 'formation', organisation: 'military', abbreviation: true},
        prompt: 'Welche Farbe hat die Bundeswehr seit 2024, und welche hatte sie 2010?',
        back: 'Braun. 2010 war die Bundeswehr weiß dargestellt.',
    },
    {
        id: 'note-strength', area: 'signs', name: 'Stärkeangabe seit 2024', sign: {form: 'formation', organisation: 'fire', size: 'group', strength: '0/0/1/8/9'},
        prompt: 'Wie viele Zahlen hat eine Stärkeangabe seit 2024, und wie war es 2010?',
        back: 'Bis zu fünf Zahlen, unbesetzte Funktionen stehen als 0. 2010 waren es vier Zahlen, unbesetzte Funktionen standen als Strich.',
    },
]
