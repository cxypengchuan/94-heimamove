<template>

  <div class="scroll-wrapper">

    <van-pull-refresh v-model="downLoading" @refresh="onRefresh" :success-text="successText">
    <van-list finished-text="没有了" v-model="upLoading" :finished="finished" @load="onLoad">
        <van-cell-group>
          <van-cell v-for="item in articles" :key="item.art_id.toString()">
            <!-- 放置元素 文章列表的循环项  无图  单图  三图 -->
            <div class="article_item">
              <!-- 标题 -->
              <h3 class="van-ellipsis">{{ item.title }}</h3>
              <!-- 三图图片 -->
              <div class="img_box" v-if="item.cover.type === 3">
                <!-- 图片组件用的是 vant的组件库中的图片组件 需要使用该组件 进行图片的懒加载 -->
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[0]" />
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[1]" />
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[2]" />
              </div>
              <!-- 单图 暂时隐藏掉单图-->
               <div class="img_box" v-if="item.cover.type === 1">
                <van-image class="w100" lazy-load fit="cover" :src="item.cover.images[0]" />
              </div>
              <!-- 作者信息 -->
              <div class="info_box">
                <span>{{ item.aut_name }}</span>
                <span>{{ item.comm_count }}</span>
                <span>{{ item.pubdate | relTime }}</span>
                <span @click="$emit('showAction')" class="close" v-if="$store.state.user.token">
                  <van-icon name="cross" ></van-icon>
                </span>
              </div>
            </div>
          </van-cell>
        </van-cell-group>
    </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticle } from '@/api/article'
export default {
  data () {
    return {
      successText: '', // 刷新成功的文本
      downLoading: false, // 下载刷新状态 表示是否正在下拉刷新
      upLoading: false, // 表示是否开启了上拉加载 默认值false
      finished: false, // 表示 是否已经完成所有数据的加载
      articles: [], // 文章列表
      timestamp: null
    }
  },
  props: {
    channels_id: {
      required: true, // 必填项
      type: Number, // 表示要传入props属性的类型
      default: null// 默认值
    }
  },
  methods: {
    // 监听

    async onLoad () {
      // // 如果你有数据 你应该 把数据到加到list中
      // if (this.articles.length > 50) {
      //   this.finished = true // 表示 数据已经全部加载完毕 没有数据了
      // } else {
      //   // 往组件里加载数据
      //   const arr = Array.from(
      //     Array(15),
      //     (value, index) => this.articles.length + index + 1
      //   )
      //   // 上拉加载 不是覆盖之前的数据  应该把数据追加到数组的队尾
      //   this.articles.push(...arr)
      //   // 添加完数据 需要手动的关掉 loading
      //   this.upLoading = false
      // }
      // 文章列表真实数据的请求,请求需要传入两个参数
      const data = await getArticle({
        // this.timestamp || Date.now()  如果有历史时间戳 用历史时间戳 否则用当前的时间戳
        channel_id: this.channels_id, timestamp: this.timestamp || Date.now()
      })
      // 把请求到的数据添加到文章列表里
      this.articles.push(...data.results)
      // 关闭加载状态
      this.upLoading = false
      // 还要判断是否有历史时间戳,
      // 将历史时间戳 给timestamp  但是 赋值之前有个判断 需要判断一个历史时间是否为0
      // 如果历史时间戳为 0 说明 此时已经没有数据了 应该宣布 结束   finished true
      if (data.pre_timestamp) {
        // 如果有历史时间戳 表示 还有数据可以继续进行加载
        this.timestamp = data.pre_timestamp
      } else {
        // 表示没有数据可以请求了
        this.finished = true
      }
    },
    async onRefresh () {
      // setTimeout(() => {
      //   const arr = Array.from(Array(2), (value, index) => '追加' + (index + 1))
      //   this.articles.unshift(...arr)
      //   this.downLoading = false
      //   this.successText = `刷新了${arr.length}条数据`
      // }, 1000)
      const data = await getArticle({
        channel_id: this.channels_id,
        timestamp: Date.now()
      })
      this.downLoading = false// 手动关闭下拉刷新的状态
      // 还需要判断最新的时间戳是否请求到数据
      if (data.results.length) {
        // 请求到的内容覆盖文章列表
        this.articles = data.results

        if (data.pre_timestamp) {
          // 因为下拉刷新 换来了一拨新的数据 里面 又有历史时间戳
          this.finished = false // 重新唤醒列表 让列表可以继续上拉加载
          this.timestamp = data.pre_timestamp // 记录历史时间戳给变量
        }
        // 刷新成功后的提示信息,刷新了多少条数据
        this.successText = `更新了${data.results.length}条数据`
      } else {
        this.successText = '当前数据已是最新'
      }
    }

  }

}
</script>

<style lang='less' scoped>
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      width: 100%;
      height: 180px;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span {
      padding-right: 10px;
      &.close {
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
