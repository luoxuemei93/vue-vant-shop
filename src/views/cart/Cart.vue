<template>
  <nav-bar :title="title"></nav-bar>
  <main style="padding-bottom: 50px">
    <!--购物车列表-->
    <van-checkbox-group v-if="list.length" class="px-5 py-5" v-model="checkedIds" @change="changeGroup">
      <van-swipe-cell v-for="item in list" :key="item.id" class="bgWhite mb-5">
        <div class="flex justify-between my-5 mr-10 size-14">
          <div class="flex items-center">
            <div class="pl-10">
              <van-checkbox :name="item.id"></van-checkbox>
            </div>
            <div><img v-lazy="item.goods.cover_url" :alt="item.goods.title" width="90"></div>
            <div>
              <div>{{ item.goods.title }}</div>
              <div class="warm mt-10 bold size-16"><small>￥</small>{{ item.goods.price.toFixed(2) }}</div>
            </div>
          </div>
          <div class="text-right my-auto">
            <div class="mb-10 desc">x{{ item.goods.stock }}</div>
            <div>
              <van-stepper v-model="item.num" :name="item.id" min="1" :max="item.goods.stock" disable-input
                           @change="changeNum"/>
            </div>
          </div>
        </div>
        <template #right>
          <van-button square type="danger" style="height: 100%" text="删除" @click="deleteCart(item.id)"/>
        </template>
      </van-swipe-cell>
    </van-checkbox-group>
    <!-- 空状态 -->
    <van-empty v-else description="购物车还没有商品">
      <van-button round type="success" @click="goTo">前去选购</van-button>
    </van-empty>
    <!-- 订单结算 -->
    <van-submit-bar :price="price * 100" :disabled="!list.length" button-text="结算" style="bottom: 50px"
                    @submit="onSubmit">
      <van-checkbox v-model="isCheckedAll" @click="checkAll">全选</van-checkbox>
    </van-submit-bar>
  </main>
</template>

<script>
import NavBar from "components/navbar/NavBar"
import {reactive, toRefs, onMounted, computed} from "vue"
import {useRouter} from "vue-router"
import {useStore} from "vuex"
import {cartsList, cartsChecked, cartsNum, cartsDelete} from "network/carts"
import {Dialog, Toast} from "vant"

export default {
  name: "Carts",
  components: {
    NavBar
  },
  setup() {
    const router = useRouter()
    const store = useStore()

    // 数据模型
    const state = reactive({
      isCheckedAll: true, // 全选
      checkedIds: [], // 复选框组勾选状态
      list: [], // 购物车列表
    })

    // 选购跳转
    const goTo = () => router.push('/')

    // 页面标题
    const title = computed(() => `购物车(${state.list.length})`)

    // 计算总价
    const price = computed(() => state.list.filter(item => state.checkedIds.includes(item.id)).reduce((prev, next) => prev += parseFloat(next.goods.price) * parseInt(next.num), 0))

    // 复选状态
    const changeGroup = () => cartsChecked({cart_ids: state.checkedIds}).then(res => res && res.status === 204 && (state.isCheckedAll = state.list.length === state.checkedIds.length))

    // 增减数量
    const changeNum = (num, el) => {
      Toast.loading({message: '修改中...', forbidClick: true})
      cartsNum(el.name, {num}).then(res => res && res.status === 204 && Toast.clear())
    }

    // 移除购物车
    const deleteCart = id => {
      Dialog.confirm({title: '提示', message: '确定删除吗？'}).then(() => {
        cartsDelete(id).then(res => {
          if (res && res.status === 204) {
            state.list.splice(state.list.findIndex(item => item.id === id), 1)
            state.checkedIds.splice(state.checkedIds.findIndex(item => item === id), 1)
            // 更新购物车数量
            store.dispatch('updateCartNum')
          }
        })
      })
    }

    // 全选反选
    const checkAll = () => state.checkedIds = state.isCheckedAll ? state.list.map(el => el.id) : []

    // 商品结算
    const onSubmit = () => {
      if (!state.checkedIds.length) {
        return Toast('请选择商品')
      }
      // 订单预览
      router.push({name: 'OrderPreview'})
    }

    onMounted(() => {
      Toast.loading({message: '加载中...', forbidClick: true})
      cartsList({include: 'goods'}).then(res => {
        if (res && res.status === 200) {
          Toast.clear()
          state.list = res.data.data
          // 复选框组选中状态
          state.checkedIds = res.data.data.filter(item => !!item.is_checked).map(item => item.id)
          // 全选状态
          state.isCheckedAll = state.list.length === state.checkedIds.length
        }
      })
    })

    return {
      title, ...toRefs(state), price, goTo, changeGroup, changeNum, deleteCart, checkAll, onSubmit
    }
  }
}
</script>

<style scoped>

</style>