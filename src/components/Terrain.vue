<template>
  <top-header active='terrain'></top-header>
  <el-container>
      <el-aside>
        <el-row
          justify="center"
          align="middle"
        >
          <el-col :span="24" class="info-box">
            <el-card shadow="always">
              这里放置的是描述内容，可以写很多行内容，这个框体大小是随着内容变化而变化的
            </el-card>
          </el-col>
        </el-row>
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
            ></el-tree>
          </el-col>
        </el-row>
      </el-aside>
      <el-main>
        <el-row
          align="middle"
          class="terrain-camera-row"
        >
          <el-col :span="2">
            <el-button type="primary" @click="handleOverlook">视角-俯瞰</el-button>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="handleFrontRemote">正面-远观</el-button>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="handleBackRemote">背面-远观</el-button>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="handleFrontNear">正面-近观</el-button>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="handleBackNear">背面-近观</el-button>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="handlePosition">输出坐标</el-button>
          </el-col>
           <el-col :span="2">
            <el-button type="primary" @click="flyEverywhere">移动相机</el-button>
          </el-col>
        </el-row>
        <el-row ref="viewerContainer" class="demo-viewer">
          <vc-viewer
            @ready="onViewerReady"
            :imageryProvider="imageryProvider"
          >
            <vc-provider-terrain-cesium ref="provider"></vc-provider-terrain-cesium>
          </vc-viewer>
        </el-row>
      </el-main>
  </el-container>
  <bottom-footer></bottom-footer>
</template>

<script>
import TopHeader from './TopHeader.vue'
import BottomFooter from './Footer.vue'
import { ref } from 'vue'
import { cesiumStyle, modelTree, token, modelID } from './config'
export default {
  name: 'Terrain',
  components: {
    TopHeader,
    BottomFooter
  },
  setup() {
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
      tree: modelTree
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
      if (!node.value) {
        return null
      }
      window.viewer.scene.primitives.remove(window.tileset);
      var new_tileset = new window.Cesium.Cesium3DTileset({
          url: window.Cesium.IonResource.fromAssetId(node.value),
      });
      new_tileset.style = new window.Cesium.Cesium3DTileStyle(cesiumStyle)
      window.viewer.scene.primitives.add(new_tileset);
      window.tileset = new_tileset;
    },
    handleOverlook() {
      this.moveCamera(
        [101.02071788704941, 30.19557802563253, 35002.56961373912],
        [6.2308596399245, -1.5665436888815525, 0]
      );
    },
    handleFrontRemote() {
      this.moveCamera(
        [101.00003382234061, 30.16713384607326, 5469.99576609889],
        [0.3306107363100539, -0.6636694203781426, 0.00013912953119010751]
      );
    },
    handleFrontNear() {
      this.moveCamera(
        [101.01624382450255, 30.18801465665147, 3233.096298788214],
        [5.613167761782217, -0.6426865360951766, 0.000020562733451079396]
      );
    },
    handleBackRemote() {
      this.moveCamera(
        [101.00338900395397, 30.22458095251689, 5429.306285067023],
        [2.8334525785689086, -0.6666150024282387, 0.00010355921141513846]
      );
    },
    handleBackNear() {
      this.moveCamera(
        [101.01466159412439, 30.20213222697925, 2848.244878626112],
        [3.5491476296255393, -0.21910907864251672, 0.000018831979246236585]
      );
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
  margin-left: 10px
}
</style>

