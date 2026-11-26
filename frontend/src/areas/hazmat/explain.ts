import {t} from '../../i18n'
import {HAZARD_DIGITS, SPECIAL_HAZARD_NUMBERS, WATER_NOTE, hazardMeaning} from './data'

/** The special pairs that begin longer numbers, with what they stand for there; only 22 does in the ADR table. */
const LEADING_PAIRS: Readonly<Record<string, string>> = {'22': 'hazmat.explain.leading22'}

/**
 * A hazard number explained for a learner: its meaning after the ADR, then how it is built. A
 * special combination is named as such, since its digits do not add up to its meaning; a number
 * that starts with the special pair 22 (223, 225) names it as a refrigerated liquefied gas and
 * explains only the rest.
 * Otherwise each digit is named once, a doubled one as increased, and a leading X with the rule on water.
 */
export function explainHazardNumber(code: string): string {
    const meaning = hazardMeaning(code)
    const digits = code.replace(/^X/, '')
    const parts = [meaning ? `${code}: ${meaning}.` : code]
    if (SPECIAL_HAZARD_NUMBERS.includes(digits)) {
        parts.push(t('hazmat.explain.special', {code: digits}))
    } else {
        const prefix = digits.length === 3 && LEADING_PAIRS[digits.slice(0, 2)] ? digits.slice(0, 2) : ''
        if (prefix) parts.push(t(LEADING_PAIRS[prefix]!))
        const rest = digits.slice(prefix.length)
        const seen = [...new Set(rest.split('').filter(digit => digit !== '0'))]
        const doubled = (digit: string) => rest.split(digit).length > 2 ? t('hazmat.explain.doubled') : ''
        parts.push(`${seen.map(digit => `${digit}: ${HAZARD_DIGITS[digit]}${doubled(digit)}`).join('; ')}.`)
        if (rest.endsWith('0')) parts.push(t('hazmat.explain.zero'))
    }
    if (code.startsWith('X')) parts.push(t('hazmat.explain.water', {note: WATER_NOTE}))
    return parts.join(' ')
}
