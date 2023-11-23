<template>
  <v-autocomplete
      :key="autocompleteKey"
      v-model="selectedClient"
      v-model:search="search"
      :items="clients"
      :label="this.$t(`searchForAClient`)"
      no-filter
      @change="emitSelectedClient"
      @update:search="fetchClientsNow"
      hide-details="true"
      item-text="fullName"
      item-value="id"
      item-title="fullName">
    <template v-slot:no-data>
      <v-list-item>
        {{ this.$t(`noClientsFound`) }}
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script>
import axios from 'axios';
import {apiService} from "@/apiService";

export default {
  props: {
    clientId: Number,
    autocompleteKey: Number,
  },
  data() {
    return {
      selectedClient: null,
      clients: [],
      search: null,
      loading: false,
      pageLimit: 10,
      cancelTokenSource: null
    };
  },
  methods: {
    emitSelectedClient() {
      if (this.selectedClient !== null) {
        this.$emit("selected", this.selectedClient);
      }
    },
    async fetchUsers() {

      if (this.search !== '') {
        if (this.cancelTokenSource) {
          this.cancelTokenSource.cancel();
        }

        this.loading = true;
        this.cancelTokenSource = axios.CancelToken.source();

        try {
          const response = await apiService.getClientsByFullName(this.search, this.pageLimit, this.cancelTokenSource.token)

          this.clients = response.data._embedded.clients.map(client => ({id: client.id.toString(), fullName: client.fullName.toString()}));
          console.log(this.clients)

        } catch (error) {
          if (!axios.isCancel(error)) {
            console.error('Error fetching client list:', error);
          }
        } finally {
          this.loading = false;
          this.cancelTokenSource = null;
        }
      }
    },
    fetchClientsNow: function(text) {
      this.search = text;
      this.fetchUsers();
    },
    loadClientData() {
      if (this.clientId !== undefined) {
        apiService.getClient(this.clientId)
            .then((response) => {
              console.log(response)
              this.selectedClient = {id: response.data.id.toString(), fullName: response.data.fullName.toString()}
              this.clients = [this.selectedClient]
              this.search = response.data.fullName;
            })
            .catch((error) => {
              console.error('Error fetching city data:', error);
            });

      }
    }
  },
  watch: {
    clientId: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.loadClientData(newVal);
        }
      },
    },
  },
};
</script>
