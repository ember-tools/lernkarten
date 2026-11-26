<script setup lang="ts">
import {catalogSignTree} from '@emberbox/ui'
import type {SignItem} from '../areas/signs/catalog'
import SignBackdrop from './learning/SignBackdrop.vue'
import {t} from '../i18n'

/** Signs with their number, name and printed page, or the note that the library put them together itself. */
defineProps<{items: readonly SignItem[]}>()
</script>

<template>
  <ul class="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
    <li v-for="item in items" :key="item.id" class="flex items-center gap-3 rounded-(--ui-radius) border border-default p-3">
      <SignBackdrop :drawing="catalogSignTree(item.entry)" :width="96"/>
      <span class="flex min-w-0 flex-col">
        <span class="font-mono text-sm">{{ item.entry.number }}</span>
        <span class="text-sm">{{ item.name }}</span>
        <span class="text-xs text-muted">{{ item.entry.recommended ? t('reference.page', {page: item.entry.page ?? ''}) : t('reference.own') }}</span>
      </span>
    </li>
  </ul>
</template>
