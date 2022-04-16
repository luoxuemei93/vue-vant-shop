import {request} from "./request"

/*
认证Api
https://www.showdoc.com.cn/1207745568269674/6090123481636428
 */

// 用户注册接口
export function authRegister(data) {
    return request({
        url: `/api/auth/register`,
        method: 'post',
        data
    })
}

// 用户登录接口
export function authLogin(data) {
    return request({
        url: `/api/auth/login`,
        method: 'post',
        data
    })
}

// 退出登录
export function authLogout() {
    return request({
        url: `/api/auth/logout`,
        method: 'post'
    })
}

// 修改密码
export function authPasswordUpdate(data) {
    return request({
        url: `/api/auth/password/update`,
        method: 'post',
        data
    })
}