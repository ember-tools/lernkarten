/**
 * What to ask next. A learning session takes the due cards of a deck, the lowest boxes and the
 * longest overdue first, then new cards up to a limit; a card answered wrong comes back at the end
 * of the session until it is answered right. A quiz draws a fixed number of cards at random and
 * leaves the boxes alone, so it can be repeated without spoiling the schedule.
 */

import {INTERVALS, isDue, type CardProgress} from './leitner'
import type {Card, Deck} from './model'
import type {Progress} from './progress'
import {shuffled} from './random'

/** How many cards a learning session asks at most, new ones included. */
export const SESSION_SIZE = 20

/** The cards due in a deck on `today`, in the order to ask them, at most `size`. */
export function dueCards(deck: Deck, progress: Progress, today: string, random: () => number, size = SESSION_SIZE): Card[] {
    const due = deck.cards.filter(card => progress[card.id] !== undefined && isDue(progress[card.id], today))
    const order = (a: Card, b: Card) => compare(progress[a.id]!, progress[b.id]!)
    const fresh = shuffled(deck.cards.filter(card => progress[card.id] === undefined), random)
    return [...[...due].sort(order), ...fresh].slice(0, size)
}

function compare(a: CardProgress, b: CardProgress): number {
    return a.box - b.box || a.due.localeCompare(b.due)
}

/** The cards of a quiz: `length` cards of the deck at random, or all of them if it has fewer. */
export function quizCards(deck: Deck, length: number, random: () => number): Card[] {
    return shuffled(deck.cards, random).slice(0, length)
}

/** The queue after an answer: the asked card leaves the front and comes back at the end if it was wrong. */
export function afterAnswer(queue: readonly Card[], right: boolean): Card[] {
    const [asked, ...rest] = queue
    return right || asked === undefined ? rest : [...rest, asked]
}

/** How a deck stands: cards per box, how many are new and how many are due on `today`. */
export interface DeckStanding {
    boxes: number[]
    fresh: number
    due: number
    total: number
}

/** The standing of a deck. */
export function deckStanding(deck: Deck, progress: Progress, today: string): DeckStanding {
    const boxes = Array.from({length: INTERVALS.length}, () => 0)
    let fresh = 0
    let due = 0
    for (const card of deck.cards) {
        const entry = progress[card.id]
        if (entry === undefined) fresh++
        else boxes[entry.box]!++
        if (entry !== undefined && isDue(entry, today)) due++
    }
    return {boxes, fresh, due, total: deck.cards.length}
}
