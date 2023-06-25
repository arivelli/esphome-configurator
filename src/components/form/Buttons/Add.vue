<template>
  <BaseButton
    color="dark-green"
    :action="action"
    :disabled="disabled"
    :href="href ? href : ''"
    :icon="icon"
    :label="label"
    :size="size"
  />
</template>

<script>
import BaseButton from "./BaseButton.vue";

export default {
  components: {
    BaseButton: BaseButton,
  },
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
<style></style>
