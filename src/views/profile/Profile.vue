<template>
  <nav-bar title="个人中心"></nav-bar>
  <main class="pt-5">
    <!-- 个人信息 -->
    <div class="flex items-center m-15 p-10 bgDark border-radius-10">
      <div class="mr-10">
        <!-- <van-image round src="~assets/logo.png" width="64" alt="64" /> -->
        <van-image round width="64" height="64" lazy-load :src="logo" />
      </div>
      <div class="white size-12 my-auto">
        <div class="my-5">登录名：{{ user.email }}</div>
      </div>
    </div>

    <!-- 页面菜单 -->
    <div class="mt-20">
      <van-cell-group inset>
        <van-cell title="我的订单" is-link to="/order" />
      </van-cell-group>
    </div>

    <!-- 退出登录 -->
    <div class="m-20">
      <van-button type="success" block round @click="logout"
        >退出登录</van-button
      >
    </div>
  </main>
</template>

<script>
import NavBar from "components/navbar/NavBar";
import { reactive, toRefs, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { authLogout } from "network/auth";
import { Toast } from "vant";

export default {
  name: "Profile",
  components: {
    NavBar,
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    // 数据模型
    const state = reactive({
      userName: "",
      user: {
        avatar_url: "",
      },
    });

    // 退出登录
    const logout = () => {
        Toast.success("退出成功");
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("userName");
        store.dispatch("updateIsLogin", false);
        router.push({ name: "Login" });
      };

    onMounted(() => {
      Toast.loading("加载中...");
      state.user = window.localStorage.getItem("userName");
      Toast.clear();
    });
    return {
      ...toRefs(state),
      logout,
    };
  },
};
</script>

<style scoped></style>
