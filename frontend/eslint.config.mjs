import {emberboxEslint} from '@emberbox/lint'

/**
 * Which layer may not reach which: the learning model stands on nothing of the interface, and
 * components and composables stand on no view.
 */
const LAYERS = [
    {layer: 'learning', above: ['views', 'components', 'composables']},
    {layer: 'composables', above: ['views', 'components']},
    {layer: 'components', above: ['views']},
]

export default await emberboxEslint({catalogue: 'src/i18n/de.ts', layers: LAYERS})
