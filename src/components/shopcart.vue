<template>
  <div class="shopcart">
    <mu-dialog :open="isDialog" title="警告" @close="isDialog = false">
      确定要删除该物品？
      <mu-flat-button slot="actions" @click="isDialog = false" primary label="取消"/>
      <mu-flat-button slot="actions" primary @click="deleteMv()" label="确定"/>
    </mu-dialog>
    <a class="tip" v-show="this.$root.$children[0].mvsLen === 0">购物车没有东西，请到列表挑选</a>
    <mu-card 
      v-for="(item, idx) in $root.$children[0].$children[2].mvs"
      v-if="item.isAdd"
      :key="idx">
      <mu-card-media 
        :title="item.name"  
        :subTitle="'by ' + item.artistName + ' ￥' + filterVal(item.score)">
        <img :src="item.cover" />
      </mu-card-media>
      <mu-card-text>
        {{item.briefDesc}}
      </mu-card-text>
      <mu-card-actions>
        <mu-icon-button>
          <mu-checkbox v-model="item.selected" @change="(e) => {item.selected = e;countPrice()}" uncheckIcon="favorite_border" checkedIcon="favorite"/>
        </mu-icon-button>
        <mu-icon-button icon="remove_circle_outline" @click="changeNum('sub', item)">
        </mu-icon-button>
        <mu-flat-button style="top: -6px;" :label="item.num.toString()">
        </mu-flat-button>
        <mu-icon-button icon="add_circle_outline" @click="changeNum('plus', item)">
        </mu-icon-button>
        <mu-flat-button @click="() => {isDialog = true;deletedItem = item}" label="删除" style="float: right">
        </mu-flat-button>
      </mu-card-actions>
    </mu-card>
  </div>
</template>

<script>
export default {
  name: 'shopcart',
  data () {
    return {
      isDialog: false,
      totalPrice: 0,
      deletedItem: {}
    }
  },
  methods: {
    changeNum (action, item) {
      if (action === 'plus') {
        item.num++
        this.$root.$children[0].mvsLen++
      } else {
        if (item.num === 1) return
        item.num--
        this.$root.$children[0].mvsLen--
      }
      item.selected ? this.countPrice() : localStorage.setItem('mvs', JSON.stringify(this.$root.$children[0].$children[2].mvs))
    },
    countPrice () {
      let isAllPick = true
      let len = 0
      this.totalPrice = 0
      this.$root.$children[0].$children[2].mvs.forEach((item, idx) => {
        if (item.isAdd) len += item.num
        if (item.isAdd && !item.selected) isAllPick = false
        if (item.isAdd && item.selected) {
          this.totalPrice += item.num * item.score
        }
      })
      this.$root.$children[0].totalPrice = '￥' + this.filterVal(this.totalPrice)
      this.$root.$children[0].mvsLen = len
      len === 0 ? this.$root.$children[0].isAllPick = false : this.$root.$children[0].isAllPick = isAllPick
      localStorage.setItem('mvs', JSON.stringify(this.$root.$children[0].$children[2].mvs))
    },
    deleteAllMvs () {
      this.$root.$children[0].$children[2].mvs.forEach((item, idx) => {
        item.isAdd = false
        item.selected = false
        item.num = 0
      })
      this.$root.$children[0].totalPrice = '￥0'
      localStorage.setItem('mvs', JSON.stringify(this.$root.$children[0].$children[2].mvs))
    },
    allPick (isAllPick) {
      this.$root.$children[0].$children[2].mvs.forEach((item, idx) => {
        if (item.isAdd) {
          item.selected = isAllPick
        }
      })
      isAllPick ? this.countPrice() : this.$root.$children[0].totalPrice = '￥0'
    },
    deleteMv () {
      this.deletedItem.isAdd = false
      this.deletedItem.selected = false
      this.deletedItem.num = 0
      this.isDialog = false
      this.countPrice()
    },
    filterVal (data) {
      if (!data || data === '' || data === '0' || data === 0) return 0
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
  activated () {
    this.countPrice()
  },
  created () {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.tip {
  display: block;
  text-align: center;
  margin-top: 30px
}
</style>

<style>
.mu-flat-button {
  min-width: 20px;
}
</style>
