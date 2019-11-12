<template>
    <div>
        <el-select v-model="project" placeholder="选择一个项目">
            <el-option label="诱捕器管理" value="诱捕器管理"></el-option>
            <el-option label="注干剂监测" value="注干剂监测"></el-option>
            <el-option label="天敌防治" value="天敌防治"></el-option>
            <el-option label="枯死树采伐" value="枯死树采伐"></el-option>
            <el-option label="轨迹追踪" value="轨迹追踪"></el-option>
        </el-select>
          <el-select v-model="value" placeholder="选择抄报单位">
            <el-option
            v-for="item in options"
            :key="item.username"
            :label="item.username"
            :value="item.username">
            </el-option>
        </el-select>
        <el-button  @click="ReportData" type="primary">确定</el-button>
    </div>
</template>

<script>
import http from "../../../utils/http";

export default {
    data(){
        return{
            project:'',
            CustomProject:'',
            options: [],
            value:''

        }
    },
    mounted(){
      let role = this.$store.state.user.role;
      if (role == 1) {
        this.province = this.$store.state.user.adcode.substr(0, 2);
        // this.loadCity();
      } else if (role == 2) {
        this.province = this.$store.state.user.adcode.substr(0, 2);
        this.city = this.$store.state.user.adcode.substr(0, 4);
        // this.loadArea();
      } else if (role == 3) {
        this.province = this.$store.state.user.adcode.substr(0, 2);
        this.city = this.$store.state.user.adcode.substr(0, 4);
        this.area = this.$store.state.user.adcode;
        // this.loadManagers();
      } else if (role == 4) {
        this.province = this.$store.state.user.adcode.substr(0, 2);
        this.city = this.$store.state.user.adcode.substr(0, 4);
        this.area = this.$store.state.user.adcode;
        this.manager = this.$store.state.user.username;
      }
      console.log(this.area);

            http.requestWithToken(
            "/system/getCustomProject",
            "get",
            {
                adcode:this.area
            },
            res => {
                console.log(res);
                for(var i = 0; i < res.data.data.length; i++){
                    this.options.push(res.data.data[i]);
                }

            },
            () => {}
        );

    },
    methods:{
        ReportData(){
            console.log("数据报告");
            console.log(this.project);
            console.log(this.value);
            http.requestWithToken(
            "/system/dataReport",
            "get",
            {
                project:this.project,
                customProject: this.value
            },
            res => {
                console.log(res);
                if(res.data == "OK"){
                    alert("修改上报成功!");
                }

            },
            () => {}
        );

        }
    }
}
</script>

<style>
#sure{
    color: #fff;
    background-color: #1D7155;
    border-color: #1D7155;
}
</style>