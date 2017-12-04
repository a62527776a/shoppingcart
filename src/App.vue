<template>
  <div id="app">
    <mu-appbar :title="
      ($route.path !== '/' ? 
      ($store.state.mvs.totalPrice === '￥0'
      ? '' : '￥' + $plugins.filtersPrice($store.state.mvs.totalPrice).toString()) : 
      '已添加' + $store.state.mvs.productLen + '件 ')">
      <mu-flat-button 
        v-show="$store.state.mvs.productLen !== 0" 
        @click="deleteAllShopcart" 
        label="清空购物车" 
        slot="right"/>
      <mu-icon-button 
        v-show="$route.path !== '/' && $store.state.mvs.productLen !== 0" 
        @click="allPick"
        slot="left">
        <mu-icon 
          :value="$store.state.mvs.isAllPick ? 'favorite' : 'favorite_border'" 
          :color="$store.state.mvs.isAllPick ? '#ff5252' : '#FFF'"/>
      </mu-icon-button>
    </mu-appbar>
      <div style="height: 56px" v-if="scrollTop > 56"></div>
      <mu-tabs :class="{ 'fixedTab' : scrollTop > 56 }" 
               :value="$route.path === '/' ? 'tab1' : 'tab2' ">
        <mu-tab @click="$router.push('/')" value="tab1" title="商品"/>
        <mu-tab @click="$router.push('/shopcart')" value="tab2" title="购物车"/>
      </mu-tabs>
    <keep-alive>
    <router-view ref="component" />
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      scrollTop: 0,
      activeTab: 'tab1'
    }
  },
  methods: {
    fixedTab () {
      window.onscroll = () => {
        // 处理dom元素距离页面顶部高度
        this.scrollTop = document.body.scrollTop || document.documentElement.scrollTop
        // 只处理商品列表
        if (this.$route.path !== '/') return false
        this.$store.state.mvs.products.forEach((item) => {
          if (item.isShow) return false
          if (this.$refs.component.clientHeight + this.scrollTop > item.scrollTop) item.isShow = true
        })
      }
    },
    allPick () {
      this.$store.commit('ALLPICK')
      // 根据全选/全不选状态来判断是否需要计算总价 如果是全不选 则直接赋值
      this.$store.state.mvs.isAllPick ? this.$store.commit('COUNTPRICE') : this.$store.state.mvs.totalPrice = 0
    },
    deleteAllShopcart () {
      this.$store.commit('DELETE_ALL_MVS')
      this.$store.commit('COUNTPRICE')
    }
  },
  mounted () {
    this.fixedTab()
  }
}
</script>

<style lang="less" scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

<style lang="less">
.fixedTab {
  position: fixed;
  top: 0;
}
</style>