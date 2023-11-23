<template>
  <v-select
      v-model="selectedValue"
      :items="enumItems"
      :label="this.$t(`enums.${this.enumKey}.${this.enumKey}`)"
      item-title="description"
      item-value="value"
      :error-messages="errorMessages"
      outlined
      @input="emitSelectedValue"
  ></v-select>
</template>

<script>
export default {
  props: {
    enumKey: String,
    enumValues: {
      type: Array,
      required: true,
    },
    errorMessages: Array,
  },
  data() {
    return {
      selectedValue: this.value,
      enumItems: [],
    };
  },
  mounted() {
    this.enumItems = this.enumValues.map((value) => ({
      value,
      description: this.$t(`enums.${this.enumKey}.${value?.toLowerCase()}`), // Use localized description
    }))
  },
  methods: {
    emitSelectedValue() {
      this.$emit("input", this.selectedValue);
    },
  },
};
</script>
