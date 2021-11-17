<template>
  <top-header active='terrain'></top-header>
  <el-container>
      <el-aside>
        <el-row
          justify="center"
          align="middle"
          class="row-title"
        >
          <el-col :span="12">
            <p>选择视角：</p>
          </el-col>
          <el-col :span="12">
            <el-button type="primary" @click="handleOverlook">视角-俯瞰</el-button>
          </el-col>
        </el-row>
        <el-row
          justify="center"
          align="middle"
        >
          <el-col :span="12">
            <el-button type="primary" @click="handleFrontRemote">正面-远观</el-button>
          </el-col>
          <el-col :span="12">
            <el-button type="primary" @click="handleBackRemote">背面-远观</el-button>
          </el-col>
        </el-row>
        <el-row
          justify="center"
          align="middle"
          style="padding-top: 10px;padding-bottom: 10px"
        >
          <el-col :span="12">
            <el-button type="primary" @click="handleFrontNear">正面-近观</el-button>
          </el-col>
          <el-col :span="12">
            <el-button type="primary" @click="handleBackNear">背面-近观</el-button>
          </el-col>
        </el-row>
      </el-aside>
      <el-main>
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
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3MTUwZDQ3NS1mYzY5LTRiNzAtYjk5YS1hZGRiZTYzZTgyZGYiLCJpZCI6Njg4MzQsImlhdCI6MTYzMjg5NTExN30.qPq9W2KiIj5bPvreaPNTcSXJcdk-EB_egnG0zXAtmvM"
      Cesium.Ion.defaultAccessToken = token
      var tileset = new Cesium.Cesium3DTileset({
        url: Cesium.IonResource.fromAssetId(659213),
      });
      tileset.style = new Cesium.Cesium3DTileStyle({
        pointSize: 2.0
      });
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
      };
    },
  methods: {
    toDegrees(cartesian3Pos) {
      let pos = window.Cesium.Cartographic.fromCartesian(cartesian3Pos)
      return [pos.longitude / Math.PI * 180, pos.latitude / Math.PI * 180, pos.height]
    },
    moveCamera(position, view, duration) {
      window.viewer.camera.flyTo({
        destination: window.Cesium.Cartesian3.fromDegrees(position[0], position[1], position[2]),
        orientation: {
          heading: view[0],
          pitch: view[1],
          roll: view[2],
        },
        easingFunction: window.Cesium.EasingFunction.QUADRATIC_IN_OUT,
        duration: duration
      });
    },
    handleOverlook() {
      this.moveCamera(
        [101.02071788704941, 30.19557802563253, 35002.56961373912],
        [6.2308596399245, -1.5665436888815525, 0], 5
      );
    },
    handleFrontRemote() {
      this.moveCamera(
        [101.00003382234061, 30.16713384607326, 5469.99576609889],
        [0.3306107363100539, -0.6636694203781426, 0.00013912953119010751], 5
      );
    },
    handleFrontNear() {
      this.moveCamera(
        [101.01624382450255, 30.18801465665147, 3233.096298788214],
        [5.613167761782217, -0.6426865360951766, 0.000020562733451079396], 5
      );
    },
    handleBackRemote() {
      this.moveCamera(
        [101.00338900395397, 30.22458095251689, 5429.306285067023],
        [2.8334525785689086, -0.6666150024282387, 0.00010355921141513846], 5
      );
    },
    handleBackNear() {
      this.moveCamera(
        [101.01466159412439, 30.20213222697925, 2848.244878626112],
        [3.5491476296255393, -0.21910907864251672, 0.000018831979246236585], 5
      );
    },
    handlePosition() {
        console.log(this.toDegrees(window.viewer.camera.position))
        console.log(window.viewer.camera.heading, window.viewer.camera.pitch, window.viewer.camera.roll)
    }
  }
};
</script>
<style>

</style>

// tileset.style = new Cesium.Cesium3DTileStyle({
//   color: {
//     conditions: [
//       ["${Intensity} === 50", "${COLOR}*rgba(255,255,255, 1)"],
//       ["true","${COLOR}*rgba(255,255,255, 1)"],
//     ],
//   },
//   pointSize: {
//     conditions: [
//       ["true", "${Intensity}/15"],
//     ]
//   }
// });


// setTimeout(function() {
//     viewer.scene.primitives.remove(tileset);
// }, (3 * 1000));

// setTimeout(function() {
//     var new_tileset = viewer.scene.primitives.add(
//   new Cesium.Cesium3DTileset({
//     url: Cesium.IonResource.fromAssetId(654382),
//   })
// );
// new_tileset.readyPromise
//   .then(function () {
//     viewer.zoomTo(tileset);

//     // Apply the default style if it exists
//     var extras = new_tileset.asset.extras;
//     if (
//       Cesium.defined(extras) &&
//       Cesium.defined(extras.ion) &&
//       Cesium.defined(extras.ion.defaultStyle)
//     ) {
//       new_tileset.style = new Cesium.Cesium3DTileStyle(extras.ion.defaultStyle);
//     }
//   })
//   .otherwise(function (error) {
//     console.log(error);
//   });
// // }, (3 * 1000));
