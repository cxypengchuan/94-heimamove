import router from '@/router'
import store from '@/store'
// 导航守卫

router.beforeEach(function (to, from, next) {
  // 先判访问的路由地址是否以user开头的，并且是否有token
//   如果是以user开头并且没有token则返回登陆页并且带上一个参数
  if (to.path.startsWith('/user') && !store.state.user.token) {
    next({
      path: '/login',
      query: {
        redirectUrl: to.fullPath // 告诉登录页 我没有完成 访问 你登录之后 一定要帮我完成
      }
    })
  } else {
    // 一种是 地址不是 /user起始  一种是 /user起始 并且token存在
    next()
  }
})
