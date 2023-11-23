<template>
  <v-container>
    <h1 class="text-h3 mb-2">{{ this.$t('radGroupCheckList') }}</h1>

    <v-card class="mb-3 elevation-4">
      <v-card-title class="bg-primary white--text">{{ this.$t(`searchCriteria`) }}</v-card-title>
      <v-row>
        <v-col cols="3">
          <v-sheet class="ma-2 pa-2">
            <v-text-field v-model="filters.groupName" :label="this.$t(`groupName`)" @input="fetchRadGroupList" data-testid="groupNameFilter" hide-details="true"></v-text-field>
          </v-sheet>
        </v-col>
      </v-row>
    </v-card>

    <v-data-table-server class="elevation-3"
                         v-model:items-per-page="pageSize"
                         :headers="headers"
                         :items="radGroupCheckList"
                         :items-length="totalElements"
                         :server-items-length="totalElements"
                         :loading="loading"
                         @update:options="fetchRadGroupList">
      <template v-slot:headers>
        <tr>
          <th v-for="header in headers" :key="header.text" :style="{width: header.width}" class="bg-secondary">
            <span class="ml-10">
            {{ header.title }}
            </span>
          </th>
          <th style="width: 5%;" class="bg-secondary">
            <span class="ml-11">
              <v-tooltip :text="this.$t('add')" location="start" activator="parent" open-delay="300">
                <template v-slot:activator="{ attrs }">
                  <v-btn size="small" style="color: green" v-bind="attrs" icon="mdi-plus" @click="addGroup()" data-testid="addIcon"></v-btn>
                </template>
              </v-tooltip>
            </span>
          </th>
        </tr>
      </template>
      <template v-slot:item="{ item }">
        <tr>
          <td><span class="ml-10">{{ item.groupName }}</span></td>
          <td class="d-flex align-center">
            <span class="mx-5">|</span>
            <span>
            <v-tooltip :text="this.$t('edit')" location="start" activator="parent" open-delay="300">
              <template v-slot:activator="{ attrs }">
                <v-btn @click="editRadGroupCheck(item)" size="small" color="info" v-bind="attrs" icon="mdi-pencil" class="mx-1" data-testid="editIcon"></v-btn>
              </template>
            </v-tooltip>
            </span>
            <span>
            <v-tooltip :text="this.$t('delete')" activator="parent" open-delay="300">
              <template v-slot:activator="{ attrs }">
                <v-btn v-on:click="promptDelete(item)" size="small" color="error" v-bind="attrs" icon="mdi-delete" class="ml-1 mr-5" data-testid="deleteIcon"></v-btn>
              </template>
            </v-tooltip>
            </span>
            <span>|</span>
            <span>
            <v-tooltip :text="this.$t('editUsers')" activator="parent" open-delay="300">
              <template v-slot:activator="{ attrs }">
                <v-btn v-on:click="editUsers(item)" size="small" color="success" v-bind="attrs" icon="mdi-account-group" class="ml-5 mr-1"></v-btn>
              </template>
            </v-tooltip>
            </span>
            <span>
            <v-tooltip :text="this.$t(`editCheckAttributes`)" activator="parent" open-delay="300">
              <template v-slot:activator="{ attrs }">
                <v-btn v-on:click="editCheckAttributes(item)" size="small" color="success" v-bind="attrs" icon="mdi-account-details" class="mx-1"></v-btn>
              </template>
            </v-tooltip>
            </span>
            <span>
            <v-tooltip :text="this.$t(`editReplyAttributes`)" activator="parent" open-delay="300">
              <template v-slot:activator="{ attrs }">
                <v-btn v-on:click="editReplyAttributes(item)" size="small" color="success" v-bind="attrs" icon="mdi-reply-all" class="mx-1"></v-btn>
              </template>
            </v-tooltip>
            </span>
          </td>
        </tr>
      </template>

      <template v-slot:no-data>
        {{this.$t(`noRadGroupCheckFound`)}}
      </template>
    </v-data-table-server>

    <DeleteDialog v-model:value="deleteDialog" @confirmDelete="confirmDelete"/>
    <v-dialog v-model="addDialog" max-width="1024px" content-class="custom-dialog">
      <RadGroupAdd @close-dialog="closeDialogs" @data-updated="fetchRadGroupList(currentPage, pageSize)"/>
    </v-dialog>
    <v-dialog v-model="editDialog" max-width="1024px" content-class="custom-dialog">
      <RadGroupEdit @close-dialog="closeDialogs" :id="radGroupCheckToEdit" @data-updated="fetchRadGroupList(currentPage, pageSize)"/>
    </v-dialog>
    <v-dialog v-model="editUsersDialog" max-width="1024px" content-class="custom-dialog">
      <RadGroupUsersEdit @close-dialog="closeDialogs" :groupName="radGroup"/>
    </v-dialog>
    <v-dialog v-model="editCheckAttributesDialog" max-width="1024px" content-class="custom-dialog">
      <RadGroupCheckEdit @close-dialog="closeDialogs" :groupName="radGroup"/>
    </v-dialog>
    <v-dialog v-model="editReplyAttributesDialog" max-width="1024px" content-class="custom-dialog">
      <RadGroupReplyEdit @close-dialog="closeDialogs" :groupName="radGroup"/>
    </v-dialog>

  </v-container>
</template>

<script>
import DeleteDialog from "@/components/DeleteDialog.vue";
import RadGroupEdit from "@/views/groups/RadGroupEdit.vue";
import RadGroupAdd from "@/views/groups/RadGroupAdd.vue";
import RadGroupUsersEdit from "@/views/groups/RadGroupUsersEdit.vue";
import RadGroupReplyEdit from "@/views/groups/RadGroupReplyEdit.vue";
import RadGroupCheckEdit from "@/views/groups/RadGroupCheckEdit.vue";
import {apiService} from "@/apiService";

export default {
  components: {RadGroupReplyEdit, RadGroupCheckEdit, RadGroupUsersEdit, RadGroupAdd, DeleteDialog, RadGroupEdit},
  data() {
    return {
      headers: [
        {title: this.$t(`groupName`), key: 'groupName', width: '70%', sortable: false},
      ],
      filters: {
        groupName: ''
      },
      addDialog: false,
      editDialog: false,
      editUsersDialog: false,
      deleteDialog: false,
      editReplyAttributesDialog: false,
      editCheckAttributesDialog: false,
      radGroupCheckToEdit: null,
      radGroup: null,
      radGroupCheckToDelete: null,
      loading: false,
      currentPage: 1,
      pageSize: 10,
      totalPages: 1,
      totalElements: 1,
      radGroupCheckList: []
    };
  },

  methods: {
    fetchRadGroupList({ page, itemsPerPage }) {
      if (page === undefined) page = this.currentPage
      if (itemsPerPage === undefined) itemsPerPage = this.pageSize

      this.loading = true;
      apiService.searchGroups(this.filters.groupName, page, itemsPerPage)
          .then(response => {
            this.loading = false;
            if (response.data._embedded !== undefined) {
              this.radGroupCheckList = response.data._embedded.groups;
              this.totalPages = response.data.page.totalPages;
              this.totalElements = response.data.page.totalElements;
              this.currentPage = response.data.page.number + 1;
              this.pageSize = response.data.page.size;
            } else {
              this.radGroupCheckList = [];
              this.totalPages = 0;
              this.totalElements = 0;
              this.currentPage = 1;
            }
          })
          .catch(error => {
            console.error("Error fetching RadGroupCheck list:", error);
            this.loading = false;
          });
    },
    confirmDelete() {
      this.deleteDialog = false;

      apiService.deleteGroup(this.radGroupCheckToDelete.id)
          .then(() => {
            this.$store.dispatch('toggleSuccessSnackbar');
            this.fetchRadGroupList(this.currentPage, this.pageSize)
          })
          .catch((error) => {
            if (error.response.data.errorCode) {
              this.$store.state.errorMessage = error.response.data.message
              this.$store.dispatch('toggleFailureSnackbar');
            }
            console.error('Error deleting rad group:', error);
          });
    },
    closeDialogs() {
      this.addDialog = false;
      this.editDialog = false;
      this.editUsersDialog = false;
      this.editReplyAttributesDialog = false;
      this.editCheckAttributesDialog = false;
    },
    addGroup() {
      this.addDialog = true;
    },
    editRadGroupCheck(radGroupCheck) {
      this.radGroupCheckToEdit = radGroupCheck.id.toString();
      this.editDialog = true;
    },
    editUsers(radGroupCheck) {
      this.radGroup = radGroupCheck.groupName;
      this.editUsersDialog = true;
    },
    editReplyAttributes(radGroupCheck) {
      this.radGroup = radGroupCheck.groupName;
      this.editReplyAttributesDialog = true;
    },
    editCheckAttributes(radGroupCheck) {
      this.radGroup = radGroupCheck.groupName;
      this.editCheckAttributesDialog = true;
    },
    promptDelete(radGroupCheck) {
      this.radGroupCheckToDelete = radGroupCheck;
      this.deleteDialog = true;
    }
  }
};
</script>

<style scoped>
@import "@/styles.css";
</style>
