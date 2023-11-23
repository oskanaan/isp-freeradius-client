<template>
  <v-container>
    <h1 class="text-h3 mb-2">{{ this.$t('invoiceList') }}</h1>

    <v-alert type="warning" dense outlined class="mb-5">
      {{ this.$t('extendedWarningMessage') }}
    </v-alert>


    <v-card class="mb-3 elevation-4">
      <v-card-title class="bg-primary white--text">{{ this.$t(`searchCriteria`) }}</v-card-title>
      <v-row>
        <v-col cols="3">
          <v-sheet class="ma-1 pa-1">
            <v-text-field v-model="filters.username" :label="this.$t(`username`)" @input="fetchInvoices" data-testid="usernameFilter" hide-details="true"></v-text-field>
          </v-sheet>
        </v-col>
        <v-col>
          <v-sheet class="ma-1 pa-1">
            <v-text-field v-model="filters.phone" :label="this.$t(`phone`)" @input="fetchInvoices" data-testid="phoneFilter" hide-details="true"></v-text-field>
          </v-sheet>
        </v-col>
        <v-col>
          <v-sheet class="ma-1 pa-1">
            <EnumDropdown v-model="filters.status"
                          enum-key="invoiceStatuses"
                          :enum-values="invoiceStatuses"/>

          </v-sheet>
        </v-col>
      </v-row>
    </v-card>

    <v-data-table-server class="elevation-3"
                         v-model:items-per-page="pageSize"
                         :headers="headers"
                         :items="invoices"
                         :items-length="totalElements"
                         :server-items-length="totalElements"
                         :loading="loading"
                         @update:options="fetchInvoices">
      <template v-slot:headers>
        <tr>
          <th v-for="header in headers" :key="header.text" :style="{width: header.width}" class="bg-secondary">
            <span class="ml-1">
            {{ header.text }}
            </span>
          </th>
          <th style="width: 5%;" class="bg-secondary">
            <span class="ml-11">
              <v-tooltip :text="this.$t('add')" location="start" activator="parent" open-delay="300">
                <template v-slot:activator="{ attrs }">
                  <v-btn size="small" style="color: green" v-bind="attrs" icon="mdi-plus" @click="addInvoice()" data-testid="addIcon"></v-btn>
                </template>
              </v-tooltip>
            </span>
          </th>
        </tr>
      </template>
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.id }}</td>
          <td>{{ item.totalCost }}</td>
          <td>{{ item.paidAmount }}</td>
          <td>{{ item.totalCost - item.paidAmount }}</td>
          <td>{{ moment(item.generatedAt) }}</td>
          <td>{{ item.note }}</td>
          <td><v-chip size="large" :color="this.statusColor(item)" icon="mdi-checkbox-marked-circle-outline">{{ this.$t(`enums.invoiceStatuses.${item.status.toLowerCase()}`) }}</v-chip></td>
          <td v-if="item.status != 'PENDING' && item.status != 'PARTIALLY_PAID' && item.status != 'OVER_PAID'"/>
          <td class="d-flex align-center" v-if="item.status == 'PENDING' || item.status == 'PARTIALLY_PAID' || item.status == 'OVER_PAID'">
            <span class="mx-5">|</span>
            <span>
            <v-tooltip :text="this.$t('edit')" location="start" activator="parent" open-delay="300">
              <template v-slot:activator="{ attrs }">
                <v-btn @click="editInvoice(item)" size="small" color="info" v-bind="attrs" icon="mdi-pencil" class="mx-1" data-testid="editIcon"></v-btn>
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
              <v-tooltip :text="this.$t('adjustInvoice')" activator="parent" open-delay="300">
                <template v-slot:activator="{ attrs }">
                  <v-btn v-on:click="adjustInvoice(item)" size="small" color="success" v-bind="attrs" icon="mdi-adjust" class="ml-5 mr-1"></v-btn>
                </template>
              </v-tooltip>
            </span>
            <span>
              <v-tooltip :text="this.$t('payInvoice')" activator="parent" open-delay="300">
                <template v-slot:activator="{ attrs }">
                  <v-btn v-on:click="payInvoice(item)" size="small" color="success" v-bind="attrs" icon="mdi-cash" class="ml-5 mr-1"></v-btn>
                </template>
              </v-tooltip>
            </span>
          </td>
        </tr>
      </template>

      <template v-slot:no-data>
        {{this.$t(`noInvoicesFound`)}}
      </template>
    </v-data-table-server>

    <DeleteDialog v-model:value="deleteDialog" @confirmDelete="confirmDelete"/>
    <v-dialog v-model="addDialog" max-width="1024px" content-class="custom-dialog">
      <InvoiceAdd @close-dialog="closeDialogs" @data-updated="fetchInvoices(currentPage, pageSize)"/>
    </v-dialog>
    <v-dialog v-model="editDialog" max-width="1024px" content-class="custom-dialog">
      <InvoiceEdit @close-dialog="closeDialogs" :id="invoiceToEdit" @data-updated="fetchInvoices(currentPage, pageSize)"/>
    </v-dialog>
    <v-dialog v-model="adjustDialog" max-width="1024px" content-class="custom-dialog">
      <InvoiceAdjustment @close-dialog="closeDialogs" :invoice-id="invoiceToEdit" :total-cost="totalCost" @data-updated="fetchInvoices(currentPage, pageSize)"/>
    </v-dialog>
    <v-dialog v-model="payDialog" max-width="1024px" content-class="custom-dialog">
      <InvoicePayment @close-dialog="closeDialogs" :client-id="clientId" :total-cost="totalCost" :paid-amount="paidAmount" @data-updated="fetchInvoices(currentPage, pageSize)"/>
    </v-dialog>

  </v-container>
</template>

<script>
import DeleteDialog from "@/components/DeleteDialog.vue";
import EnumDropdown from "@/components/EnumDropdown.vue";
import {InvoiceStatuses} from "@/enums/enums.ts";
import moment from "moment/moment";
import InvoiceEdit from "@/views/invoicing/InvoiceEdit.vue";
import InvoiceAdd from "@/views/invoicing/InvoiceAdd.vue";
import InvoiceAdjustment from "@/views/invoicing/InvoiceAdjustment.vue";
import InvoicePayment from "@/views/invoicing/InvoicePayment.vue";
import {apiService} from "@/apiService";

export default {
  components: {
    InvoicePayment,
    InvoiceAdjustment,
    InvoiceAdd,
    InvoiceEdit,
    EnumDropdown,
    DeleteDialog},
  data() {
    return {
      headers: [
        { text: this.$t(`invoiceId`), width: '10%', value: 'id' },
        { text: this.$t(`totalCost`), width: '10%', value: 'totalCost' },
        { text: this.$t(`paidAmount`), width: '10%', value: 'paidAmount' },
        { text: this.$t(`remainingAmount`), width: '10%', value: 'remainingAmount'},
        { text: this.$t(`generatedAt`), value: 'generatedAt'},
        { text: this.$t(`note`), value: 'note'},
        { text: this.$t(`status`), width: '10%', value: 'status'},
      ],
      filters: {
        username: '',
        phone: '',
        status: ''
      },
      addDialog: false,
      editDialog: false,
      adjustDialog: false,
      payDialog: false,
      editUsersDialog: false,
      deleteDialog: false,
      editReplyAttributesDialog: false,
      editCheckAttributesDialog: false,
      invoiceToEdit: null,
      totalCost: null,
      paidAmount: null,
      invoiceStatuses: Object.values(InvoiceStatuses),
      invoiceToDelete: null,
      clientId: null,
      loading: false,
      currentPage: 1,
      pageSize: 10,
      totalPages: 1,
      totalElements: 1,
      invoices: []
    };
  },

  methods: {
    fetchInvoices({ page, itemsPerPage }) {
      if (page === undefined) page = this.currentPage
      if (itemsPerPage === undefined) itemsPerPage = this.pageSize

      this.loading = true;
      apiService.searchInvoices(this.filters, page, itemsPerPage)
          .then(response => {
            this.loading = false;
            if (response.data._embedded !== undefined) {
              this.invoices = response.data._embedded.invoices;
              this.invoices.forEach(value => value["generatedAt"] = new Date(value["generatedAt"]))
              this.totalPages = response.data.page.totalPages;
              this.totalElements = response.data.page.totalElements;
              this.currentPage = response.data.page.number + 1;
              this.pageSize = response.data.page.size;
            } else {
              this.invoices = [];
              this.totalPages = 0;
              this.totalElements = 0;
              this.currentPage = 1;
            }
          })
          .catch(error => {
            console.error("Error fetching invoice list:", error);
            this.loading = false;
          });
    },
    moment(val) {
      return moment(val).format('MM/DD/YYYY hh:mm')
    },
    confirmDelete() {
      this.deleteDialog = false;

      apiService.deleteInvoice(this.invoiceToDelete.id)
          .then(() => {
            this.$store.dispatch('toggleSuccessSnackbar');
            this.fetchInvoices(this.currentPage, this.pageSize)
          })
          .catch((error) => {
            if (error.response.data.errorCode) {
              this.$store.state.errorMessage = error.response.data.message
              this.$store.dispatch('toggleFailureSnackbar');
            }
            console.error('Error deleting invoice:', error);
          });
    },
    statusColor(item) {
      if (item.status === 'PAID') {
        return "success"
      } else if (item.status === 'PARTIALLY_PAID') {
        return "warn"
      } else if (item.status === 'PENDING') {
        return "error"
      } else {
        return ""
      }
    },
    closeDialogs() {
      this.addDialog = false;
      this.editDialog = false;
      this.adjustDialog = false;
      this.payDialog = false;
      this.fetchInvoices(this.currentPage, this.pageSize)
    },
    addInvoice() {
      this.addDialog = true;
    },
    editInvoice(invoice) {
      this.invoiceToEdit = invoice.id.toString();
      this.editDialog = true;
    },
    adjustInvoice(invoice) {
      this.invoiceToEdit = invoice.id;
      this.totalCost = invoice.totalCost;
      this.adjustDialog = true;
    },
    payInvoice(invoice) {
      this.clientId = invoice.clientId;
      this.totalCost = invoice.totalCost;
      this.paidAmount = invoice.paidAmount;
      this.payDialog = true;
    },
    promptDelete(invoice) {
      this.invoiceToDelete = invoice;
      this.deleteDialog = true;
    }
  }
};
</script>

<style scoped>
@import "@/styles.css";
</style>
