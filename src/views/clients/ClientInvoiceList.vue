<template>
  <v-container>
    <h1 class="mb-5">{{ this.$t(`clientInvoiceList`) }} {{ username }}</h1>

    <v-card class="elevation-12 mb-5">
      <v-card-title class="bg-primary white--text">{{ this.$t('pay') }}</v-card-title>


      <v-row class="mx-3 no-gutters">
        <v-col cols="4">
          <v-text-field v-model="paymentAmount" :label="this.$t('paymentAmount')" required dense :error-messages="fieldErrors['paymentAmount']"/>
        </v-col>
        <v-col cols="4" align-self="center">
          <v-btn color="success" @click="pay">{{ this.$t('pay') }}</v-btn>
        </v-col>
      </v-row>
    </v-card>

    <v-data-table-server
        class="elevation-3"
        v-model:items-per-page="pageSize"
        :headers="headers"
        :items="invoices"
        :items-per-page="pageSize"
        :items-length="totalElements"
        :server-items-length="totalElements"
        :loading="loading"
        @update:page="updatePage"
        @update:items-per-page="updateItemsPerPage">

      <template v-slot:headers>
        <tr>
          <th v-for="header in headers" :key="header.text" :style="header.style" class="bg-secondary">
            {{ header.text }}
          </th>
        </tr>
      </template>
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.totalCost }}</td>
          <td>{{ item.paidAmount }}</td>
          <td>{{ item.totalCost - item.paidAmount }}</td>
          <td>{{ moment(item.generatedAt) }}</td>
          <td>{{ item.note }}</td>
          <td><v-chip size="large" :color="this.statusColor(item)" icon="mdi-checkbox-marked-circle-outline">{{ this.$t(`enums.invoiceStatuses.${item.status.toLowerCase()}`) }}</v-chip></td>
          <td>{{ item.invoicePeriod }}</td>
        </tr>
      </template>
    </v-data-table-server>

    <v-row class="mb-5 mt-5" align="end">
      <v-col align="right">
        <v-btn color="grey darken-1" dark @click.prevent="$emit('close-dialog')">{{ this.$t('close') }}</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {InvoiceStatuses} from "@/enums/enums.ts";
import moment from 'moment';
import {apiService} from "@/apiService";

export default {
  props: ['clientId', 'username'],
  data() {
    return {
      headers: [
        { text: this.$t(`totalCost`), value: 'totalCost' },
        { text: this.$t(`paidAmount`), value: 'paidAmount' },
        { text: this.$t(`remainingAmount`), value: 'remainingAmount'},
        { text: this.$t(`generatedAt`), value: 'generatedAt'},
        { text: this.$t(`note`), value: 'note'},
        { text: this.$t(`status`), value: 'status'},
        { text: this.$t(`invoicePeriod`), value: 'invoicePeriod'},
      ],
      invoices: [],
      fieldErrors: [],
      invoiceStatuses: Object.values(InvoiceStatuses),
      paymentAmount: 0,
      page: 1,
      pageSize: 4,
      totalElements: 0,
      loading: false
    };
  },
  methods: {
    fetchInvoices() {
      if (this.clientId !== undefined && this.clientId !== null) {
        this.loading = true;
        apiService.getClientInvoices(this.clientId, this.page, this.pageSize)
            .then(response => {
              this.invoices = response.data._embedded.invoices;
              this.totalElements = response.data.page.totalElements;
              this.loading = false;
            })
            .catch(error => {
              console.error("Error fetching invoices:", error);
              this.loading = false;
            });
      }
    },
    fetchRemainingAmount() {
      if (this.clientId !== undefined && this.clientId !== '') {
        apiService.getLatestClientInvoices(this.clientId, this.page, this.pageSize)
            .then(response => {
              let pendingInvoices = response.data._embedded.invoices;
              if (pendingInvoices.length > 0) {
                if (pendingInvoices.length > 1) {
                  console.error("Too many pending invoices found")
                }
                let pendingInvoice = pendingInvoices[0]
                this.paymentAmount = pendingInvoice.totalCost - pendingInvoice.paidAmount
              } else {
                console.log("No pending invoices found")
              }

            })
            .catch(error => {
              console.error("Error fetching invoices:", error);
            });
      }
    },
    pay() {
      let processError = (error) => {
        if (error.response.data.errors) {
          const receivedErrors = {};
          for (const err of error.response.data.errors) {
            receivedErrors[err.field] = err.message;
          }
          this.fieldErrors = receivedErrors;
        }
      }

      apiService.payClientInvoice(this.clientId, this.paymentAmount)
          .then(() => {
            this.$store.dispatch('toggleSuccessSnackbar');
            this.fetchInvoices()
          })
          .catch(error => processError(error));
    },
    moment(val) {
      return moment(val).format('MM/DD/YYYY hh:mm')
    },
    updatePage(val) {
      this.page = val;
      this.fetchInvoices();
    },
    updateItemsPerPage(val) {
      this.pageSize = val;
      this.fetchInvoices();
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
    }
  },
  mounted() {
    this.fetchInvoices();
    this.fetchRemainingAmount();
  }
};
</script>

<style scoped>
.no-gutters {
  margin: 0;
  padding: 0;
}

.compact-field {
  margin: 0;
}
</style>