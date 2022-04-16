<template>
  <nav-bar title="个人中心"></nav-bar>
  <main class="pt-5">
    <!-- 个人信息 -->
    <div class="flex items-center m-15 p-10 bgDark border-radius-10">
      <div class="mr-10">
        <van-uploader :after-read="afterRead">
          <van-image
              round
              width="64"
              height="64"
              :src="user.avatar_url"
              lazy-load
          />
        </van-uploader>
      </div>
      <div class="white size-12 my-auto">
        <div class="flex items-center">
          <div>昵称：</div>
          <div v-if="isName" @click="onClick">{{ user.name }}</div>
          <div v-else class="desc"><input :value="user.name" placeholder="修改昵称" @blur="onBlur" /></div>
        </div>
        <div class="my-5">登录名：{{ user.email }}</div>
        <div>个性签名：成就自己，只需一套精品。</div>
      </div>
    </div>

    <!-- 页面菜单 -->
    <div class="mt-20">
      <van-cell-group inset>
        <van-cell title="我的订单" is-link to="/order"/>
        <van-cell title="我的收藏" is-link to="/collect"/>
        <van-cell title="账号管理" is-link to="/setting"/>
        <van-cell title="地址管理" is-link to="/address"/>
        <van-cell title="关于我们" is-link to="/about"/>
      </van-cell-group>
    </div>

    <!-- 退出登录 -->
    <div class="m-20">
      <van-button type="success" block round @click="logout">退出登录</van-button>
    </div>
  </main>
</template>

<script>
import NavBar from "components/navbar/NavBar"
import {reactive, toRefs, onMounted} from "vue"
import {useRouter} from "vue-router"
import {useStore} from "vuex"
import {authLogout} from "network/auth"
import {userInfo, userPut, userAvatar} from "network/user"
import {Toast} from "vant"

export default {
  name: "Profile",
  components: {
    NavBar
  },
  setup() {
    const router = useRouter()
    const store = useStore()

    // 数据模型
    const state = reactive({
      user: {}, // 用户信息
      isName: true, // 是否修改昵称
    })

    // 修改图像
    const afterRead = file => {
      let fd = new FormData()
      fd.append('avatar', file.file)
      userAvatar(fd).then(res => {
        if (res && res.status === 200) {
          Toast('修改图像成功')
          state.user.avatar_url = res.data.avatar
        }
      })
    }

    // 修改昵称
    const onClick = () => state.isName = false
    const onBlur = ev => {
      state.isName = true
      userPut({name: ev.target.value}).then(res => {
        if (res && res.status === 204) {
          Toast('修改昵称成功')
          state.user.name = ev.target.value
        }
      })
    }

    // 退出登录
    const logout = () => authLogout().then(res => {
      if (res && res.status === 204) {
        Toast.success('退出成功')
        window.localStorage.removeItem('token')
        store.dispatch('updateIsLogin', false)
        router.push({name: 'Login'})
      }
    })

    onMounted(() => {
      Toast.loading('加载中...')
      userInfo().then(res => {
        if (res && res.status === 200) {
          Toast.clear()
          state.user = res.data
        }
      })
    })

    return {
      ...toRefs(state), afterRead, onClick, onBlur, logout
    }
  }
}
</script>

<style scoped>

</style>