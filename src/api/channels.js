import request from '@/utils/request'
// 获取我的频道接口
export function getChannels () {
  return request({
    url: '/user/channels'
  })
}
/****
 * 获取全部频道
 *
 * **/
export function getAllChannels () {
  return request({
    url: '/channels'
  })
}
