<template>
  <div class="shopcart">
    <mu-dialog :open="isDialog" title="警告" @close="isDialog = false">
      确定要删除该物品？
      <mu-flat-button slot="actions" @click="isDialog = false" primary label="取消"/>
      <mu-flat-button slot="actions" primary @click="deleteMv()" label="确定"/>
    </mu-dialog>
    <mu-card 
      v-for="(item, idx) in $store.state.mvs.products"
      v-if="item.isAdd"
      :key="idx">
      <mu-card-media 
        :title="item.name"  
        :subTitle="'by ' + item.artistName + ' ￥' + $plugins.filtersPrice(item.score)">
        <img :src="item.cover" />
      </mu-card-media>
      <mu-card-text>
        {{item.briefDesc}}
      </mu-card-text>
      <mu-card-actions>
        <mu-icon-button>
          <mu-checkbox 
            v-model="item.selected"
            @change="(e) => {selected(e, item)}" 
            uncheckIcon="favorite_border" 
            checkedIcon="favorite"/>
        </mu-icon-button>
        <mu-icon-button icon="remove_circle_outline" @click="changeNum(idx, 'sub')">
        </mu-icon-button>
        <mu-flat-button style="top: -6px;" :label="item.num.toString()">
        </mu-flat-button>
        <mu-icon-button icon="add_circle_outline" @click="changeNum(idx, 'plus')">
        </mu-icon-button>
        <mu-flat-button @click="() => {
          isDialog = true;
          deletedItemIdx = idx
        }" label="删除" style="float: right">
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
      isDialog: false, // 提示框
      deletedItemIdx: 0 // 暂存需要被删除的数组下标
    }
  },
  methods: {
    changeNum (idx, action) {
      this.$store.commit('CHANGE_SHOPCART_NUM', {
        idx,
        action
      })
    },
    deleteAllMvs () {
      this.$store.commit('DELETE_ALL_MVS')
    },
    deleteMv () {
      this.isDialog = false
      this.$store.commit('DELETE_MV', this.deletedItemIdx)
    },
    selected (e, item) {
      item.selected = e
      item.selected ? this.$store.state.mvs.totalPrice += item.num * item.score : this.$store.state.mvs.totalPrice -= item.num * item.score
    }
  },
  activated () {

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
