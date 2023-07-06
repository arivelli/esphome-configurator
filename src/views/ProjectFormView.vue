<template>
  <div class="about">

    {{ formData }}
    <template v-if="formData">
      <h1>
      {{ formData.esphome.friendly_name ?? fileName}}
    </h1>
      <Card title="Información del proyecto">
        <template v-slot:content>
          <div class="w-full flex items-end justify-between gap-3">
            <Input type="text" v-model="formData.esphome.friendly_name" size="small" label="Nombre"  class="flex-1 "/> 
            <Refresh @click="rebaseName" label="Actualizar nombre" size="small" class="w-64"  />
          </div>
          <Input type="text" v-model="formData.esphome.name" size="small" label="Nombre de identificación" />
          <Input type="text" v-model="formData.esphome.sentence" size="small" label="Description" />
          <Select v-model="formData.esp32.board" size="small" label="Board" :options="boards" />
          <input type="hidden" v-model="formData.esp32.framework.type"  />
          <Input type="text" v-model="fileName" size="small" label="Filename" />
        </template>
      </Card>

      <Card title="Plataforma">
        <template v-slot:content>
          <Select v-model="formData.logger.level" size="small" label="Nivel de Log" :options="loggerLevels" />
          <Input type="text" v-model="formData.api.encryption.key" size="small" label="Api encryption key" />
          <Input type="text" v-model="formData.ota.password" size="small" label="OTA password" />
          <input type="hidden" v-model="formData.captive_portal"  />
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

      <Card v-for="(port, portIndex) in pinesSetup" :key="portIndex" :title="'Puerto: ' + (ports[portIndex])">
        <template v-slot:content>
          <table class="w-full">
            <thead>
              <tr>
                <th>GPIO</th>
                <th class="w-1/3">Typo</th>
                <th class="w-1/3">Name</th>
                <th class="w-1/3">ID</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(pin, pinIndex) in port" :key="pinIndex">
                <td>{{ pin }}</td>
                <td><Select
                    :value="getType(pin)"
                    :searchable="true"
                    size="small"
                    :options="types" /></td>
                <td>
                  <Input
                    size="small"
                    :value="getName(pin)" />
                </td>
                <td><Input size="small" :value="id(pin, portIndex, pinIndex)" :disabled="true"/></td>
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


export default {
  components: {
    axios,
    Input,
    Select,
    Card,
    Refresh,
    Submit
  },
  data() {
    const types = [
      {
        value: 'light',
        label: 'Light switch'
      },
      {
        value: 'switch',
        label: 'Common switch'
      },
      {
        value: 'binary_sensor',
        label: 'binary sensor / key'
      }
    ];
    const boards = [
      {
        value: 'ESP8266',
        label: 'ESP8266'
      },
      {
        value: 'nodemcu-32s',
        label: 'NodeMCU-32S'
      }
    ];
    const pinesSetup = ref(
      [
        [
          'GPIO23', 'GPIO19', 'GPIO22', 'GPIO21'
        ], [
          'GPIO18', 'GPIO04', 'GPIO17', 'GPIO16'
        ], [
          'GPIO32', 'GPIO26', 'GPIO33', 'GPIO25'
        ], [
          'GPIO27', 'GPIO13', 'GPIO14', 'GPIO12'
        ], [
          'GPIO00', 'GPIO05', 'GPIO02', 'GPIO15'
        ], [
          'GPIO34', 'GPIO39', 'GPIO35', 'GPIO36'
        ]
      ]
    );
    const ports = {
      0: '1',
      1: '2',
      2: '3',
      3: '4',
      4: 'IN',
      5: 'AUX'
    }
    const loggerLevels =  [
      {
        value: 'VERY_VERBOSE',
        label: 'Very verbose'
      },
    ]
    let fileName = ref(this.$route.params.fileName);
    return {
      selectedFile: null,
      formData: null,
      types,
      boards,
      pinesSetup,
      ports,
      loggerLevels,
      fileName
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
          this.formData = ref(response.data);
        })
        .catch((error) => {
          console.log('Error al abrir el archivo:', error);
        });

    },
    getGpioData(gpio) {
      let data;
      if (typeof this.formData.switch !== 'undefined') {
        data = this.formData.switch.find((pin) => {
          return pin.pin === gpio;
        })
        if (typeof data !== 'undefined') {
          return { type: 'switch', data };
        }
      }

      if (typeof this.formData.output !== 'undefined') {
        data = this.formData.output.find((pin) => {
          return pin.pin === gpio;
        })
        if (typeof data !== 'undefined') {
          return { type: 'light', data };
        }
      }

      if (typeof this.formData.binary_sensor !== 'undefined') {
        data = this.formData.binary_sensor.find((pin) => {
          return pin.pin === gpio;
        })
        if (typeof data !== 'undefined') {
          return { type: 'binary_sensor', data };
        }
      }
      return null;
    },
    getType(gpio) {
      const data = this.getGpioData(gpio);
      if (data !== null) {
        return data.type;
      }
      return null;
    },
    getName(gpio) {
      const data = this.getGpioData(gpio);
      if (data !== null) {
        return data.data.name;
      }
      return null;
    },
    /*getId(gpio, port, position) {
      const name = this.getName(gpio);

      if (name != null) {
        return this.slugify(this.fileName + ' ' + port + ' ' + position + ' ' + name);
      }
      return null;
    },*/
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
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(/[^\w-]+/g, "") // Remove all non-word chars
        .replace(/--+/g, "-") // Replace multiple - with single -
        .replace(/^-+/, "") // Trim - from start of text
        .replace(/-+$/, ""); // Trim - from end of text
    },
    submit() {
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
        return (gpio, port, position) => {
          const name = this.getName(gpio);
          if (name != null) {
            return this.slugify(this.fileName + ' ' + port + ' ' + position + ' ' + name);
          }
          return null;
        }
    },
    },
  }
};

</script>

