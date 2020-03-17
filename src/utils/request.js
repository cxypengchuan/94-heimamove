import axios from 'axios'
import JSONBig from 'json-bigint'
import { store } from 'vuex'
import router from '@/router'
// 创建一个新的axios实例
const instance = axios.create(
  {
    baseURL: 'http://ttapi.research.itcast.cn/app/v1_0', // 基地址
    // 处理大数字函数
    tranformResponse: [function (data) {
      return data ? JSONBig.parse(data) : {}
    }]
  }
)
// token注入
// 请求拦截器
// config是axios请求到所有的数据及配置
instance.interceptors.request.use(function (config) {
  // 请求成功时注入token
  // 先判断一下是否有token
  if (store.state.user.token) {
    //   有token的话就注入
    config.headers.Authorization = `Bearer ${store.state.user.token}`// 将token 统一注入到headers中
  }
  return config// 返回注入token后的config
},
function (error) {
  return Promise.reject(error)
})
// 用响应拦截器处理返回结果的数据
instance.interceptors.response.use(function (response) {
  try {
    // 请求成功后的数据里全部包含在data里，axios请求也嵌套一层data
    return response.data.data
  } catch (error) {
    // 请求失败就返回一次嵌套data
    return response.data
  }
},
async function (error) {
  // 响应失败的状态码不同，则处理方式不同
  // 处理前先判断一下
  if (error.response && error.response.status === 401) {
    // 先看下是否有refresh_token
    const path = {
      path: '/login',
      query: {
        // 返回登陆页后带上当前路由地址，登陆后返回当前路由地址
        redirectUrl: router.currentRoute.fullPath
      }
    }
    // 判断是否有refresh_token，有就请求新的token并用refresh_token替换新的token
    // 请求新的toekn需要发送请求
    if (store.state.user.refresh_token) {
      try {
        const result = await axios({
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
          method: 'put',
          headers: { Authorization: `Bearer ${store.state.user.refresh_token}` } // 在请求头中注入refresh_token
        })
        // await强制转为同步代码后，后面token请求成功后的操作
        // 直接更新vue里失效的token
        store.commit('updateUser', {
          user: {
            token: result.data.data.token,
            refresh_token: store.state.user.refresh_token// refresh_token还是原来的refresh_token，有效期14天
          }
        })
        // 进到这一步，证明前面的请求是错误的，我们要把它返回出去
        return instance(error.config)
      } catch (error) {
        // 请求token失败就要返回登陆页，并带上当前路由地址，登陆成功后在返回当前地址
        store.commit('delUser')
        router.push(path)
      }

    //  如果没有refresh_token 直接宣布over 直接跳到登录页面,并删除token
    } else {
      store.commit('delUser')
      router.push(path)
    }
  }
  return Promise.reject(error)
})
export default instance
