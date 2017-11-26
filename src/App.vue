<template>
  <div id="app">
    <mu-appbar :title="($route.path !== '/' ? (totalPrice === '￥0' ? '' : totalPrice) : '') + ' ' + mvsLen + '件'">
      <mu-icon-button v-show="mvsLen !== 0" @click="deleteAllMvs" icon="close" slot="left"/>
      <mu-icon-button 
        v-show="$route.path !== '/'" 
        @click="allPick" 
        :icon="isAllPick ? 'favorite' : 'favorite_border'" 
        slot="left"/>
    </mu-appbar>
      <div style="height: 56px" v-if="scrollTop > 56"></div>
      <mu-tabs :class="{ 'fixedTab' : scrollTop > 56 }" :value="$route.path === '/' ? 'tab1' : 'tab2' ">
        <mu-tab @click="$router.push('/')" value="tab1" title="列表"/>
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
      activeTab: 'tab1',
      totalPrice: '',
      isAllPick: false,
      mvsLen: 0
    }
  },
  methods: {
    fixedTab () {
      window.onscroll = () => {
        this.scrollTop = document.body.scrollTop
        if (!this.$refs.component.mvs) return false
        this.$refs.component.mvs.forEach((item) => {
          if (item.isShow) return false
          if (this.$refs.component.clientHeight + this.scrollTop > item.scrollTop) item.isShow = true
        })
      }
    },
    allPick () {
      this.isAllPick = !this.isAllPick
      this.$refs.component.allPick(this.isAllPick)
    },
    deleteAllMvs () {
      this.isAllPick = false
      this.mvsLen = 0
      if (this.$refs.component.mvs) {
        this.$refs.component.mvs.forEach((item) => {
          item.isAdd = false
          item.selected = false
          item.num = 0
        })
        this.totalPrice = '￥0'
        localStorage.setItem('mvs', JSON.stringify(this.$refs.component.mvs))
      } else {
        this.$refs.component.deleteAllMvs()
      }
    }
  },
  created () {
    this.$router.push('/')
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