<script setup lang="ts">
import {usePage} from '@emberbox/ui'
import {onMounted} from 'vue'
import {chapterItems} from '../areas/signs/catalog'
import {SIGN_CHAPTERS} from '../areas/signs/chapters'
import {filterItems} from '../areas/signs/filter'
import SignFilterBar from '../components/SignFilterBar.vue'
import SignSourceNote from '../components/SignSourceNote.vue'
import {useSignFilter} from '../composables/useSignFilter'
import {t} from '../i18n'

usePage({
  title: 'Taktische Zeichen – Lernkarten',
  description: 'Alle taktischen Zeichen nach den Empfehlungen des BBK 2024 nach Kapiteln, gefiltert nach Fachdienst und Ausbildungsstand: Grundelemente, Farben, Ergänzungszeichen, Fähigkeiten, Zusatzzeichen, Beispiele für Feuerwehr und Führung und die Gruppe der Feuerwehr.',
  path: '/zeichen',
})

const {filter, load, choose} = useSignFilter()
onMounted(load)

/** How many signs of a chapter the learner's choice keeps. */
const count = (chapter: string) => filterItems(chapterItems(chapter), filter.value).length
</script>

<template>
  <div class="mx-auto flex max-w-5xl flex-col gap-6">
    <header class="flex flex-col gap-2">
      <p class="eyebrow m-0">{{ t('reference.eyebrow') }}</p>
      <h1 class="headline m-0 text-4xl">{{ t('reference.signsTitle') }}</h1>
      <p class="m-0 text-lg text-muted">{{ t('reference.signsIntro') }}</p>
    </header>
    <SignFilterBar :filter="filter" @choose="choose"/>
    <div>
      <UButton to="/zeichen/auswahl" icon="i-lucide-filter" variant="outline" :label="t('filter.selection')"/>
    </div>
    <div class="grid gap-4 md:grid-cols-2">
      <UCard v-for="chapter in SIGN_CHAPTERS" :key="chapter.slug">
        <div class="flex flex-col gap-2">
          <h2 class="headline m-0 text-xl">
            <RouterLink :to="`/zeichen/${chapter.slug}`">{{ chapter.title }}</RouterLink>
          </h2>
          <p class="m-0 text-muted">{{ chapter.intro }}</p>
          <span class="text-sm text-muted">{{ t('reference.count', {count: count(chapter.chapter)}) }}</span>
        </div>
      </UCard>
    </div>
    <SignSourceNote/>
  </div>
</template>
