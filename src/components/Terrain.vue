<template>
  <top-header active='terrain'></top-header>
  <el-container>
      <el-aside style="width: 200px">
        <el-row
          justify="center"
          align="middle"
        >
          <el-col :span="20">
            <el-tree
              :data="tree"
              node-key="label"
              :default-expand-all="true"
              @node-click="handleNodeClick"
              class="terrain-tree"
              :render-content="renderTreeContent"
            ></el-tree>
          </el-col>
        </el-row>
      </el-aside>
      <el-main>
          <!-- <el-col :span="2">
            <el-button type="primary" @click="handlePosition">输出坐标</el-button>
          </el-col>
           <el-col :span="2">
            <el-button type="primary" @click="flyEverywhere">移动相机</el-button>
          </el-col> -->
        <el-row ref="viewerContainer" class="demo-viewer">
          <vc-viewer
            @ready="onViewerReady"
            :imageryProvider="imageryProvider"
            :infoBox="false"
            @leftClick="handleCesiumClick"
            :showCredit="false"
          >
            <vc-provider-terrain-cesium ref="provider"></vc-provider-terrain-cesium>
          </vc-viewer>
          <el-row class="demo-toolbar">
            <el-button
              v-if="hasChart"
              type="danger"
              style="padding: 0px; margin: 0px; margin-right: 10px"
              @click="showDrawer = true"
              :loading="chartLoading"
            >
              <el-icon :size="35" color="white">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" data-v-152cbb9b=""><path fill="currentColor" d="M128 896V128h768v768H128zm291.712-327.296 128 102.4 180.16-201.792-47.744-42.624-139.84 156.608-128-102.4-180.16 201.792 47.744 42.624 139.84-156.608zM816 352a48 48 0 1 0-96 0 48 48 0 0 0 96 0z"></path></svg>
              </el-icon>
            </el-button>
            <el-radio-group v-model="viewPoint" @change="handleViewChange">
              <el-radio-button label="正面-远观"></el-radio-button>
              <el-radio-button label="正面-近观"></el-radio-button>
              <el-radio-button label="俯瞰"></el-radio-button>
              <el-radio-button label="背面-远观"></el-radio-button>
              <el-radio-button label="背面-近观"></el-radio-button>
            </el-radio-group>
          </el-row>
        </el-row>
      </el-main>
  </el-container>
  <el-drawer
    v-model="showDrawer"
    :title="drawerTitle"
    direction="rtl"
    size="50%"
  >
    <div class="chart-block">
      <v-chart
        class="chart1"
        ref='myChart'
      />
    </div>
    <div class="chart-block2">
      <v-chart
        class="chart2"
        ref="myChart2"
      />
    </div>
  </el-drawer>
</template>

<script>
import TopHeader from './TopHeader.vue'
import { ref, reactive, toRefs } from 'vue'
import { ElNotification } from 'element-plus'
import { cesiumStyle, modelTree, token, modelID, baseMap } from './config'
import axios from 'axios';
import moment from 'moment';
import VChart from 'vue-echarts';

export default {
  name: 'Terrain',
  components: {
    TopHeader,
    VChart
  },
  setup() {
    const state = reactive({
      showDrawer: false,
      tilesetModel: modelID
    })
    // state
    const provider = ref(null)
    const imageryProvider = ref(null)
    // methods
    const unload = () => {
      provider.value.unload()
    }
    const reload = () => {
      provider.value.reload()
    }
    const load = () => {
      provider.value.load()
    }
    const onViewerReady = ({ Cesium, viewer }) => {
      imageryProvider.value = new Cesium.ArcGisMapServerImageryProvider({
        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
      })
      Cesium.Ion.defaultAccessToken = token
      var tileset = new Cesium.Cesium3DTileset({
        url: Cesium.IonResource.fromAssetId(modelID),
      });
      tileset.style = new Cesium.Cesium3DTileStyle(cesiumStyle);
      viewer.scene.primitives.add(tileset);
      const position = [101.00003382234061, 30.16713384607326, 5469.99576609889]
      const view = [0.3306107363100539, -0.6636694203781426, 0.00013912953119010751]
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          position[0], position[1], position[2]
        ),
        orientation: {
          heading: view[0],
          pitch: view[1],
          roll: view[2],
        },
      });
      window.viewer = viewer;
      window.Cesium = Cesium;
      window.tileset = tileset;
    }
    return {
      ...toRefs(state),
      provider,
      unload,
      reload,
      load,
      imageryProvider,
      onViewerReady
    }
  },
  watch: {
    showDrawer(value) {
      // 监视drawer出现，并加载好chart后，再更新数据
      if (value) {
        this.$nextTick(function () {
          this.$refs.myChart.setOption(this.option, true);
        })
      }
    }
  },
  data() {
    return {
      tree: modelTree,
      viewPoint: ref('正面-远观'),
      drawerTitle: '',
      chartLoading: false,
      hasChart: false,
      option: baseMap
    };
  },
  methods: {
    toDegrees(cartesian3Pos) {
      let pos = window.Cesium.Cartographic.fromCartesian(cartesian3Pos)
      return [pos.longitude / Math.PI * 180, pos.latitude / Math.PI * 180, pos.height]
    },
    moveCamera(position, view, duration=5) {
      window.viewer.camera.flyTo({
        destination: window.Cesium.Cartesian3.fromDegrees(position[0], position[1], position[2]),
        orientation: {
          heading: view[0],
          pitch: view[1],
          roll: view[2],
        },
        easingFunction: window.Cesium.EasingFunction.QUADRATIC_IN_OUT,
        // easingFunction: window.Cesium.EasingFunction.LINEAR_NONE,
        duration: duration
      });
    },
    handleNodeClick(node) {
      this.hasChart = false;
      // 显示基本信息
      if (node.title) {
        this.messaging(node.title, node.message);
      }
      // 加载3Dtileset模型
      if (node.value && this.tilesetModel != node.value) {
        this.tilesetModel = node.value;
        window.viewer.scene.primitives.remove(window.tileset);
        var new_tileset = new window.Cesium.Cesium3DTileset({
            url: window.Cesium.IonResource.fromAssetId(node.value),
        });
        new_tileset.style = new window.Cesium.Cesium3DTileStyle(cesiumStyle)
        window.viewer.scene.primitives.add(new_tileset);
        window.tileset = new_tileset;
      }
      // 加载折线图数据
      if (node.section) {
        this.hasChart = true;
        this.drawerTitle = node.title;
        this.loadChart(node.section)
      }
    },
    loadChart(section_name) {
      this.chartLoading = true;
      const sec_url = 'http://localhost:8000/mpoints/?section__name='
      axios
        .get(sec_url+section_name)
        .then(response => {
          const points = [];
          response.data.forEach(item => {
            points.push(item.name);
          });
          let point_url = 'http://localhost:8000/mvalues/?m_points=';
          point_url += _.join(points, ',')
          axios
            .get(point_url).then(response => {
              const result = this.parseValues(response.data, points);
              const new_map = _.cloneDeep(baseMap);
              new_map['legend']['data'] = result['legend'];
              new_map['series'] = result['series'];
              new_map['xAxis']['data'] = result['date'];
              this.option = new_map;
              this.chartLoading=false;
            });
        });
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
    renderTreeContent(h, { node, data, store }) {
        return <span style="font-size:115%">{node.label}</span>;
    },
    handleCesiumClick(position) {
      console.log("鼠标左键单击事件")
      // var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      // handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
      // handler.setInputAction(function(click){
      //   console.log('左键单击事件：', click.position);
      // },Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    handleViewChange(value) {
      if(value == "俯瞰") {
        this.moveCamera(
          [101.02071788704941, 30.19557802563253, 35002.56961373912],
          [6.2308596399245, -1.5665436888815525, 0]
        );
      }
      else if(value == "正面-远观") {
        this.moveCamera(
          [101.00003382234061, 30.16713384607326, 5469.99576609889],
          [0.3306107363100539, -0.6636694203781426, 0.00013912953119010751]
        );
      }
      else if(value == "正面-近观") {
        this.moveCamera(
          [101.01624382450255, 30.18801465665147, 3233.096298788214],
          [5.613167761782217, -0.6426865360951766, 0.000020562733451079396]
        );
      }
      else if(value == "背面-远观") {
        this.moveCamera(
          [101.00338900395397, 30.22458095251689, 5429.306285067023],
          [2.8334525785689086, -0.6666150024282387, 0.00010355921141513846]
        );
      }
      else if(value == "背面-近观") {
        this.moveCamera(
          [101.01466159412439, 30.20213222697925, 2848.244878626112],
          [3.5491476296255393, -0.21910907864251672, 0.000018831979246236585]
        );
      }
    },
    handlePosition() {
        console.log(this.toDegrees(window.viewer.camera.position))
        console.log(window.viewer.camera.heading, window.viewer.camera.pitch, window.viewer.camera.roll)
    },
    flyEverywhere() {
      console.log("flying");
      this.handleFrontNear();
      setTimeout(() => {
        this.handleFrontRemote();
      }, 5000); 
    },
    messaging(title, message) {
      ElNotification.closeAll();
      ElNotification({
        title: title,
        message: message,
        offset: 70,
        duration: 0
      });
    }
  }
};

</script>
<style>
.terrain-camera-row {
  margin-bottom: 10px
}
.info-box {
  padding-left: 10px;
  padding-bottom: 5px;
  margin-top: 15px;
}
.terrain-tree {
  margin-top: 15px;
}
.demo-viewer .demo-toolbar {
    position: absolute;
    left: 1%;
    top: 1%;
    z-index: 100;
    color: #fff;
    min-width: 100%;
}
.chart-block {
  margin: 15px;
  height: 700px;
  background-color: white
}
.chart-block2 {
  margin: 15px;
  height: 700px;
  background-color: white
}
.el-drawer__body {
  overflow: auto;
}

</style>

