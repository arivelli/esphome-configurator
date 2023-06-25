<template>
  <div class="w-full">
    <label
      v-if="label"
      class="block text-sm font-medium text-gray-700"
      :for="id">{{ label }}:</label>
    <p v-if="error" class="mt-2 text-sm text-red-600">
      {{ error }}
    </p>

    <label for="File">File Upload</label>
    <input
      type="file"
      @change="$emit('update:modelValue', $event.target.value);"

      ref="photo"
      class="w-full px-4
          py-2
          mt-2
          border
          rounded-md
          focus:outline-none
          focus:ring-1
          focus:ring-blue-600
      " />
  </div>
</template>
<script>
export default {
  inheritAttrs: false,
  components: {

  },
  props: {
    id: {
      type: Number | String,
    },
    type: {
      type: String,
      default: "text",
    },
    modelValue: Object,
    label: String,
    placeholder: String,
    error: String,
    name: String,
  },
  data() {
    return {
      errorClasses:
        "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50",
      errorMessage: this.error,
    };
  },
  methods: {
    focus() {
      this.$refs.input.focus();
    },
    select() {
      this.$refs.input.select();
    },
    setSelectionRange(start, end) {
      this.$refs.input.setSelectionRange(start, end);
    }
  },
  computed: {
    classes() {
      let classes =
        "relative block w-full pl-3 pr-12 py-2.5 rounded-lg overflow-hidden text-sm text-litepie-secondary-700 placeholder-litepie-secondary-400 transition-colors bg-white border border-litepie-secondary-300 focus:border-litepie-primary-300 focus:ring focus:ring-litepie-primary-500 focus:ring-opacity-10 focus:outline-none dark:bg-litepie-secondary-800 dark:border-litepie-secondary-700 dark:text-litepie-secondary-100 dark:placeholder-litepie-secondary-500 dark:focus:border-litepie-primary-500 dark:focus:ring-opacity-20 border-gray-300";
      if (!this.error) {
        return classes;
      } else {
        return (
          classes +
          " border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50"
        );
      }
    },
  },
};
</script>
