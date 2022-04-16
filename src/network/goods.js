import {request} from "./request"

/*
前台Api - 商品
https://www.showdoc.com.cn/1207745568269674/6090132003760639
 */

// 商品列表
export function goodsList(params = {}) {
    return request({
        url: `/api/goods`,
        params
    })
}

// 商品详情
export function goodsDetail(good) {
    return request({
        url: `/api/goods/${good}`
    })
}