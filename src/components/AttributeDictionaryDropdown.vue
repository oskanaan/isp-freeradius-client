<template>
  <v-autocomplete
      :key="autocompleteKey"
      v-model="selectedAttribute"
      v-model:search="search"
      :items="dictionaryItems"
      density="compact"
      :label="this.$t(`searchAttributePrompt`)"
      no-filter
      @change="emitSelectedAttribute"
      @update:search="fetchAttributesNow">
    <template v-slot:no-data>
      <v-list-item>
        {{ this.$t(`noAttributesFound`) }}
      </v-list-item>
    </template>

  </v-autocomplete>
</template>

<script>
import axios from 'axios';
import {apiService} from "@/apiService";

export default {
  props: {
    currentValue: String,
    autocompleteKey: Number,
    searchValue: String
  },
  data() {
    return {
      selectedAttribute: null,
      dictionaryItems: [],
      search: null,
      loading: false,
      pageLimit: 10,
      cancelTokenSource: null
    };
  },
  methods: {
    emitSelectedAttribute(){
      this.$emit("selected", this.selectedAttribute);
    },
    async fetchAttributes() {
      if (this.search !== '') {
        if (this.cancelTokenSource) {
          this.cancelTokenSource.cancel();
        }

        this.loading = true;
        this.cancelTokenSource = axios.CancelToken.source();

        try {
          const response = await apiService.getDictionaryAttributes(this.search, this.pageLimit, this.cancelTokenSource.token)
          this.dictionaryItems = response.data._embedded.dictionaryAttributes.map(value => value.attribute);
        } catch (error) {
          if (!axios.isCancel(error)) {
            console.error('Error fetching dictionary items:', error);
          }
        } finally {
          this.loading = false;
          this.cancelTokenSource = null;
        }
      }
    },
    fetchAttributesNow: function(text) {
      this.search = text
      this.fetchAttributes();
    }
  },
  watch: {
    autocompleteKey() {
      this.search = null
      this.dictionaryItems = []
      this.selectedAttribute = null
    },
    searchValue() {
      this.search = this.searchValue
      this.selectedAttribute = this.searchValue
      this.dictionaryItems.push(this.search)
    }
  }
};
</script>
