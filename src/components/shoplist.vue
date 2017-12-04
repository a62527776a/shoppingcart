<template>
  <div class="hello">
    <mu-refresh-control :refreshing="refreshing" :trigger="mvsEl" @refresh="findMvsByNetWork"/>
    <div ref="mvs_list" class="demo-refresh-container">
        <mu-grid-list class="gridlist-demo">
          <mu-grid-tile ref="imgs" v-for="(item, index) in $store.state.mvs.products" v-show="$store.state.mvs.products.length !== 1" :key="index">
            <img style="relative"
              :src="item.isShow ? item.cover : ''" />
            <span slot="title">{{item.name}}</span>
            <span slot="subTitle">by <b>{{item.artistName}}</b> ￥{{$plugins.filtersPrice(item.score)}}</span>
            <mu-icon-button @click="addShopcart(item, index)" slot="action">
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
        this.$store.commit('FIND_MVS_CACHE')
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
        this.$store.commit('FIND_MVS_NETWROK', res.data)
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
      this.$baseService.get(`/top/mv?limit=20&offset=${(this.$store.state.mvs.products.length / 20) + 1}`).then(res => {
        this.$store.commit('LOAD_MORE', res.data)
        this.loopImgsScrollTop()
        this.loading = false
      }).catch((e) => {
        this.loading = false
      })
    },
    // 处理每个图片距离页面顶部的距离
    loopImgsScrollTop () {
      this.$nextTick(() => {
        this.$refs.imgs.forEach((item, idx) => {
          // 每个对象都有自己距离页面顶部的距离 当浏览器滚动到界面高度减去该值时 该图片将被显示
          this.$store.state.mvs.products[idx].scrollTop = item.$el.offsetTop
        })
      })
    },
    addShopcart (item, idx) {
      this.$store.commit('ADD_SHOPCART', idx)
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
