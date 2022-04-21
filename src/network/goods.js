import {request} from "./request"
// 商品列表
export function goodsList(data = {}) {
    return request({
        url: `user/getGoodsList`,
        method: 'post',
        data
    })
}

// 商品详情
export function goodsDetail(good) {
    return request({
        url: `/api/goods/${good}`
    })
}

// 加入购物车
export function addShopCar(data = {}) {
    console.log('1');
    return request({
        url: `user/addShopCar`,
        method: 'post',
        data
    })
}