<template>
<div>
        <el-date-picker v-model="startDate" type="date" value-format="yyyy-MM-dd" placeholder="起始日期"></el-date-picker>
      <el-date-picker v-model="endDate" type="date" value-format="yyyy-MM-dd" placeholder="终止日期"></el-date-picker>
      <el-select v-model="value" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-input v-model="input" placeholder="请输入内容"></el-input>

      <el-button type="primary" @click="query()">查询</el-button>

      <el-button type="primary" @click="exportExcel">导出</el-button>
        <!--<el-button type="primary" @click="someExportExcel">批量导出</el-button>-->

        <!--<el-button type="primary" @click="importExcel(scope.$index)">导入</el-button>-->
        <el-upload  class="upload-demo" ref="upload"
        :action="uploadUrl"
        :on-success="loadMaintenanceData">
          <el-button type="primary" >点击上传</el-button>
        </el-upload>


          <el-table border :data="QRData.list" style="width: 100%" height="600">
        <el-table-column prop="deviceId" label="设备ID" align="center"></el-table-column>
        <el-table-column prop="serial" label="编号" align="center"></el-table-column>
        <el-table-column prop="region" label="所属区域" align="center"></el-table-column>
        <el-table-column prop="submitDate" label="日期" align="center"></el-table-column>
        <el-table-column prop="batch" label="批次" align="center"></el-table-column>
        <el-table-column prop="longitude" label="经度" align="center"></el-table-column>
        <el-table-column prop="latitude" label="纬度" align="center"></el-table-column>
        <el-table-column prop="predatorstype" label="天敌类型" align="center"></el-table-column>
        <el-table-column prop="releaseNum" label="释放数量" align="center"></el-table-column>
        <el-table-column prop="pic" label="照片" align="center">
                            <template slot-scope="scope">
            <el-button
              @click="showPhotoDialog(scope.row.pic)"
              v-if="scope.row.pic != null && scope.row.pic !=''"
              size="mini"
            >显示</el-button>
          </template>

        </el-table-column>
        <el-table-column prop="worker" label="施工人员" align="center"></el-table-column>
        <el-table-column prop="remarks" label="备注" align="center"></el-table-column>
        <el-table-column
          prop="manager"
          label="管理员"
          align="center"
          v-if="this.$store.state.user.role == 3"
        ></el-table-column>


      </el-table>
        <div class="block">
         <el-pagination
            background
            @current-change="handleQRDataCurrentPageChanged"
            :current-page.sync="QRData.page"
            :page-size="10"
            layout="total, prev, pager, next"
            :total="QRData.total"
        ></el-pagination>
        </div>
                        <el-dialog title="现场照片" :visible.sync="PhotoDialog.visible" width="700px">
      <div style="overflow-y:scroll;height: 300px">
        <img v-bind:src="PhotoDialog.pic" style="width: 600px; ">
      </div>
    </el-dialog>

</div>


</template>

<script>
import http from "../../../utils/http";
export default {
    mounted(){
     console.log("init");
      let role = this.$store.state.user.role;
              this.loadDevice();
      console.log(role);
      if (role == 1) {
        this.province = this.$store.state.user.adcode.substr(0, 2);
      } else if (role == 2) {
        this.province = this.$store.state.user.adcode.substr(0, 2);
        this.city = this.$store.state.user.adcode.substr(0, 4);
      } else if (role == 3) {
        this.province = this.$store.state.user.adcode.substr(0, 2);
        this.city = this.$store.state.user.adcode.substr(0, 4);
        this.area = this.$store.state.user.adcode;
            }
            else if (role == 4) {
                          this.province = this.$store.state.user.adcode.substr(0, 2);
                          this.city = this.$store.state.user.adcode.substr(0, 4);
                          this.area = this.$store.state.user.adcode;
                          this.manager=this.$store.state.user.username;
                        }
                           console.log(this.city);
                            console.log(this.province);
                             console.log(this.area);

    },
    methods:{
      exportExcel(){
        console.log(this.QRData.list);
        let role = this.$store.state.user.role;
          console.log(role);
            console.log(this.area);
            console.log(this.city);
              console.log(this.province);


        /**
         *        colName: this.value,
                  searchText: this.input,
                  adcode: this.area
         */
        console.log(http.getBaseUrl());
        setTimeout(()=>{
                  window.location =
        http.getBaseUrl() +
        "/natural/exportExcel?startDate=" +
        this.startDate +
        "&endDate=" +
        this.endDate +
        "&searchText=" +
        this.input +
        "&colName=" +
        this.value +
        "&adcode=" +
        this.area +
        "&username="+
        sessionStorage['username'] +
        "&token=" +
        sessionStorage["token"];
        },1000)

      },
      uploadUrl(){

      },
    showPhotoDialog(id) {
            console.log(id);
      this.PhotoDialog.visible = true;
     // let BASE_URL = "http://47.103.66.70:8081";
    let BASE_URL = "http://106.15.90.78:8081";
      this.PhotoDialog.pic = BASE_URL + "/device_img?imgName=" + id;
    },

      handleQRDataCurrentPageChanged(val) {
        this.QRData.page = val;
        console.log("valChange" + val);
        this.loadDevice();
      },
      query(){
        console.log("query");
        console.log(this.startDate);
        console.log(this.endDate);
        console.log(this.input);
        console.log(this.value);
        let role = this.$store.state.user.role;
          console.log(role);
            console.log(this.area);
            console.log(this.city);
              console.log(this.province);
          // if(role==3){
                        http.requestWithToken(
                "/natural/searchDetail",
                "post",
                { 
                  page: this.QRData.page, 
                  limit: 10, 
                  username: sessionStorage['username'],
                  startDate: this.startDate,
                  endDate: this.endDate,
                  colName: this.value,
                  searchText: this.input,
                  adcode: this.area
                },
                res => {
                  console.log(res);
                this.QRData.list = res.data.Data;
                this.QRData.total = res.data.total;

                },
                () => {}
            );

          // }


      },
      handleQRDataCurrentPageChanged() {
        console.log("hello");
        this.loadDevice();
      },

        loadDevice() {
          console.log("load");
                let role = this.$store.state.user.role;
                this.role = role;
          console.log(this.role);
          if(this.role == 3){
              console.log(sessionStorage['username']);
            http.requestWithToken(
                "/natural/areaDetail",
                "post",
                { page: this.QRData.page, limit: 10, username: sessionStorage['username']},
                res => {
                this.QRData.list = res.data.Data;
                this.QRData.total = res.data.total;

                },
                () => {}
            );
          }else if(this.role == 4){
              http.requestWithToken(
                "/natural/detail",
                "post",
                { page: this.QRData.page, limit: 10, username: sessionStorage['username']},
                res => {
                this.QRData.list = res.data.Data;
                this.QRData.total = res.data.total;

                },
                () => {}
            );
          }
        },
    },
    data(){
        return{
        role:'',
                      PhotoDialog: {
        visible: false,
        pic: ""
      },
      
        QRData: {
            selectedIndex: -1,
            list: [],
            page: 1,
            limit: 10,
            total: 0
        },
        startDate:'',
        endDate: '',
        options: [{
          value: 'device_Id',
          label: '编号'
        }, {
          value: 'region',
          label: '区域'
        }, {
          value: 'batch',
          label: '批次'
        }, {
          value: 'Worker',
          label: '施工人员'
        }],
        value: '',
        input:'',
        province:'',
        city:'',
        area:'',
        manager:''

        }
    },
    name:'NaturalEnemiesDataDetail'
}
</script>

<style>

</style>