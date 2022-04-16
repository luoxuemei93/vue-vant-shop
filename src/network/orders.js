import {request} from "./request"

/*
前台Api - 订单
https://www.showdoc.com.cn/1207745568269674/6090138142708606
 */

// 订单预览数据
export function ordersPreview() {
    return request({
        url: `/api/orders/preview`
    })
}

// 提交订单
export function ordersSubmit(data) {
    return request({
        url: `/api/orders`,
        method: 'post',
        data
    })
}

// 订单详情
export function ordersDetail(order, params = {}) {
    return request({
        url: `/api/orders/${order}`,
        params
    })
}

// 订单列表
export function ordersList(params) {
    return request({
        url: `/api/orders`,
        params
    })
}

// 物流详情
export function ordersExpress(order) {
    return request({
        url: `/api/orders/${order}/express`,
    })
}

// 确认收货
export function ordersConfirm(order) {
    return request({
        url: `/api/orders/${order}/confirm`,
        method: 'patch'
    })
}

// 评价商品
export function ordersComment(order, data) {
    return request({
        url: `/api/orders/${order}/comment`,
        method: 'post',
        data
    })
}

/*
前台Api - 支付
https://www.showdoc.com.cn/1207745568269674/6090142240141049
 */

// 获取支付二维码
export function ordersPay(order, params) {
    return request({
        url: `/api/orders/${order}/pay`,
        params
    })
}

// 查询支付状态
export function ordersStatus(order) {
    return request({
        url: `/api/orders/${order}/status`
    })
}