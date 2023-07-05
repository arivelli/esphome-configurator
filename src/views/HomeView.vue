<script setup>

</script>

<template>
  <main>
    Bienvenidos

    <Input label="Directorio de archivos de configuración"
      value="/public/projects" 
    />
  </main>
</template>
<script>
import Input from '../components/form/Input.vue';
export default {
  components: {
    Input,
  }
}
</script>