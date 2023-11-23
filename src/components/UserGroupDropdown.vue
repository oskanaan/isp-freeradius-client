<template>
  <v-container>
    <v-autocomplete
        :key="autocompleteKey"
        v-model="selectedGroup"
        v-model:search="search"
        :items="groups"
        density="compact"
        :label="this.$t(`searchForAGroup`)"
        no-filter
        @change="emitSelectedGroup"
        @update:search="fetchGroupsNow"
        hide-details="true">
      <template v-slot:no-data>
        <v-list-item>
          {{ this.$t(`noGroupsFound`) }}
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
    username: String,
    autocompleteKey: Number,
  },
  data() {
    return {
      selectedGroup: null,
      groups: [],
      search: null,
      loading: false,
      pageLimit: 10,
      cancelTokenSource: null
    };
  },
  methods: {
    emitSelectedGroup() {
      this.$emit("selected", this.selectedGroup);
    },
    async fetchUsers() {
      if (this.search !== '') {
        if (this.cancelTokenSource) {
          this.cancelTokenSource.cancel();
        }

        this.loading = true;
        this.cancelTokenSource = axios.CancelToken.source();

        try {
          const response = await apiService.findGroupsNotAssignedToUser(this.username, this.search, this.pageLimit, this.cancelTokenSource.token)

          this.groups = response.data._embedded.radgroupcheck.map(group => group.groupName);
        } catch (error) {
          if (!axios.isCancel(error)) {
            console.error('Error fetching group list:', error);
          }
        } finally {
          this.loading = false;
          this.cancelTokenSource = null;
        }
      }
    },
    fetchGroupsNow: function(text) {
      this.search = text;
      this.fetchUsers();
    }
  },
  watch: {
    autocompleteKey() {
      this.search = null;
      this.groups = [];
      this.selectedGroup = null
    }
  }
};
</script>
