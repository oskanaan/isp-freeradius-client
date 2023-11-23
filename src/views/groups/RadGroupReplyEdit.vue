<template>
  <v-container>
    <h1>{{this.$t(`radGroupReplyEditTitle`)}} {{ groupName }}</h1>

    <v-card class="elevation-12 mb-5">
      <v-card-title class="bg-primary white--text" v-if="!editMode">{{ this.$t('addRecord') }}</v-card-title>
      <v-card-title class="bg-primary white--text" v-if="editMode">{{ this.$t('updateRecord') }}</v-card-title>

      <v-row class="mx-3 no-gutters">
        <v-col cols="12">
          <AttributeDictionaryDropdown :search-value="attributeDictionarySearchValue"
                                       :autocompleteKey="autocompleteKey"
                                       :current-value="attributeName"
                                       @selected="value => this.attributeName = value" :error-messages="fieldErrors['attribute']"/>
        </v-col>
      </v-row>

      <v-row class="mx-3 no-gutters">
        <v-col cols="4">
          <EnumDropdown v-model="operator" enum-key="radiusOperators" :enum-values="radiusOperatorValues" class="compact-field" :error-messages="fieldErrors['operator']"/>
        </v-col>
        <v-col cols="4">
          <v-text-field v-model="value" :label="this.$t('value')" required dense :error-messages="fieldErrors['value']"/>
        </v-col>
        <v-col cols="4" align-self="center">
          <v-btn color="success" @click="addAttribute" v-if="!editMode">{{ this.$t('addAttribute') }}</v-btn>
          <v-btn color="success" @click="updateAttribute" v-if="editMode">{{ this.$t('updateAttribute') }}</v-btn>
          <v-btn @click="clear" class="ml-2">{{ this.$t('clear') }}</v-btn>
        </v-col>
      </v-row>
    </v-card>

    <v-data-table-server
        class="elevation-3"
        v-model:items-per-page="pageSize"
        :headers="headers"
        :items="replies"
        :items-per-page="pageSize"
        :items-length="totalElements"
        :server-items-length="totalElements"
        :loading="loading"
        @update:page="updatePage"
        @update:items-per-page="updateItemsPerPage"
    >
      <template v-slot:headers>
        <tr>
          <th v-for="header in headers" :key="header.text" :style="header.style" class="bg-secondary">
            {{ header.text }}
          </th>
        </tr>
      </template>
      <template v-slot:item="{ item }">
        <tr>
          <td><v-checkbox v-model="selectedGroupReplies" :value="item" hide-details="true"></v-checkbox></td>
          <td>{{ item.attribute }}</td>
          <td>{{ item.operator }}</td>
          <td>{{ item.value }}</td>
          <td>
            <span>
              <v-tooltip :text="this.$t('edit')" location="start" activator="parent" open-delay="300">
                <template v-slot:activator="{ on }">
                  <v-btn size="small" @click="editAttribute(item)" color="info" v-bind="on" icon="mdi-pencil" style="margin-right: 20px"></v-btn>
                </template>
              </v-tooltip>
            </span>
          </td>
        </tr>
      </template>
    </v-data-table-server>

    <v-row class="mt-5">
      <v-col align-self="center">
        <v-btn color="warning" @click="deleteSelectedAttributes">{{ this.$t('deleteSelectedAttributes') }}</v-btn>
      </v-col>
    </v-row>

    <v-row class="mb-5" align="end">
      <v-col align="right">
        <v-btn color="grey darken-1" dark @click.prevent="$emit('close-dialog')">{{ this.$t('close') }}</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AttributeDictionaryDropdown from "@/components/AttributeDictionaryDropdown.vue";
import EnumDropdown from "@/components/EnumDropdown.vue";
import {RadiusOperators} from "@/enums/enums.ts";
import {apiService} from "@/apiService";

export default {
  components: {EnumDropdown, AttributeDictionaryDropdown},
  props: ['groupName'],
  data() {
    return {
      headers: [
        { text: "", value: 'actions', sortable: false, style: "width: 10%; vertical-align: bottom"},
        { text: this.$t(`attribute`), value: 'attribute' },
        { text: this.$t(`operator`), value: 'operator' },
        { text: this.$t(`value`), value: 'value' },
        { text: '', value: '', style: "width: 5%; vertical-align: bottom" },
      ],
      replies: [],
      selectedGroupReplies: [],
      fieldErrors: [],
      id: '',
      attributeName: '',
      operator: '',
      radiusOperatorValues: Object.values(RadiusOperators),
      value: '',
      page: 1,
      pageSize: 4,
      totalElements: 0,
      loading: false,
      editMode: false,
      autocompleteKey: 0,
      attributeDictionarySearchValue: ''
    };
  },
  methods: {
    fetchAttributes() {
      this.loading = true;
      apiService.getGroupReplyByGroupName(this.groupName, this.page, this.pageSize)
          .then(response => {
            this.replies = response.data._embedded.radgroupreply;
            this.totalElements = response.data.page.totalElements;
            this.loading = false;
          })
          .catch(error => {
            console.error("Error fetching replies:", error);
            this.loading = false;
          });
    },
    addAttribute() {
      apiService.addGroupReply(this.groupName, this.attributeName, this.operator, this.value)
          .then(() => {
            this.fetchAttributes();
            this.attributeName = '';
            this.operator = '';
            this.value = '';
            this.autocompleteKey++;
            this.fieldErrors = [];
          })
          .catch(error => {
            console.error("Error adding attribute:", error);
            const receivedErrors = {};
            for (const err of error.response.data.errors) {
              receivedErrors[err.field] = err.message;
            }
            this.fieldErrors = receivedErrors;
          });
    },
        updateAttribute() {
      apiService.updateGroupReply(this.id, this.groupName, this.attributeName, this.operator, this.value)
          .then(() => {
            this.fetchAttributes();
            this.attributeName = '';
            this.operator = '';
            this.value = '';
            this.autocompleteKey++;
            this.fieldErrors = [];
            this.editMode = false
          })
          .catch(error => {
            console.error("Error adding user:", error);
            const receivedErrors = {};
            for (const err of error.response.data.errors) {
              receivedErrors[err.field] = err.message;
            }
            this.fieldErrors = receivedErrors;
          });
    },
    editAttribute(attribute) {
      this.id = attribute.id
      this.attributeName = attribute.attribute
      this.attributeDictionarySearchValue = this.attributeName
      this.operator = attribute.operator
      this.value = attribute.value
      this.editMode = true
    },
    clear() {
      this.id = ''
      this.attributeName = ''
      this.attributeDictionarySearchValue = ''
      this.operator = ''
      this.value = ''
      this.fieldErrors = []
      this.autocompleteKey++
      this.editMode = false
    },
    deleteSelectedAttributes() {
      if (this.selectedGroupReplies.length > 0) {
        apiService.deleteGroupReplies(this.selectedGroupReplies)
            .then(() => {
              this.fetchAttributes();
              this.selectedGroupReplies = [];
            })
            .catch(error => {
              console.error("Error deleting attributes:", error);
            });
      } else {
        this.$store.state.errorMessage = this.$t(`noUsersSelected`)
        this.$store.dispatch('toggleFailureSnackbar');
      }
    },
    updatePage(val) {
      this.page = val;
      this.fetchAttributes();
    },
    updateItemsPerPage(val) {
      this.pageSize = val;
      this.fetchAttributes();
    }
  },
  mounted() {
    this.fetchAttributes();
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