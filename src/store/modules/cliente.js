const state = {
  cliente: null,
};

const getters = {
  getCliente(state) {
    return state.cliente
  },
  getClienteFirstName(state) {
    return state.cliente.nome_completo.split(' ')[0]
  },
  getClienteFirstAcess(state) {
    return !state.cliente.acessou_web
  },
};

const mutations = {
  SET_CLIENTE(state, payload) {
    state.cliente = payload
  },
  SET_TEM_CARTAO(state, payload) {
    state.cliente.tem_cartao = payload
  },
  SET_CLIENTE_FIRST_ACESS(state, payload) {
    state.cliente.acessou_web = payload
  }
};

const actions = {
  setCliente({commit}, payload) {
    commit('SET_CLIENTE', payload)
  },
  setTemCartao({commit}, payload) {
    commit('SET_TEM_CARTAO', payload)
  },
  setClienteFirstAcess({commit}, payload) {
    commit('SET_CLIENTE_FIRST_ACESS', payload)
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
