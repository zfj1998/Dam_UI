<template>
  <top-header active='chart'></top-header>
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
        <div class="chart-block">
          <ECharts
              class="chart"
              ref="chart"
              :option="option"
              :setOptionOpts="{ notMerge: true }"
              :loading="loading"
              :loadingOpts="{ text: 'Wait for 0.5s' }"
              :events="[
                  ['dblclick', onDblclick],
              ]"
          />
        </div>
      </el-main>
  </el-container>
  <bottom-footer></bottom-footer>
</template>

<script>
import TopHeader from './TopHeader.vue'
import BottomFooter from './Footer.vue'
import { createComponent } from 'echarts-for-vue'
import * as echarts from 'echarts'
import { h } from 'vue'
import { Option1 } from './config';

export default {
  name: 'Chart',
  components: {
    TopHeader,
    BottomFooter,
    ECharts: createComponent({ echarts, h }),   // 作为组件使用
  },
  data() {
    return {
      data: [{
        id: 1,
        label: '一级 1',
      }, {
        id: 7,
        label: '一级 2',
        value: 1,
      }],
      picNum: null,
      option: Option1
    }
  },
    methods: {
      handleNodeClick(node) {
        if (!node.value) {
          return null
        }
        this.picNum = node.value
      },
      doSomething() {
        this.$refs.chart.inst.getWidth();
      }
    }
  };
</script>
<style>

.chart-block {
  height: 700px;
  background-color: white
}
</style>
