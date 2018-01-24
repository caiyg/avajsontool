<template>
  <div id="app">
    <div class="operation">
      <el-input v-model="cityId" style="width:300px" placeholder="请输入城市ID"></el-input>
      <el-button @click="buildJson">生成json</el-button>
    </div>
    <div class="drag-pic" @click="selectFile" v-if="imgUrl===''">
      <p>
        <svg-icon icon-class="addFile" style="font-size: 80px;"></svg-icon>
      </p>
      <span>请把图片拖至此处</span>
      <input type="file" id="fileUpload" style="display:none;" @change="fileChange" accept="image/*" @select="fileSelected">
    </div>
    <div class="img-wrapper" @mousedown="mousedownEvent" @mouseup="mouseupEvent" id="img-wrapper" @mousemove="moveEvent">
      <div class="temp" v-if="tempPoint.x1&&tempPoint.y1&&tempPoint.x2&&tempPoint.y2" draggable="true"
        :style="{left:tempPoint.x1+'px',top:tempPoint.y1+'px',width:tempPoint.x2-tempPoint.x1+'px',height:tempPoint.y2-tempPoint.y1+'px'}"></div>
      <div class="area-item" v-for="area in areas" :key="area.id" 
        :style="{left:area.points[0]+'px', top:area.points[1]+'px', width:Math.abs(area.points[2]-area.points[0])+'px', height:Math.abs(area.points[3]-area.points[1])+'px'}"></div>
      <img src="" alt="" id="preImg" v-show="imgUrl!==''">
    </div>

    <el-dialog title="新的热区" v-model="newAreaToggle">
      <el-form :model="newArea" label-width="100px">
        <el-form-item label="名称：">
          <el-input v-model="newArea.name" placeholder="城市名称"></el-input>
        </el-form-item>
        <el-form-item label="Id：">
          <el-input v-model="newArea.id" placeholder="城市对应的Id"></el-input>
        </el-form-item>
        <div style="text-align:center">
          <el-button type="primary" @click="addArea">确定</el-button>
          <el-button @click="cancelModal">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
    <p>{{dirname}}</p>
    <p>{{muLuname}}</p>
  </div>
</template>

<script>
  import fs from 'fs'
  import path from 'path'
  // import gm from 'gm'
  import { Dialog, Form, FormItem, Input, Button, Message } from 'element-ui'
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
        moveTarget: false,
        newAreaToggle: false,
        newArea: {
          name: '',
          mapId: '',
          coords: '',
          cityId: '',
          points: [],
          id: '',
          href: 'equipmentBigData/recordDataList'
        },
        areas: [],
        cityId: '',
        dirname: path.join(__dirname),
        muLuname: ''
      }
    },
    methods: {
      selectFile () {
        document.querySelector('#fileUpload').click()
      },
      fileChange (e, file) {
        console.log(file, e)
        e.preventDefault()
        e.stopPropagation()
        if (!/^image\//.test(e.dataTransfer.files[0].type)) {
          alert('请选择图片！')
        } else {
          this.imgUrl = e.target.value
          document.querySelector('#preImg').src = ''
          // console.log(__dirname, path.join(__dirname), '************')
          fs.writeFileSync(path.resolve('/temp.png'), fs.readFileSync(this.imgUrl))
          // document.querySelector('#preImg').src = './temp.png?_=' + new Date().getTime()
          // gm('./temp.png').resize(100, 100, '!').write('./temp.png', error => {
          //   console.log(error)
          // })
          document.querySelector('#preImg').src = path.resolve(__dirname) + '/temp.png?_=' + new Date().getTime()
        }
      },
      fileSelected (item) {
        console.log(item)
      },
      mousedownEvent (event) {
        event.preventDefault()
        event.stopPropagation()
        // console.log(event)
        this.tempPoint.x1 = event.pageX
        this.tempPoint.x2 = event.pageX
        this.tempPoint.y1 = event.pageY
        this.tempPoint.y2 = event.pageY
        console.log('x1y1', event.pageX, event.pageY)
        this.moveTarget = true
      },
      mouseupEvent (event) {
        // this.tempPoint.x2 = event.pageX
        // this.tempPoint.y2 = event.pageY
        this.moveTarget = false
        this.newAreaToggle = true
      },
      moveEvent (event) {
        this.$nextTick(() => {
          if (this.moveTarget) {
            this.tempPoint.x2 = event.pageX
            this.tempPoint.y2 = event.pageY
          }
        })
      },
      addArea () {
        let coords = JSON.parse(JSON.stringify(this.tempPoint))
        this.newArea.points = [coords.x1, coords.y1, coords.x2, coords.y2]
        // this.newArea.points = [this.tempPoint.x1, this.tempPoint.y1, this.tempPoint.x2, this.tempPoint.y2]
        this.newArea.coords = this.newArea.points.join(',')
        this.areas.push(Object.assign({}, this.newArea))
        this.newArea = {
          name: '',
          mapId: '',
          coords: '',
          cityId: '',
          points: [],
          href: 'equipmentBigData/recordDataList'
        }
        // this.tempPoint = {
        //   x1: '',
        //   y1: '',
        //   x2: '',
        //   y2: ''
        // }
        this.tempPoint.x1 = ''
        this.tempPoint.y1 = ''
        this.tempPoint.x2 = ''
        this.tempPoint.y2 = ''
        this.newAreaToggle = false
        console.log(this.areas)
      },
      buildJson () {
        if (this.cityId) {
          this.areas.forEach((value) => {
            value.cityId = this.cityId
            value.mapId = this.cityId + value.id
          })
          fs.writeFileSync('./json/' + this.cityId + '.json', JSON.stringify(this.areas))
        } else {
          Message.warning({
            message: '请先输入cityId'
          })
        }
      },
      cancelModal () {
        this.newAreaToggle = false
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
          // fs.writeFileSync(path.resolve('/temp.png'), fs.readFileSync(that.imgUrl))

          // document.querySelector('#preImg').src = './temp.png?_=' + new Date().getTime()
          // gm('./temp.png').resize(100, 100, '!').write('./temp.png', error => {
          //   console.log(error)
          // })
          // document.querySelector('#preImg').src = './temp.png?_=' + new Date().getTime()
          // console.log((path.resolve(__dirname,'../../../', 'temp.png?_=' + new Date().getTime()))
          that.muLuname = path.join(__dirname, '../../../..', 'temp.png?_=' + new Date().getTime())
          document.querySelector('#preImg').src = path.join(__dirname, '../../../..', 'temp.png?_=' + new Date().getTime())
          // document.querySelector('#preImg').src = path.join('/temp.png?_=' + new Date().getTime())
          // document.querySelector('#preImg').src = path.resolve(__dirname) + '/temp.png?_=' + new Date().getTime()
        }
      })
      document.addEventListener('dragover', function (e) {
        e.preventDefault()
        e.stopPropagation()
      })
    },
    components: {
      elDialog: Dialog,
      elForm: Form,
      elFormItem: FormItem,
      elInput: Input,
      elButton: Button
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
    border:1px solid #999;
    .temp {
      border:1px solid red;
      position: absolute;
    }
    .area-item{
      border:1px solid green;
      position: absolute;
    }
  }
  .operation {
    text-align: center;
    margin-bottom: 10px;
    .el-input {
      margin-right: 20px;
    }
  }
</style>
