import {createRouter, createWebHistory} from 'vue-router'
import store from 'store/index'
import {Toast} from "vant"

// 使用 vue.config.js 配置的别名
// 分类页
const Category = () => import('views/category/Category')
// 商品详情
const Detail = () => import('views/detail/Detail')
// 购物车
const Cart = () => import('views/cart/Cart')
// 订单管理
const Order = () => import('views/order/Order')
const OrderDetail = () => import('views/order/OrderDetail')
const OrderPreview = () => import('views/order/OrderPreview')
// 个人中心
const Profile = () => import('views/profile/Profile')
const Setting = () => import('views/profile/Setting')
const Register = () => import('views/profile/Register')
const Login = () => import('views/profile/Login')
// 地址管理
const Address = () => import('views/address/Address')
const AddressEdit = () => import('views/address/AddressEdit')
// 收藏管理
const Collect = () => import('views/collect/Collect')
// 关于我们
const About = () => import('views/about/About')

const routes = [
    // 分类页
    {
        path: '/category',
        name: 'Category',
        component: Category,
        meta: {
            title: '商品分类'
        }
    },
    // 详情页
    {
        path: '/detail/:id',
        name: 'Detail',
        component: Detail,
        meta: {
            title: '商品详情'
        }
    },
    // 购物车
    {
        path: '/cart',
        name: 'Cart',
        component: Cart,
        meta: {
            title: '购物车',
            isAuthRequired: true
        }
    },
    // 订单管理
    {
        path: '/order',
        name: 'Order',
        component: Order,
        meta: {
            title: '我的订单',
            isAuthRequired: true
        },
    },
    // 订单详情
    {
        path: '/orderdetail',
        name: 'OrderDetail',
        component: OrderDetail,
        meta: {
            title: '订单详情',
            isAuthRequired: true
        }
    },
    // 订单预览
    {
        path: '/orderpreview',
        name: 'OrderPreview',
        component: OrderPreview,
        meta: {
            title: '订单预览',
            isAuthRequired: true
        }
    },
    // 个人中心
    {
        path: '/profile',
        name: 'Profile',
        component: Profile,
        meta: {
            title: '个人中心',
            isAuthRequired: true
        }
    },
    // 账号管理
    {
        path: '/setting',
        name: 'Setting',
        component: Setting,
        meta: {
            title: '账号管理',
            isAuthRequired: true
        }
    },
    // 注册
    {
        path: '/register',
        name: 'Register',
        component: Register,
        meta: {
            title: '用户注册',
        }
    },
    // 登录
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: {
            title: '用户登录',
        }
    },
    // 地址管理
    {
        path: '/address',
        name: 'Address',
        component: Address,
        meta: {
            title: '地址管理',
            isAuthRequired: true
        }
    },
    // 地址编辑
    {
        path: '/addressedit',
        name: 'AddressEdit',
        component: AddressEdit,
        meta: {
            title: '地址编辑',
            isAuthRequired: true
        }
    },
    // 我的收藏
    {
        path: '/Collect',
        name: 'Collect',
        component: Collect,
        meta: {
            title: '我的收藏',
            isAuthRequired: true
        }
    },
    // 关于我们
    {
        path: '/about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        // component: () => import(/* webpackChunkName: "about" */ '../views/about/About.vue')
        component: About,
        meta: {
            title: '关于我们',
            isAuthRequired: true
        }
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

// 前置导航守卫
router.beforeEach((to, from, next) => {
    document.title = to.meta.title
    if (to.meta.isAuthRequired && !store.getters.isLogin) {
        Toast('请先登录')
        return next({name: 'Login'})
    }
    next()
})

export default router
