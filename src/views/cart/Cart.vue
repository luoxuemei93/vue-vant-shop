<template>
  <nav-bar :title="title"></nav-bar>
  <main style="padding-bottom: 50px">
    <!--购物车列表-->
    <van-checkbox-group
      v-if="list.length"
      class="px-5 py-5"
      v-model="checkedIds"
      @change="changeGroup"
    >
      <van-swipe-cell v-for="item in list" :key="item.goodsId" class="bgWhite mb-5">
        <div class="flex justify-between my-5 mr-10 size-14">
          <div class="flex items-center">
            <div class="pl-10"><van-checkbox :name="item.goodsId"></van-checkbox></div>
            <img v-lazy="imgurl(item.goodsId)" :alt="item.goodsName" width="90"/>
            <div>{{ item.goodsName }}</div>
          </div>
          <div class="text-right my-auto">
            <div class="mb-10 desc">{{ item.orderNum }}{{item.goodsUnit}}</div>
          </div>
        </div>
        <template #right>
          <van-button
            square
            type="danger"
            style="height: 100%"
            text="删除"
            @click="removeShopCarFun(item.goodsId)"
          />
        </template>
      </van-swipe-cell>
    </van-checkbox-group>
    <!-- 空状态 -->
    <van-empty v-else description="购物车还没有商品">
      <van-button round type="success" @click="goTo">前去选购</van-button>
    </van-empty>
    <!-- 订单结算 -->
    <van-submit-bar
      :price="price * 100"
      :disabled="!list.length"
      button-text="结算"
      style="bottom: 50px"
      @submit="onSubmit"
    >
      <van-checkbox v-model="isCheckedAll" @click="checkAll">全选</van-checkbox>
    </van-submit-bar>
  </main>
</template>

<script>
import NavBar from "components/navbar/NavBar";
import { reactive, toRefs, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import {
  getShopCar,
  removeShopCar,
  cartsChecked,
  cartsNum,
} from "network/carts";
import { Dialog, Toast } from "vant";

export default {
  name: "Carts",
  components: {
    NavBar,
  },
  setup() {
    const router = useRouter();
    const store = useStore();

    // 数据模型
    const state = reactive({
      isCheckedAll: false, // 全选
      checkedIds: [], // 复选框组勾选状态
      list: [], // 购物车列表
    });
    // 图片展示
    const imgurl = computed(() => {
      return (goodsId) => {
        return `${CONFIG.baseImgURL}${goodsId}.png`;
      };
    });
    // 选购跳转
    const goTo = () => router.push("/category");

    // 页面标题
    const title = computed(() => `购物车(${state.list.length})`);

    // 计算总价
    const price = computed(() =>
      state.list
        .filter((item) => state.checkedIds.includes(item.id))
        .reduce(
          (prev, next) =>
            (prev += parseFloat(next.goods.price) * parseInt(next.num)),
          0
        )
    );

    // 复选状态
    const changeGroup = () =>
      cartsChecked({ cart_ids: state.checkedIds }).then(
        (res) =>
          res &&
          res.status === 204 &&
          (state.isCheckedAll = state.list.length === state.checkedIds.length)
      );

    // 全选反选
    const checkAll = () =>
      (state.checkedIds = state.isCheckedAll
        ? state.list.map((el) => el.goodsId)
        : []);

    // 商品结算
    const onSubmit = () => {
      if (!state.checkedIds.length) {
        return Toast("请选择商品");
      }
      // 订单预览
      router.push({ name: "OrderPreview" });
    };

    // 查询购物车信息
    const getCatsListFun = async () => {
      state.list = [];
      const { data: res } = await getShopCar();
      if (res.status == 0) {
        state.list = res.results;
        store.dispatch('updateCartNum')
      }
    };
    // 移出购物车
    const removeShopCarFun = async (goodsId) => {
      const params = {
        goodsIdStr: [goodsId]
      }
      const { data: res } = await removeShopCar(params);
      if (res.status == 0) {
        getCatsListFun();
      }
    };
    onMounted(async () => {
      Toast.loading({ message: "加载中...", forbidClick: true });
      await getCatsListFun();
      Toast.clear()
    });

    return {
      title,
      ...toRefs(state),
      price,
      goTo,
      imgurl,
      removeShopCarFun,
      changeGroup,
      checkAll,
      onSubmit,
    };
  },
};
</script>

<style scoped>
.bgWhite {
  height: 90px;
}
</style>
