import Vue from 'vue'
import Vuex from 'vuex'
import mvs from './mvs'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    mvs
  }
})
