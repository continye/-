<template>
  <div class="conter">
    <el-button type="primary" size="small" @click="addbaidu"
      >百度</el-button
    >
    <!-- <div id="map" style="width: 100%; height: 300px" /> -->
    <el-dialog
      title="地图定位"
      :visible.sync="dialogVisible"
      @close="close"
      width="30%"
    >
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="归属地址：" prop="building">
          <!-- <el-autocomplete
            style="width: 100%"
            v-model="form.building"
            :fetch-suggestions="querySearchAsync"
            :trigger-on-focus="false"
            placeholder="请先搜索地址"
            clearable
            @select="handleSelect"
            @blur="blur"
          >
            <template slot-scope="{ item }">
              <i class="el-icon-search fl mgr10" />
              <div style="overflow: hidden">
                <div class="title">{{ item.title }}</div>
                <span class="address ellipsis">{{ item.address }}</span>
              </div>
            </template>
          </el-autocomplete> -->
          <el-input
            v-model="form.building"
            @blur="blur"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="地图定位：">
          <div id="map" style="width: 100%; height: 300px" />
        </el-form-item>
        <el-form-item label="经度：">
          <el-input v-model="form.longitude" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="维度：">
          <el-input v-model="form.latitude" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script
  type="text/javascript"
  src="//api.map.baidu.com/getscript?type=webgl&v=1.0&ak=你的密钥"
></script>

<script>
// 引入第三方工具包
export default {
  name: "BaiDus",
  data() {
    return {
      // 地图实例
      map: null,
      // Marker实例
      mk: null,
      // 定时器
      initMapeq: null,
      // 表单开关
      dialogVisible: false,
      // 表单
      form: {
        latitude: "",
        longitude: "",
        building: "",
      },
    };
  },
  created() {},
  mounted() {
    // 页面加载完之后，加载百度地图
    // 加载引入BMapGL
    this.initMap();
  },
  methods: {
    close() {
      // this.form = {};
    },
    // 添加开关
    addbaidu() {
      debugger;
      // 打开表单
      this.dialogVisible = true;
      // 加载地图
      this.getbaidu();
      // this.initMap();
    },
    // 加载地图方法
    getbaidu() {
      this.showDialog = true;
      this.initMapeq = setInterval(() => {
        if (this.initMap()) {
          clearInterval(this.initMapeq);
        }
      });
    },
    // 百度地图封装方法
    // 初始化地图
    initMap() {
      //         var map = new BMapGLGL.Map('map');
      // map.centerAndZoom(new BMapGLGL.Point(116.331398,39.897445), 13);
      try {
        console.log(123);
        var that = this;
        // 1、挂载地图
        // 创建地图实例
        this.map = new BMapGL.Map("map");

        var geolocation = new BMapGL.Geolocation();
        
        // 开启SDK辅助定位
        geolocation.enableSDKLocation();
        geolocation.getCurrentPosition(function (res) {
          console.log(res,9999);
          if (res) {
            that.form.longitude = res.point.lng;
            that.form.latitude = res.point.lat;
            //    var point = new BMapGL.Point(
            //   res.latitude,
            //   res.longitude
            // );
            that.map.centerAndZoom(res.point, 14);
            // that.mk = new BMapGL.Marker(res.point, { enableDragging: true });
            // that.mk.setPosition({lat:res.latitude,lng:res.longitude});
            that.getAddrByPoint(res.point);
            console.log(that.form);
          }
        });
        // 设置中心经纬度  这里我们使用BMapGLGL命名空间下的Point类来创建一个坐标点。Point类描述了一个地理坐标点，其中120.872845表示经度，32.021089表示纬度。（为南通濠河风景区坐标） 作者：星银色飞行船
        console.log(this.form);
        var point = new BMapGL.Point(
          this.form.longitude || 116.41338729034514,
          this.form.latitude || 39.910923647957596
        );
        // 3.在创建地图实例后，我们需要对其进行初始化，BMapGLGL.Map.centerAndZoom()方法要求设置中心点坐标和地图级别。 地图必须经过初始化才可以执行其他操作
        this.map.centerAndZoom(point, 14);
        // 滚轮缩放
        this.map.enableScrollWheelZoom();
        // // 3、设置图像标注并绑定拖拽标注结束后事件
        this.mk = new BMapGL.Marker(point, { enableDragging: true });
        this.map.addOverlay(this.mk);
        this.local = new window.BMapGL.LocalSearch(this.map, {
          renderOptions: { map: this.map },
        });
      } catch (err) {
        return false;
      } 
      // 7、绑定点击地图任意点事件
      var that = this;
      this.map.addEventListener("click", function (e) {
        that.getAddrByPoint(e.latlng);
      });
      return true;
    },
    // 2、逆地址解析函数 根据坐标点获取详细地址  point   百度地图坐标点，必传
    getAddrByPoint(point) {
      var that = this;
      console.log(point);
      var geco = new BMapGL.Geocoder();
      geco.getLocation(point, function (res) {
        console.log(res);
        // that.mk.setPosition(point);
        // that.map.panTo(point);
        that.mk.setPosition(res.point);
        that.form.building = res.address + res.content.poi_desc;
        that.form.longitude = res.point.lng;
        that.form.latitude = res.point.lat;
      });
    },
    // 8-1、地址搜索
    blur() {
      this.local.search(this.form.building);
    },
    // 8-2、选择地址
    handleSelect(item) {
      this.form.building = item.address + item.title;
      console.log(item);
      this.form.longitude = item.point.lng;
      this.form.latitude = item.point.lat;
      console.log("lng", item.point.lng);
      console.log("lat", item.point.lat);
      this.map.clearOverlays();
      this.mk = new BMapGL.Marker(item.point);
      this.map.addOverlay(this.mk);
      this.map.panTo(item.point);
    },
  },
};
</script>
<!-- <style lang="scss" scoped>
  .conter {
    // 去除百度地图的图标
    ::v-deep .anchorBL {
      display: none !important;
    }
  }
  </style> -->
