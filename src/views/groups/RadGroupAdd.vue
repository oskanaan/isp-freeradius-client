<template>
  <GenericOperation
      :title="this.$t(`radGroupCheckAdd`)"
      :fields="radGroupCheckFields"
      :endpoint="endpoint"
      :addLabel="this.$t(`add`)"
      :cancelLabel="this.$t(`cancel`)"
      @data-updated="$emit('data-updated')"
  />
</template>

<script>
import GenericOperation from "@/views/common/GenericOperation.vue";
import { API_CONFIG } from "@/config.js";

export default {
  components: {
    GenericOperation
  },
  data() {
    return {
      radGroupCheckFields: [
        {model: "groupName", label: this.$t('groupName'), style: "width: 50%"},
      ],
      endpoint: `${API_CONFIG.radgroups}`,
    };
  },
};
</script>
