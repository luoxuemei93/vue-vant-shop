import {createStore} from 'vuex'
import {cartsList} from "network/carts"

export default createStore({
    state: {
        user: {
            isLogin: !!window.localStorage.getItem('token'), // 登录状态
            cartNum: 0, // 购物车数量
        }
    },
    // 修改状态
    mutations: {
        setIsLogin(state, payload) {
            state.user.isLogin = payload
        },
        setCartNum(state, payload) {
            state.user.cartNum = payload
        }
    },
    // 异步更新
    actions: {
        updateIsLogin({state, commit, getters}, payload = false) {
            commit('setIsLogin', payload)
        },
        updateCartNum({state, commit, getters}) {
            cartsList().then(res => res && res.status === 200 && commit('setCartNum', res.data.data.length))
        }
    },
    // 计算属性
    getters: {
        isLogin(state, getter) {
            return state.user.isLogin
        },
        cartNum(state, getter) {
            if (getter.isLogin) {
                return state.user.cartNum
            }
            return 0
        }
    },
    modules: {}
})
