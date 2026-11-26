/**
 * The deck of the sign area, built from the learner's choice of services and stage, and the fixed
 * decks it replaced, kept as choices so their old addresses still lead somewhere.
 */

import {t} from '../../i18n'
import {card, type Card, type Deck, type Level} from '../../learning/model'
import {SIGN_ITEMS, type SignItem} from './catalog'
import {exercisesFor, type SignExercise} from './exercises'
import {CHOSEN_SERVICES, EVERYTHING, filterItems, isEverything} from './filter'
import {NOTE_ITEMS} from './notes'
import {READING_ITEMS} from './reading'
import {tagsOf, type Service, type SignFilter, type Stage} from './tags'

/** The id and address of the sign deck. */
export const SIGN_DECK_ID = 'zeichen'

/** The level of the learning model each stage of training stands for. */
const STAGE_LEVEL: Readonly<Record<Stage, Level>> = {youth: 'basic', crew: 'crew', lead: 'lead'}

/**
 * The exercises asked of a sign from each stage on: meaning and picture from the start, the building
 * blocks of the example units for the crew, the organisation of a command sign for leaders.
 */
const STAGE_EXERCISES: Readonly<Record<Stage, readonly SignExercise[]>> = {
    youth: ['meaning', 'picture'],
    crew: ['meaning', 'picture', 'size', 'ability', 'compose'],
    lead: ['meaning', 'picture', 'size', 'ability', 'compose', 'organisation'],
}

/** The fixed decks of earlier versions and the choice each one stands for now. */
export const FORMER_SIGN_DECKS: Readonly<Record<string, SignFilter>> = {
    'zeichen-grundlagen': {services: ['fire'], stage: 'youth'},
    'zeichen-einsatzabteilung': {services: ['fire'], stage: 'crew'},
    'zeichen-fuehrung': {services: ['fire', 'command'], stage: 'lead'},
    'zeichen-alle': EVERYTHING,
}

/** The cards of some signs in those of the given exercises each sign can be asked in. */
function cardsOf(items: readonly SignItem[], exercises: readonly SignExercise[]): Card[] {
    return items.flatMap(item => exercisesFor(item).filter(exercise => exercises.includes(exercise)).map(exercise => card('signs', item.id, exercise)))
}

const ITEMS_BY_ID = new Map([...SIGN_ITEMS, ...READING_ITEMS, ...NOTE_ITEMS].map(item => [item.id, item]))

/** The deck of one service at a stage, holding only what belongs to that service, not what every organisation shares. */
export function serviceDeck(service: Service, stage: Stage): Deck {
    const deck = signDeck({services: [service], stage})
    const own = (itemId: string) => {
        const item = ITEMS_BY_ID.get(itemId)
        return item !== undefined && (tagsOf(item)?.services.includes(service) ?? false)
    }
    return {...deck, cards: deck.cards.filter(entry => own(entry.itemId))}
}

/** A short name of a choice, such as "Feuerwehr, THW · Einsatzabteilung". */
export function filterName(filter: SignFilter): string {
    if (isEverything(filter)) return t('signs.deck.everything')
    const services = CHOSEN_SERVICES.filter(service => filter.services.includes(service)).map(service => t(`filter.service.${service}`))
    return t('signs.deck.choice', {services: services.length ? services.join(', ') : t('signs.deck.common'), stage: t(`filter.stageName.${filter.stage}`)})
}

/** The sign deck of a choice: the signs it keeps in the exercises of its stage, with the worked examples and notes it keeps. */
export function signDeck(filter: SignFilter): Deck {
    return {
        id: SIGN_DECK_ID, area: 'signs', level: STAGE_LEVEL[filter.stage], everything: isEverything(filter),
        name: t('signs.deck.name', {choice: filterName(filter)}),
        description: t('signs.deck.description'),
        cards: [
            ...cardsOf(filterItems(SIGN_ITEMS, filter), STAGE_EXERCISES[filter.stage]),
            ...filterItems(READING_ITEMS, filter).map(item => card('signs', item.id, 'reading')),
            ...filterItems(NOTE_ITEMS, filter).map(item => card('signs', item.id, 'note')),
        ],
    }
}
