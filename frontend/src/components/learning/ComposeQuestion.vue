<script setup lang="ts">
import {
  ABILITIES, BASIC_FORMS, SIGN_ORGANISATIONS, SIGN_SIZES, SUPPLEMENTS, tacticalSignTree,
  type AbilityName, type BasicForm, type SignOrganisation, type SignSize, type Supplement, type TacticalSignSpec,
} from '@emberbox/ui'
import {computed, ref} from 'vue'
import {formName, organisationName, sizeName, supplementName} from '../../areas/signs/catalog'
import {differences, drawn, type Block, type ComposedSign} from '../../areas/signs/compose'
import {t} from '../../i18n'
import SignBackdrop from './SignBackdrop.vue'

/**
 * The construction kit: the learner picks form, organisation, size, supplementary signs and
 * abilities, sees the sign grow, and checks it against the right one block by block.
 */
const props = defineProps<{target: TacticalSignSpec, explanation: string}>()
const emit = defineEmits<{answered: [right: boolean]}>()

const NONE = 'none'

const form = ref<BasicForm>('formation')
const organisation = ref<SignOrganisation | typeof NONE>(NONE)
const size = ref<SignSize | typeof NONE>(NONE)
const supplements = ref<Supplement[]>([])
const abilities = ref<AbilityName[]>([])
const wrong = ref<Block[] | null>(null)

const composed = computed<ComposedSign>(() => ({
  form: form.value,
  organisation: organisation.value === NONE ? undefined : organisation.value,
  size: size.value === NONE ? undefined : size.value,
  supplements: supplements.value,
  abilities: abilities.value,
}))

const forms = BASIC_FORMS.map(value => ({label: formName(value), value}))
const organisations = [{label: t('compose.none'), value: NONE}, ...SIGN_ORGANISATIONS.map(value => ({label: organisationName(value), value}))]
const sizes = [{label: t('compose.none'), value: NONE}, ...SIGN_SIZES.map(value => ({label: sizeName(value), value}))]
const abilityItems = (Object.keys(ABILITIES) as AbilityName[]).map(value => ({label: `${ABILITIES[value].number} ${ABILITIES[value].name}`, value}))

function toggle(supplement: Supplement, on: boolean | 'indeterminate') {
  supplements.value = on === true ? [...supplements.value, supplement] : supplements.value.filter(other => other !== supplement)
}

function check() {
  wrong.value = differences(props.target, composed.value)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="grid gap-4 md:grid-cols-[1fr_auto]">
      <div class="grid gap-3 sm:grid-cols-2">
        <UFormField :label="t('compose.form')"><USelect v-model="form" :items="forms" :disabled="wrong !== null" class="w-full"/></UFormField>
        <UFormField :label="t('compose.organisation')">
          <USelect v-model="organisation" :items="organisations" :disabled="wrong !== null" class="w-full"/>
        </UFormField>
        <UFormField :label="t('compose.size')"><USelect v-model="size" :items="sizes" :disabled="wrong !== null" class="w-full"/></UFormField>
        <UFormField :label="t('compose.abilities')">
          <USelectMenu v-model="abilities" :items="abilityItems" value-key="value" multiple :disabled="wrong !== null" class="w-full"/>
        </UFormField>
        <UFormField :label="t('compose.supplements')" class="sm:col-span-2">
          <div class="flex flex-wrap gap-x-4 gap-y-2">
            <UCheckbox v-for="supplement in SUPPLEMENTS" :key="supplement" :label="supplementName(supplement)" :disabled="wrong !== null"
                       :model-value="supplements.includes(supplement)" @update:model-value="on => toggle(supplement, on)"/>
          </div>
        </UFormField>
      </div>
      <figure class="m-0 flex flex-col items-center gap-1">
        <SignBackdrop :drawing="tacticalSignTree(drawn(composed, target))" :width="180"/>
        <figcaption class="text-sm text-muted">{{ t('compose.yours') }}</figcaption>
      </figure>
    </div>

    <UButton v-if="wrong === null" class="self-end" icon="i-lucide-check" :label="t('compose.check')" @click="check"/>
    <template v-else>
      <UAlert :color="wrong.length ? 'error' : 'success'" variant="soft" :title="wrong.length ? t('question.wrong') : t('question.right')"
              :description="wrong.length ? t('compose.differs', {blocks: wrong.map(block => t(`compose.${block}`)).join(', ')}) : explanation"/>
      <figure v-if="wrong.length" class="m-0 flex flex-col items-start gap-1">
        <SignBackdrop :drawing="tacticalSignTree(target)" :width="180"/>
        <figcaption class="text-sm text-muted">{{ explanation }}</figcaption>
      </figure>
      <UButton class="self-end" icon="i-lucide-arrow-right" trailing :label="t('question.next')" @click="emit('answered', !wrong.length)"/>
    </template>
  </div>
</template>
