/**
 * 涉及商品列表的CRUD业务
 */

import data from './data/'
import plugins from '../plugins'

export const FIND_MVS_NETWROK = 'FIND_MVS_NETWROK' // 获取数据
export const ADD_SHOPCART = 'ADD_SHOPCART' // 添加至购物车
export const CHANGE_SHOPCART_NUM = 'CHANGE_SHOPCART_NUM' // 改变购物车数量
export const ALLPICK = 'ALLPICK' // 全选
export const COUNTPRICE = 'COUNTPRICE' // 计算总价
export const FIND_MVS_CACHE = 'FIND_MVS_CACHE' // 初始化购物车

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
     * 该函数为初始化从网络获取的函数
     */
    [FIND_MVS_NETWROK] (state, mvs) {
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
      state.productLen = 0
      state.totalPrice = 0
      state.isAllPick = false
      state.products = mvs
      plugins.cacheControl.setCache('mvs', mvs)
    },
    /**
     * @param { Array } state
     *  该函数为初始化从缓存获取的函数
     */
    [FIND_MVS_CACHE] (state) {
      state.productLen = 0
      state.products.forEach((item, idx) => {
        // 计算被加入购物车的商品数量
        idx > 5 ? item.isShow = false : item.isShow = true
        if (item.isAdd) state.productLen += item.num
        // 取消所有商品被选中状态
        item.selected = false
      })
    },
    [LOAD_MORE] (state, mvs) {
      mvs.forEach((item, idx) => {
        item.scrollTop = 0
        item.isShow = false
        item.isAdd = false
        item.num = 0
        item.selected = false
      })
      state.products = state.products.concat(mvs)
      plugins.cacheControl.setCache('mvs', state.products)
    },
    /**
     * @param { Array } state
     * @param { Number } idx 被操作的数组下标
     */
    [ADD_SHOPCART] (state, idx) {
      state.products[idx].isAdd = true
      state.products[idx].num++
      state.productLen++
      if (state.products[idx].selected) state.totalPrice += state.products[idx].score
      plugins.cacheControl.setCache('mvs', state.products)
    },
    /**
     * @param { Array } state
     * @param { Number } idx 被操作的数组下标
     * @param { Boolean } action 执行活动 true 增加 false 减少
     */
    [CHANGE_SHOPCART_NUM] (state, payLoad) {
      if (payLoad.action === 'plus') {
        state.products[payLoad.idx].num++
        state.productLen++
        // 如果该商品被添加且被选中 商品总价增加该商品的价格
        if (state.products[payLoad.idx].selected) state.totalPrice += state.products[payLoad.idx].score
      } else {
        if (state.products[payLoad.idx].num === 1) return
        state.products[payLoad.idx].num--
        state.productLen--
        // 如果该商品被减少且被选中 商品总价减去该商品的价格
        if (state.products[payLoad.idx].selected) state.totalPrice -= state.products[payLoad.idx].score
      }
      plugins.cacheControl.setCache('mvs', state.products)
    },
    /**
     * @param { Array } state
     * @param { Boolean } picked 是否全选
     */
    [ALLPICK] (state) {
      state.isAllPick = !state.isAllPick
      state.products.forEach(item => {
        if (item.isAdd) item.selected = state.isAllPick
      })
    },
    [DELETE_MV] (state, idx) {
      // 判断是否被选中 被选中则总价减去该商品的价格乘数量
      if (state.products[idx].selected) {
        state.totalPrice -= state.products[idx].num * state.products[idx].score
        state.products[idx].selected = false
      }
      state.products[idx].isAdd = false
      state.productLen -= state.products[idx].num
      state.products[idx].num = 0
      // 如果商品只剩0个 则全选取消
      if (state.productLen === 0) state.isAllPick = false
      plugins.cacheControl.setCache('mvs', state.products)
    },
    [DELETE_ALL_MVS] (state) {
      state.productLen = 0
      state.totalPrice = 0
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
      plugins.cacheControl.setCache('mvs', state.products)
    }
  }
}
