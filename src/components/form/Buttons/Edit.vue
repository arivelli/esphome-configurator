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
      default: "file-pen",
    },
    label: {
      type: String,
      default: "Editar",
    },
    size: {
      type: String,
      default: "medium",
    },
  },
};
</script>
<style></style>
