<template>
  <v-container>
    <h1 class="mb-5">{{ this.$t(`payInvoice`) }} </h1>

    <v-card class="elevation-12 mb-5">
      <v-card-title class="bg-primary white--text">{{ this.$t('paymentValue') }}</v-card-title>

      <v-row class="mx-3 no-gutters">
        <v-col cols="4">
          <h3>{{ this.$t(`currentTotalCost`, {cost: this.totalCost}) }}</h3>
          <h3>{{ this.$t(`currentPaidAmount`, {amount: (parseFloat(this.paidAmount) + parseFloat(this.adjustmentAmount))}) }}</h3>
        </v-col>
      </v-row>
      <v-row class="mx-3 no-gutters">
        <v-col cols="4">
          <v-text-field v-model="adjustmentAmount" :label="this.$t('adjustmentAmount')" required dense :error-messages="fieldErrors['paidAmount']"/>
        </v-col>
        <v-col cols="4" align-self="center">
          <v-btn color="success" @click="adjust">{{ this.adjustLabel }}</v-btn>
        </v-col>
      </v-row>
    </v-card>

    <v-row class="mb-5 mt-5" align="end">
      <v-col align="right">
        <v-btn color="grey darken-1" dark @click.prevent="$emit('close-dialog')">{{ this.$t('close') }}</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {apiService} from "@/apiService";

export default {
  props: {
    clientId: Number,
    totalCost: Number,
    paidAmount: Number,
  },
  data() {
    return {
      fieldErrors: [],
      adjustmentAmount: 0,
      adjustLabel: this.$t(`add`),
    };
  },
  methods: {
    adjust() {
      let processError = (error) => {
        if (error.response.data.errors) {
          const receivedErrors = {};
          for (const err of error.response.data.errors) {
            receivedErrors[err.field] = err.message;
          }
          this.fieldErrors = receivedErrors;
        }
      }

      apiService.payInvoice(this.clientId, this.adjustmentAmount)
          .then(() => {
            this.$store.dispatch('toggleSuccessSnackbar');
            this.$emit('close-dialog')
          }).catch(error => processError(error));
    },
  },
  watch: {
    adjustmentAmount(newVal) {
      if (newVal >= 0) {
        this.adjustLabel = this.$t(`add`)
      } else {
        this.adjustLabel = this.$t(`deduct`)
      }
    }
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