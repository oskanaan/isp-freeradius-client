<template>
  <v-container>
    <div>
      <h1 class="text-h3 mb-2">{{ this.$t(`cityList`) }}</h1>

      <!-- Filter input for cities -->
      <v-container>
        <v-card class="mb-3 elevation-4">
          <v-card-title class="bg-primary white--text">{{ this.$t(`searchCriteria`) }}</v-card-title>
          <v-card-text>
            <v-row no-gutters>
              <v-col sm="4" md="3" lg="2">
                <v-sheet class="ma-2 pa-2">
                  <v-text-field v-model="cityNameFilter" :label="this.$t(`cityName`)" @input="filterCities" outlined dense prepend-inner-icon="mdi-magnify" data-testid="cityNameFilter"></v-text-field>
                </v-sheet>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-container>

      <v-data-table class="elevation-3"
                    :headers="headers"
                    :items="cities"
                    :loading="loading">
        <template v-slot:headers>
          <tr>
            <th v-for="header in headers" :key="header.text" :style="{width: header.width}" class="bg-secondary">
              <span class="ml-10">{{ header.title }}</span>
            </th>
            <th style="width: 5%;" class="bg-secondary">
              <span class="ml-11">
                <v-tooltip :text="this.$t('add')" location="start" activator="parent" open-delay="300">
                  <template v-slot:activator="{ on }">
                    <v-btn size="small" v-bind="on" style="color: green" icon="mdi-plus" @click="addCity()"></v-btn>
                  </template>
                </v-tooltip>
              </span>
            </th>
          </tr>
        </template>
        <template v-slot:item="{ item }">
          <tr>
            <td><span class="ml-10">{{ item.name }}</span></td>
            <td class="d-flex align-center">
              <span class="mx-5">|</span>
              <span>
                <v-tooltip :text="this.$t('edit')" location="start" activator="parent" open-delay="300">
                  <template v-slot:activator="{ on }">
                    <v-btn size="small" @click="editCity(item)" color="info" v-bind="on" icon="mdi-pencil" style="margin-right: 20px"></v-btn>
                  </template>
                </v-tooltip>
              </span>
              <span>
              <v-tooltip :text="this.$t('delete')" activator="parent" open-delay="300">
                <template v-slot:activator="{ on }">
                  <v-btn size="small" @click="promptDelete(item)" color="error" v-bind="on" icon="mdi-delete"></v-btn>
                </template>
                <span>{{ this.$t(`delete`) }}</span>
              </v-tooltip>
              </span>
            </td>
          </tr>
        </template>
        <template v-slot:no-data>
          <v-list-item>
            {{ this.$t(`noCityFound`) }}
          </v-list-item>
        </template>
      </v-data-table>
    </div>


    <DeleteDialog :value="deleteDialog" @confirmDelete="confirmDelete"/>
    <v-dialog v-model="addCityDialog" max-width="1024px" content-class="custom-dialog">
      <CityAdd @close-dialog="closeDialogs" @data-updated="refreshData"/>
    </v-dialog>
    <v-dialog v-model="editCityDialog" max-width="1024px" content-class="custom-dialog">
      <CityEdit :id="cityToEditId" @close-dialog="closeDialogs" @data-updated="refreshData"/>
    </v-dialog>
  </v-container>
</template>

<script>
import CityAdd from "@/views/cities/CityAdd.vue";
import CityEdit from "@/views/cities/CityEdit.vue";
import DeleteDialog from "@/components/DeleteDialog.vue";
import {apiService} from "@/apiService";

export default {
  components: {
    DeleteDialog,
    CityAdd,
    CityEdit
  },
  data() {
    return {
      headers: [
        {title: this.$t(`cityName`), key: 'name', width: '90%', sortable: false},
      ],
      cities: [],
      allCities: [],
      currentPage: 1,
      pageSize: 10,
      totalPages: 1,
      totalElements: 1,
      loading: false,
      cityNameFilter: "",
      deleteDialog: false,
      cityToDelete: null,
      addCityDialog: false,
      editCityDialog: false,
      cityToEditId: null
    };
  },
  methods: {
    async fetchCities() {
      try {
        this.loading = true
        let response = await apiService.fetchCities()
        this.loading = false;
        this.allCities = response.data._embedded.cities;
        this.filterCities() //initial populate and if the data is refreshed after deleting a record and there is a filter value
      } catch(reason) {
        console.error("Error fetching cities:", reason);
      }
    },
    filterCities() {
      if (this.cityNameFilter) {
        const lowercasedFilter = this.cityNameFilter.toLowerCase();
        this.cities = this.allCities.filter(city => city.name.toLowerCase().includes(lowercasedFilter));
      } else {
        this.cities = this.allCities;
      }
    },
    addCity() {
      this.addCityDialog = true;
    },
    editCity(city) {
      this.cityToEditId = city.id.toString();
      this.editCityDialog = true;
    },
    closeDialogs() {
      this.addCityDialog = false;
      this.editCityDialog = false;
    },
    refreshData() {
      this.closeDialogs()
      this.fetchCities()
    },
    promptDelete(city) {
      this.cityToDelete = city;
      this.deleteDialog = true;
    },
    async confirmDelete() {
      this.deleteDialog = false;
      try {
        await apiService.deleteCity(this.cityToDelete.id)
        await this.fetchCities();
      } catch(error) {
        if (error.response.data.errorCode) {
          this.$store.state.errorMessage = error.response.data.message
          this.$store.dispatch('toggleFailureSnackbar');
        }
        console.error('Error deleting city:', error);
      }
    },
  },
  mounted() {
    this.fetchCities();
  },
};
</script>

<style scoped>
@import "@/styles.css";
</style>
