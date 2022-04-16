<template>
  <van-popup
      v-model:show="show"
      round
      closeable
      position="bottom"
      :style="{ height: '30%' }"
      @close="close"
  >
    <div class="flex justify-around items-center p-20" v-if="orderNo">
      <div>
        <div class="dark bold text-center">支付宝</div>
        <div class="mt-5">
          <van-image width="120" height="120" :src="alipay" lazy-load/>
        </div>
      </div>
      <div>
        <div class="dark bold text-center">微信</div>
        <div class="mt-5">
          <van-image width="120" height="120" :src="wechat" lazy-load/>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script>
import {reactive, toRefs} from "vue"
import {useRouter} from "vue-router"
import {ordersPay, ordersStatus} from "network/orders"
import {Toast, Dialog} from "vant"

export default {
  name: "Qrcode",
  setup() {
    const router = useRouter()

    // 数据模型
    const state = reactive({
      show: false, // 弹层二维码
      alipay: '', // 支付宝
      wechat: '', // 微信
      orderNo: 0, // 单号
    })

    // 轮询状态
    let timer = null
    const payStatus = orderNo => {
      // 支付二维码
      state.show = true
      state.orderNo = orderNo
      ordersPay(orderNo, {type: 'aliyun'}).then(res => res && (state.alipay = res.data.qr_code_url))
      ordersPay(orderNo, {type: 'wechat'}).then(res => res && (state.wechat = res.data.qr_code_url))
      // 轮询支付状态
      let count = 1
      timer = setInterval(() => {
        count++
        // 30分钟停止轮询
        if (count >= 900) {
          clearInterval(timer)
          state.show = false
          return Dialog.alert({title: '提示', message: '支付超时，重新支付'}).then(() => router.push({
            name: 'OrderDetail',
            query: {id: orderNo}
          }))
        }
        ordersStatus(orderNo).then(res => {
          if (res && res.data === 2) {
            clearInterval(timer)
            state.show = false
            Toast.success('支付成功，等待发货')
            router.push({name: 'OrderDetail', query: {id: orderNo}})
          }
        })
      }, 2000)
    }

    // 关闭弹层
    const close = () => {
      state.show = false
      if (timer) clearInterval(timer)
      router.push({name: 'OrderDetail', query: {id: state.orderNo}})
    }

    return {
      ...toRefs(state), close, payStatus
    }
  }
}
</script>

<style scoped>

</style>