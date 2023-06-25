<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <div v-for="fileName in files" :key="fileName"
      class="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400">
      <div class="flex-shrink-0">
        <img class="h-10 w-10 rounded-full" src="person.imageUrl" alt="" />
      </div>
      <div class="min-w-0 flex-1">
        <a :href="'/projectForm/' + fileName.replace('.yaml', '')" class="focus:outline-none">
          <span class="absolute inset-0" aria-hidden="true" />
          <p class="text-sm font-medium text-gray-900">{{ fileName }}</p>
          <p class="truncate text-sm text-gray-500">{{ fileName }}</p>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      files: [],
    };
  },
  mounted() {
    axios.get('http://localhost:3000/files')
      .then(response => {
        this.files = response.data.files;
      })
      .catch(error => {
        console.log('Error al obtener la lista de archivos:', error);
      });
  },
};
</script>
