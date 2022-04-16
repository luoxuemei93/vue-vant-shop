<template>
  <nav-bar title="Vue商城"></nav-bar>
  <main>
    <!-- 轮播图 -->
    <swipe :list="slides"></swipe>

    <!-- 热门推荐 -->
    <div class="flex justify-around items-center px-5 py-10 bgWhite">
      <div v-for="(item, index) in recommends.slice(0, 4)" :key="index" @click="goTo(item.id)">
        <div><img v-lazy="item.cover_url" :alt="item.title"></div>
        <div class="text-center size-14">{{ item.title }}</div>
      </div>
    </div>

    <!-- tabs 畅销 - 新书 -精选 -->
    <div class="h-5"></div>
    <van-tabs @click-tab="onClick" color="#42b983" sticky offset-top="46">
      <van-tab title="畅销" name="sales"></van-tab>
      <van-tab title="新书" name="new"></van-tab>
      <van-tab title="精选" name="recommend"></van-tab>
      <!-- tab 列表上拉加载 -->
      <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
      >
        <goods-list :list="list"></goods-list>
      </van-list>
    </van-tabs>
  </main>
  <!-- 回到顶部 -->
  <back-top></back-top>
</template>

<script>
import NavBar from "components/navbar/NavBar"
import Swipe from "components/swipe/Swipe"
import GoodsList from "components/GoodsList"
import BackTop from "components/common/BackTop"
import {ref, reactive, toRefs, onMounted} from "vue"
import {useRouter} from "vue-router"
import {homeData} from "network/home"
import {Toast} from "vant"

export default {
  name: 'Home',
  components: {
    NavBar, Swipe, GoodsList, BackTop
  },
  setup() {
    const router = useRouter()

    // 数据模型
    const state = reactive({
      // 轮播图 热门推荐
      slides: [],
      recommends: [],
      // tab切换 畅销 新书 精选
      sales: {page: 1, list: []},
      recommend: {page: 1, list: []},
      new: {page: 1, list: []},
      // 上拉加载
      loading: false,
      finished: false,
      list: []
    })

    // tab切换
    const tab = ref('sales')
    const onClick = el => {
      tab.value = el.name
      state.finished = false
      state.loading = true
      init()
    }

    // 数据方法
    const init = () => {
      let params = {}
      params[tab.value] = 1
      params['page'] = state[tab.value].page
      homeData(params).then(res => {
        if (res && res.status === 200) {
          state[tab.value].list.push(...res.data.goods.data)
          state[tab.value].page++
          state.loading = false
          if (!res.data.goods.next_page_url) {
            state.finished = true
          }
        }
      })
      state.list = state[tab.value].list
    }

    // 上拉加载
    const onLoad = () => setTimeout(() => init(), 1000)

    // 跳转详情页
    const goTo = id => router.push({name: 'Detail', params: {id}})

    onMounted(() => {
      // 轮播和热门
      Toast.loading('加载中...')
      homeData().then(res => {
        if (res && res.status === 200) {
          Toast.clear()
          state.slides = res.data.slides
          state.recommends = res.data.goods.data
        }
      })
    })

    return {
      ...toRefs(state), goTo, onLoad, onClick
    }
  }
}
</script>
