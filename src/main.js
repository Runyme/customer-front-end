import Vue from 'vue'
import App from './App.vue'

// Plugins
import router from './router'
import { store } from "./store/index"
import Vuelidate from 'vuelidate'
import VueSnackbar from 'vue-snack'
import { snackConfig } from './services/snack'
import { Table, Autocomplete, Switch } from 'buefy'
import http from '@/services/http'

// Style
import "@/assets/styles/main.scss"

// Import Global Components and Icons
import '@/components/globals/_import'
import '@/components/icons/_import'

Vue.config.productionTip = false
Vue.use(Vuelidate)
Vue.use(VueSnackbar, snackConfig)
Vue.use(Table)
Vue.use(Autocomplete)
Vue.use(Switch)
Vue.prototype.$http = http;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')