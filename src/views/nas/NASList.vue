<template>
  <v-container>
    <h1 class="text-h3 mb-2">{{ this.$t('nasList') }}</h1>

    <!-- Filters for NAS -->
    <v-card class="mb-3 elevation-4">
      <v-card-title class="bg-primary white--text">{{ this.$t(`searchCriteria`) }}</v-card-title>
      <v-row>
        <v-col cols="2">
          <v-sheet class="ma-2 pa-2">
            <v-text-field v-model="filters.nasName" :label="this.$t(`nasName`)" @input="fetchNASList" data-testid="nasNameFilter"></v-text-field>
          </v-sheet>
        </v-col>
        <v-col cols="2">
          <v-sheet class="ma-2 pa-2">
            <v-text-field v-model="filters.type" :label="this.$t(`type`)" @input="fetchNASList"></v-text-field>
          </v-sheet>
        </v-col>
        <v-col cols="3">
          <v-sheet class="ma-2 pa-2">
            <v-text-field v-model="filters.server" :label="this.$t(`server`)" @input="fetchNASList"></v-text-field>
          </v-sheet>
        </v-col>
        <v-col cols="4">
          <v-sheet class="ma-2 pa-2">
            <v-text-field v-model="filters.description" :label="this.$t(`description`)" @input="fetchNASList"></v-text-field>
          </v-sheet>
        </v-col>
      </v-row>
    </v-card>

    <v-data-table-server class="elevation-3"
                         v-model:items-per-page="pageSize"
                         :headers="headers"
                         :items="nasList"
                         :items-length="totalElements"
                         :server-items-length="totalElements"
                         :loading="loading"
                         @update:options="fetchNASList">
      <template v-slot:headers>
        <tr>
          <th v-for="header in headers" :key="header.text" :style="{width: header.width}" class="bg-secondary">
            {{ header.title }}
          </th>
          <th style="width: 5%;" class="bg-secondary">
            <span class="ml-11">
              <v-tooltip :text="this.$t('add')" location="start" activator="parent" open-delay="300">
                <template v-slot:activator="{ on }">
                  <v-btn size="small" style="color: green" v-bind="on" icon="mdi-plus" @click="addNAS()"></v-btn>
                </template>
              </v-tooltip>
            </span>
          </th>
        </tr>
      </template>

      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.nasName }}</td>
          <td>{{ item.shortName }}</td>
          <td>{{ item.type }}</td>
          <td>{{ item.ports }}</td>
          <td>{{ item.server }}</td>
          <td>{{ item.description }}</td>
          <td class="d-flex align-center">
            <span class="mx-5">|</span>
            <span>
              <v-tooltip :text="this.$t('edit')" location="start" activator="parent" open-delay="300">
                <template v-slot:activator="{ on }">
                  <v-btn size="small" @click="editNAS(item)" color="info" v-bind="on" icon="mdi-pencil" style="margin-right: 20px"></v-btn>
                </template>
              </v-tooltip>
            </span>
            <span>
              <v-tooltip :text="this.$t('delete')" activator="parent" open-delay="300">
                <template v-slot:activator="{ on }">
                  <v-btn size="small" @click="promptDelete(item)" color="error" v-bind="on" icon="mdi-delete"></v-btn>
                </template>
              </v-tooltip>
            </span>
          </td>
        </tr>
      </template>

      <template v-slot:no-data>
        {{ this.$t(`noNASFound`) }}
      </template>
    </v-data-table-server>

    <DeleteDialog v-model:value="deleteDialog" @confirmDelete="confirmDelete"/>
    <v-dialog v-model="addDialog" max-width="1024px" content-class="custom-dialog">
      <NASAdd @close-dialog="closeDialogs" @data-updated="fetchNASList(currentPage, pageSize)"/>
    </v-dialog>
    <v-dialog v-model="editDialog" max-width="1024px" content-class="custom-dialog">
      <NASEdit @close-dialog="closeDialogs" :id="nasToEdit" @data-updated="fetchNASList(currentPage, pageSize)"/>
    </v-dialog>

  </v-container>
</template>

<script>
import DeleteDialog from "@/components/DeleteDialog.vue";
import NASAdd from "@/views/nas/NASAdd.vue";
import NASEdit from "@/views/nas/NASEdit.vue";
import {apiService} from "@/apiService";

export default {
  components: {NASEdit, DeleteDialog, NASAdd},
  data() {
    return {
      headers: [
        {title: this.$t(`nasName`), key: 'nasName', width: '20%', sortable: false},
        {title: this.$t(`shortName`), key: 'shortName', width: '10%', sortable: false},
        {title: this.$t(`type`), key: 'type', width: '10%', sortable: false},
        {title: this.$t(`ports`), key: 'ports', width: '10%', sortable: false},
        {title: this.$t(`server`), key: 'server', width: '20%', sortable: false},
        {title: this.$t(`description`), key: 'description', width: '25%', sortable: false},
      ],
      filters: {
        nasName: '',
        type: '',
        server: '',
        description: ''
      },
      addDialog: false,
      editDialog: false,
      deleteDialog: false,
      nasToEdit: null,
      loading: false,
      currentPage: 1,
      pageSize: 10,
      totalPages: 1,
      totalElements: 1,
      nasToDelete: null,
      nasList: []
    };
  },

  methods: {
    fetchNASList({ page, itemsPerPage }) {
      if (page === undefined) page = this.currentPage
      if (itemsPerPage === undefined) itemsPerPage = this.pageSize

      this.loading = true
      apiService.searchNAS(this.filters, page, itemsPerPage)
          .then(response => {
            this.loading = false

            if (response.data._embedded !== undefined) {
              this.nasList = response.data._embedded.nas;
              this.totalPages = response.data.page.totalPages
              this.totalElements = response.data.page.totalElements
              this.currentPage = response.data.page.number + 1
              this.pageSize = response.data.page.size
            } else {
              this.nasList = []
              this.totalPages = 0
              this.totalElements = 0
              this.currentPage = 1
            }

          })
          .catch(error => {
            console.error("Error fetching NAS list:", error);
            this.loading = false
          });
    },
    confirmDelete() {
      this.deleteDialog = false;

      apiService.deleteNAS(this.nasToDelete.id)
          .then(() => {
            this.$store.dispatch('toggleSuccessSnackbar');
            this.fetchNASList(this.currentPage, this.pageSize)
          })
          .catch((error) => {
            if (error.response.data.errorCode) {
              this.$store.state.errorMessage = error.response.data.message
              this.$store.dispatch('toggleFailureSnackbar');
            }
            console.error('Error deleting nas:', error);
          });
    },
    closeDialogs() {
      this.addDialog = false;
      this.editDialog = false;
    },
    addNAS() {
      this.addDialog = true;
    },
    editNAS(nas) {
      this.nasToEdit = nas.id.toString();
      this.editDialog = true
    },
    promptDelete(nas) {
      this.nasToDelete = nas;
      this.deleteDialog = true;
    },
  }
};
</script>

<style scoped>
@import "@/styles.css";
</style>
