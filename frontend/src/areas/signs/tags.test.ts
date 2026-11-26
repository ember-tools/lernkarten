import {describe, expect, it} from 'vitest'
import {SIGNS_AREA} from './index'
import {COMMON_VEHICLES, EXCEPTIONS, SERVICES, STAGES, matches, tagsOf, type SignFilter, type SignTags} from './tags'

const everyItem = SIGNS_AREA.items

/** The tags of an item of the area by id. */
function tagsOfId(id: string): SignTags | undefined {
    const item = everyItem.find(entry => entry.id === id)
    return item && tagsOf(item)
}

/** Expected services and stage of one or two signs per section rule and per kind of exception. */
const EXPECTED: readonly [string, string, string][] = [
    ['1.1', 'all', 'youth'], ['1.14', 'all', 'crew'], ['2.6', 'all', 'youth'],
    ['3.1', 'all', 'youth'], ['3.4', 'all', 'crew'],
    ['4.1.1', 'fire thw', 'crew'], ['4.1.7', 'fire thw', 'lead'],
    ['4.2.1', 'medical', 'crew'],
    ['4.3.1', 'fire', 'youth'], ['4.3.4', 'fire', 'crew'],
    ['4.4.1', 'all', 'crew'],
    ['4.5.3', 'fire thw', 'crew'], ['4.5.8', 'fire thw other', 'crew'],
    ['4.6.1', 'medical all', 'youth'], ['4.6.3', 'medical', 'crew'],
    ['4.7.2', 'thw', 'crew'], ['4.7.14', 'thw fire', 'crew'],
    ['4.8.1', 'thw', 'lead'], ['4.8.13', 'thw medical', 'lead'],
    ['4.9.1', 'command', 'crew'], ['4.10.1', 'other', 'lead'],
    ['5.1.1-unprotected', 'all', 'crew'], ['5.1.1.1', 'all', 'youth'], ['5.1.2.1', 'all', 'youth'],
    ['5.1.3.1', 'all', 'crew'], ['5.2.1', 'command', 'crew'],
    ['5.3', 'command', 'crew'], ['5.6', 'command', 'lead'],
    ['5.4.1', 'all', 'youth'], ['5.5.1', 'all', 'lead'], ['5.7.1', 'command', 'lead'],
    ['5.8.1.1', 'all', 'crew'], ['5.8.1.9', 'all', 'youth'], ['5.8.1.13-before-sign', 'all', 'crew'],
    ['5.8.2.1', 'all', 'lead'], ['5.8.5.1', 'fire', 'crew'], ['5.8.7.1', 'all', 'lead'],
    ['5.8.8.1', 'all medical', 'crew'], ['5.8.8.7', 'all medical', 'youth'], ['5.8.9.1', 'all', 'crew'],
    ['6.1', 'command', 'lead'], ['6.2', 'command', 'lead'],
    ['C.1.2', 'fire', 'youth'], ['C.1.7', 'fire', 'crew'], ['C.2.8', 'fire', 'youth'], ['C.2.20', 'fire', 'crew'],
    ['D.1.1', 'command', 'lead'], ['D.1.8', 'command fire', 'lead'], ['D.1.9', 'command medical', 'lead'],
    ['D.3.3', 'command medical', 'lead'], ['D.3.14', 'command thw', 'lead'], ['D.4.2', 'command fire', 'lead'],
    ['D.4.4', 'command', 'lead'],
    ['G.1', 'fire', 'youth'], ['G.10', 'fire', 'youth'], ['group-squads', 'fire', 'youth'],
    ['strength-total', 'command', 'crew'], ['time-june', 'command', 'lead'], ['identification-group', 'command', 'lead'],
    ['note-hazard', 'all', 'youth'], ['note-military', 'all', 'crew'], ['note-strength', 'all command', 'crew'],
]

describe('sign tags', () => {
    it('gives every item of the area at least one service and a stage', () => {
        for (const item of everyItem) {
            const tags = tagsOf(item)
            expect(tags, item.id).toBeDefined()
            expect(tags!.services.length, item.id).toBeGreaterThan(0)
            expect(STAGES, item.id).toContain(tags!.stage)
        }
    })

    it('tags each section and each exception as intended', () => {
        for (const [id, services, stage] of EXPECTED) expect(tagsOfId(id), id).toEqual({services: services.split(' '), stage})
    })

    it('names only items of the area among the exceptions', () => {
        for (const id of Object.keys(EXCEPTIONS)) expect(everyItem.some(item => item.id === id), id).toBe(true)
    })

    it('uses every service and every stage', () => {
        const all = everyItem.map(item => tagsOf(item)!)
        for (const service of SERVICES) expect(all.some(tags => tags.services.includes(service)), service).toBe(true)
        for (const stage of STAGES) expect(all.some(tags => tags.stage === stage), stage).toBe(true)
    })

    it('lets each stage include the ones before it', () => {
        const count = (filter: SignFilter) => everyItem.filter(item => matches(tagsOf(item)!, filter)).length
        const services = [...SERVICES]
        expect(count({services, stage: 'youth'})).toBeLessThan(count({services, stage: 'crew'}))
        expect(count({services, stage: 'crew'})).toBeLessThan(count({services, stage: 'lead'}))
        expect(count({services, stage: 'lead'})).toBe(everyItem.length)
        for (const item of everyItem) {
            const stages = STAGES.map(stage => matches(tagsOf(item)!, {services, stage}))
            expect(stages.indexOf(true), item.id).toBeGreaterThanOrEqual(0)
            expect(stages.slice(stages.indexOf(true)).every(Boolean), item.id).toBe(true)
        }
    })

    it('always counts the signs of every organisation, whatever services are chosen', () => {
        const formation = everyItem.find(item => item.id === '1.1')!
        expect(matches(tagsOf(formation)!, {services: [], stage: 'youth'})).toBe(true)
        const veterinary = everyItem.find(item => item.id === '4.10.1')!
        expect(matches(tagsOf(veterinary)!, {services: ['fire'], stage: 'lead'})).toBe(false)
        expect(matches(tagsOf(veterinary)!, {services: ['other'], stage: 'lead'})).toBe(true)
    })

    it('keeps the basics of a fire service at the youth fire brigade', () => {
        const youthFire: SignFilter = {services: ['fire'], stage: 'youth'}
        for (const id of ['1.11', '2.1', '5.4.3', '4.3.1', '5.8.8.3', 'C.1.2', 'note-hazard', ...COMMON_VEHICLES]) {
            const item = everyItem.find(entry => entry.id === id)!
            expect(matches(tagsOf(item)!, youthFire), id).toBe(true)
        }
        for (const id of ['D.1.1', '5.7.1', '4.8.1', 'time-june', '4.1.6']) {
            const item = everyItem.find(entry => entry.id === id)!
            expect(matches(tagsOf(item)!, youthFire), id).toBe(false)
        }
    })

    it('adds the service of the organisation a leader of annex D belongs to', () => {
        expect(tagsOf(everyItem.find(item => item.id === 'D.3.8')!)!.services).toEqual(['command', 'thw'])
        expect(tagsOf(everyItem.find(item => item.id === 'D.3.12')!)!.services).toEqual(['command', 'medical'])
        expect(tagsOf(everyItem.find(item => item.id === '5.1.1-unprotected')!)!.stage).toBe('crew')
    })
})
