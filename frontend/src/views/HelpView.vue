<script setup lang="ts">
import {HelpPage, HelpSection, HelpTopic, usePage} from '@emberbox/ui'
import {t} from '../i18n'

usePage({
  title: 'Hilfe – Lernkarten',
  description: 'So lernst du mit den Lernkarten taktische Zeichen und die Kennzeichnung von Gefahrgut.',
  path: '/hilfe',
})
</script>

<template>
  <HelpPage :title="t('help.title')" back="/">
    <HelpSection :title="t('help.overview')">
      <HelpTopic :paragraphs="[
        'Die Lernkarten helfen beim Lernen der taktischen Zeichen nach den Empfehlungen des BBK und der Kennzeichnung von Gefahrgut nach ADR.',
        'Dein Lernstand bleibt in diesem Browser; es gibt kein Konto und der Server speichert nichts.',
      ]"/>
    </HelpSection>
  </HelpPage>
</template>
