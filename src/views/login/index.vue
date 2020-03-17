<template>
    <div class='container'>
    <!-- 导航 显示返回箭头-->
    <!-- click-left点击左侧事件 -->
    <!-- $router.go(-1) $router.back() -->
    <van-nav-bar title='登录'  left-arrow @click-left="$router.back()"></van-nav-bar>
    <van-cell-group>
  <van-field

    label="用户名"
    placeholder="请输入用户名"
  />
  <van-field

    label="手机号"
    placeholder="请输入手机号"

  />
</van-cell-group>
<van-field

  center

  label="短信验证码"
  placeholder="请输入短信验证码"
>
  <van-button slot="button" size="small" type="primary">发送验证码</van-button>
</van-field>
<div class="btn">
  <van-button type="info" block round>登录</van-button>
</div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang='less' scoped>
.btn{
  padding: 0 10px;
}
</style>
