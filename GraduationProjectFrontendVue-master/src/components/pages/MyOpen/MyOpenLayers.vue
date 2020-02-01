<template>
  <!-- <div v-html="html"></div> -->
  <div style="width:100%;height:100%;">
    <div>
      <el-upload
        class="upload-demo"
        action="https://jsonplaceholder.typicode.com/posts/">
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
    </div>
    <div style="width:100%;height:97%;">
        <iframe ref="iframe" src="http://localhost:8081/customMap" style="width:100%;height:97%;"></iframe>
    </div>
    
  </div>
  
  <!-- <iframe ref="iframe" src="http://106.15.200.245/test4.html" style="width:100%;height:100%;"></iframe> -->
</template>
<script>
import http from "../../../utils/http";
import axios from 'axios'

export default {
  created(){
    this.test();
  },
  mounted(){
        const oIframe = document.getElementById('iframe');
            const deviceWidth = document.documentElement.clientWidth;
            const deviceHeight = document.documentElement.clientHeight;
            oIframe.style.width = (Number(deviceWidth)-220) + 'px'; //数字是页面布局宽度差值
            oIframe.style.height = (Number(deviceHeight)-120) + 'px'; //数字是页面布局高度差
  },
  methods:{
    test2(){

    },
    test(){
      this.$cookies.remove('province');
      this.$cookies.remove('city');
      this.$cookies.remove('area');
      this.$cookies.remove('manager');
      this.$cookies.remove('token');

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
                        }

                        this.$cookies.set('token',sessionStorage['token']);
                                http.requestWithToken(
                                  "/auth_api/device_list",
                                      "get",
                                      { 
                                        page: 1, limit: 1000,
                                        isMap:true
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


    }
  },
  data(){
    return{
      province:'',
      city:'',
      area:'',
      manager:'',
      html: '',
    }
  }
}
</script>