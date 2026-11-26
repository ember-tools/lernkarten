/**
 * Who belongs in the group of a fire service and what they do first, after FwDV 3 (2008): worked
 * questions with their answers, asked like the reading examples, next to the signs of the group.
 */

import type {ReadingItem} from './reading'

const FIRE = {organisation: 'fire'} as const

/** The questions about the group and the section. */
export const GROUP_ITEMS: readonly ReadingItem[] = [
    {
        id: 'group-squads', area: 'signs', name: 'Trupps der Gruppe', sign: {form: 'formation', ...FIRE, size: 'group'},
        prompt: 'Welche Trupps hat eine Gruppe?', answer: 'Angriffstrupp, Wassertrupp und Schlauchtrupp',
        distractors: ['Angriffstrupp und Wassertrupp', 'Angriffstrupp, Wassertrupp und Sicherheitstrupp', 'Angriffstrupp, Schlauchtrupp und Melder'],
        explanation: 'Zur Gruppe gehören Gruppenführer, Maschinist, Melder und drei Trupps zu je zwei: Angriffs-, Wasser- und Schlauchtrupp (FwDV 3, 2.1).',
    },
    {
        id: 'group-crew', area: 'signs', name: 'Gruppe ohne Trupps', sign: {form: 'formation', ...FIRE, size: 'group'},
        prompt: 'Wer gehört außer den Trupps zur Gruppe?', answer: 'Gruppenführer, Maschinist und Melder',
        distractors: ['Gruppenführer und Maschinist', 'Zugführer, Maschinist und Melder', 'Gruppenführer, Melder und Sicherheitstrupp'],
        explanation: 'Neben Angriffs-, Wasser- und Schlauchtrupp gehören Gruppenführer, Maschinist und Melder zur Gruppe (FwDV 3, 2.1).',
    },
    {
        id: 'group-strength', area: 'signs', name: 'Stärke der Gruppe', sign: {form: 'formation', ...FIRE, size: 'group'},
        prompt: 'Welche Stärke hat eine Gruppe?', answer: '0/0/1/8/9', distractors: ['0/0/1/5/6', '0/1/1/8/10', '0/0/2/7/9'],
        explanation: 'Ein Gruppenführer und acht Einsatzkräfte, neun insgesamt; die FwDV 3 schreibt 1/8/9 (2.1), die Empfehlungen von 2024 setzen die Führer von Verbänden und Zügen als 0 davor (5.3).',
    },
    {
        id: 'group-section-squads', area: 'signs', name: 'Trupps der Staffel', sign: {form: 'formation', ...FIRE, size: 'section'},
        prompt: 'Welche Trupps hat eine Staffel?', answer: 'Angriffstrupp und Wassertrupp',
        distractors: ['Angriffstrupp, Wassertrupp und Schlauchtrupp', 'Angriffstrupp und Schlauchtrupp', 'Wassertrupp und Schlauchtrupp'],
        explanation: 'Zur Staffel gehören Staffelführer, Maschinist, Angriffstrupp und Wassertrupp, sechs insgesamt; die FwDV 3 schreibt 1/5/6 (2.2).',
    },
    {
        id: 'group-pump', area: 'signs', name: 'Aufgabe des Maschinisten', sign: {form: 'person', ...FIRE},
        prompt: 'Wer fährt das Löschfahrzeug und bedient die Pumpe?', answer: 'der Maschinist', distractors: ['der Melder', 'der Wassertrupp', 'der Gruppenführer'],
        explanation: 'Der Maschinist ist Fahrer und bedient die Feuerlöschkreiselpumpe und die eingebauten Aggregate (FwDV 3, 5.2.1).',
    },
    {
        id: 'group-distributor', area: 'signs', name: 'Wer setzt den Verteiler', sign: {form: 'formation', ...FIRE, size: 'squad'},
        prompt: 'Welcher Trupp setzt den Verteiler?', answer: 'der Angriffstrupp', distractors: ['der Wassertrupp', 'der Schlauchtrupp', 'der Sicherheitstrupp'],
        explanation: 'Der Angriffstrupp setzt den Verteiler; der Wassertrupp kuppelt ihn an die B-Schlauchleitung an (FwDV 3, 5.2.1).',
    },
    {
        id: 'group-safety', area: 'signs', name: 'Wer wird Sicherheitstrupp', sign: {form: 'formation', ...FIRE, size: 'squad', text: 'Si-Tr'},
        prompt: 'Welcher Trupp der Gruppe wird beim Atemschutzeinsatz zum Sicherheitstrupp?', answer: 'der Wassertrupp',
        distractors: ['der Schlauchtrupp', 'der Angriffstrupp', 'Maschinist und Melder'],
        explanation: 'Nachdem er die Wasserversorgung hergestellt hat, wird der Wassertrupp beim Atemschutzeinsatz Sicherheitstrupp (FwDV 3, 5.2.1).',
    },
]
