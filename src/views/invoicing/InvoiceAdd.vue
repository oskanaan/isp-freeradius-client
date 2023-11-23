<template>
  <GenericOperation
      :title="this.$t(`invoiceEdit`)"
      :fields="invoiceFields"
      :endpoint="endpoint"
      :addLabel="this.$t(`add`)"
      :cancelLabel="this.$t(`cancel`)"
      @data-updated="$emit('data-updated')">
  </GenericOperation>
</template>

<script>
import {InvoiceStatuses} from "@/enums/enums.ts";
import GenericOperation from "@/views/common/GenericOperation.vue";
import {API_CONFIG} from "@/config";

export default {
  props: {
    id: String
  },
  components: {
    GenericOperation,
  },
  data() {
    return {
      invoiceStatuses: Object.values(InvoiceStatuses),
      fieldErrors: {},
      invoiceFields: [
        {model: "clientId", label: this.$t('clientId'), style: "width: 100%", component: "UserDropdown"},
        {model: "totalCost", label: this.$t('totalCost'), style: "width: 100%"},
        {model: "paidAmount", label: this.$t('paidAmount'), style: "width: 100%"},
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
