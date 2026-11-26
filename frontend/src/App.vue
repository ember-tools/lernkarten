<script setup lang="ts">
import {AppFooter, AppHeader, EmberboxApp} from '@emberbox/ui'
import {useHead} from '@unhead/vue'
import {computed} from 'vue'
import {RouterLink, RouterView, useRoute} from 'vue-router'
import {t} from './i18n'
import {HAZMAT_PAGES} from './router/hazmat-pages'

const route = useRoute()

/** Public pages are prerendered and set their own title and robots through `usePage`. */
const isPublic = computed(() => route.meta.public === true)

useHead({
  title: () => {
    if (isPublic.value) return undefined
    const key = route.meta.titleKey as string | undefined
    return key ? `${t(key)} – ${t('app.name')}` : t('app.name')
  },
  meta: () => isPublic.value ? [] : [{name: 'robots', content: 'noindex, nofollow'}],
})
</script>

<template>
  <EmberboxApp>
    <AppHeader :name="t('app.name')" :subtitle="t('app.subtitle')" home="/" logo="/favicon.svg">
      <template #nav>
        <RouterLink to="/" class="nav-link">{{ t('nav.landing') }}</RouterLink>
        <RouterLink to="/zeichen" class="nav-link">{{ t('nav.signs') }}</RouterLink>
        <RouterLink to="/gefahrnummern" class="nav-link" :class="{'router-link-exact-active': HAZMAT_PAGES.some(page => page.to === route.path)}">
          {{ t('nav.hazmat') }}
        </RouterLink>
        <RouterLink to="/lernstand" class="nav-link">{{ t('nav.progress') }}</RouterLink>
        <RouterLink to="/hilfe" class="nav-link">{{ t('nav.help') }}</RouterLink>
      </template>
    </AppHeader>

    <main class="mx-auto w-full max-w-6xl grow px-4 py-6 md:px-6">
      <RouterView :key="route.path"/>
    </main>

    <AppFooter tool="Lernkarten" source="https://github.com/ember-tools/lernkarten" license="AGPL-3.0" help="/hilfe"/>
  </EmberboxApp>
</template>

<style scoped>
.nav-link {
  color: var(--ui-text-muted);
  font-size: 15px;
  padding-bottom: 3px;
  border-bottom: 2px solid transparent;
  transition: color 0.15s;
}

.nav-link:hover {
  color: var(--ui-text-highlighted);
}

.nav-link.router-link-exact-active {
  color: var(--ui-text-highlighted);
  font-weight: 600;
  border-bottom-color: var(--ui-signal);
}
</style>
