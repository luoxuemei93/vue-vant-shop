import {request} from "./request"

/*
前台Api - 购物车
https://www.showdoc.com.cn/1207745568269674/6090135175185450
 */

// 添加购物车
export function cartsAdd(data) {
    return request({
        url: `/api/carts`,
        method: 'post',
        data
    })
}

// 购物车列表
export function cartsList(params = {}) {
    return request({
        url: `/api/carts`,
        params
    })
}

// 购物车数量改变
export function cartsNum(cart, data) {
    return request({
        url: `/api/carts/${cart}`,
        method: 'put',
        data
    })
}

// 移出购物车
export function cartsDelete(cart) {
    return request({
        url: `/api/carts/${cart}`,
        method: 'delete'
    })
}

// 购物车改变选中
export function cartsChecked(data) {
    return request({
        url: `/api/carts/checked`,
        method: 'patch',
        data
    })
}