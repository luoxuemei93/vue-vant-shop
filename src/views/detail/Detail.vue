<template>
  <nav-bar title="商品详情"></nav-bar>
  <main>
    <div class="text-center bgWhite"><img v-lazy="detail.cover_url" :alt="detail.title"></div>
    <div>
      <!-- 自定义商品卡片 -->
      <van-card>
        <template #title>
          <h1>{{ detail.title }}</h1>
        </template>
        <template #desc>
          <div class="my-5">{{ detail.description }}</div>
        </template>
        <template #tags>
          <van-tag plain type="danger" class="mr-5">新书</van-tag>
          <van-tag plain type="danger" class="mr-5" v-if="detail.is_recommend">推荐</van-tag>
          <van-tag plain type="danger" class="mr-5" v-if="detail.is_collect">收藏</van-tag>
        </template>
        <template #price>
          <div class="warm my-5 size-16"><small>￥</small>{{ detail.price.toFixed(2) }}</div>
        </template>
        <template #num>
          <div>剩余 {{ detail.stock }} 件</div>
        </template>
        <template #bottom>
          <div class="flex justify-between items-center mb-10">
            <div>我要买</div>
            <div>
              <van-stepper v-model="num" min="1" :max="detail.stock" disable-input/>
            </div>
          </div>
        </template>
        <template #footer>
          <div class="flex justify-end items-center">
            <div class="mr-10 text-center" @click="addCollect(detail.id)">
              <div v-if="isCollect" class="flex flex-column justify-center items-center">
                <van-icon size="18" color="#ed6a0c" name="star"/>
                <span class="mt-5">已收藏</span></div>
              <div v-else class="flex flex-column justify-center items-center">
                <van-icon size="18" name="star-o"/>
                <span class="mt-5">收藏</span></div>
            </div>
            <div>
              <van-button type="warning" :disabled="isCart" @click="addCart(detail.id)">加入购物车</van-button>
              <van-button type="danger" :disabled="isBuy" @click="buy(detail.id)">立即购买</van-button>
            </div>
          </div>
        </template>
      </van-card>
      <!-- tab切换 -->
      <van-tabs class="bgWhite" color="#42b983" sticky offset-top="46">
        <!-- 概述 -->
        <van-tab title="概述">
          <div class="my-5" v-html="detail.details"></div>
        </van-tab>
        <!-- 热评 -->
        <van-tab title="热评" :badge="comments.length">
          <div class="my-5" v-if="comments.length">
            <div class="flex p-15" v-for="item in comments">
              <div class="mr-10">
                <van-image
                    round
                    width="48"
                    height="48"
                    :src="item.user.avatar_url"
                    lazy-load
                />
              </div>
              <div>
                <div class="flex items-center"><h3>{{ item.user.name }}</h3> <small
                    class="ml-5">({{ item.created_at.substr(0, 10) }} 评论)</small></div>
                <!-- 最多显示两行 -->
                <div class="van-multi-ellipsis--l2 desc" v-html="item.content"></div>
              </div>
            </div>
          </div>
          <div class="my-5" v-else>
            <van-empty description="该商品还没有评论！">
              <van-button round type="success" class="bottom-button">发表评论</van-button>
            </van-empty>
          </div>
        </van-tab>
        <!-- 相似商品 -->
        <van-tab title="相似商品">
          <div class="my-5" v-if="like_goods.length">
            <goods-list :list="like_goods"></goods-list>
          </div>
          <div class="my-5" v-else>
            <van-empty description="该商品还没有相似商品！">
              <van-button round type="success" class="bottom-button" @click="goTo()">再去逛逛</van-button>
            </van-empty>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </main>
  <!-- 回到顶部 -->
  <back-top></back-top>
</template>

<script>
import NavBar from "components/navbar/NavBar"
import GoodsList from "components/GoodsList"
import BackTop from "components/common/BackTop"
import {toRefs, reactive, onMounted} from "vue"
import {useRoute, useRouter} from "vue-router"
import {useStore} from "vuex"
import {goodsDetail} from "network/goods"
import {collectsChange} from "network/collects"
import {cartsAdd} from "network/carts"
import {Toast} from "vant"

export default {
  name: "Detail",
  components: {
    NavBar, GoodsList, BackTop
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()

    // 数据模型
    const state = reactive({
      detail: {price: 0}, // 商品详情
      num: 0, // 增减数量
      isCollect: false, // 是否收藏
      isCart: false, // 禁用加入购物车
      isBuy: false, // 禁用购买
      comments: [], // 评论
      like_goods: [], // 相似商品
    })

    // 添加收藏
    const addCollect = id => {
      collectsChange(id).then(res => {
        if (res && res.status === 201) {
          state.isCollect = true
          Toast.success({message: '收藏成功', forbidClick: true})
        }
        if (res && res.status === 204) {
          state.isCollect = false
          Toast.success({message: '已取消收藏', forbidClick: true})
        }
      })
    }

    // 加入购物车
    const addCart = id => {
      state.isCart = true
      cartsAdd({goods_id: id, num: state.num}).then(res => {
        if (res && (res.status === 201 || res.status === 204)) {
          // 更新购物车数量
          store.dispatch('updateCartNum')
          state.isCart = false
          Toast.success({message: '加入购物车成功', forbidClick: true})
        }
      })
    }

    // 立即购买
    const buy = id => {
      state.isBuy = true
      cartsAdd({goods_id: id, num: state.num}).then(res => {
        if (res && (res.status === 201 || res.status === 204)) {
          // 更新购物车数量
          store.dispatch('updateCartNum')
          state.isBuy = false
          router.push({name: 'Cart'})
        }
      })
    }

    // 再去逛逛
    const goTo = () => router.push({name: 'Category'})

    onMounted(() => {
      let id = route.params.id || 0
      Toast.loading('加载中...')
      goodsDetail(id).then(res => {
        if (res && res.status === 200) {
          Toast.clear()
          state.detail = res.data.goods
          state.isCart = !state.detail.stock
          state.isBuy = !state.detail.stock
          // 收藏 评论 相似商品
          state.isCollect = !!res.data.goods.is_collect
          state.comments = res.data.goods.comments
          state.like_goods = res.data.like_goods
        }
      })
    })

    return {
      ...toRefs(state), addCollect, addCart, buy, goTo
    }
  }
}
</script>

<style scoped>

</style>