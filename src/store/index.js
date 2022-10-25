import Vue from "vue";
import Vuex from "vuex";

//Modules
import auth from './modules/auth'
import cliente from './modules/cliente'
import empresa from './modules/empresa'
import nfse from './modules/nfse'

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {},
  modules: {
    auth,
    cliente,
    empresa,
    nfse,
  },
})
