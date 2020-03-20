import request from '@/utils/request'

export function getArticle (params) {
  return request({
    // 这里必须用完整地址 因为 之前设置的baseURL是 v1_0
    url: 'http://ttapi.research.itcast.cn/app/v1_1/articles',
    params: { with_top: 1, ...params } // 合并 数据
  })
}
// 封装不感兴趣的接口
export function dislikeArticle (data) {
  return request({
    url: '/article/dislikes',
    method: 'post', // 请求类型
    data
    // body 参数应该位于 data
  })
}
