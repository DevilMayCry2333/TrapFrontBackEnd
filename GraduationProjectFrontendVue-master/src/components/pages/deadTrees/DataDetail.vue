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
        <el-upload ref="upload"
        :action="uploadUrl"
        :on-success="loadMaintenanceData">
          <el-button type="primary" >点击上传</el-button>
        </el-upload>


          <el-table border :data="QRData.list" style="width: 100%" height="600">
        <el-table-column prop="deviceId" label="设备ID" align="center"></el-table-column>
        <el-table-column prop="serial" label="编号" align="center"></el-table-column>
        <el-table-column prop="customTown" label="所属区域" align="center"></el-table-column>
        <el-table-column prop="submitDate" label="日期" align="center"></el-table-column>
        <el-table-column prop="batch" label="批次" align="center"></el-table-column>
        <el-table-column prop="longitude" label="经度" align="center"></el-table-column>
        <el-table-column prop="latitude" label="纬度" align="center"></el-table-column>
        <el-table-column prop="wooddiameter" label="桩径m" align="center"></el-table-column>
        <el-table-column prop="woodheight" label="树高m" align="center"></el-table-column>
        <el-table-column prop="woodvolume" label="材积m^3" align="center"></el-table-column>
        <el-table-column prop="pic" label="照片" align="center">
                  <template slot-scope="scope">
            <el-button
              @click="showPhotoDialog(scope.row.pic)"
              v-if="scope.row.pic != null && scope.row.pic !=''"
              size="mini"
            >显示</el-button>
          </template>

        </el-table-column>
        <el-table-column prop="killmethod" label="除害方式" align="center"></el-table-column>
        <el-table-column prop="worker" label="施工人员" align="center"></el-table-column>
        <el-table-column prop="remarks" label="备注" align="center"></el-table-column>
        <el-table-column
          prop="username"
          label="管理员"
          align="center"
          v-if="this.$store.state.user.role == 3"
        ></el-table-column>

                <el-table-column
          label="操作"
          align="center"
          width="150px"
          fixed="right"
          v-if="this.$store.state.user.role == 3 || this.$store.state.user.role == 4"
        >
          <template slot-scope="scope">
            <div v-if="!scope.row.reported">
              <el-button
                size="mini"
                type="primary"
                @click="showEditMaintenanceDataDialog(scope.row)"
                v-if="!scope.row.reported"
              >编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row)"
                v-if="!scope.row.reported"
              >删除</el-button>
            </div>
            <div v-if="scope.row.reported">不可操作</div>
          </template>
        </el-table-column>
        


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

        采伐数量:{{totalCutNum}} &nbsp;
        施工天数:{{totalWorkDay}} &nbsp;
        材积:{{totalWoodVolume}}


        </div>
                <el-dialog title="现场照片" :visible.sync="PhotoDialog.visible" width="700px">
      <div style="overflow-y:scroll;height: 300px">
        <img v-bind:src="PhotoDialog.pic" style="width: 600px; ">
      </div>
    </el-dialog>

            <el-dialog title="编辑维护信息" :visible.sync="EditMaintenanceDialog.visible" width="30%">
      <el-form label-width="120px">
        <el-form-item label="经度">
          <el-input  v-model="EditMaintenanceDialog.form.longitude"></el-input>
        </el-form-item>
        <el-form-item label="纬度">
          <el-input v-model="EditMaintenanceDialog.form.latitude"></el-input>
        </el-form-item>
        <!-- <el-form-item label="设备ID">
          <el-input v-model="EditMaintenanceDialog.form.deviceId"></el-input>
        </el-form-item>

        <el-form-item label="编号">
          <el-input v-model="EditMaintenanceDialog.form.serial"></el-input>
        </el-form-item>
        <el-form-item label="区域">
          <el-input v-model="EditMaintenanceDialog.form.customTown"></el-input>
        </el-form-item> -->
        <el-form-item label="日期">
          <el-input v-model="EditMaintenanceDialog.form.submitDate"></el-input>
        </el-form-item>
        <el-form-item label="批次">
          <el-input v-model="EditMaintenanceDialog.form.batch"></el-input>
        </el-form-item>
        <el-form-item label="桩径">
          <el-input @change="wooddiameterInput" v-model="EditMaintenanceDialog.form.wooddiameter"></el-input>
        </el-form-item>
        <el-form-item label="树高">
          <el-input @change="woodheightInput" v-model="EditMaintenanceDialog.form.woodheight"></el-input>
        </el-form-item>
        <el-form-item label="材积">
          <el-input v-model="EditMaintenanceDialog.form.woodvolume"></el-input>
        </el-form-item>
        <el-form-item label="除害方式">
          <el-input v-model="EditMaintenanceDialog.form.killmethod"></el-input>
        </el-form-item>
        <el-form-item label="施工人员">
          <el-input v-model="EditMaintenanceDialog.form.worker"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="EditMaintenanceDialog.form.remarks"></el-input>
        </el-form-item>





      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="EditMaintenanceDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click.native.prevent="handleEditMaintenanceDataSubmit">确 定</el-button>
      </div>
    </el-dialog>


</div>


</template>

<script>
import http from "../../../utils/http";
export default {
    mounted(){
          this.uploadUrl =
              http.getBaseUrl() +
              "/deadTree/importExcel?token=" +
              sessionStorage["token"];

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

      wooddiameterInput(){
        console.log(this.EditMaintenanceDialog.form.wooddiameter);
        var tmp = 0.714265437 * 0.0001 * Math.pow(this.EditMaintenanceDialog.form.wooddiameter * 0.7, 1.867010) * Math.pow(this.EditMaintenanceDialog.form.woodheight, 0.9014632);
        this.EditMaintenanceDialog.form.woodvolume = tmp;
        console.log(this.EditMaintenanceDialog.form.woodvolume.toString());

      },

      woodheightInput(){
        console.log(this.EditMaintenanceDialog.form.woodheight);
        var tmp = 0.714265437 * 0.0001 * Math.pow(this.EditMaintenanceDialog.form.wooddiameter * 0.7, 1.867010) * Math.pow(this.EditMaintenanceDialog.form.woodheight, 0.9014632);
        this.EditMaintenanceDialog.form.woodvolume = tmp;
        console.log(this.EditMaintenanceDialog.form.woodvolume.toString());
      },
      handleEditMaintenanceDataSubmit(){
         console.log(this.EditMaintenanceDialog.form);
                       http.requestWithTokenJson(
        "/deadTree/updateRec",
        "post",
        this.EditMaintenanceDialog.form,
        res => {
          this.$message.success("修改成功");
          this.EditMaintenanceDialog.visible = false;
          this.loadMaintenanceData();
        },
        () => {}
      );

      },
            handleDelete(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {

          http.requestWithToken(
            "/app/DeleteById",
            "post",
            {
              id: row.id,
              deviceID: row.deviceId
            },
            res => {
              if (!res.data.error) {
                this.loadDevice();
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.clearMultipleSelection();
              } else {
                this.$message({
                  type: "error",
                  message: "删除失败!"
                });
              }
            },
            () => {}
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
      this.loadDevice();
    },
          showEditMaintenanceDataDialog(data) {
            console.log("编辑");
            console.log(data);
      this.EditMaintenanceDialog.visible = true;
      this.EditMaintenanceDialog.form = {
        otherType: "",
        longitude: "",
        latitude: "",
        batch:0,
        deviceId:"",
        
        id:"",
        serial:"",
        customTown:"",
        submitDate:"",
        wooddiameter:"",
        woodheight:"",
        woodvolume:"",
        killmethod:"",
        remarks:"",
        worker:""
      };
      this.EditMaintenanceDialog.form.id = data.id;
      this.EditMaintenanceDialog.form.longitude = data.longitude;
      this.EditMaintenanceDialog.form.deviceId = data.deviceId;
      this.EditMaintenanceDialog.form.batch = data.batch;
      this.EditMaintenanceDialog.form.latitude = data.latitude;

      this.EditMaintenanceDialog.form.serial = data.serial;
      this.EditMaintenanceDialog.form.customTown = data.customTown;
      this.EditMaintenanceDialog.form.submitDate = data.submitDate;
      this.EditMaintenanceDialog.form.wooddiameter = data.wooddiameter;
      this.EditMaintenanceDialog.form.woodheight = data.woodheight;
      this.EditMaintenanceDialog.form.woodvolume = data.woodvolume;
      this.EditMaintenanceDialog.form.killmethod = data.killmethod;
      this.EditMaintenanceDialog.form.remarks = data.remarks;
      this.EditMaintenanceDialog.form.worker = data.worker;

    },
      loadMaintenanceData(){
        alert("请手动刷新~");
      },
      exportExcel(){
                let role = this.$store.state.user.role;
          console.log(role);
            console.log(this.area);
            console.log(this.city);
              console.log(this.province);
        console.log(http.getBaseUrl());

        setTimeout(()=>{
                  window.location =
        http.getBaseUrl() +
        "/deadTree/exportExcel?startDate=" +
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
      handleQRDataCurrentPageChanged(val) {
        this.QRData.page = val;
        console.log("valChange" + val);
        this.loadDevice();
      },
                showPhotoDialog(id) {
            console.log(id);
      this.PhotoDialog.visible = true;
     // let BASE_URL = "http://47.103.66.70:8081";
    let BASE_URL = "http://106.15.90.78:8081";
      this.PhotoDialog.pic = BASE_URL + "/device_img?imgName=" + id;
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
                "/deadTree/searchDetail",
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
                this.QRData.list = res.data.data;
                this.QRData.total = res.data.totalNum;

                this.totalWorkDay = res.data.WorkDay;
                this.totalCutNum = res.data.woodNum;
                this.totalWoodVolume = res.data.woodVolume;



                },
                () => {}
            );

          // }

      },
      loadDevice() {
          console.log(sessionStorage['username']);
          
          if(this.role == 3){
            http.requestWithToken(
                "/deadTree/areaDetail",
                "post",
                { page: this.QRData.page, limit: 10, username: sessionStorage['username']},
                res => {
                this.QRData.list = res.data.data;
                this.QRData.total = res.data.totalNum;

                },
                () => {}
            );
          }else if(this.role == 4){
              http.requestWithToken(
                "/deadTree/searchDetail",
                "post",
                { page: this.QRData.page, limit: 10, username: sessionStorage['username'],
                                  startDate: this.startDate,
                  endDate: this.endDate,
                  colName: this.value,
                  searchText: this.input,
                  adcode: this.area
                },
                res => {
                this.QRData.list = res.data.data;
                this.QRData.total = res.data.totalNum;

                },
                () => {}
            );

          }else if(this.role==2 || this.role==1){
              http.requestWithToken(
                "/deadTree/selectAll",
                "post",
                { page: this.QRData.page, limit: 10, username: sessionStorage['username'],adcode:this.city},
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
                EditMaintenanceDialog: {
        visible: false,
        totalWoodVolume:0,
        totalWorkDay:0,
        totalCutNum:0,
        form: {
          id: 0,
          batch:0,
          num: 0,
          otherNum: 0,
          otherType: "",
          longitude: "",
          latitude: "",
          altitude:"",
          workingContent: 0,
          deviceId:"",
          drug: ""
        }
      },
        role: '',
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
          value: 'CustomSerial',
          label: '编号'
        }, {
          value: 'CustomTown',
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
    name:'DeadTreesDataDetail'
}
</script>

<style>

</style>