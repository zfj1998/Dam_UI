<template>
<el-affix>  
  <el-container>
  <el-header>
    <el-menu :default-active="activeIndex" class="el-menu-demo"
              mode="horizontal" :router="true">
      <el-menu-item index="main">
        项目主页
      </el-menu-item>
      <el-menu-item index="form">
        表单侧栏
      </el-menu-item>
      <el-menu-item index="tree">
        树形侧栏
      </el-menu-item>
      <el-menu-item index="chart">
        图表绘制
      </el-menu-item>
      <el-menu-item index="terrain">
        三维展示
      </el-menu-item>
    </el-menu>
  </el-header>
  </el-container>
</el-affix>  
</template>

<script>
export default {
  name: 'TopHeader',
  props: {
    active: String
  },
  data() {
    return {
        activeIndex: this.active,
    };
  },
  methods: {
    handleSelect(event) {
      // this.$router.push(event)
      console.log(event)
    }
  }
}
</script>
<style>
.el-container {
  padding-top: 0
}
</style>