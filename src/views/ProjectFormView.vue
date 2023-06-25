<template>
  <div class="about">
    <h1>
      {{ $route.params.fileName }}
    </h1>
    {{ formData }}
    <template v-if="formData">
      <Card title="Project Information">
        <template v-slot:content>

          <Input type="text" v-model="formData.esphome.name" size="small" label="Name" />
          <Input type="text" v-model="formData.esphome.sentence" size="small" label="Description" />
          <Select v-model="formData.esphome.platform" size="small" label="Platform" :options="platforms" />
          <Select v-model="formData.esphome.board" size="small" label="Board" :options="boards" />
          <Input type="text" v-model="$route.params.fileName" size="small" label="Filename" />
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

      <Card v-for="(port, portIndex) in pinesSetup" :key="portIndex" :title="'Port: ' + (portIndex + 1)">
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
                    :options="types" /></td>
                <td>
                  <Input
                    size="small"
                    :value="getName(pin)" />
                </td>
                <td>{{ getId(pin, portIndex, pinIndex) }}</td>
              </tr>
            </tbody>
          </table>

        </template>
      </Card>
    </template>

  </div>
</template>
<script>
import axios from 'axios';
import { ref } from 'vue';
import Input from '../components/form/Input.vue';
import Select from '../components/form/Select.vue';
import Card from '../components/layout/Card.vue';
import { stringifyQuery } from 'vue-router';


export default {
  components: {
    axios,
    Input,
    Select,
    Card
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
    const platforms = [
      {
        value: 'ESP8266',
        label: 'ESP8266'
      },
      {
        value: 'ESP32',
        label: 'ESP32'
      }
    ];
    const boards = [
      {
        value: 'esp-wrover-kit',
        label: 'esp-wrover-kit'
      },
      {
        value: 'nodemcuv2',
        label: 'nodemcuv2'
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

    return {
      selectedFile: null,
      formData: null,
      types,
      platforms,
      boards,
      pinesSetup
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
    getId(gpio, port, position) {
      const name = this.getName(gpio);

      if (name !== null) {
        return this.slugify(this.$route.params.fileName + ' ' + port + ' ' + position + ' ' + name);
      }
      return null;
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
    }

  }
};

</script>

