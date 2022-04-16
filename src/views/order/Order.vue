<template>
  <nav-bar title="我的订单"></nav-bar>
  <main>
    <!-- tab固定 -->
    <div class="tab">
      <van-tabs v-model="activeName" animated swipeable @click-tab="onClick" color="#42b983">
        <van-tab title="全部" name="0"></van-tab>
        <van-tab title="待付款" name="1"></van-tab>
        <van-tab title="已支付" name="2"></van-tab>
        <van-tab title="发货" name="3"></van-tab>
        <van-tab title="交易完成" name="4"></van-tab>
        <van-tab title="过期" name="5"></van-tab>
      </van-tabs>
    </div>

    <!-- 搜索订单 -->
    <div class="search">
      <van-search v-model="value" placeholder="搜索订单" show-action @search="onSearch" @cancel="onCancel"/>
    </div>

    <!-- 订单列表 -->
    <div class="list">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
            v-model:loading="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
        >
          <div class="m-5 p-10 bgWhite" v-for="item in list" :key="item.id" @click="goTo(item.id)">
            <div><span class="desc">订单号：</span>{{ item.order_no }}</div>
            <div><span class="desc">创建时间：</span>{{ item.created_at }}</div>
            <div class="mt-5" v-for="sub in item.orderDetails.data" :key="sub.id">
              <van-card
                  :num="sub.num"
                  :price="sub.price.toFixed(2)"
                  :desc="sub.goods.description"
                  :title="sub.goods.title"
                  :thumb="sub.goods.cover_url"
                  lazy-load
              />
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </main>
  <!-- 回到顶部 -->
  <back-top></back-top>
</template>

<script>
import NavBar from "components/navbar/NavBar"
import BackTop from "components/common/BackTop"
import {ref, reactive, toRefs} from "vue"
import {useRouter} from "vue-router"
import {ordersList} from "network/orders"

export default {
  name: "Orders",
  components: {
    NavBar, BackTop
  },
  setup() {
    const router = useRouter()

    // 数据模型
    const status = ref(0)
    const state = reactive({
      // tab
      activeName: 0,
      // 订单搜索
      search: '',
      value: '',
      // 下拉刷新，上拉加载
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      // 订单模型
      order: [
        {page: 1, list: []},
        {page: 1, list: []},
        {page: 1, list: []},
        {page: 1, list: []},
        {page: 1, list: []},
        {page: 1, list: []}
      ]
    })

    // 订单详情
    const goTo = id => router.push({name: 'OrderDetail', query: {id}})

    // 订单搜索
    const onSearch = val => {
      if (val) {
        state.search = val.trim()
        state.order[status.value].list = []
        state.order[status.value].page = 1
        state.loading = true
        state.finished = false
        state.refreshing = false
        init()
      }
    }

    // 取消搜索
    const onCancel = () => {
      state.search = ''
      state.order[status.value].list = []
      state.order[status.value].page = 1
      state.loading = true
      state.finished = false
      state.refreshing = false
      init()
    }

    // Tab切换
    const onClick = el => {
      status.value = el.name
      state.loading = true
      state.finished = false
      state.refreshing = false
      init()
    }

    // 数据方法
    const init = () => {
      // 请求参数
      let params = {
        page: state.order[status.value].page,
        status: status.value,
        include: 'orderDetails.goods',
      }
      // 搜索订单
      if (state.search) {
        params.title = state.search
      }
      ordersList(params).then(res => {
        if (res && res.status === 200) {
          state.order[status.value].list.push(...res.data.data)
          state.order[status.value].page++
          state.loading = false
          if (state.order[status.value].page > res.data.meta.pagination.total_pages) {
            state.finished = true
          }
        }
      })
      state.list = state.order[status.value].list
    }

    // 下拉刷新
    const onRefresh = () => {
      state.finished = false
      state.loading = true
      onLoad()
    }

    // 上拉加载
    const onLoad = () => setTimeout(() => {
      if (state.refreshing) {
        state.refreshing = false
        state.order[status.value].list = []
        state.order[status.value].page = 1
      }
      init()
    }, 1000);

    return {
      ...toRefs(state), goTo, onSearch, onCancel, onClick, onRefresh, onLoad
    }
  }
}
</script>

<style scoped lang="scss">
main {
  //tab固定
  .tab {
    position: fixed;
    top: 46px;
    left: 0;
    right: 0;
    z-index: 1;
  }

  //搜索
  .search {
    margin-top: 95px;
    padding: 0 5px;
  }

  //列表加载
  .list {
    //margin-top: 90px;
  }
}
</style>