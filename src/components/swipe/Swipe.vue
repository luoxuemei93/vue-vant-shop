<template>
  <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
    <van-swipe-item v-for="(item, index) in list" :key="index">
      <img v-lazy="item.img_url" :alt="item.title" class="cursor" @click="goTo(item.id)" />
    </van-swipe-item>
  </van-swipe>
</template>

<script>
import {useRouter} from "vue-router"

export default {
  name: "Swipe",
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  setup() {
    const router = useRouter()
    const goTo = id => router.push({name: 'Detail', params: {id}})
    return {
      goTo
    }
  }
}
</script>

<style scoped lang="scss">
.my-swipe .van-swipe-item {
  color: #fff;
  font-size: 20px;
  line-height: 150px;
  max-height: 150px;
  text-align: center;
  background-color: var(--color-tint);
}
</style>