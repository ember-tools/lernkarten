import {describe, expect, it} from 'vitest'
import {SIGN_ITEMS} from './catalog'
import {CHOSEN_SERVICES, EVERYTHING, filterItems, filterQuery, isEverything, parseFilter, parseFilterQuery, resolveFilter, serializeFilter} from './filter'

describe('sign filter', () => {
    it('writes a choice as readable words and reads it back', () => {
        const filter = {services: ['fire', 'medical'] as const, stage: 'crew' as const}
        expect(filterQuery(filter)).toEqual({fachdienst: 'feuerwehr,sanitaet', stufe: 'einsatzabteilung'})
        expect(parseFilterQuery('feuerwehr,sanitaet', 'einsatzabteilung')).toEqual({services: ['fire', 'medical'], stage: 'crew'})
        expect(parseFilter(serializeFilter(filter))).toEqual({services: ['fire', 'medical'], stage: 'crew'})
    })

    it('drops unknown services and refuses an unknown stage or broken text', () => {
        expect(parseFilterQuery('feuerwehr,polizei', 'fuehrung')).toEqual({services: ['fire'], stage: 'lead'})
        expect(parseFilterQuery('', 'jugendfeuerwehr')).toEqual({services: [], stage: 'youth'})
        expect(parseFilterQuery('feuerwehr', 'chef')).toBeUndefined()
        expect(parseFilterQuery(undefined, undefined)).toBeUndefined()
        expect(parseFilter('{')).toBeUndefined()
        expect(parseFilter(null)).toBeUndefined()
    })

    it('reads hand-written addresses: a missing part counts fully, repeated services count each', () => {
        expect(parseFilterQuery(undefined, 'einsatzabteilung')).toEqual({services: CHOSEN_SERVICES, stage: 'crew'})
        expect(parseFilterQuery('thw', undefined)).toEqual({services: ['thw'], stage: 'lead'})
        expect(parseFilterQuery(['feuerwehr', 'thw'], ['jugendfeuerwehr'])).toEqual({services: ['fire', 'thw'], stage: 'youth'})
    })

    it('takes the address first and stores it, else the stored choice, else the one of this visit, else everything', () => {
        const fire = {services: ['fire'] as const, stage: 'youth' as const}
        const thw = {services: ['thw'] as const, stage: 'crew' as const}
        expect(resolveFilter(fire, thw, thw)).toEqual({filter: fire, store: true, address: undefined})
        expect(resolveFilter(undefined, thw, fire)).toEqual({filter: thw, store: false, address: {fachdienst: 'thw', stufe: 'einsatzabteilung'}})
        expect(resolveFilter(undefined, undefined, fire)).toEqual({filter: fire, store: false, address: {fachdienst: 'feuerwehr', stufe: 'jugendfeuerwehr'}})
        expect(resolveFilter(undefined, undefined, undefined)).toEqual({filter: EVERYTHING, store: false, address: undefined})
        expect(resolveFilter(undefined, EVERYTHING, undefined).address).toBeUndefined()
    })

    it('leaves nothing out by default and narrows with a choice', () => {
        expect(isEverything(EVERYTHING)).toBe(true)
        expect(filterItems(SIGN_ITEMS, EVERYTHING)).toHaveLength(SIGN_ITEMS.length)
        const youthFire = filterItems(SIGN_ITEMS, {services: ['fire'], stage: 'youth'})
        expect(isEverything({services: ['fire'], stage: 'lead'})).toBe(false)
        expect(youthFire.length).toBeLessThan(SIGN_ITEMS.length / 2)
        expect(youthFire.map(item => item.id)).toEqual(expect.arrayContaining(['1.1', 'G.1', 'G.5', 'G.7', 'C.2.8']))
        expect(youthFire.some(item => item.chapter === 'D')).toBe(false)
    })
})
