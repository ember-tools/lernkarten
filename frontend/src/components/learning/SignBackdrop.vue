<script setup lang="ts">
import {TacticalSymbol, type SvgElement} from '@emberbox/ui'

/** A drawing on white, as signs and labels are meant to be seen, also in dark mode. */
defineProps<{
  drawing: SvgElement
  width?: number
}>()
</script>

<template>
  <span class="sign-backdrop"><TacticalSymbol :symbol="drawing" :width="width ?? 120"/></span>
</template>

<style scoped>
.sign-backdrop {
  display: inline-flex;
  padding: 6px;
  border-radius: 6px;
  background: #ffffff;
}
</style>
