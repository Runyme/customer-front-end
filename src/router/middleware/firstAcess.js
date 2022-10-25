export default function firstAcess({ store, next, $snack }) {
  return new Promise((resolve, reject) => {
    if(store.getters.getClienteFirstAcess) {
      reject(next({ name: 'Profile' }))
      $snack.warning('Altere sua senha para continuar')
    }
    resolve()
  })
}