<template>
  <div>
    <div id="tool-row">
      <div></div>
      <div>
        <!-- <el-button
          type="primary"
          @click="showQRDataInfoDialog"
          v-if="this.$store.state.user.role == 3"
        >添加</el-button> -->
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


        <el-button
          type="primary"
          @click="showAssignQRCodeDialog()"
          v-if="this.$store.state.user.role == 0"
        >分配二维码</el-button>

        <el-button
          type="primary"
          @click="showAssignQRCodeManagerDialog()"
          v-if="this.$store.state.user.role == 4"
        >分配项目二维码</el-button>

        <!-- <el-button
          type="primary"
          @click="showQRWorkerDialog()"
          v-if="this.$store.state.user.role == 0"
        >编辑二维码分配</el-button> -->
        <el-button type="primary" @click="handleDownloadID">ID下载</el-button>
        <el-button type="primary" @click="handleDownload">二维码下载</el-button>
      </div>
    </div>
    <div style="padding-top:5px">
      <el-table border :data="QRData.list" style="width: 100%" height="600">
        <el-table-column prop="id" label="id" align="center"></el-table-column>
        <el-table-column prop="province" label="省" align="center"></el-table-column>
        <el-table-column prop="city" label="市" align="center"></el-table-column>
        <el-table-column prop="area" label="县" align="center"></el-table-column>
        <el-table-column prop="customSerial" label="编号" align="center"></el-table-column>
         <el-table-column prop="project" label="项目归属" align="center"></el-table-column>
         <el-table-column prop="isManagerAssign" label="是否绑定" align="center"></el-table-column>

        <el-table-column
          prop="manager"
          label="管理员"
          align="center"
          v-if="this.$store.state.user.role == 3"
        ></el-table-column>
      </el-table>
    </div>
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
    <el-dialog title="编辑二维码分配" :visible.sync="QRWorkerDialog.visible">
      <el-tabs v-model="QRWorkerDialog.tabName">
        <el-tab-pane label="工人-设备关联" name="0">
          <div style="display:flex; justify-content: space-between;">
            <div>
              <el-form>
                <el-form-item label="工人" label-width="80px">
                  <el-select
                    v-model="QRWorkerDialog.workerSide.selectedWorker"
                    @change="workerSideLoadAssociatedDevices"
                  >
                    <el-option
                      v-for="item in QRWorkerDialog.workerSide.workerList"
                      :key="item.username"
                      :value="item.username"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
            <div>
              <el-transfer
                :titles="['可分配', '已分配']"
                :data="QRWorkerDialog.workerSide.deviceList"
                v-model="QRWorkerDialog.workerSide.selectedDevices"
              ></el-transfer>
            </div>
          </div>
        </el-tab-pane>

        <!-- 由于现在是工人与设备一对多，所以下面这个也去掉 -->
        <!-- <el-tab-pane label="设备-工人关联" name="1">
          <div style="display:flex; justify-content: space-between;">
            <div>
              <el-form>
                <el-form-item label="设备" label-width="80px">
                  <el-select>
                    <option
                      v-for="item in QRWorkerDialog.workerSide.workerList"
                      :key="item.username"
                      :value="item.username"
                    ></option>
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
            <div>
              <el-transfer :titles="['可分配', '已分配']"></el-transfer>
            </div>
          </div>
        </el-tab-pane>-->
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="QRWorkerDialog.visible = false">取 消</el-button> -->
        <el-button
          type="primary"
          @click.native.prevent="handleQRWorkerDialogSubmit"
          :loading="QRWorkerDialog.saving"
        >保 存</el-button>
      </div>
    </el-dialog>

    <!-- 添加二维码对话框 -->
    <el-dialog title="批量添加二维码" :visible.sync="QRDataInfoDialog.visible" width="30%">
      <div style="overflow-y: scroll; height: 300px">
        <el-table :data="QRDataInfoDialog.managerList">
          <el-table-column prop="username" label="管理员"></el-table-column>
          <el-table-column label="分配数量">
            <template slot-scope="scope">
              <el-input-number
                size="mini"
                v-model="QRDataInfoDialog.numList[scope.$index]"
                :min="0"
              ></el-input-number>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="QRDataInfoDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click.native.prevent="handleAddQRCodeDataSubmit"
        :loading="assignCode"
        >确 定</el-button>
      </div>
    </el-dialog>

    <!-- 为工人分配二维码对话框 -->
    <el-dialog title="分配二维码" :visible.sync="AssignQRCodeDialog.visible" width="60%">
      <div>当前ID前缀:{{toCompleteID}}</div>
      <div style="overflow-y: scroll; height: 300px;">
          <el-tag>起始ID:</el-tag>
          <el-input v-model="startID" placeholder="输入六位数字"></el-input>
          <el-tag>结束ID:</el-tag>
          <el-input v-model="endID" placeholder="输入六位数字"></el-input>
           <el-tag>代理商</el-tag>
           <el-select @change="proxyChange" v-model="proxyValue" placeholder="请选择">
            <el-option
            v-for="item in proxy"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
        <el-tag>市</el-tag>
        <el-select @change="cityChange" v-model="cityValue" placeholder="请选择">
            <el-option
            v-for="item in city"
            :key="item.code"
            :label="item.name"
            :value="item.code">
            </el-option>
        </el-select>
         <el-tag>县</el-tag>
          <el-select @change="areaChange" v-model="areaValue" placeholder="请选择">
            <el-option
            v-for="item in area"
            :key="item.code"
            :label="item.name"
            :value="item.code">
            </el-option>
        </el-select>
        <el-tag>应用项目</el-tag>
          <el-select @change="applicationChange" v-model="applicationValue" placeholder="请选择">
            <el-option
            v-for="item in application"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="AssignQRCodeDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click.native.prevent="handleAssignQRCodeDataSubmit"
        :loading="assignQRCode"
        >确 定</el-button>
      </div>
    </el-dialog>

        <el-dialog title="分配项目二维码" :visible.sync="AssignQRCodeManagerDialog.visible" width="60%">
      <div>当前可分配设备数量:{{AssignQRCodeDialog.availableNum}}</div>
      <div style="overflow-y: scroll; height: 300px;">
          <el-tag>起始ID:</el-tag>
          <el-input @change="managerStartIdChange" v-model="startID" placeholder="请输入内容"></el-input>
          <el-tag>结束ID:</el-tag>
          <el-input @change="managerEndIdChange" v-model="endID" placeholder="请输入内容"></el-input>
           <el-tag>ID数量</el-tag>
           <el-input :disabled="true" v-model="IDNum" placeholder="请输入内容"></el-input>
           <br/>
           <el-tag>应用项目</el-tag>
          <el-select @change="managerApplicationChange" v-model="applicationValue" placeholder="请选择">
            <el-option
            v-for="item in application"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
        <br/>
        <el-tag>区域</el-tag>
        <el-input v-model="customRegion" placeholder="请输入内容"></el-input>
        <el-tag>前缀</el-tag>
        <el-input v-model="prefix" placeholder="请输入内容"></el-input>
        <el-tag>起始编号</el-tag>
        <el-input @change="serialStartChange" v-model="serialStart" placeholder="请输入内容"></el-input>
        <el-tag>结束编号</el-tag>
        <el-input @change="serialEndChange" v-model="serialEnd" placeholder="请输入内容"></el-input>
        <el-tag>编号数量</el-tag>
        <el-input :disabled="true" v-model="serialNum" placeholder="请输入内容"></el-input>
        <el-button @click="verfiyNum">校验</el-button>
      </div>
          

      <div slot="footer" class="dialog-footer">
        <el-button @click="AssignQRCodeManagerDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click.native.prevent="handleAssignQRCodeByManager"
        :loading="assignQRCode"
        >确 定</el-button>
      </div>
    </el-dialog>




  </div>
</template>
<script>
import http from "../../../utils/http";
export default {
    name:'AdminQRManager',
  data() {
    return {
        options: [{
          value: 'id',
          label: '设备ID'
        }, {
          value: 'project',
          label: '项目归属'
        }, {
          value: 'province',
          label: '省份'
        }, {
          value: 'isManagerAssign',
          label: '绑定状态'
        }],
        value: '',
        input:'',
      isPass:'',
      customRegion:'',
      toCompleteID:'',
      prefix:'',
      serialStart:'',
      serialEnd:'',
      serialNum:'', 
      IDNum:'',
      proxyValue:'',
      cityValue:'',
      areaValue:'',
      applicationValue:'',
         proxy: [
        ],
        city: [

        ],
        area: [

        ],
        application: [
          {
          value: '1',
          label: '诱捕器管理'
        }, {
          value: '2',
          label: '注干剂监测'
        }, {
          value: '3',
          label: '药剂防治管理'
        },{
          value: '4',
          label: '天敌防治'
        }, {
          value: '5',
          label: '枯死树采伐'
        }, {
          value: '6',
          label: '轨迹追踪'
        }],

        value: '',
        startID:'',
        endID:'',
          assignCode: false,
          assignQRCode: false,
      // 为管理员生成二维码对话框
      QRDataInfoDialog: {
        visible: false,
        form: {
          num: 0,
          username: ""
        },
        managerList: [],
        numList: []
      },
      QRWorkerDialog: {
        tabName: "0",
        visible: false,
        saving: false,
        workerSide: {
          workerList: [],
          deviceList: [],
          selectedDevices: [],
          selectedWorker: ""
        },
        deviceSide: {
          workerList: [],
          deviceList: []
        }
      },
      // 分配二维码对话框
      AssignQRCodeDialog: {
        totalAvailableCount: 0,
        availableNum: 0,
        visible: false,
        workerList: [],
        numList: []
      },
        AssignQRCodeManagerDialog: {
        totalAvailableCount: 0,
        availableNum: 0,
        visible: false,
        workerList: [],
        numList: []
      },

      searchText: "",
      QRData: {
        selectedIndex: -1,
        list: [],
        page: 1,
        limit: 10,
        total: 0
      }
    };
  },
  methods: {
    query(){
      console.log(this.input);
      console.log(this.value);
      if(!this.input || !this.value){
        alert("请输入查询条件!!!")
      }else{
              http.requestWithToken(
          "/newQrCode/search",
          "get",
          { colName: this.value, searchText: this.input },
          res => {
            this.QRData.list = res.data.data;
            this.QRData.total = res.data.totalNum;

          },
          () => {}
        );
      }

    },
    managerApplicationChange(){
      console.log(this.applicationValue);
            http.requestWithToken(
        "/newQrCode/getMaxAvableCode",
        "get",
        { adcode: this.area,appVal:this.applicationValue},
        res => {
          console.log(res);
          if(res.data.error){
            this.startID = "没有可分配的=.=";
          }else{
          this.startID = res.data;
          }


        },
        () => {}
      );

    },
    applicationChange(){
      console.log(this.areaValue);
      console.log(this.applicationValue);
      var myDate = new Date();
      var tYear = myDate.getFullYear();
      console.log(tYear);
      var shortYear = tYear.toString().split("20");
      console.log(shortYear[1]);
      var toCompleteID = this.areaValue.toString() + shortYear[1].toString() + this.applicationValue.toString();
      console.log(toCompleteID);
      this.toCompleteID = toCompleteID;

    },
    handleAssignQRCodeByManager(){
      if(this.isPass){
      console.log(this.startID);
      console.log(this.endID);
      console.log(this.IDNum);
      console.log(this.applicationValue);
      console.log(this.customRegion);
      console.log(this.prefix);
      console.log(this.serialStart);
      console.log(this.serialEnd);
      console.log(this.serialNum);
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

            http.requestWithToken(
        "/newQrCode/assignCodeByManager",
        "get",
        {
           startID: this.startID,
           endID: this.endID,
           IDNum: this.IDNum,
           applicationValue: this.applicationValue,
           customRegion: this.customRegion,
           prefix: this.prefix,
           serialStart: this.serialStart,
           serialEnd: this.serialEnd,
           serialNum: this.serialNum,
           username: this.manager
           },
        res => {
          console.log(res);

        },
        () => {}
      );

      this.AssignQRCodeManagerDialog.visible = false;

      }else{
        this.$message.error("请修正后再确定");
      }

    },
    areaChange(){
      console.log(this.areaValue);


    },
    verfiyNum(){
      if(this.IDNum == this.serialNum){
        this.isPass = true;
         this.$message({
          message: '校验通过!',
          type: 'success'
        });

      }else{
        this.isPass = false;
        this.$message.error('数量错误');
      }
    },
    serialStartChange(){
      this.serialNum = this.serialEnd - this.serialStart + 1;
    },
    serialEndChange(){
      this.serialNum = this.serialEnd - this.serialStart + 1;
    },
    cityChange(e){
      console.log("cityChange",e);
      http.requestWithToken(
        "/auth_api/dist/areas",
        "get",
        { id: e},
        res => {
          console.log(res);
          this.area = res.data;

        },
        () => {}
      );

    },
    managerStartIdChange(){
      this.IDNum = this.endID - this.startID + 1;
    },
    managerEndIdChange(){
      this.IDNum = this.endID - this.startID + 1;
    },
    proxyChange(e){
      console.log("proxyChange",e);
      http.requestWithToken(
        "/auth_api/dist/cities",
        "get",
        { id: e},
        res => {
          console.log(res);
          this.city = res.data;
          console.log(this.city);

        },
        () => {}
      );

    },
    showAssignQRCodeManagerDialog(){
      this.AssignQRCodeManagerDialog.visible = true;
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


    },
    // 下载
    handleDownload() {
      let BASE_URL = "";
      if (window.location.toString().indexOf("106.15.90.78") > -1) {
        BASE_URL = "http://106.15.90.78:8081";
      } else {
        BASE_URL = "http://localhost:8081";
      }
      window.location = BASE_URL + "/QRCode?token=" + sessionStorage['token'] 
    },
    handleDownloadID() {
          window.location =
                      http.getBaseUrl() +
                      "/export/QRCodeList?adcode=" +
                      this.area +
                      "&token=" +
                      sessionStorage["token"];
        },
    showQRDataInfoDialog() {
      this.QRDataInfoDialog.visible = true;
      this.loadManagers();
    },
    loadCanDevices() {
          this.QRWorkerDialog.workerSide.deviceList = [];

              http.requestWithToken(
                "/auth_api/device_can_associate",
                "get",
                {},
                res => {
                  this.QRWorkerDialog.workerSide.deviceList = [];
                  for (let i = 0; i < res.data.data.length; ++i) {
                    this.QRWorkerDialog.workerSide.deviceList.push({
                      key: res.data.data[i],
                      label: res.data.data[i]
                    });
                  }
                  for (
                    let i = 0;
                    i < this.QRWorkerDialog.workerSide.selectedDevices.length;
                    ++i
                  ) {
                    this.QRWorkerDialog.workerSide.deviceList.push({
                      key: this.QRWorkerDialog.workerSide.selectedDevices[i],
                      label: this.QRWorkerDialog.workerSide.selectedDevices[i]
                    });
                  }
                },
                () => {}
              );

        },
    loadDevice() {
      http.requestWithToken(
        "/auth_api/device_list",
        "get",
        { page: this.QRData.page, limit: this.QRData.limit,
        isMap:false },
        res => {
          console.log(res.data)
          this.QRData.list = res.data.data;
          this.QRData.total = res.data.totalNum;

        },
        () => {}
      );
    },
    loadManagers() {
      http.requestWithToken(
        "/auth_api/user_list",
        "get",
        { roleType: 4, page: this.QRData.page, limit: this.QRData.limit, searchText: "" },
        res => {
          this.QRDataInfoDialog.managerList = res.data.data;
          this.QRDataInfoDialog.numList = [];
          for (let i = 0; i < res.data.data.length; ++i) {
            this.QRDataInfoDialog.numList[i] = 0;
          }
        },
        () => {}
      );
    },
    handleQRDataCurrentPageChanged(val) {
      this.QRData.page = val;
      this.loadDevice();
    },
    handleAddQRCodeDataSubmit() {
      let data = [];
      this.assignCode=true;
      for (let i = 0; i < this.QRDataInfoDialog.managerList.length; ++i) {
        data.push({
          username: this.QRDataInfoDialog.managerList[i].username,
          num: this.QRDataInfoDialog.numList[i]
        });
      }
      http.requestWithTokenJson(
        "/auth_api/QRcode",
        "post",
        data,
        res => {
          if (!res.data.error) {
          this.assignCode=false;
            alert("成功");

          }
          this.assignCode=false;
          this.loadDevice();
          this.QRDataInfoDialog.visible = false;
        },
        () => {}
      );

    },
    handleQRDataCurrentPageChanged() {
      this.loadDevice();
    },
    // 分配二维码对话框
    showQRWorkerDialog() {
      this.QRWorkerDialog.visible = true;
      // this.workerSideLoadDevices();

      // 清空根据工人分配的
      this.QRWorkerDialog.workerSide.selectedWorker = "";
      this.QRWorkerDialog.workerSide.selectedDevices = [];
      this.workerSideLoadWorkerList();
      this.loadCanDevices()
    },

    // 编辑工人-诱捕器加载诱捕器
    workerSideLoadAssociatedDevices() {
      this.QRWorkerDialog.workerSide.deviceList = [];
      http.requestWithToken(
        "/auth_api/device_relation",
        "get",
        { worker: this.QRWorkerDialog.workerSide.selectedWorker },
        res => {
          this.QRWorkerDialog.workerSide.selectedDevices = res.data.data;
          http.requestWithToken(
            "/auth_api/device_can_associate",
            "get",
            {},
            res => {
              this.QRWorkerDialog.workerSide.deviceList = [];
              for (let i = 0; i < res.data.data.length; ++i) {
                this.QRWorkerDialog.workerSide.deviceList.push({
                  key: res.data.data[i],
                  label: res.data.data[i]
                });
              }
              for (
                let i = 0;
                i < this.QRWorkerDialog.workerSide.selectedDevices.length;
                ++i
              ) {
                this.QRWorkerDialog.workerSide.deviceList.push({
                  key: this.QRWorkerDialog.workerSide.selectedDevices[i],
                  label: this.QRWorkerDialog.workerSide.selectedDevices[i]
                });
              }
            },
            () => {}
          );
        },
        () => {}
      );
    },
    workerSideLoadWorkerList() {
      http.requestWithToken(
        "/auth_api/user_list",
        "get",
        { page: 1, limit: 9999, searchText: "" },
        res => {
          this.QRWorkerDialog.workerSide.workerList = res.data.data;
        },
        () => {}
      );
    },
    handleQRWorkerDialogSubmit() {
      console.log(this.QRWorkerDialog.workerSide.selectedDevices);
      let myWorker=this.QRWorkerDialog.workerSide.selectedWorker;
      if(myWorker==null || myWorker==""){
            alert("请先选择用户");
      }
      else if (this.QRWorkerDialog.tabName == "0" && myWorker!=null && myWorker!="") {
        this.QRWorkerDialog.saving = true;
        http.requestWithTokenJson(
          "/auth_api/device_relation",
          "put",
          {
            deviceIds: this.QRWorkerDialog.workerSide.selectedDevices,
            userId: this.QRWorkerDialog.workerSide.selectedWorker
          },
          res => {
            this.$message({
              message: "保存成功",
              type: "success"
            });
            this.QRWorkerDialog.saving = false;
          },
          () => {}
        );
      }
    },
    // 分配二维码对话框
    showAssignQRCodeDialog() {
      this.AssignQRCodeDialog.visible = true;
      // 加载工人列表
        http.requestWithTokenJson(
          "/newQrCode/getProxy",
          "get",
          {

          },
          res => {
            console.log(res);
            this.proxy = res.data.Data;
          },
          () => {}
        );


    },
    handleAssiagnQRCodeNumChange(index) {
      // 这里计算当前可分配的数量
      let sum = 0;
      for (let i = 0; i < this.AssignQRCodeDialog.numList.length; ++i) {
        sum += this.AssignQRCodeDialog.numList[i];
      }
      let currentAvailable = this.AssignQRCodeDialog.totalAvailableCount - sum;
      // 如果可分配数量小于0
      if (currentAvailable < 0) {
        let tmp = this.AssignQRCodeDialog.numList[index] + currentAvailable;
        let sum = 0;
        for (let i = 0; i < this.AssignQRCodeDialog.numList.length; ++i) {
          if (i != index) sum += this.AssignQRCodeDialog.numList[i];
          else sum += tmp;
        }
        this.AssignQRCodeDialog.availableNum =
          this.AssignQRCodeDialog.totalAvailableCount - sum;
        console.log(
          "now:" +
            tmp +
            " available:" +
            this.AssignQRCodeDialog.availableNum +
            "sum:" +
            sum
        );
        this.$nextTick(() => {
          this.$set(this.AssignQRCodeDialog.numList, index, tmp);
          // console.log(this.$refs["AssignQRCodeInputNumber" + index]);
        });
        // this.$forceUpdate();
      } else {
        this.AssignQRCodeDialog.availableNum = currentAvailable;
      }
    },
    handleAssignQRCodeDataSubmit() {
      console.log("确定");
      console.log(this.startID);
      console.log(this.endID);
      console.log(this.proxyValue);
      console.log(this.cityValue);
      console.log(this.areaValue);
      console.log(this.applicationValue);

        http.requestWithToken(
        "/newQrCode/assignQRCode",
        "get",
        { 
          proxyCode: this.proxyValue,
          cityCode: this.cityValue,
          areaCode: this.areaValue,
          projectCode: this.applicationValue,
          startID: this.toCompleteID + this.startID,
          endID: this.toCompleteID + this.endID
          },
        res => {
          console.log(res);
          this.area = res.data.Data;
          this.AssignQRCodeDialog.visible = false;
        },
        () => {}
      );

    }
  },
  mounted() {
    console.log(this.$store.state.user.role);
    this.loadDevice();
  }
};
</script>
<style>
#tool-row {
  display: flex;
  justify-content: space-between;
}
#userInfoDialogData {
  display: flex;
  justify-content: space-around;
}
</style>


