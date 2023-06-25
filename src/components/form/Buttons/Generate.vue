<template>
    <Link :href="href" :method="method" alt="Regenerar" as="button" class="ml-2
      inline-flex
      justify-center
      px-4
      py-2
      mt-3
      border-gray-300
      text-sm
      sm:text-sm
      font-medium
      rounded-md
      shadow-sm
      text-white text-sm
      bg-xima-600
      hover:bg-xima-700
      focus:ring-xima-500 focus:border-xima-500" :class="class">
    {{ label }}
    </Link>

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
    }
};
</script>

<style>

</style>
