<template>
  <div v-if="loading">Cargando...</div>
  <form v-else>
    <Card title="Wifi">
      <template v-slot:content>
        <Input type="text" v-model="formData.wifi.ssid" size="small" label="SSID" />
        <Input type="text" v-model="formData.wifi.password" size="small" label="Password" />
      </template>
    </Card>

    <Card title="Home Assistant Access">
      <template v-slot:content>
        <Input type="text" v-model="formData.api.encryption.key" size="small" label="Api encryption key" />
        <Input type="text" v-model="formData.ota.password" size="small" label="OTA Password" />
      </template>
    </Card>
    <div class="w-full text-right">

      <Submit label="Guardar" @click="save" />
    </div>
  </form>
</template>
<script>
import axios from 'axios';
import Input from '../components/form/Input.vue';
import Select from '../components/form/Select.vue';
import Card from '../components/layout/Card.vue';
import Submit from '../components/form/Buttons/Submit.vue';

export default {
  components: {
    axios,
    Input,
    Select,
    Card,
    Submit,
  },
  data() {
    return {
      loading: true,
      formData: {},
    };
  },
  created() {
    axios.get('http://localhost:3000/setup')
      .then(response => {
        this.formData = response.data;
        this.loading = false;
      })
      .catch(error => {
        console.log('Creando el archivo de configuración');

      });
  },
  methods: {
    save() {
      axios.post('http://localhost:3000/setup', this.formData)
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        });
    },
  },
}
</script>
<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
