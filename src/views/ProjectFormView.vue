<template>
  <div class="about">
    {{ formData }}
    <template v-if="formData">
      <h1>
        {{ formData.esphome.friendly_name ?? fileName }}
      </h1>
      <Card title="Información del proyecto">
        <template v-slot:content>
          <Select v-model="formData.esphome.project.name" size="small" label="Tipo de proyecto" :options="projects" />
          <div class="w-full flex items-end justify-between gap-3">
            <Input type="text" v-model="formData.esphome.friendly_name" size="small" label="Nombre" class="flex-1 " />
            <Refresh @click="rebaseName" label="Actualizar nombre" size="small" class="w-64" />
          </div>
          <Input type="text" v-model="formData.esphome.name" size="small" label="Nombre de identificación" />
          <Input type="text" v-model="formData.esphome.sentence" size="small" label="Descripción" />
          <Input type="text" v-model="formData.esphome.board" size="small" label="Board" :disabled="true" />
          <Input type="text" v-model="formData.esphome.platform" size="small" label="Platform" :disabled="true" />
          <Input type="text" v-model="fileName" size="small" label="Filename" />
        </template>
      </Card>

      <Card title="Plataforma">
        <template v-slot:content>
          <Select v-model="formData.logger.level" size="small" label="Nivel de Log" :options="loggerLevels" />
          <Input type="text" v-model="formData.api.encryption.key" size="small" label="Api encryption key" />
          <Input type="text" v-model="formData.ota.password" size="small" label="OTA password" />
          <input type="hidden" v-model="formData.captive_portal" />
        </template>
      </Card>

      <Card title="Wifi">
        <template v-slot:content>
          <Input type="text" v-model="formData.wifi.ssid" size="small" label="SSID" />
          <Input type="text" v-model="formData.wifi.password" size="small" label="Password" />
          <hr class="mt-5" />
          <h3 class="my-2">Fallback access point</h3>
          <Input type="text" v-model="formData.wifi.ap.ssid" size="small" label="SSID" />
          <Input type="text" v-model="formData.wifi.ap.password" size="small" label="Password" />
        </template>
      </Card>

      <Card v-for="(port, portIndex) in ports" :key="portIndex" :title="'Puerto '+portIndex+': ' + (ports[portIndex])">
        <template v-slot:content>
          <table class="w-full">
            <thead>
              <tr>
                <th>GPIO</th>
                <th class="w-1/4">Tipo</th>
                <th class="w-1/4">SubTipo</th>
                <th class="w-1/4">Nombre</th>
                <th class="w-1/4">ID</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(pin, pinIndex) in port" :key="pinIndex">
                <th class="text-sm">{{ pin }}</th>
                <td><Select
                    v-model="pinesData[pin].type"
                    :searchable="true"
                    size="small"
                    :options="types" /></td>
                <td><Select
                    v-model="pinesData[pin].subType"
                    :searchable="true"
                    size="small"
                    :options="subTypes[pinesData[pin].type]" /></td>
                <td>
                  <Input
                    v-model="pinesData[pin].data.name"
                    @change="pinesData[pin].data.id = id(portIndex, pinIndex, pinesData[pin].data.name)"
                    size="small" />
                </td>
                <td><Input size="small" v-model="pinesData[pin].data.id" :disabled="true" /></td>
              </tr>
            </tbody>
          </table>

        </template>
      </Card>
    </template>
    <div class="w-full text-right">

      <Submit :action="submit" />
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import { ref } from 'vue';
import Input from '../components/form/Input.vue';
import Select from '../components/form/Select.vue';
import Card from '../components/layout/Card.vue';
import { stringifyQuery } from 'vue-router';
import Refresh from '@/components/form/Buttons/Refresh.vue';
import Submit from '@/components/form/Buttons/Submit.vue';

import project from '@/projects/nodemcu-32s_v1.json';

import loggerLevels from '@/entities/loggerLevels.json';
import types from '@/entities/types.json';
import subTypes from '@/entities/subTypes.json';

export default {
  components: {
    axios,
    Input,
    Select,
    Card,
    Refresh,
    Submit,
    project,
    loggerLevels
  },
  data() {
    const projects = [
      {
        value: 'arivelli.nodemcu-32s_v1',
        label: 'NodeMCU-32S V1'
      }
    ];
    let fileName = ref(this.$route.params.fileName);
    let pinesData = {};
    let ports = project.ports;

    return {
      selectedFile: null,
      formData: null,
      types,
      projects,
      fileName,
      pinesData,
      ports,
      loggerLevels,
      types,
      subTypes
    };
  },
  beforeMount() {
    this.openFile(this.$route.params.fileName);
  },
  methods: {
    openFile(fileName) {
      axios
        .get(`http://localhost:3000/files/${fileName}`)
        .then((response) => {
          this.selectedFile = { name: fileName };
          this.fileContent = response.data;
          this.formData = response.data;
          this.esphome2conf();
        })
        .catch((error) => {
          console.log('Error al abrir el archivo:', error);
        });

    },
    rebaseName() {
      const name = this.slugify(this.formData.esphome.friendly_name);
      this.formData.esphome.name = name;
      this.fileName = name;
      this.formData.wifi.ap.ssid = name;
    },
    slugify(text) {
      return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "_") // Replace spaces with -
        .replace(/[^\w-]+/g, "") // Remove all non-word chars
        .replace(/--+/g, "_") // Replace multiple - with single _
        .replace(/^-+/, "") // Trim - from start of text
        .replace(/-+$/, "") // Trim - from end of text
        .replace(/__+/g, "_"); // Replace multiple _ with single _
    },
    esphome2conf() {
      const keys = Object.keys(this.fileContent);

      this.getCleanSchema();
      keys.forEach((key) => {
        //Check if key is an array
        if (Array.isArray(this.fileContent[key])) {
          //Check if array is empty
          this.fileContent[key].forEach((element) => {
            if (typeof element === 'object') {
              let pin = '';
              if (typeof element.pin === 'object') {
                pin = element.pin.number;
              } else {
                if (typeof element.pin != 'undefined' && element.pin != '') {
                  pin = element.pin;
                }
              }
              if ((key == 'light') || (key == 'switch')) {
                pin = this.getGpioFromOutputId(element.output);
              }
              if (pin != '') {
                if (typeof this.pinesData[pin] === 'undefined') {
                  this.pinesData[pin] = {};
                }
                if(typeof this.pinesData[pin].data === 'undefined') {
                  this.pinesData[pin].data = {};
                }
                this.pinesData[pin].data.platform = element.platform;
                this.pinesData[pin].data.pin = element.pin;
                if (this.pinesData[pin].data.id == '') {
                  this.pinesData[pin].data.id = element.id;
                }
                
              }
              if ((key == 'light') || (key == 'switch')) {
                this.pinesData[pin].subType = key;
                this.pinesData[pin].data.name = element.name;
                this.pinesData[pin].data.id = element.id;
                this.pinesData[pin].data.platform = 'output';
              } else {
                this.pinesData[pin].type = key;
                
              }
              if (key == 'binary_sensor') {
                
                this.pinesData[pin].subType = element.platform;
                this.pinesData[pin].data.name = element.name;
              }

            }
          });
        }
      });
      console.log(this.pinesData);
    },
    getGpioFromOutputId(id) {
      const gpio = this.formData.output.find((output) => {
        return output.id === id;
      });
      return gpio.pin;
    },
    getCleanSchema() {
      Object.keys(project.ports).forEach((port) => {
        project.ports[port].forEach((gpio) => {
          this.pinesData[gpio] = {
            data: {
              name: '',
              pin: gpio,
              platform: '',
              type: '',
              id: '',
            },
            type: ''
          }
        });
      });
    },
    conf2esphome() {
      this.formData['output'] = [];
      this.formData['light'] = [];
      this.formData['switch'] = [];
      this.formData['binary_sensor'] = [];
      Object.keys(this.pinesData).forEach((pin) => {
        if (
          (this.pinesData[pin].type == 'output')
          && (this.pinesData[pin].data.name != '')
        ) {
          this.formData['output'].push({
            platform: 'gpio',
            pin: pin,
            id: '__' + this.pinesData[pin].data.id,
          });
          if ((this.pinesData[pin].subType == 'light') || (this.pinesData[pin].subType == 'switch')) {
            this.formData[this.pinesData[pin].subType].push({
              platform: (this.pinesData[pin].subType == 'switch') ? 'output' : 'binary',
              name: this.pinesData[pin].data.name,
              output: '__' + this.pinesData[pin].data.id,
              id: this.pinesData[pin].data.id,
            });
          }
        }
        if (
          (this.pinesData[pin].type == 'binary_sensor')
          && (this.pinesData[pin].data.name != '')
        ) {
          this.formData['binary_sensor'].push({
            platform: 'gpio',
            pin: pin,
            id: this.pinesData[pin].data.id,
            name: this.pinesData[pin].data.name,
          });
        }
      });
    },
    submit() {
      this.conf2esphome();
      axios
        .post(`http://localhost:3000/files/${this.fileName}`, this.formData)
        .then((response) => {
          console.log('Archivo guardado:', response);
        })
        .catch((error) => {
          console.log('Error al guardar el archivo:', error);
        });
    }
  },
  computed: {
    id: {
      get: function () {
        return (port, position, name) => {
          if (name != '') {
            return this.slugify(this.fileName + ' ' + port + ' ' + position + ' ' + name);
          } else {
            return null;
          }
        }
      },
    },
  }
};

</script>

