<template>
  <Link
    :href="href"
    :method="method"
    :alt="label"
    as="button"
    class="inline-flex justify-center px-4 py-2 font-semibold text-xs text-white rounded-md shadow-sm border-gray-300 bg-xima-500 hover:bg-xima-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-xima-500 focus:border-xima-500 uppercase"
    :class="class"
    @click="click($event)"
  >
    {{ label }}
  </Link>
</template>

<script>
import { Link } from "@inertiajs/vue3";
export default {
  components: {
    Link: Link,
  },
  props: {
    href: String,
    method: String,
    label: String,
    class: String,
  },
  methods: {
    click(event) {
      event.capture.stop.prevent;
      return false;
    },
  },
};
</script>
<style></style>
