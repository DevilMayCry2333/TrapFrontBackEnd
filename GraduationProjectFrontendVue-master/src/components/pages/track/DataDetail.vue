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

            <el-table border :data="QRData.list" style="width: 100%" height="600">
            <el-table-column prop="linename" label="线路名称" align="center"></el-table-column>
            <el-table-column prop="timeconsume" label="耗时" align="center"></el-table-column>
            <el-table-column prop="starttime" label="开始时间" align="center"></el-table-column>
            <el-table-column prop="endtime" label="结束时间" align="center"></el-table-column>
            <el-table-column prop="startpoint" label="起点(经纬度)" align="center"></el-table-column>
            <el-table-column prop="endpoint" label="终点(经纬度)" align="center"></el-table-column>
            <el-table-column prop="pic1" label="照片1" align="center"></el-table-column>
            <el-table-column prop="pic2" label="照片2" align="center"></el-table-column>
            <el-table-column prop="pic3" label="照片3" align="center"></el-table-column>
            <el-table-column prop="pic4" label="照片4" align="center"></el-table-column>
            <el-table-column prop="pic5" label="照片5" align="center"></el-table-column>
            <el-table-column prop="worker" label="施工人员" align="center"></el-table-column>
            <el-table-column prop="workingContent" label="工作内容" align="center"></el-table-column>
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
</div>

</template>

<script>
import http from "../../../utils/http";
export default {
    mounted(){
     console.log("init");
      let role = this.$store.state.user.role;
      this.role = role;
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
            handleQRDataCurrentPageChanged(val) {
        this.QRData.page = val;
        console.log("valChange" + val);
        this.loadDevice();
      },
      handleQRDataCurrentPageChanged() {
        console.log("hello");
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
                "/track/searchDetail",
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
        loadDevice() {
          console.log(this.role);
          console.log(sessionStorage['username']);
          if(this.role == 3){
            http.requestWithToken(
                "/track/areaDetail",
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
                "/track/detail",
                "post",
                { page: this.QRData.page, limit: 10, username: sessionStorage['username']},
                res => {
                this.QRData.list = res.data.Data;
                this.QRData.total = res.data.total;

                },
                () => {}
            );
          }else if(this.role == 2){
                http.requestWithToken(
                "/track/selectAll",
                "post",
                { page: this.QRData.page, limit: 10, username: sessionStorage['username'],adcode: this.city},
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
          value: 'LineName',
          label: '线路名称'
        }, 
         {
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
    name:'TrackDataDetail'
}
</script>

<style>
#statistics-tabs .el-table thead {
  color: black;
  font-weight: 500;
}
#statistics-tabs .el-table__header-wrapper table {
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
}
#statistics-tabs .el-table__body-wrapper {
  padding-bottom: 5px;
}
#statistics-tabs .el-table__body-wrapper table {
  border-bottom: 1px solid #000;
}
#statistics-tabs .el-table__body-wrapper tbody {
  border-top-color: white;
  border-bottom-color: white;
}
#statistics-tabs .el-table__body-wrapper tr {
  border-top-color: white;
  border-bottom-color: white;
}
</style>