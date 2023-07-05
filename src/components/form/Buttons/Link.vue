<template>
    <a type="button"
    :disabled="disabled"
    class="inline-flex justify-center items-center font-semibold text-white rounded-md shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 uppercase disabled:opacity-50 disabled:cursor-not-allowed "
    :href="href"
    @click.capture="callAction($event)"
    >
    <slot></slot>
    {{ title }}
  </a>
</template>

<script>
export default {
  props: {
    action: Function,
    disabled: {
      type: Boolean,
      default: false,
    },
    href: String,
    icon: {
      type: String,
      default: "plus",
    },
    label: {
      type: String,
      default: "Agregar",
    },
    size: {
      type: String,
      default: "medium",
    },
    title: {
      type: String,
      default: "Agregar",
    },
  },
  methods: {
    callAction() {
      if (typeof this.action != "undefined") {
        this.action();
      }
    },
  },
};
</script>
