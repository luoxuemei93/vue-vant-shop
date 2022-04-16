import {request} from "./request"

/*
前台Api - 首页
 */

// 首页数据
export function homeData(params = {}) {
    return request({
        url: `/api/index`,
        params
    })
}