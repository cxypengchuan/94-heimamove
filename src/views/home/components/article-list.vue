<template>

  <div class="scroll-wrapper">

    <van-pull-refresh v-model="downLoading" @refresh="onRefresh" :success-text="successText">
    <van-list finished-text="没有了" v-model="upLoading" :finished="finished" @load="onLoad">
        <van-cell-group>
          <van-cell v-for="item in articles" :key="item">
            <!-- 放置元素 文章列表的循环项  无图  单图  三图 -->
            <div class="article_item">
              <!-- 标题 -->
              <h3 class="van-ellipsis">2020年,真的是世纪大变革,世界进程发生巨变的一年</h3>
              <!-- 三图图片 -->
              <div class="img_box">
                <!-- 图片组件用的是 vant的组件库中的图片组件 需要使用该组件 进行图片的懒加载 -->
                <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
                <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
                <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
              </div>
              <!-- 单图 暂时隐藏掉单图-->
               <!-- <div class="img_box">
                <van-image class="w100" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
              </div> -->
              <!-- 作者信息 -->
              <div class="info_box">
                <span>你像一阵风</span>
                <span>8评论</span>
                <span>10分钟前</span>
                <span class="close">
                  <van-icon name="cross"></van-icon>
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
export default {
  data () {
    return {
      successText: '', // 刷新成功的文本
      downLoading: false, // 下载刷新状态 表示是否正在下拉刷新
      upLoading: false, // 表示是否开启了上拉加载 默认值false
      finished: false, // 表示 是否已经完成所有数据的加载
      articles: [] // 文章列表
    }
  },
  methods: {
    onLoad () {
      // 如果你有数据 你应该 把数据到加到list中
      if (this.articles.length > 50) {
        this.finished = true // 表示 数据已经全部加载完毕 没有数据了
      } else {
        // 往组件里加载数据
        const arr = Array.from(
          Array(15),
          (value, index) => this.articles.length + index + 1
        )
        // 上拉加载 不是覆盖之前的数据  应该把数据追加到数组的队尾
        this.articles.push(...arr)
        // 添加完数据 需要手动的关掉 loading
        this.upLoading = false
      }
    },
    onRefresh () {
      setTimeout(() => {
        const arr = Array.from(Array(2), (value, index) => '追加' + (index + 1))
        this.articles.unshift(...arr)
        this.downLoading = false
        this.successText = `刷新了${arr.length}条数据`
      }, 1000)
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
