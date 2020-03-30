<template>
     <div class="container">
    <van-nav-bar left-arrow @click-left="$router.back()" title="编辑资料" right-text="保存" @click-right='saveUser' ></van-nav-bar>
    <van-cell-group>
      <van-cell is-link title="头像"  center>
        <van-image
        @click="showPhoto = true"
          slot="default"
          width="1.5rem"
          height="1.5rem"
          fit="cover"
          round
          :src="user.photo"
        />
      </van-cell>
      <van-cell is-link title="名称" @click="showName = true" :value="user.name" />
      <van-cell is-link title="性别" @click="showGender = true" :value="user.gender === 0 ? '男' :'女' "/>
      <van-cell is-link title="生日"  @click='showData' :value="user.birthday" />
    </van-cell-group>
     <!-- 头像弹层组件 -->
    <van-popup v-model="showPhoto" style="width:80%">
      <!-- 内容 -->
      <!-- 1 本地相册选择图片 -->
      <!-- 2 拍照 -->
      <!-- 点击本地相册打开上传文件组件 -->
       <van-cell @click="openFileDialog" is-link title="本地相册选择图片"></van-cell>
       <van-cell is-link title="拍照"></van-cell>
    </van-popup>
    <!-- 弹昵称 -->
    <van-popup v-model="showName" style="width:80%" :close-on-click-overlay="false">
       <!-- 编辑用户昵称  双向绑定用户的昵称-->
       <van-field  v-model.trim="user.name" type='textarea' :error-message="nameMsg" rows="4"></van-field>
       <van-button block type="info" size="normal" @click="btnName">确定</van-button>
    </van-popup>
<!-- 性别弹层 -->
    <van-action-sheet :actions="actions" v-model="showGender" @select="selectItem" cancel-text="取消"></van-action-sheet>
    <!-- 生日弹层 -->
    <van-popup v-model="showBirthDay" position="bottom">
      <!-- 选择出生日期  出生日期应该小于现在时间-->
      <!-- type表示 当前的日期类型 年月日 -->
      <van-datetime-picker
           v-model="currentDate"
           type="date"
          :min-date="minDate"
          @cancel="showBirthDay=false"
          :max-date="maxDate"
          @confirm="confirmDate"
         />
    </van-popup>
    <!-- 放置一个input:file 标签 用来上传图片  不能让人看到 隐藏掉 -->
    <!-- vue中 可以通过 ref获取对象 -->
    <!-- 如果选择了文件 就会触发input change事件 -->
    <input @change="upload" ref="myFile" type="file" style="display:none" name="" id="">
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { mapMutations } from 'vuex'
import { getUserProfile, updatePhoto, saveUserInfo } from '@/api/user'
export default {
  data () {
    return {
      showPhoto: false, // 显示头像弹层:
      showName: false, // 显示昵称弹层
      showGender: false, // 显示性别弹层
      showBirthDay: false, // 控制生日弹层
      actions: [{ name: '男' }, { name: '女' }], // 性别数据
      minDate: new Date(1900, 1, 1), // 最小时间
      maxDate: new Date(), // 生日最大时间 永远是小于等于当前时间的
      nameMsg: '', // 绑定提示错误信息
      currentDate: new Date(), // 当前时间,
      user: {
        // 放置个人资料信息
        name: '', // 用户昵称
        gender: 1, // 性别默认值
        birthday: '2002-01-01', // 生日默认值
        photo: '' // 用户头像
      }
    }
  },
  methods: {
    ...mapMutations(['updatePhoto']), // 引入 头像的方法
    // 保存用户信息
    async saveUser () {
      try {
        await saveUserInfo(this.user) // 传入user对象
        this.$pnotify({ type: 'success', message: '保存成功' })
      } catch (error) {
        this.$pnotify({ message: '保存失败' })
      }
    },
    // 修改头像
    async  upload (params) {
      //  当选择 完头像之后 就可以修改头像
      const data = new FormData()
      data.append('photo', this.$refs.myFile.files[0]) // 第二个参数 是 选择的图片文件 选择图片文件
      const result = await updatePhoto(data) // 上传头像
      this.user.photo = result.photo // 把成功上传的头像地址设置给当前data中的数据
      // 修改头像成功之后  也去将 修改成功的头像 设置给当前的vuex
      // this.updatePhoto({ photo: result.photo }) // 将最新的头像地址设置给 vuex数据
      this.showPhoto = false // 关闭头像弹层
      //  当头像上传成功之后 把上传成功的头像的地址 设置给state
      this.updatePhoto({
        photo: result.photo
      }) // 调用mutations方法 将数据设置给公共状态
    },
    // 打开选择文件的对话框 触发点击input:file的动作
    openFileDialog () {
      this.$refs.myFile.click() // 触发input:file的click事件 触发事件就会弹出文件对话框
    },
    // 获取用户信息
    async  getUserProfile () {
      this.user = await getUserProfile()
    },
    btnName () {
      // 点击关闭用户昵称弹层
      // 先判断格式是否正确
      if (this.user.name.length < 1 || this.user.name.length > 7) {
        this.nameMsg = '格式不正确'
        return
      }
      this.nameMsg = ''
      this.showName = false
    },
    // 选择性别
    selectItem (item, index) {
      // index为点击的下标，赋值给当前双向绑定的gender，然后再判断为0则是男，为0则是女
      this.user.gender = index
      // 关闭弹层
      this.showGender = false
    },
    // 生日弹层选择生日
    showData () {
      this.showBirthDay = true // 打开弹层
      this.currentDate = new Date(this.user.birthday)
    },
    // 确定生日
    confirmDate () {
    //  当前选择的生日 其实就是 currenDate
    // 拿到选择的日期  设置给生日  => date  => 字符串
      this.user.birthday = dayjs(this.currentDate).format('YYYY-MM-DD') // 将date类型转化成字符串
      this.showBirthDay = false // 关闭弹层
    }
  },
  created () {
    this.getUserProfile()
  }

}
</script>

<style>

</style>
