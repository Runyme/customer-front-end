const state = {
  servico: null,
  tomador: null
};

const getters = {
  getServico: (state) => {
    return state.servico;
  },
  getTomador: (state) => {
    return state.tomador;
  }
};

const mutations = {
  SET_SERVICO: (state, payload) => {
    state.servico = payload
  },
  SET_TOMADOR: (state, payload) => {
    if(!payload) {
      state.tomador = null
      return
    }
    const tomador = {
      cpf_cnpj: payload.cpf_cnpj,
      razao_social: payload.razao_social,
      id: payload.id,
      nome_cnpj: `${payload.razao_social} - ${payload.cpf_cnpj}`
    }
    state.tomador = tomador
  },
};

const actions = {
  setServico: ({commit}, payload) => {
    commit('SET_SERVICO', payload)
  },
  setTomador: ({commit}, payload) => {
    commit('SET_TOMADOR', payload)
  },
};

export default {
  state,
  getters,
  mutations,
  actions
};
