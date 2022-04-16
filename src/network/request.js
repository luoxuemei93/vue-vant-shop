import axios from "axios";
import { Toast } from "vant";
import router from "router/index";

export function request(config) {
  // 状态码 https://www.showdoc.com.cn/1207745568269674/6090117842667636
  const codeMsg = {
    200: "（成功）服务器已成功处理了请求。",
    201: "（已创建）请求成功并且服务器创建了新的资源。",
    204: "（无内容）服务器成功处理了请求，但没有返回任何内容。",
    301: "（永久移动）请求的网页已永久移动到新位置。",
    302: "（临时移动）服务器目前从不同的位置响应请求。",
    400: "（错误请求）服务器不理解请求的语法。",
    401: "（未授权）请求要求身份验证。",
    403: "（禁止）无权限, 服务器拒绝请求。",
    404: "（未找到） 服务器找不到请求的资源",
    408: "（超时） 请求超时",
    422: "（验证错误） 请求参数未通过验证",
    429: "（被限制）请求次数过多",
    500: "（服务器内部错误） 服务器遇到错误，无法完成请求。",
    501: "（尚未实施） 服务器不具备完成请求的功能。",
    502: "（错误网关） 服务器作为网关或代理，从上游服务器收到无效响应。",
    503: "（服务不可用） 服务器目前无法使用（由于超载或停机维护）。 通常，这只是暂时状态。",
    504: "（网关超时） 服务器作为网关或代理，但是没有及时从上游服务器收到请求。",
    505: "（HTTP 版本不受支持） 服务器不支持请求中所用的 HTTP 协议版本。",
  };

  // 创建实例
  const instance = axios.create({
    // baseURL: "https://api.shop.eduwork.cn/",
    baseURL: "http://127.0.0.1:3000/api/",
    timeout: 5000,
  });

  // 请求拦截
  instance.interceptors.request.use(
    (config) => {
      // 携带 token https://www.showdoc.com.cn/1207745568269674/6094279351627422
      const token = window.localStorage.getItem("token");
      token && (config.headers.Authorization = `Bearer ${token}`);
      return config;
    },
    (err) => {}
  );

  // 响应拦截
  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      // 处理错误信息
      const { response } = err;
      if (response && response.status) {
        const { status } = err.response;
        if (401 === status) {
          Toast.fail("请先登录");
          router.push({ name: "Login" });
        } else if (422 === status) {
          Toast.fail(
            response.data.errors[Object.keys(response.data.errors)[0]][0]
          );
        } else {
          Toast.fail(codeMsg[status] || response.statusText);
        }
      } else if (!response) {
        Toast.fail("网络异常");
      }
    }
  );

  return instance(config);
}
