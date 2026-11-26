import {describe, expect, it} from 'vitest'
import {choiceQuestion, distractorItems} from './choices'
import {INTERVALS, addDays, germanDay, isDue, localDay, review, type CardProgress} from './leitner'
import {card, type Deck} from './model'
import {
    DEFAULT_SETTINGS, exportProgress, importProgress, parseProgress, parseSettings, serializeProgress, serializeSettings, withoutCards,
} from './progress'
import {seededRandom, shuffled} from './random'
import {afterAnswer, deckStanding, dueCards, quizCards} from './session'

const DECK: Deck = {
    id: 'test', area: 'signs', name: 'Test', description: '', level: 'basic',
    cards: ['a', 'b', 'c', 'd', 'e'].map(item => card('signs', item, 'meaning')),
}

describe('Leitner boxes', () => {
    it('moves a card up one box when right and back to the first when wrong', () => {
        let progress: CardProgress | undefined
        const boxes: number[] = []
        for (const right of [true, true, true, true, true, true, false]) {
            progress = review(progress, right, '2026-11-26')
            boxes.push(progress.box)
        }
        expect(boxes).toEqual([1, 2, 3, 4, 4, 4, 0])
        expect(progress!.seen).toBe(7)
        expect(progress!.last).toBe('wrong')
    })

    it('makes a card due again after the interval of its box', () => {
        expect(INTERVALS).toEqual([0, 1, 3, 7, 14])
        expect(review(undefined, true, '2026-11-26').due).toBe('2026-11-27')
        expect(review(undefined, false, '2026-11-26')).toMatchObject({box: 0, due: '2026-11-26'})
        expect(review({box: 0, due: '2026-11-26', seen: 1, last: 'right'}, true, '2026-11-26').due).toBe('2026-11-27')
        expect(review({box: 3, due: '2026-11-26', seen: 4, last: 'right'}, true, '2026-11-26').due).toBe('2026-12-10')
        expect(review({box: 3, due: '2026-11-26', seen: 4, last: 'right'}, false, '2026-11-26').due).toBe('2026-11-26')
    })

    it('counts whole calendar days across month, year and clock changes', () => {
        expect(addDays('2026-12-25', 14)).toBe('2027-01-08')
        expect(addDays('2027-03-27', 1)).toBe('2027-03-28')
        expect(addDays('2027-10-30', 1)).toBe('2027-10-31')
        expect(localDay(new Date(2027, 2, 28, 23, 30))).toBe('2027-03-28')
        expect(germanDay('2026-11-26')).toBe('26.11.2026')
    })

    it('treats an unseen card as due', () => {
        expect(isDue(undefined, '2026-11-26')).toBe(true)
        expect(isDue({box: 1, due: '2026-11-27', seen: 1, last: 'right'}, '2026-11-26')).toBe(false)
        expect(isDue({box: 1, due: '2026-11-27', seen: 1, last: 'right'}, '2026-11-27')).toBe(true)
    })
})

describe('sessions', () => {
    const progress = {
        [DECK.cards[0]!.id]: {box: 2, due: '2026-11-20', seen: 3, last: 'right'},
        [DECK.cards[1]!.id]: {box: 0, due: '2026-11-25', seen: 1, last: 'wrong'},
        [DECK.cards[2]!.id]: {box: 1, due: '2026-12-01', seen: 2, last: 'right'},
    } as const

    it('asks due cards lowest box first, then new cards, at most the session size', () => {
        const cards = dueCards(DECK, progress, '2026-11-26', seededRandom(1))
        expect(cards.slice(0, 2).map(entry => entry.itemId)).toEqual(['b', 'a'])
        expect(new Set(cards.slice(2).map(entry => entry.itemId))).toEqual(new Set(['d', 'e']))
        expect(dueCards(DECK, progress, '2026-11-26', seededRandom(1), 3)).toHaveLength(3)
    })

    it('brings a wrong answer back at the end of the session', () => {
        const queue = DECK.cards.slice(0, 3)
        expect(afterAnswer(queue, false).map(entry => entry.itemId)).toEqual(['b', 'c', 'a'])
        expect(afterAnswer(queue, true).map(entry => entry.itemId)).toEqual(['b', 'c'])
        expect(afterAnswer([], true)).toEqual([])
    })

    it('draws a quiz of the asked length without repeats, or the whole deck', () => {
        const quiz = quizCards(DECK, 3, seededRandom(2))
        expect(new Set(quiz.map(entry => entry.id)).size).toBe(3)
        expect(quizCards(DECK, 10, seededRandom(2))).toHaveLength(5)
    })

    it('reports cards per box, new and due', () => {
        expect(deckStanding(DECK, progress, '2026-11-26')).toEqual({boxes: [1, 1, 1, 0, 0], fresh: 2, due: 2, total: 5})
    })
})

describe('choices', () => {
    it('puts the right choice among three distractors and records where it went', () => {
        const question = choiceQuestion({
            cardId: 'x', prompt: 'Was?', correct: {text: 'richtig'},
            distractors: [{text: 'a'}, {text: 'b'}, {text: 'c'}, {text: 'd'}, {text: 'richtig'}], explanation: '',
        }, seededRandom(3))
        if (question.form !== 'choice') throw new Error('not a choice')
        expect(question.choices).toHaveLength(4)
        expect(question.choices[question.answer]!.text).toBe('richtig')
        expect(question.choices.filter(choice => choice.text === 'richtig')).toHaveLength(1)
    })

    it('offers no wrong answer twice', () => {
        const question = choiceQuestion({
            cardId: 'x', prompt: 'Was?', correct: {text: 'r'}, distractors: [{text: 'a'}, {text: 'a'}, {text: 'b'}, {text: 'c'}], explanation: '',
        }, seededRandom(7))
        if (question.form !== 'choice') throw new Error('not a choice')
        expect(new Set(question.choices.map(choice => choice.text)).size).toBe(question.choices.length)
        expect(question.choices).toHaveLength(4)
    })

    it('prefers distractors near the right item', () => {
        const pool = ['1.1', '1.2', '2.1', '2.2', '2.3', '3.1']
        const picked = distractorItems('2.1', pool, 2, seededRandom(4), item => item.startsWith('2.'))
        expect(new Set(picked)).toEqual(new Set(['2.2', '2.3']))
    })

    it('shuffles reproducibly with a seed and keeps every item', () => {
        expect(shuffled([1, 2, 3, 4], seededRandom(5))).toEqual(shuffled([1, 2, 3, 4], seededRandom(5)))
        expect([...shuffled([1, 2, 3, 4], seededRandom(6))].sort()).toEqual([1, 2, 3, 4])
    })
})

describe('progress in the browser', () => {
    const entry: CardProgress = {box: 2, due: '2026-11-28', seen: 3, last: 'right'}

    it('stores and reads back the progress and the settings', () => {
        expect(parseProgress(serializeProgress({x: entry}))).toEqual({x: entry})
        expect(parseSettings(null)).toEqual(DEFAULT_SETTINGS)
        expect(parseSettings(serializeSettings({quizLength: 20}))).toEqual({quizLength: 20})
        expect(parseSettings(JSON.stringify({quizLength: 15}))).toEqual(DEFAULT_SETTINGS)
    })

    it('reads nothing from a missing, broken or foreign value', () => {
        expect(parseProgress(null)).toEqual({})
        expect(parseProgress('{not json')).toEqual({})
        expect(parseProgress(JSON.stringify({version: 2, cards: {x: entry}}))).toEqual({})
        expect(parseProgress(JSON.stringify({version: 1, cards: {x: {...entry, box: 9}}}))).toEqual({})
        expect(parseProgress(JSON.stringify({version: 1, cards: []}))).toEqual({})
    })

    it('exports to a file and imports only a valid one', () => {
        const text = exportProgress({x: entry}, new Date('2026-11-26T12:00:00Z'))
        expect(importProgress(text)).toEqual({x: entry})
        expect(importProgress('[]')).toBeUndefined()
        expect(importProgress(JSON.stringify({format: 'other', version: 1, cards: {}}))).toBeUndefined()
        expect(importProgress(JSON.stringify({format: 'lernkarten-progress', version: 1, cards: {x: {...entry, due: 'tomorrow'}}}))).toBeUndefined()
        expect(importProgress(JSON.stringify({format: 'lernkarten-progress', version: 1, cards: {x: {...entry, extra: 1}}}))).toEqual({x: entry})
        const odd = importProgress(`{"format": "lernkarten-progress", "version": 1, "cards": {"__proto__": ${JSON.stringify(entry)}}}`)
        expect(Object.keys(odd!)).toEqual(['__proto__'])
    })

    it('starts a deck over by dropping its cards', () => {
        expect(withoutCards({a: entry, b: entry}, ['a'])).toEqual({b: entry})
    })
})
