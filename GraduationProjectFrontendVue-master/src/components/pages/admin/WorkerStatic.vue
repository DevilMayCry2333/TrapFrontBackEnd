<template>
    <div>
            <el-date-picker v-model="startYear" type="date" value-format="yyyy-MM-dd" placeholder="起始日期"></el-date-picker>
        <el-date-picker v-model="endYear" type="date" value-format="yyyy-MM-dd" placeholder="终止日期"></el-date-picker>

        <el-button type="primary" @click="query()">查询</el-button>

      <el-table border :data="list" style="width: 100%" height="600">
        <el-table-column prop="Worker" label="工人名称"></el-table-column>
        <el-table-column prop="Num" label="工作量"></el-table-column>
        <el-table-column prop="day" label="出勤天数"></el-table-column>
        <el-table-column prop="Avg" label="平均工作量"></el-table-column>
      </el-table>

    </div>
</template>
<script>
import http from "../../../utils/http";
import echarts from "echarts";

export default {
    data(){
        return{
            list:[],
            startYear:"",
            endYear:"",
            province:"",
            city:"",
            area:"",
            manager:""
        }
    },
    methods:{
        query(){
      let role = this.$store.state.user.role;
      console.log("init");
      console.log(role);
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

            console.log(this.startYear);
            console.log(this.endYear);
            console.log(this.manager);
                        http.requestWithToken(
        "/statics/worker",
        "get",
        {
            ProjectAdminName:this.manager,
            startM:this.startYear,
            endM:this.endYear
        },
        res => {
            console.log(res);
            this.list = res.data;

        },
        () => {}
      );

        }
    },
          mounted(){

                  let role = this.$store.state.user.role;
      console.log("init");
      console.log(role);
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

            console.log(this.startYear);
            console.log(this.endYear);
            console.log(this.manager);


      http.requestWithToken(
        "/statics/worker",
        "get",
        {
            ProjectAdminName:this.manager
        },
        res => {
            console.log(res);
            this.list = res.data;

        },
        () => {}
      );

      }

}
</script>
<style>

</style>