<template>
  <nav-bar title="订单详情"></nav-bar>
  <main class="p-10">
    <div class="pt-5">
      <div><span class="desc">订单状态：</span>{{ status }}</div>
      <div class="my-5"><span class="desc">订单编号：</span>{{ detail.order_no }}</div>
      <div><span class="desc">下单时间：</span>{{ detail.created_at }}</div>
      <!-- 支付 -->
      <div class="mt-10 mb-20 pb-20" v-if="detail.status === 1">
        <van-button round block type="warning" @click="onPay">去支付</van-button>
      </div>
      <!-- 确认收货 -->
      <div class="mt-10 mb-20 pb-20" v-if="detail.status === 3">
        <van-button round block type="primary" @click="onReceipt">确认收货</van-button>
      </div>
    </div>
    <div class="mt-10 p-10 bgWhite">
      <div><span class="desc">配送金额：</span><small>￥</small>{{ detail.amount.toFixed(2) }}</div>
      <div class="my-5"><span class="desc">配送方式：</span>普通快递</div>
      <div class="mt-10" v-for="item in detail.orderDetails.data" :key="item.id" @click="goTo(item.goods.id)">
        <van-card
            :num="item.num"
            :price="item.price.toFixed(2)"
            :desc="item.goods.description"
            :title="item.goods.title"
            :thumb="item.goods.cover_url"
            lazy-load
        />
      </div>
    </div>

    <!-- 支付二维码 -->
    <pay-code ref="payCode"></pay-code>
  </main>
</template>

<script>
import NavBar from "components/navbar/NavBar"
import PayCode from "components/PayCode"
import {ref, reactive, toRefs, onMounted, computed} from "vue"
import {useRoute, useRouter} from "vue-router"
import {ordersDetail} from "network/orders"
import {Toast, Dialog} from "vant"
import {ordersConfirm} from "network/orders"

export default {
  name: "OrderDetail",
  components: {
    NavBar, PayCode
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const payCode = ref(null)

    // 数据模型
    const state = reactive({
      orderNo: 0,
      detail: {
        amount: 0,
        orderDetails: {}
      }
    })

    // 支付二维码
    const onPay = () => payCode.value.payStatus(state.orderNo)

    // 支付状态
    const status = computed(() => ['', '待付款', '已支付', '发货', '交易完成', '过期'][state.detail.status])

    // 确认收货
    const onReceipt = () => {
      Dialog.confirm({title: '提示', message: '确认收货吗？'}).then(() => {
        ordersConfirm(state.orderNo).then(res => {
          if (res.status === 204) {
            Toast.success('确认收货成功')
            state.detail.status = 4
          }
        })
      })
    }

    // 跳转详情
    const goTo = id => router.push({name: 'Detail', params: {id}})

    onMounted(() => {
      const id = route.query.id || 0
      Toast.loading({message: '加载中...', forbidClick: true})
      ordersDetail(id, {include: 'orderDetails.goods'}).then(res => {
        if (res && res.status === 200) {
          state.detail = res.data
          state.orderNo = id
          Toast.clear()
        }
      })
    })

    return {
      ...toRefs(state), payCode, onPay, status, onReceipt, goTo
    }
  }
}
</script>

<style scoped>

</style>