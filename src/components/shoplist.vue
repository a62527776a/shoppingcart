<template>
  <div class="hello">
    <mu-refresh-control :refreshing="refreshing" :trigger="mvsEl" @refresh="findMvs"/>
    <div ref="mvs_list" class="demo-refresh-container">
        <mu-grid-list class="gridlist-demo">
          <mu-grid-tile ref="imgs" v-for="(item, index) in $store.state.mvs.products" v-show="$store.state.mvs.products.length !== 1" :key="index">
            <transition name="refresh">
            <img style="relative" 
              v-show="!isReload"
              :src="item.isShow ? item.cover : ''" />
            </transition>
            <span slot="title">{{item.name}}</span>
            <span slot="subTitle">by <b>{{item.artistName}}</b> ￥{{item.score | totalPrice}}</span>
            <mu-icon-button @click="$store.commit('ADD_SHOPCART', index)" slot="action">
            <mu-icon value="shopping_cart" :color="item.isAdd ? '#ff5252' : ''" />
            </mu-icon-button>
          </mu-grid-tile>
        </mu-grid-list>
        <mu-infinite-scroll :scroller="window" loadingText="" :loading="loading" @load="loadMore" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'shop-list',
  data () {
    return {
      refreshing: false,
      loading: false,
      mvsEl: null,
      scrollTop: 0,
      isReload: false,
      clientHeight: 0,
      window: null
    }
  },
  methods: {
    // 数据
    findMvs () {
      // 发起网络请求前先获取缓存数据
      this.$plugins.cacheControl.getCache('mvs', 5).then(res => {
        // 处理购物车被选中状态
        this.$store.commit('INIT_SHOPCART')
      }).catch(e => {
        if (/cache 404/.test(e) || /cache dead/.test(e)) {
          this.findMvsByNetWork()
          return
        }
        // 如果出现网络问题 则另外处理
        console.error(new Error(e))
      })
    },
    findMvsByNetWork () {
      // 在数据返回前都处理加载中状态
      this.refreshing = true
      this.$baseService.get('/top/mv?limit=20').then((res) => {
        this.reload()
        this.$store.commit('FIND_MVS', res.data)
        this.loopImgsScrollTop()
        this.refreshing = false
      }).catch((e) => {
        this.refreshing = false
      })
    },
    // 上拉加载
    loadMore () {
      // 在数据返回前都处理加载中状态
      this.loading = true
      this.$baseService.get(`/top/mv?limit=20&offset=${this.$store.state.mvs.products.length / 20}`).then(res => {
        this.offset++
        res.data.forEach((item, idx) => {
          item.scrollTop = 0
          item.isShow = false
          item.isAdd = false
          item.num = 0
          item.selected = false
        })
        this.mvs = this.mvs.concat(res.data)
        this.loopImgsScrollTop()
        this.loading = false
      }).catch((e) => {
        this.loading = false
      })
    },
    // 工具类
    reload () { // 控制加载时的缓入缓出 增强用户体验
      this.isReload = true
      setTimeout(() => {
        this.isReload = false
      }, 100)
    },
    // 处理每个图片距离页面顶部的距离
    loopImgsScrollTop () {
      this.$nextTick(() => {
        this.$refs.imgs.forEach((item, idx) => {
          // 每个对象都有自己距离页面顶部的距离 当浏览器滚动到界面高度减去该值时 该图片将被显示
          this.$store.state.mvs.products[idx].scrollTop = item.$el.offsetTop
        })
      })
    }
  },
  filters: {
    totalPrice (data) {
      // 边界处理 当数据不满足要求 则一律返回0
      if (!data || data === '0' || data === '') return 0
      // 是否为浮点数 是否包含 .
      let isFloat = false
      let newData = data.toString()
      if (/./.test(newData)) isFloat = true
      // 分割为数组
      let dataArray = data.toString().split('')
      // 根据千分位为每隔3位加一逗号的原理 存储千分位位置 判断是否为浮点数 浮点数则从第6位开始
      // '1,234.56' '1,234'
      let dataArrayLen = isFloat ? dataArray.length - 6 : dataArray.length - 3
      if (dataArrayLen > 0) {
        let priceFormat = (data) => {
          dataArray.splice(dataArrayLen, 0, ',')
          dataArrayLen = dataArrayLen - 3
          // 如果剩余未处理的数据小于1 则为全部处理完毕 将数组拼接
          if (dataArrayLen < 1) {
            newData = dataArray.join('')
            return
          }
          priceFormat(newData)
        }
        priceFormat(data)
      }
      return (newData)
    }
  },
  created () {
    this.findMvs()
    this.clientHeight = document.documentElement.clientHeight
    this.window = window
  },
  mounted () {
    this.mvsEl = this.$refs.mvs_list
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.demo-refresh-container{
  overflow: hidden;
  -webkit-overflow-scrolling: touch;
  position: relative;
  user-select: none;
}
.refresh-enter-active {
  transition: opacity .3s
}
.refresh-enter, .refresh-leave-to {
  opacity: 0
}
</style>
