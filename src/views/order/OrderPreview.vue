<template>
  <nav-bar title="订单预览"></nav-bar>
  <main style="padding-bottom: 50px">

    <!-- 地址管理 -->
    <van-contact-card v-if="!Object.keys(address).length" type="add" add-text="添加地址" @click="goTo({name: 'Address'})"/>
    <div v-else class="van-cell van-contact-card flex justify-between items-center bgWhite"
         @click="goTo({name: 'Address'})">
      <div class="flex items-center">
        <div class="mr-10">
          <van-icon name="location-o" class="desc" size="24"/>
        </div>
        <div class="my-auto">
          <div>{{ address.name }} {{ address.phone }}</div>
          <div>{{ address.province }} {{ address.city }} {{ address.county }}
            {{ address.address }}
          </div>
        </div>
      </div>
      <div>
        <van-icon name="arrow" size="18" class="desc"/>
      </div>
    </div>

    <!-- 购物车列表 -->
    <div v-for="item in list" :key="item.id"
         class="flex justify-between items-center bgWhite m-5 p-10">
      <div class="flex items-center">
        <div class="mr-5"><img v-lazy="item.goods.cover_url" width="90" :alt="item.goods.title"></div>
        <div class="my-auto">
          <div class="size-14">{{ item.goods.title }}</div>
          <div class="warm mt-15 bold size-16"><small>￥</small>{{ item.goods.price.toFixed(2) }}</div>
        </div>
      </div>
      <div>
        <div class="desc">x{{ item.num }}</div>
      </div>
    </div>

    <!-- 空状态 -->
    <van-empty v-if="!list.length" description="订单没有商品或已提交">
      <van-button round type="success" @click="goTo({name: 'Category'})">再去逛逛</van-button>
    </van-empty>

    <!-- 提交订单 -->
    <van-submit-bar :price="total * 100" button-text="提交订单" :loading="loading" :disabled="disabled" style="bottom: 50px"
                    @submit="onSubmit"/>

    <!-- 弹层二维码 -->
    <pay-code ref="payCode"></pay-code>
  </main>
</template>

<script>
import NavBar from "components/navbar/NavBar"
import PayCode from "components/PayCode"
import {ref, reactive, toRefs, onMounted, computed} from "vue"
import {useRouter} from "vue-router"
import {useStore} from "vuex"
import {ordersPreview, ordersSubmit} from "network/orders"
import {Toast} from "vant"

export default {
  name: "OrderPreview",
  components: {
    NavBar, PayCode
  },
  setup() {
    const router = useRouter()
    const store = useStore()
    const payCode = ref(null)

    // 数据模型
    const state = reactive({
      address: {}, // 默认地址
      list: [], // 购物车列表
      loading: false, // 按钮加载状态
      disabled: true, // 按钮禁用状态
    })

    // 计算总价
    const total = computed(() => state.list.reduce((prev, next) => prev += parseFloat(next.goods.price) * parseInt(next.num), 0))

    // 页面跳转
    const goTo = params => router.push(params)

    // 提交订单
    const onSubmit = () => {
      // 缺少地址
      if (!state.address.id) {
        return Toast('请添加地址')
      }
      if (!state.list.length) {
        return Toast('订单没有商品或已提交')
      }
      state.loading = true
      state.disabled = true
      ordersSubmit({address_id: state.address.id}).then(res => {
        if (res && res.status === 200) {
          Toast.success('订单提交成功')
          // 清空列表
          state.list = []
          state.loading = false
          // 更新购物车数量
          store.dispatch('updateCartNum')
          // 支付二维码
          payCode.value.payStatus(res.data.id)
        }
      })
    }

    onMounted(() => {
      Toast.loading({message: '加载中...', forbidClick: true})
      // 获取购物车列表和默认地址信息
      ordersPreview().then(res => {
        if (res && res.status === 200) {
          Toast.clear()
          let addresses = res.data.address.filter(item => !!item.is_default)
          state.address = addresses.length ? addresses.shift() : {}
          state.list = res.data.carts
          state.disabled = !state.list.length
          Toast.clear()
        }
      })
    })

    return {
      ...toRefs(state), payCode, total, goTo, onSubmit, close
    }
  }
}
</script>

<style scoped>

</style>