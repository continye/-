<template>
    <div id="news">
      <div class="news_box">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="140px"
          class="demo-ruleForm"
          style="height: auto; width: 100%"
        >
          <div class="news_boxT">企业信息</div>
          <el-form-item label="企业中文名称" prop="name">
            <el-input v-model="ruleForm.name" style="width: 60%"></el-input>
          </el-form-item>
          <el-form-item label="企业联系人" prop="contacts">
            <el-input v-model="ruleForm.contacts" style="width: 60%"></el-input>
          </el-form-item>
          <el-form-item label="企业联系方式" prop="mobile">
            <el-input v-model="ruleForm.mobile" style="width: 60%"></el-input>
          </el-form-item>
          <el-form-item label="企业简介" prop="intro">
            <el-input
              type="textarea"
              v-model="ruleForm.intro"
              style="width: 60%"
            ></el-input>
          </el-form-item>
          <el-form-item label="主营业务" prop="main_business">
            <el-input
              type="textarea"
              v-model="ruleForm.main_business"
              style="width: 60%"
            ></el-input>
          </el-form-item>
  
          <el-form-item label="公司logo">
            <div style="display: flex; align-items: center">
              <el-image
                :src="ruleForm.h_logo"
                style="width: 15%; height: 100%"
              ></el-image>
              <el-image
                :src="ruleForm.s_logo"
                style="width: 15%; height: 100%; margin-left: 3%"
              ></el-image>
            </div>
          </el-form-item>
  
          <el-form-item label="添加dv" prop="dv">
            <div class="upload" @click="dvLists" style="float: left">
              <i class="el-icon-plus text-2xl mt-5"></i>
              <div class="el-upload__text">最多一个</div>
              <div></div>
            </div>
            <div
              style="float: left; width: 86px; height: 86px; margin-left: 10px"
            >
              <video
                class="avatars"
                v-if="ruleForm.coordinate_video[0].resource"
                :src="ruleForm.coordinate_video[0].resource"
                controls
                :autoplay="false"
                :poster="ruleForm.coordinate_video[0].cover"
                style="width: 100%; height: 100%"
              >
                <!-- 如果不支持Video，则显示文字提示 -->
                您的浏览器不支持Video，请升级您的浏览器。
              </video>
            </div>
          </el-form-item>
          <el-form-item>
            <p class="haibaos">
              从素材库中选取DV图，DV只能展示一个，在企业简介里
            </p>
          </el-form-item>
  
          <!-- 选择dv弹窗 -->
          <el-dialog
            title="新增dv"
            :visible.sync="delimg"
            :before-close="handleClose"
            style="margin: auto"
          >
            <div class="bannerLb" style="padding: 30px">
              <div
                style="width: 43%; margin: 2%; padding: 10px"
                v-for="item in videoList"
                :key="item.id"
                :style="{
                  width: '100%',
                  border: isSelected(item) ? '4px solid red' : 'none',
                }"
                @click="toggleSelection(item)"
              >
                <video
                  :src="item.url"
                  class="avatars"
                  controls
                  :poster="item.cover"
                >
                  您的浏览器不支持Video，请升级您的浏览器。
                </video>
              </div>
            </div>
  
            <el-form-item>
              <el-button type="primary" @click="addform">提交</el-button>
              <el-button>重置</el-button>
            </el-form-item>
          </el-dialog>
  
          <div class="news_boxT">企业信息</div>
  
          <!-- 展台图片 -->
          <div style="display: flex">
            <!-- <el-image :src="ruleForm.detail.detail.model_detail_image[0]" class="showcase_img"></el-image>
  
            <el-image :src="ruleForm.detail.detail.model_detail_image[1]" class="showcase_img"></el-image> -->
            <img
              :src="ruleForm.detail.model_detail_image[0]"
              alt=""
              class="showcase_img"
            />
            <img
              :src="ruleForm.detail.model_detail_image[1]"
              alt=""
              class="showcase_img"
            />
          </div>
  
          <!-- 海报图 -->
          <div style="display: flex; flex-wrap: wrap; width: 100%">
            <div
              class="news_Img"
              v-for="(item, index) in ruleForm.detail.picture"
              :key="item.name"
            >
              <div
                style="width: 50%; border: 1px gray solid; border-radius: 16px"
              >
                <img
                  v-if="ruleForm.detail.picture[index].resource"
                  :src="ruleForm.detail.picture[index].resource"
                  alt=""
                  style="height: 100%; width: 100%; border-radius: 16px"
                />
              </div>
              <div style="width: 50%; display: flex; flex-direction: column">
                <p class="haibao">
                  <span>海报图{{ index + 1 }}</span>
                </p>
                <p class="hbImg">
                  JPG、PNG；横图16：9，竖图9：16；小于1M
                </p>
                <button @click="xs(index)" class="hbBtn">
                  <span style="color: white">上传图片</span>
                </button>
              </div>
            </div>
          </div>
  
          <!-- 弹框 -->
          <el-dialog
            title="新增相册"
            :visible.sync="dialogVisible"
            :before-close="handleClose"
          >
            <el-form
              :model="numberValidateForm"
              ref="numberValidateForm"
              label-width="100px"
              class="demo-ruleForm"
            >
              <el-form-item
                label="添加图片"
                prop="modelImg"
                :rules="[{ required: true, message: '图片不能为空' }]"
              >
                <el-upload
                  class="upload-demo upload"
                  :action="uploadActions"
                  :headers="uploadHeaders"
                  :before-upload="beforeAvatarUpload"
                  :on-success="handleAvatarSuccess"
                  :show-file-list="false"
                  name="hallPicture"
                >
                  <img
                    v-if="numberValidateForm.img"
                    :src="numberValidateForm.img"
                    class="avatar"
                    style="height: 86px; width: 86px"
                  />
                  <i class="el-icon-plus text-2xl mt-5"></i>
                  <div class="el-upload__text">添加图片</div>
                </el-upload>
                <p class="haibaos">JPG、PNG；横图16：9，竖图9：16；小于1M</p>
              </el-form-item>
  
              <!-- <el-form-item
                label="图片标题"
                prop="title"
                :rules="[{ required: true, message: '图片标题不能为空' }]"
              >
                <el-input
                  v-model.number="numberValidateForm.title"
                  autocomplete="off"
                ></el-input>
              </el-form-item> -->
  
              <el-form-item>
                <el-button
                  type="primary"
                  @click="submitForms('numberValidateForm')"
                  >提交</el-button
                >
                <el-button @click="resetForms('numberValidateForm')"
                  >重置</el-button
                >
              </el-form-item>
            </el-form>
          </el-dialog>
  
          <div
            style="
              display: flex;
              justify-content: center;
              align-items: center;
              width: 100%;
            "
          >
            <!-- <el-button
              type="primary"
              @click="goyl"
              class="news_btnS"
              style="margin-left: 30%"
              >预览</el-button
            > -->
            <el-button class="news_btnF" @click="changeForm = true"
              >提交审核</el-button
            >
            <el-dialog
              title="提醒"
              :visible.sync="changeForm"
              width="30%"
              :before-close="handleClose"
              style="text-align: center"
            >
              <p>
                <i
                  class="el-icon-message-solid"
                  style="color: #ffd859; font-size: 50px"
                ></i>
              </p>
              <span style="color: #ffd859">审核需要一到两个工作日请谨慎修改</span>
              <span slot="footer" class="dialog-footer">
                <div
                  style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  "
                >
                  <el-button @click="changeForm = false">取 消</el-button>
                  <el-button type="primary" @click="halledit('ruleForm', 'sub')"
                    >确 定</el-button
                  >
                </div>
              </span>
            </el-dialog>
            <!-- <el-dialog
            title="提醒"
            :visible.sync="changeForms"
            width="30%"
            :before-close="handleClose"
            style="text-align: center"
          >
            <p>
              <i
                class="el-icon-message-solid"
                style="color: #ffd859; font-size: 50px"
              ></i>
            </p>
            <span style="color: #ffd859">审核需要一到两个工作日请谨慎修改</span>
            <span slot="footer" class="dialog-footer">
              <div
                style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
              >
                <el-button @click="changeForms = false">取 消</el-button>
                <el-button type="primary" 
                  >确 定</el-button
                >
              </div>
            </span>
          </el-dialog> -->
          </div>
        </el-form>
        <!-- 展台区域 -->
      </div>
    </div>
  </template>
  
  <script>
  // 引入cookies
  import Cookies from "js-cookie";
  import { halldetail, videoList, halledit, threeDadd } from "@/http/axios.js";
  export default {
    name: "news",
    data() {
      return {
        changeForm: false,
        changeForms: false,
        quid: "",
        index: "",
        // 当前选中的视频项的ID
        selectedVideoId: null,
        delimg: false,
        videoList: "",
        ruleForm: {
          id: "",
          examine_status: "",
          reason: "",
          is_preview: "",
          h_logo: "",
          s_logo: "",
          name: "",
          contacts: "",
          mobile: "",
          intro: "",
          main_business: "",
          model_id: "",
          coordinate_video: [
            {
              name: "",
              resource: "",
              resourceType: "Video",
              cover: "",
              id: "",
            },
          ],
          detail: {
            model_detail_image: ["", ""],
            picture: [
              {
                name: "",
                resource: "",
                resourceType: "Picture",
              },
            ],
          },
        },
        rules: {
          name: [
            { required: true, message: "请输入企业中文名称", trigger: "blur" },
          ],
          contacts: [
            { required: true, message: "请输入企业联系人", trigger: "blur" },
          ],
          mobile: [
            { required: true, message: "请输入企业联系方式", trigger: "blur" },
          ],
          intro: [{ required: true, message: "请输入企业简介", trigger: "blur" }],
          main_business: [
            { required: true, message: "请输入企业主营业务", trigger: "blur" },
          ],
          logo2: [{ required: true, message: "请添加dv", trigger: "blur" }],
        },
        // 上传第图片
        uploadActions: "/api_7392ec370066ba93/webapi:hall:uploadImg",
        uploadHeaders: {
          token: Cookies.get("token"),
        },
        numberValidateForm: {
          img: "",
          title: "",
        },
        img: {
          firstImg: "",
        },
        // 弹框状态值
        dialogVisible: false,
        // 企业中文名称
        name: "E20环境平台",
        // 企业联系方式
        phone: "13161760989",
        // 公司简介数据
        profile:
          "E20环境平台秉持 “上善若水·行胜于言” 的核心价值观，以 “用平台的力量助力环境企业快速成长，为生态文明打造产业根基，用产业的力量改变世界” 为使命，以 “政策、产业、市场、金融（财政）、商道、绿色低碳发展”六维综合研究能力为核心驱动力，构建了E20研究院、E20商学院 (CEO特训班）、E20媒体矩阵、E20论坛、E20环境产业圈层 (E20环境产业俱乐部）等相互协同的纵深生态平台。",
        // 公司主营业务数据
        business:
          "E20环境平台秉持 “上善若水·行胜于言” 的核心价值观，以 “用平台的力量助力环境企业快速成长，为生态文明打造产业根基，用产业的力量改变世界” 为使命，以 “政策、产业、市场、金融（财政）、商道、绿色低碳发展”六维综合研究能力为核心驱动力，构建了E20研究院、E20商学院 (CEO特训班）、E20媒体矩阵、E20论坛、E20环境产业圈层 (E20环境产业俱乐部）等相互协同的纵深生态平台。",
        // 公司logo地址
        src: "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
      };
    },
    mounted() {
      this.ztId = JSON.parse(this.$route.query.id);
      this.quid = JSON.parse(this.$route.query.quityId);
      this.getData();
    },
    methods: {
      //预览
      goyl() {
        this.halledit("ruleForm", "view");
      },
      beforeAvatarUpload(file) {
        // const isJPG = file.type === "image/png";
        const isLt2M = file.size / 1024 / 1024 < 1;
        // if (!isJPG) {
        //   this.$message.error("上传头像图片只能是 png 格式!");
        // }
        if (!isLt2M) {
          this.$message.error("上传图片大小不能超过 1MB!");
          return false;
        }
        return isLt2M;
        //阻止传到本地浏览器
        //return false;
      },
      uploadProgress(event, file, fileList) {
        // console.log(file, this.tokens);
      },
      handleAvatarSuccess(res, file) {
        // var uploadImg = "http://yun.e20.top/" + res.data.url;
        // console.log("上传图片成功返回1---", res.data.url);
  
        this.numberValidateForm.img = res.data.url;
        this.ruleForm.detail.picture[this.index].resource = res.data.url;
        // console.log(this.index);
        // console.log(this.ruleForm.detail.picture[this.index].resource);
      },
      // 判断视频项是否被选中
      isSelected(videoItem) {
        return videoItem.id === this.selectedVideoId;
      },
      // 切换视频项的选中状态
      toggleSelection(videoItem) {
        // console.log(videoItem);
        this.ruleForm.coordinate_video[0].resource = videoItem.url;
        this.ruleForm.coordinate_video[0].id = videoItem.id;
        this.ruleForm.coordinate_video[0].cover = videoItem.cover;
        if (this.selectedVideoId === videoItem.id) {
          this.selectedVideoId = null;
        } else {
          this.selectedVideoId = videoItem.id;
        }
        // if(ruleForm.coordinate_video[0].cover){
        //   this.$message('上传成功');
        // }
      },
      submitForms() {
        this.dialogVisible = false;
        this.numberValidateForm.img = "";
      },
      // 视频列表
      dvLists() {
        this.delimg = true;
        videoList().then((res) => {
          this.videoList = res.data.list;
          // console.log(this.videoList);
        });
      },
      // 表单列表
      getData() {
        halldetail({ id: this.ztId }).then((res) => {
          this.ruleForm = res.data;
  
          // console.log(res.data)
          if (!res.error) {
  
          } else {
            this.$message.error(res.msg);
          }
        });
      },
      xs(index) {
        this.dialogVisible = true;
        // console.log(index)
        this.index = index;
      },
  
      halledit(formName, type) {
        console.log(this.ruleForm);
        this.$refs[formName].validate((valid) => {
          if (valid) {
            threeDadd(this.ruleForm).then((res) => {
              if (res.error == 0 && type == "view") {
                window.location.href =
                  "https://yun.e20.top/hall/?id=" + this.quid + "&look=1992";
              }
              this.$message(res.msg);
              this.changeForm = false;
            });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
  
      addform() {
        this.delimg = false;
      },
      handleClose(done) {
       this.dialogVisible=false
      },
    },
    components: {},
  };
  </script>
  
  
  