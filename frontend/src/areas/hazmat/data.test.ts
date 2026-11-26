import {HAZARD_NUMBER, UN_NUMBER} from '@emberbox/ui'
import {describe, expect, it} from 'vitest'
import META from '../../data/hazmat/meta.json'
import {COMMON_SUBSTANCES, HAZARD_DIGITS, HAZARD_NUMBERS, SPECIAL_HAZARD_NUMBERS, hazardMeaning, loadUnNumbers, plateHazard} from './data'

describe('hazard identification numbers', () => {
    it('lists every number of 5.3.2.3.2 once, each in the form the plate accepts', () => {
        expect(HAZARD_NUMBERS).toHaveLength(97)
        expect(new Set(HAZARD_NUMBERS.map(entry => entry.code)).size).toBe(97)
        for (const entry of HAZARD_NUMBERS) {
            expect(entry.code, entry.code).toMatch(HAZARD_NUMBER)
            expect(entry.meaning.length, entry.code).toBeGreaterThan(5)
            expect(entry.meaning, entry.code).not.toMatch(/ss(?=lich)|\d\)$/)
        }
    })

    it('explains the digits 2 to 9 and lists every special combination among the numbers', () => {
        expect(Object.keys(HAZARD_DIGITS)).toEqual(['2', '3', '4', '5', '6', '7', '8', '9'])
        for (const code of SPECIAL_HAZARD_NUMBERS) expect(hazardMeaning(code), code).toBeDefined()
        expect(hazardMeaning('90')).toBe('umweltgefährdender Stoff; verschiedene gefährliche Stoffe')
    })
})

describe('list of UN numbers', () => {
    it('names its source, licence and authors and has every entry in a sound form', async () => {
        expect(META.licence).toContain('freie Dokumentation')
        expect(META.authors).toContain('action=history')
        const entries = await loadUnNumbers()
        expect(entries).toHaveLength(META.entries)
        for (const entry of entries) {
            expect(entry.un, entry.name).toMatch(UN_NUMBER)
            for (const code of entry.hazard) expect(code, entry.un).toMatch(/^X?\d{2,3}$/)
            if (entry.uncertain) expect(entry.hazard, entry.un).toEqual([])
        }
    })

    it('asks only entries with exactly one hazard number the ADR table knows as a plate', async () => {
        const entries = await loadUnNumbers()
        const unknown = entries.filter(entry => entry.hazard.some(code => !hazardMeaning(code)))
        expect(unknown.map(entry => entry.un).sort()).toEqual(['1305', '1408', '2978'])
        expect(plateHazard(entries.find(entry => entry.un === '1203')!)).toBe('33')
        expect(plateHazard(entries.find(entry => entry.un === '1170')!)).toBeUndefined()
        for (const entry of unknown) expect(plateHazard(entry)).toBeUndefined()
        expect(entries.filter(entry => plateHazard(entry) !== undefined).length).toBeGreaterThan(1500)
    })

    it('has an ADR class for every entry but those the import listed, and read every hazard field', async () => {
        const classes = ['1', '2', '3', '4.1', '4.2', '4.3', '5.1', '5.2', '6.1', '6.2', '7', '8', '9']
        const entries = await loadUnNumbers()
        for (const entry of entries) expect(['', ...classes], entry.un).toContain(entry.class)
        expect(entries.filter(entry => entry.class === '').map(entry => entry.un)).toEqual(META.missingClass)
        expect(META.unreadHazard).toEqual({})
    })

    it('gives class 1 no hazard number, as its plate carries the classification code', async () => {
        const entries = await loadUnNumbers()
        expect(entries.filter(entry => entry.class === '1').every(entry => entry.hazard.length === 0)).toBe(true)
    })
})

describe('common substances', () => {
    it('agree with the list of UN numbers and with the ADR table', async () => {
        const entries = await loadUnNumbers()
        expect(new Set(COMMON_SUBSTANCES.map(substance => substance.un)).size).toBe(COMMON_SUBSTANCES.length)
        for (const substance of COMMON_SUBSTANCES) {
            const listed = entries.filter(entry => entry.un === substance.un)
            expect(listed.length, substance.un).toBeGreaterThan(0)
            expect(listed.some(entry => entry.hazard.includes(substance.hazard)), substance.un).toBe(true)
            expect(hazardMeaning(substance.hazard), substance.un).toBeDefined()
        }
        expect(COMMON_SUBSTANCES.filter(substance => substance.level === 'basic').length).toBeGreaterThanOrEqual(6)
        for (const substance of COMMON_SUBSTANCES) expect(['basic', 'crew', 'lead'], substance.un).toContain(substance.level)
    })
})
