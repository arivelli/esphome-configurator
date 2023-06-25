<template>
  <BaseButton
    :href="href"
    :label="label"
    :icon="icon ? icon : 'download'"
    color="dark-indigo"
    :fullRequest="true"
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
    icon: String,
  },
};
</script>
<style></style>
