// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import MuseUI from 'muse-ui'
import store from './store'

import 'muse-ui/dist/muse-ui.css'
import 'muse-ui/dist/theme-carbon.css'

import baseService from './service/index.js'

Vue.use(MuseUI)
Vue.config.productionTip = false

Vue.prototype.baseService = baseService

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
