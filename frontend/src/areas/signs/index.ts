import type {Area} from '../../learning/model'
import {SIGN_ITEMS} from './catalog'
import {signsQuestion} from './exercises'
import {NOTE_ITEMS} from './notes'
import {READING_ITEMS} from './reading'

/** The area of tactical signs. */
export const SIGNS_AREA: Area = {
    id: 'signs',
    name: 'Taktische Zeichen',
    items: [...SIGN_ITEMS, ...READING_ITEMS, ...NOTE_ITEMS],
    question: signsQuestion,
}

export {FORMER_SIGN_DECKS, SIGN_DECK_ID, filterName, serviceDeck, signDeck} from './decks'
