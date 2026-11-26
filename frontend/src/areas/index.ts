/**
 * The decks and areas the tool offers; a deck is found by its id, which is also its address.
 */

import type {Area, AreaId, Deck} from '../learning/model'
import {SIGN_DECKS, SIGNS_AREA} from './signs'

/** Every deck, in the order they are offered. */
export const DECKS: readonly Deck[] = [...SIGN_DECKS]

/** Every area by its id. */
export const AREAS: Partial<Record<AreaId, Area>> = {signs: SIGNS_AREA}

/** The deck with an id, if there is one. */
export function findDeck(id: string): Deck | undefined {
    return DECKS.find(deck => deck.id === id)
}
