<script setup lang="ts">
import {TacticalSymbol, type SvgElement} from '@emberbox/ui'

/** A drawing on white, as signs and labels are meant to be seen, also in dark mode. */
defineProps<{
  drawing: SvgElement
  width?: number
}>()
</script>

<template>
  <span class="inline-flex rounded-md bg-white p-1.5"><TacticalSymbol :symbol="drawing" :width="width ?? 120"/></span>
</template>
