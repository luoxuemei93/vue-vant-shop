<template>
  <nav-bar title="商品分类"></nav-bar>
  <main>
    <!-- 侧边导航 -->
    <van-sidebar class="side" v-model="activeKey">
      <van-sidebar-item title="全部分类" @click="onCat(0)" />
      <van-sidebar-item
        v-for="(item, index) in categories"
        :key="index"
        :title="item.catName"
        @click="onCat(item.catCode)"
      />
    </van-sidebar>

    <!-- 列表商品 -->
    <div class="list">
      <!-- 下拉刷新，上拉加载 -->
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <!-- 
            商品卡片
            @click="goTo(item.goodsName)"
            -->
          <van-card
            v-for="(item, index) in goodslist"
            :key="index"
            tag="流行"
            :title="item.goodsName"
            lazy-load
            :thumb="imgurl(item)"
          >
            <template #bottom>
              <div class="flex justify-between items-center mb-10">
                <van-stepper v-model="item.orderNumDefault" min="1" />
              </div>
            </template>
            <template #footer>
              <van-button @click="addShop(item)" type="primary" plain size="mini"
                >加入购物车</van-button
              >
            </template>
          </van-card>
        </van-list>
      </van-pull-refresh>
    </div>
  </main>
  <!-- 回到顶部 -->
  <back-top></back-top>
</template>

<script>
import NavBar from "components/navbar/NavBar";
import BackTop from "components/common/BackTop";
import { ref, reactive, toRefs, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getCategoryList } from "network/category";
import { goodsList, addShopCar } from "network/goods";
import { Toast } from "vant";

export default {
  name: "Category",
  components: {
    NavBar,
    BackTop,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    // 数据模型
    const state = reactive({
      categories: [],
      // 下拉刷新 上拉加载
      loading: false,
      finished: false,
      refreshing: false,
      goodslist: [],
      num: 10,
    });

    const imgurl = computed(() => {
      return (value) => {
        return `${CONFIG.baseImgURL}${value.goodsId}.png`;
      };
    });

    // 左侧分类
    const cat = ref(0);
    const onCat = (id) => {
      cat.value = id;
      getGoods(id);
    };

    // 数据方法
    const getGoods = async (id) => {
      Toast.clear();
      state.goodslist = [];
      const params = {
        goodsCategory: id,
      };
      state.loading = true;
      const { data: res } = await goodsList(params);
      state.loading = false;
      state.finished = true;
      if (res.status != 0) {
        Toast.fail('获取商品列表失败！');
      }
      state.goodslist = res.results;
      state.loading = false;
    };

    // 下拉刷新
    const onRefresh = () => {
      state.finished = false;
      state.loading = true;
      getGoods();
    };

    // 跳转详情页
    const goTo = (id) => router.push({ name: "Detail", params: { id } });

    // 查询分类
    const getCategoryListFun = async () => {
      state.categories = [];
      const { data: res } = await getCategoryList();
      if (res.status == 0) {
        state.categories = res.results;
      }
    };

    // 加入购物车
    const addShop = async (item) => {
      const params = {
        ...item,
        orderNum: item.orderNumDefault,
        orderNumDefault: undefined,
      }
      const { data: res } = await addShopCar(params);
      if (res.status == 0) {
        Toast.success('添加成功');
      } else {
        Toast.fail('添加失败');
      }
    };
    onMounted(() => {
      // 左侧分类
      getCategoryListFun(); // 查询分类
      getGoods(); // 查询商品
    });

    return {
      ...toRefs(state),
      onCat,
      goTo,
      onRefresh,
      imgurl,
      addShop,
    };
  },
};
</script>

<style scoped lang="scss">
main {
  //侧栏
  .side {
    position: fixed;
    top: 0px;
    bottom: 50px;
    padding-top: 44px;
    width: 100px;
    background: white;
  }

  //列表商品
  .list {
    background: white;
    margin: 0px 0 0 130px;
    padding: 0px 10px 10px 0;
  }
}
</style>
