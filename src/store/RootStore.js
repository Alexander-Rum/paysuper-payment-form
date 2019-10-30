import Vue from 'vue';
import Vuex from 'vuex';
import DictionariesStore from './DictionariesStore';
import PaymentFormStore from './PaymentFormStore';
import { postMessage } from '../postMessage';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    apiUrl: '',
    lastSize: {
      width: 0,
      height: 0,
    },
  },
  mutations: {
    apiUrl(state, value) {
      state.apiUrl = value;
    },
    lastSize(state, value) {
      state.lastSize = value;
    },
  },
  actions: {
    async initState({ commit, dispatch }, { orderParams, orderData, options }) {
      commit('apiUrl', options.apiUrl);

      await Promise.all([
        dispatch('Dictionaries/initState'),
        dispatch('PaymentForm/initState', { orderParams, orderData, options }),
      ]);
    },

    reportResize({ state, commit }, newSize) {
      if (
        state.lastSize.width === newSize.width
        && state.lastSize.height === newSize.height
      ) {
        return;
      }
      commit('lastSize', newSize);
      postMessage('FORM_RESIZE', newSize);
    },
  },

  modules: {
    Dictionaries: DictionariesStore,
    PaymentForm: PaymentFormStore,
  },
});
