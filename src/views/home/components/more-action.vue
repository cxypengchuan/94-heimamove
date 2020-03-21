<template>
  <div class="more-action">
    <van-cell-group v-if="!isReport">
        <!-- 点击后监听不敢兴趣事件事件 -->
      <van-cell  @click="$emit('dislike')">不感兴趣</van-cell>
      <van-cell is-link @click="isReport=true">反馈垃圾内容</van-cell>
      <van-cell>拉黑作者</van-cell>
    </van-cell-group>
    <van-cell-group v-else>
      <van-cell icon="arrow-left" @click="isReport=false">返回</van-cell>
      <van-cell @click="$emit('report', item.value)" v-for="item in reports" :key="item.value">{{item.label}}</van-cell>
      <!-- <van-cell>色情</van-cell>
      <van-cell>暴力</van-cell>
      <van-cell>低俗</van-cell>
      <van-cell>不适</van-cell>
      <van-cell>错误</van-cell>
      <van-cell>其他</van-cell> -->
    </van-cell-group>
  </div>
</template>

<script>
import eventbus from '@/utils/eventbus' // 公共事件处理器
import { reports } from '@/api/constants'
export default {
  data () {
    return {
      isReport: false,
      reports

    }
  },
  created () {
    eventbus.$on('delArticle', () => (this.isReport = false))// 只要你一开始删除 我就把弹层中反馈组件重置为初始状态
  }
}
</script>

<style lang='less' scoped>
.more-action {
  border-radius: 4px;
}
</style>
