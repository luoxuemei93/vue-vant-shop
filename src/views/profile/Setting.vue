<template>
  <nav-bar title="账号管理"></nav-bar>
  <main>
    <van-tabs v-model:active="active" sticky offset-top="46">
      <!-- 修改基本信息 -->
      <van-tab title="用户信息">
        <van-form @submit="onInfo">
          <van-field
              v-model="email"
              type="email"
              name="email"
              label="登录名"
              disabled
          />
          <van-field
              v-model="name"
              name="name"
              label="昵称"
              placeholder="昵称"
              :rules="[{ required: true, message: '请填写昵称' }]"
          />
          <div class="m-15">
            <van-button round block type="success" native-type="submit">修改</van-button>
          </div>
        </van-form>
      </van-tab>
      <!-- 更新头像 -->
      <van-tab title="更新图像">
        <van-form @submit="onAvatar">
          <van-field name="uploader" label="图像">
            <template #input>
              <van-uploader v-model="uploader" :max-count="1" />
            </template>
          </van-field>
          <div class="m-15">
            <van-button round block type="success" native-type="submit">修改</van-button>
          </div>
        </van-form>
      </van-tab>
      <!-- 修改密码 -->
      <van-tab title="修改密码">
        <van-form @submit="onPassword">
          <van-field
              v-model="old_password"
              type="password"
              name="old_password"
              label="旧密码"
              placeholder="旧密码"
              :rules="[{ required: true, message: '请填写旧密码' }]"
          />
          <van-field
              v-model="password"
              type="password"
              name="password"
              label="新密码"
              placeholder="新密码"
              :rules="[{ required: true, message: '请填写新密码' }]"
          />
          <van-field
              v-model="password_confirmation"
              type="password"
              name="password_confirmation"
              label="确认密码"
              placeholder="确认密码"
              :rules="[{ required: true, message: '请填写确认密码' }]"
          />
          <div class="m-15">
            <van-button round block type="success" native-type="submit">修改</van-button>
          </div>
        </van-form>
      </van-tab>
    </van-tabs>
  </main>
</template>

<script>
import NavBar from "components/navbar/NavBar"
import {reactive, toRefs, onMounted} from "vue"
import {userInfo, userPut, userAvatar} from "network/user"
import {authPasswordUpdate} from "network/auth"
import {Toast} from "vant"

export default {
  name: "Setting",
  components: {
    NavBar
  },
  setup() {
    // 数据模型
    const state = reactive({
      active: 0,
      email: '',
      name: '',
      uploader: [],
      old_password: '',
      password: '',
      password_confirmation: ''
    })

    // 用户信息
    const onInfo = el => {
      // 修改昵称
      Toast.loading({message: '修改中...', forbidClick: true})
      userPut({name: el.name}).then(res => {
        if (res && res.status === 204) {
          Toast.success('修改昵称成功')
        }
      })
    }

    // 更新头像
    const onAvatar = el => {
      if (el.uploader[0] && el.uploader[0].file) {
        Toast.loading({message: '修改中...', forbidClick: true})
        let fd = new FormData()
        fd.append('avatar', el.uploader[0].file)
        userAvatar(fd).then(res => {
          if (res && res.status === 200) {
            Toast.success('修改图像成功')
            state.uploader = [{url: res.data.avatar}]
          }
        })
      } else {
        Toast.fail('未选择图像')
      }
    }

    // 修改密码
    const onPassword = el => {
      if (el.password !== el.password_confirmation) {
        return Toast.fail('两次密码不一致')
      }
      if (el.old_password === el.password) {
        return Toast.fail('新旧密码不能相同')
      }
      Toast.loading({message: '修改中...', forbidClick: true})
      authPasswordUpdate(el).then(res => {
        if (res && res.status === 204) {
          Toast.success('修改成功')
          state.old_password = ''
          state.password = ''
          state.password_confirmation = ''
        }
      })
    }

    onMounted(() => {
      Toast.loading('加载中...')
      userInfo().then(res => {
        if (res && res.status === 200) {
          state.email = res.data.email
          state.name = res.data.name
          state.uploader = [{url: res.data.avatar_url}]
          Toast.clear()
        }
      })
    })

    return {
      ...toRefs(state), onInfo, onAvatar, onPassword
    }
  }
}
</script>

<style scoped>

</style>