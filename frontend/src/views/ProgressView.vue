<script setup lang="ts">
import {useConfirm} from '@emberbox/ui'
import {computed, onMounted, ref} from 'vue'
import SignChoice from '../components/SignChoice.vue'
import {useLearningState} from '../composables/useLearningState'
import {useSignFilter} from '../composables/useSignFilter'
import {t} from '../i18n'
import {DECKS} from '../areas'
import {SIGN_DECK_ID, serviceDeck, signDeck} from '../areas/signs'
import {CHOSEN_SERVICES} from '../areas/signs/filter'
import {localDay} from '../learning/leitner'
import type {Deck} from '../learning/model'
import {exportProgress, importProgress} from '../learning/progress'
import {deckStanding} from '../learning/session'

/**
 * The learner's standing per deck, starting a deck over, and moving the progress to another device
 * as a file. Signs stand for the learner's choice, with a line per chosen service; starting over
 * clears the cards of that choice.
 */
const state = useLearningState()
const signs = useSignFilter()
const confirm = useConfirm()
/** A short report after an import. */
interface Notice {
  color: 'success' | 'error'
  text: string
}

const message = ref<Notice | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

onMounted(() => {
  state.load()
  signs.load()
})

const decks = computed(() => [signDeck(signs.filter.value), ...DECKS])

const standings = computed(() => {
  const today = localDay(new Date())
  return new Map(decks.value.map(deck => [deck.id, deckStanding(deck, state.progress.value, today)]))
})

/** The standing of what each chosen service adds at the chosen stage, beyond the signs of every organisation. */
const serviceStandings = computed(() => {
  const today = localDay(new Date())
  const {services, stage} = signs.filter.value
  return CHOSEN_SERVICES.filter(service => services.includes(service))
    .map(service => ({service, standing: deckStanding(serviceDeck(service, stage), state.progress.value, today)}))
})

async function reset(deck: Deck) {
  if (!await confirm(t('progress.resetQuestion', {deck: deck.name}), {danger: true, confirmLabel: t('progress.reset')})) return
  state.reset(deck.cards.map(entry => entry.id))
}

function download() {
  const blob = new Blob([exportProgress(state.progress.value, new Date())], {type: 'application/json'})
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `lernkarten-${localDay(new Date())}.json`
  link.click()
  setTimeout(() => URL.revokeObjectURL(link.href), 0)
}

async function upload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (fileInput.value) fileInput.value.value = ''
  if (!file) return
  const imported = importProgress(await file.text())
  if (!imported) {
    message.value = {color: 'error', text: t('progress.importInvalid')}
    return
  }
  if (!await confirm(t('progress.importQuestion'), {danger: true, confirmLabel: t('progress.importConfirm')})) return
  state.replace(imported)
  message.value = {color: 'success', text: t('progress.imported', {count: Object.keys(imported).length})}
}
</script>

<template>
  <div class="mx-auto flex max-w-4xl flex-col gap-6">
    <header class="flex flex-col gap-1">
      <h1 class="headline m-0 text-3xl">{{ t('progress.title') }}</h1>
      <p class="m-0 text-muted">{{ t('progress.intro') }}</p>
    </header>
    <UAlert v-if="!state.stored.value" color="warning" variant="soft" :title="t('progress.notStored')"/>
    <UAlert v-if="message" :color="message.color" variant="soft" :title="message.text"/>

    <section class="flex flex-col gap-3">
      <UCard v-for="deck in decks" :key="deck.id">
        <div class="flex flex-col gap-3">
          <div class="flex flex-wrap items-baseline justify-between gap-2">
            <h2 class="headline m-0 text-xl">{{ deck.name }}</h2>
            <span class="text-sm text-muted">{{ t('progress.standing', {...standings.get(deck.id)}) }}</span>
          </div>
          <template v-if="deck.id === SIGN_DECK_ID">
            <SignChoice :filter="signs.filter.value" @choose="signs.choose"/>
            <ul v-if="serviceStandings.length" class="m-0 flex list-none flex-col gap-1 p-0 text-sm text-muted">
              <li v-for="row in serviceStandings" :key="row.service">
                {{ t('progress.serviceStanding', {service: t(`filter.service.${row.service}`), ...row.standing}) }}
              </li>
            </ul>
          </template>
          <div class="flex gap-1" :aria-label="t('progress.boxes')">
            <span v-for="(count, box) in standings.get(deck.id)?.boxes" :key="box" class="flex-1 rounded bg-elevated px-2 py-1 text-center text-sm">
              {{ t('progress.box', {box: box + 1, count}) }}
            </span>
          </div>
          <div class="flex flex-wrap gap-2">
            <UButton :to="`/lernen/${deck.id}`" icon="i-lucide-layers" :label="t('progress.learn')"/>
            <UButton :to="`/quiz/${deck.id}`" color="neutral" variant="outline" icon="i-lucide-list-checks" :label="t('progress.quiz')"/>
            <UButton color="error" variant="ghost" icon="i-lucide-trash-2" :label="t('progress.reset')" @click="reset(deck)"/>
          </div>
        </div>
      </UCard>
    </section>

    <section class="flex flex-col gap-2">
      <h2 class="eyebrow m-0">{{ t('progress.transferTitle') }}</h2>
      <p class="m-0 text-muted">{{ t('progress.transferText') }}</p>
      <div class="flex flex-wrap gap-2">
        <UButton icon="i-lucide-download" :label="t('progress.export')" @click="download"/>
        <UButton color="neutral" variant="outline" icon="i-lucide-upload" :label="t('progress.import')" @click="fileInput?.click()"/>
        <input ref="fileInput" type="file" accept="application/json,.json" class="hidden" :aria-label="t('progress.import')" @change="upload"/>
      </div>
    </section>
  </div>
</template>
