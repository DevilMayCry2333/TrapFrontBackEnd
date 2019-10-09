import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import home from '@/components/Home'
import UserMgr from '@/components/pages/UserMgr'
import MonthSummary from '@/components/pages/MonthSummary'
import DeviceMap from '@/components/pages/DeviceMap'
import QRCodeMgr from '@/components/pages/QRCodeMgr'
import MaintenanceData from '@/components/pages/MaintenanceData'
import MaintenanceDataAbnormal from '@/components/pages/MaintenanceDataAbnormal'
import Statistics from "@/components/pages/Statistics";
import OtherBeetle from "@/components/pages/OtherBeetle"
import WeatherInfo from '@/components/pages/WeatherInfo'
import DeviceSummary from '@/components/pages/DeviceSummary'
import MapStatistics from '@/components/pages/MapStatistics'
import DeviceMessage from '@/components/pages/DeviceMessage'
import DeviceWanted from '@/components/pages/DeviceWanted'
import Test from '@/components/pages/Test'
import DryWatchDataDetail from '@/components/pages/drywatch/DataDetail'
import NaturalEnemiesDataDetail from '@/components/pages/naturalEnemies/DataDetail'
import DeadTreeDataDetail from '@/components/pages/deadTrees/DataDetail'
import TrackDataDetail from '@/components/pages/track/DataDetail'
import DryWatchDataSummary from '@/components/pages/drywatch/DataSummary'
import TrackDataSummary from '@/components/pages/track/DataSummary'
import DryWatchMaintanceData from '@/components/pages/drywatch/DryWatchMaintanceData'
import DryWatchDeviceMessage from '@/components/pages/drywatch/DryWatchDeviceMessage'
import DryWatchDeviceWanted from '@/components/pages/drywatch/DryWatchDeviceWanted'
import NaturalEnemiesDataSummary from '@/components/pages/naturalEnemies/DataSummary'
import NaturalMaintanceData from '@/components/pages/naturalEnemies/NaturalMaintanceData'
import NaturalDeviceMessage from '@/components/pages/naturalEnemies/NaturalDeviceMessage'
import NaturalDeviceWanted from '@/components/pages/naturalEnemies/NaturalDeviceWanted'
import DryWatchDeviceMap from '@/components/pages/drywatch/DryWatchDeviceMap'
import NaturalDeviceMap from '@/components/pages/naturalEnemies/NaturalDeviceMap'
import DeadTreeDeviceMap from '@/components/pages/deadTrees/DeadTreeDeviceMap'
import TrackDeviceMap from '@/components/pages/track/TrackDeviceMap'
import AdminQRManager from '@/components/pages/admin/AdminQRManager'
import SummaryByReigon from '@/components/pages/drywatch/SummaryByReigon'
import TrapWorkContent from '@/components/pages/admin/TrapWorkContent'
import TrapInjectType from '@/components/pages/admin/TrapInjectType'
import InjectWoodStatus from '@/components/pages/admin/InjectWoodStatus'
import InjectWorkContent from '@/components/pages/admin/InjectWorkContent'
import EnemyType from '@/components/pages/admin/EnemyType'
import DeadTreesKill from '@/components/pages/admin/DeadTreesKill'
import AreaStatic from '@/components/pages/admin/AreaStatic'
import TimeStatic from '@/components/pages/admin/TimeStatic'
import BatchStatic from '@/components/pages/admin/BatchStatic'
import WorkerStatic from '@/components/pages/admin/WorkerStatic'
import NewMapStatic from '@/components/pages/admin/NewMapStatic'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/login',
      name: 'Login',
      component: Login,

    },

    {
      path: '/',
      name: 'Home',
      component: home,
      //1、

      children: [{
          path: '/helloworld',
          name: 'HelloWorld',
          component: HelloWorld
        },
        {
          path: 'pages/user_mgr.html',
          name: '用户管理',
          component: UserMgr
        },

        {
          path: 'pages/device_wanted2.html',
          name: '数据明细',
          component: DeviceWanted

        },
        {
          path: 'pages/map_statistics.html',
          name: '地图数据分析',
          component: MapStatistics

        },
        {
          path: 'pages/trap/NewTrapDataSummary',
          name: '数据汇总',
          component: TrackDataSummary,
          meta: {
            keepAlive: true
          } // 需要被缓存
        },


        {
          path: 'pages/device_summary',
          name: '诱捕器情况',
          component: DeviceSummary,
          meta: {
            keepAlive: true
          } // 需要被缓存
        },
        {
          path: '/pages/device_wanted1.html',
          name: '数据修改上报',
          component: DeviceWanted,
          meta: {
            keepAlive: true
          } // 需要被缓存
        },
        {
          path: 'pages/device_message',
          name: '诱捕器信息',
          component: DeviceMessage,

        },

        {
          path: 'pages/device_maintenance.html',
          name: '设备维护信息',
          component: MaintenanceData,

        },
        {
          path: 'pages/device_map.html',
          name: '地图',
          component: DeviceMap
        },
        {
          path: 'pages/qrcode_mgr.html',
          name: '二维码管理',
          component: QRCodeMgr
        },

        {
          path: 'pages/device_maintenance_abnormal.html',
          name: '设备异常维护信息',
          component: MaintenanceDataAbnormal
        },
        {
          path: 'pages/statistics.html',
          name: '数据分析',
          component: Statistics
        },
        {
          path: 'pages/other_beetle',
          name: '其他天牛类型配置',
          component: OtherBeetle
        },
        {
          path: 'pages/other_beetleroot',
          name: '其他天牛配置',
          component: OtherBeetle
        },
        {
          path: 'pages/weather_info',
          name: '气象信息',
          component: WeatherInfo
        },

        {
          path: 'pages/month_summary',
          name: '时间动态',
          component: MonthSummary
        },
        {
          path: 'pages/Test',
          name: 'Test',
          component: Test
        },
        {
          path: 'pages/drywatch/detail',
          name: '数据明细',
          component: DryWatchDataDetail
        },
        {
          path: 'pages/naturalEnemy/detail',
          name: '数据明细',
          component: NaturalEnemiesDataDetail
        },
        {
          path: 'pages/deadTrees/detail',
          name: '数据明细',
          component: DeadTreeDataDetail
        },
        {
          path: 'pages/track/detail',
          name: '数据明细',
          component: TrackDataDetail
        },
        {
          path: 'pages/drywatch/datasummary',
          name: '数据汇总',
          component: DryWatchDataSummary
        },
        {
          path: 'pages/drywatch/Maintance',
          name: 'DryWatchMaintanceData',
          component: DryWatchMaintanceData
        },
        {
          path: 'pages/drywatch/message',
          name: 'DryWatchDeviceMessage',
          component: DryWatchDeviceMessage
        },
        {
          path: 'pages/drywatch/wanted',
          name: '数据修改上报',
          component: DryWatchDeviceWanted
        },
        {
          path: 'pages/natural/datasummary',
          name: '数据汇总',
          component: NaturalEnemiesDataSummary
        },
        {
          path: 'pages/natural/maintance',
          name: 'NaturalMaintanceData',
          component: NaturalMaintanceData
        },
        {
          path: 'pages/natural/message',
          name: 'NaturalDeviceMessage',
          component: NaturalDeviceMessage
        },
        {
          path: 'pages/natural/wanted',
          name: '数据修改上报',
          component: NaturalDeviceWanted
        },
        {
          path: 'pages/drywatch/map',
          name: '地图查看',
          component: DryWatchDeviceMap
        },
        {
          path: 'pages/natural/map',
          name: '地图查看',
          component: NaturalDeviceMap
        },
        {
          path: 'pages/deadtree/map',
          name: '地图查看',
          component: DeadTreeDeviceMap
        },
        {
          path: 'pages/track/map',
          name: '地图查看',
          component: TrackDeviceMap
        },
        {
          path: 'pages/admin/qrmanager',
          name: 'ID分配管理',
          component: AdminQRManager
        },
        {
          path: 'pages/drywatch/summaryByRegion',
          name: '区域汇总',
          component: SummaryByReigon
        },
        {
          path: 'pages/trap/workcontent',
          name: '工作内容配置',
          component: TrapWorkContent
        },
        {
          path: 'pages/trap/injectType',
          name: '药剂类型配置',
          component: TrapInjectType
        },
        {
          path: 'pages/inject/woodStatus',
          name: '树木状态配置',
          component: InjectWoodStatus
        },
        {
          path: 'pages/inject/workContent',
          name: '工作内容配置',
          component: InjectWorkContent
        },
        {
          path: 'pages/inject/EnemyType',
          name: '天敌类型配置',
          component: EnemyType
        },
        {
          path: 'pages/inject/DeadTreesKill',
          name: '除害方式配置',
          component: DeadTreesKill
        },
        {
          path: 'pages/trap/AreaStatic',
          name: '区域分析',
          component: AreaStatic
        },
        {
          path: 'pages/trap/TimeStatic',
          name: '月份统计',
          component: TimeStatic
        },
        {
          path: 'pages/trap/BatchStatic',
          name: '批次统计',
          component: BatchStatic
        },
        {
          path: 'pages/trap/WorkerStatic',
          name: '人效分析',
          component: WorkerStatic
        },
        {
          path: 'pages/trap/NewMapStatic',
          name: '统计分析',
          component: NewMapStatic
        }












      ]
    },

  ],
  linkActiveClass: "active-router",
  linkExactActiveClass: "exact-router"
})
