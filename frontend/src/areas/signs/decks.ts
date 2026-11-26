/**
 * The decks of the sign area, by audience: the basics for the youth fire brigade, what a crew
 * needs, what leaders need, and everything.
 */

import {card, type Card, type Deck} from '../../learning/model'
import {SIGN_ITEMS, inSections, type SignItem} from './catalog'
import {exercisesFor, type SignExercise} from './exercises'
import {NOTE_ITEMS} from './notes'
import {READING_ITEMS} from './reading'

/** The cards of some signs in those of the given exercises each sign can be asked in. */
function cardsOf(items: readonly SignItem[], exercises: readonly SignExercise[]): Card[] {
    return items.flatMap(item => exercisesFor(item).filter(exercise => exercises.includes(exercise)).map(exercise => card('signs', item.id, exercise)))
}

/** The vehicles every member should know (annex C.2): KdoW, ELW, (H)LF, TLF, DLAK, RW and MTF. */
export const COMMON_VEHICLES = ['C.2.1', 'C.2.2', 'C.2.3', 'C.2.8', 'C.2.9', 'C.2.10', 'C.2.11', 'C.2.12', 'C.2.13', 'C.2.14', 'C.2.15',
    'C.2.16', 'C.2.18', 'C.2.23'] as const

const commonVehicles = SIGN_ITEMS.filter(item => (COMMON_VEHICLES as readonly string[]).includes(item.id))

const PICTURE_AND_MEANING: SignExercise[] = ['meaning', 'picture']

/** The decks of the sign area. */
export const SIGN_DECKS: readonly Deck[] = [
    {
        id: 'zeichen-grundlagen', area: 'signs', level: 'basic', name: 'Zeichen – Grundlagen',
        description: 'Grundformen, Farben der Organisationen, Größenordnungen und die häufigsten Feuerwehrfahrzeuge.',
        cards: [
            ...cardsOf(inSections('1', '2', '5.4', '5.5'), PICTURE_AND_MEANING),
            ...cardsOf(commonVehicles, PICTURE_AND_MEANING),
            card('signs', 'note-hazard', 'note'),
        ],
    },
    {
        id: 'zeichen-einsatzabteilung', area: 'signs', level: 'crew', name: 'Zeichen – Einsatzabteilung',
        description: 'Fähigkeiten von Brandschutz bis Betreuung, Ergänzungszeichen, Gefahren und Schäden, Feuerwehreinheiten und was sich seit 2010 geändert hat.',
        cards: [
            ...cardsOf(inSections('4.1', '4.2', '4.3', '4.5', '4.6', '4.7', '3'), PICTURE_AND_MEANING),
            ...cardsOf(SIGN_ITEMS.filter(item => item.entry.number.startsWith('5.8')), PICTURE_AND_MEANING),
            ...cardsOf(inSections('C.1'), [...PICTURE_AND_MEANING, 'size', 'ability', 'compose']),
            ...NOTE_ITEMS.map(item => card('signs', item.id, 'note')),
        ],
    },
    {
        id: 'zeichen-fuehrung', area: 'signs', level: 'lead', name: 'Zeichen – Führung',
        description: 'Führungsstellen und Führungskräfte, Verbände, Verwaltungsstufen, Bewegungen und das Lesen von Stärke, Zeit und Identifizierung.',
        cards: [
            ...cardsOf(inSections('D'), [...PICTURE_AND_MEANING, 'size', 'organisation', 'compose']),
            ...cardsOf(inSections('5.5', '5.7', '5.2'), PICTURE_AND_MEANING),
            ...READING_ITEMS.map(item => card('signs', item.id, 'reading')),
        ],
    },
    {
        id: 'zeichen-alle', area: 'signs', level: 'lead', everything: true, name: 'Zeichen – alle',
        description: 'Alle Zeichen der Empfehlungen in allen Aufgaben.',
        cards: [
            ...cardsOf(SIGN_ITEMS, ['meaning', 'picture', 'size', 'organisation', 'ability', 'compose']),
            ...READING_ITEMS.map(item => card('signs', item.id, 'reading')),
            ...NOTE_ITEMS.map(item => card('signs', item.id, 'note')),
        ],
    },
]
