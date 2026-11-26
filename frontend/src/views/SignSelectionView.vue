<script setup lang="ts">
import {computed, onMounted} from 'vue'
import {SIGN_ITEMS} from '../areas/signs/catalog'
import {SIGN_CHAPTERS} from '../areas/signs/chapters'
import {filterItems} from '../areas/signs/filter'
import SignFilterBar from '../components/SignFilterBar.vue'
import SignList from '../components/SignList.vue'
import SignSourceNote from '../components/SignSourceNote.vue'
import {useSignFilter} from '../composables/useSignFilter'
import {t} from '../i18n'

/** Every sign the learner's choice keeps, across all chapters, under the chapter it belongs to. */
const {filter, load, choose} = useSignFilter()
onMounted(load)

const kept = computed(() => filterItems(SIGN_ITEMS, filter.value))
const chapters = computed(() => SIGN_CHAPTERS
  .map(chapter => ({chapter, items: kept.value.filter(item => item.chapter === chapter.chapter)}))
  .filter(entry => entry.items.length > 0))
</script>

<template>
  <div class="mx-auto flex max-w-6xl flex-col gap-6">
    <header class="flex flex-col gap-2">
      <RouterLink to="/zeichen" class="text-sm text-muted">{{ t('reference.back') }}</RouterLink>
      <h1 class="headline m-0 text-4xl">{{ t('filter.selectionTitle') }}</h1>
      <p class="m-0 text-lg text-muted">{{ t('filter.selectionIntro') }}</p>
    </header>
    <SignFilterBar :filter="filter" @choose="choose"/>
    <section v-for="entry in chapters" :key="entry.chapter.slug" class="flex flex-col gap-3">
      <h2 class="headline m-0 text-2xl">
        <RouterLink :to="`/zeichen/${entry.chapter.slug}`">{{ entry.chapter.title }}</RouterLink>
      </h2>
      <SignList :items="entry.items"/>
    </section>
    <SignSourceNote/>
  </div>
</template>
