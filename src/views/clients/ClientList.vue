<template>
  <v-container>
    <div>
      <h1 class="text-h3 mb-2">{{ this.$t(`clientList`) }}</h1>

      <!-- Filter inputs -->
      <v-container>

        <v-card class="mb-3 elevation-4">
          <v-card-title class="bg-primary white--text">{{ this.$t(`searchCriteria`) }}</v-card-title>
          <v-card-text>
            <v-row no-gutters>
              <v-col sm="4" md="3" lg="2">
                <v-sheet class="ma-2 pa-2">
                  <v-text-field v-model="filters.username" :label="this.$t(`username`)" @blur="fetchClients" outlined dense prepend-inner-icon="mdi-magnify" data-testid="usernameFilter" hide-details="true"></v-text-field>
                </v-sheet>
              </v-col>
              <v-col sm="2" md="3" lg="4">
                <v-sheet class="ma-2 pa-2">
                  <v-text-field v-model="filters.fullName" :label="this.$t(`fullName`)" @blur="fetchClients" outlined dense prepend-inner-icon="mdi-magnify" data-testid="fullNameFilter" hide-details="true"></v-text-field>
                </v-sheet>
              </v-col>
              <v-col sm="4" md="3" lg="2">
                <v-sheet class="ma-2 pa-2">
                  <v-text-field v-model="filters.phone" :label="this.$t(`phone`)" @blur="fetchClients" outlined dense prepend-inner-icon="mdi-magnify" hide-details="true"></v-text-field>
                </v-sheet>
              </v-col>
              <v-col sm="4" md="3" lg="2">
                <v-sheet class="ma-2 pa-2">
                  <EnumDropdown v-model="filters.status" enum-key="clientStatuses" :enum-values="clientStatuses" @update:modelValue="fetchClients" hide-details="true"></EnumDropdown>
                </v-sheet>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-container>

      <v-data-table-server class="elevation-3"
                           v-model:items-per-page="pageSize"
                           :headers="headers"
                           :items="clients"
                           :items-length="totalElements"
                           :server-items-length="totalElements"
                           :loading="loading"
                           @update:options="fetchClients">
        <template v-slot:headers>
          <tr>
            <th v-for="header in headers" :key="header.text" :style="{width: header.width}" class="bg-secondary">
              {{ header.title }}
            </th>
            <th style="width: 5%;" class="bg-secondary">
              <span class="ml-11" v-if="userType === 'ADMIN'">
                <v-tooltip :text="this.$t('add')" location="start" activator="parent" open-delay="300">
                  <template v-slot:activator="{ on }">
                    <v-btn size="small" style="color: green" v-bind="on" icon="mdi-plus" @click="addClient()"></v-btn>
                  </template>
                </v-tooltip>
              </span>
            </th>
          </tr>
        </template>
        <template v-slot:body="{ items }">
          <tr v-for="client in items" :key="client">
            <td>{{ client.columns.username }}</td>
            <td class="client-name">{{ client.columns.fullName }}</td>
            <td>{{ client.columns.phoneNumber }}</td>
            <td>{{ client.columns.groups }}</td>
            <td><v-chip size="large" :color="client.columns.status === 'ACTIVE' ? 'green-darken-2' : 'grey'" icon="mdi-checkbox-marked-circle-outline">{{ this.$t(`enums.clientStatuses.${client.columns.status.toLowerCase()}`) }}</v-chip></td>
            <td>{{ this.$t(`enums.clientSubscriptionModel.${client.columns.subscriptionModel?.toLowerCase()}`) }}</td>
            <td class="d-flex align-center">
              <span class="mx-5" v-if="userType === 'ADMIN'">|</span>
              <span v-if="userType === 'ADMIN'">
                <v-tooltip :text="this.$t('edit')" location="start" activator="parent" open-delay="300">
                  <template v-slot:activator="{ on }">
                    <v-btn size="small" @click="editClient(client)" color="info" v-bind="on" icon="mdi-pencil" class="mx-1"></v-btn>
                  </template>
                </v-tooltip>
              </span>
              <span v-if="userType === 'ADMIN'">
                <v-tooltip :text="this.$t('delete')" activator="parent" open-delay="300">
                  <template v-slot:activator="{ on }">
                    <v-btn size="small" @click="promptDelete(client)" color="error" v-bind="on" icon="mdi-delete" class="ml-1 mr-5"></v-btn>
                  </template>
                </v-tooltip>
              </span>
              <span>|</span>
              <span v-if="userType === 'ADMIN'">
                <v-tooltip :text="this.$t('editAttributes')" activator="parent" open-delay="300">
                  <template v-slot:activator="{ on }">
                    <v-btn size="small" @click="editAttributes(client)" color="success" v-bind="on" icon="mdi-account-details" class="ml-5 mr-1"></v-btn>
                  </template>
                </v-tooltip>
              </span>
              <span v-if="userType === 'ADMIN'">
                <v-tooltip :text="this.$t('editReplyAttributes')" activator="parent" open-delay="300">
                  <template v-slot:activator="{ on }">
                    <v-btn size="small" @click="editReplyAttributes(client)" color="success" v-bind="on" icon="mdi-reply" class="mx-1"></v-btn>
                  </template>
                </v-tooltip>
              </span>
              <span v-if="userType === 'ADMIN'">
                  <v-tooltip :text="this.$t('editGroups')" activator="parent" open-delay="300">
                  <template v-slot:activator="{ on }">
                    <v-btn size="small" @click="editGroups(client)" color="success" v-bind="on" icon="mdi-account-group" class="mx-1"></v-btn>
                  </template>
                </v-tooltip>
              </span>
              <span v-if="userType === 'EMPLOYEE'" class="mr-5"></span>
              <span>
                  <v-tooltip :text="this.$t('invoiceList')" activator="parent" open-delay="300">
                  <template v-slot:activator="{ on }">
                    <v-btn size="small" @click="showInvoices(client)" color="success" v-bind="on" icon="mdi-cash" class="mx-1"></v-btn>
                  </template>
                </v-tooltip>
              </span>
            </td>
          </tr>
        </template>
        <template v-slot:no-data>
          {{ this.$t(`noClientsFound`) }}
        </template>
      </v-data-table-server>
    </div>

    <DeleteDialog v-model:value="deleteDialog" @confirmDelete="confirmDelete"/>
    <v-dialog v-model="addClientDialog" max-width="1024px" content-class="custom-dialog">
      <ClientAdd @close-dialog="closeDialogs" @data-updated="fetchClients(currentPage, pageSize)"/>
    </v-dialog>

    <v-dialog v-model="editClientDialog" max-width="1024px" content-class="custom-dialog">
      <ClientEdit :id="clientToEditId" @close-dialog="closeDialogs" @data-updated="fetchClients(currentPage, pageSize)"/>
    </v-dialog>

    <v-dialog v-model="editAttributesDialog" max-width="1024px" content-class="custom-dialog">
      <RadCheckEdit @close-dialog="closeDialogs" :username="username"/>
    </v-dialog>

    <v-dialog v-model="editReplyAttributesDialog" max-width="1024px" content-class="custom-dialog">
      <RadReplyEdit @close-dialog="closeDialogs" :username="username"/>
    </v-dialog>

    <v-dialog v-model="editGroupsAttributesDialog" max-width="1024px" content-class="custom-dialog">
      <RadUserGroupsEdit @close-dialog="closeDialogs" :username="username"/>
    </v-dialog>

    <v-dialog v-model="showInvoiceDialog" max-width="1024px" content-class="custom-dialog">
      <ClientInvoiceList @close-dialog="closeDialogs" :client-id="clientToEditId" :username="username"/>
    </v-dialog>

  </v-container>
</template>


<script>
import EnumDropdown from "@/components/EnumDropdown.vue";
import {ClientStatus, ClientSubscriptionModel} from "@/enums/enums.ts"
import ClientAdd from "@/views/clients/ClientAdd.vue";
import ClientEdit from "@/views/clients/ClientEdit.vue";
import DeleteDialog from "@/components/DeleteDialog.vue";
import RadCheckEdit from "@/views/clients/RadCheckEdit.vue";
import RadUserGroupsEdit from "@/views/clients/RadUserGroupsEdit.vue";
import RadReplyEdit from "@/views/clients/RadReplyEdit.vue";
import ClientInvoiceList from "@/views/clients/ClientInvoiceList.vue";
import {apiService} from "@/apiService";

export default {
  components: {
    ClientInvoiceList,
    RadReplyEdit,
    RadUserGroupsEdit,
    RadCheckEdit,
    DeleteDialog,
    EnumDropdown,
    ClientAdd,
    ClientEdit
  },
  data() {
    return {
      headers: [
        {title: this.$t(`username`), key: 'username', width: '20%', sortable: false},
        {title: this.$t(`fullName`), key: 'fullName', width: '20%', sortable: false},
        {title: this.$t(`phone`), key: 'phoneNumber', width: '10%', sortable: false},
        {title: this.$t(`groups`), key: 'groups', width: '15%', sortable: false},
        {title: this.$t(`status`), key: 'status', width: '10%', sortable: false},
        {title: this.$t(`subscriptionModel`), key: 'subscriptionModel', width: '10%', sortable: false},
      ],
      filters: {
        fullName: '',
        status: '',
        username: '',
        phone: ''
      },
      clients: [],
      currentPage: 1,
      pageSize: 10,
      totalPages: 1,
      totalElements: 1,
      loading: true,
      clientStatuses: Object.values(ClientStatus),
      clientSubscriptionModel: Object.values(ClientSubscriptionModel),
      username: '',
      deleteDialog: false,
      editAttributesDialog: false,
      editReplyAttributesDialog: false,
      editGroupsAttributesDialog: false,
      showInvoiceDialog: false,
      clientToDelete: null,
      addClientDialog: false,
      editClientDialog: false,
      clientToEditId: null,
      userType: localStorage.getItem("type"),
    };
  },
  methods: {
    fetchClients({ page, itemsPerPage }) {
      if (page === undefined) {
        page = this.currentPage
      } else {
        this.currentPage = page
      }

      if (itemsPerPage === undefined) {
        itemsPerPage = this.pageSize
      } else {
        this.pageSize = itemsPerPage
      }

      this.loading = true
      apiService.getClientList(this.filters, page, itemsPerPage).then((response) => {
        this.loading = false;
        if (response.data._embedded !== undefined) {
          this.clients = response.data._embedded.clients
          this.clients.forEach((client) => client.groups = client.radUserGroups.map(r => r.groupName).join(", "))
          this.totalPages = response.data.page.totalPages
          this.totalElements = response.data.page.totalElements
        } else {
          this.clients = []
          this.totalPages = 0
          this.totalElements = 0
        }
      }).catch(reason => {
        this.loading = false
        console.error("Error fetching clients:", reason);
      });
    },
    addClient() {
      this.addClientDialog = true;
    },
    editClient(client) {
      this.clientToEditId = client.raw.id.toString();
      this.editClientDialog = true;
    },
    closeDialogs() {
      this.addClientDialog = false;
      this.editClientDialog = false;
      this.editAttributesDialog = false;
      this.editReplyAttributesDialog = false;
      this.editGroupsAttributesDialog = false;
      this.showInvoiceDialog = false;
      this.fetchClients(this.currentPage, this.pageSize)
    },
    promptDelete(client) {
      this.clientToDelete = client;
      this.deleteDialog = true;
    },
    editAttributes(client) {
      this.username = client.raw.username;
      this.editAttributesDialog = true;
    },
    editReplyAttributes(client) {
      this.username = client.raw.username;
      this.editReplyAttributesDialog = true;
    },
    editGroups(client) {
      this.username = client.raw.username;
      this.editGroupsAttributesDialog = true;
    },
    showInvoices(client) {
      this.clientToEditId = client.raw.id;
      this.username = client.raw.username;
      this.showInvoiceDialog = true;
    },
    async confirmDelete() {
      this.deleteDialog = false;

      apiService.deleteClient(this.clientToDelete.raw.id)
          .then(() => {
            this.$store.dispatch('toggleSuccessSnackbar');
            this.fetchClients(this.currentPage, this.pageSize)
          })
          .catch((error) => {
            if (error.response.data.errorCode) {
              this.$store.state.errorMessage = error.response.data.message
              this.$store.dispatch('toggleFailureSnackbar');
            }
            console.error('Error deleting client:', error);
          });
    },
  },
};
</script>

<style scoped>
  @import "@/styles.css";
</style>
