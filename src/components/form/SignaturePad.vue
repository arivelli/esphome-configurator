<template>
  <div>
    <label
      v-if="label"
      class="block text-sm font-medium text-gray-700"
      :for="id"
      >{{ label }}:
    </label>
    <signature-pad
      :modelValue="signatureDataURL"
      @input="onInput"
      :height="300"
      :customStyle="{
        border: 'black 2px solid',
        'border-radius': '0.375rem',
        width: '100%',
      }"
      saveType="image/svg+xml"
      saveOutput="data_url"
      ref="signaturePad"
    >
    </signature-pad>
    <div class="mt-3 text-right">
      <Clear label="Limpiar" size="small" :action="clearSignature" />
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import SignaturePad from "vue3-signature-pad";
import Clear from "@/components/form/Buttons/Clear.vue";
export default {
  name: "Signature",
  components: {
    SignaturePad,
    Clear,
  },
  props: {
    label: String,
    id: {
      type: Number | String,
    },
    modelValue: String,
  },
  setup(props) {
    const signatureDataURL = ref(null);
    const signatureFile = ref(null);
    const signaturePad = ref(null);

    const getSignaturePad = () => {
      if (!signaturePad.value) {
        throw new Error("No signature pad ref could be found");
      }
      return signaturePad.value;
    };

    const clearSignature = () => {
      getSignaturePad().clearSignature();
    };

    const saveSignature = () => {
      const signature = getSignaturePad().saveSignature();

      return signature;
    };
    /*
    const onInput = (value) => {
      console.log("calling on input", value);
      this.emit("update:modelValue", value);
      if (!value) {
        signatureDataURL.value = null;
        signatureFile.value = null;
      } else if (value instanceof File) {
        signatureDataURL.value = null;
        signatureFile.value = value;
      } else {
        signatureDataURL.value = value;
        signatureFile.value = null;
      }
    };*/
    return {
      // state
      signaturePad,
      signatureDataURL,
      signatureFile,
      // methods
      clearSignature,
      saveSignature,
      //onInput,
    };
  },
  methods: {
    onInput(value) {
      this.$emit("update:modelValue", value);
    },
  },
  mounted() {
    this.signaturePad.fromDataURL(this.modelValue);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
