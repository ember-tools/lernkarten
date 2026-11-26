/**
 * The decks of the dangerous goods area: the basics for the youth fire brigade, everything a crew
 * needs, scenarios and building numbers for leaders, and everything.
 */

import {card, type Card, type Deck} from '../../learning/model'
import {GAMS_ITEMS, RULE_ITEMS, SCENARIO_ITEMS} from './content'
import {COMMON_SUBSTANCES} from './data'
import type {HazmatExercise} from './exercises'
import {SPECIAL_HAZARD_NUMBERS} from './data'
import {DIGIT_ITEMS, LABEL_ITEMS, NUMBER_ITEMS} from './items'

const cards = (ids: readonly string[], exercise: HazmatExercise): Card[] => ids.map(id => card('hazmat', id, exercise))
const ids = (items: readonly {id: string}[]) => items.map(entry => entry.id)

/** The label patterns of the classes 1 to 9 that the basics ask. */
export const MAIN_LABELS = ['1', '2.1', '2.2', '2.3', '3', '4.1', '4.2', '4.3', '5.1', '5.2', '6.1', '6.2', '7A', '8', '9'].map(pattern => `label-${pattern}`)

const substances = (level?: 'basic') => COMMON_SUBSTANCES.filter(substance => !level || substance.level === level).map(substance => `substance-${substance.un}`)

/**
 * The numbers leaders build from their meaning: those of the common substances, those with X and the
 * special combinations, so the scenarios are not drowned by all 97 numbers.
 */
export const LEAD_NUMBERS = [...new Set([
    ...COMMON_SUBSTANCES.map(substance => substance.hazard),
    ...ids(NUMBER_ITEMS).map(id => id.slice('number-'.length)).filter(code => code.startsWith('X')),
    ...SPECIAL_HAZARD_NUMBERS,
])].map(code => `number-${code}`)

/** The decks of the dangerous goods area. */
export const HAZMAT_DECKS: readonly Deck[] = [
    {
        id: 'gefahrgut-grundlagen', area: 'hazmat', level: 'basic', name: 'Gefahrgut – Grundlagen',
        description: 'Aufbau der Warntafel, die Ziffern der Gefahrnummer, häufige Stoffe, die Gefahrzettel der Klassen 1 bis 9 und die GAMS-Regel.',
        cards: [
            ...cards(['rule-layout', 'rule-double', 'rule-zero'], 'written'),
            ...cards(ids(DIGIT_ITEMS), 'digit'),
            ...cards(substances('basic'), 'plate-read'),
            ...cards(MAIN_LABELS, 'label-class'),
            ...cards(ids(GAMS_ITEMS).filter(id => id.startsWith('gams-')), 'written'),
        ],
    },
    {
        id: 'gefahrgut-einsatzabteilung', area: 'hazmat', level: 'crew', name: 'Gefahrgut – Einsatzabteilung',
        description: 'Alle Gefahrnummern, das X und Wasser, alle Gefahrzettel, häufige Stoffe, „Passt die Tafel?“ und die Abstände.',
        cards: [
            ...cards(ids(NUMBER_ITEMS), 'number-meaning'),
            ...cards(['rule-x', 'rule-water'], 'written'),
            ...cards(ids(LABEL_ITEMS), 'label-class'),
            ...cards(ids(LABEL_ITEMS), 'class-label'),
            ...cards(substances(), 'plate-read'),
            ...cards(substances(), 'plate-fits'),
            ...cards(ids(GAMS_ITEMS).filter(id => id.startsWith('distance-')), 'written'),
        ],
    },
    {
        id: 'gefahrgut-fuehrung', area: 'hazmat', level: 'lead', name: 'Gefahrgut – Führung',
        description: 'Lagen mit Tafel und Gefahrzetteln, Gefahrnummern aus ihrer Bedeutung erkennen und die Abstände bei Explosionsgefahr.',
        cards: [
            ...cards(ids(SCENARIO_ITEMS), 'written'),
            ...cards(LEAD_NUMBERS, 'number-build'),
            ...cards(['distance-explosive', 'distance-unclear', 'distance-wind'], 'written'),
        ],
    },
    {
        id: 'gefahrgut-alle', area: 'hazmat', level: 'lead', name: 'Gefahrgut – alle',
        description: 'Alle Gefahrgut-Aufgaben.',
        cards: [
            ...cards(ids(NUMBER_ITEMS), 'number-meaning'),
            ...cards(ids(NUMBER_ITEMS), 'number-build'),
            ...cards(ids(DIGIT_ITEMS), 'digit'),
            ...cards(ids(LABEL_ITEMS), 'label-class'),
            ...cards(ids(LABEL_ITEMS), 'class-label'),
            ...cards(substances(), 'plate-read'),
            ...cards(substances(), 'plate-fits'),
            ...cards([...ids(RULE_ITEMS), ...ids(GAMS_ITEMS), ...ids(SCENARIO_ITEMS)], 'written'),
        ],
    },
]
