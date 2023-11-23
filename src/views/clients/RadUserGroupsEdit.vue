<template>
  <v-container>
    <h1>{{this.$t(`radUserGroupsEditTitle`)}} {{ username }}</h1>

    <v-card class="elevation-12 mb-5">
      <v-card-title class="bg-primary white--text">{{ this.$t('addRecord') }}</v-card-title>
      <v-row>
        <v-col>
          <UserGroupDropdown :autocompleteKey="autocompleteKey" :username="username" @selected="(group) => this.newGroup = group"/>
        </v-col>
        <v-col align-self="center">
          <v-btn color="success" @click="addUser">{{ this.$t(`addGroup`) }}</v-btn>
        </v-col>
      </v-row>
    </v-card>
    <v-data-table-server
        class="elevation-3"
        v-model:items-per-page="pageSize"
        :headers="headers"
        :items="groups"
        :items-per-page="pageSize"
        :items-length="totalElements"
        :server-items-length="totalElements"
        :loading="loading"
        @update:page="updatePage"
        @update:items-per-page="updateItemsPerPage"
    >
      <template v-slot:headers>
        <tr>
          <th v-for="header in headers" :key="header.text" :style="header.style" class="bg-secondary">
            {{ header.text }}
          </th>
        </tr>
      </template>
      <template v-slot:item="{ item }">
        <tr>
          <td><v-checkbox v-model="selectedUsers" :value="item" hide-details="true"></v-checkbox></td>
          <td>{{ item.username }}</td>
          <td>{{ item.groupName }}</td>
        </tr>
      </template>
    </v-data-table-server>

    <v-row class="mt-5">
      <v-col>
        <v-btn @click="deleteSelectedUsers" color="warning">Delete Selected Users</v-btn>
      </v-col>
    </v-row>
    <v-row align="end" class="mb-5">
      <v-col align="right">
        <v-btn type="close" color="grey darken-1" dark @click.prevent="$emit('close-dialog')" style="margin-right: 15px">{{ this.$t(`close`) }}</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import UserGroupDropdown from "@/components/UserGroupDropdown.vue";
import {apiService} from "@/apiService";

export default {
  components: {UserGroupDropdown},
  props: ['username'],
  data() {
    return {
      headers: [
        { text: "", value: 'actions', sortable: false, style: "width: 10%; vertical-align: bottom"},
        { text: this.$t(`username`), value: 'username' },
        { text: this.$t(`username`), value: 'username' }
      ],
      groups: [],
      selectedUsers: [],
      newGroup: '',
      page: 1,
      pageSize: 4,
      totalElements: 0,
      loading: false,
      autocompleteKey: 0,
    };
  },
  methods: {
    fetchUsers() {
      if (this.username !== '' && this.username !== undefined) {
        this.loading = true;
        apiService.findGroupsByUsername(this.username, this.page, this.pageSize)
            .then(response => {
              this.groups = response.data._embedded.radusergroups;
              this.totalElements = response.data.page.totalElements;
              this.loading = false;
            })
            .catch(error => {
              console.error("Error fetching groups:", error);
              this.loading = false;
            });
      }
    },
    addUser() {
      if (this.newGroup) {
        apiService.addUserToGroup(this.newGroup, this.username)
            .then(() => {
              this.fetchUsers();
              this.newGroup = '';
              this.autocompleteKey++;
            })
            .catch(error => {
              console.error("Error adding group:", error);
            });
      }
    },
    deleteSelectedUsers() {
      if (this.selectedUsers.length > 0) {
        apiService.removeUserFromGroups(this.selectedUsers)
            .then(() => {
              this.fetchUsers();
              this.selectedUsers = [];
            })
            .catch(error => {
              console.error("Error deleting groups:", error);
            });
      } else {
        this.$store.state.errorMessage = this.$t(`noUsersSelected`)
        this.$store.dispatch('toggleFailureSnackbar');
      }
    },
    updatePage(val) {
      this.page = val;
      this.fetchUsers();
    },
    updateItemsPerPage(val) {
      this.pageSize = val;
      this.fetchUsers();
    }
  },
  mounted() {
    this.fetchUsers();
  }
};
</script>
