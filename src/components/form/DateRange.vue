<template>
  <div class="w-full">
    <label
      v-if="label"
      class="block text-sm font-medium text-gray-700"
      :for="id"
      >{{ label }}:</label
    >
    <div class="mt-1 relative">
      <date-picker
        language="es"
        :input-class="classes"
        :type="type"
        :disabled="disabled"
        :time-picker-options="timePickerOptions"
        v-model:value="dateValue"
        range
        :placeholder="placeholder"
        @change="updateValue"
      ></date-picker>
      <div v-if="error" class="w-6 float-right relative -mt-8 bg-red-50 mr-3">
        <font-awesome-icon
          icon="exclamation-circle"
          class="h-5 w-5 text-red-500"
          aria-hidden="true"
        />
      </div>
    </div>
    <p v-if="error" class="mt-2 text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<script>
import DatePicker from "vue-datepicker-next";
import "vue-datepicker-next/index.css";
import "vue-datepicker-next/locale/es";
import { ref } from "vue";

export default {
  components: {
    DatePicker,
  },

  props: {
    format: String,
    id: {
      type: Number | String,
    },
    type: {
      type: String,
      default: "text",
    },
    timePickerOptions: {
      default: null,
    },
    minuteStep: {
      default: null,
    },
    modelValue: {
      type: Array,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    label: String,
    placeholder: String,
    error: String,
  },
  setup(props) {
    const dateValue = ref(props.modelValue);
    return {
      dateValue,
    };
  },
  methods: {
    updateValue() {
      this.$emit("update:modelValue", this.dateValue ? this.dateValue : null);
    },
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
<style>
.mx-datepicker {
  width: 100% !important;
  display: block !important;
}

.mx-datepicker:disabled,
.mx-datepicker.disabled,
input:disabled {
  color: #ccc;
  background-color: #f3f3f3;
  border-color: #ccc;
  cursor: not-allowed;
}
</style>
