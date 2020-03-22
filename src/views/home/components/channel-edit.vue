<template>
  <div class="channel-edit">
    <div class="channel">
      <div class="tit">
        我的频道：
        <span class="tip">点击可进入频道</span>
        <van-button v-if="!editing" @click="editing=true" size="mini" type="info" plain>编辑</van-button>
        <van-button v-else @click="editing=false" size="mini" type="danger" plain>完成</van-button>
      </div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="(item,index) in channels" :key="item.id">
            <!-- 激活频道的索引与当前频道索引相等时,给一个样式表示选中当前的频道 -->
          <span @click="$emit('selectChannel', index)" :class='{red: index==activeIndex}' class="f12">{{item.name}}</span>
          <!-- 叉号标签,点击编辑时显示 -->
          <!-- 因为第一个不允许删除,所有第一个永远不显示,要加一个判断,index下标为0时不显示 -->
          <van-icon class="btn" name="cross" v-if="index!==0 && editing"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
    <div class="channel">
      <div class="tit">可选频道：</div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="channel in optionalChannels" :key="channel.id">
          <span class="f12">{{channel.name}}</span>
          <van-icon class="btn" name="plus"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
import { getAllChannels } from '@/api/channels'
export default {
  data () {
    return {
      editing: false, // 点击编辑是否显示
      allChannels: [] // 定义一个变量 接收全部频道的数据
    }
  },
  props: {
    channels: {
      type: Array,
      required: true,
      default: () => []// 箭头函数默认返回一个空数组
    },
    activeIndex: {
      required: true, // 表示必须传递channels
      type: Number, // 指定type是number类型
      default: 0
    }
  },
  methods: {
    async getAllChannels () {
      const data = await getAllChannels()
      this.allChannels = data.channels
    }
  },
  created () {
    this.getAllChannels()
  },
  computed: {
    //   可选频道 计算属性必须要求有返回值
    // 可选频道的数据= 全部频道的数据 - 我的频道的数据,过滤
    optionalChannels () {
      // 全部频道 - 我的频道
      return this.allChannels.filter(item => !this.channels.some(o => o.id === item.id))
    }
  }
}
</script>

<style lang='less' scoped>
.channel-edit {
  .channel {
    padding: 10px;
    .tit {
      line-height: 3;
      .tip {
        font-size: 10px;
        color: #999;
      }
    }
    .van-button {
      float: right;
      margin-top: 7px;
    }
    .btn {
      position: absolute;
      bottom: 0;
      right: 0;
      background: #ddd;
      font-size: 12px;
      color: #fff;
    }
    .f12 {
      font-size: 12px;
      color: #555;
    }
    .red {
      color: red;
    }
  }
}
</style>
