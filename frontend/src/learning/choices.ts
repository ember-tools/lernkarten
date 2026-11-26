import type {Choice, Question} from './model'
import {shuffled} from './random'

/** What a choice question is made of before its choices are shuffled. */
export interface ChoiceDraft {
    cardId: string
    prompt: string
    visual?: Question['visual']
    correct: Choice
    distractors: readonly Choice[]
    explanation: string
}

/** How many choices a question offers at most: the right one and three others. */
export const CHOICE_COUNT = 4

/**
 * A choice question with the right choice among up to three distractors, all in random order.
 * Distractors that read like the right choice or like another distractor are left out, so no
 * question has two right answers or offers a wrong one twice.
 */
export function choiceQuestion(draft: ChoiceDraft, random: () => number): Question {
    const others = shuffled(distinct(draft.correct, draft.distractors), random).slice(0, CHOICE_COUNT - 1)
    const choices = shuffled([draft.correct, ...others], random)
    return {
        form: 'choice', cardId: draft.cardId, prompt: draft.prompt, visual: draft.visual, choices,
        answer: choices.indexOf(draft.correct), explanation: draft.explanation,
    }
}

/** The distractors whose text differs from the right choice and from every earlier distractor. */
function distinct(correct: Choice, distractors: readonly Choice[]): Choice[] {
    const seen = new Set(correct.text === undefined ? [] : [correct.text])
    return distractors.filter(choice => {
        if (choice.text === undefined) return true
        if (seen.has(choice.text)) return false
        seen.add(choice.text)
        return true
    })
}

/** Up to `count` other items of a pool to draw distractors from, preferring those `near` the right one. */
export function distractorItems<T>(right: T, pool: readonly T[], count: number, random: () => number, near?: (item: T) => boolean): T[] {
    const others = pool.filter(item => item !== right)
    const close = shuffled(others.filter(item => near?.(item) ?? false), random)
    const rest = shuffled(others.filter(item => !(near?.(item) ?? false)), random)
    return [...close, ...rest].slice(0, count)
}
