<script setup lang="ts">
import {usePage} from '@emberbox/ui'
import {computed, onMounted, ref} from 'vue'
import {useRoute} from 'vue-router'
import {chapterItems} from '../areas/signs/catalog'
import {SIGN_CHAPTERS} from '../areas/signs/chapters'
import {filterItems} from '../areas/signs/filter'
import SignFilterBar from '../components/SignFilterBar.vue'
import SignList from '../components/SignList.vue'
import SignSourceNote from '../components/SignSourceNote.vue'
import {useSignFilter} from '../composables/useSignFilter'
import {t} from '../i18n'

/**
 * One chapter of the sign reference: the signs the learner's choice keeps, with their number, name
 * and page. Showing the hidden ones as well is a look at this page only and leaves the choice alone.
 */
const route = useRoute()
const chapter = SIGN_CHAPTERS.find(entry => entry.slug === route.params.chapter)
const all = chapter ? chapterItems(chapter.chapter) : []
const {filter, load, choose} = useSignFilter()
const showAll = ref(false)
const kept = computed(() => filterItems(all, filter.value))
const items = computed(() => showAll.value ? all : kept.value)
onMounted(load)

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
        <RouterLink v-if="chapter.related" :to="`/zeichen/${chapter.related.slug}`">{{ chapter.related.label }}</RouterLink>
      </header>
      <SignFilterBar :filter="filter" :items="all" @choose="choose"/>
      <SignList :items="items"/>
      <div v-if="kept.length < all.length" class="flex flex-wrap items-center gap-3">
        <span v-if="!showAll" class="text-sm text-muted">{{ kept.length ? t('filter.hidden', {count: all.length - kept.length}) : t('filter.none') }}</span>
        <UButton size="sm" color="neutral" variant="outline" :label="showAll ? t('filter.showKept') : t('filter.showAll')"
                 @click="showAll = !showAll"/>
      </div>
      <SignSourceNote/>
    </template>
    <UAlert v-else color="warning" variant="soft" :title="t('notFound.title')"/>
  </div>
</template>
