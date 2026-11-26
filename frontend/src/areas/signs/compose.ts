/**
 * The construction kit: which signs can be put together from building blocks, and how a sign put
 * together compares with the right one. Only the blocks count, so two ways of drawing the same
 * sign are both right; abilities count as a set, since the kit does not ask for their order.
 */

import type {AbilityName, BasicForm, SignOrganisation, SignSize, Supplement, TacticalSignSpec} from '@emberbox/ui'

/** The blocks the kit offers. */
export interface ComposedSign {
    form: BasicForm
    organisation?: SignOrganisation
    size?: SignSize
    supplements: Supplement[]
    abilities: AbilityName[]
}

/** The blocks that can differ between two signs. */
export type Block = 'form' | 'organisation' | 'size' | 'supplements' | 'abilities'

const KIT_KEYS = new Set<keyof TacticalSignSpec>(['form', 'organisation', 'size', 'supplements', 'abilities', 'designation', 'text'])

/** Whether a sign can be put together in the kit: it uses only its blocks and at least one beyond form and colour. */
export function composable(spec: TacticalSignSpec): boolean {
    const keys = Object.keys(spec) as (keyof TacticalSignSpec)[]
    return keys.every(key => KIT_KEYS.has(key)) && Boolean(spec.size || spec.supplements?.length || spec.abilities?.length)
}

/** A sign as the kit holds it. */
export function kitOf(spec: TacticalSignSpec): ComposedSign {
    return {form: spec.form, organisation: spec.organisation, size: spec.size, supplements: [...spec.supplements ?? []], abilities: [...spec.abilities ?? []]}
}

const sameSet = (a: readonly string[], b: readonly string[]) => a.length === b.length && a.every(value => b.includes(value))

/** The blocks in which a sign put together differs from the right one; empty when it is right. */
export function differences(target: TacticalSignSpec, given: ComposedSign): Block[] {
    const right = kitOf(target)
    const blocks: Block[] = []
    if (right.form !== given.form) blocks.push('form')
    if (right.organisation !== given.organisation) blocks.push('organisation')
    if (right.size !== given.size) blocks.push('size')
    if (!sameSet(right.supplements, given.supplements)) blocks.push('supplements')
    if (!sameSet(right.abilities, given.abilities)) blocks.push('abilities')
    return blocks
}

/** The sign the kit draws: the blocks plus the designation and writing of the right sign, which the kit does not ask for. */
export function drawn(given: ComposedSign, target: TacticalSignSpec): TacticalSignSpec {
    return {...given, designation: target.designation, text: target.text}
}
