<template>
<!--  导航条-->
  <van-nav-bar
      @click-left="onClickLeft"
      @click-right="onClickRight"
      :fixed="fixed"
      class="navbar"
  >
    <template #left>
      <van-icon class="left" :name="leftIcon" size="18"/>
    </template>
    <template #title><span class="title">{{title}}</span></template>
    <template #right>
      <van-icon class="search" name="search" size="18"/>
    </template>
  </van-nav-bar>

<!--  搜索框-->
  <van-search v-show="isShowSearch"
      v-model="searchText"
      shape="round"
      placeholder="请输入搜索关键词"
      @search="onSearch"
      class="searchbar"
  />
</template>

<script>
import {ref, onBeforeMount} from "vue"
import {useRoute, useRouter} from "vue-router"

export default {
  name: "NavBar",
  props: {
    // 固定顶部
    fixed: {
      type: Boolean,
      default() {
        return true
      }
    },
    // 标题
    title: {
      type: String,
      default() {
        return '标题'
      }
    }
  },
  setup() {
    const route = useRoute(),
        router = useRouter()

    // 导航条
    const leftIcon = ref('wap-home-o')
    const onClickLeft = () => route.path !== '/' && router.back()
    const onClickRight = () => isShowSearch.value = !isShowSearch.value

    // 挂载之前
    onBeforeMount(() => leftIcon.value = route.path === '/' ? 'wap-home-o' : 'arrow-left')

    // 搜索框
    const isShowSearch = ref(false)
    const searchText = ref('')
    const onSearch = () => {
      if (searchText.value.length) {
        router.push({name: 'Category', query: {s: searchText.value}})
      }
    }

    return {
      leftIcon, onClickLeft, onClickRight,
      isShowSearch, searchText, onSearch
    }
  }
}
</script>

<style scoped lang="scss">
//导航条
.navbar {
  background: var(--color-tint);
  .left, .title, .search {
    color: #fff;
  }
}

//搜索框
.searchbar {
  position: fixed;
  top: 46px;
  left: 0;
  right: 0;
  z-index: 2;
}
</style>