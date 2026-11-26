/**
 * The decks and areas the tool offers; a deck is found by its id, which is also its address. The
 * sign deck is built from the learner's choice, so it is not among the fixed decks.
 */

import type {Area, AreaId, Deck} from '../learning/model'
import {HAZMAT_AREA, HAZMAT_DECKS} from './hazmat'
import {SIGNS_AREA} from './signs'

/** Every fixed deck, in the order they are offered. */
export const DECKS: readonly Deck[] = [...HAZMAT_DECKS]

/** Every area by its id. */
export const AREAS: Record<AreaId, Area> = {signs: SIGNS_AREA, hazmat: HAZMAT_AREA}

/** The deck with an id, if there is one. */
export function findDeck(id: string): Deck | undefined {
    return DECKS.find(deck => deck.id === id)
}
