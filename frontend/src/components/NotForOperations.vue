<script setup lang="ts">
import {t} from '../i18n'
</script>

<template>
  <UAlert color="warning" variant="soft" icon="i-lucide-triangle-alert" :title="t('operations.title')" :description="t('operations.text')"/>
</template>
