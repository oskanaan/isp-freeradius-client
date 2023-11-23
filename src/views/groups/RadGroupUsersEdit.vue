<template>
  <v-container>
    <h1>{{this.$t(`radGroupUserEditTitle`)}} {{ groupName }}</h1>

    <v-card class="elevation-12 mb-5">
      <v-card-title class="bg-primary white--text">{{ this.$t('addRecord') }}</v-card-title>
      <v-row>
        <v-col>
          <GroupUserDropdown :autocompleteKey="autocompleteKey" :group-name="groupName" @selected="(user) => this.newUser = user"/>
        </v-col>
        <v-col align-self="center">
          <v-btn color="success" @click="addUser">{{ this.$t(`addUser`) }}</v-btn>
        </v-col>
      </v-row>
    </v-card>
    <v-data-table-server
        class="elevation-3"
        v-model:items-per-page="pageSize"
        :headers="headers"
        :items="users"
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
import GroupUserDropdown from "@/components/GroupUserDropdown.vue";
import {apiService} from "@/apiService";

export default {
  components: {GroupUserDropdown},
  props: ['groupName'],
  data() {
    return {
      headers: [
        { text: "", value: 'actions', sortable: false, style: "width: 10%; vertical-align: bottom"},
        { text: this.$t(`username`), value: 'username' },
        { text: this.$t(`groupName`), value: 'groupName' }
      ],
      users: [],
      selectedUsers: [],
      newUser: '',
      page: 1,
      pageSize: 4,
      totalElements: 0,
      loading: false,
      autocompleteKey: 0,
    };
  },
  methods: {
    fetchUsers() {
      this.loading = true;

      apiService.getUsersInGroup(this.groupName, this.page, this.pageSize)
          .then(response => {
            this.users = response.data._embedded.radusergroups;
            this.totalElements = response.data.page.totalElements;
            this.loading = false;
          })
          .catch(error => {
            console.error("Error fetching users:", error);
            this.loading = false;
          });
    },
    addUser() {
      if (this.newUser) {
        apiService.addUserToGroup(this.groupName, this.newUser)
            .then(() => {
              this.fetchUsers();
              this.newUser = '';
              this.autocompleteKey++;
            })
            .catch(error => {
              console.error("Error adding user:", error);
            });
      }
    },
    deleteSelectedUsers() {
      if (this.selectedUsers.length > 0) {
        apiService.deleteUsersFromGroup(this.selectedUsers)
            .then(() => {
              this.fetchUsers();
              this.selectedUsers = [];
            })
            .catch(error => {
              console.error("Error deleting users:", error);
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
