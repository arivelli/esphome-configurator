<template>
  <div class="about">
    <template v-if="formData">
      <h1>
        {{ formData.esphome.friendly_name ?? fileName }}
      </h1>


      <Card v-for="(port, portIndex) in ports" :key="portIndex" :title="'Puerto '+portIndex+': ' + (ports[portIndex])">
        <template v-slot:content>
          <table class="w-full">
            <thead>
              <tr>
                <th class="w-10">GPIO</th>
                <th class="w-32">Color</th>
                <th class="w-1/4">Tipo</th>
                
                <th class="w-1/4">Nombre</th>
                <th class="w-1/4">ID</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(pin, pinIndex) in port" :key="portIndex_pinIndex">
                <th class="text-sm" :class="'bg'+pinIndex">{{ pin }}</th>
                <th class="text-sm" :class="'bg'+pinIndex">{{ color[pinIndex] }}</th>
                <td><Select
                    v-model="pinesData[pin].type"
                    :searchable="true"
                    size="small"
                    :options="types" /></td>

                <td>
                  {{ pinesData[pin].data.name }}
                </td>
                <td>{{ pinesData[pin].data.id }}</td>
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
    const color = ['marron', 'blanco marron', 'verde', 'blanco azul'];
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
      subTypes,
      color
    };
  },
  beforeMount() {
    this.openFile(this.$route.params.fileName);
  },
  methods: {
    openFile(fileName) {
      axios
        .get(`http://192.168.3.100:3000/files/${fileName}`)
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
              if (typeof element.on_click !== 'undefined') {
                let extra = {};
                //add to extra all the keys but filters, id, name, platform, pin
                Object.keys(element).forEach((key) => {
                  if (['filters', 'id', 'name', 'platform', 'pin'].indexOf(key) == -1) {
                    extra[key] = element[key];
                  }
                });
                this.pinesData[pin].data.extra = yaml.dump(extra);
                //console.log(element);
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
        .post(`http://192.168.3.100:3000/files/${this.fileName}`, this.formData)
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
