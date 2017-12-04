import Vue from 'vue'
import Router from 'vue-router'
import ShopList from '@/components/shoplist'
import ShopCart from '@/components/shopcart'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'shoplist',
      component: ShopList
    },
    {
      path: '/shopcart',
      name: 'shopcart',
      component: ShopCart
    }
  ]
})
