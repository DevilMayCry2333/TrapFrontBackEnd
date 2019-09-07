<template>
<div>
          <el-table border :data="QRData.list" style="width: 100%" height="600">
        <el-table-column prop="deviceId" label="设备ID" align="center"></el-table-column>
        <el-table-column prop="serial" label="编号" align="center"></el-table-column>
        <el-table-column prop="region" label="所属区域" align="center"></el-table-column>
        <el-table-column prop="submitDate" label="日期" align="center"></el-table-column>
        <el-table-column prop="batch" label="批次" align="center"></el-table-column>
        <el-table-column prop="longitude" label="经度" align="center"></el-table-column>
        <el-table-column prop="latitude" label="纬度" align="center"></el-table-column>
        <el-table-column prop="wooddiameter" label="桩径m" align="center"></el-table-column>
        <el-table-column prop="woodheight" label="树高m" align="center"></el-table-column>
        <el-table-column prop="woodvolume" label="材积m^3" align="center"></el-table-column>
        <el-table-column prop="pic" label="照片" align="center"></el-table-column>
        <el-table-column prop="killmethod" label="除害方式" align="center"></el-table-column>
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
            "/deadTree/detail",
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
    name:'DeadTreesDataDetail'
}
</script>

<style>

</style>