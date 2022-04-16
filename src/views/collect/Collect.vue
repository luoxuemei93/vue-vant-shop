<template>
  <nav-bar :title="title"></nav-bar>
  <main class="p-5">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
            v-model:loading="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
        >
          <div class="mb-5" v-for="item in list" :key="item.id">
            <van-card
                :desc="item.goods.description"
                :title="item.goods.title"
                :thumb="item.goods.cover_url"
                @click="goTo({name: 'Detail', params: {id: item.goods.id}})"
            >
              <template #price-top>
                <div class="warm size-16"><small>￥</small>{{item.goods.price.toFixed(2)}}</div>
              </template>
              <template #price>
                <div><span class="desc">收藏日期：</span>{{item.created_at.substr(0, 10)}}</div>
              </template>
              <template #num>
                <van-button size="mini" @click.self.stop="onCollect(item.goods.id)">取消收藏</van-button>
              </template>
            </van-card>
          </div>
        </van-list>
      </van-pull-refresh>
  </main>
  <!-- 回到顶部 -->
  <back-top></back-top>
</template>

<script>
import NavBar from "components/navbar/NavBar"
import BackTop from "components/common/BackTop"
import {reactive, toRefs} from "vue"
import {useRouter} from "vue-router"
import {collectsList, collectsChange} from "network/collects"
import {Toast, Dialog} from "vant"

export default {
  name: "Collect",
  components: {
    NavBar, BackTop
  },
  setup() {
    const router = useRouter()

    // 数据模型
    const state = reactive({
      list: [],
      page: 1,
      title: '我的收藏',
      loading: false,
      finished: false,
      refreshing: false,
    })

    // 数据方法
    const init = () => {
      collectsList({page: state.page}).then(res => {
        if (res && res.status === 200) {
          state.list.push(...res.data.data)
          state.page++
          state.loading = false
          state.title = `我的收藏(${res.data.meta.pagination.total})`
          if (state.page > res.data.meta.pagination.total_pages) {
            state.finished = true
          }
        }
      })
    }

    // 上拉加载
    const onLoad = () => {
      setTimeout(() => {
        if (state.refreshing) {
          state.list = []
          state.page = 1
          state.refreshing = false
        }
        init()
      }, 1000)
    }

    // 下拉刷新
    const onRefresh = () => {
      state.finished = false
      state.loading = true
      onLoad()
    }

    // 取消收藏
    const onCollect = id => {
      Dialog.confirm({title: '提示', message: '确定取消收藏吗？'}).then(() => {
        collectsChange(id).then(res => {
          if (res.status === 204) {
            Toast.success('取消收藏成功')
            state.finished = false
            state.list = []
            state.page = 1
            state.loading = true
            init()
          }
        })
      })
    }

    // 页面跳转
    const goTo = params => router.push(params)

    return {
      ...toRefs(state), onLoad, onRefresh, onCollect, goTo
    }
  }
}
</script>

<style scoped>

</style>