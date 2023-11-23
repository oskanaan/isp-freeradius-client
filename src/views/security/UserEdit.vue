<template>
  <GenericOperation
      :title="this.$t(`userEdit`)"
      :fields="userFields"
      :endpoint="endpoint"
      :addLabel="this.$t(`update`)"
      :cancelLabel="this.$t(`cancel`)"
      @data-updated="$emit('data-updated')"
      :id="id">
  </GenericOperation>
</template>

<script>
import {API_CONFIG} from "@/config";
import GenericOperation from "@/views/common/GenericOperation.vue";
import {CountryCodes, UserRoles, UserStatus} from "@/enums/enums.ts";

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
        {model: "username", label: this.$t('username')},
        {model: "name", label: this.$t('name')},
        {model: "nationality", label: this.$t('nationality'), component: "EnumDropdown", enumKey: "countryCodes", enumValues: Object.values(CountryCodes), defaultValue: "LB"},
        {model: "phone", label: this.$t('phone')},
        {model: "address", label: this.$t('address')},
        {model: "status", label: this.$t('status'), component: "EnumDropdown", enumKey: "userStatus", enumValues: Object.values(UserStatus), defaultValue: "ACTIVE"},
        {model: "roles", label: this.$t('roles'), component: "EnumDropdown", enumKey: "userRoles", enumValues: Object.values(UserRoles), defaultValue: "EMPLOYEE"},
      ],
      endpoint: `${API_CONFIG.users}`,
    };
  },
};
</script>
