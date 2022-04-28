import { request } from "./request";

// 查询购物车
// 购物车列表
export function getShopCar() {
  return request({
    url: `/user/getShopCar`,
    method: "post",
  });
}

// 移出购物车
export function removeShopCar(data) {
    return request({
      url: `/user/removeShopCar`,
      method: "post",
      data,
    });
  }
