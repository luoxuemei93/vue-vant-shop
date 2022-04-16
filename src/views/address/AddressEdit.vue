<template>
  <nav-bar title="地址编辑"></nav-bar>
  <main>
    <div class="address">
      <van-address-edit
          :area-list="areaList"
          show-delete
          show-set-default
          show-search-result
          :area-columns-placeholder="['请选择', '请选择', '请选择']"
          @save="onSave"
          @delete="onDelete"
          :address-info="addressInfo"
          :is-saving="isSaving"
          :is-deleting="isDeleting"
      />
    </div>
  </main>
</template>

<script>
import NavBar from "components/navbar/NavBar"
import {ref, reactive, toRefs, onMounted} from "vue"
import {useRoute, useRouter} from "vue-router"
import {addressDetail, addressAdd, addressUpdate, addressDelete} from "network/address"
import {areaList} from '@vant/area-data'
import {Toast, Dialog} from "vant"

export default {
  name: "AddressEdit",
  components: {
    NavBar
  },
  setup() {
    const route = useRoute()
    const router = useRouter()

    // 数据模型
    const state = reactive({
      areaList,
      addressInfo: {},
      isSaving: false, // 保存时按钮动画
      isDeleting: false, // 删除时按钮动画
      status: {} // 当前状态
    })

    // 保存地址
    const onSave = el => {
      let addressData = {
        name: el.name,
        address: el.addressDetail,
        phone: el.tel,
        province: el.province,
        city: el.city,
        county: el.county,
        is_default: el.isDefault ? 1 : 0
      }
      if (Object.keys(state.status).length) {
        // 编辑保存
        if (state.status.type === 'edit' && state.status.id) {
          state.isSaving = true
          addressUpdate(el.id, addressData).then(res => {
            if (res && res.status === 204) {
              state.isSaving = false
              Toast.success('编辑成功')
              setTimeout(() => router.back(), 1000)
            }
          })
        }
        // 添加保存
        if (state.status.type === 'add') {
          state.isSaving = true
          addressAdd(addressData).then(res => {
            if (res && res.status === 201) {
              state.isSaving = false
              Toast.success('添加成功')
              setTimeout(() => router.back(), 1000)
            }
          })
        }
      } else {
        Toast('参数错误')
      }
    }

    // 删除地址
    const onDelete = el => {
      if (Object.keys(state.status).length && state.status.type === 'edit' && state.status.id) {
        Dialog.confirm({title: '提示', message: '确定删除吗？'}).then(() => {
          state.isDeleting = true
          addressDelete(el.id).then(res => {
            if (res && res.status) {
              state.isDeleting = false
              Toast.success('删除成功')
              setTimeout(() => router.back(), 1000)
            }
          })
        });
      } else {
        Toast('参数错误')
      }
    }

    // 地区编码
    const areaCode = (areaList, province, city, county) => {
      let _areaCode = ''
      Object.entries(areaList.county_list).forEach(([id, text]) => {
        // 先找出当前对应的区
        if (text === county) {
          // 找到区对应的几个省份
          const provinceIndex = Object.entries(areaList.province_list).findIndex(([provinceId, provinceitem]) => provinceId.substr(0, 2) === id.substr(0, 2))
          // 找到区对应的几个市区
          const cityItems = Object.entries(areaList.city_list).filter(([cityId, cityItem]) => cityId.substr(0, 4) === id.substr(0, 4))[0]
          // 对比找到的省份和接口返回的省份是否相等，因为有一些区会重名
          if (Object.entries(areaList.province_list)[provinceIndex][1] === province && cityItems[1] === city) {
            _areaCode = id
          }
        }
      })
      return _areaCode
    }

    onMounted(() => {
      Toast.loading('加载中...')
      state.status = route.query
      if (Object.keys(state.status).length && state.status.type === 'edit' && state.status.id) {
        addressDetail(state.status.id).then(res => {
          if (res && res.status === 200) {
            Toast.clear()
            state.addressInfo = {
              id: res.data.id,
              name: res.data.name,
              tel: res.data.phone,
              province: res.data.province,
              city: res.data.city,
              county: res.data.county,
              addressDetail: res.data.address,
              areaCode: areaCode(state.areaList, res.data.province, res.data.city, res.data.county),
              postalCode: '',
              isDefault: !!res.data.is_default
            }
          }
        })
      }
    })

    return {
      ...toRefs(state), onSave, onDelete
    }
  }
}
</script>

<style lang="scss">
.address {
  .van-address-edit {
    .van-switch.van-switch--on {
      background: var(--color-tint);
    }
    .van-button:first-of-type {
      background: var(--color-tint);
      border-color: var(--color-tint);
    }
  }
}
</style>