<script setup lang="ts">
import {CATALOG_SOURCE, catalogSignTree, usePage} from '@emberbox/ui'
import {computed} from 'vue'
import {useRoute} from 'vue-router'
import {SIGN_ITEMS} from '../areas/signs/catalog'
import {SIGN_CHAPTERS} from '../areas/signs/chapters'
import NoteText from '../components/NoteText.vue'
import SignBackdrop from '../components/learning/SignBackdrop.vue'
import {t} from '../i18n'

/** One chapter of the sign reference: every sign with its number, name and page. */
const route = useRoute()
const chapter = SIGN_CHAPTERS.find(entry => entry.slug === route.params.chapter)
const items = computed(() => SIGN_ITEMS.filter(item => item.chapter === chapter?.chapter))

usePage({
  title: `${chapter?.title ?? t('routes.notFound')} – Taktische Zeichen – Lernkarten`,
  description: chapter?.intro ?? '',
  path: chapter ? `/zeichen/${chapter.slug}` : undefined,
  index: chapter !== undefined,
})
</script>

<template>
  <div class="mx-auto flex max-w-6xl flex-col gap-6">
    <template v-if="chapter">
      <header class="flex flex-col gap-2">
        <RouterLink to="/zeichen" class="text-sm text-muted">{{ t('reference.back') }}</RouterLink>
        <h1 class="headline m-0 text-4xl">{{ chapter.title }}</h1>
        <p class="m-0 text-lg text-muted">{{ chapter.intro }}</p>
      </header>
      <ul class="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="item in items" :key="item.id" class="flex items-center gap-3 rounded-(--ui-radius) border border-default p-3">
          <SignBackdrop :drawing="catalogSignTree(item.entry)" :width="96"/>
          <span class="flex min-w-0 flex-col">
            <span class="font-mono text-sm">{{ item.entry.number }}</span>
            <span class="text-sm">{{ item.name }}</span>
            <span class="text-xs text-muted">{{ t('reference.page', {page: item.entry.page ?? ''}) }}</span>
          </span>
        </li>
      </ul>
      <NoteText>{{ t('reference.source', {source: CATALOG_SOURCE}) }} <RouterLink to="/quellen">{{ t('nav.sources') }}</RouterLink></NoteText>
    </template>
    <UAlert v-else color="warning" variant="soft" :title="t('notFound.title')"/>
  </div>
</template>
