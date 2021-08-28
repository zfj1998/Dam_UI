<template>
  <el-container>
  <el-footer>
    <el-row  justify="center">
      <el-image
        :src="require('@/assets/logo.jpg')"
        fit='contain'
        style="max-height:80px"
      ></el-image>
    </el-row>
    </el-footer>
  </el-container>
</template>

<script>
export default {
  name: 'BottomFooter'
}
</script>

<style>
.el-footer {
   background-color: #EFEFEF;
   min-height: 80px;
}
</style>