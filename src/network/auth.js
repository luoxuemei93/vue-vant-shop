import {request} from "./request"

// 用户登录接口
export function authLogin(data) {
    return request({
        url: `user/loginByUserName`,
        method: 'post',
        data
    })
}

// 用户注册接口
export function authRegister(data) {
    return request({
        url: `/api/auth/register`,
        method: 'post',
        data
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