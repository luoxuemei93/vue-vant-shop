import {request} from "./request"

/*
前台Api - 地址管理
https://www.showdoc.com.cn/1207745568269674/6090143160092634
 */

// 省市县数据
export function city(params = {}) {
    return request({
        url: `/api/city`,
        params
    })
}

// 添加地址
export function addressAdd(data) {
    return request({
        url: `/api/address`,
        method: 'post',
        data
    })
}

// 地址列表
export function addressList() {
    return request({
        url: `/api/address`
    })
}

// 地址详情
export function addressDetail(address) {
    return request({
        url: `/api/address/${address}`
    })
}

// 更新地址
export function addressUpdate(address, data) {
    return request({
        url: `/api/address/${address}`,
        method: 'put',
        data
    })
}

// 删除地址
export function addressDelete(address) {
    return request({
        url: `/api/address/${address}`,
        method: 'delete'
    })
}

// 设置为默认地址
export function addressDefault(address) {
    return request({
        url: `/api/address/${address}/default`,
        method: 'patch'
    })
}