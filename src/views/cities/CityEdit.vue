<template>
  <div>
    <h1 class="text-h3 mb-2">{{ this.$t(`cityEdit`) }}</h1>

    <v-container>
      <v-form @submit.prevent="updateCity">
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="editedCity.name" :label="this.$t(`cityName`)" required :error-messages="fieldErrors.name"></v-text-field>
          </v-col>
        </v-row>
        <v-row align="end">
          <v-col align="right">
            <v-btn type="cancel" @click.prevent="$emit('close-dialog')" style="margin-right: 15px">{{ this.$t(`cancel`) }}</v-btn>
            <v-btn type="submit" color="primary">{{ this.$t(`update`) }}</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </div>
</template>

<script>
import {apiService} from "@/apiService";

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      editedCity: {},
      fieldErrors: {},
    };
  },
  created() {
    this.fetchCityData()
  },
  methods: {
    async fetchCityData() {
      if (this.id !== undefined) {
        try {
          let response = await apiService.fetchCityById(this.id)
          this.editedCity = response.data
        } catch(error) {
          console.error('Error fetching city data:', error);
        }
      }
    },
    async updateCity() {
      try{
        await apiService.updateCity(this.id, this.editedCity)
        this.$store.dispatch('toggleSuccessSnackbar');
        this.$emit('data-updated')
      } catch(error) {
        if (error.response.data.errors) {
          const receivedErrors = {};
          for (const err of error.response.data.errors) {
            receivedErrors[err.field] = err.message;
          }
          this.fieldErrors = receivedErrors;
        }
      }
    }
  },
};
</script>
