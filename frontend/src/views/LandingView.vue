<script setup lang="ts">
import {usePage, webApplicationData} from '@emberbox/ui'
import {t} from '../i18n'

const DESCRIPTION = 'Taktische Zeichen nach den Empfehlungen des BBK und die Kennzeichnung von Gefahrgut lernen: '
    + 'mit Lernkarten, Quiz und Nachschlageseiten, für Jugendfeuerwehr und Einsatzabteilung. Kostenlos und ohne Anmeldung.'

usePage({
  title: 'Lernkarten – Taktische Zeichen und Gefahrgut',
  description: DESCRIPTION,
  path: '/',
  structuredData: [webApplicationData({name: 'Lernkarten', description: DESCRIPTION})],
})
</script>

<template>
  <div class="mx-auto flex max-w-5xl flex-col gap-10 py-4">
    <section class="flex max-w-3xl flex-col gap-3">
      <p class="eyebrow">{{ t('app.name') }}</p>
      <h1 class="headline m-0 text-4xl md:text-5xl">{{ t('landing.title') }}</h1>
      <p class="m-0 text-lg text-muted">{{ DESCRIPTION }}</p>
    </section>
  </div>
</template>
