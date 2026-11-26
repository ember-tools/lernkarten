/**
 * How the sign area asks its cards: a sign for its meaning, a meaning for its sign, the size, the
 * organisation or the ability a sign shows, a sign to put together in the kit, a worked example of
 * the writing around a sign, and the changes against 2010.
 */

import {ABILITIES, SIGN_ORGANISATIONS, SIGN_SIZES, catalogSignTree, tacticalSignTree, type AbilityName} from '@emberbox/ui'
import {t} from '../../i18n'
import {choiceQuestion, distractorItems} from '../../learning/choices'
import type {Card, Question} from '../../learning/model'
import {SIGN_ITEMS, organisationName, signItem, sizeName, specOf, type SignItem} from './catalog'
import {composable} from './compose'
import {NOTE_ITEMS} from './notes'
import {READING_ITEMS} from './reading'

/** The exercises of the sign area. */
export type SignExercise = 'meaning' | 'picture' | 'size' | 'organisation' | 'ability' | 'compose' | 'reading' | 'note'

/** Where a sign comes from, as the explanation of every answer names it. */
function source(item: SignItem): string {
    return t('signs.source', {number: item.entry.number, name: item.name, page: item.entry.page ?? ''})
}

/** The signs of the same chapter, those of the same section first, for distractors. */
function neighbours(item: SignItem, count: number, random: () => number): SignItem[] {
    const pool = SIGN_ITEMS.filter(other => other.chapter === item.chapter)
    return distractorItems(item, pool, count, random, other => other.section === item.section)
}

function meaning(item: SignItem, cardId: string, random: () => number): Question {
    return choiceQuestion({
        cardId, prompt: t('signs.prompt.meaning'), visual: catalogSignTree(item.entry), correct: {text: item.name},
        distractors: neighbours(item, 6, random).map(other => ({text: other.name})), explanation: source(item),
    }, random)
}

function picture(item: SignItem, cardId: string, random: () => number): Question {
    const drawing = catalogSignTree(item.entry)
    const seen = new Set([JSON.stringify(drawing)])
    const distractors = neighbours(item, 8, random).map(other => catalogSignTree(other.entry)).filter(tree => {
        const key = JSON.stringify(tree)
        if (seen.has(key)) return false
        seen.add(key)
        return true
    }).map(tree => ({drawing: tree}))
    return choiceQuestion({
        cardId, prompt: t('signs.prompt.picture', {name: item.name}), correct: {drawing}, distractors, explanation: source(item),
    }, random)
}

/** A question about one block of a sign: its size, organisation or ability, answered by name. */
function block(item: SignItem, cardId: string, random: () => number, prompt: string, right: string, others: readonly string[]): Question {
    return choiceQuestion({
        cardId, prompt, visual: catalogSignTree(item.entry), correct: {text: right},
        distractors: others.filter(name => name !== right).map(text => ({text})), explanation: source(item),
    }, random)
}

function ability(item: SignItem, cardId: string, random: () => number): Question {
    const name = specOf(item)!.abilities![0]!
    const right = ABILITIES[name]
    const section = right.number.split('.').slice(0, 2).join('.')
    const pool = (Object.keys(ABILITIES) as AbilityName[]).filter(other => other !== name)
    const others = distractorItems(name, pool, 6, random, other => ABILITIES[other].number.startsWith(`${section}.`))
    return block(item, cardId, random, t('signs.prompt.ability'), right.name, others.map(other => ABILITIES[other].name))
}

/** Asks a catalogue sign in one exercise. */
function signQuestion(item: SignItem, card: Card, random: () => number): Question {
    const spec = specOf(item)
    switch (card.exercise as SignExercise) {
        case 'picture': return picture(item, card.id, random)
        case 'size': return block(item, card.id, random, t('signs.prompt.size'), sizeName(spec!.size!), SIGN_SIZES.map(sizeName))
        case 'organisation':
            return block(item, card.id, random, t('signs.prompt.organisation'), organisationName(spec!.organisation!), SIGN_ORGANISATIONS.map(organisationName))
        case 'ability': return ability(item, card.id, random)
        case 'compose': return {form: 'compose', cardId: card.id, prompt: t('signs.prompt.compose', {name: item.name}), target: spec!, explanation: source(item)}
        default: return meaning(item, card.id, random)
    }
}

/** Asks a card of the sign area. */
export function signsQuestion(card: Card, random: () => number): Question {
    if (card.exercise === 'reading') {
        const item = READING_ITEMS.find(entry => entry.id === card.itemId)!
        return choiceQuestion({
            cardId: card.id, prompt: item.prompt, visual: tacticalSignTree(item.sign), correct: {text: item.answer},
            distractors: item.distractors.map(text => ({text})), explanation: item.explanation,
        }, random)
    }
    if (card.exercise === 'note') {
        const item = NOTE_ITEMS.find(entry => entry.id === card.itemId)!
        return {form: 'flashcard', cardId: card.id, prompt: item.prompt, visual: tacticalSignTree(item.sign), back: item.back}
    }
    return signQuestion(signItem(card.itemId)!, card, random)
}

/**
 * The exercises a catalogue sign can be asked in. Building blocks are asked only of the example
 * signs of annexes C and D, which name a real unit: the signs of chapters 2 to 5 show one block each,
 * so asking for it would repeat the meaning, and their fire service red is only a display choice.
 * The organisation is asked only in annex D, where it varies.
 */
export function exercisesFor(item: SignItem): SignExercise[] {
    const spec = specOf(item)
    const exercises: SignExercise[] = ['meaning', 'picture']
    const unit = item.chapter === 'C' || item.chapter === 'D'
    if (!spec || !unit) return exercises
    if (spec.size) exercises.push('size')
    if (spec.organisation && item.chapter === 'D') exercises.push('organisation')
    if (spec.abilities?.length === 1) exercises.push('ability')
    if (composable(spec)) exercises.push('compose')
    return exercises
}
