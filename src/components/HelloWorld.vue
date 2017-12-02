<template>
  <div class="hello">
    <mu-refresh-control :refreshing="refreshing" :trigger="mvsEl" @refresh="refresh"/>
    <div ref="mvs_list" class="demo-refresh-container">
        <mu-grid-list class="gridlist-demo">
          <mu-grid-tile ref="imgs" v-for="item, index in mvs" v-show="mvs.length !== 1" :key="index">
            <transition name="refresh">
            <img style="relative" 
              v-show="!isReload"
              :src="item.isShow ? item.cover : ''" />
            </transition>
            <span slot="title">{{item.name}}</span>
            <span slot="subTitle">by <b>{{item.artistName}}</b> ￥{{item.score | totalPrice}}</span>
            <mu-icon-button @click="addShopCart(item)" slot="action">
            <mu-icon value="shopping_cart" :color="item.isAdd ? '#ff5252' : ''" />
            </mu-icon-button>
          </mu-grid-tile>
        </mu-grid-list>
        <mu-infinite-scroll :scroller="window" loadingText="" :loading="loading" @load="loadMore" />
    </div>
  </div>
</template>

<script>
import data from './data'

export default {
  name: 'HelloWorld',
  data () {
    return {
      mvs: data.mvs,
      offset: 1,
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
    findMvs () {
      this.refreshing = true
      this.offset = 1
      let storeMvs = JSON.parse(localStorage.getItem('mvs'))
      if (storeMvs && storeMvs.length > 100) {
        localStorage.clear()
      }
      if (storeMvs) {
        storeMvs.forEach((item, idx) => {
          if (item.isAdd) this.$root.$children[0].mvsLen += item.num
          item.selected = false
        })
        this.isReload = true
        setTimeout(() => {
          this.isReload = false
        }, 100)
        this.mvs = storeMvs
        this.refreshing = false
      } else {
        this.baseService.get(`/top/mv?limit=20`).then((res) => {
          this.isReload = true
          res.data.forEach((item, idx) => {
            item.scrollTop = 0
            idx > 5 ? item.isShow = false : item.isShow = true
            item.isAdd = false
            item.num = 0
            item.selected = false
          })
          setTimeout(() => {
            this.isReload = false
          }, 100)
          this.mvs = res.data
          this.$nextTick(() => {
            this.$refs.imgs.forEach((item, idx) => {
              this.mvs[idx].scrollTop = item.$el.offsetTop
            })
          })
          this.refreshing = false
        }).catch((e) => {
          this.refreshing = false
        })
      }
    },
    addShopCart (item) {
      this.$root.$children[0].mvsLen++
      item.isAdd = true
      item.num++
      localStorage.setItem('mvs', JSON.stringify(this.mvs))
    },
    loadMore () {
      this.loading = true
      this.baseService.get(`/top/mv?limit=20&offset=${this.offset}`).then((res) => {
        this.offset++
        res.data.forEach((item, idx) => {
          item.scrollTop = 0
          item.isShow = false
          item.isAdd = false
          item.num = 0
          item.selected = false
        })
        this.mvs = this.mvs.concat(res.data)
        this.$nextTick(() => {
          this.$refs.imgs.forEach((item, idx) => {
            this.mvs[idx].scrollTop = item.$el.offsetTop
          })
        })
        this.loading = false
      }).catch((e) => {
        this.loading = false
      })
    },
    refresh () {
      this.findMvs()
      this.$root.$children[0].mvsLen = 0
    }
  },
  filters: {
    totalPrice (data) {
      if (!data) return
      if (data === '') return 0
      if (data === '0') return 0
      let isFixed = false
      if (data.toString().indexOf('.') > -1) isFixed = true
      let newData = data.toString()
      let dataArray = data.toString().split('')
      let dataArrayLen = isFixed ? dataArray.length - 6 : dataArray.length - 3
      if (dataArrayLen > 0) {
        let priceFormat = (data) => {
          dataArray.splice(dataArrayLen, 0, ',')
          dataArrayLen = dataArrayLen - 3
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
    console.log(this.$store)
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
