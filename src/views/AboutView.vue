<template>
  <div>
    <el-dialog
      @close="clearDialog"
      :close-on-click-modal="false"
      :title="text"
      style="text-align: left"
      :visible.sync="popup"
      width="30%"
    >
      <div class="form-layer">
        <el-form label-width="100px" size="mini">
          <el-form-item label="获取定位">
            <el-button type="primary" @click="fixedPos">重新定位</el-button>
          </el-form-item>
          <el-form-item label="当前纬度">
            <p>{{latitude}}</p>
          </el-form-item>
          <el-form-item label="当前经度">
            <p>{{longitude}}</p>
          </el-form-item>
          <el-form-item>
            <div class="f-a-c">
              <el-input v-model="keyWords" placeholder="请输入地区" style="width: 230px;margin-right: 6px;"></el-input>
              <el-button type="primary" @click="setPlace" :disabled="!keyWords">查询</el-button>
            </div>
          </el-form-item>
        </el-form>
        <div id="map"></div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          size="small"
          type="primary"
          v-if="type != '2'"
          @click="btnSubmit()"
          >确 认</el-button
        >
        <el-button size="small" @click="popup = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/javascript" src="//api.map.baidu.com/getscript?type=webgl&v=1.0&ak=kn5uUi7MAsHnGhz8TBSYlSOZi0cLi6iq"></script>

<script>
  export default {
    name: "mapView",
    data() {
      return {
        map: null,
        local: null,
        mk: null,
        latitude: '',
        longitude: '',
        keyWords: ''
      };
    },
    methods: {
      // 打开弹窗，name为弹窗名称
      async openDialog(name) {
        this.text = name;
        this.popup = true;
        this.initMap();
      },
      // 确认
      btnSubmit() {
        let key = {
          latitude: this.latitude,
          longitude: this.longitude
        }
        // 打印经纬度
        console.log(key);
        this.popup = false;
      },
      initMap() {
        this.$nextTick(() => {
          this.map = new BMap.Map("map");
          let point = new BMap.Point(116.404, 39.915);
          this.map.centerAndZoom(point, 12);
          this.map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
          this.map.addControl(new BMap.NavigationControl());
          this.fixedPos();
        });
      },
      // 点击定位-定位到当前位置
      fixedPos() {
        const _this = this;
        const geolocation = new BMap.Geolocation();
        this.confirmLoading = true;
        geolocation.getCurrentPosition(function (r) {
          if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            _this.handleMarker(_this, r.point);
            let myGeo = new BMap.Geocoder();
            myGeo.getLocation(
              new BMap.Point(r.point.lng, r.point.lat),
              function (result) {
                _this.confirmLoading = false;
                if (result) {
                  _this.latitude = result.point.lat;
                  _this.longitude = result.point.lng;
                }
              }
            );
          } else {
            _this.$message.error("failed" + this.getStatus());
          }
        });
      },
      // 搜索地址
      setPlace() {
        this.local = new BMap.LocalSearch(this.map, {
          onSearchComplete: this.searchPlace,
        });
        this.local.search(this.keyWords);
      },
      searchPlace() {
        if (this.local.getResults() != undefined) {
          this.map.clearOverlays(); //清除地图上所有覆盖物
          if (this.local.getResults().getPoi(0)) {
            let point = this.local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
            this.map.centerAndZoom(point, 18);
            this.handleMarker(this, point);
            console.log("经度：" + point.lng + "--" + "纬度" + point.lat);
            this.latitude = point.lat;
            this.longitude = point.lng;
          } else {
            this.$message.error("未匹配到地点!");
          }
        } else {
          this.$message.error("未找到搜索结果!");
        }
      },
      // 设置标注
      handleMarker(obj, point) {
        let that = this;
        obj.mk = new BMap.Marker(point);
        obj.map.addOverlay(obj.mk);
        obj.mk.enableDragging(); // 可拖拽
        obj.mk.addEventListener("dragend", function (e) {
          // 监听标注的拖拽，获取拖拽后的经纬度
          that.latitude = e.point.lat;
          that.longitude = e.point.lng;
        });
        obj.map.panTo(point);
      },
    }
  };
</script>
<style scoped>
  .form-layer {
    width: 100%;
  }
  #map {
    margin-top: 30px;
    width: 100%;
    height: 300px;
    border: 1px solid gray;
    box-sizing: border-box;
    overflow: hidden;
  }

</style>