<template>
  <BaseButton :href="href" :label="label" icon="rotate" color="dark-blue" />
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
  },
};
</script>
<style></style>
