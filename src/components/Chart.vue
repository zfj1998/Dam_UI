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
        <el-row justify="start" align="middle" >
          <el-col :span="3">
            请选择要绘制的测点
          </el-col>
          <el-col :span="3">
            <el-select
              v-model="selected_points"
              multiple placeholder="选择测点"
              collapse-tags
              :loading="points_loading"
            >
              <el-option
                v-for="item in points"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="handleDraw">绘制</el-button>
          </el-col>
        </el-row>
        <div class="chart-block">
          <ECharts
              class="chart"
              ref="chart"
              :option="option"
              :loading="loading"
              :loadingOpts="{ text: 'Wait for 0.5s' }"
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
import { baseMap } from './config'
import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';

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
      option: baseMap,
      points: [],
      points_loading: true,
      selected_points: []
    }
  },
  mounted: function() {
    axios
      .get('http://localhost:8000/mpoints/?section__name=DC4')
      .then(response => {
        response.data.forEach(item => {
          this.points.push({
            'value': item.name,
            'label': item.name
          })
        });
        this.points_loading=false;
      });
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
    },
    parseSource(data, selected) {
      let date_set = [];
      let date_str = [];
      const date_dict = {};
      const result_data = {};
      data.forEach(item => {
        const m_time = item['m_time'];
        const time_obj = moment(m_time);
        date_set.push(time_obj);
        if(date_dict[item['point_name']]){
          date_dict[item['point_name']][time_obj.calendar()] = item['value'];
        }else{
          date_dict[item['point_name']] = {};
          date_dict[item['point_name']][time_obj.calendar()] = item['value'];
        }
      });
      date_set = [...new Set(date_set)];
      date_set.sort((a, b) => a - b);
      date_set.forEach(item => {
        date_str.push(item.calendar());
      });
      selected.forEach(p => {
        result_data[p] = [];    
      });
      date_str.forEach(d => {
        selected.forEach(p => {
          if(date_dict[p][d]){
            result_data[p].push(date_dict[p][d]);
          }else{
            result_data[p].push(null);
          }
        });
      });
      return {
        'result_data': result_data,
        'date': date_str
      };
    },
    parseValues(data, selected) {
      //parse series
      const series = []
      const serie_temp = {
        name: null,
        type: 'line',
        stack: '测量值',
        connectNulls:true,
        data: null
      };
      const source = this.parseSource(data, selected);
      selected.forEach(item => {
        const serie_copy = _.cloneDeep(serie_temp);
        serie_copy['name'] = item;
        serie_copy['data'] = source['result_data'][item];
        series.push(serie_copy);
      });

      return {
        'legend': selected,
        'series': series,
        'date': source['date']
      }
    },
    handleDraw() {
      let url = 'http://localhost:8000/mvalues/?m_points=';
      url += _.join(this.selected_points, ',')
      axios
        .get(url).then(response => {
          const result = this.parseValues(response.data, this.selected_points);
          const new_map = _.cloneDeep(baseMap);
          new_map['legend']['data'] = result['legend'];
          new_map['series'] = result['series'];
          new_map['xAxis']['data'] = result['date'];
          this.option = new_map;
        });
    }
  }
};
</script>
<style>

.chart-block {
  margin-top: 20px;
  height: 700px;
  background-color: white
}
</style>
