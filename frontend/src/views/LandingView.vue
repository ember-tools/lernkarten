<script setup lang="ts">
import {usePage, webApplicationData} from '@emberbox/ui'
import {computed, onMounted} from 'vue'
import {DECKS} from '../areas'
import {SIGN_DECK_ID, signDeck} from '../areas/signs'
import {filterQuery} from '../areas/signs/filter'
import NotForOperations from '../components/NotForOperations.vue'
import SignFilterBar from '../components/SignFilterBar.vue'
import {useSignFilter} from '../composables/useSignFilter'
import type {Level} from '../learning/model'
import {t} from '../i18n'
import {HAZMAT_PAGES} from '../router/hazmat-pages'

const DESCRIPTION = 'Taktische Zeichen nach den Empfehlungen des BBK und die Kennzeichnung von Gefahrgut lernen: '
    + 'mit Lernkarten, Quiz und Nachschlageseiten, für Jugendfeuerwehr und Einsatzabteilung. Kostenlos und ohne Anmeldung.'

usePage({
  title: 'Lernkarten – Taktische Zeichen und Gefahrgut',
  description: DESCRIPTION,
  path: '/',
  structuredData: [webApplicationData({name: 'Lernkarten', description: DESCRIPTION})],
})

const LEVELS: Record<Level, string> = {basic: 'landing.level.basic', crew: 'landing.level.crew', lead: 'landing.level.lead'}

const REFERENCES = [{to: '/zeichen', key: 'nav.signs'}, ...HAZMAT_PAGES, {to: '/quellen', key: 'nav.sources'}] as const

/** Where a newcomer starts: the signs of the fire service at the youth fire brigade. */
const FIRST = {path: '/lernen/' + SIGN_DECK_ID, query: filterQuery({services: ['fire'], stage: 'youth'})}

/** The learner's choice of signs and the deck it makes, to learn or quiz from here. */
const signs = useSignFilter({address: false})
const signsDeck = computed(() => signDeck(signs.filter.value))
onMounted(signs.load)
</script>

<template>
  <div class="mx-auto flex max-w-5xl flex-col gap-10 py-4">
    <section class="flex max-w-3xl flex-col gap-3">
      <p class="eyebrow">{{ t('app.name') }}</p>
      <h1 class="headline m-0 text-4xl md:text-5xl">{{ t('landing.title') }}</h1>
      <p class="m-0 text-lg text-muted">{{ DESCRIPTION }}</p>
      <div class="flex flex-wrap gap-2">
        <UButton :to="FIRST" icon="i-lucide-arrow-right" trailing :label="t('landing.start')"/>
        <UButton to="/hilfe" color="neutral" variant="outline" icon="i-lucide-life-buoy" :label="t('nav.help')"/>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="eyebrow m-0">{{ t('landing.signs') }}</h2>
      <UCard>
        <div class="flex flex-col gap-3">
          <p class="m-0 text-muted">{{ signsDeck.description }}</p>
          <SignFilterBar :filter="signs.filter.value" @choose="signs.choose"/>
          <span class="text-sm text-muted">{{ t('landing.cards', {count: signsDeck.cards.length}) }}</span>
          <div class="flex flex-wrap gap-2">
            <UButton :to="{path: `/lernen/${SIGN_DECK_ID}`, query: filterQuery(signs.filter.value)}" icon="i-lucide-layers" :label="t('progress.learn')"/>
            <UButton :to="{path: `/quiz/${SIGN_DECK_ID}`, query: filterQuery(signs.filter.value)}" color="neutral" variant="outline" icon="i-lucide-list-checks" :label="t('progress.quiz')"/>
          </div>
        </div>
      </UCard>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="eyebrow m-0">{{ t('landing.hazmat') }}</h2>
      <div class="grid gap-4 md:grid-cols-2">
        <UCard v-for="deck in DECKS" :key="deck.id">
          <div class="flex h-full flex-col gap-2">
            <div class="flex flex-wrap items-baseline justify-between gap-2">
              <h3 class="headline m-0 text-xl">{{ deck.name }}</h3>
              <UBadge color="neutral" variant="soft" :label="deck.everything ? t('landing.level.all') : t(LEVELS[deck.level])"/>
            </div>
            <p class="m-0 grow text-muted">{{ deck.description }}</p>
            <span class="text-sm text-muted">{{ t('landing.cards', {count: deck.cards.length}) }}</span>
            <div class="flex flex-wrap gap-2">
              <UButton :to="`/lernen/${deck.id}`" icon="i-lucide-layers" :label="t('progress.learn')"/>
              <UButton :to="`/quiz/${deck.id}`" color="neutral" variant="outline" icon="i-lucide-list-checks" :label="t('progress.quiz')"/>
            </div>
          </div>
        </UCard>
      </div>
    </section>

    <section class="flex flex-col gap-2">
      <h2 class="eyebrow m-0">{{ t('landing.lookUp') }}</h2>
      <div class="flex flex-wrap gap-2">
        <UButton v-for="link in REFERENCES" :key="link.to" :to="link.to" color="neutral" variant="outline" :label="t(link.key)"/>
      </div>
    </section>

    <NotForOperations/>

    <section class="flex max-w-3xl flex-col gap-2">
      <h2 class="eyebrow m-0">{{ t('landing.howTitle') }}</h2>
      <p class="m-0">{{ t('landing.how') }}</p>
      <p class="m-0 text-muted">{{ t('landing.privacy') }}</p>
    </section>
  </div>
</template>
