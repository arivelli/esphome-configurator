<template>
  <div class="w-full h-full">
    <label
      v-if="label"
      class="block text-sm font-medium text-gray-700"
      :for="id"
      >{{ label }}:</label
    >

    <div class="mt-1 relative rounded-md shadow-sm">
      <QuillEditor
        theme="snow"
        v-bind="$attrs"
        toolbar="full"
        contentType="html"
        :content="modelValue ?? ''"
        @update:content="update"
      ></QuillEditor>
      <div
        v-if="error"
        class="absolute inset-y-0 right-0 pr-3 z-20 flex items-center pointer-events-none"
        style="background: rgba(255, 0, 0, 0.1)"
      >
        <font-awesome-icon
          icon="exclamation-circle"
          class="h-5 w-5 text-red-500"
          aria-hidden="true"
        />
      </div>
    </div>
    <p v-if="error" class="mt-2 text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<script>
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import ImageUploader from "quill-image-uploader";

export default {
  components: {
    QuillEditor,
  },

  inheritAttrs: false,
  props: {
    id: Number | String,
    modelValue: String,
    label: String,
    placeholder: String,
    error: String,
  },
  data() {
    return {
      errorClasses:
        "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50",
    };
  },
  setup() {
    const modules = {
      name: "imageUploader",
      module: ImageUploader,
      options: {
        upload: (file) => {
          return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append("image", file);

            axios
              .post("/upload-image", formData)
              .then((res) => {
                resolve(res.data.url);
              })
              .catch((err) => {
                reject("Upload failed");
                console.error("Error:", err);
              });
          });
        },
      },
    };
    return { modules };
  },
  methods: {
    focus() {
      this.$refs.select.focus();
    },
    select() {
      this.$refs.select.select();
    },
    setSelectionRange(start, end) {
      this.$refs.select.setSelectionRange(start, end);
    },
  },
  beforeMount() {
    this.update = _.debounce(async (content) => {
      this.$emit("update:modelValue", content);
    }, 1000);
  },
};
</script>
<style></style>
