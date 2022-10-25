export default function tokenize({ next, store }) {
  return new Promise((resolve, reject) => {
    if(store.getters.getIsNotTokenized) {
      reject(next({ name: 'PaymentTokenize' }))
    }
    resolve()
  })
}