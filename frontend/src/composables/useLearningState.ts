import {readonly, ref} from 'vue'
import {localDay, review} from '../learning/leitner'
import {
    DEFAULT_SETTINGS, parseProgress, parseSettings, serializeProgress, serializeSettings, withoutCards,
    type Progress, type Settings,
} from '../learning/progress'

const PROGRESS_KEY = 'lernkarten.progress.v1'
const SETTINGS_KEY = 'lernkarten.settings.v1'

const progress = ref<Progress>({})
const settings = ref<Settings>({...DEFAULT_SETTINGS})
const loaded = ref(false)
const stored = ref(true)

/** The stored texts of the progress and the settings. */
interface StoredTexts {
    progress: string | null
    settings: string | null
}

/** The stored texts, or undefined where the browser refuses its storage. */
function readStored(): StoredTexts | undefined {
    try {
        return {progress: localStorage.getItem(PROGRESS_KEY), settings: localStorage.getItem(SETTINGS_KEY)}
    } catch {
        return undefined
    }
}

/** Stores the progress; false where the browser refuses. */
function writeProgress(next: Progress): boolean {
    try {
        localStorage.setItem(PROGRESS_KEY, serializeProgress(next))
        return true
    } catch {
        return false
    }
}

/** Stores the settings; a refusal only costs the setting. */
function writeSettings(next: Settings) {
    try {
        localStorage.setItem(SETTINGS_KEY, serializeSettings(next))
    } catch {
        return
    }
}

/**
 * Applies a change to the latest stored progress rather than to what this page read earlier, so
 * answers given meanwhile in another tab are kept, and writes the result back. Once the browser
 * refused a write, the stored copy is behind this page, so the change goes to the page's own.
 */
function update(change: (current: Progress) => Progress) {
    const texts = stored.value ? readStored() : undefined
    const current = texts ? parseProgress(texts.progress) : progress.value
    const next = change(current)
    progress.value = next
    stored.value = writeProgress(next)
}

/** Follows changes another tab writes. */
function followOtherTabs(event: StorageEvent) {
    if (event.key === PROGRESS_KEY) progress.value = parseProgress(event.newValue)
    if (event.key === SETTINGS_KEY) settings.value = parseSettings(event.newValue)
}

/**
 * The learner's progress and settings, shared by every page. They are read from the browser on the
 * first `load()`, which pages call in `onMounted` so prerendering never touches the storage. Every
 * change is applied to the latest stored progress and written back at once; `stored` says whether
 * the browser keeps it, and changes in other tabs are followed.
 */
export function useLearningState() {
    function load() {
        if (loaded.value) return
        const texts = readStored()
        stored.value = texts !== undefined
        progress.value = parseProgress(texts?.progress ?? null)
        settings.value = parseSettings(texts?.settings ?? null)
        window.addEventListener('storage', followOtherTabs)
        loaded.value = true
    }

    return {
        progress: readonly(progress),
        settings: readonly(settings),
        loaded: readonly(loaded),
        stored: readonly(stored),
        load,
        answer: (cardId: string, right: boolean) =>
            update(current => ({...current, [cardId]: review(current[cardId], right, localDay(new Date()))})),
        reset: (cardIds: readonly string[]) => update(current => withoutCards(current, cardIds)),
        replace: (next: Progress) => update(() => next),
        setQuizLength: (quizLength: Settings['quizLength']) => {
            settings.value = {...settings.value, quizLength}
            writeSettings(settings.value)
        },
    }
}
