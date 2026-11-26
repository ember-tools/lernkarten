<script setup lang="ts">
import {t} from '../i18n'
import {HAZMAT_PAGES} from '../router/hazmat-pages'
</script>

<template>
  <nav :aria-label="t('nav.hazmat')" class="flex flex-wrap gap-2">
    <UButton to="/quellen" size="sm" color="neutral" variant="ghost" :label="t('nav.sources')"/>
    <UButton v-for="link in HAZMAT_PAGES" :key="link.to" :to="link.to" size="sm" color="neutral" variant="outline" active-variant="solid" :label="t(link.key)"/>
  </nav>
</template>
