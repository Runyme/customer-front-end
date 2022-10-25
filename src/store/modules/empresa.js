import http from '@/services/http'
import { store } from '@/store/'

const state = {
  empresa: null,
};

const getters = {
  getEmpresa(state) {
    return state.empresa
  },
  getEmpresaFaturamento(state) {
    return http.get(`faturamento/${state.empresa.id}?empresa_id=${state.empresa.id}`)
  },
  getEmpresaFaturamentoImpostos(state) {
    return http.get(`faturamento/liquido-impostos/${state.empresa.id}`)
  },
  getIsNotTokenized(state) {
    return state.empresa.forma_pagamento === 'cartao' && !state.empresa.tem_cartao
  },
};

const mutations = {
  SET_EMPRESA(state, payload) {
    state.empresa = payload
    if(payload) {
      localStorage.setItem('mb-empresa-id', payload.id)
      store.dispatch('setEmpresaId', payload.id)
    } else {
      store.dispatch('setEmpresaId', null)
    }
  },
  SET_TEMCARTAO(state, payload) {
    state.empresa.tem_cartao = payload
  },
  SET_FATURAS(state, payload) {
    state.empresa.faturas = payload
  },
};

const actions = {
  setEmpresa({commit}, payload) {
    commit('SET_EMPRESA', payload);
  },
  setTemCartao({commit}, payload) {
    commit('SET_TEMCARTAO', payload);
  },
  setFaturas({commit}, payload) {
    commit('SET_FATURAS', payload);
  },
};

export default {
  state,
  getters,
  mutations,
  actions
};
