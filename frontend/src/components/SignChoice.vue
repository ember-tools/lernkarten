<script setup lang="ts">
import {filterName} from '../areas/signs'
import type {SignFilter} from '../areas/signs/tags'
import SignFilterBar from './SignFilterBar.vue'
import {t} from '../i18n'

/** The learner's choice of signs, folded to its name, to change on a learning, quiz or progress page. */
defineProps<{filter: SignFilter}>()
const emit = defineEmits<{choose: [filter: SignFilter]}>()
</script>

<template>
  <details>
    <summary class="cursor-pointer text-sm text-muted">
      {{ t('filter.summary', {choice: filterName(filter)}) }}
    </summary>
    <div class="pt-2">
      <SignFilterBar :filter="filter" @choose="next => emit('choose', next)"/>
    </div>
  </details>
</template>
