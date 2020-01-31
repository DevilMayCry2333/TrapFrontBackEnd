<template>
  <iframe ref="iframe" src="http://localhost:8080/customMap2" style="width:100%;height:100%;"></iframe>
  <!-- <iframe ref="iframe" src="http://106.15.200.245/test2.html" style="width:100%;height:100%;"></iframe> -->
</template>
<script>
import http from "../../../utils/http";

export default {
  created(){
    this.test();
  },
  methods:{
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
    }
  }
}
</script>