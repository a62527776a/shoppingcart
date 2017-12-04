/**
 * 涉及商品列表的CRUD业务
 */

import data from './data/'
import plugins from '../plugins'

export const FIND_MVS = 'FIND_MVS' // 获取数据
export const ADD_SHOPCART = 'ADD_SHOPCART' // 添加至购物车
export const CHANGE_NUM = 'CHANGE_SHOPCART_NUM' // 改变购物车数量
export const ALLPICK = 'ALLPICK' // 全选
export const SELECTED = 'SELECTED' // 是否选中
export const COUNTPRICE = 'COUNTPRICE' // 计算总价
export const INIT_SHOPCART = 'INIT_SHOPCART' // 初始化购物车

// 删除单个/全部商品
export const DELETE_MV = 'DELETE_MV'
export const DELETE_ALL_MVS = 'DELETE_ALL_MVS'

// 下拉加载
export const LOAD_MORE = 'LOAD_MORE'

const localStorage = window.localStorage

export default {
  state: {
    products: (localStorage.getItem('mvs') && JSON.parse(localStorage.getItem('mvs')).data) || data.mvs,
    productLen: 0, // 商品总数
    totalPrice: 0, // 购物车中被选中商品总价
    isAllPick: false // 是否被全选
  },
  mutations: {
    /**
     * @param { Array } state
     * @param { Array } mvs 从网络获取的数据
     */
    [FIND_MVS] (state, mvs) {
      /**
      * 给初始值值附上所需要的属性 包含
      * scrollTop: Number 距离页面顶部距离
      * isShow: Boolean 图片懒加载 是否显示
      * num: Number 商品数量
      * selected: Boolean 在购物车中是否被选中
      */
      mvs.forEach((item, idx) => {
        item.scrollTop = 0
        idx > 5 ? item.isShow = false : item.isShow = true
        item.isAdd = false
        item.num = 0
        item.selected = false
      })
      plugins.cacheControl.setCache('mvs', mvs)
      state.productLen = 0
      state.totalPrice = 0
      state.isAllPick = false
      state.products = mvs
    },
    [LOAD_MORE] (state, mvs) {
      mvs.forEach((item, idx) => {
        item.scrollTop = 0
        item.isShow = false
        item.isAdd = false
        item.num = 0
        item.selected = false
      })
      mvs = state.products.concat(mvs)
      plugins.cacheControl.setCache('mvs', mvs)
    },
    /**
     * @param { Array } state
     * @param { Number } idx 被操作的数组下标
     */
    [ADD_SHOPCART] (state, idx) {
      state.products[idx].isAdd = true
      state.products[idx].num++
      state.productLen++
      plugins.cacheControl.setCache('mvs', state.products)
    },
    /**
     * @param { Array } state
     * @param { Number } idx 被操作的数组下标
     * @param { Boolean } action 执行活动 true 增加 false 减少
     */
    [CHANGE_NUM] (state, idx, action) {
      if (action) {
        state.products[idx].num++
      } else {
        if (state[idx].num === 1) return
        state.products[idx].num++
      }
      plugins.cacheControl.setCache('mvs', state.products)
    },
    /**
     * @param { Array } state
     * @param { Boolean } picked 是否全选
     */
    [ALLPICK] (state, picked) {
      state.products.forEach(item => {
        if (item.isAdd) item.selected = picked
      })
    },
    [DELETE_MV] (state, idx) {
      state.products[idx].isAdd = false
      state.products[idx].selected = false
      state.products[idx].num = 0
      plugins.cacheControl.setCache('mvs', state.products)
    },
    [DELETE_ALL_MVS] (state) {
      state.products.forEach(item => {
        item.isAdd = false
        item.selected = false
        item.num = 0
      })
      plugins.cacheControl.setCache('mvs', state.products)
    },
    /**
     * @param { Array } state
     * 根据是否被加入购物车以及是否被选中来计算总价
     */
    [COUNTPRICE] (state) {
      let isAllPick = true
      let len = 0
      state.totalPrice = 0
      state.products.forEach(item => {
        if (item.isAdd) len += item.num // 计算购物车中商品
        if (item.isAdd && !item.selected) isAllPick = false // 判断是否被全选
        if (item.isAdd && item.selected) { // 加入购物车且被选中才计算总价
          state.totalPrice += item.num * item.score
        }
        state.productLen = len
        // 如果购物车中数量为０取消全选
        len === 0 ? state.isAllPick = false : state.isAllPick = isAllPick
      })
    },
    [INIT_SHOPCART] (state) {
      state.productLen = 0
      state.products.forEach(item => {
        // 计算被加入购物车的商品数量
        if (item.isAdd) state.productLen += item.num
        // 取消所有商品被选中状态
        item.selected = false
      })
    }
  }
}
