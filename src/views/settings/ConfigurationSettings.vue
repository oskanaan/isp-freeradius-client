<template>
  <v-container>
    <h1 class="text-h3 mb-2">{{ this.$t('configurationSettings') }}</h1>

    <v-form @submit.prevent="saveConfigurationSettings">

      <v-text-field
          v-model="settings.cronPattern"
          :label="this.$t('cronPattern')"
          :error-messages="this.fieldErrors.cronPattern"
          required>
      </v-text-field>

      <v-text-field
          v-model="settings.phoneRegex"
          :label="this.$t('phoneRegex')"
          :error-messages="this.fieldErrors.phoneRegex"
          required>
      </v-text-field>

      <v-text-field
          v-model="settings.defaultLatitude"
          :label="this.$t('defaultLatitude')"
          :error-messages="this.fieldErrors.defaultLatitude"
          required>
      </v-text-field>

      <v-text-field
          v-model="settings.defaultLongitude"
          :label="this.$t('defaultLongitude')"
          :error-messages="this.fieldErrors.defaultLongitude"
          required>
      </v-text-field>

      <v-row align="end">
        <v-col align="right">
          <v-btn type="submit" color="primary">{{ this.$t('save') }}</v-btn>
        </v-col>
      </v-row>

    </v-form>
  </v-container>
</template>

<script>
import {apiService} from "@/apiService";

export default {
  data() {
    return {
      settings: {
        cronPattern: '',
        phoneRegex: '',
        defaultLatitude: '',
        defaultLongitude: ''
      },
      fieldErrors: []

    };
  },
  created() {
    this.fetchConfigurationSettings();
  },
  methods: {
    fetchConfigurationSettings() {
      apiService.getConfigurationSettings()
          .then(response => {
            this.settings = response.data;
          })
          .catch(error => {
            console.error("Error fetching configuration settings:", error);
          });
    },
    saveConfigurationSettings() {
      apiService.saveConfigurationSettings(this.settings)
          .then(() => {
            this.$store.dispatch('toggleSuccessSnackbar');
          })
          .catch(error => {
            console.error("Error saving configuration settings:", error);
            if (error.response.data.errors) {
              const receivedErrors = {};
              for (const err of error.response.data.errors) {
                receivedErrors[err.field] = err.message;
              }
              this.fieldErrors = receivedErrors;
            }
          });
    }
  }
};
</script>

<style scoped>
/* Add any additional styles here */
</style>
