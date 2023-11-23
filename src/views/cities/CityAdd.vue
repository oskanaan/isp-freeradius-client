<template>
  <div>
    <h1 class="text-h3 mb-2">{{ this.$t(`cityAdd`) }}</h1>

    <v-container>
      <v-form @submit.prevent="addCity">
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="addedCity.name" :label="this.$t(`cityName`)" required :error-messages="fieldErrors.name"></v-text-field>
          </v-col>
        </v-row>
        <v-row align="end">
          <v-col align="right">
            <v-btn type="cancel" @click.prevent="$emit('close-dialog')" style="margin-right: 15px">{{ this.$t(`cancel`) }}</v-btn>
            <v-btn type="submit" color="primary">{{ this.$t(`add`) }}</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </div>
</template>

<script>
import {apiService} from "@/apiService";

export default {
  data() {
    return {
      addedCity: {},
      fieldErrors: {},
    };
  },
  methods: {
    async addCity() {
      try {
        let response = await apiService.addCity(this.addedCity);
        alert(response)
        this.$store.dispatch('toggleSuccessSnackbar');
        this.$emit('data-updated');
      } catch(error) {
        alert(error)
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
