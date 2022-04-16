<template>
  <nav-bar title="关于我们"></nav-bar>
  <main class="p-5">
    <div class="text-center p-10 bgWhite">
      <h2 class="size-24 my-10">This is an about page</h2>
      <img alt="Vue logo" src="~assets/logo.png">
      <van-divider>什么是前端</van-divider>
      <p class="my-10">创建Web页面或APP、小程序等前端页面呈现给用户的过程。</p>
      <van-divider>核心技术</van-divider>
      <p class="my-10">HTML、CSS、JavaScript以及衍生出的各种框架技术等。</p>
      <HelloWorld msg="Welcome to Your Vue.js App"/>
    </div>
  </main>
  <back-top></back-top>
</template>

<script>
import NavBar from "components/navbar/NavBar"
import BackTop from "components/common/BackTop"
import HelloWorld from "components/HelloWorld"

export default {
  name: 'About',
  components: {
    NavBar, BackTop, HelloWorld
  }
}
</script>

<style scoped>

</style>
