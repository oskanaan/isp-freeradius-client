<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>{{ this.$t(`login`) }}</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form @keyup.enter="login">
              <v-text-field
                  :label="this.$t(`username`)"
                  name="username"
                  prepend-icon="mdi-account"
                  type="username"
                  v-model="username"
                  v-focus
              ></v-text-field>
              <v-text-field
                  :label="this.$t(`password`)"
                  name="password"
                  prepend-icon="mdi-lock"
                  type="password"
                  v-model="password"
              ></v-text-field>

              <v-alert v-if="error" type="error">
                {{ this.error }}
              </v-alert>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="login">{{ this.$t(`login`) }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
import {apiService} from "@/apiService";

export default {
  data() {
    return {
      username: "",
      password: "",
      error: null,
    };
  },
  methods: {
    async login() {
      try {
        const loginResponse = await apiService.login(this.username, this.password)

        localStorage.setItem("jwt", loginResponse.data.token);
        localStorage.setItem("type", loginResponse.data.type);
        localStorage.setItem("username", loginResponse.data.username);

        window.dispatchEvent(new CustomEvent('user-localstorage-changed', {
          detail: {
            type: localStorage.getItem('type'),
            username: localStorage.getItem('username'),
          }
        }));

        //Populate global config:
        const configResponse = await apiService.getConfigurationSettings();
        localStorage.setItem("defaultLatitude", parseFloat(configResponse.data.defaultLatitude));
        localStorage.setItem("defaultLongitude", parseFloat(configResponse.data.defaultLongitude));

        this.$router.push("clients")
      } catch (error) {
        console.error("Login error: " + error)
        this.error = this.$t(`invalidLogonDetails`);
      }
    },
  },
};
</script>
