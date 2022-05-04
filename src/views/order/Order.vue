<template>
  <nav-bar title="我的订单"></nav-bar>
  <main>
    <!-- 订单列表 -->
    <div class="list">
      <van-collapse v-model="activeNames">
        <van-collapse-item
          v-for="(item, index) in list"
          :title="title(item, index)"
          :name="index"
          :key="index"
        >
          <van-card
            v-for="(sub, cindex) in item.children"
            :key="cindex"
            :num="sub.orderNum"
            :desc="sub.goodsUnit"
            :title="sub.goodsName"
            :thumb="imgurl(sub.goodsId)"
            lazy-load
          />
        </van-collapse-item>
      </van-collapse>
      <div v-if="!finished" class="van-list__finished-text" @click="loadMore">加载更多</div>
      <div v-else class="van-list__finished-text">没有更多了</div>
    </div>
  </main>
  <!-- 回到顶部 -->
  <back-top></back-top>
</template>

<script>
import NavBar from "components/navbar/NavBar";
import BackTop from "components/common/BackTop";
import { ref, reactive, toRefs, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { getOrder } from "network/orders";
import { Dialog, Toast } from "vant";

export default {
  name: "Orders",
  components: {
    NavBar,
    BackTop,
  },
  setup() {
    const router = useRouter();

    // 数据模型
    const state = reactive({
      activeNames: ["1"],
      params: {
        query: "",
        pagenum: 1,
        pagesize: 15,
      },
      // tab
      activeName: 0,
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
    });

    // 卡片头部信息
    const title = computed(() => {
      return (item, index) => {
        return `${index * 1 + 1}、订单:${item.orderCode}（${item.orderDate}）`;
      };
    });

    // 图片展示
    const imgurl = computed(() => {
      return (goodsId) => {
        return `${CONFIG.baseImgURL}${goodsId}.png`;
      };
    });
    // 数据方法
    const init = async () => {
      const { data: res } = await getOrder(state.params);
      state.loading = false;
      const total = res.total;
      if (state.params.pagenum * state.params.pagesize >= total) {
        state.finished = true;
      } else {
        state.finished = false;
      }
      if (res.status == 0) {
        state.list = state.list.concat(res.data.results);
      } else {
      }
    };
    // 继续加载
    const loadMore = async () =>{
      state.params.pagenum =  state.params.pagenum + 1;
      init();
    }
    onMounted(() => {
      init();
    });

    return {
      ...toRefs(state),
      imgurl,
      title,
      loadMore,
    };
  },
};
</script>

<style scoped lang="scss">
.list {
  height: 570px;
  position: fixed;
  top: 45px;
  left: 0px;
  width: 100%;
  bottom: 50px;
  overflow: auto;
}
</style>
