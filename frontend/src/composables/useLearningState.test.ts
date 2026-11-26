import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'

/** A fresh copy of the composable, since its state is shared by everything that imports it. */
async function fresh() {
    vi.resetModules()
    const {useLearningState} = await import('./useLearningState')
    return useLearningState()
}

const ENTRY = {box: 2, due: '2026-11-28', seen: 3, last: 'right'}

describe('learning state in the browser', () => {
    beforeEach(() => localStorage.clear())
    afterEach(() => vi.restoreAllMocks())

    it('reads the stored progress and settings once, on the first load', async () => {
        localStorage.setItem('lernkarten.progress.v1', JSON.stringify({version: 1, cards: {x: ENTRY}}))
        localStorage.setItem('lernkarten.settings.v1', JSON.stringify({quizLength: 20}))
        const state = await fresh()
        expect(state.progress.value).toEqual({})
        state.load()
        expect(state.progress.value).toEqual({x: ENTRY})
        expect(state.settings.value.quizLength).toBe(20)
        localStorage.setItem('lernkarten.progress.v1', JSON.stringify({version: 1, cards: {}}))
        state.load()
        expect(state.progress.value).toEqual({x: ENTRY})
    })

    it('writes every answer, reset and replacement through at once', async () => {
        const state = await fresh()
        state.load()
        state.answer('a', true)
        expect(JSON.parse(localStorage.getItem('lernkarten.progress.v1')!).cards.a).toMatchObject({box: 1, seen: 1, last: 'right'})
        state.replace({b: ENTRY as never})
        expect(Object.keys(JSON.parse(localStorage.getItem('lernkarten.progress.v1')!).cards)).toEqual(['b'])
        state.reset(['b'])
        expect(JSON.parse(localStorage.getItem('lernkarten.progress.v1')!).cards).toEqual({})
        state.setQuizLength(20)
        expect(JSON.parse(localStorage.getItem('lernkarten.settings.v1')!)).toEqual({quizLength: 20})
    })

    it('keeps answers another tab stored meanwhile', async () => {
        const state = await fresh()
        state.load()
        localStorage.setItem('lernkarten.progress.v1', JSON.stringify({version: 1, cards: {other: ENTRY}}))
        state.answer('mine', false)
        expect(Object.keys(state.progress.value).sort()).toEqual(['mine', 'other'])
    })

    it('follows changes another tab announces', async () => {
        const state = await fresh()
        state.load()
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'lernkarten.progress.v1', newValue: JSON.stringify({version: 1, cards: {x: ENTRY}}),
        }))
        expect(state.progress.value).toEqual({x: ENTRY})
    })

    it('keeps every answer of the visit when the browser reads but refuses to write', async () => {
        const state = await fresh()
        state.load()
        vi.spyOn(localStorage, 'setItem').mockImplementation(() => { throw new Error('quota') })
        state.answer('a', true)
        state.answer('b', true)
        expect(state.stored.value).toBe(false)
        expect(Object.keys(state.progress.value).sort()).toEqual(['a', 'b'])
    })

    it('reports a refusing storage on load and on write without failing', async () => {
        vi.spyOn(localStorage, 'getItem').mockImplementation(() => { throw new Error('denied') })
        vi.spyOn(localStorage, 'setItem').mockImplementation(() => { throw new Error('denied') })
        const state = await fresh()
        state.load()
        expect(state.stored.value).toBe(false)
        expect(state.progress.value).toEqual({})
        state.answer('a', true)
        expect(state.stored.value).toBe(false)
        expect(state.progress.value.a).toMatchObject({box: 1})
    })
})
