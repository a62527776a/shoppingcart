import axios from 'axios'
import config from '../config'
import store from '../store/'

export let baseService = axios.create({
  baseURL: config.host,
  timeout: config.timeout,
  transformResponse: [function (data) {
    return JSON.parse(data).data
  }]
})

baseService.interceptors.request.use(config => {
  store.state.loading = true
  return config
}, error => {
  store.state.loading = false
  return Promise.reject(error)
})

baseService.interceptors.response.use(response => {
  setTimeout(() => {
    store.state.loading = false
  }, 500)
  let res = JSON.parse(response.request.response)
  if (res.code !== 200) {
    return Promise.reject(response)
  }
  return response
}, error => {
  store.state.loading = false
  // 如果超时 则catch timeout
  if (/timeout/.test(error.message)) {
    return Promise.reject(new Error('timeout'))
  }
  return Promise.reject(error)
})
