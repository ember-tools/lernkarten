/**
 * How the dangerous goods area asks its cards: a hazard number for its meaning and the other way
 * round, a digit for what it points to, a label for its class and the other way round, a plate for
 * its substance, whether a plate fits a substance, and the written questions on rules, GAMS and
 * scenarios. Substances come only from the hand-kept list, never from the list of UN numbers.
 */

import {DANGER_LABELS, DANGER_LABEL_PATTERNS, dangerLabelTree, type DangerLabelPattern} from '@emberbox/ui'
import {t} from '../../i18n'
import {choiceQuestion, distractorItems} from '../../learning/choices'
import type {Card, Question} from '../../learning/model'
import {GAMS_ITEMS, RULE_ITEMS, SCENARIO_ITEMS, type WrittenItem} from './content'
import {COMMON_SUBSTANCES, HAZARD_DIGITS, HAZARD_NUMBERS, hazardMeaning, type CommonSubstance} from './data'
import {explainHazardNumber} from './explain'
import {plateWithLabels} from './visuals'

/** The exercises of the dangerous goods area. */
export type HazmatExercise = 'number-meaning' | 'number-build' | 'digit' | 'label-class' | 'class-label' | 'plate-read' | 'plate-fits' | 'written'

const WRITTEN: readonly WrittenItem[] = [...RULE_ITEMS, ...GAMS_ITEMS, ...SCENARIO_ITEMS]

const labelName = (pattern: DangerLabelPattern) => t('hazmat.labelName', {pattern, name: DANGER_LABELS[pattern].name})
const labelChoice = (pattern: DangerLabelPattern) => ({text: DANGER_LABELS[pattern].name})
const firstDigit = (code: string) => code.replace(/^X/, '')[0]

function numberMeaning(code: string, cardId: string, random: () => number): Question {
    const others = distractorItems(code, HAZARD_NUMBERS.map(entry => entry.code), 6, random, other => firstDigit(other) === firstDigit(code))
    return choiceQuestion({
        cardId, prompt: t('hazmat.prompt.numberMeaning', {code}), correct: {text: hazardMeaning(code)!},
        distractors: others.map(other => ({text: hazardMeaning(other)!})), explanation: explainHazardNumber(code),
    }, random)
}

function numberBuild(code: string, cardId: string, random: () => number): Question {
    const digits = code.replace(/^X/, '')
    const close = (other: string) => other.replace(/^X/, '') === digits || firstDigit(other) === firstDigit(code)
    const others = distractorItems(code, HAZARD_NUMBERS.map(entry => entry.code), 6, random, close)
    return choiceQuestion({
        cardId, prompt: t('hazmat.prompt.numberBuild', {meaning: hazardMeaning(code)!}), correct: {text: code},
        distractors: others.map(text => ({text})), explanation: explainHazardNumber(code),
    }, random)
}

function digit(value: string, cardId: string, random: () => number): Question {
    const others = Object.keys(HAZARD_DIGITS).filter(other => other !== value)
    return choiceQuestion({
        cardId, prompt: t('hazmat.prompt.digit', {digit: value}), correct: {text: HAZARD_DIGITS[value]!},
        distractors: others.map(other => ({text: HAZARD_DIGITS[other]!})), explanation: t('hazmat.digitSource'),
    }, random)
}

function label(pattern: DangerLabelPattern, exercise: HazmatExercise, cardId: string, random: () => number): Question {
    const others = distractorItems(pattern, DANGER_LABEL_PATTERNS, 6, random, other => DANGER_LABELS[other].hazardClass[0] === DANGER_LABELS[pattern].hazardClass[0])
    const explanation = t('hazmat.labelSource', {name: labelName(pattern), page: DANGER_LABELS[pattern].page})
    if (exercise === 'class-label') {
        return choiceQuestion({
            cardId, prompt: t('hazmat.prompt.classLabel', {name: DANGER_LABELS[pattern].name}), correct: {drawing: dangerLabelTree(pattern)},
            distractors: others.filter(other => DANGER_LABELS[other].name !== DANGER_LABELS[pattern].name).map(other => ({drawing: dangerLabelTree(other)})),
            explanation,
        }, random)
    }
    return choiceQuestion({
        cardId, prompt: t('hazmat.prompt.labelClass'), visual: dangerLabelTree(pattern), correct: labelChoice(pattern),
        distractors: others.map(labelChoice), explanation,
    }, random)
}

const plateOf = (substance: CommonSubstance) => ({hazardNumber: substance.hazard, unNumber: substance.un})

function plateRead(substance: CommonSubstance, cardId: string, random: () => number): Question {
    const others = distractorItems(substance, COMMON_SUBSTANCES, 6, random, other => firstDigit(other.hazard) === firstDigit(substance.hazard))
    return choiceQuestion({
        cardId, prompt: t('hazmat.prompt.plateRead'), visual: plateWithLabels(plateOf(substance)), correct: {text: substance.name},
        distractors: others.map(other => ({text: other.name})),
        explanation: `${substance.hazard}/${substance.un}: ${substance.name}. ${explainHazardNumber(substance.hazard)}`,
    }, random)
}

function plateFits(substance: CommonSubstance, cardId: string, random: () => number): Question {
    const wrong = COMMON_SUBSTANCES.filter(other => other.hazard !== substance.hazard)
    const fits = random() < 0.5
    const shown = fits ? plateOf(substance) : {hazardNumber: wrong[Math.floor(random() * wrong.length)]!.hazard, unNumber: substance.un}
    const yes = {text: t('hazmat.yes')}
    const no = {text: t('hazmat.no')}
    return {
        form: 'choice', cardId, prompt: t('hazmat.prompt.plateFits', {name: substance.name}), visual: plateWithLabels(shown),
        choices: [yes, no], answer: fits ? 0 : 1,
        explanation: `${t('hazmat.plateRight', {plate: `${substance.hazard}/${substance.un}`, name: substance.name})} ${explainHazardNumber(substance.hazard)}`,
    }
}

function written(item: WrittenItem, cardId: string, random: () => number): Question {
    return choiceQuestion({
        cardId, prompt: item.prompt, visual: item.plate ? plateWithLabels(item.plate, item.labels) : undefined, correct: {text: item.answer},
        distractors: item.distractors.map(text => ({text})), explanation: item.explanation,
    }, random)
}

/** Asks a card of the dangerous goods area. */
export function hazmatQuestion(card: Card, random: () => number): Question {
    const key = card.itemId.slice(card.itemId.indexOf('-') + 1)
    switch (card.exercise as HazmatExercise) {
        case 'number-meaning': return numberMeaning(key, card.id, random)
        case 'number-build': return numberBuild(key, card.id, random)
        case 'digit': return digit(key, card.id, random)
        case 'label-class':
        case 'class-label': return label(key as DangerLabelPattern, card.exercise as HazmatExercise, card.id, random)
        case 'plate-read': return plateRead(COMMON_SUBSTANCES.find(substance => substance.un === key)!, card.id, random)
        case 'plate-fits': return plateFits(COMMON_SUBSTANCES.find(substance => substance.un === key)!, card.id, random)
        default: return written(WRITTEN.find(entry => entry.id === card.itemId)!, card.id, random)
    }
}
