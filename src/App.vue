<!-- App.vue -->
<template>
  <v-app style="height: 85%">
    <SnackbarComponent :successMessage="this.$t(`operationSuccess`)"/>

    <v-toolbar v-if="!isLoginPage">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <img src="@/assets/logo.png" alt="App Logo" class="logo" height="80" />

      <v-toolbar-title>{{ this.$t(`appTitle`) }}</v-toolbar-title>

      <v-spacer></v-spacer>
      <v-menu open-on-hover>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon>
            <v-avatar>
              <v-icon>mdi-account</v-icon>
            </v-avatar>
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-title>
              <v-row>
                <v-col><v-icon>mdi-account</v-icon></v-col>
                <v-col>{{ username }}</v-col>
              </v-row>
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="logout">
            <v-row>
              <v-col><v-icon>mdi-logout</v-icon></v-col>
              <v-col>{{ this.$t(`logout`) }}</v-col>
            </v-row>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-card style="height: 100%">
      <v-layout style="height: 100%">
        <v-navigation-drawer app v-model="drawer" v-if="!isLoginPage">
          <v-list>
            <v-list-subheader>{{ this.$t(`clients`) }}</v-list-subheader>
            <v-list-item prepend-icon="mdi-account-box" :title="this.$t(`clientList`)" @click="$router.push({ name: 'ClientList' })"></v-list-item>
            <v-list-item v-if="isAdmin" prepend-icon="mdi-cash" :title="this.$t(`invoiceList`)" @click="$router.push({ name: 'InvoiceList' })"></v-list-item>
            <v-divider/>
            <v-list-subheader v-if="isAdmin">{{ this.$t(`groups`) }}</v-list-subheader>
            <v-list-item v-if="isAdmin" prepend-icon="mdi-account-group" :title="this.$t(`radGroupCheckList`)" @click="$router.push({ name: 'RadGroupCheckList' })"></v-list-item>
            <v-divider v-if="isAdmin"/>
            <v-list-subheader v-if="isAdmin">{{ this.$t(`otherSettings`) }}</v-list-subheader>
            <v-list-item v-if="isAdmin" prepend-icon="mdi-dns" :title="this.$t(`nasList`)" @click="$router.push({ name: 'NASList' })"></v-list-item>
            <v-list-item v-if="isAdmin" prepend-icon="mdi-city" :title="this.$t(`cityList`)" @click="$router.push({ name: 'CityList' })"></v-list-item>
            <v-list-item v-if="isAdmin" prepend-icon="mdi-account-cog-outline" :title="this.$t(`userList`)" @click="$router.push({ name: 'UserList' })"></v-list-item>
            <v-list-item v-if="isAdmin" prepend-icon="mdi-cog" :title="this.$t(`configurationSettings`)" @click="$router.push({ name: 'ConfigurationSettings' })"></v-list-item>
          </v-list>

          <template v-slot:append>
            <div class="pa-2">
              <v-btn block @click="logout">
                {{ this.$t(`logout`) }}
              </v-btn>
            </div>
          </template>
        </v-navigation-drawer>

        <v-main>
          <router-view></router-view>
        </v-main>
      </v-layout>
    </v-card>
  </v-app>
</template>

<script>
import SnackbarComponent from "@/components/SnackbarComponent.vue";

export default {
  name: 'ISP Billing',
  components: {SnackbarComponent},
  mounted() {
    window.addEventListener('user-localstorage-changed', (event) => {
      this.userType = event.detail.type;
      this.username = event.detail.username;
    });
  },
  data() {
    return {
      drawer: false,
      menu: false,
      userType: localStorage.getItem("type"),
      username: localStorage.getItem("username")
    }
  },
  methods: {
    logout() {
      localStorage.removeItem("jwt");
      this.$router.push("Login")
    }
  },
  computed: {
    isLoginPage() {
      return this.$route.name === 'Login' || this.$route.name === 'Root'
    },
    isAdmin() {
      return this.userType === 'ADMIN'
    },
  }
};
</script>

<style scoped>
  #app, .v-application--wrap, .v-application {
    height: 100%;
  }
</style>

<style>
html, body {
  height: 100%;
  margin: 0;
}
</style>