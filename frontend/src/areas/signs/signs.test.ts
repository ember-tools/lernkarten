import {BASIC_FORMS, SIGN_ORGANISATIONS, SIGN_SIZES, SUPPLEMENTS} from '@emberbox/ui'
import {describe, expect, it} from 'vitest'
import {seededRandom} from '../../learning/random'
import {AREAS, DECKS} from '../index'
import {SIGN_ITEMS, formName, organisationName, sizeName, supplementName} from './catalog'
import {SIGN_CHAPTERS} from './chapters'
import {composable, differences, kitOf} from './compose'
import {COMMON_VEHICLES} from './tags'
import {FORMER_SIGN_DECKS, filterName, serviceDeck, signDeck} from './decks'
import {EVERYTHING} from './filter'
import {READING_ITEMS} from './reading'

describe('sign area', () => {
    it('asks every card of every deck as a sound question', () => {
        const random = seededRandom(11)
        const signDecks = [EVERYTHING, ...Object.values(FORMER_SIGN_DECKS), {services: [], stage: 'youth'} as const].map(signDeck)
        for (const deck of [...signDecks, ...DECKS]) {
            expect(deck.cards.length, deck.id).toBeGreaterThan(0)
            expect(new Set(deck.cards.map(card => card.id)).size, deck.id).toBe(deck.cards.length)
            for (const card of deck.cards) {
                const question = AREAS[card.area]!.question(card, random)
                expect(question.cardId).toBe(card.id)
                if (question.form !== 'choice') continue
                expect(question.choices.length, card.id).toBeGreaterThanOrEqual(2)
                expect(question.answer, card.id).toBeGreaterThanOrEqual(0)
                const texts = question.choices.map(choice => choice.text).filter(Boolean)
                expect(new Set(texts).size, card.id).toBe(texts.length)
                const drawings = question.choices.filter(choice => choice.drawing).map(choice => JSON.stringify(choice.drawing))
                expect(new Set(drawings).size, card.id).toBe(drawings.length)
            }
        }
    })

    it('keeps the basics of the fire service free of leader topics', () => {
        const basics = signDeck({services: ['fire'], stage: 'youth'})
        expect(basics.level).toBe('basic')
        expect(basics.cards.some(card => card.itemId.startsWith('D.') || card.exercise === 'reading')).toBe(false)
        for (const id of ['1.11', 'G.1', 'G.7', 'note-hazard', ...COMMON_VEHICLES]) expect(basics.cards.some(card => card.itemId === id), id).toBe(true)
        expect(basics.cards.some(card => card.exercise !== 'meaning' && card.exercise !== 'picture' && card.exercise !== 'note')).toBe(false)
    })

    it('asks building blocks only of the example signs of annexes C and D, the organisation only of leaders', () => {
        const blocks = new Set(['size', 'organisation', 'ability', 'compose'])
        const everything = signDeck(EVERYTHING)
        for (const card of everything.cards.filter(entry => blocks.has(entry.exercise))) expect(card.itemId, card.id).toMatch(/^[CD]\./)
        expect(everything.cards.some(card => card.exercise === 'organisation')).toBe(true)
        expect(signDeck({services: ['command'], stage: 'crew'}).cards.some(card => card.exercise === 'organisation')).toBe(false)
    })

    it('keeps the progress of the former decks, since cards are named by sign and exercise', () => {
        const youth = signDeck(FORMER_SIGN_DECKS['zeichen-grundlagen']!)
        for (const id of ['signs:meaning:1.11', 'signs:picture:5.4.3', 'signs:meaning:C.2.8', 'signs:note:note-hazard']) {
            expect(youth.cards.some(card => card.id === id), id).toBe(true)
        }
        const crew = signDeck(FORMER_SIGN_DECKS['zeichen-einsatzabteilung']!)
        for (const id of ['signs:compose:C.1.2', 'signs:size:C.1.7', 'signs:picture:4.3.1', 'signs:meaning:5.8.8.1']) {
            expect(crew.cards.some(card => card.id === id), id).toBe(true)
        }
        expect(signDeck(EVERYTHING).everything).toBe(true)
    })

    it('names a choice by its services and stage', () => {
        expect(filterName(EVERYTHING)).toBe('alle Zeichen')
        expect(filterName({services: ['thw', 'fire'], stage: 'crew'})).toBe('Feuerwehr, THW · Einsatzabteilung')
        expect(filterName({services: [], stage: 'youth'})).toBe('für alle Organisationen · Jugendfeuerwehr')
    })

    it('counts for a service only what it adds to the signs of every organisation', () => {
        const fire = serviceDeck('fire', 'youth')
        expect(fire.cards.some(card => card.itemId === 'G.1')).toBe(true)
        expect(fire.cards.some(card => card.itemId === '1.1')).toBe(false)
        expect(fire.cards.length).toBeLessThan(signDeck({services: ['fire'], stage: 'youth'}).cards.length)
    })

    it('names every building block as the recommendations print it', () => {
        for (const form of BASIC_FORMS) expect(formName(form)).not.toBe(form)
        for (const organisation of SIGN_ORGANISATIONS) expect(organisationName(organisation)).not.toBe(organisation)
        for (const size of SIGN_SIZES) expect(sizeName(size)).not.toBe(size)
        for (const supplement of SUPPLEMENTS) expect(supplementName(supplement)).not.toBe(supplement)
    })

    it('puts the right sign together without differences and finds each wrong block', () => {
        const kit = SIGN_ITEMS.flatMap(item => 'sign' in item.entry.drawing && composable(item.entry.drawing.sign) ? [item.entry.drawing.sign] : [])
        expect(kit.length).toBeGreaterThan(10)
        for (const spec of kit) expect(differences(spec, kitOf(spec))).toEqual([])
        const target = {form: 'formation', organisation: 'fire', size: 'group', supplements: ['command'], abilities: ['firefighting', 'medical']} as const
        expect(differences(target, {...kitOf(target), abilities: ['medical', 'firefighting']})).toEqual([])
        expect(differences(target, {...kitOf(target), form: 'land-vehicle', supplements: [], abilities: ['medical'], organisation: 'thw', size: undefined}))
            .toEqual(['form', 'organisation', 'size', 'supplements', 'abilities'])
    })

    it('keeps the answer of every worked example out of its distractors', () => {
        for (const item of READING_ITEMS) expect(item.distractors, item.id).not.toContain(item.answer)
    })

    it('has a reference page for every chapter with signs', () => {
        const chapters = new Set(SIGN_ITEMS.map(item => item.chapter))
        expect(new Set(SIGN_CHAPTERS.map(chapter => chapter.chapter))).toEqual(chapters)
    })
})
