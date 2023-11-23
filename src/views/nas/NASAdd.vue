<template>
  <GenericOperation
      :title="this.$t(`nasAdd`)"
      :fields="nasFields"
      :endpoint="endpoint"
      :addLabel="this.$t(`add`)"
      :cancelLabel="this.$t(`cancel`)"
      @data-updated="$emit(':data-updated')"
  />
</template>

<script>
import GenericOperation from "@/views/common/GenericOperation.vue";
import {API_CONFIG} from "@/config.js";

export default {
  components: {
    GenericOperation
  },
  data() {
    return {
      nasFields: [
        {model: "nasName", label: this.$t('nasName'), style: "width: 50%"},
        {model: "shortName", label: this.$t('shortName'), style: "width: 50%"},
        {model: "type", label: this.$t('type'), style: "width: 50%"},
        {model: "ports", label: this.$t('ports'), style: "width: 50%"},
        {model: "secret", label: this.$t('secret'), style: "width: 50%"},
        {model: "server", label: this.$t('server'), style: "width: 100%" },
        {model: "community", label: this.$t('community'), style: "width: 100%"},
        {model: "description", label: this.$t('description'), style: "width: 100%"},
      ],
      endpoint: API_CONFIG.nas,
    };
  },
};
</script>
