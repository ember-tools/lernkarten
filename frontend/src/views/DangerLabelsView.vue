<script setup lang="ts">
import {DANGER_LABELS, DANGER_LABEL_PATTERNS, dangerLabelTree, environmentMarkTree, usePage, warningPanelTree} from '@emberbox/ui'
import HazmatLinks from '../components/HazmatLinks.vue'
import NotForOperations from '../components/NotForOperations.vue'
import NoteText from '../components/NoteText.vue'
import SignBackdrop from '../components/learning/SignBackdrop.vue'
import {t} from '../i18n'

usePage({
  title: 'Gefahrzettel – Lernkarten',
  description: 'Alle Gefahrzettel nach ADR 2025 mit Klasse und Bedeutung, dazu das Kennzeichen für umweltgefährdende Stoffe und die orangefarbene Warntafel.',
  path: '/gefahrzettel',
})
</script>

<template>
  <div class="mx-auto flex max-w-6xl flex-col gap-6">
    <header class="flex flex-col gap-2">
      <p class="eyebrow m-0">{{ t('reference.eyebrow') }}</p>
      <h1 class="headline m-0 text-4xl">{{ t('labels.title') }}</h1>
      <p class="m-0 text-lg text-muted">{{ t('labels.intro') }}</p>
      <HazmatLinks/>
    </header>
    <NotForOperations/>
    <ul class="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
      <li v-for="pattern in DANGER_LABEL_PATTERNS" :key="pattern" class="flex items-center gap-3 rounded-(--ui-radius) border border-default p-3">
        <SignBackdrop :drawing="dangerLabelTree(pattern)" :width="80"/>
        <span class="flex min-w-0 flex-col">
          <span class="font-mono text-sm">{{ t('labels.pattern', {pattern, hazardClass: DANGER_LABELS[pattern].hazardClass}) }}</span>
          <span class="text-sm">{{ DANGER_LABELS[pattern].name }}</span>
          <span class="text-xs text-muted">{{ t('labels.page', {page: DANGER_LABELS[pattern].page}) }}</span>
        </span>
      </li>
      <li class="flex items-center gap-3 rounded-(--ui-radius) border border-default p-3">
        <SignBackdrop :drawing="environmentMarkTree()" :width="80"/>
        <span class="text-sm">{{ t('labels.environment') }}</span>
      </li>
      <li class="flex items-center gap-3 rounded-(--ui-radius) border border-default p-3">
        <SignBackdrop :drawing="warningPanelTree({hazardNumber: '33', unNumber: '1203'})" :width="96"/>
        <span class="text-sm">{{ t('labels.plate') }}</span>
      </li>
    </ul>
    <NoteText>{{ t('labels.source') }}</NoteText>
  </div>
</template>
