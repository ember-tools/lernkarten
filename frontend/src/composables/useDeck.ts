import {computed} from 'vue'
import {useRoute} from 'vue-router'
import {findDeck} from '../areas'
import {SIGN_DECK_ID, signDeck} from '../areas/signs'
import {useSignFilter} from './useSignFilter'

/**
 * The deck a learning or quiz page shows, by its address: the sign deck of the learner's choice,
 * or a fixed deck. `signs` says whether it is the sign deck, whose choice the page can change;
 * `load()` reads that choice and belongs in `onMounted`.
 */
export function useDeck() {
    const route = useRoute()
    const choice = useSignFilter()
    const signs = computed(() => route.params.deck === SIGN_DECK_ID)
    const deck = computed(() => signs.value ? signDeck(choice.filter.value) : findDeck(String(route.params.deck)))

    function load() {
        if (signs.value) choice.load()
    }

    return {deck, signs, filter: choice.filter, choose: choice.choose, load}
}
