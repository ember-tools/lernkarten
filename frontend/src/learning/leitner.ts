/**
 * Spaced repetition after Leitner: five boxes, a card moves up one box when answered right and back
 * to the first when answered wrong. A card in box `n` is due again `INTERVALS[n]` days after its
 * answer; the first box is due the same day. Dates are local calendar days as `YYYY-MM-DD`.
 */

/** The days until a card in each box is due again. */
export const INTERVALS = [0, 1, 3, 7, 14] as const

/** The highest box. */
export const LAST_BOX = INTERVALS.length - 1

/** What is known about one card. */
export interface CardProgress {
    box: number
    due: string
    seen: number
    last: 'right' | 'wrong'
}

/** The local calendar day of a moment as `YYYY-MM-DD`. */
export function localDay(moment: Date): string {
    const pad = (value: number) => String(value).padStart(2, '0')
    return `${moment.getFullYear()}-${pad(moment.getMonth() + 1)}-${pad(moment.getDate())}`
}

/** A calendar day some days later, counted in whole days whatever the clock change. */
export function addDays(day: string, days: number): string {
    const [year, month, date] = day.split('-').map(Number)
    const moved = new Date(Date.UTC(year!, month! - 1, date! + days))
    return moved.toISOString().slice(0, 10)
}

/** The progress of a card after an answer on `today`; a card never seen counts as being in the first box. */
export function review(previous: CardProgress | undefined, right: boolean, today: string): CardProgress {
    const box = right ? Math.min((previous?.box ?? 0) + 1, LAST_BOX) : 0
    return {box, due: addDays(today, INTERVALS[box]!), seen: (previous?.seen ?? 0) + 1, last: right ? 'right' : 'wrong'}
}

/** Whether a card is due on `today`; a card never seen is always due. */
export function isDue(progress: CardProgress | undefined, today: string): boolean {
    return progress === undefined || progress.due <= today
}

/** A calendar day `YYYY-MM-DD` as Germans write it, `DD.MM.YYYY`, without passing through a time zone. */
export function germanDay(day: string): string {
    const [year, month, date] = day.split('-')
    return `${date}.${month}.${year}`
}
