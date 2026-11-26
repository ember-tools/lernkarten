import {BASIC_FORMS, SIGN_ORGANISATIONS, SIGN_SIZES, SUPPLEMENTS} from '@emberbox/ui'
import {describe, expect, it} from 'vitest'
import {seededRandom} from '../../learning/random'
import {AREAS, DECKS, findDeck} from '../index'
import {SIGN_ITEMS, formName, organisationName, sizeName, supplementName} from './catalog'
import {SIGN_CHAPTERS} from './chapters'
import {composable, differences, kitOf} from './compose'
import {COMMON_VEHICLES} from './decks'
import {READING_ITEMS} from './reading'

describe('sign area', () => {
    it('asks every card of every deck as a sound question', () => {
        const random = seededRandom(11)
        for (const deck of DECKS) {
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

    it('offers the decks for every level, with the basics free of leader topics', () => {
        expect(new Set(DECKS.map(deck => deck.level))).toEqual(new Set(['basic', 'crew', 'lead']))
        const basics = findDeck('zeichen-grundlagen')!
        expect(basics.cards.some(card => card.itemId.startsWith('D.') || card.exercise === 'reading')).toBe(false)
        expect(basics.cards.some(card => card.itemId === '1.11')).toBe(true)
        for (const id of COMMON_VEHICLES) expect(basics.cards.some(card => card.itemId === id), id).toBe(true)
        expect(basics.cards.some(card => card.itemId === 'note-hazard')).toBe(true)
        expect(basics.cards.some(card => card.exercise === 'organisation')).toBe(false)
    })

    it('asks building blocks only of the example signs of annexes C and D', () => {
        const blocks = new Set(['size', 'organisation', 'ability', 'compose'])
        for (const deck of DECKS) {
            for (const card of deck.cards.filter(entry => blocks.has(entry.exercise))) expect(card.itemId, card.id).toMatch(/^[CD]\./)
        }
        expect(findDeck('zeichen-fuehrung')!.cards.some(card => card.exercise === 'organisation')).toBe(true)
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
