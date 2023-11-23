<template>
  <GenericOperation
      :title="this.$t(`clientEdit`)"
      :fields="clientFields"
      :endpoint="endpoint"
      :addLabel="this.$t(`update`)"
      :cancelLabel="this.$t(`cancel`)"
      @data-updated="$emit('data-updated')"
      :id="id">
    <template #additional-columns="{ entity }">
      <v-col cols="6" style="padding-left: 40px">
        <v-row>
          <ClientMap @input="event => setCoordinates(event, entity)" :client="entity"/>
        </v-row>
        <v-row>
          <v-col>
            <span style="font-weight: bold">{{ this.$t(`longitude`) }}:</span> {{ entity.longitude }}
          </v-col>
          <v-col>
            <span style="font-weight: bold">{{ this.$t(`latitude`) }}:</span> {{ entity.latitude }}
          </v-col>
        </v-row>
      </v-col>
    </template>
  </GenericOperation>
</template>

<script>
import {ClientStatus, ClientSubscriptionModel} from "@/enums/enums.ts";
import GenericOperation from "@/views/common/GenericOperation.vue";
import {API_CONFIG} from "@/config";
import ClientMap from "@/components/ClientMap.vue";

export default {
  props: {
    id: String
  },
  components: {
    ClientMap,
    GenericOperation,
  },
  data() {
    return {
      addedClient: {},
      clientStatuses: Object.values(ClientStatus),
      fieldErrors: {},
      clientFields: [
        {model: "username", label: this.$t('username'), style: "width: 100%"},
        {model: "password", label: this.$t('password'), style: "width: 100%", type: "password"},
        {model: "fullName", label: this.$t('fullName'), style: "width: 100%"},
        {model: "phoneNumber", label: this.$t('phone'), style: "width: 100%"},
        {model: "cityId", label: this.$t('cityId'), style: "width: 100%", component: "CityDropdown"},
        {model: "addressText", label: this.$t('address'), style: "width: 100%"},
        {model: "subscriptionModel", label: this.$t('subscriptionModel'), style: "width: 100%", component: "EnumDropdown", enumKey: "clientSubscriptionModel", enumValues: Object.values(ClientSubscriptionModel), defaultValue: "MONTHLY"},
        {model: "status", label: this.$t('status'), style: "width: 100%", component: "EnumDropdown", enumKey: "clientStatuses", enumValues: Object.values(ClientStatus), defaultValue: "ACTIVE"},
      ],
      endpoint: API_CONFIG.clientEndpoint,
      entity: Object
    };
  },
  methods: {
    setCoordinates(event, entity) {
      const { latLng } = event;
      const lat = latLng.lat();
      const lng = latLng.lng();

      entity.latitude = lat;
      entity.longitude = lng;
    },
  },
};
</script>
