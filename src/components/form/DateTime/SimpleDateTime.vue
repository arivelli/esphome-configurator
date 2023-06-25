<script setup>
import DateTime from "@/components/form/DateTime/BaseDateTime";
import useDatesComponents from "@/composables/useDatesComponents";

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: String,
  error: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
})

const systemFormat = 'YYYY-MM-DD HH:mm'
const userFormat = 'DD-MM-YYYY HH:mm'
const emit = defineEmits(['update:modelValue', 'update:error'])

const { dateValue, errorValue } = useDatesComponents(userFormat, systemFormat, props, emit)
</script>
<template>
  <DateTime
    v-model="dateValue"
    v-model:error="errorValue"
    :label="label"
    :format="userFormat"
    :placeholder="userFormat"
    :minute-step="30"
    :disabled="disabled"
    value-type="format"
    type="datetime"
  />
</template>
