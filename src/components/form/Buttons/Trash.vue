<template>
  <BaseButton
    :color="color"
    :action="action"
    :disabled="disabled"
    :href="href ? href : ''"
    :icon="icon"
    :label="label"
    :size="size"
    :title="title"
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
      default: "trash",
    },
    label: {
      type: String,
      default: "Eliminar",
    },
    title: {
      type: String,
      default: "Eliminar",
    },
    size: {
      type: String,
      default: "medium",
    },
    color: {
      type: String,
      default: "light-black",
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
