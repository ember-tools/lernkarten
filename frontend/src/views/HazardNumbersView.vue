<script setup lang="ts">
import {usePage} from '@emberbox/ui'
import {HAZARD_DIGITS, HAZARD_NUMBERS, HAZARD_SOURCE, SPECIAL_HAZARD_NUMBERS, WATER_NOTE} from '../areas/hazmat/data'
import HazmatLinks from '../components/HazmatLinks.vue'
import NotForOperations from '../components/NotForOperations.vue'
import {t} from '../i18n'

usePage({
  title: 'Gefahrnummern – Lernkarten',
  description: 'Alle Nummern zur Kennzeichnung der Gefahr nach ADR 2025 mit ihrer Bedeutung, dazu was die Ziffern, die Verdoppelung, die 0 und das X bedeuten.',
  path: '/gefahrnummern',
})
</script>

<template>
  <div class="mx-auto flex max-w-4xl flex-col gap-6">
    <header class="flex flex-col gap-2">
      <p class="eyebrow m-0">{{ t('reference.eyebrow') }}</p>
      <h1 class="headline m-0 text-4xl">{{ t('numbers.title') }}</h1>
      <p class="m-0 text-lg text-muted">{{ t('numbers.intro') }}</p>
      <HazmatLinks/>
    </header>
    <NotForOperations/>

    <section class="flex flex-col gap-2">
      <h2 class="eyebrow m-0">{{ t('numbers.digitsTitle') }}</h2>
      <dl class="m-0 grid gap-x-4 gap-y-1 sm:grid-cols-[auto_1fr]">
        <template v-for="(meaning, digit) in HAZARD_DIGITS" :key="digit">
          <dt class="font-mono font-semibold">{{ digit }}</dt>
          <dd class="m-0">{{ meaning }}</dd>
        </template>
      </dl>
      <ul class="m-0 flex flex-col gap-1 pl-5">
        <li>{{ t('numbers.double') }}</li>
        <li>{{ t('numbers.zero') }}</li>
        <li>{{ t('numbers.x', {note: WATER_NOTE}) }}</li>
        <li>{{ t('numbers.special', {codes: SPECIAL_HAZARD_NUMBERS.join(', ')}) }}</li>
      </ul>
    </section>

    <section class="flex flex-col gap-2">
      <h2 class="eyebrow m-0">{{ t('numbers.tableTitle') }}</h2>
      <dl class="m-0 grid gap-x-4 gap-y-2 sm:grid-cols-[auto_1fr]">
        <template v-for="entry in HAZARD_NUMBERS" :key="entry.code">
          <dt class="font-mono font-semibold">{{ entry.code }}</dt>
          <dd class="m-0">{{ entry.meaning }}</dd>
        </template>
      </dl>
    </section>
    <p class="m-0 text-sm text-muted">
      {{ t('reference.source', {source: HAZARD_SOURCE.text}) }}
      <a :href="HAZARD_SOURCE.url" rel="noopener" target="_blank">{{ t('reference.sourceLink') }}</a>
    </p>
  </div>
</template>
