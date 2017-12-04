/**
 * @param { Number } id 商品主键
 * @param { String } cover 商品封面
 * @param { String } name 商品名称
 * @param { String } briefDesc 商品简介
 * @param { String } artistName 商品作者
 * @param { Boolean } isShow 商品图片DOM元素是否到达一定阀值
 * @param { Number } scrollTop 商品图片DOM元素距离页面顶部的距离
 * @param { Number } num 商品数量
 * @param { Boolean } isAdd 商品是否被加入购物车
 * @param { Boolean } selected 商品是否在购物车中被选中
 * @param { Number } score 商品价格
 */
export default {
  mvs: [
    {
      id: 0,
      cover: '',
      name: '',
      briefDesc: '',
      artistName: '',
      isShow: false,
      scrollTop: 0,
      num: 0,
      isAdd: false,
      selected: false,
      score: 0
    }
  ]
}
