import axios from 'axios'
import { store } from '@/store/'
import { $snack } from '@/services/snack'

const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_URL
});

axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('mb-token')

  config.headers['Accept'] = 'application/json'
  config.headers['Authorization'] = `Bearer ${token}`

  if(!config.headers['Content-Type']){
    config.headers['Content-Type'] = 'application/json'
  }

  return config
})

axiosInstance.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if(error.response.data.redirect) {
      store.dispatch('logout')
      return Promise.reject()
        .then(() => () => $snack.error('Faça seu login novamente'))
    }
    return Promise.reject(error)
  }
);

export default axiosInstance;
