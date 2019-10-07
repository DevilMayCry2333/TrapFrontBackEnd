<template>
  <div>
    <span style="font-size: 14px">搜索条件:</span>
    <el-date-picker v-model="DryWatchData.startDate" type="date" value-format="yyyy-MM-dd"
                    placeholder="起始日期"></el-date-picker>
    <el-date-picker v-model="DryWatchData.endDate" type="date" value-format="yyyy-MM-dd"
                    placeholder="终止日期"></el-date-picker>
    <div style="margin-top: 10px; margin-left: 60px">
      <el-select v-if="this.$store.state.user.role==3" placeholder="编号/区域/批次/施工人员" v-model="selected">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <span style="font-size: 14px; margin-left: 14px">搜索内容:</span>
      <el-input style="width: 200px" placeholder="搜索内容" v-model="searchText"></el-input>
      <el-button type="primary" @click="handleSubmit">搜索</el-button>

              <el-button type="primary" @click="exportExcel">导出</el-button>
        <!--<el-button type="primary" @click="someExportExcel">批量导出</el-button>-->

        <!--<el-button type="primary" @click="importExcel(scope.$index)">导入</el-button>-->
        <el-upload  class="upload-demo" ref="upload"
        :action="uploadUrl"
        :on-success="loadMaintenanceData">
          <el-button type="primary" >点击上传</el-button>
        </el-upload>

    </div>
    <el-table border :data="DryWatchData.list" style="width: 100%" height="600">
      <el-table-column prop="deviceId" label="设备ID" align="center"></el-table-column>
      <el-table-column prop="serial" label="编号" align="center"></el-table-column>
      <el-table-column prop="region" label="所属区域" align="center"></el-table-column>
      <el-table-column prop="submitDate" label="日期" align="center"></el-table-column>
      <el-table-column prop="batch" label="批次" align="center"></el-table-column>
      <el-table-column prop="longitude" label="经度" align="center"></el-table-column>
      <el-table-column prop="latitude" label="纬度" align="center"></el-table-column>
      <el-table-column prop="workContent" label="工作内容" align="center"></el-table-column>
      <el-table-column prop="injectionNum" label="注剂数量" align="center"></el-table-column>
      <el-table-column prop="woodStatus" label="树木状态" align="center"></el-table-column>
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
        v-if="this.$store.state.user.role === 3"
      ></el-table-column>
    </el-table>
        <el-dialog title="现场照片" :visible.sync="PhotoDialog.visible" width="700px">
      <div style="overflow-y:scroll;height: 300px">
        <img v-bind:src="PhotoDialog.pic" style="width: 600px; ">
      </div>
    </el-dialog>

    <div class="block">
      <el-pagination
        background
        @current-change="handleDataCurrentPageChanged"
        :current-page.sync="DryWatchData.page"
        :page-size="10"
        layout="total, prev, pager, next"
        :total="DryWatchData.total"
      ></el-pagination>
    </div>
  </div>


</template>

<script>
  import http from "../../../utils/http";

  export default {
    mounted() {
      this.loadDevice();
    },
    methods: {
      exportExcel(){
        console.log("导出");
      },
      loadMaintenanceData(){
        alert("请手动刷新");
      },
          showPhotoDialog(id) {
            console.log(id);
      this.PhotoDialog.visible = true;
     // let BASE_URL = "http://47.103.66.70:8081";
    let BASE_URL = "http://106.15.90.78:8081";
      this.PhotoDialog.pic = BASE_URL + "/device_img?imgName=" + id;
    },
    
      handleDataCurrentPageChanged(val) {
        this.DryWatchData.page = val;
        this.loadDevice();
      },
      handleSubmit() {
        console.log(this.selected);
        this.loadDevice()
      },
      loadDevice() {
        http.requestWithToken(
          "/dryWatch/dataDetail",
          "post",
          {
            page: this.DryWatchData.page,
            limit: 10,
            optionIndex: this.selected,
            searchText: this.searchText,
            startDate: this.DryWatchData.startDate,
            endDate: this.DryWatchData.endDate
          },
          res => {
            this.DryWatchData.list = res.data.data.data;
            this.DryWatchData.total = res.data.data.totalNum;
            this.DryWatchData.page = res.data.data.currentPage;
            // this.DryWatchData.optionIndex = -1;
          },
          () => {
          }
        )
      }
    },
    data() {
      return {
        searchText: '',
      PhotoDialog: {
        visible: false,
        pic: ""
      },
        options: [{
          value: 1,
          label: '编号'
        }, {
          value: 2,
          label: '区域'
        }, {
          value: 3,
          label: '批次'
        }, {
          value: 4,
          label: '施工人员'
        }],
        selected: '',
        DryWatchData: {
          // optionIndex: -1,
          list: [],
          page: 1,
          limit: 10,
          startDate: '',
          endDate: '',
          total: 0,
        }
      }
    },
    // name: '注干剂检测'
  }
</script>

<style>

</style>
