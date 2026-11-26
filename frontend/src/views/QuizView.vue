<script setup lang="ts">
import {tacticalSignTree, type SvgElement} from '@emberbox/ui'
import {computed, onMounted, ref} from 'vue'
import NoteText from '../components/NoteText.vue'
import SignChoice from '../components/SignChoice.vue'
import QuestionCard from '../components/learning/QuestionCard.vue'
import SignBackdrop from '../components/learning/SignBackdrop.vue'
import {useDeck} from '../composables/useDeck'
import {useLearningState} from '../composables/useLearningState'
import {t} from '../i18n'
import {AREAS} from '../areas'
import type {Question} from '../learning/model'
import {quizCards} from '../learning/session'

/** A quiz over a deck: a fixed number of questions, then the result with the explanations of the misses. */
const state = useLearningState()
const {deck, signs, filter, choose, load} = useDeck()

const questions = ref<Question[]>([])
const results = ref<boolean[]>([])
const running = ref(false)

const current = computed(() => questions.value[results.value.length])
const done = computed(() => running.value && current.value === undefined)
const score = computed(() => results.value.filter(Boolean).length)
const misses = computed(() => questions.value.filter((_, index) => results.value[index] === false))

onMounted(() => {
  state.load()
  load()
})

function start(length: 10 | 20) {
  if (!deck.value) return
  state.setQuizLength(length)
  questions.value = quizCards(deck.value, length, Math.random).flatMap(entry => {
    const area = AREAS[entry.area]
    return area ? [area.question(entry, Math.random)] : []
  })
  results.value = []
  running.value = true
}

/** The right answer of a question as shown in the result: its writing and its drawing, either may be missing. */
function solution(question: Question): {text?: string, drawing?: SvgElement} {
  if (question.form === 'flashcard') return {text: question.back, drawing: question.backVisual}
  if (question.form === 'compose') return {drawing: tacticalSignTree(question.target)}
  return question.choices[question.answer] ?? {}
}
</script>

<template>
  <div class="mx-auto flex max-w-3xl flex-col gap-4">
    <template v-if="deck">
      <header class="flex flex-col gap-1">
        <p class="eyebrow m-0">{{ t('quiz.eyebrow') }}</p>
        <h1 class="headline m-0 text-3xl">{{ deck.name }}</h1>
        <NoteText v-if="running && current">
          {{ t('quiz.position', {number: results.length + 1, total: questions.length}) }}
        </NoteText>
      </header>

      <UCard v-if="!running">
        <div class="flex flex-col gap-3">
          <p class="m-0">{{ t('quiz.intro') }}</p>
          <SignChoice v-if="signs" :filter="filter" @choose="choose"/>
          <div class="flex flex-wrap gap-2">
            <UButton v-for="length in [10, 20] as const" :key="length" :label="t('quiz.start', {count: length})"
                     :variant="state.settings.value.quizLength === length ? 'solid' : 'outline'" @click="start(length)"/>
          </div>
        </div>
      </UCard>

      <QuestionCard v-else-if="current" :key="results.length" :question="current" @answered="right => results.push(right)"/>

      <UCard v-else-if="done">
        <div class="flex flex-col gap-4">
          <h2 class="headline m-0 text-2xl">{{ t('quiz.score', {right: score, total: questions.length}) }}</h2>
          <ul v-if="misses.length" class="m-0 flex list-none flex-col gap-3 p-0">
            <li v-for="question in misses" :key="question.cardId" class="flex flex-col gap-1 border-l-2 border-error pl-3">
              <span class="font-semibold">{{ question.prompt }}</span>
              <SignBackdrop v-if="question.form !== 'compose' && question.visual" :drawing="question.visual" :width="96" class="self-start"/>
              <span>{{ solution(question).text ? t('quiz.solution', {answer: solution(question).text}) : t('quiz.solutionDrawing') }}</span>
              <SignBackdrop v-if="solution(question).drawing" :drawing="solution(question).drawing!" :width="96" class="self-start"/>
              <span v-if="question.explanation" class="text-sm text-muted">{{ question.explanation }}</span>
            </li>
          </ul>
          <p v-else class="m-0">{{ t('quiz.perfect') }}</p>
          <div class="flex flex-wrap gap-2">
            <UButton icon="i-lucide-rotate-ccw" :label="t('quiz.again')" @click="running = false"/>
            <UButton :to="`/lernen/${deck.id}`" color="neutral" variant="outline" icon="i-lucide-layers" :label="t('quiz.toLearn')"/>
          </div>
        </div>
      </UCard>
    </template>
    <UAlert v-else color="warning" variant="soft" :title="t('deck.missing')"/>
  </div>
</template>
