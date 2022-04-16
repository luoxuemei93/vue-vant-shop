<template>
  <van-tabbar class="tabbar" active-color="#42b983" route>
    <van-tabbar-item replace to="/category" icon="apps-o">分类</van-tabbar-item>
    <van-tabbar-item replace to="/cart" icon="shopping-cart-o" :badge="cartNum">购物车</van-tabbar-item>
    <van-tabbar-item replace to="/profile" icon="user-o">我的</van-tabbar-item>
  </van-tabbar>
</template>

<script>
export default {
  name: "TabBar",
  props: {
    cartNum: {
      type: Number,
      default() {
        return 0
      }
    }
  }
}
</script>

<style scoped>

</style>