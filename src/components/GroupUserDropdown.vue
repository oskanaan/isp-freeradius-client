<template>
  <v-container>
    <v-autocomplete
        :key="autocompleteKey"
        v-model="selectedUser"
        v-model:search="search"
        :items="users"
        density="compact"
        :label="this.$t(`searchForAUser`)"
        no-filter
        @change="emitSelectedUser"
        @update:search="fetchUsersNow"
        hide-details="true">
      <template v-slot:no-data>
        <v-list-item>
          {{ this.$t(`noUsersFound`) }}
        </v-list-item>
      </template>

    </v-autocomplete>
  </v-container>
</template>

<script>
import axios from 'axios';
import {apiService} from "@/apiService";

export default {
  props: {
    groupName: String,
    autocompleteKey: Number,
  },
  data() {
    return {
      selectedUser: null,
      users: [],
      search: null,
      loading: false,
      pageLimit: 10,
      cancelTokenSource: null
    };
  },
  methods: {
    emitSelectedUser() {
      this.$emit("selected", this.selectedUser);
    },
    async fetchUsers() {
      if (this.search !== '') {
        if (this.cancelTokenSource) {
          this.cancelTokenSource.cancel();
        }

        this.loading = true;
        this.cancelTokenSource = axios.CancelToken.source();

        try {
          const response = await apiService.getUsersNotInGroup(this.groupName, this.search, this.pageLimit, this.cancelTokenSource.token)

          this.users = response.data._embedded.radcheck.map(user => user.username);
        } catch (error) {
          if (!axios.isCancel(error)) {
            console.error('Error fetching user list:', error);
          }
        } finally {
          this.loading = false;
          this.cancelTokenSource = null;
        }
      }
    },
    fetchUsersNow: function(text) {
      this.search = text;
      this.fetchUsers();
    }
  },
  watch: {
    autocompleteKey() {
      this.search = null;
      this.users = [];
      this.selectedUser = null
    }
  }
};
</script>
