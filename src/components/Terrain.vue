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
              v-if="true"
              type="danger"
              style="padding: 0px; margin: 0px; margin-right: 10px"
              @click="showDrawer = true"
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
    :title="chartSource"
    direction="rtl"
    size="50%"
  >
    <div class="chart-block">
      <ECharts
        class="chart"
        ref="chart"
        :option="option"
        :loading="loading"
        :loadingOpts="{ text: 'Wait for 0.5s' }"
      />
    </div>
    <div class="chart-block2">
      <ECharts
        class="chart"
        ref="chart"
        :option="option"
        :loading="loading"
        :loadingOpts="{ text: 'Wait for 0.5s' }"
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

export default {
  name: 'Terrain',
  components: {
    TopHeader
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
  data() {
    return {
      tree: modelTree,
      viewPoint: ref('正面-远观'),
      chartSource: 'DC3测点-历史数据',
      option: baseMap, // 绘制echart
      chartLoading: true
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
      // 显示基本信息
      if (node.title) {
        this.messaging(node.title, node.message);
      }
      // 加载3Dtileset模型
      if (node.value & this.tilesetModel != node.value) {
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
        this.loadChart(node.section)
      }
    },
    loadChart(section_name) {
      const base_url = 'http://localhost:8000/mpoints/?section__name='
      axios
        .get(base_url+section_name)
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

