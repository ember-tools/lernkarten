import {readonly, ref} from 'vue'
import {useRoute, useRouter, type LocationQuery} from 'vue-router'
import {EVERYTHING, filterQuery, isEverything, parseFilter, parseFilterQuery, resolveFilter, serializeFilter} from '../areas/signs/filter'
import type {SignFilter} from '../areas/signs/tags'

const FILTER_KEY = 'lernkarten.sign-filter.v1'

const filter = ref<SignFilter>(EVERYTHING)
const chosen = ref(false)

/** The stored filter, or undefined where there is none or the browser refuses its storage. */
function readStored(): SignFilter | undefined {
    try {
        return parseFilter(localStorage.getItem(FILTER_KEY))
    } catch {
        return undefined
    }
}

/** Stores the filter; a refusal only costs remembering it. */
function writeStored(next: SignFilter) {
    try {
        localStorage.setItem(FILTER_KEY, serializeFilter(next))
    } catch {
        return
    }
}

/** A query with the filter written into it, or taken out of it where the filter leaves nothing out. */
function queryWith(query: LocationQuery, next: SignFilter): LocationQuery {
    const rest = Object.fromEntries(Object.entries(query).filter(([key]) => key !== 'fachdienst' && key !== 'stufe'))
    return isEverything(next) ? rest : {...rest, ...filterQuery(next)}
}

/**
 * The learner's choice of services and stage for the signs, shared by every page. Until `load()`,
 * which pages call in `onMounted`, it leaves nothing out, so a prerendered page shows every sign.
 * `resolveFilter` decides what loading takes; choosing writes the choice to the browser and the
 * address, so the address can be passed on and the next visit starts with it. A page whose links
 * carry the choice themselves, such as the start page, keeps it out of its own address.
 */
export function useSignFilter(options: {address: boolean} = {address: true}) {
    const route = useRoute()
    const router = useRouter()

    function load() {
        const fromAddress = parseFilterQuery(route.query.fachdienst, route.query.stufe)
        const resolved = resolveFilter(fromAddress, fromAddress ? undefined : readStored(), chosen.value ? filter.value : undefined)
        filter.value = resolved.filter
        chosen.value = true
        if (resolved.store) writeStored(resolved.filter)
        if (resolved.address && options.address) void router.replace({query: {...route.query, ...resolved.address}})
    }

    function choose(next: SignFilter) {
        filter.value = next
        chosen.value = true
        writeStored(next)
        if (options.address) void router.replace({query: queryWith(route.query, next)})
    }

    return {filter: readonly(filter), load, choose}
}
