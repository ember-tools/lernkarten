/**
 * The hand-written content of the dangerous goods area: the rules of the plate, the first measures
 * after the GAMS rule with the general distances of FwDV 500 (2022), put in our own words, and a
 * few scenarios for leaders. States may set their own rules; the explanations say so.
 */

import type {Item} from '../../learning/model'

/** A question written out with its answer and wrong answers. */
export interface WrittenItem extends Item {
    prompt: string
    answer: string
    distractors: readonly string[]
    explanation: string
    /** The plate and labels shown with the question, if any. */
    plate?: {hazardNumber: string, unNumber: string}
    labels?: readonly string[]
}

const FWDV = 'Nach FwDV 500 (Stand 2022); die Länder können Abweichendes regeln.'
const GAMS = `G – Gefahr erkennen, A – Absperren, M – Menschenrettung durchführen, S – Spezialkräfte alarmieren. ${FWDV}`

const item = (id: string, name: string, fields: Omit<WrittenItem, 'id' | 'area' | 'name'>): WrittenItem => ({id, area: 'hazmat', name, ...fields})

/** How the plate and its numbers are read (ADR 5.3.2). */
export const RULE_ITEMS: readonly WrittenItem[] = [
    item('rule-layout', 'Aufbau der Warntafel', {
        prompt: 'Was steht auf einer orangefarbenen Warntafel oben, was unten?', answer: 'Oben die Gefahrnummer, unten die UN-Nummer',
        distractors: ['Oben die UN-Nummer, unten die Gefahrnummer', 'Oben die Klasse, unten die UN-Nummer', 'Oben die Gefahrnummer, unten die Menge'],
        explanation: 'Die Nummer zur Kennzeichnung der Gefahr steht im oberen Teil, die UN-Nummer im unteren (ADR 5.3.2.2.2).',
        plate: {hazardNumber: '33', unNumber: '1203'},
    }),
    item('rule-x', 'Vorangestelltes X', {
        prompt: 'Was bedeutet ein X vor der Gefahrnummer?', answer: 'Der Stoff reagiert gefährlich mit Wasser',
        distractors: ['Der Stoff ist explosiv', 'Der Stoff ist sehr giftig', 'Die Gefahrnummer ist unbekannt'],
        explanation: 'Wasser darf dann nur im Einverständnis mit Sachverständigen verwendet werden (ADR 5.3.2.3.1).',
        plate: {hazardNumber: 'X423', unNumber: '1428'},
    }),
    item('rule-double', 'Verdoppelte Ziffer', {
        prompt: 'Was bedeutet es, wenn eine Ziffer in der Gefahrnummer doppelt steht, etwa 33 oder 66?', answer: 'Die entsprechende Gefahr ist erhöht',
        distractors: ['Es sind zwei Stoffe geladen', 'Der Stoff ist doppelt so schwer wie Luft', 'Die Gefahr ist nur schwach ausgeprägt'],
        explanation: 'Die Verdoppelung einer Ziffer weist auf die Zunahme der entsprechenden Gefahr hin (ADR 5.3.2.3.1).',
    }),
    item('rule-zero', 'Null als zweite Ziffer', {
        prompt: 'Wozu steht in Gefahrnummern wie 30 oder 80 eine Null?', answer: 'Die Gefahr ist mit einer Ziffer ausreichend beschrieben',
        distractors: ['Der Stoff ist ungefährlich', 'Die Menge ist gering', 'Der Stoff reagiert nicht mit Wasser'],
        explanation: 'Reicht eine einzige Ziffer, wird ihr eine Null angefügt (ADR 5.3.2.3.1).',
    }),
    item('rule-water', 'Wasser bei X', {
        prompt: 'Vor der Gefahrnummer steht ein X. Darf mit Wasser gelöscht werden?', answer: 'Nur im Einverständnis mit Sachverständigen',
        distractors: ['Ja, mit viel Wasser', 'Ja, aber nur mit Sprühstrahl', 'Ja, wenn der Stoff brennt'],
        explanation: 'Bei Stoffen mit vorangestelltem X darf Wasser nur im Einverständnis mit Sachverständigen verwendet werden (ADR 5.3.2.3.1).',
        plate: {hazardNumber: 'X88', unNumber: '1829'},
    }),
]

/** The first measures after the GAMS rule and the general distances. */
export const GAMS_ITEMS: readonly WrittenItem[] = [
    item('gams-g', 'GAMS: G', {
        prompt: 'Wofür steht das G in der GAMS-Regel?', answer: 'Gefahr erkennen', distractors: ['Gefahrgut bergen', 'Gruppe aufstellen', 'Gasmessung durchführen'],
        explanation: GAMS,
    }),
    item('gams-a', 'GAMS: A', {
        prompt: 'Wofür steht das A in der GAMS-Regel?', answer: 'Absperren', distractors: ['Atemschutz anlegen', 'Abdichten', 'Alarmieren'],
        explanation: GAMS,
    }),
    item('gams-m', 'GAMS: M', {
        prompt: 'Wofür steht das M in der GAMS-Regel?', answer: 'Menschenrettung durchführen', distractors: ['Messen', 'Material bereitstellen', 'Meldung abgeben'],
        explanation: GAMS,
    }),
    item('gams-s', 'GAMS: S', {
        prompt: 'Wofür steht das S in der GAMS-Regel?', answer: 'Spezialkräfte alarmieren', distractors: ['Sichern', 'Stoff bestimmen', 'Sammelplatz einrichten'],
        explanation: GAMS,
    }),
    item('gams-first', 'GAMS: Beginn', {
        prompt: 'Womit beginnt die GAMS-Regel?', answer: 'Gefahr erkennen', distractors: ['Absperren', 'Menschenrettung durchführen', 'Spezialkräfte alarmieren'],
        explanation: GAMS,
    }),
    item('gams-after-g', 'GAMS: Reihenfolge nach G', {
        prompt: 'Was kommt in der GAMS-Regel nach „Gefahr erkennen“?', answer: 'Absperren', distractors: ['Menschenrettung durchführen', 'Spezialkräfte alarmieren', 'Gefahrgut bergen'],
        explanation: GAMS,
    }),
    item('gams-after-m', 'GAMS: Reihenfolge nach M', {
        prompt: 'Was kommt in der GAMS-Regel nach „Menschenrettung durchführen“?', answer: 'Spezialkräfte alarmieren', distractors: ['Gefahr erkennen', 'Absperren', 'Brand bekämpfen'],
        explanation: GAMS,
    }),
    item('gams-after-a', 'GAMS: Reihenfolge nach A', {
        prompt: 'Was kommt in der GAMS-Regel nach „Absperren“?', answer: 'Menschenrettung durchführen', distractors: ['Gefahr erkennen', 'Spezialkräfte alarmieren', 'Brand bekämpfen'],
        explanation: `Die Reihenfolge ist Gefahr erkennen, Absperren, Menschenrettung durchführen, Spezialkräfte alarmieren. ${FWDV}`,
    }),
    item('distance-unclear', 'Abstand bei unklarer Lage', {
        prompt: 'Wie weit entfernt stellst du die Fahrzeuge bei unklarer Lage mindestens auf?', answer: 'Mindestens 50 m',
        distractors: ['Mindestens 10 m', 'Mindestens 25 m', 'Mindestens 1 000 m'],
        explanation: `Vorläufig mindestens 50 m entfernt, möglichst mit dem Wind anfahren, nicht in Senken und nicht im Gefahrenbereich. ${FWDV}`,
    }),
    item('distance-wind', 'Anfahrt', {
        prompt: 'Wie fährst du eine Einsatzstelle mit Gefahrstoffen möglichst an?', answer: 'Mit dem Wind, also mit dem Wind im Rücken',
        distractors: ['Gegen den Wind', 'Quer zum Wind durch die Senke', 'Auf dem kürzesten Weg, egal von wo'],
        explanation: `Möglichst mit dem Wind anfahren, nicht in Senken und nicht in den Gefahrenbereich. ${FWDV}`,
    }),
    item('distance-hazard', 'Gefahrenbereich', {
        prompt: 'Wie groß ist der Gefahrenbereich in der Regel?', answer: 'Etwa 50 m', distractors: ['Etwa 10 m', 'Etwa 200 m', 'Etwa 1 000 m'],
        explanation: `Gefahrenbereich etwa 50 m, Absperrbereich etwa 100 m; Wind beachten, bei Explosions- oder Zerknallgefahr erheblich erweitern. ${FWDV}`,
    }),
    item('distance-cordon', 'Absperrbereich', {
        prompt: 'Wie groß ist der Absperrbereich in der Regel?', answer: 'Etwa 100 m', distractors: ['Etwa 50 m', 'Etwa 500 m', 'Etwa 25 m'],
        explanation: `Gefahrenbereich etwa 50 m, Absperrbereich etwa 100 m; Wind beachten. ${FWDV}`,
    }),
    item('distance-explosive', 'Abstand bei Explosionsgefahr', {
        prompt: 'Größere Mengen druckverflüssigter Gase stehen unter Brandeinwirkung. Welcher Gefahrenbereich gilt mindestens?',
        answer: 'Mindestens 500 m, Absperrbereich 1 000 m', distractors: ['Mindestens 50 m, Absperrbereich 100 m', 'Mindestens 100 m, Absperrbereich 200 m', 'Mindestens 250 m, Absperrbereich 500 m'],
        explanation: `Bei größeren Mengen Explosivstoffe oder druckverflüssigter Gase unter Brandeinwirkung mindestens 500 m, Absperrbereich 1 000 m. ${FWDV}`,
    }),
]

/** Scenarios for leaders, with the plate and labels of the vehicle. */
export const SCENARIO_ITEMS: readonly WrittenItem[] = [
    item('scenario-fuel', 'Tankwagen mit Kraftstoff', {
        prompt: 'Ein Tankwagen ist umgekippt, aus dem Tank tropft Flüssigkeit. Vorne hängt diese Tafel, am Tank der Gefahrzettel 3. Was ordnest du zuerst an?',
        answer: 'Absperren, Zündquellen fernhalten, Menschenrettung prüfen', distractors: ['Ausgelaufenen Stoff mit Wasser wegspülen', 'Sofort den Tank öffnen und umpumpen', 'Die Tafel abnehmen, um den Stoff zu bestimmen'],
        explanation: `33/1203 ist Benzin: leicht entzündbarer flüssiger Stoff (Flammpunkt unter 23 °C). Nach GAMS zuerst absperren, Menschen retten und Spezialkräfte alarmieren. ${FWDV}`,
        plate: {hazardNumber: '33', unNumber: '1203'}, labels: ['3'],
    }),
    item('scenario-gas', 'Flüssiggas im Brand', {
        prompt: 'Ein Lkw mit dieser Tafel und dem Gefahrzettel 2.1 steht im Vollbrand. Welchen Gefahrenbereich legst du mindestens fest?',
        answer: 'Mindestens 500 m, Absperrbereich 1 000 m', distractors: ['Etwa 50 m, Absperrbereich 100 m', 'Etwa 100 m, Absperrbereich 200 m', 'Kein Absperrbereich nötig, Gas verflüchtigt sich'],
        explanation: `23/1965 ist Flüssiggas, ein entzündbares Gas. Unter Brandeinwirkung gilt bei größeren Mengen druckverflüssigter Gase mindestens 500 m, Absperrbereich 1 000 m. ${FWDV}`,
        plate: {hazardNumber: '23', unNumber: '1965'}, labels: ['2.1'],
    }),
    item('scenario-water', 'Stoff mit X', {
        prompt: 'An einem verunfallten Lkw hängt diese Tafel, dazu der Gefahrzettel 4.3. Es regnet. Was beachtest du besonders?',
        answer: 'Der Stoff reagiert gefährlich mit Wasser; kein Wasser ohne Sachverständige', distractors: ['Der Stoff ist radioaktiv; Strahlenschutz anfordern', 'Der Stoff ist ungefährlich, solange er trocken liegt', 'Mit Wasser verdünnen, damit er weniger gefährlich ist'],
        explanation: 'X423: fester Stoff, der mit Wasser gefährlich reagiert und entzündbare Gase bildet. Der Zettel 4.3 zeigt dasselbe: Stoffe, die in Berührung mit Wasser entzündbare Gase entwickeln.',
        plate: {hazardNumber: 'X423', unNumber: '1428'}, labels: ['4.3'],
    }),
]
