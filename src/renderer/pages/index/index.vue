<template>
  <div class="indexPage">
      <h3>欢迎使用区域版地图自定义json生成工具</h3>
			<svg-icon icon-class="map" style="font-size: 200px;"></svg-icon>
			<div class="indexContent">
				<el-button @click="toBigData">录播运营中心地图制作</el-button>
				<el-button @click="toZdkt">专递课堂地图制作</el-button>
			</div>

  </div>
</template>

<script>
import { Button, Message } from 'element-ui'
export default {
  name: 'index',
  data () {
    return {}
  },
  components: {
    elButton: Button
  },
  methods: {
    toBigData () {
      this.$router.push({
        name: 'bigData'
      })
    },
    toZdkt () {
      Message.success({
        message: '敬请期待！'
      })
    }
  }
}
</script>


<style lang="less">
.indexPage {
	text-align: center;
	.indexContent {

	}
}
</style>
