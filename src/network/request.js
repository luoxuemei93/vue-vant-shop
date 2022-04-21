import axios from "axios";
import { Toast } from "vant";
import router from "router/index";

export function request(config) {
  // 创建实例
  const instance = axios.create({
    baseURL: CONFIG.baseURL,
    timeout: 5000,
  });

  // 请求拦截
  instance.interceptors.request.use(
    (config) => {
      const token = window.localStorage.getItem("token");
      const userName = window.localStorage.getItem("userName");
      token && (config.headers.Authorization = `Bearer ${token}`);
      userName && (config.headers.username = userName)
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
          Toast.fail(response.statusText);
        }
      } else if (!response) {
        Toast.fail("网络异常");
      }
    }
  );

  return instance(config);
}
