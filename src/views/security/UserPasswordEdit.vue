<template>
  <GenericOperation
      :title="this.$t(`userChangePassword`)"
      :fields="userFields"
      :endpoint="endpoint"
      :addLabel="this.$t(`update`)"
      :cancelLabel="this.$t(`cancel`)"
      @data-updated="$emit('data-updated')"
      @before-perform-operation="clearPassword"
      :id="id">
  </GenericOperation>
</template>

<script>
import {API_CONFIG} from "@/config";
import GenericOperation from "@/views/common/GenericOperation.vue";

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  components: {
    GenericOperation,
  },
  data() {
    return {
      userFields: [
        {model: "newPassword", label: this.$t('password'), type: "password", style: "width: 50%"},
      ],
      endpoint: `${API_CONFIG.users}`,
    };
  },
  methods: {
    clearPassword(entity) {
      console.log(entity)
      entity.password = ''
    }
  }
};
</script>
