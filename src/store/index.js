import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from '@/utils/auth'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: auth.getUser()// 获取token
  },
  mutations: {
    // 修改token
    updateUser (state, payload) {
      state.user = payload.user// 最新的token
      auth.setUser(payload.user)// token存入本地缓存，完成同步
    },
    // 删除token
    delUser (state) {
      state.user = {}// 把token赋值为空对象
      auth.delUser()// 删除本地缓存的token
    }
  },
  actions: {

  },
  modules: {
  }
})
