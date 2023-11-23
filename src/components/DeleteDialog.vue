<template>
  <v-dialog v-model="internalDialog" @click:outside="closeDialog()" max-width="300px">
    <v-card>
      <v-card-title>{{ this.$t(`deleteConfirmation`) }}</v-card-title>
      <v-card-text>{{ this.$t(`actionConfirm`) }}</v-card-text>
      <v-card-actions>
        <v-btn color="green darken-1" text @click="closeDialog()">{{ this.$t(`no`) }}</v-btn>
        <v-btn color="red darken-1" text @click="handleConfirmDelete">{{ this.$t(`yes`) }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      internalDialog: this.value
    };
  },
  watch: {
    value(newValue) {
      this.internalDialog = newValue;
    },
    internalDialog(newValue) {
      this.$emit("input", newValue);
    }
  },
  methods: {
    handleConfirmDelete() {
      this.$emit("confirmDelete");
      this.internalDialog = false;
      this.$emit('update:value', false);
    },
    closeDialog() {
      this.internalDialog = false;
      this.$emit('update:value', false);
    }
  }
};
</script>
