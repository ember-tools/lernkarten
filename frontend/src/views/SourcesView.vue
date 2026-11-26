<script setup lang="ts">
import {CATALOG_SOURCE, usePage} from '@emberbox/ui'
import {HAZARD_SOURCE} from '../areas/hazmat/data'
import NotForOperations from '../components/NotForOperations.vue'
import NoteText from '../components/NoteText.vue'
import META from '../data/hazmat/meta.json'
import {t} from '../i18n'
import {germanDay} from '../learning/leitner'

usePage({
  title: 'Quellen – Lernkarten',
  description: 'Woher die Inhalte der Lernkarten stammen: Empfehlungen des BBK zu taktischen Zeichen, FwDV 3, ADR 2025, FwDV 500 und die Liste der UN-Nummern.',
  path: '/quellen',
})

/** The sources, each with what the tool takes from it and how. */
const SOURCES = [
  {key: 'bbk', title: CATALOG_SOURCE, url: 'https://lv-saarland.drk.de/fileadmin/user_upload/Taktische_Zeichen_im_Bev%C3%B6lkerungsschutz_Druck_A5.pdf'},
  {key: 'notes', title: 'BBK: Begleitende Hinweise zur überarbeiteten Auflage der Empfehlungen für Taktische Zeichen, 12.02.2024', url: 'https://lv-saarland.drk.de/fileadmin/user_upload/Begleitende_Hinweise_zur_%C3%9Cberarbeitung.pdf'},
  {key: 'skk', title: 'Ständige Konferenz für Katastrophenvorsorge und Katastrophenschutz (SKK): Empfehlungen für Taktische Zeichen im Bevölkerungsschutz, 2010, korrigierte 2. Auflage 2012', url: 'https://hlfs.hessen.de/sites/hlfs.hessen.de/files/2022-09/TaktischeZeichen_SKK_0.pdf'},
  {key: 'fwdv3', title: 'Feuerwehr-Dienstvorschrift 3 „Einheiten im Lösch- und Hilfeleistungseinsatz“, Stand Februar 2008', url: 'https://www.nlbk.niedersachsen.de/download/192510'},
  {key: 'adrNumbers', title: HAZARD_SOURCE.text, url: HAZARD_SOURCE.url},
  {key: 'adrLabels', title: 'ADR 2025, Kapitel 5.2 (Gefahrzettel, Kennzeichen für umweltgefährdende Stoffe)', url: 'https://www.gefahrgutshop.de/fileadmin/pdfs/ADR_2025/Gefahrgutshop_ADR_2025_Kapitel_5-2_Kennzeichnung-und-Bezettelung-Versandstuecke.pdf'},
  {key: 'fwdv', title: 'Feuerwehr-Dienstvorschrift 500 „Einheiten im ABC-Einsatz“, Stand Januar 2022', url: 'https://www.nlbk.niedersachsen.de/download/192517'},
  {key: 'un', title: `Liste der UN-Nummern, Wikipedia, über chemie.de, Stand ${germanDay(META.date)}`, url: META.source},
] as const
</script>

<template>
  <div class="mx-auto flex max-w-4xl flex-col gap-6">
    <header class="flex flex-col gap-2">
      <h1 class="headline m-0 text-4xl">{{ t('sources.title') }}</h1>
      <p class="m-0 text-lg text-muted">{{ t('sources.intro') }}</p>
    </header>
    <NotForOperations/>
    <UCard v-for="source in SOURCES" :key="source.key">
      <div class="flex flex-col gap-2">
        <h2 class="headline m-0 text-lg">{{ source.title }}</h2>
        <p class="m-0">{{ t(`sources.${source.key}`) }}</p>
        <a :href="source.url" rel="noopener" target="_blank" class="text-sm">{{ t('sources.open') }}</a>
        <NoteText v-if="source.key === 'un'">
          {{ t('sources.unLicence') }}
          <a :href="META.origin" rel="noopener" target="_blank">{{ t('un.wikipedia') }}</a> ·
          <a :href="META.authors" rel="noopener" target="_blank">{{ t('un.authors') }}</a> ·
          <a href="https://www.gnu.org/licenses/fdl.html" rel="noopener" target="_blank">{{ t('un.licence') }}</a>
        </NoteText>
      </div>
    </UCard>
    <NoteText>{{ t('sources.free') }} <a href="https://github.com/ember-tools/lernkarten/issues" rel="noopener" target="_blank">{{ t('sources.issues') }}</a></NoteText>
  </div>
</template>
