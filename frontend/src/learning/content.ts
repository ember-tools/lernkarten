/**
 * The decks and areas the tool offers. The areas register themselves here as they are built;
 * a deck is found by its id, which is also its address.
 */

import type {Area, AreaId, Deck} from './model'

/** Every deck, in the order they are offered. */
export const DECKS: readonly Deck[] = []

/** Every area by its id. */
export const AREAS: Partial<Record<AreaId, Area>> = {}

/** The deck with an id, if there is one. */
export function findDeck(id: string): Deck | undefined {
    return DECKS.find(deck => deck.id === id)
}
