/** The items of the dangerous goods area, each with an id that says what it is. */

import {DANGER_LABELS, DANGER_LABEL_PATTERNS} from '@emberbox/ui'
import type {Item} from '../../learning/model'
import {GAMS_ITEMS, RULE_ITEMS, SCENARIO_ITEMS} from './content'
import {COMMON_SUBSTANCES, HAZARD_DIGITS, HAZARD_NUMBERS} from './data'

const item = (id: string, name: string): Item => ({id, area: 'hazmat', name})

/** Every hazard number of 5.3.2.3.2 as an item. */
export const NUMBER_ITEMS = HAZARD_NUMBERS.map(entry => item(`number-${entry.code}`, entry.code))
/** The digits 2 to 9 as items. */
export const DIGIT_ITEMS = Object.keys(HAZARD_DIGITS).map(value => item(`digit-${value}`, value))
/** Every danger label pattern as an item. */
export const LABEL_ITEMS = DANGER_LABEL_PATTERNS.map(pattern => item(`label-${pattern}`, DANGER_LABELS[pattern].name))
/** Every substance of the hand-kept list as an item. */
export const SUBSTANCE_ITEMS = COMMON_SUBSTANCES.map(substance => item(`substance-${substance.un}`, substance.name))

/** Every item of the area. */
export const HAZMAT_ITEMS: readonly Item[] = [...NUMBER_ITEMS, ...DIGIT_ITEMS, ...LABEL_ITEMS, ...SUBSTANCE_ITEMS, ...RULE_ITEMS, ...GAMS_ITEMS, ...SCENARIO_ITEMS]
