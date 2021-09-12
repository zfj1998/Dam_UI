<template>
  <top-header active='tree'></top-header>
  <el-container>
      <el-aside>
        <el-tree
          :data="data"
          :props="defaultProps"
          node-key="id"
          :default-expand-all="false"
          @node-click="handleNodeClick"
        ></el-tree>
      </el-aside>
      <el-main>
        <el-empty v-if="!picNum" style="height: 700px" description="暂未选择"></el-empty>
        <el-image
          v-else
          :src="require('@/assets/'+picNum+'.jpg')"
          style="max-height: 700px"
          fit='contain'
        ></el-image>
      </el-main>
  </el-container>
  <bottom-footer></bottom-footer>
</template>

<script>
import TopHeader from './TopHeader.vue'
import BottomFooter from './Footer.vue'
export default {
  name: 'Tree',
  components: {
    TopHeader,
    BottomFooter
  },
  data() {
    return {
      data: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 3,
          label: '二级 2-1',
          children: [{
            id: 4,
            label: '三级 3-1-1',
            value: 3,
          }, {
            id: 5,
            label: '三级 3-1-2',
            value: 3,
          }]}, {
            id: 6,
            label: '二级 2-2',
            value: 2
        }]}, {
        id: 7,
        label: '一级 2',
        value: 1,
      }],
      picNum: null
    };
  },
    methods: {
      handleNodeClick(node) {
        if (!node.value) {
          return null
        }
        this.picNum = node.value
      }
    }
  };
</script>
<style>

</style>
