<template>
  <div :class="containerClass">
    <label
      v-if="label"
      class="block text-sm font-medium text-gray-700"
      :for="id">{{ label }}:</label>

    <div class="relative rounded-md shadow-sm">
      <Multiselect
        ref="select"
        v-bind="$attrs"
        :placeholder="placeholder"
        v-model="model"
        :class="classes"
        @click="$emit('update:error', undefined)" />
      <div
        v-if="error"
        class="absolute inset-y-0 right-0 pr-3 z-20 flex items-center pointer-events-none"
        style="background: rgba(255, 0, 0, 0.1)">
        <font-awesome-icon
          icon="exclamation-circle"
          class="h-5 w-5 text-red-500"
          aria-hidden="true" />
      </div>
    </div>
    <p v-if="error" class="mt-2 text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<script>
/*
        class="block w-full focus:outline-none sm:text-sm rounded-md h-6"
        :class="error ? classes + ' ' + errorClasses : classes"
:classes="{
          container:
            'relative mx-auto items-center justify-end box-border cursor-pointer border border-gray-300 rounded-md bg-white text-base leading-snug outline-none h-9 ' +
            containerClass,
          containerOpen:
            'outline-none text-gray-900 placeholder-gray-400 ring-1 ring-xima-500 border-xima-500',
          containerOpenTop: '',
          containerActive: '',
          dropdown:
            'max-h-60 absolute -left-px -right-px -bottom-1 transform translate-y-full border border-gray-300 -mt-px overflow-y-scroll z-50 bg-white flex flex-col rounded-md',
          dropdownTop:
            '-translate-y-full top-px bottom-auto rounded-b-none rounded-md',
          dropdownHidden: 'hidden',
          search:
            'w-full  appearance-none border-0 text-base font-sans h-7 focus:ring-0',
          option:
            'flex items-center justify-start box-border text-left cursor-pointer text-base leading-snug py-1 px-2',
          optionSelected: 'text-white bg-xima-500 rounded-md',
          optionSelectedPointed: 'text-white bg-xima-700 rounded-md',
        }"
*/
import Multiselect from "@vueform/multiselect";

export default {
  components: {
    Multiselect,
  },

  inheritAttrs: false,
  props: {
    id: Number | String,
    modelValue: Number | String,
    label: String,
    placeholder: String,
    error: String,
    class: String,
    size: {
      type: String,
      default: "medium",
    },
  },
  data(props) {
    return {
      errorClasses: "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50",
      classes: props.size + ' ' + props.class,
      containerClass: "w-full " + props.class
    }
  },
  computed: {
    model: {
      get() {
        return this.modelValue;
      },
      set(newValue) {
        this.$emit("update:modelValue", newValue);
        this.$emit("update:error", undefined);
      },
    },
  },
  methods: {
    focus() {
      this.$refs.select.focus();
    },
    select() {
      this.$refs.select.select();
    },
    setSelectionRange(start, end) {
      this.$refs.select.setSelectionRange(start, end);
    },
  },
};
</script>

<style src="@/assets/multiselect.css" />
<style scoped>
.small {
  @apply text-xs h-6;
}

.medium {
  @apply text-sm h-9;
}

.large {
  @apply text-base h-11;
}
</style>
