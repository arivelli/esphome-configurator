<template>
  <Link
    :disabled="disabled"
    :href="href"
    :method="method"
    :title="title ?? label"
    as="button"
    class="inline-flex justify-center items-center font-semibold text-white rounded-md shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 uppercase disabled:opacity-50 disabled:cursor-not-allowed"
    :class="classes"
    @click.capture="callAction($event)"
  >
    <font-awesome-icon
      :icon="icon"
      aria-hidden="true"
      v-if="icon"
      :class="'align-middle icon_' + size"
    />
  </Link>
</template>

<script>
import Link from "@/components/form/Buttons/Link.vue";

export default {
  components: {
    Link: Link,
  },
  props: {
    href: String,
    method: String,
    label: String,
    class: String,
    icon: String,
    size: String,
    color: String,
    action: Function,
    disabled: Boolean,
    fullRequest: Boolean,
    title: String
  },
  setup(props) {
    const size = props.size ? props.size : "medium";
    const color = props.color ? props.color : "dark-xima";
    const classes = size + " " + color + " " + props.class ;
    return {
      href: props.href,
      method: props.method,
      label: props.label,
      classes: classes,
      icon: props.icon ? props.icon : "",
      size: size,
    };
  },
  methods: {
    callAction(event) {
      if (typeof this.action != "undefined") {
        event.preventDefault();
        this.action(event);
      }
      if (this.fullRequest) {
        event.preventDefault();
        location.href = this.href;
      }
    },
  },
};
</script>
<style scoped>
.light-black {
  @apply bg-white hover:bg-gray-200 focus:ring-gray-200 focus:border-gray-200 text-gray-700;
}
.dark-black {
  @apply bg-gray-700 hover:bg-gray-900 focus:ring-gray-700 focus:border-gray-700;
}
.dark-amber {
  @apply bg-amber-500 hover:bg-amber-700 focus:ring-amber-500 focus:border-amber-500;
}
.dark-yellow {
  @apply bg-yellow-500 hover:bg-yellow-700 focus:ring-yellow-500 focus:border-yellow-500;
}
.dark-lime {
  @apply bg-lime-500 hover:bg-lime-700 focus:ring-lime-500 focus:border-lime-500;
}
.dark-green {
  @apply bg-green-500 hover:bg-green-700 focus:ring-green-500 focus:border-green-500;
}
.dark-blue {
  @apply bg-blue-500 hover:bg-blue-700 focus:ring-blue-500 focus:border-blue-500;
}
.dark-indigo {
  @apply bg-indigo-500 hover:bg-indigo-700 focus:ring-indigo-500 focus:border-indigo-500;
}
.dark-purple {
  @apply bg-purple-500 hover:bg-purple-700 focus:ring-purple-500 focus:border-purple-500;
}
.dark-pink {
  @apply bg-pink-500 hover:bg-pink-700 focus:ring-pink-500 focus:border-pink-500;
}
.dark-red {
  @apply bg-red-500 hover:bg-red-700 focus:ring-red-500 focus:border-red-500;
}
.dark-orange {
  @apply bg-orange-500 hover:bg-orange-700 focus:ring-orange-500 focus:border-orange-500;
}
.dark-xima {
  @apply bg-xima-500 hover:bg-xima-700 focus:ring-xima-500 focus:border-xima-500;
}
.small {
  @apply text-xs h-6 gap-1 px-2;
}
.medium {
  @apply text-[13px] h-9 gap-2 px-3;
}
.large {
  @apply text-base h-11 gap-3 px-4;
}
.icon_small {
  @apply h-3 w-3;
}
.icon_medium {
  @apply h-4 w-4;
}
.icon_large {
  @apply h-5 w-5;
}
</style>
