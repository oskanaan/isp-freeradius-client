<template>
  <v-alert v-if="showAlert" type="warning" dense outlined class="mb-5">
    {{ this.$t('extendedWarningMessage') }}
  </v-alert>

  <GenericOperation
      :title="this.$t(`invoiceEdit`)"
      :fields="invoiceFields"
      :endpoint="endpoint"
      :addLabel="this.$t(`update`)"
      :cancelLabel="this.$t(`cancel`)"
      @data-updated="$emit('data-updated')"
      @close-dialog="this.showAlert = false; $emit('close-dialog')"
      :id="id">
  </GenericOperation>
</template>

<script>
import {InvoiceStatuses} from "@/enums/enums.ts";
import GenericOperation from "@/views/common/GenericOperation.vue";
import {API_CONFIG} from "@/config";

export default {
  props: {
    id: {
      type: String,
      optional: true
    }
  },
  components: {
    GenericOperation,
  },
  data() {
    return {
      invoiceStatuses: Object.values(InvoiceStatuses),
      fieldErrors: {},
      showAlert: true,
      invoiceFields: [
        {model: "clientId", label: this.$t('clientId'), style: "width: 100%", component: "UserDropdown"},
        {model: "totalCost", label: this.$t('totalCostWithNote'), style: "width: 100%", component: "readonly"},
        {model: "paidAmount", label: this.$t('paidAmountWithNote'), style: "width: 100%", component: "readonly"},
        {model: "note", label: this.$t('note'), style: "width: 100%"},
        {model: "status", label: this.$t('status'), style: "width: 100%", component: "EnumDropdown", enumKey: "invoiceStatuses", enumValues: Object.values(InvoiceStatuses), defaultValue: "PENDING"},
        {model: "generatedAt", label: this.$t('generatedAt'), style: "width: 100%", component: "date"},
      ],
      endpoint: API_CONFIG.invoices,
      entity: Object
    };
  },
};
</script>
