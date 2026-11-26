/**
 * The content model of the tool. An area (tactical signs, dangerous goods) owns items, the things
 * one can learn, and turns a card, one item asked in one direction, into a question. Decks bundle
 * cards for an audience and a level. Cards are generated from items, never written by hand.
 */

import type {SvgElement, TacticalSignSpec} from '@emberbox/ui'

/** The areas of the tool. */
export type AreaId = 'signs' | 'hazmat'

/** Who a deck is meant for: youth fire brigade, crew, or squad and platoon leaders. */
export type Level = 'basic' | 'crew' | 'lead'

/** Something one can learn, such as a sign of the catalogue or a hazard identification number. */
export interface Item {
    id: string
    area: AreaId
    /** What the item is called, as shown in reference pages and explanations. */
    name: string
}

/** One item asked in one direction; `exercise` names the kind of question within its area. */
export interface Card {
    id: string
    area: AreaId
    itemId: string
    exercise: string
}

/** A named selection of cards for an audience and a level; a card takes the level of its deck. */
export interface Deck {
    id: string
    area: AreaId
    name: string
    description: string
    level: Level
    cards: readonly Card[]
}

/** One answer to choose from: writing, a drawing, or both. TODO: a neutral accessible description for drawings, which today are only numbered. */
export interface Choice {
    text?: string
    drawing?: SvgElement
}

/**
 * A question ready to show. A choice question has one right choice among several; a flashcard
 * shows its back on demand and the learner says whether they knew it; a compose question asks for
 * a tactical sign to be put together from its building blocks and checks the blocks, not the picture.
 */
export type Question =
    | {form: 'choice', cardId: string, prompt: string, visual?: SvgElement, choices: readonly Choice[], answer: number, explanation: string}
    | {form: 'flashcard', cardId: string, prompt: string, visual?: SvgElement, back: string, backVisual?: SvgElement, explanation?: string}
    | {form: 'compose', cardId: string, prompt: string, target: TacticalSignSpec, explanation: string}

/** An area: what it is called, what can be learnt in it and how it asks its cards. */
export interface Area {
    id: AreaId
    name: string
    items: readonly Item[]
    question(card: Card, random: () => number): Question
}

/** The id of a card from its item and exercise, unique within its area. */
export function cardId(area: AreaId, itemId: string, exercise: string): string {
    return `${area}:${exercise}:${itemId}`
}

/** A card for an item and an exercise. */
export function card(area: AreaId, itemId: string, exercise: string): Card {
    return {id: cardId(area, itemId, exercise), area, itemId, exercise}
}
