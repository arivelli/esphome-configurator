<template>
  <BaseButton
    :href="href ? href : ''"
    :label="label"
    icon="trash"
    color="light-black"
    size="medium"
    :class="class"
    @click="action"
  />
</template>

<script>
import BaseButton from "./BaseButton.vue";

export default {
  components: {
    BaseButton: BaseButton,
  },
  props: {
    href: String,
    label: String,
    class: String,
    action: Function,
  },
};
</script>
<style></style>
