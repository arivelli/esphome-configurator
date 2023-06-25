<template>
  <button
    class="actionBtnDestroy ml-1"
    @click="audit(id)">
    <font-awesome-icon icon="times" />
  </button>

</template>

<script>
import { Link } from '@inertiajs/vue3'

export default {
  components: {
    Link: Link,
  },
  props: {
    href: String,
    method: String,
    label: String,
    class: String
  },
  methods: {
    audit(id) {
      this.eventBus.emit("confirm", {
        title: "Auditoría de cambios",
        explanation: "¿Desea realmente eliminar el equipo?",
        icon: ["fas", "exclamation-circle"],
        confirmCB: () => {
          this.$inertia.visit(this.route(this.baseRoute + ".destroy", id), {
            method: "delete",
            data: { id: id },
          });
        },
        cancelCB: () => { },
      });
    },
  },
};
</script>

<style>

</style>
