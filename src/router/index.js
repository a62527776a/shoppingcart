import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Shopcart from '@/components/shopcart'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
      meta: {
        title: ''
      }
    },
    {
      path: '/shopcart',
      name: 'shopcart',
      component: Shopcart,
      meta: {
        title: ''
      }
    }
  ]
})
