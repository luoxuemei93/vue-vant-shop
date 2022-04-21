import {request} from "./request"
// 分类列表
export function getCategoryList(data = {}) {
    return request({
        url: `user/categories`,
        method: 'post',
        data
    })
}
