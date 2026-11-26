<script setup lang="ts">
import {CATALOG_SOURCE} from '@emberbox/ui'
import NoteText from './NoteText.vue'
import {t} from '../i18n'

/** The source of the sign reference with a link to the sources page, under every list of signs. */
</script>

<template>
  <NoteText>{{ t('reference.source', {source: CATALOG_SOURCE}) }} <RouterLink to="/quellen">{{ t('nav.sources') }}</RouterLink></NoteText>
</template>
