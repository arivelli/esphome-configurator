<template>
  <div class="w-full">
    <label
      v-if="label"
      class="block text-sm font-medium text-gray-700"
      :for="id"
      >{{ label }}:</label
    >
    <p v-if="error" class="mt-2 text-sm text-red-600">
      {{ error }}
    </p>
    <media-library-collection
      :name="name"
      :initial-value="modelValue"
      :validation-errors="errorMessage"
      @change="$emit('update:modelValue', newValue);$emit('update:error', undefined);"
      :translations="{
        fileTypeNotAllowed: 'Debe cargar un archivo de tipo',
        tooLarge: 'Archivo demasiado grande, max',
        tooSmall: 'Archivo demasiado pequeño, min',
        tryAgain: 'por favor, intente subir este archivo de nuevo',
        somethingWentWrong: 'Algo salió mal al subir este archivo',
        selectOrDrag: 'Seleccione o arrastre archivos',
        selectOrDragMax: 'Seleccione o arrastre el máximo {maxItems} {file}',
        file: { singular: 'archivo', plural: 'archivos' },
        anyImage: 'cualquier imagen',
        anyVideo: 'cualquier video',
        goBack: 'Volver',
        dropFile: 'Suelte el archivo para cargarlo',
        dragHere: 'Arrastre el archivo aquí',
        remove: 'Eliminar',
        download: 'Descargar',
        name: 'Nombre',
      }"
    />
  </div>
</template>
<script>
import { MediaLibraryCollection } from "media-library-pro-vue3-collection";

export default {
  inheritAttrs: false,
  components: {
    MediaLibraryCollection,
  },
  props: {
    id: {
      type: Number | String,
    },
    type: {
      type: String,
      default: "text",
    },
    modelValue: Object,
    label: String,
    placeholder: String,
    error: String,
    name: String,
  },
  data() {
    return {
      errorClasses:
        "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50",
      errorMessage: this.error,
    };
  },
  methods: {
    focus() {
      this.$refs.input.focus();
    },
    select() {
      this.$refs.input.select();
    },
    setSelectionRange(start, end) {
      this.$refs.input.setSelectionRange(start, end);
    }
  },
  computed: {
    classes() {
      let classes =
        "relative block w-full pl-3 pr-12 py-2.5 rounded-lg overflow-hidden text-sm text-litepie-secondary-700 placeholder-litepie-secondary-400 transition-colors bg-white border border-litepie-secondary-300 focus:border-litepie-primary-300 focus:ring focus:ring-litepie-primary-500 focus:ring-opacity-10 focus:outline-none dark:bg-litepie-secondary-800 dark:border-litepie-secondary-700 dark:text-litepie-secondary-100 dark:placeholder-litepie-secondary-500 dark:focus:border-litepie-primary-500 dark:focus:ring-opacity-20 border-gray-300";
      if (!this.error) {
        return classes;
      } else {
        return (
          classes +
          " border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50"
        );
      }
    },
  },
};
</script>

<style>
@import "media-library-pro-styles";
.media-library-dropzone-add {
  border-radius: 10px !important;
  border-color: #75c0d4 !important;
  background: #f6fdfd !important;
}
.media-library-dropzone-add:hover {
  background: #e1f3f5 !important;
  border-radius: 10px !important;
}
.media-library-listerrors {
  border-radius: 10px;
  margin-bottom: 10px;
}
.media-library-multiple .media-library-items {
  border-radius: 10px !important;
  border-color: #75c0d4 !important;
  margin-bottom: 10px;
}
.media-library-item {
  background: transparent;
}
.media-library-row-drag {
  background: #f6fdfd !important;
}
.media-library-input {
  background: #e1f3f5 !important;
}
.media-library-filled.media-library-sortable
  .media-library-add
  .media-library-dropzone:before,
.media-library-multiple.media-library-empty
  .media-library-add
  .media-library-placeholder:after {
  background: #e1f3f5 !important;
}
.media-library-item.media-library-item-row:first-of-type
  .media-library-row-drag {
  border-radius: 8px 0 0 0;
}
.media-library-item.media-library-item-row:last-of-type
  .media-library-row-drag {
  border-radius: 0 0 0 8px;
}
</style>