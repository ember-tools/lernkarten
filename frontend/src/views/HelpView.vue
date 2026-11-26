<script setup lang="ts">
import {HelpPage, HelpSection, HelpTopic, usePage} from '@emberbox/ui'

usePage({
  title: 'Hilfe – Lernkarten',
  description: 'So lernst du mit den Lernkarten taktische Zeichen und die Kennzeichnung von Gefahrgut.',
  path: '/hilfe',
})
</script>

<template>
  <HelpPage title="Hilfe zu den Lernkarten" back="/">
    <HelpSection title="Überblick">
      <HelpTopic :paragraphs="[
        'Die Lernkarten helfen beim Lernen der taktischen Zeichen nach den Empfehlungen des BBK und der Kennzeichnung von Gefahrgut nach ADR.',
        'Dein Lernstand bleibt in diesem Browser; es gibt kein Konto und der Server speichert nichts.',
      ]"/>
    </HelpSection>
  </HelpPage>
</template>
