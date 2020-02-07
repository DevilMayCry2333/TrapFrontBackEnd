<template>
  <!-- <div v-html="html"></div> -->
  <div style="width:100%;height:100%;">
    <div style="display:flex;width:100%;">
        <el-select @change="test3" v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>      
      <el-upload
      style="margin-left:50%;"
        class="upload-demo"
        :limit="1"
        :on-success="test2"
        :action="uploadUrl">
        <el-button v-if="value" size="small" type="primary">点击上传</el-button>
      </el-upload>
      <!-- <el-button @click="downloadFile" size="small" style="margin-left:80%;" type="primary">点击下载</el-button> -->
      <!-- <el-button @click="test2">测试</el-button> -->
    </div>
    <div style="width:100%;height:97%;">
        <iframe ref="iframe" src="http://106.15.200.245/test4.html" style="width:100%;height:97%;"></iframe>
    </div>
  </div>
</template>
<script>

//明天还要写下图层名字,zip基名字,和项目管理员名字进行对应的表，然后重复的话，要更新这张表
//select count...

import http from "../../../utils/http";
import axios from 'axios'

export default {
  created(){
    this.test();
  },
  mounted(){
        // const oIframe = document.getElementById('iframe');
        //     const deviceWidth = document.documentElement.clientWidth;
        //     const deviceHeight = document.documentElement.clientHeight;
        //     oIframe.style.width = (Number(deviceWidth)-220) + 'px'; //数字是页面布局宽度差值
        //     oIframe.style.height = (Number(deviceHeight)-120) + 'px'; //数字是页面布局高度差
  },
  methods:{
    test3(){
      this.uploadUrl = "http://106.15.200.245:50000/geoserver/upload?username=" + this.manager + "&module=" + this.$route.query.mod + "&eps=" + this.value;
    },
    test2(){
      this.$cookies.set('name','XBH');
      this.$cookies.set('value','801');
      this.$message({
          showClose: true,
          message: '上传成功!系统正在发布,3秒后跳转到首页',
          type: 'success'
        });
        setTimeout(()=>{
          this.$router.push("/");
        },3000);

    },
    downloadFile(){
      var url = "http://106.15.200.245:50000/geoserver/downloadFileAction?userid=" + this.area + this.manager
      + "&module=" + this.$route.query.mod;

      window.location.href = url;
    },

    test(){
      this.$cookies.remove('province');
      this.$cookies.remove('city');
      this.$cookies.remove('area');
      this.$cookies.remove('manager');
      this.$cookies.remove('token');
      this.$cookies.remove('no');
      
          let role = this.$store.state.user.role;
      if (role == 1) {
        this.province = this.$store.state.user.adcode.substr(0, 2);
         this.$cookies.set('province',this.province);
      } else if (role == 2) {
        this.province = this.$store.state.user.adcode.substr(0, 2);
        this.city = this.$store.state.user.adcode.substr(0, 4);
         this.$cookies.set('province',this.province);
        this.$cookies.set('city',this.city);
      } else if (role == 3) {
        this.province = this.$store.state.user.adcode.substr(0, 2);
        this.city = this.$store.state.user.adcode.substr(0, 4);
        this.area = this.$store.state.user.adcode;
                 this.$cookies.set('province',this.province);
        this.$cookies.set('city',this.city);
              this.$cookies.set('area',this.area);
            }
            else if (role == 4) {
                          this.province = this.$store.state.user.adcode.substr(0, 2);
                          this.city = this.$store.state.user.adcode.substr(0, 4);
                          this.area = this.$store.state.user.adcode;
                          this.manager=this.$store.state.user.username;
                                           this.$cookies.set('province',this.province);
                              this.$cookies.set('city',this.city);
                                    this.$cookies.set('area',this.area);
                            this.$cookies.set('manager',this.manager);
                            console.log(this.$route.query);
                        }

                        this.$cookies.set('token',sessionStorage['token']);
                                http.requestWithToken(
                                  "/auth_api/device_list",
                                      "get",
                                      { 
                                        page: 1, limit: 1000,
                                        isMap:false,
                                        project: this.$route.query.mod
                                      },
                                      res => {
                                        var count = 0;             
                                        // console.log(res.data);
                                        for(var i = 0 ; i < res.data.data.length; i++){
                                          // console.log(res.data.data[i]);
                                          
                                          if(res.data.data[i].longitude!=null){
                                            count++;
                                          }
                                        }
                                        console.log("cnt" + count);
                                        var tmp = [];
                                        console.log("tmp" + tmp);
                                        for(var i = 0 ; i < res.data.data.length; i++){
                                          if(res.data.data[i].longitude!=null){
                                            var json = {
                                              "lng":res.data.data[i].longitude,
                                              "lat":res.data.data[i].latitude,
                                              "cus":res.data.data[i].customSerial,
                                            }
                                            tmp.push(json);
                                          }
                                        }
                                        console.log("tmp");
                                        console.log(tmp);
                                        var objString = JSON.stringify(tmp);
                                        // this.$cookies.set('device',objString);
                                        localStorage.setItem('device',objString);

                                      },
                                      () => {}
                                );
                              
                              http.requestWithToken(
                                  "/geoserver/getLayerInfo",
                                      "get",
                                      {
                                        userid: this.area + this.manager,
                                        module: this.$route.query.mod
                                      },
                                      res => {
                                        console.log(res);
                                        if(res.data=="NO"){
                                          this.$cookies.set('no','no');
                                        }
                                          this.workname = res.data.workname;
                                          this.layername = res.data.layername;
                                          this.$cookies.set('workname',this.workname);
                                          this.$cookies.set('layername',this.layername);
                                      },
                                      () => {}
                                );


    }
  },
  data(){
    return{
      province:'',
      city:'',
      area:'',
      manager:'',
      html: '',
      uploadUrl:'',
      module:"1",
      workname:'',
      layername:'',
      options: [{
                value: 'EPSG:2364',
                label: 'EPSG:2364'
              }, {
                value: 'EPSG:2363',
                label: 'EPSG:2363'
              }],
              value: ''

    }
  }
}
</script>