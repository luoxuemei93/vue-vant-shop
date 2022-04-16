<template>
  <div class="flex justify-between flex-wrap p-5 bgWhite">
    <div class="w50 mb-10" v-for="(item, index) in list" :key="index" @click="goTo(item.id)">
      <div class="text-center"><img v-lazy="item.cover_url" alt="item.titlle"></div>
      <div class="text-center size-12">{{ item.title }}</div>
      <div class="flex justify-center items-center mt-5">
        <div class="dark mr-10 size-12"><small>￥</small>{{ item.price.toFixed(2) }}</div>
        <div class="size-12">
          <van-icon name="star-o"/>
          {{ item.collects_count }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {useRouter} from "vue-router"

export default {
  name: "GoodsList",
  props: {
    list: Array,
    default() {
      return []
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

<style scoped>

</style>