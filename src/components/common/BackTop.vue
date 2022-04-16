<template>
  <van-button class="backtop" @click="backTop" v-show="isShowBackTop" round icon="back-top"></van-button>
</template>

<script>
import {ref, onMounted, onUnmounted} from "vue"

export default {
  name: "BackTop",
  setup() {
    const isShowBackTop = ref(false)
    // 回到顶部
    const backTop = () => {
      let back = setInterval(() => {
        if (document.documentElement.scrollTop || document.body.scrollTop) {
          document.body.scrollTop -= 50;
          document.documentElement.scrollTop -= 50;
        } else {
          clearInterval(back);
        }
      })
    }
    // 滚动监听
    const scrollToTop = () => {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      isShowBackTop.value = scrollTop > 300
    }
    // 挂载完成滚动监听
    onMounted(() => window.addEventListener("scroll", scrollToTop))
    // 页面卸载移除监听
    onUnmounted(() => window.removeEventListener("scroll", scrollToTop))
    return {
      isShowBackTop, backTop
    }
  }
}
</script>

<style scoped lang="scss">
.backtop {
  width: 40px;
  height: 40px;
  position: fixed;
  bottom: 80px;
  right: 20px;
  z-index: 20;
  border: 1px solid #f00;
  border-radius: 50%;
  box-shadow: 5px 5px 5px #888888;
  color: red;
  font-size: 18px;
  font-weight: bold;
  opacity: .7;
}
</style>