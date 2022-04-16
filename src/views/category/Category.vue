<template>
  <nav-bar title="商品分类"></nav-bar>
  <main>
    <!-- 侧边导航 -->
    <van-sidebar class="side" v-model="activeKey">
      <van-collapse v-model="activeName" accordion>
        <div class="mx-15 van-hairline--top-bottom"><van-sidebar-item title="全部分类" @click="onCat(0)" /></div>
        <van-collapse-item v-for="item in categories" :key="item.id" :title="item.name" :name="item.id">
          <van-sidebar-item v-for="sub in item.children" :key="sub.id" :title="sub.name" @click="onCat(sub.id)"/>
        </van-collapse-item>
      </van-collapse>
    </van-sidebar>

    <!-- 右侧 tabs 选项 -->
    <div class="tab">
      <van-tabs @click-tab="onTab" color="#42b983" >
        <van-tab title="销量排序" name="sales"></van-tab>
        <van-tab title="价格排序" name="price"></van-tab>
        <van-tab title="评论排序" name="comments_count"></van-tab>
      </van-tabs>
    </div>

    <!-- 列表商品 -->
    <div class="list">
      <!-- 下拉刷新，上拉加载 -->
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
            v-model:loading="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
        >
          <!-- 商品卡片 -->
          <van-card
              v-for="(item, index) in list" :key="index"
              :num="item.sales"
              tag="流行"
              :price="item.price.toFixed(2)"
              :desc="item.updated_at.substr(0, 10)"
              :title="item.title"
              :thumb="item.cover_url"
              lazy-load
              @click="goTo(item.id)"
          />
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
import {ref, reactive, toRefs, onMounted} from "vue"
import {useRoute, useRouter} from "vue-router"
import {goodsList} from "network/goods"
import {Toast} from "vant"

export default {
  name: "Category",
  components: {
    NavBar, BackTop
  },
  setup() {
    const route = useRoute()
    const router = useRouter()

    // 数据模型
    const state = reactive({
      // 左侧 折叠 分类
      activeName: 1,
      activeKey: 0,
      // 分类
      categories: [],
      // tab切换
      sales: {page: 1, list: []},
      price: {page: 1, list: []},
      comments_count: {page: 1, list: []},
      // 下拉刷新 上拉加载
      loading: false,
      finished: false,
      refreshing: false,
      list: []
    })

    // 左侧分类
    const cat = ref(0)
    const onCat = id => {
      cat.value = id
      let orders = ['sales', 'price', 'comments_count']
      orders.forEach(item => {
        state[item].page = 1
        state[item].list = []
      })
      state.loading = true
      state.finished = false
      state.refreshing = false
      init()
    }

    // tab切换 排序
    const tab = ref('sales')
    const onTab = el => {
      tab.value = el.name
      state.loading = true
      state.finished = false
      state.refreshing = false
      init()
    }

    // 数据方法
    const init = () => {
      let params = {}
      // 分页
      params['page'] = state[tab.value].page
      // 搜索
      if (search.value) params['title'] = search.value
      // 左侧分类
      if (cat.value) params['category_id'] = cat.value
      // tab切换排序
      params[tab.value] = 1
      goodsList(params).then(res => {
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
    const onLoad = () => setTimeout(() => {
      if (state.refreshing) {
        state.refreshing = false
        state[tab.value].list = []
        state[tab.value].page = 1
      }
      init()
    }, 1000)

    // 下拉刷新
    const onRefresh = () => {
      state.finished = false
      state.loading = true
      onLoad()
    }

    // 商品搜索
    const search = ref('')

    // 跳转详情页
    const goTo = id => router.push({name: 'Detail', params: {id}})

    onMounted(() => {
      // 左侧分类
      Toast.loading('加载中...')
      goodsList().then(res => res && res.status === 200 && (state.categories = res.data.categories) && Toast.clear())
      if (route.query.s) search.value = route.query.s
    })

    return {
      ...toRefs(state), onTab, onCat, onLoad, onRefresh, goTo
    }
  }
}
</script>

<style scoped lang="scss">
main {
  //侧栏
  .side {
    position: fixed;
    top: 46px;
    bottom: 50px;
    padding-top: 44px;
    width: 130px;
    background: white;
  }

  //顶部 tab
  .tab {
    position: fixed;
    top: 46px;
    left: 130px;
    right: 0;
    z-index: 1;
  }

  //列表商品
  .list {
    background: white;
    margin: 90px 0 0 130px;
    padding: 10px 10px 10px 0;
  }
}
</style>