<template>
  <div class="about">
    <template v-if="formData">
      <!-- Highlight h1 title-->
      <h1 class="text-3xl">
        {{ formData.esphome.friendly_name ?? fileName }}
      </h1>
      <Card title="Información del proyecto">
        <template v-slot:content>
          <Select v-model="formData.esphome.project.name" size="small" label="Tipo de proyecto" :options="projects" />
          <input type="hidden" v-model="formData.esphome.project.version" />
          <div class="w-full flex items-end justify-between gap-3">
            <Input type="text" v-model="formData.esphome.friendly_name" size="small" label="Nombre" class="flex-1 " />
            <Refresh @click="rebaseName" label="Actualizar nombre" size="small" class="w-64" />
          </div>
          <Input type="text" v-model="formData.esphome.name" size="small" label="Nombre de identificación" />
          <Input type="text" v-model="formData.esp32.board" size="small" label="Board" :disabled="true" />
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

      <Card v-for="(port, portIndex) in ports" :key="'port_' + portIndex" :title="'Puerto '+portIndex+': ' + (ports[portIndex])"  >
        <template v-slot:content>
          <table class="w-full">
            <thead>
              <tr>
                <th class="w-13">GPIO</th>
                <th class="w-1/6">Tipo</th>
                <th class="w-1/6">SubTipo</th>
                <th class="w-1/6">Nombre</th>
                <th class="w-1/6">ID</th>
                <th>Extra</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(pin, pinIndex) in port" :key="'pin_' + portIndex + '_' + pinIndex" :class="'bg'+pinIndex">
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
                <td><textarea class="w-full p-1 rounded-lg overflow-hidden text-xs text-litepie-secondary-700 
                  placeholder-litepie-secondary-400 transition-colors bg-white border border-litepie-secondary-300 
                  focus:border-litepie-primary-300 focus:ring focus:ring-litepie-primary-500 focus:ring-opacity-10 
                  focus:outline-none focus:fixed focus:inset-0  focus:z-50 focus:w-auto focus:m-20 focus-text-2xl 
                  focus:font-bold focus:font-mono focus:p-3
                  dark:bg-litepie-secondary-800 dark:border-litepie-secondary-700 dark:text-litepie-secondary-100 
                  dark:placeholder-litepie-secondary-500 dark:focus:border-litepie-primary-500 dark:focus:ring-opacity-20 border-gray-300
                   disabled:bg-gray-100" v-model="pinesData[pin].data.extra" /></td>
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
import yaml from 'js-yaml';

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
                if (
                  (typeof element.on_press !== 'undefined') ||
                  (typeof element.on_click !== 'undefined')
                 ) {
                  let extra = {};
                  //add to extra all the keys but filters, id, name, platform, pin
                  Object.keys(element).forEach((key) => {
                    if (['filters', 'id', 'name', 'platform', 'pin'].indexOf(key) == -1) {
                      extra[key] = element[key];
                    }
                  });
                  this.pinesData[pin].data.extra = yaml.dump(extra);
                }
                //console.log(element);
              }
            }
          });
        }
      });
      //console.log(this.pinesData);
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
        let extra = {};
          if(typeof this.pinesData[pin].data.extra !== 'undefined') {
            extra = this.pinesData[pin].data.extra;
            extra = yaml.load(extra, { schema: yaml.JSON_SCHEMA });
          }

        if (
          (this.pinesData[pin].type == 'output')
          && (this.pinesData[pin].data.name != '')
        ) {
          
          this.formData['output'].push({
            platform: 'gpio',
            pin: pin,
            id: '__' + this.pinesData[pin].data.id,
            ...extra
          });
          if ((this.pinesData[pin].subType == 'light') || (this.pinesData[pin].subType == 'switch')) {
            this.formData[this.pinesData[pin].subType].push({
              platform: (this.pinesData[pin].subType == 'switch') ? 'output' : 'binary',
              name: this.pinesData[pin].data.name,
              output: '__' + this.pinesData[pin].data.id,
              id: this.pinesData[pin].data.id,
              ...extra
            });
          }
        }
        if (
          (this.pinesData[pin].type == 'binary_sensor')
          && (this.pinesData[pin].data.name != '')
        ) {
          
          this.formData['binary_sensor'].push({
            platform: 'gpio',
            id: this.pinesData[pin].data.id,
            name: this.pinesData[pin].data.name,
            pin: {
              number: pin,
              inverted: true,
              mode: {
                input: true,
                pullup: true,
              },
            },
            filters: [
              { delayed_on: '150ms' },
              { delayed_off: '150ms' },
            ],
            ...extra
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

<style scoped>
/*Marron*/
.bg0 {
  background-color: #857266;
}
/*Blanco Marron*/
.bg1 {
  background-color: #ccbfb1;
}
/*Verde*/
.bg2 {
  background-color: #3e8d42;
}
/*Blanco Azul*/
.bg3 {
  background-color: #b3d4ff;
}
</style>
