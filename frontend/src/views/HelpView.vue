<script setup lang="ts">
import {HelpPage, HelpSection, HelpTopic, usePage} from '@emberbox/ui'
import {t} from '../i18n'

usePage({
  title: 'Hilfe – Lernkarten',
  description: 'So lernst du mit den Lernkarten: Zeichen nach Fachdienst und Ausbildungsstand auswählen, Fächer und Wiederholung, Quiz, Lernstand sichern und übertragen, Zeichen zusammensetzen und Warntafeln lesen.',
  path: '/hilfe',
})
</script>

<template>
  <HelpPage :title="t('help.title')" back="/">
    <HelpSection :title="t('help.overview')">
      <HelpTopic :paragraphs="[
        'Die Lernkarten helfen beim Lernen der taktischen Zeichen nach den Empfehlungen des BBK von 2024 und der Kennzeichnung von Gefahrgut nach ADR 2025.',
        'Bei den taktischen Zeichen wählst du deine Fachdienste und deinen Ausbildungsstand: Jugendfeuerwehr, Einsatzabteilung für Truppmann und Truppführer, oder Führung für Gruppen- und Zugführer. Gelernt werden die Zeichen, die dazu passen, und die, die für alle Organisationen gelten. Beim Gefahrgut sind die Karten in Stapel nach diesen Stufen sortiert, dazu ein Stapel mit allem.',
      ]"/>
    </HelpSection>

    <HelpSection :title="t('help.learn')">
      <HelpTopic :title="t('help.boxes')" :paragraphs="[
        'Lernen arbeitet mit fünf Fächern. Eine neue Karte, die du richtig beantwortest, kommt ins zweite Fach und ist morgen wieder dran. Jede weitere richtige Antwort schiebt sie ein Fach weiter: nach drei, sieben und vierzehn Tagen.',
        'Eine falsche Antwort schickt die Karte zurück ins erste Fach. Sie kommt am Ende derselben Runde noch einmal, bis du sie richtig hast.',
        'Eine Runde fragt erst die fälligen Karten, die aus den unteren Fächern zuerst, dann neue Karten, höchstens zwanzig. Warten danach noch Karten, beginnst du gleich die nächste Runde; sind weder fällige noch neue Karten übrig, ist für heute nichts mehr zu tun.',
      ]"/>
      <HelpTopic :title="t('help.answers')" :paragraphs="[
        'Meist wählst du aus vier Antworten, als Text oder als Bild. Nach der Antwort siehst du, was richtig ist, mit einer kurzen Erklärung oder der Quelle.',
        'Bei Karteikarten drehst du die Karte um und sagst selbst, ob du es gewusst hast.',
      ]"/>
      <HelpTopic :title="t('help.quiz')" :paragraphs="[
        'Ein Quiz stellt zehn oder zwanzig Fragen aus einem Stapel in zufälliger Reihenfolge, ohne Zeitdruck. Am Ende stehen das Ergebnis und die falsch beantworteten Fragen mit der richtigen Lösung.',
        'Ein Quiz ändert nichts an deinen Fächern; du kannst es so oft wiederholen, wie du willst.',
      ]"/>
    </HelpSection>

    <HelpSection :title="t('help.progress')">
      <HelpTopic :paragraphs="[
        'Dein Lernstand bleibt in diesem Browser auf diesem Gerät. Es gibt kein Konto, und der Server speichert nichts.',
        'Unter „Lernstand“ siehst du für deine Auswahl an Zeichen und für jeden Gefahrgut-Stapel, wie viele Karten in welchem Fach liegen und wie viele fällig sind; bei den Zeichen steht darunter, was jeder gewählte Fachdienst dazu beiträgt. Dort setzt du eine Auswahl oder einen Stapel auch zurück. Eine Karte gehört zu einem Zeichen und einer Aufgabe, nicht zu einer Auswahl: Wechselst du die Auswahl, bleibt ihr Fach erhalten, und Zurücksetzen gilt für sie überall.',
        'Deine Auswahl an Zeichen merkt sich der Browser ebenfalls. Sie steht auch in der Adresse, damit du sie weitergeben kannst.',
        'Um auf einem anderen Gerät weiterzulernen, speichere den Lernstand als Datei und öffne sie dort. Der Lernstand des anderen Geräts wird dabei ersetzt.',
        'Löschst du die Daten deines Browsers für diese Seite, ist der Lernstand weg, wenn du ihn nicht als Datei gesichert hast.',
      ]"/>
    </HelpSection>

    <HelpSection :title="t('help.signs')">
      <HelpTopic :title="t('help.compose')" :paragraphs="[
        'Im Baukasten setzt du ein Zeichen aus Grundform, Organisation, Größenordnung, Ergänzungszeichen und Fähigkeiten zusammen. Dein Zeichen wächst dabei mit.',
        'Geprüft werden die Bausteine, nicht das Bild. Die Reihenfolge der Fähigkeiten spielt keine Rolle, und Kurzbezeichnungen und Beschriftungen wie „ELW 1“ oder „GF“ setzt der Baukasten selbst ein. Ist etwas falsch, siehst du, welcher Baustein, und das richtige Zeichen.',
      ]"/>
      <HelpTopic :title="t('help.lookUp')" :paragraphs="[
        'Unter „Zeichen“ stehen alle Zeichen der Empfehlungen nach Kapiteln, mit Nummer, Bezeichnung und Seite. Die Auswahl nach Fachdienst und Ausbildungsstand blendet aus, was du nicht brauchst; „Meine Auswahl“ zeigt alle passenden Zeichen auf einer Seite.',
        'Gruppenführer, Maschinist, Melder und die Trupps führen die Empfehlungen nicht als eigene Zeichen. Unter „Die Gruppe der Feuerwehr“ sind sie nach deren Systematik zusammengesetzt; dazu gibt es Fragen, wer zur Gruppe gehört und wer was zuerst tut, nach der FwDV 3.',
      ]"/>
    </HelpSection>

    <HelpSection :title="t('help.hazmat')">
      <HelpTopic :title="t('help.plate')" :paragraphs="[
        'Auf der orangefarbenen Warntafel steht oben die Gefahrnummer und unten die UN-Nummer. Die Gefahrnummer beschreibt die Gefahr, die UN-Nummer den Stoff.',
        'Nach jeder Antwort zu einer Tafel oder Gefahrnummer wird die Gefahrnummer zerlegt: was ihre Bedeutung nach ADR ist und was die einzelnen Ziffern, eine verdoppelte Ziffer, die 0 und ein vorangestelltes X bedeuten.',
      ]"/>
      <HelpTopic :title="t('help.lookUp')" :paragraphs="[
        'Unter „Gefahrgut“ findest du alle Gefahrnummern, alle Gefahrzettel und die Suche nach UN-Nummern.',
      ]"/>
    </HelpSection>

    <HelpSection :title="t('help.sources')">
      <HelpTopic :paragraphs="[
        'Die Inhalte folgen den Empfehlungen des BBK zu taktischen Zeichen (2024), der FwDV 3 (2008), dem ADR 2025 und der FwDV 500 (2022). Die Zeichen sind nach diesen Vorlagen selbst gezeichnet.',
        'Die Lernkarten sind zum Lernen da, nicht für den Einsatz. Im Einsatz zählen die Beförderungspapiere, die schriftlichen Weisungen, die Leitstelle, Fachberater und die Vorgaben deiner Feuerwehr. Länder und Wehren können Abweichendes regeln.',
      ]">
        <template #content>
          <RouterLink to="/quellen">{{ t('help.allSources') }}</RouterLink>
        </template>
      </HelpTopic>
    </HelpSection>
  </HelpPage>
</template>
