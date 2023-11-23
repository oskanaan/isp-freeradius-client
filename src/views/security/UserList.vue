<template>
  <v-container>
    <h1 class="text-h3 mb-2">{{ this.$t('userList') }}</h1>

    <v-card class="mb-3 elevation-4">
      <v-card-title class="bg-primary white--text">{{ this.$t(`searchCriteria`) }}</v-card-title>
      <v-row>
        <v-col cols="2">
          <v-sheet class="ma-2 pa-2">
            <v-text-field v-model="filters.username" :label="this.$t(`username`)" @input="fetchUserList" data-testid="userNameFilter"></v-text-field>
          </v-sheet>
        </v-col>
        <v-col cols="2">
          <v-sheet class="ma-2 pa-2">
            <v-text-field v-model="filters.name" :label="this.$t(`name`)" @input="fetchUserList"></v-text-field>
          </v-sheet>
        </v-col>
      </v-row>
    </v-card>

    <v-data-table-server class="elevation-3"
                         v-model:items-per-page="pageSize"
                         :headers="headers"
                         :items="userList"
                         :items-length="totalElements"
                         :server-items-length="totalElements"
                         :loading="loading"
                         @update:options="fetchUserList">
      <template v-slot:headers>
        <tr>
          <th v-for="header in headers" :key="header.text" :style="{width: header.width}" class="bg-secondary">
            {{ header.title }}
          </th>
          <th style="width: 5%;" class="bg-secondary">
            <span class="ml-11">
              <v-tooltip :text="this.$t('add')" location="start" activator="parent" open-delay="300">
                <template v-slot:activator="{ on }">
                  <v-btn size="small" style="color: green" v-bind="on" icon="mdi-plus" @click="addUser()"></v-btn>
                </template>
              </v-tooltip>
            </span>
          </th>
        </tr>
      </template>

      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.username }}</td>
          <td>{{ item.name }}</td>
          <td>{{ this.$t(`enums.countryCodes.${item.nationality?.toLowerCase()}`) }}</td>
          <td>{{ item.phone }}</td>
          <td><v-chip size="large" :color="item.status === 'ACTIVE' ? 'green-darken-2' : 'grey'" icon="mdi-checkbox-marked-circle-outline">{{ this.$t(`enums.userStatus.${item.status.toLowerCase()}`) }}</v-chip></td>
          <td>{{ this.$t(`enums.userRoles.${item.roles.toLowerCase()}`) }}</td>
          <td class="d-flex align-center">
            <span class="mx-5">|</span>
            <span>
              <v-tooltip :text="this.$t('edit')" location="start" activator="parent" open-delay="300">
                <template v-slot:activator="{ on }">
                  <v-btn size="small" @click="editUser(item)" color="info" v-bind="on" icon="mdi-pencil" style="margin-right: 20px"></v-btn>
                </template>
              </v-tooltip>
            </span>
            <span>
              <v-tooltip :text="this.$t('delete')" activator="parent" open-delay="300">
                <template v-slot:activator="{ on }">
                  <v-btn size="small" @click="promptDelete(item)" color="error" v-bind="on" icon="mdi-delete" class="mr-5"></v-btn>
                </template>
              </v-tooltip>
            </span>
            <span>|</span>
            <span>
              <v-tooltip :text="this.$t('changePassword')" activator="parent" open-delay="300">
                <template v-slot:activator="{ on }">
                  <v-btn size="small" @click="changePassword(item)" color="success" v-bind="on" icon="mdi-key" class="ml-5"></v-btn>
                </template>
              </v-tooltip>
            </span>
          </td>
        </tr>
      </template>

      <template v-slot:no-data>
        {{ this.$t(`noUserFound`) }}
      </template>
    </v-data-table-server>

    <DeleteDialog v-model:value="deleteDialog" @confirmDelete="confirmDelete"/>
    <v-dialog v-model="addDialog" max-width="1024px" content-class="custom-dialog">
      <UserAdd @close-dialog="closeDialogs" @data-updated="fetchUserList(currentPage, pageSize)"/>
    </v-dialog>
    <v-dialog v-model="editDialog" max-width="1024px" content-class="custom-dialog">
      <UserEdit @close-dialog="closeDialogs" :id="userToEdit" @data-updated="fetchUserList(currentPage, pageSize)"/>
    </v-dialog>
    <v-dialog v-model="changePasswordDialog" max-width="1024px" content-class="custom-dialog">
      <UserPasswordEdit @close-dialog="closeDialogs" :id="userToEdit"/>
    </v-dialog>

  </v-container>
</template>

<script>
import DeleteDialog from "@/components/DeleteDialog.vue";
import UserAdd from "@/views/security/UserAdd.vue";
import UserEdit from "@/views/security/UserEdit.vue";
import UserPasswordEdit from "@/views/security/UserPasswordEdit.vue";
import {apiService} from "@/apiService";

export default {
  components: {UserPasswordEdit, UserEdit, UserAdd, DeleteDialog},
  data() {
    return {
      headers: [
        {title: this.$t(`username`), key: 'username', width: '10%', sortable: false},
        {title: this.$t(`name`), key: 'name', width: '15%', sortable: false},
        {title: this.$t(`nationality`), key: 'nationality', width: '15%', sortable: false},
        {title: this.$t(`phone`), key: 'phone', width: '10%', sortable: false},
        {title: this.$t(`status`), key: 'status', width: '10%', sortable: false},
        {title: this.$t(`roles`), key: 'roles', width: '10%', sortable: false},
      ],
      filters: {
        username: '',
        name: ''
      },
      addDialog: false,
      editDialog: false,
      changePasswordDialog: false,
      deleteDialog: false,
      userToEdit: null,
      loading: false,
      currentPage: 1,
      pageSize: 10,
      totalPages: 1,
      totalElements: 1,
      userToDelete: null,
      userList: []
    };
  },

  methods: {
    fetchUserList({ page, itemsPerPage }) {
      if (page === undefined) page = this.currentPage
      if (itemsPerPage === undefined) itemsPerPage = this.pageSize

      this.loading = true
      apiService.searchUsers(this.filters, page, itemsPerPage)
          .then(response => {
            this.loading = false

            if (response.data._embedded !== undefined) {
              this.userList = response.data._embedded.users;
              this.totalPages = response.data.page.totalPages
              this.totalElements = response.data.page.totalElements
              this.currentPage = response.data.page.number + 1
              this.pageSize = response.data.page.size
            } else {
              this.userList = []
              this.totalPages = 0
              this.totalElements = 0
              this.currentPage = 1
            }

          })
          .catch(error => {
            console.error("Error fetching user list:", error);
            this.loading = false
          });
    },
    confirmDelete() {
      this.deleteDialog = false;

      apiService.deleteUser(this.userToDelete.id)
          .then(() => {
            this.$store.dispatch('toggleSuccessSnackbar');
            this.fetchUserList(this.currentPage, this.pageSize)
          })
          .catch((error) => {
            if (error.response.data.errorCode) {
              this.$store.state.errorMessage = error.response.data.message
              this.$store.dispatch('toggleFailureSnackbar');
            }
            console.error('Error deleting user:', error);
          });
    },
    closeDialogs() {
      this.addDialog = false;
      this.editDialog = false;
      this.changePasswordDialog = false;
    },
    addUser() {
      this.addDialog = true;
    },
    editUser(user) {
      this.userToEdit = user.id.toString();
      this.editDialog = true
    },
    changePassword(user) {
      this.userToEdit = user.id.toString();
      this.changePasswordDialog = true
    },
    promptDelete(user) {
      this.userToDelete = user;
      this.deleteDialog = true;
    },
  }
};
</script>

<style scoped>
@import "@/styles.css";
</style>
