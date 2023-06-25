<template>
  <BaseButton
    :href="href ? href : ''"
    :label="label"
    icon="floppy-disk"
    size="large"
    method="post"
    :action="submit"
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
    submit: Function,
  },
};
</script>
<style></style>
