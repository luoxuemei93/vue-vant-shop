<template>
  <nav-bar title="用户注册"></nav-bar>
  <main>
    <div class="mx-auto text-center">
      <img src="~assets/logo.png" width="100" alt="Logo">
    </div>
    <van-form @submit="onSubmit">
      <van-field
          v-model="name"
          name="name"
          label="昵称"
          placeholder="昵称"
          :rules="[{ required: true, message: '请填写昵称' }]"
      />
      <van-field
          v-model="email"
          type="email"
          name="email"
          label="邮箱"
          placeholder="邮箱"
          :rules="[{ required: true, message: '请填写邮箱' }]"
      />
      <van-field
          v-model="password"
          type="password"
          name="password"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
      />
      <van-field
          v-model="password_confirmation"
          type="password"
          name="password_confirmation"
          label="确认密码"
          placeholder="确认密码"
          :rules="[{ required: true, message: '请填写确认密码' }]"
      />
      <div class="m-15 dark" @click="toLogin">已有账号，立即登录</div>
      <div class="m-15">
        <van-button round block type="success" native-type="submit">注册</van-button>
      </div>
    </van-form>
  </main>
</template>

<script>
import NavBar from "components/navbar/NavBar"
import {reactive, toRefs} from "vue"
import {useRouter} from "vue-router"
import {Toast} from "vant"
import {authRegister} from "network/auth"

export default {
  name: "Register",
  components: {
    NavBar
  },
  setup() {
    const router = useRouter()

    // 数据模型
    const state = reactive({
      name: '',
      email: '',
      password: '',
      password_confirmation: ''
    })

    // 跳转登录
    const toLogin = () => router.push({name: 'Login'})

    // 提交注册
    const onSubmit = values => {
      if (values.password !== values.password_confirmation) {
        return Toast.fail('两次密码输入不一致')
      }
      authRegister(values).then(res => {
        if (res && res.status === 201) {
          Toast.success('注册成功，请登录')
          state.name = ''
          state.email = ''
          state.password = ''
          state.password_confirmation = ''
          toLogin()
        }
      })
    }

    return {
      ...toRefs(state), toLogin, onSubmit
    }
  }
}
</script>

<style scoped>

</style>