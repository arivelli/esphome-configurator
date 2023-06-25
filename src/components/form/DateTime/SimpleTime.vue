<template>
  <DateTime
    v-model="dateValue"
    :error="error"
    :label="label"
    :format="userFormat"
    :placeholder="userFormat"
    :minute-step="30"
    :disabled="disabled"
    value-type="format"
    type="time"
  />
</template>
<script setup>
import { computed } from "vue";
import dayjs from "dayjs";
import DateTime from "@/components/form/DateTime/BaseDateTime";
import useDatesComponents from "@/composables/useDatesComponents";
import useDatesFormatted from "@/composables/useDatesFormatted";

const tzLocal = dayjs.tz.guess();

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

const systemFormat = 'HH:mm'
const userFormat = 'HH:mm'
const emit = defineEmits(['update:modelValue', 'update:error'])

const preprocess = (initialTime) => {
  if (!initialTime) {
    return null
  }
  const parts = initialTime.split(':')
  const utcTime = dayjs().utc().hour(parts[0]).minute(parts[1])
  return utcTime.tz(tzLocal).format()
}

const { errorValue } = useDatesComponents(userFormat, systemFormat, props, emit, preprocess)
const { userDate, systemDate } = useDatesFormatted(userFormat, systemFormat);

const dateValue = computed({
  get: () => {
    const userTime = preprocess(props.modelValue);
    return userDate(userTime).value
  },
  set: (value) => {
    // convert time to user timezone
    const parts = value.split(':')
    const userTime = dayjs().hour(parts[0]).minute(parts[1]).format()
    
    emit('update:modelValue', systemDate(userTime))
    emit('update:error', null)
  }
});
</script>
