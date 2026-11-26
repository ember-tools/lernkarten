/**
 * Reading the writing around a sign (5.3 strength, 5.6 time, 6.2 identification): a few worked
 * examples, written out with their answers, since the questions are about one number of many.
 */

import type {TacticalSignSpec} from '@emberbox/ui'
import type {Item} from '../../learning/model'

/** A worked example of writing around a sign. */
export interface ReadingItem extends Item {
    sign: TacticalSignSpec
    prompt: string
    answer: string
    distractors: readonly string[]
    explanation: string
}

const FIRE = {form: 'formation', organisation: 'fire'} as const

/** The examples, from the leading of a group up to a platoon and a unit. */
export const READING_ITEMS: readonly ReadingItem[] = [
    {
        id: 'strength-total', area: 'signs', name: 'Gesamtstärke ablesen', sign: {...FIRE, size: 'association-1', strength: '1/1/6/40/48'},
        prompt: 'Wie viele Kräfte hat diese Einheit insgesamt?', answer: '48', distractors: ['40', '56', '6'],
        explanation: 'Die letzte, unterstrichene Zahl ist die Gesamtstärke: 1 Führer von Verbänden, 1 Zugführer, 6 Unterführer und 40 Einsatzkräfte (5.3).',
    },
    {
        id: 'strength-leaders', area: 'signs', name: 'Unterführer ablesen', sign: {...FIRE, size: 'group', strength: '0/0/1/8/9'},
        prompt: 'Wie viele Unterführer hat diese Einheit?', answer: '1', distractors: ['0', '8', '9'],
        explanation: 'Die dritte Zahl zählt die Unterführer (Gruppen-, Staffel- und Truppführer selbstständiger Trupps): eine Gruppe mit 1 Gruppenführer und 8 Einsatzkräften, 9 insgesamt (5.3).',
    },
    {
        id: 'strength-platoon', area: 'signs', name: 'Zugführer ablesen', sign: {...FIRE, size: 'platoon', strength: '0/1/3/18/22'},
        prompt: 'Wie viele Zugführer hat diese Einheit?', answer: '1', distractors: ['0', '3', '18'],
        explanation: 'Die zweite Zahl zählt die Zugführer, die erste die Führer von Verbänden; unbesetzte Funktionen stehen als 0 (5.3).',
    },
    {
        id: 'time-june', area: 'signs', name: 'Zeitangabe lesen', sign: {...FIRE, size: 'group', time: '040835jun23'},
        prompt: 'Welcher Zeitpunkt steht links neben dem Zeichen?', answer: '4. Juni 2023, 08:35 Uhr',
        distractors: ['8. April 2023, 03:35 Uhr', '23. Juni 2004, 08:35 Uhr', '4. Juni 2023, 03:58 Uhr'],
        explanation: 'Zuerst der Tag (04), dann die Uhrzeit (0835), der Monat in englischer Abkürzung (jun) und das Jahr (23) (5.6).',
    },
    {
        id: 'time-december', area: 'signs', name: 'Zeitangabe lesen', sign: {...FIRE, size: 'section', time: '311945dec26'},
        prompt: 'Welcher Zeitpunkt steht links neben dem Zeichen?', answer: '31. Dezember 2026, 19:45 Uhr',
        distractors: ['19. Dezember 2031, 19:45 Uhr', '26. Dezember 2031, 19:45 Uhr', '31. Dezember 2026, 07:45 Uhr'],
        explanation: 'Tag 31, Uhrzeit 1945, Monat dec für Dezember, Jahr 26; die Uhrzeit hat 24 Stunden (5.6).',
    },
    {
        id: 'identification-group', area: 'signs', name: 'Identifizierung lesen', sign: {...FIRE, size: 'group', identification: '2-1-3'},
        prompt: 'Was gibt die Ziffernfolge rechts neben dem Zeichen an?', answer: 'Verband 2, Zug 1, Gruppe 3',
        distractors: ['Gruppe 2, Zug 1, Verband 3', 'Zug 2, Gruppe 1, Trupp 3', '2 Züge, 1 Gruppe, 3 Trupps'],
        explanation: 'Die Ziffern beginnen mit der höchsten Gliederungsebene: Verband, Zug, Gruppe oder Staffel, Trupp (6.2).',
    },
    {
        id: 'identification-squad', area: 'signs', name: 'Identifizierung lesen', sign: {...FIRE, size: 'squad', identification: '0-2-1-2'},
        prompt: 'Was gibt die Ziffernfolge rechts neben dem Zeichen an?', answer: 'ohne Verband, Zug 2, Gruppe 1, Trupp 2',
        distractors: ['Verband 2, Zug 1, Gruppe 2', 'Trupp 0, Gruppe 2, Zug 1, Verband 2', 'Zug 2, Gruppe 1, 2 Trupps'],
        explanation: 'Eine fehlende Gliederungsebene steht als 0; hier gehört der Trupp zu keinem Verband (6.2).',
    },
]
