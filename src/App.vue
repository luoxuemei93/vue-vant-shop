<template>
  <router-view :key="fullPath"/>
  <tab-bar :cartNum="cartNum"></tab-bar>
  <!--  <div id="nav">-->
  <!--    <router-link to="/">Home</router-link> |-->
  <!--    <router-link to="/about">About</router-link>-->
  <!--  </div>-->
</template>

<script>
import TabBar from "components/tabbar/TabBar"
import {useRoute} from "vue-router"
import {useStore} from "vuex"
import {computed, onMounted} from "vue";

export default {
  name: 'App',
  components: {
    TabBar
  },
  setup() {
    const route = useRoute()
    const store = useStore()
    const fullPath = computed(() => route.fullPath)
    const cartNum = computed(() => store.getters.cartNum)
    // 更新购物车数量
    onMounted(() => store.getters.isLogin && store.dispatch('updateCartNum'))
    return {
      cartNum, fullPath
    }
  }
}
</script>

<style lang="scss">
//导入样式
@import "~assets/base.css";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  //text-align: center;
  color: #2c3e50;

  main {
    position: relative;
    margin-top: 46px;
    margin-bottom: 50px;
  }
}

//#nav {
//  padding: 30px;
//
//  a {
//    font-weight: bold;
//    color: #2c3e50;
//
//    &.router-link-exact-active {
//      color: #42b983;
//    }
//  }
//}
</style>
