<template>
  <SwitchGroup as="div" class="
      flex
      items-center
      justify-between
      focus:ring-xima-500
      focus:border-xima-500
      flex-1
      block
      w-full
      rounded-md
      sm:text-sm
      border-gray-300
    ">
    <span class="flex-grow flex flex-col">
      <SwitchLabel as="span" class="text-sm font-medium text-gray-900">{{
          label
      }}</SwitchLabel>
      <SwitchDescription as="span" class="text-sm text-gray-500">{{
          description
      }}</SwitchDescription>
    </span>
    <Switch v-model="model" @click="updateValue" :class="[
      modelValue ? 'bg-xima-600' : 'bg-gray-200',
      'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-xima-500',
    ]">
      <span aria-hidden="true" :class="[
        modelValue ? 'translate-x-5' : 'translate-x-0',
        'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
      ]" />
    </Switch>
  </SwitchGroup>
</template>

<script>
import { ref } from "vue";
import {
  Switch,
  SwitchDescription,
  SwitchGroup,
  SwitchLabel,
} from "@headlessui/vue";

export default {
  components: {
    Switch,
    SwitchDescription,
    SwitchGroup,
    SwitchLabel,
  },
  props: {
    id: Number | String,
    modelValue: Number | String,
    label: String,
    description: String,
    placeholder: String,
    error: String,
  },
  methods: {
    updateValue() {
      this.$emit("update:modelValue", this.modelValue);
    },
  },
  computed: {
    model: {
      get() { return this.modelValue },
      set(newValue) { this.$emit('update:modelValue', newValue) }
    }
  }
};
</script>