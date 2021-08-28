<template>
  <top-header active='form'></top-header>
  <el-container>
      <el-aside>
        <el-row
          justify="center"
          align="middle"
          class="row-title"
        >
          <el-col :span="6">
            <p>图标题：</p>
          </el-col>
          <el-col :span="16">
            <el-input
              placeholder="请输入内容"
              v-model="input"
              clearable
              @input="onTitleChange"
            >
            </el-input>
          </el-col>
        </el-row>

        <el-row
          justify="center"
          align="middle"
          class="row-title"
        >
          <el-col :span="6">
            <p>选图片：</p>
          </el-col>
          <el-col :span="16">
            <el-select @change="onImgChange" v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>

      </el-aside>
      <el-main>
        <el-row
          justify="center"
          align="middle"
        >
          <el-col :span="6" style="font-size:2em; margin-bottom:10px">
            {{ titleText }}
          </el-col>
        </el-row>
        <el-row>
          <el-image
            :src="require('@/assets/'+picNum+'.jpg')"
            style="max-height: 700px"
            fit='contain'
          ></el-image>
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
  name: 'Form',
  components: {
    TopHeader,
    BottomFooter
  },
  setup () {
    return {
      input: ref(''),
      picNum: ref(1),
      value: ref('图片1'),
      titleText: ref('默认标题')
    }
  },
  data () {
    const img_options = this.makeOption();
    return {
      options: img_options,
    };
  },
  methods: {
    onTitleChange(title) {
      this.titleText = title
      this.input = title
      if (title.length == 0) {
        this.titleText = '默认标题'
      }
    },
    makeOption() {
      const options = [];
      for (let i=1; i<5; i++) {
        options.push({
          value: i,
          label: '图片'+i
        });
      }
      return options;
    },
    onImgChange(value) {
      this.picNum=value
    }
  }
}
</script>
<style>
.el-main {
  background-color: #E9EEF3;
  color: #333;
  min-height:800px;
  /*line-height: 160px;*/
}
.el-aside {
  background-color: #D3DCE6;
  color: #333;
  /*line-height: 200px;*/
}
.row-title {
  margin-top: 50px;
}
</style>
