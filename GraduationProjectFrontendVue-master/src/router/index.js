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
import DryWatchMaintanceData from '@/components/pages/drywatch/DryWatchMaintanceData'
import DryWatchDeviceMessage from '@/components/pages/drywatch/DryWatchDeviceMessage'
import DryWatchDeviceWanted from '@/components/pages/drywatch/DryWatchDeviceWanted'
import NaturalEnemiesDataSummary from '@/components/pages/naturalEnemies/DataSummary'
import NaturalMaintanceData from '@/components/pages/naturalEnemies/NaturalMaintanceData'
import NaturalDeviceMessage from '@/components/pages/naturalEnemies/NaturalDeviceMessage'
import NaturalDeviceWanted from '@/components/pages/naturalEnemies/NaturalDeviceWanted'
import DryWatchDeviceMap from '@/components/pages/drywatch/DryWatchDeviceMap'
import NaturalDeviceMap from '@/components/pages/naturalEnemies/NaturalDeviceMap'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,

    },

    {
      path: '/',
      name: 'Home',
      component: home,
      //1、

      children: [
        {
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
          name: '数据修改',
          component: DeviceWanted

        },
        {
          path: 'pages/map_statistics.html',
          name: '地图数据分析',
          component: MapStatistics

        },


        {
          path: 'pages/device_summary',
          name: '诱捕器情况',
          component: DeviceSummary,
          meta: {keepAlive: true }// 需要被缓存
        },
    {
      path: '/pages/device_wanted1.html',
      name: '数据修改上报',
      component: DeviceWanted,
      meta: {keepAlive: true }// 需要被缓存
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
          name: '其他天牛命名',
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
          name: 'DryWatchDetail',
          component: DryWatchDataDetail
        },
        {
          path: 'pages/naturalEnemy/detail',
          name: 'NaturalEnemiesDataDetail',
          component: NaturalEnemiesDataDetail
        },
        {
          path: 'pages/deadTrees/detail',
          name: 'DeadTreesDataDetail',
          component: DeadTreeDataDetail
        },
        {
          path: 'pages/track/detail',
          name: 'TrackDataDetail',
          component: TrackDataDetail
        },
        {
          path: 'pages/drywatch/datasummary',
          name: 'DryWatchDataSummary',
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
          name: 'DryWatchDeviceWanted',
          component: DryWatchDeviceWanted
        },
        {
          path: 'pages/natural/datasummary',
          name: 'NaturalEnemiesDataSummary',
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
          name: 'NaturalDeviceWanted',
          component: NaturalDeviceWanted
        },
        {
              path: 'pages/drywatch/map',
              name: 'DryWatchDeviceMap',
              component: DryWatchDeviceMap
        },
        {
          path: 'pages/natural/map',
          name: 'NaturalDeviceMap',
          component: NaturalDeviceMap
        },


        
      ]
    },

  ],
  linkActiveClass: "active-router",
  linkExactActiveClass: "exact-router"
})
