import type {Area} from '../../learning/model'
import {hazmatQuestion} from './exercises'
import {HAZMAT_ITEMS} from './items'

/** The area of dangerous goods. */
export const HAZMAT_AREA: Area = {
    id: 'hazmat',
    name: 'Gefahrgut',
    items: HAZMAT_ITEMS,
    question: hazmatQuestion,
}

export {HAZMAT_DECKS} from './decks'
