<script setup lang="ts">
import {computed, ref} from 'vue'
import {t} from '../../i18n'
import type {Question} from '../../learning/model'
import SignBackdrop from './SignBackdrop.vue'

/**
 * One question: a choice question marks the picked and the right choice and explains, a flashcard
 * turns over and asks whether it was known. `answered` fires once the learner moves on.
 */
const props = defineProps<{question: Question}>()
const emit = defineEmits<{answered: [right: boolean]}>()

const picked = ref<number | null>(null)
const turned = ref(false)

const right = computed(() => props.question.form === 'choice' && picked.value === props.question.answer)
const pictures = computed(() => props.question.form === 'choice' && props.question.choices.some(choice => choice.drawing))

/** How a choice looks once one is picked: the right one green, a wrong pick red. */
function tone(index: number): 'success' | 'error' | 'neutral' {
  if (picked.value === null || props.question.form !== 'choice') return 'neutral'
  if (index === props.question.answer) return 'success'
  return index === picked.value ? 'error' : 'neutral'
}
</script>

<template>
  <UCard>
    <div class="flex flex-col gap-4">
      <h2 class="headline m-0 text-2xl">{{ question.prompt }}</h2>
      <SignBackdrop v-if="question.visual" :drawing="question.visual" :width="200" class="self-start"/>

      <template v-if="question.form === 'choice'">
        <div class="grid gap-2" :class="pictures ? 'grid-cols-2 md:grid-cols-4' : 'md:grid-cols-2'">
          <UButton v-for="(choice, index) in question.choices" :key="index" :color="tone(index)"
                   :variant="picked === null ? 'outline' : 'soft'" :disabled="picked !== null" block
                   class="min-h-12 justify-start text-left" @click="picked = index">
            <span class="flex items-center gap-3">
              <SignBackdrop v-if="choice.drawing" :drawing="choice.drawing" :width="96"/>
              <span v-if="choice.text">{{ choice.text }}</span>
              <span v-else class="sr-only">{{ t('question.picture', {number: index + 1}) }}</span>
            </span>
          </UButton>
        </div>
        <template v-if="picked !== null">
          <UAlert :color="right ? 'success' : 'error'" variant="soft" :title="right ? t('question.right') : t('question.wrong')"
                  :description="question.explanation"/>
          <UButton class="self-end" icon="i-lucide-arrow-right" trailing :label="t('question.next')" @click="emit('answered', right)"/>
        </template>
      </template>

      <template v-else>
        <UButton v-if="!turned" class="self-start" icon="i-lucide-rotate-cw" :label="t('question.turn')" @click="turned = true"/>
        <template v-else>
          <p class="m-0 text-lg font-semibold">{{ question.back }}</p>
          <SignBackdrop v-if="question.backVisual" :drawing="question.backVisual" :width="200" class="self-start"/>
          <p v-if="question.explanation" class="m-0 text-muted">{{ question.explanation }}</p>
          <div class="flex flex-wrap gap-2 self-end">
            <UButton color="error" variant="soft" icon="i-lucide-x" :label="t('question.notKnown')" @click="emit('answered', false)"/>
            <UButton color="success" icon="i-lucide-check" :label="t('question.known')" @click="emit('answered', true)"/>
          </div>
        </template>
      </template>
    </div>
  </UCard>
</template>
