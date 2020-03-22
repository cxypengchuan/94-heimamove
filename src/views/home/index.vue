<template>
  <div class="container">
      <!-- 放置tabs组件 -->
      <van-tabs v-model="activeIndex">
         <!-- 内部需要放置子 标签  title值为当前显示的内容-->
         <!-- van-tab是vant组件的样式  -->
         <van-tab :title="item.name" v-for="item in channels" :key="item.id">
           <!-- 单元格 -->
           <!-- <van-cell-group>
                <van-cell title="标题" value="内容" :key="item" v-for="item in 20"></van-cell>
              </van-cell-group> -->

             <ArticleList  @showAction="openAction" :channels_id='item.id'></ArticleList>
         </van-tab>
      </van-tabs>
      <!-- 在tabs下放置图标  编辑频道的图标 -->
      <span class="bar_btn" @click="showChannelEdit = true">
        <!-- 放入图标 vant图标 -->
         <van-icon name='wap-nav'></van-icon>
      </span>
     <!-- 放置弹层组件 -->
         <van-popup :style="{ width: '80%' }" v-model="showMoreAction">
           <!-- $event在H5中是事件对象,在自定义事件中是事件传出的第一个参数 -->
      <MoreAction @dislike="dislikeOrReport('dislike')" @report="dislikeOrReport('report',$event)" />
         </van-popup>
         <!-- 放置弹层组件,我的频道 -->
         <van-action-sheet :round="false" v-model="showChannelEdit" title="编辑频道">
           <!-- 父组件传值给子组件channels是频道数据 -->
           <ChannelEdit @delChannel='delChannel' :activeIndex='activeIndex' @selectChannel="selectChannel" :channels='channels'></ChannelEdit>
         </van-action-sheet>
  </div>
</template>

<script>
import ChannelEdit from './components/channel-edit' // 引入编辑频道组件
import { dislikeArticle, reportArticle } from '@/api/article'
import MoreAction from '@/views/home/components/more-action'
import ArticleList from '@/views/home/components/article-list'
import { getChannels, delChannel } from '@/api/channels'
import eventbus from '@/utils/eventbus' // 公共事件处理器
export default {
  name: 'home', // devtools查看组件时  可以看到 对应的name名称
  components: {
    ArticleList,
    MoreAction,
    ChannelEdit
  },
  data () {
    return {
      channels: {},
      showMoreAction: false, // 弹层显示
      articleId: null, // 用来接收 点击的文章的id
      activeIndex: 0, // 当前默认激活的页面0
      showChannelEdit: false // 是否显示频道编辑组件  默认不显示
    }
  },
  methods: {
    // 删除频道
    async delChannel (id) {
      try {
        await delChannel(id)
        // 找到对应的索引,然后删除,index是要删除的索引,activeIndex则是当前激活的索引
        const index = this.channels.findIndex(item => item.id === id)
        // 当前需要删除的索引判断是否在激活索引之前
        if (index <= this.activeIndex) {
          // 如果你要删除的索引时=是当前激活索引之前或者 等于 ,则当前激活索引要往前挪一格
          this.activeIndex = this.activeIndex - 1
        }
        // 如果要删除的索引在激活索引之后,则直接删除
        this.channels.splice(index, 1)
      } catch (error) {
        this.$notify({ message: '删除频道失败' })
      }
    },
    // 进入频道
    selectChannel (index) {
      this.activeIndex = index // 将对应频道的索引 设置给当前激活的 标签
      this.showChannelEdit = false // 关闭弹层
    },
    // 举报文章
    // async reportArticle (type) {
    //   try {
    //     await reportArticle({
    //       target: this.articleId, type
    //     })
    //     this.$notify({
    //       type: 'success',
    //       message: '操作成功'
    //     })
    //     // 触发删除文章事件,根据传入的文章id和激活频道的频道id
    //     eventbus.$emit('delArticle', this.articleId, this.channels[this.activeIndex].id)
    //     // 关闭弹层
    //     this.showMoreAction = false
    //   } catch (error) {
    //     this.$notify({

    //       message: '操作失败'

    //     })
    //   }
    // },
    // 不敢兴趣
    // type参数为事件的操作类型,监听不喜欢或者举报事件传入的
    // operateType是操作类型
    // type是举报事件传入的参数
    async dislikeOrReport (operateType, type) {
      try {
        // 判断传入的操作类型的参数,然后调用不同的接口
        operateType === 'dislike' ? await dislikeArticle({
          target: this.articleId
        }) : await reportArticle({
          target: this.articleId,
          type
        })
        this.$notify({
          type: 'success',
          message: '操作成功'
        })
        // 触发删除文章事件,根据传入的文章id和激活频道的频道id
        eventbus.$emit('delArticle', this.articleId, this.channels[this.activeIndex].id)
        // 关闭弹层
        this.showMoreAction = false
      } catch (error) {
        this.$notify({

          message: '操作失败'

        })
      }
    },

    // 触发弹层事件
    openAction (artid) {
      this.showMoreAction = true
      // 把点击的文章列表的id保存下来
      this.articleId = artid
      // alert(artid)
    },
    async getMychannels () {
      const data = await getChannels()
      this.channels = data.channels
    }
  },
  created () {
    // 直接获取频道数据
    this.getMychannels()
  }

}
</script>

<style lang='less' scoped>
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content{
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane{
    height: 100%;
    .scroll-wrapper{
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}
</style>
