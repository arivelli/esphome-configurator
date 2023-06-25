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

const systemFormat = 'YYYY-MM-DD'
const userFormat = 'DD-MM-YYYY'
const emit = defineEmits(['update:modelValue', 'update:error'])

const { dateValue, errorValue } = useDatesComponents(userFormat, systemFormat, props, emit, true)

</script>
<template>
  <DateTime
    v-model="dateValue"
    v-model:error="errorValue"
    :label="label"
    :format="userFormat"
    :placeholder="userFormat"
    :disabled="disabled"
    value-type="format"
    type="date"
  />
</template>