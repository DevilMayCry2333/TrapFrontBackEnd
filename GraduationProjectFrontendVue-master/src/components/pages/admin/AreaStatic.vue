<template>
  <div>
    <!--el-select placeholder="省" v-if="this.$store.state.user.role == 1"></el-select-->

    <el-select
      placeholder="市"
      v-if="this.$store.state.user.role < 2 && showCity"
      v-model="city"
      @change="cityChanged"
    >
      <el-option value>全部</el-option>
      <el-option v-for="item in cities" :value="item.code" :key="item.code" :label="item.name"></el-option>
    </el-select>
    <el-select
      placeholder="县"
      v-if="this.$store.state.user.role < 3 && showArea"
      v-model="area"
      @change="areaChanged()"
    >
      <el-option value>全部</el-option>
      <el-option v-for="item in areas" :value="item.code" :key="item.code" :label="item.name"></el-option>
    </el-select>

    <el-date-picker v-model="startYear" type="date" value-format="yyyy-MM-dd" placeholder="起始日期"></el-date-picker>
    <el-date-picker v-model="endYear" type="date" value-format="yyyy-MM-dd" placeholder="终止日期"></el-date-picker>

    <el-button type="primary" @click="query()" >查询</el-button>

    <el-card style="padding: 5px">
      <div style="width: 100%;height:300px;" ref="echartsArea"></div>
    </el-card>

    <el-card style="padding: 5px">
      <div style="width: 100%;height:300px;" ref="echartsAreaOne"></div>
    </el-card>

  </div>
</template>
<script>
import http from "../../../utils/http";
import echarts from "echarts";
export default {
  data() {
    return {
      showCity: true,
      showArea: true,
      provincesname: [],
      provincename: "",
      cityname: "",
      areaname: "",
      citiesname: [],
      areasname: [],
      provinces: [],
      province: "",
      provincename: "",
      cities: [],
      city: "",
      areas: [],
      area: "",
      towns: [],
      town: "",
      managers: [],
      manager: "",
      startDate: "",
      endDate: "",
      contentLabelDict: ["市", "县", "乡镇", "工人"],
      contentLabelIndex: 0,
      myarea: "",
      summaryList: [],
      analysisList: [],
      mcList: [],
      tabPage: "first",
      mcType: "0",
      startYear: "",
      endYear: "",
      apptitle : '折柱混合',
        option : {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    }
                }
            },
            toolbox: {
                feature: {
                    dataView: {show: true, readOnly: false},
                    magicType: {show: true, type: ['line', 'bar']},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            legend: {
                data:['松墨天牛','其它天牛']
            },
            xAxis: [
                {
                    type: 'category',
                    data: [],
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '天牛数量(只)',
                    min: 0,
                    axisLabel: {
                        formatter: '{value}'
                    }
                },
                // {
                //     type: 'value',
                //     name: '平均诱虫量(只)',
                //     min: 0,
                //     max: 150,
                //     interval: 50,
                //     axisLabel: {
                //         formatter: '{value}'
                //     }
                // }
            ],
            series: [
                {
                    name:'松墨天牛',
                    type:'bar',
                    data:[]
                },
                {
                    name:'其它天牛',
                    type:'bar',
                    data:[]
                },
                // {
                //     name:'平均诱虫量',
                //     type:'line',
                //     yAxisIndex: 1,
                //     data:[]
                // },
                // {
                //     name:'其他天牛平均诱虫量',
                //     type:'line',
                //     yAxisIndex: 1,
                //     data:[]
                // }
            ]
        },
        
    option2 : {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            crossStyle: {
                color: '#999'
            }
        }
    },
    xAxis: [
      {
        type: 'category',
        data: [],
        axisPointer:
         {
          type: 'shadow'
        }
    }],
    toolbox: {
        feature: {
            dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'bar']},
            restore: {show: true},
            saveAsImage: {show: true}
        }
    },
    legend: {
                data:['松墨天牛平均诱虫量','其它天牛平均诱虫量']
            },
    yAxis: [{
        type: 'value',
        name: '天牛数量(只)',
         min: 0,
        max: 150,
        interval: 50,
        axisLabel: {
        formatter: '{value}'
        }
    }],
    series: [
    {
      name: '松墨天牛平均诱虫量',
      data: [],
      type: 'line',
    },
    {
      name: '其它天牛平均诱虫量',
      data: [],
      type: 'line',
    }
    ]
},
    };

  },
  

  
  
  methods: {
    init() {
      this.showCity = true;
      this.showArea = true;

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
    },
    query(){
         
         

      this.option.xAxis[0].data =[];
      this.option.series[0].data = [];
       this.option.series[1].data = [];
      //  this.option.series[2].data = [];
      //  this.option.series[3].data = [];
       //第二个图标
        this.option2.xAxis[0].data = [];
        this.option2.series[0].data = [];
        this.option2.series[1].data = [];


         

    http.requestWithToken(
        "/statics/area",
        "get",
        {
            ProjectAdminName:this.manager,
            startDate:this.startYear,
            endDate:this.endYear
        },
        res => {
             
    
            for(var i = 0 ; i < res.data.length; i++){
                 
                this.option.xAxis[0].data.push(res.data[i].customTown);
                this.option.series[0].data.push(res.data[i].beetlesNum);
                this.option.series[1].data.push(res.data[i].otherNum);
                // this.option.series[2].data.push(res.data[i].avager);
                // this.option.series[3].data.push(res.data[i].avagerother);
                //第二个图表
                this.option2.xAxis[0].data.push(res.data[i].customTown);
                this.option2.series[0].data.push(res.data[i].avager);
                this.option2.series[1].data.push(res.data[i].avagerother);
                //Mgh9nigujiOwZO5HFNkCoQ==
            }
                    let myChart = echarts.init(this.$refs.echartsArea);
                    let myChart1 = echarts.init(this.$refs.echartsAreaOne);
                    myChart.setOption(this.option);
                    myChart1.setOption(this.option2);
        },
        () => {}
      );




    }
  },
  mounted() {
    this.init();
        http.requestWithToken(
        "/statics/area",
        "get",
        {
            ProjectAdminName:this.manager
        },
        res => {
             
            for(var i = 0 ; i < res.data.length; i++){
                 
                this.option.xAxis[0].data.push(res.data[i].customTown);
                this.option.series[0].data.push(res.data[i].beetlesNum);
                this.option.series[1].data.push(res.data[i].otherNum);
                // this.option.series[2].data.push(res.data[i].avager);
                // this.option.series[3].data.push(res.data[i].avagerother);
                //第二个图表
                this.option2.xAxis[0].data.push(res.data[i].customTown);
                this.option2.series[0].data.push(res.data[i].avager);
                this.option2.series[1].data.push(res.data[i].avagerother);
                //Mgh9nigujiOwZO5HFNkCoQ==
            }
                    let myChart = echarts.init(this.$refs.echartsArea);
                    let mychart1 = echarts.init(this.$refs.echartsAreaOne);
                    myChart.setOption(this.option);
                    mychart1.setOption(this.option2);
                    
        },
        () => {}
      );

  }
};
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


