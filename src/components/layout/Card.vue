<template>
  <div
    class="shadow rounded-md overflow-visible bg-white my-4 border"
    :class="highlighted ? 'border-lime-500 shadow-lime-700' : 'border-gray-300'"
  >
    <div
      class="p-4 disabled:opacity-50"
      :class="
        disabled
          ? 'pattern-diagonal-lines pattern-blue-400 pattern-bg-transparent pattern-opacity-20 pattern-size-2'
          : ''
      "
    >
      <div class="mb-4" v-if="title">
        <div class="relative h-8 mb-3">
          <h3 class="absolute left-0 text-xl font-medium text-gray-900">
            {{ title }}
          </h3>
          <div class="float-right flex gap-2 auto-cols-min" v-if="hasButtons">
            <slot name="buttons"></slot>
          </div>
        </div>
        <hr />
      </div>
      <slot name="content"></slot>
    </div>
    <div
      class="flex items-center justify-end px-4 py-3 bg-gray-50 text-right sm:px-6 shadow sm:rounded-bl-md sm:rounded-br-md"
      v-if="hasActions"
    >
      <slot name="actions"></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: String,
    disabled: Boolean,
    highlighted: Boolean,
  },
  computed: {
    hasActions() {
      return !!this.$slots.actions;
    },
    hasButtons() {
      return !!this.$slots.buttons;
    },
  },
};
</script>
