<template>
  <top-header active='main'></top-header>
  <el-container>
      <el-main>
        <el-carousel
          indicator-position="outside"
          type='card'
          height='600px'
        >
          <el-carousel-item v-for="index in 4" v-bind:key="index">
            <el-image
              :src="img_src(index)"
              style="height: 600px"
              fit='contain'
            >
            </el-image>
          </el-carousel-item>
        </el-carousel>
        <el-image
          :src="require('@/assets/small.gif')"
          style="height: 200px"
        >
        </el-image>
      </el-main>
  </el-container>
  <bottom-footer></bottom-footer>
</template>

<script>
import TopHeader from './TopHeader.vue'
import BottomFooter from './Footer.vue'
export default {
  name: 'MainPage',
  components: {
    TopHeader,
    BottomFooter
  },
  data() {
    return{

    }
  },
  methods: {
    img_src (index) {
      const filename = index+'.jpg'
      return require('@/assets/'+filename)
    }
  }
}
</script>
<style>

</style>
