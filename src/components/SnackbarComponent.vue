<template>
  <div>
    <v-snackbar v-model="showSuccessSnackbar" color="success" @input="updateShowSuccess">
      {{ successMessage }}
    </v-snackbar>

    <v-snackbar v-model="showFailureSnackbar" color="error" @input="updateShowFailure">
      {{ this.$store.state.errorMessage }}
    </v-snackbar>
  </div>
</template>

<script>
export default {
  props: {
    successMessage: {
      type: String,
      default: ''
    },
  },
  computed: {
    showSuccessSnackbar() {
      return this.$store.state.showSuccessSnackbar;
    },
    showFailureSnackbar() {
      return this.$store.state.showFailureSnackbar;
    }
  },
  methods: {
    updateShowSuccess(newValue) {
      this.$emit('update:showSuccess', newValue);
    },
    updateShowFailure(newValue) {
      this.$emit('update:showFailure', newValue);
    }
  }
};
</script>
