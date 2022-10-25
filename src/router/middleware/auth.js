import http from '@/services/http'

export default function auth({ next, store, GlobalData }) {
  return new Promise((resolve, reject) => {
    if(!store.getters.getIsLogged) {
      return reject(next({ name: 'AuthLogin' }))
    }
    if(!store.getters.getCliente && store.getters.getIsLogged) {
      GlobalData.loading = true
      return http
        .get('/cliente')
        .then(res => {
          store.dispatch('setCliente', res.data.data)
          resolve()
        })
    }
    resolve()
  })
}
