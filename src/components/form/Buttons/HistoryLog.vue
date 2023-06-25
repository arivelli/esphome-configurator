<template>
  <BaseButton
    :href="href"
    :label="label"
    icon="file-waveform"
    color="dark-yellow"
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
  },
};
</script>
<style></style>
