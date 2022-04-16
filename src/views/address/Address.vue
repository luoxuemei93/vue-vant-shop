<template>
  <nav-bar title="地址管理"></nav-bar>
  <main>
    <div class="address">
      <van-empty v-if="!list.length" description="还没有地址，去添加吧..." />
      <van-address-list
          v-model="chosenAddressId"
          :list="list"
          default-tag-text="默认"
          @add="onAdd"
          @edit="onEdit"
          @select="onSelect"
      />
    </div>
  </main>
</template>

<script>
import NavBar from "components/navbar/NavBar"
import {reactive, toRefs, onMounted} from "vue"
import {useRouter} from "vue-router"
import {addressList, addressDefault} from "network/address"
import {Toast} from "vant"

export default {
  name: "Address",
  components: {
    NavBar
  },
  setup() {
    const router = useRouter()

    // 数据模型
    const state = reactive({
      chosenAddressId: 0,
      list: [],
    })

    // 数据方法
    const init = () => {
      Toast.loading('加载中...')
      addressList().then(res => {
        if (res && res.status === 200) {
          Toast.clear()
          state.list = res.data.data.map(item => {
            item.tel = item.phone
            item.isDefault = !!item.is_default
            item.address = `${item.province} ${item.city} ${item.county} ${item.address}`
            return item
          })
          // 默认地址
          let chosenAddress = state.list.filter(item => item.isDefault)
          state.chosenAddressId = chosenAddress.length ? chosenAddress.shift().id : 0
        }
      })
    }

    // 添加地址
    const onAdd = () => router.push({name: 'AddressEdit', query: {type: 'add'}})

    // 修改地址
    const onEdit = (item, index) => router.push({name: 'AddressEdit', query: {type: 'edit', id: item.id}})

    // 选中切换
    const onSelect = (item, index) => {
      // 非迟延
      state.list.forEach(el => el.isDefault = el.id === item.id)
      addressDefault(item.id).then(res => {
        if (!res || res.status !== 204) {
          // 默认切换失败，刷新数据
          init()
        }
      })
    }

    onMounted(() => init())

    return {
      ...toRefs(state), onAdd, onEdit, onSelect
    }
  }
}
</script>

<style lang="scss">
.address {
  .van-address-list__bottom {
    bottom: 50px;
    button.van-button:first-of-type {
      background: var(--color-tint);
      border-color: var(--color-tint);
    }
  }
}
</style>