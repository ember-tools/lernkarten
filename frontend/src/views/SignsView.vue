<script setup lang="ts">
import {CATALOG_SOURCE, usePage} from '@emberbox/ui'
import {SIGN_ITEMS} from '../areas/signs/catalog'
import {SIGN_CHAPTERS} from '../areas/signs/chapters'
import {t} from '../i18n'

usePage({
  title: 'Taktische Zeichen – Lernkarten',
  description: 'Alle taktischen Zeichen nach den Empfehlungen des BBK 2024 nach Kapiteln: Grundelemente, Farben, Ergänzungszeichen, Fähigkeiten, Zusatzzeichen und Beispiele für Feuerwehr und Führung.',
  path: '/zeichen',
})

/** How many signs a chapter has. */
const count = (chapter: string) => SIGN_ITEMS.filter(item => item.chapter === chapter).length
</script>

<template>
  <div class="mx-auto flex max-w-5xl flex-col gap-6">
    <header class="flex flex-col gap-2">
      <p class="eyebrow m-0">{{ t('reference.eyebrow') }}</p>
      <h1 class="headline m-0 text-4xl">{{ t('reference.signsTitle') }}</h1>
      <p class="m-0 text-lg text-muted">{{ t('reference.signsIntro') }}</p>
    </header>
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
    <p class="m-0 text-sm text-muted">{{ t('reference.source', {source: CATALOG_SOURCE}) }}</p>
  </div>
</template>
