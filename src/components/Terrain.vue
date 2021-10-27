<template>
  <top-header active='terrain'></top-header>
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
        <el-row ref="viewerContainer" class="demo-viewer">
          <vc-viewer @ready="onViewerReady" :imageryProvider="imageryProvider" :camera="{position: [101.011,30.187,3000], heading: 5, pitch: -20, roll: 0}">
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

      //  :camera="{position: [101.01,30.155,3000], heading: 20, pitch: -9, roll: 0}"
      // Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0OWY4NGI5NC05Y2E4LTQ0MzgtOGQyMC1lYzYzOTdiZjRlZjciLCJpZCI6Njg4MzQsInNjb3BlcyI6WyJsZ24iLCJwciIsImFjdyIsImFzbCIsImFzciIsImFzdyIsImFzcyIsImdjIiwibHIiLCJsdyIsInRyIiwidHciLCJ1c2ciXSwiaWF0IjoxNjM0MjAzNzg5LCJleHAiOjE2MzQ4MDg1ODl9.E2MbJdLA2b2OehSVd8pHt2hk7rAJwz-7e090eU38bGQ"
      // Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MjVmN2Q4Zi0zMDhlLTQzMTYtYTI4NS0wMmZkNjU1YTJiYzYiLCJpZCI6MjU5LCJpYXQiOjE2MzMxMTA1NTl9.SkjZVHCteXzTifSbSqo2rzG7JLiapcJXK428icJQzMU"
      Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3MTUwZDQ3NS1mYzY5LTRiNzAtYjk5YS1hZGRiZTYzZTgyZGYiLCJpZCI6Njg4MzQsImlhdCI6MTYzMjg5NTExN30.qPq9W2KiIj5bPvreaPNTcSXJcdk-EB_egnG0zXAtmvM"
      var tileset = new Cesium.Cesium3DTileset({
        url: Cesium.IonResource.fromAssetId(653776),
      });
      viewer.scene.primitives.add(tileset);
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
