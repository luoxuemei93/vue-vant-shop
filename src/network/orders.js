import { request } from "./request";

// 移出购物车
export function getOrder(data) {
  return request({
    url: `/user/getOrder`,
    method: "post",
    data,
  });
}
