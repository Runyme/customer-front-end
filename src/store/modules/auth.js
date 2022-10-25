import { store } from '@/store/'
import { $snack } from '@/services/snack'
import http from '@/services/http'
import router from '@/router'

const state = {
  token: localStorage.getItem('mb-token'),
  empresaId: localStorage.getItem('mb-empresa-id')
}

const getters = {
  getIsLogged(state) {
    return !!state.token
  },
  getEmpresaIsSet(state) {
    return !!state.empresaId
  }
}

const mutations = {
  LOGIN(state, payload) {
    store.dispatch('setCliente', payload.cliente)
    localStorage.setItem('mb-token', payload.token)
    state.token = payload.token
    $snack.success('Login efetuado com sucesso')
    router.push({ name: 'AuthEmpresa' })
  },
  LOGOUT(state, payload) {
    localStorage.clear()
    state.token = null
    state.empresaId = null
    router.push({ name: 'AuthLogin' })
    store.dispatch('setEmpresa', null)
    store.dispatch('setCliente', null)
  },
  SET_TOKEN(state, payload) {
    state.token = payload
  },
  SET_EMPRESA_ID(state, payload) {
    state.empresaId = payload
  },
}

const actions = {
  login({commit}, payload) {
    return new Promise((resolve, reject) => {
      http.post('cliente/login', payload)
        .then(res => {
          commit('LOGIN', res.data)
          resolve(res)
        })
        .catch(err => {
          $snack.error(err.response.data.message)
          reject(err)
        })
    })
  },
  logout({commit}, payload) {
    commit('LOGOUT', payload)
    router.push({ name: 'AuthLogin' }).catch(() => {})
  },
  setToken({commit}, payload) {
    commit('SET_TOKEN', payload)
  },
  setEmpresaId({commit}, payload) {
    commit('SET_EMPRESA_ID', payload)
  }
}

export default {
  state,
  getters,
  mutations,
  actions,
};