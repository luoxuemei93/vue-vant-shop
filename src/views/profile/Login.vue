<template>
  <nav-bar title="用户登录"></nav-bar>
  <main>
    <div class="mx-auto text-center">
      <img src="~assets/logo.png" width="100" alt="Logo">
    </div>
    <van-form @submit="onSubmit">
      <van-field
          v-model="userName"
          type="userName"
          name="userName"
          label="账号"
          placeholder="账号"
          :rules="[{ required: true, message: '请填写账号' }]"
      />
      <van-field
          v-model="password"
          type="password"
          name="password"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
      />
      <div class="m-15 dark" @click="toRegister">没有账号，立即注册</div>
      <div class="m-15">
        <van-button round block type="success" native-type="submit">登录</van-button>
      </div>
    </van-form>
  </main>
</template>

<script>
import NavBar from "components/navbar/NavBar"
import {reactive, toRefs} from "vue"
import {useRouter} from "vue-router"
import {useStore} from "vuex"
import {Toast} from "vant"
import {authLogin} from "network/auth"

export default {
  name: "Login",
  components: {
    NavBar
  },
  setup() {
    const router = useRouter()
    const store = useStore()

    // 数据模型
    const state = reactive({
      // email: 'test@a.com',
      // password: '123123'
      userName: "admin",
      password: "123456",
    })

    // 注册跳转
    const toRegister = () => router.push({name: 'Register'})

    // 提交登录
    const onSubmit = values => {
      authLogin(values).then(resBody=> {
        const res = resBody.data;
        if (res.status == 0) {
          Toast.success('登录成功')
          window.localStorage.setItem('token', res.token)
          window.localStorage.setItem('userName', res.userName)

          // 更新登录状态和购物车数量
          store.dispatch('updateIsLogin', true)
          store.dispatch('updateCartNum')
          state.userName = ''
          state.password = ''
          router.back()
        }
      })
    }
    return {
      ...toRefs(state), toRegister, onSubmit
    }
  }
}
</script>

<style scoped>

</style>