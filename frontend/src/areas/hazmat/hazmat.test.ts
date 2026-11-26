import {DANGER_LABEL_PATTERNS} from '@emberbox/ui'
import {describe, expect, it} from 'vitest'
import {card} from '../../learning/model'
import {seededRandom} from '../../learning/random'
import {findDeck} from '../index'
import {GAMS_ITEMS, RULE_ITEMS, SCENARIO_ITEMS} from './content'
import {COMMON_SUBSTANCES, loadUnNumbers} from './data'
import {MAIN_LABELS} from './decks'
import {hazmatQuestion} from './exercises'
import {explainHazardNumber} from './explain'

describe('dangerous goods area', () => {
    it('explains a number from its meaning, its digits, the 0 and the X, and names special ones', () => {
        expect(explainHazardNumber('30')).toMatch(/^30: entzündbarer flüssiger Stoff.*3: Entzündbarkeit.*Die 0/)
        expect(explainHazardNumber('336')).toContain('3: Entzündbarkeit von flüssigen Stoffen (Dämpfen) und Gasen oder selbsterhitzungsfähiger flüssiger Stoff (verdoppelt: erhöht)')
        expect(explainHazardNumber('X88')).toContain('X: reagiert gefährlich mit Wasser')
        expect(explainHazardNumber('90')).toContain('besondere Bedeutung')
        expect(explainHazardNumber('225')).not.toContain('verdoppelt')
        for (const code of ['223', '225']) {
            expect(explainHazardNumber(code), code).toContain('22 am Anfang steht für ein tiefgekühlt verflüssigtes Gas.')
            expect(explainHazardNumber(code).replace(/^[^.]*\./, ''), code).not.toContain('erstickend')
        }
        expect(explainHazardNumber('225')).toContain('5: Oxidierende')
        expect(explainHazardNumber('223')).toContain('3: Entzündbarkeit')
    })

    it('names a label by its meaning alone, so the number on the drawing gives nothing away', () => {
        const question = hazmatQuestion(card('hazmat', 'label-3', 'label-class'), seededRandom(3))
        if (question.form !== 'choice') throw new Error('not a choice')
        for (const choice of question.choices) expect(choice.text).not.toMatch(/Muster|\d/)
    })

    it('says yes to the right plate and no to a wrong one', () => {
        const substance = COMMON_SUBSTANCES[0]!
        const answers = new Set<string>()
        for (let seed = 1; seed < 40; seed++) {
            const question = hazmatQuestion(card('hazmat', `substance-${substance.un}`, 'plate-fits'), seededRandom(seed))
            if (question.form !== 'choice') throw new Error('not a choice')
            const shown = JSON.stringify(question.visual).includes(`"${substance.hazard}"`)
            expect(question.answer, String(seed)).toBe(shown ? 0 : 1)
            answers.add(question.choices[question.answer]!.text!)
        }
        expect(answers).toEqual(new Set(['Ja', 'Nein']))
    })

    it('keeps every written answer out of its distractors and shows only plates of the list', async () => {
        const entries = await loadUnNumbers()
        for (const item of [...RULE_ITEMS, ...GAMS_ITEMS, ...SCENARIO_ITEMS]) {
            expect(item.distractors, item.id).not.toContain(item.answer)
            if (!item.plate) continue
            const listed = entries.find(entry => entry.un === item.plate!.unNumber)
            expect(listed?.hazard, item.id).toContain(item.plate.hazardNumber)
            for (const pattern of item.labels ?? []) expect(DANGER_LABEL_PATTERNS as readonly string[], item.id).toContain(pattern)
        }
    })

    it('offers basics, crew, leaders and everything, the basics on the hand list and the main labels only', () => {
        const basics = findDeck('gefahrgut-grundlagen')!
        expect(basics.level).toBe('basic')
        expect(basics.cards.filter(entry => entry.itemId.startsWith('label-')).map(entry => entry.itemId)).toEqual(MAIN_LABELS)
        expect(basics.cards.some(entry => entry.exercise === 'number-meaning' || entry.itemId.startsWith('scenario-'))).toBe(false)
        expect(findDeck('gefahrgut-einsatzabteilung')!.level).toBe('crew')
        expect(findDeck('gefahrgut-fuehrung')!.cards.some(entry => entry.itemId.startsWith('scenario-'))).toBe(true)
        expect(basics.cards.some(entry => entry.itemId === 'rule-x')).toBe(false)
        expect(basics.cards.some(entry => entry.itemId === 'gams-first')).toBe(true)
        const builds = findDeck('gefahrgut-fuehrung')!.cards.filter(entry => entry.exercise === 'number-build')
        expect(builds.length).toBeLessThan(50)
        expect(builds.map(entry => entry.itemId)).toEqual(expect.arrayContaining(['number-33', 'number-X423', 'number-90']))
        const all = findDeck('gefahrgut-alle')!
        for (const deck of ['gefahrgut-grundlagen', 'gefahrgut-einsatzabteilung', 'gefahrgut-fuehrung']) {
            for (const entry of findDeck(deck)!.cards) expect(all.cards.some(other => other.id === entry.id), entry.id).toBe(true)
        }
    })
})
