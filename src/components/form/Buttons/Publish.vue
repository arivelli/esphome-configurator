<template>
  <BaseButton
    :href="href ? href : ''"
    label="Publicar"
    icon="upload"
    size="large"
    method="post"
    :action="submit"
    color="dark-green"
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
<style>

</style>
