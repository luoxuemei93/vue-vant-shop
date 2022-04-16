import {request} from "./request"

/*
前台Api - 收藏
https://www.showdoc.com.cn/1207745568269674/6126604694758747
 */

// 我的收藏
export function collectsList() {
    return request({
        url: `/api/collects`,
    })
}

// 收藏和取消
export function collectsChange(goods) {
    return request({
        url: `/api/collects/goods/${goods}`,
        method: 'post'
    })
}