<template>
  <v-autocomplete
      :items="filteredCities"
      item-text="name"
      item-value="id"
      item-title="name"
      label="Select a city"
      v-model="selectedCity"
      @input="emitSelectedValue"
      :error-messages="errorMessages"
  >
    <template #prepend-item>
      <v-text-field
          v-model="searchQuery"
          label="Search"
          single-line
          hide-details
      ></v-text-field>
    </template>
  </v-autocomplete>
</template>

<script setup>
import {computed, ref} from 'vue';
import {apiService} from "@/apiService";

const cities = ref([]);
const selectedCity = ref(null);
const searchQuery = ref('');

const fetchCities = async () => {
  try {
    const { data } = await apiService.getCities();
    cities.value = data._embedded.cities
  } catch (error) {
    console.error('An error occurred while fetching data: ', error);
  }
};

fetchCities();

const filteredCities = computed(() =>
    cities.value.filter(city =>
        city.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    ));

</script>
<script>
export default {
  props: {
    errorMessages: Array,
  },
  data() {
    return {
      selectedCity: null,
    }
  },
  methods: {
    emitSelectedValue() {
      this.$emit("input", this.selectedCity);
    },
  },
};
</script>
