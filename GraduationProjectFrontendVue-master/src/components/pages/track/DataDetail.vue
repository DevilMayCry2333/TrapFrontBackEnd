<template>
<div>
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
        this.loadDevice();
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

        loadDevice() {
          console.log(sessionStorage['username']);
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
        },
    },
    data(){
        return{
        QRData: {
            selectedIndex: -1,
            list: [],
            page: 1,
            limit: 10,
            total: 0
        }

        }
    },
    name:'TrackDataDetail'
}
</script>

<style>

</style>