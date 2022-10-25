import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import { store } from '@/store'
import GlobalData from '@/services/globalData'
import { $snack } from '@/services/snack'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('mb-token')
  if(token) store.dispatch('setToken', token)

  const empresaId = localStorage.getItem('mb-empresa-id')
  if(empresaId) store.dispatch('setEmpresaId', empresaId)
  
  if(!to.meta.middleware) return next()
  const middleware = to.meta.middleware

  const context = {
    to,
    from,
    next,
    store,
    GlobalData,
    $snack
  }

  const runMiddleware = (middleware, index, context) => {
    const actualMiddleware = middleware[index]
    actualMiddleware(context)
      .then(() => {
        const nextMiddleware = middleware[index + 1]
        if(!nextMiddleware) return context.next()
        runMiddleware(middleware, index + 1, context)
      })
      .catch(() => console.warn('Você não tem permissão para acessar este endereço'))
  }

  runMiddleware(middleware, 0, context)
})

router.afterEach(() => GlobalData.loading = false)

export default router
