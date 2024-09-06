<template>
<div>
  <div @click="init">
    高德
  </div>
 <el-dialog
    :title="id ? '新建' : '编辑'"
    :close-on-click-modal="false"
    append-to-body
    :visible.sync="visible"
    lock-scroll
    width="65%"
  >
    <el-form :model="formData" size="small" label-width="100px">
      <el-row :gutter="0">
        <el-col :span="8">
          <el-form-item label="经度:">
            <el-input :disabled="true" v-model="formData.lng" placeholder="请选择"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="经度:">
            <el-input :disabled="true" v-model="formData.lat" placeholder="请选择"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="有效范围(米):">
            <el-input v-model="formData.range" placeholder="请选择"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="12">
          <el-form-item label="地址:">
            <el-input
              :disabled="true"
              v-model="formData.address"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="地址简称:">
            <el-input
              v-model="formData.abbreviation"
              placeholder="请输入内容"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div id="container"></div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false"> 取 消</el-button>
      <el-button type="primary" @click="dataFormSubmit">
        确 定</el-button
      >
    </span>
  </el-dialog>
</div>
 
</template>
<script
  type="text/javascript"
  src="https://webapi.amap.com/maps?v=2.0&key=你的密钥"
></script>

<script>
import AMapLoader from "@amap/amap-jsapi-loader";

export default {
  components: { },
  data() {
    return {
      visible: false, //弹窗显隐
      center: [115.96926024108602,39.60956024332162], //地图中心点
      map: null, //地图实例
      marker: null, //地图icon
      geocoder: null, //逆解析实例
      id:false,
      loading: false,
      formData: {
        lng: "",
        lat: "",
        range: null,
        address: null,
        //地址简称
        abbreviation: "",
      },
      //默认的地址和经纬度
      point:[115.96926024108602,39.60956024332162],
      address: "韩村河",
    };
  },
  methods: {
    //DOM初始化完成进行地图初始化
    initMap() {
      // 默认的经纬度和地址
      if (this.defaultPoint && this.defaultAddress) {
        this.address = this.defaultAddress;
        this.point = this.defaultPoint;
        this.center = this.point;
      }
      AMapLoader.load({
        key: "你的key", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: [
          "AMap.Geocoder", // 逆向地理解码插件
          "AMap.Marker", // 点标记插件
          "AMap.ToolBar", //比例尺，显示当前地图中心的比例尺
          "AMap.Scale", //比例尺，显示当前地图中心的比例尺
          "AMap.ElasticMarker", //灵活点标记，可以随着地图级别改变样式和大小的 Marker
          "AMap.Geolocation", //定位，提供了获取用户当前准确位置、所在城市的方法
        ], // 需要使用的的插件列表
      })
        .then((AMap) => {
          console.log(this.center)
          this.map = new AMap.Map("container", {
            //设置地图容器id
            zoom: 12, //初始化地图级别
            center: this.center, //初始化地图中心点位置
          });
          
          // 如果父组件传入了有效值 回显一个icon
          if (this.point.length > 0) {
            console.log(123456)
            this.addMarker();
          }
          //监听用户的点击事件
          this.map.on("click", (e) => {
            let lng = e.lnglat.lng;
            let lat = e.lnglat.lat;
            this.point = [lng, lat];
            console.log(e);
            // 增加点标记
            this.addMarker();
            // 获取地址
            this.getAddress(e.lnglat);
          });
        })
        .catch((e) => {
          console.log(e);
        });
    },
    // 增加点标记
    addMarker() {
      // 清除其他icon
      if (this.marker) {
        this.marker.setMap(null);
        this.marker = null;
      }
      // 重新渲染icon
      this.marker = new AMap.Marker({
        icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
        position: this.point, //icon经纬度
        offset: new AMap.Pixel(-13, -30), //icon中心点的偏移量
      });
      this.marker.setMap(this.map); //设置icon
    },
    // 将经纬度转换为地址
      getAddress(val) {
        const self = this;
        // 这里通过高德 SDK 完成。
        this.geocoder = new AMap.Geocoder({
          city: "全国", //地理编码时，设置地址描述所在城市; 默认全国; 可选值：城市名（中文或中文全拼）、citycode、adcode
          radius: 100, //逆地理编码时，以给定坐标为中心点; 默认1000; 取值范围(0-3000)
          extensions: "all", //逆地理编码时，返回信息的详略; 默认值：base，返回基本地址信息; 默认值：base，返回基本地址信息
        });
        //调用逆解析方法 个人开发者调用量上限5000（次/日）
        this.geocoder.getAddress(val, function (status, result) {
          console.log(result);
          if (status === "complete" && result.info === "OK") {
            if (result && result.regeocode) {
              // this指向改变
              console.log(result.regeocode.formattedAddress);
              self.address = result.regeocode.formattedAddress;
              self.$emit("sendLoction", val, self.address);
            }
          }
        });
      },
    turnAdrr(longs, lat) {
      // 高德逆地理变码 https://lbs.amap.com/api/webservice/guide/api/georegeo/
      let _key = "e128ba2b799d25ac626b6bb9ffdda255"; //高德API key类型：web服务
      uni.request({
        method: "GET",
        url: "https://restapi.amap.com/v3/geocode/regeo?parameters",
        data: {
          key: _key,
          location: `${longs},${lat}`,
          output: "JSON",
        },
        success: async (res) => {
          console.log(res.data);
          console.log(res.data.regeocode.formatted_address);
        },
        fail: (r) => {
          console.log(r);
        },
      });
    },
  
    //初始化数据
    init() {
      this.defaultLngAndLat()
      this.initMap();
      this.visible = true;
    },
    //获取经纬度-子组件给父组件传的值
    getLoction(point, address) {
      this.formData.lng = point[0];
      this.formData.lat = point[1];
      this.formData.address = address;
    },
    //默认地址和经纬度
    defaultLngAndLat(){
      this.formData.lng = this.point[0];
      this.formData.lat = this.point[1];
      this.formData.address = this.address;
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs["elForm"].validate((valid) => {
        if (valid) {
          this.submit();
        }
      });
    },
    submit() {
 
    }
  },
};
</script>
<style scoped>
#container {
  padding: 0px;
  margin: 0px;
  width: 100%;
  height: 400px;
}
</style>