<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue'
import NoteText from '../components/NoteText.vue'
import SignChoice from '../components/SignChoice.vue'
import QuestionCard from '../components/learning/QuestionCard.vue'
import {useDeck} from '../composables/useDeck'
import {useLearningState} from '../composables/useLearningState'
import {t} from '../i18n'
import {AREAS} from '../areas'
import {localDay} from '../learning/leitner'
import type {Card} from '../learning/model'
import {afterAnswer, dueCards} from '../learning/session'

/**
 * Learning a deck in rounds: the due cards one after another, wrong ones again at the end; after a
 * round it says whether more cards wait, new ones beyond the round's size included. A new choice
 * of signs starts a new round.
 */
const state = useLearningState()
const {deck, signs, filter, choose, load} = useDeck()

const queue = ref<Card[]>([])
const asked = ref(0)
const round = ref(0)
const started = ref(false)

const question = computed(() => {
  const next = queue.value[0]
  const area = next ? AREAS[next.area] : undefined
  return next && area ? area.question(next, Math.random) : undefined
})

/** Whether more cards wait after this round: due ones, or new ones beyond the round's size. */
const more = ref(false)

/** Starts a round with the cards due now. */
function nextRound() {
  if (deck.value) queue.value = dueCards(deck.value, state.progress.value, localDay(new Date()), Math.random)
  asked.value = 0
  round.value++
}

onMounted(() => {
  state.load()
  load()
  nextRound()
  started.value = true
  watch(filter, () => {
    more.value = false
    nextRound()
  })
})

function answered(right: boolean) {
  const current = queue.value[0]
  if (!current) return
  state.answer(current.id, right)
  queue.value = afterAnswer(queue.value, right)
  asked.value++
  if (!queue.value.length && deck.value) more.value = dueCards(deck.value, state.progress.value, localDay(new Date()), Math.random).length > 0
}
</script>

<template>
  <div class="mx-auto flex max-w-3xl flex-col gap-4">
    <template v-if="deck">
      <header class="flex flex-col gap-1">
        <p class="eyebrow m-0">{{ t('learn.eyebrow') }}</p>
        <h1 class="headline m-0 text-3xl">{{ deck.name }}</h1>
        <NoteText v-if="started && question">{{ t('learn.remaining', {count: queue.length}) }}</NoteText>
        <SignChoice v-if="signs" :filter="filter" @choose="choose"/>
      </header>
      <UAlert v-if="!state.stored.value" color="warning" variant="soft" :title="t('progress.notStored')"/>
      <QuestionCard v-if="question" :key="`${round}-${asked}`" :question="question" @answered="answered"/>
      <UCard v-else-if="started">
        <div class="flex flex-col gap-3">
          <h2 class="headline m-0 text-2xl">{{ more ? t('learn.roundTitle') : t('learn.doneTitle') }}</h2>
          <p class="m-0 text-muted">{{ more ? t('learn.roundText', {count: asked}) : asked ? t('learn.doneText', {count: asked}) : t('learn.nothingDue') }}</p>
          <div class="flex flex-wrap gap-2">
            <UButton v-if="more" icon="i-lucide-layers" :label="t('learn.nextRound')" @click="more = false; nextRound()"/>
            <UButton :to="`/quiz/${deck.id}`" icon="i-lucide-list-checks" :label="t('learn.toQuiz')"/>
            <UButton to="/lernstand" color="neutral" variant="outline" icon="i-lucide-chart-column" :label="t('nav.progress')"/>
          </div>
        </div>
      </UCard>
    </template>
    <UAlert v-else color="warning" variant="soft" :title="t('deck.missing')"/>
  </div>
</template>
