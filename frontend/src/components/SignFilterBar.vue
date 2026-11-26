<script setup lang="ts">
import {computed, useId, type ComputedRef} from 'vue'
import {SIGN_ITEMS, type SignItem} from '../areas/signs/catalog'
import {CHOSEN_SERVICES, filterItems} from '../areas/signs/filter'
import {STAGES, type Service, type SignFilter, type Stage} from '../areas/signs/tags'
import {t} from '../i18n'

/**
 * The choice of services and stage above a list of signs: each service toggles on its own, the
 * stage is one of three and includes those before it. It says how many of the given signs, by
 * default all of them, the choice keeps.
 */
const props = withDefaults(defineProps<{
  filter: SignFilter
  items?: readonly SignItem[]
}>(), {items: () => SIGN_ITEMS})

const shown: ComputedRef<number> = computed(() => filterItems(props.items, props.filter).length)

const emit = defineEmits<{choose: [filter: SignFilter]}>()

const servicesId = useId()
const stageId = useId()

function toggle(service: Service) {
  const services = props.filter.services.includes(service)
    ? props.filter.services.filter(entry => entry !== service)
    : [...props.filter.services, service]
  emit('choose', {...props.filter, services})
}

function setStage(stage: Stage) {
  emit('choose', {...props.filter, stage})
}
</script>

<template>
  <section class="flex flex-col gap-3 rounded-(--ui-radius) border border-default p-4" :aria-label="t('filter.label')">
    <div class="flex flex-col gap-2">
      <span :id="servicesId" class="text-sm font-medium">{{ t('filter.services') }}</span>
      <div class="flex flex-wrap gap-2" role="group" :aria-labelledby="servicesId">
        <UButton v-for="service in CHOSEN_SERVICES" :key="service" size="sm"
                 :color="filter.services.includes(service) ? 'primary' : 'neutral'"
                 :variant="filter.services.includes(service) ? 'solid' : 'outline'"
                 :aria-pressed="filter.services.includes(service)"
                 :label="t(`filter.service.${service}`)" @click="toggle(service)"/>
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <span :id="stageId" class="text-sm font-medium">{{ t('filter.stage') }}</span>
      <UFieldGroup role="group" :aria-labelledby="stageId">
        <UButton v-for="stage in STAGES" :key="stage" size="sm"
                 :color="filter.stage === stage ? 'primary' : 'neutral'"
                 :variant="filter.stage === stage ? 'solid' : 'outline'"
                 :aria-pressed="filter.stage === stage"
                 :label="t(`filter.stageName.${stage}`)" @click="setStage(stage)"/>
      </UFieldGroup>
    </div>
    <p class="m-0 text-sm text-muted" aria-live="polite">{{ t('filter.count', {shown, total: items.length}) }} {{ t('filter.always') }}</p>
  </section>
</template>
