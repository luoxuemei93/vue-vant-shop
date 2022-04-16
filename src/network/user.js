import {request} from "./request"

/*
前台Api - 个人中心
https://www.showdoc.com.cn/1207745568269674/6090133286102831
 */

// 用户详情
export function userInfo() {
    return request({
        url: `/api/user`
    })
}

// 更新用户信息
export function userPut(data) {
    return request({
        url: `/api/user`,
        method: 'put',
        data
    })
}

// 更新图像
export function userAvatar(data) {
    return request({
        url: `/api/user/avatar`,
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data
    })
}