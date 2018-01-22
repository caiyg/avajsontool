<template>
  <div id="app">
    <div class="drag-pic" @click="selectFile" v-if="imgUrl===''">
      <p>
        <svg-icon icon-class="addFile" style="font-size: 80px;"></svg-icon>
      </p>
      <span>请把图片拖至此处</span>
      <input type="file" id="fileUpload" style="display:none;" @change="fileChange" accept="image/*" @select="fileSelected">
    </div>
    <div class="img-wrapper" @mousedown="mousedownEvent" @mouseup="mouseupEvent" id="img-wrapper" @mousemove="moveEvent">
      <div class="temp" v-if="tempPoint.x1&&tempPoint.y1&&tempPoint.x2&&tempPoint.y2" 
        :style="{left:tempPoint.x1+'px',top:tempPoint.y1+'px',width:tempPoint.x2-tempPoint.x1+'px',height:tempPoint.y2-tempPoint.y1+'px'}"></div>
      <img src="" alt="" id="preImg" v-show="imgUrl!==''">
    </div>
  </div>
</template>

<script>
  import fs from 'fs'
  // import gm from 'gm'
  export default {
    name: 'avajsongeneratingtool',
    data () {
      return {
        imgUrl: '',
        tempUrl: '',
        tempPoint: {
          x1: '',
          y1: '',
          x2: '',
          y2: ''
        },
        // 鼠标按下时置true
        moveTarget: false
      }
    },
    methods: {
      selectFile () {
        document.querySelector('#fileUpload').click()
      },
      fileChange (e, file) {
        console.log(file, e)
      },
      fileSelected (item) {
        console.log(item)
      },
      mousedownEvent (event) {
        event.preventDefault()
        event.stopPropagation()
        this.tempPoint.x1 = this.tempPoint.x2 = event.offsetX
        this.tempPoint.y1 = this.tempPoint.y2 = event.offsetY
        this.moveTarget = true
      },
      mouseupEvent (event) {
        // this.tempPoint.x2 = event.offsetX
        // this.tempPoint.y2 = event.offsetY
        this.moveTarget = false
      },
      moveEvent (event) {
        if (this.moveTarget) {
          this.tempPoint.x2 = event.offsetX
          this.tempPoint.y2 = event.offsetY
        }
      }
    },
    mounted () {
      let that = this
      document.addEventListener('drop', function (e) {
        e.preventDefault()
        e.stopPropagation()
        if (!/^image\//.test(e.dataTransfer.files[0].type)) {
          alert('请选择图片！')
        } else {
          that.imgUrl = e.dataTransfer.files[0].path
          console.log(e.dataTransfer.files[0])
          document.querySelector('#preImg').src = ''
          fs.writeFileSync('./temp.png', fs.readFileSync(that.imgUrl))
          // document.querySelector('#preImg').src = './temp.png?_=' + new Date().getTime()
          // gm('./temp.png').resize(100, 100, '!').write('./temp.png', error => {
          //   console.log(error)
          // })
          document.querySelector('#preImg').src = './temp.png?_=' + new Date().getTime()
        }
      })
      document.addEventListener('dragover', function (e) {
        e.preventDefault()
        e.stopPropagation()
      })
    }
  }
</script>

<style lang="less">
  /* CSS */
  .drag-pic {
    text-align: center;
    color:#555;
  }
  #preImg {
    width: 691px;
    height: 664px;
  }
  .img-wrapper {
    position: relative;
    .temp {
      border:1px solid red;
      position: absolute;
    }
  }
</style>
