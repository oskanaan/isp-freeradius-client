import { createStore } from 'vuex';

const store = createStore({
  state: {
    showSuccessSnackbar: false,
    showFailureSnackbar: false,
    errorMessage: ""
  },
  mutations: {
    setShowSuccessSnackbar(state, value) {
      state.showSuccessSnackbar = value;
    },
    setShowFailureSnackbar(state, value) {
      state.showFailureSnackbar = value;
    },
  },
  actions: {
    toggleSuccessSnackbar({ commit }) {
      commit('setShowSuccessSnackbar', true);
      setTimeout(() => {
        commit('setShowSuccessSnackbar', false);
      }, 3000);
    },
    toggleFailureSnackbar({ commit }) {
      commit('setShowFailureSnackbar', true);
      setTimeout(() => {
        commit('setShowFailureSnackbar', false);
        this.state.errorMessage = ""
      }, 3000);
    },
  },
  getters: {
    showSuccessSnackbar: (state) => state.showSuccessSnackbar,
    showFailureSnackbar: (state) => state.showFailureSnackbar,
  },
});

export default store;
