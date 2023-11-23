<template>
  <GenericOperation
      :title="this.$t(`userAdd`)"
      :fields="userFields"
      :endpoint="endpoint"
      :addLabel="this.$t(`add`)"
      :cancelLabel="this.$t(`cancel`)"
      @data-updated="$emit(':data-updated')"
  />
</template>

<script>
import GenericOperation from "@/views/common/GenericOperation.vue";
import {API_CONFIG} from "@/config.js";
import {CountryCodes, UserRoles, UserStatus} from "@/enums/enums.ts";

export default {
  components: {
    GenericOperation
  },
  data() {
    return {
      userFields: [
        {model: "username", label: this.$t('username')},
        {model: "newPassword", label: this.$t('password'), type: "password"},
        {model: "name", label: this.$t('name')},
        {model: "nationality", label: this.$t('nationality'), component: "EnumDropdown", enumKey: "countryCodes", enumValues: Object.values(CountryCodes), defaultValue: "LB"},
        {model: "phone", label: this.$t('phone')},
        {model: "address", label: this.$t('address')},
        {model: "status", label: this.$t('status'), component: "EnumDropdown", enumKey: "userStatus", enumValues: Object.values(UserStatus), defaultValue: "ACTIVE"},
        {model: "roles", label: this.$t('roles'), component: "EnumDropdown", enumKey: "userRoles", enumValues: Object.values(UserRoles), defaultValue: "EMPLOYEE"},
      ],
      endpoint: API_CONFIG.users,
    };
  },
};
</script>
