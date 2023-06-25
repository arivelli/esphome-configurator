<template>
  <BaseButton
    :href="href ? href : ''"
    :label="label"
    icon="chevron-left"
    color="light-black"
    size="large"
    @click="goBack"
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
    back: Function,
  },
  methods: {
    goBack() {
      if (this.back) {
        this.back();
      } else {
        window.history.back();
      }
    },
  },
};
</script>
<style></style>
