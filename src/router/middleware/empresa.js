import http from '@/services/http'

export default function empresa({ store, next, GlobalData }) {
  return new Promise((resolve, reject) => {
    if(!store.getters.getEmpresaIsSet) {
      reject(next({ name: 'AuthLogin' }))
    }
    if(!store.getters.getEmpresa && store.getters.getEmpresaIsSet) {
      GlobalData.loading = true
      return http
        .get(`empresas/${localStorage.getItem('mb-empresa-id')}`)
        .then(res => {
          store.dispatch('setEmpresa', res.data.data)
          resolve()
        })
    } 
    resolve()
  })
}