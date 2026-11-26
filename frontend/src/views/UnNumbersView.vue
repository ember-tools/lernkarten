<script setup lang="ts">
import {usePage, warningPanelTree} from '@emberbox/ui'
import {computed, onMounted, ref, shallowRef} from 'vue'
import META from '../data/hazmat/meta.json'
import {loadUnNumbers, plateHazard, type UnEntry} from '../areas/hazmat/data'
import HazmatLinks from '../components/HazmatLinks.vue'
import NotForOperations from '../components/NotForOperations.vue'
import NoteText from '../components/NoteText.vue'
import SignBackdrop from '../components/learning/SignBackdrop.vue'
import {t} from '../i18n'
import {germanDay} from '../learning/leitner'

usePage({
  title: 'UN-Nummern – Lernkarten',
  description: 'UN-Nummern und Stoffnamen mit Gefahrnummer und Klasse nachschlagen, nach Nummer oder Name.',
  path: '/un-nummern',
})

/** How many entries the search shows at most. */
const LIMIT = 50

const entries = shallowRef<readonly UnEntry[]>([])
const failed = ref(false)
const query = ref('')

onMounted(async () => {
  try {
    entries.value = await loadUnNumbers()
  } catch {
    failed.value = true
  }
})

/** Every entry the query finds: by the start of the number (a leading "UN" is ignored) or by a part of the name. */
const found = computed(() => {
  const text = query.value.trim().toLowerCase().replace(/^un\s*(?=\d)/, '')
  if (!text) return []
  const byNumber = /^\d+$/.test(text)
  return entries.value.filter(entry => byNumber ? entry.un.startsWith(text) : entry.name.toLowerCase().includes(text))
})
const matches = computed(() => found.value.slice(0, LIMIT))
</script>

<template>
  <div class="mx-auto flex max-w-4xl flex-col gap-6">
    <header class="flex flex-col gap-2">
      <p class="eyebrow m-0">{{ t('reference.eyebrow') }}</p>
      <h1 class="headline m-0 text-4xl">{{ t('un.title') }}</h1>
      <p class="m-0 text-lg text-muted">{{ t('un.intro') }}</p>
      <HazmatLinks/>
    </header>
    <NotForOperations/>
    <UFormField :label="t('un.search')">
      <UInput v-model="query" icon="i-lucide-search" :placeholder="t('un.placeholder')" class="w-full" :disabled="!entries.length"/>
    </UFormField>
    <UAlert v-if="failed" color="error" variant="soft" :title="t('un.failed')"/>
    <p v-if="query.trim() && !matches.length && entries.length" class="m-0 text-muted">{{ t('un.none') }}</p>
    <NoteText v-if="found.length > LIMIT">{{ t('un.limited', {shown: LIMIT, total: found.length}) }}</NoteText>
    <ul class="m-0 flex list-none flex-col gap-2 p-0">
      <li v-for="(entry, index) in matches" :key="`${index}-${entry.un}`" class="flex items-center gap-3 rounded-(--ui-radius) border border-default p-3">
        <SignBackdrop v-if="plateHazard(entry)" :drawing="warningPanelTree({hazardNumber: plateHazard(entry)!, unNumber: entry.un})" :width="72"/>
        <span class="flex min-w-0 flex-col">
          <span class="font-mono text-sm">{{ t('un.entry', {un: entry.un, hazardClass: entry.class || t('un.noClass')}) }}</span>
          <span>{{ entry.name }}</span>
          <span class="text-xs text-muted">
            {{ entry.hazard.length ? t('un.hazard', {codes: entry.hazard.join(', ')}) : entry.uncertain ? t('un.uncertain') : t('un.noHazard') }}
          </span>
        </span>
      </li>
    </ul>
    <NoteText>
      {{ t('un.source', {date: germanDay(META.date)}) }}
      <a :href="META.source" rel="noopener" target="_blank">{{ t('un.chemie') }}</a> ·
      <a :href="META.origin" rel="noopener" target="_blank">{{ t('un.wikipedia') }}</a> ·
      <a :href="META.authors" rel="noopener" target="_blank">{{ t('un.authors') }}</a> ·
      <a href="https://www.gnu.org/licenses/fdl.html" rel="noopener" target="_blank">{{ t('un.licence') }}</a>
    </NoteText>
  </div>
</template>
