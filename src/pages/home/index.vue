<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5" type="home">
{
  style: {
    navigationBarTitleText: '工程概览',
  },
  needLogin: true,
}
</route>
<template>
  <view class="page h-full overflow-hidden bg-#fff p-b-3">
    <view class="w-full h-full relative overflow-auto">
      <view class="banner z-1 absolute top-0 left-0 right-0 h-65"></view>
      <view class="absolute z-10 left-0 right-0">
        <view class="w-full h-41 px-3 m-t-3">
          <image
            class="w-full h-full"
            src="../../static/home/avatar.png"
            mode="scaleToFill"
          ></image>
        </view>
        <view class="flex justify-between items-center h-24 px-3 m-t-6">
          <view
            class="box-item w-28 h-full flex flex-col justify-between items-center py-2.5 bg-#fff rounded-1"
          >
            <image class="w-7 h-7" src="../../static/home/avatar.png"></image>
            <text class="c-#9C9C9C text-3">视频监控</text>
            <text class="c-#222222 text-5">256</text>
          </view>
          <view
            class="box-item w-28 h-full flex flex-col justify-between items-center py-2.5 bg-#fff rounded-1"
          >
            <image class="w-7 h-7" src="../../static/home/avatar.png"></image>
            <text class="c-#9C9C9C text-3">在场车辆</text>
            <text class="c-#222222 text-5">124</text>
          </view>
          <view
            class="box-item w-28 h-full flex flex-col justify-between items-center py-2.5 bg-#fff rounded-1"
          >
            <image class="w-7 h-7" src="../../static/home/avatar.png"></image>
            <text class="c-#9C9C9C text-3">在场人员</text>
            <text class="c-#222222 text-5">624</text>
          </view>
        </view>

        <view class="m-t-10 px-3">
          <BlockHeader
            title="工期介绍"
            bgColor="white"
            barColor="#1851E4"
            class="px-2"
          ></BlockHeader>
          <view class="w-full flex m-b-2">
            <view class="px-3 py-2 flex items-center flex-1 bg-#EAF5FF rounded-1">
              <image class="w-8 h-8" src="../../static/home/avatar.png"></image>
              <view class="flex flex-col justify-between m-l-2.5">
                <text class="c-#9C9C9C text-3 m-b-1">总工期</text>
                <text class="c-#3254FF text-4">69个月</text>
              </view>
            </view>
            <view class="w-2"></view>
            <view class="px-3 py-2 flex items-center flex-1 bg-#EAF5FF rounded-1">
              <image class="w-8 h-8" src="../../static/home/avatar.png"></image>
              <view class="flex flex-col justify-between m-l-2.5">
                <text class="c-#9C9C9C text-3 m-b-1">总投资</text>
                <text class="c-#3254FF text-4">99.7亿元</text>
              </view>
            </view>
          </view>
          <view class="w-full flex m-b-2">
            <view class="px-3 py-2 flex items-center flex-1 bg-#EAF5FF rounded-1">
              <image class="w-8 h-8" src="../../static/home/avatar.png"></image>
              <view class="flex flex-col justify-between m-l-2.5">
                <text class="c-#9C9C9C text-3 m-b-1">装机容量</text>
                <text class="c-#3254FF text-4">1180MW</text>
              </view>
            </view>
            <view class="w-2"></view>
            <view class="px-3 py-2 flex items-center flex-1 bg-#EAF5FF rounded-1">
              <image class="w-8 h-8" src="../../static/home/avatar.png"></image>
              <view class="flex flex-col justify-between m-l-2.5">
                <text class="c-#9C9C9C text-3 m-b-1">年发电量</text>
                <text class="c-#3254FF text-4">20亿千瓦时</text>
              </view>
            </view>
          </view>
          <view class="w-full flex m-b-2">
            <view class="px-3 py-2 flex items-center flex-1 bg-#EAF5FF rounded-1">
              <image class="w-8 h-8" src="../../static/home/avatar.png"></image>
              <view class="flex flex-col justify-between m-l-2.5">
                <text class="c-#9C9C9C text-3 m-b-1">年抽水量</text>
                <text class="c-#3254FF text-4">27.21亿千瓦时</text>
              </view>
            </view>
            <view class="w-2"></view>
            <view class="px-3 py-2 flex items-center flex-1 bg-#EAF5FF rounded-1">
              <image class="w-8 h-8" src="../../static/home/avatar.png"></image>
              <view class="flex flex-col justify-between m-l-2.5">
                <text class="c-#9C9C9C text-3 m-b-1">核准日期</text>
                <text class="c-#3254FF text-4">2023年11月30日</text>
              </view>
            </view>
          </view>
          <view class="w-full flex">
            <view class="px-3 py-2 flex items-center flex-1 bg-#EAF5FF rounded-1">
              <image class="w-8 h-8" src="../../static/home/avatar.png"></image>
              <view class="flex flex-col justify-between m-l-2.5">
                <text class="c-#9C9C9C text-3 m-b-1">计划完工日期</text>
                <text class="c-#3254FF text-4">2028年首台机组投产，2029年全部建成</text>
              </view>
            </view>
          </view>
        </view>

        <view class="m-t-9 bg-#CADFFF p-3 rounded-3">
          <BlockHeader
            title="引水工程"
            bgColor="#CADFFF"
            barColor="#1851E4"
            class="px-2"
          ></BlockHeader>
          <view class="w-full px-2 py-4.25 bg-white rounded-2">
            <view class="w-full flex m-b-2 c-#fff text-3.5">
              <view class="flex-1 h-7 flex items-center px-2.5 bg-#05A557">线路总长：23.03km</view>
              <view class="w-2"></view>
              <view class="flex-1 h-7 flex items-center px-2.5 bg-#05A557">埋管长度: 22.78km</view>
            </view>
            <view class="w-full flex m-b-2.5 c-#fff text-3.5">
              <view class="flex-1 h-7 flex items-center px-2.5 bg-#05A557">渠道长度: 0.25km</view>
              <view class="w-2"></view>
              <view class="flex-1 h-7 flex items-center px-2.5 bg-#05A557">
                设计补水流量: 0.5 m³/s
              </view>
            </view>
            <view class="text-3.5">
              <text class="c-#6C6E72">水源点：</text>
              <text class="c-#282828">甘肃中部生态移民扶贫开发供水工程南干渠 6#站进水池</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import BlockHeader from '@/components/BlockHeader/index.vue'
import { useToast } from '@/utils/modals/index'
import { useAppStore, useUserStore } from '@/store'
import {
  getRealTimeWeather,
  getExtremeWeather,
  windnotifycation,
  getShipAlarm,
  count,
} from '@/service/home/index'
import dayjs from 'dayjs'
import { useDataBaseStore } from '@/store/database'
import seaCode from '@/static/weather/js/seaCode.json'

defineOptions({
  name: 'Home',
})

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
const userInfo = useUserStore().userInfo
const appStore = useAppStore()

const menuData = ref([])
const paging = ref(null)

const modal = ref(null)
onLoad((e) => {
  if (e.fromLogin) {
    const dataBaseStore = useDataBaseStore()
    dataBaseStore.get('dolphinWatch').then((res) => {
      if (res.length > 0) {
        modal.value.open()
      }
    })
  }
  getData()
})

onShow(async () => {
  await appStore.fetchUserPermission()
  menuData.value = await appStore.fetchHomeApps()
})

const onRefresh = () => {
  getData().finally(() => {
    paging.value.complete()
  })
}

const handleGoWeather = () => {
  uni.navigateTo({
    url: '/pages/weather/index',
  })
}

const handleMore = () => {
  appStore.setFromRoute('home')
  uni.switchTab({
    url: '/pages/application/index',
  })
}
const handleItemClick = (item) => {
  uni.navigateTo({
    url: item.path,
  })
}

const handleOpenCode = () => {
  uni.navigateTo({
    url: '/pages/QRCode/index',
  })
}
const handleOpenRecord = () => {
  uni.navigateTo({
    url: '/pages/travelRecord/index',
  })
}

const weatherData = ref(null) // 天气
const extremeWeatherData = ref(null) // 气象
const windnotifycationData = ref(null) // 避风
const shipAlarmData = ref(null) // 围栏
const countData = ref(0)

/**
 * @description 根据code选背景
 * @param code
 */
const weatherBg = (code) => {
  if (code === '1031' || code === '1036') return 'sun'
  else if (code === '1035') return 'overcastSky'
  else if (code === '1032' || code === '1033') return 'cloudy'
  else if (
    code === '1025' ||
    code === '1026' ||
    code === '1027' ||
    code === '1028' ||
    code === '1029'
  )
    return 'fog'
  else if (
    code === '1007' ||
    code === '1010' ||
    code === '1011' ||
    code === '1012' ||
    code === '1013' ||
    code === '1014' ||
    code === '1000' ||
    code === '1001' ||
    code === '1002' ||
    code === '1003' ||
    code === '1006'
  )
    return 'rain'
  else return 'snow'
}
/**
 * @description 风 级别
 * @param value
 * @param type
 */
const getJsonLevel = (value, type) => {
  return (
    seaCode[type].find((item) => {
      return item.range.max >= value && item.range.min <= value
    }) || {}
  )
}

const weatherCard = reactive({
  header: {
    bgcolor:
      'linear-gradient(360deg, rgba(255, 228, 157, 0.06) 20%, rgba(246, 160, 32, 0.16) 100%)',
  },
  border: true,
  line: true,
  imageUrl: '../../static/home/card-icon-1.png',
  title: {
    text: '气象预警',
  },
  tag: {
    text: '无',
  },
})
const windShelter = reactive({
  header: {
    bgcolor: 'linear-gradient(360deg, rgba(157, 214, 255, 0.06) 20%, rgba(50, 84, 255, 0.16) 100%)',
  },
  border: true,
  line: true,
  imageUrl: '../../static/home/card-icon-2.png',
  title: {
    text: '避风通知',
  },
  tag: {
    text: '无',
  },
})
const fence = reactive({
  header: {
    bgcolor: 'linear-gradient( 360deg, rgba(255,192,157, 0.06) 0%, rgba(247,104,43, 0.16) 100%)',
  },
  border: true,
  line: true,
  imageUrl: '../../static/home/card-icon-3.png',
  title: {
    text: '围栏警告',
  },
  tag: {
    text: '无',
  },
})

const form = reactive({
  imageValue: [],
})
watch(
  () => form.value.imageValue,
  (newValue, oldValue) => {
    console.log('form.imageValue changed from', oldValue, 'to', newValue)
  },
)

const createPromiseMap = () => {
  return new Map([
    ['weatherData', getRealTimeWeather()],
    ['extremeWeatherData', getExtremeWeather()],
    ['windnotifycationData', windnotifycation()],
    ['shipAlarmData', getShipAlarm()],
    ['countData', count()],
  ])
}
const getData = () => {
  const promiseMap = createPromiseMap()
  return Promise.allSettled(promiseMap.values()).then((results) => {
    let index = 0
    for (const [key, promise] of promiseMap.entries()) {
      const res = results[index++]

      console.error('result===>', res)
      if (res.status === 'fulfilled') {
        switch (key) {
          case 'weatherData':
            weatherData.value = res.value?.result || {}
            break
          case 'extremeWeatherData':
            extremeWeatherData.value =
              res.value?.result && res.value?.result.length > 0 ? res.value?.result[0] : {}
            weatherCard.tag.text = extremeWeatherData.value?.releaseDate
              ? `${extremeWeatherData.value?.releaseDate} 发布`
              : '无'
            break
          case 'windnotifycationData':
            windnotifycationData.value = res.value?.result || {}
            windnotifycationData.value.contactInfo = JSON.parse(
              windnotifycationData.value?.contactInfo || '{}',
            )
            windShelter.tag.text = windnotifycationData.value?.updateTime
              ? `${windnotifycationData.value?.updateTime} 发布`
              : '无'
            break
          case 'shipAlarmData':
            shipAlarmData.value = res.value?.result?.inShip || []
            break
          case 'countData':
            countData.value = res.value?.result || 0
            break
        }
      } else if (res.status === 'rejected') {
        console.error(`${key} 失败:`, res.reason)
        // 处理失败的请求...
      }
    }
  })
}

const handleGo = (type) => {
  switch (type) {
    case 'windShelterMonitor':
      uni.navigateTo({ url: '/pages/windShelter/monitor/index' })
      break
    case 'windnotifycationData':
      uni.navigateTo({ url: '/pages/weather/weatherWarn' })
      break
    case 'shipAlarmData':
      uni.navigateTo({ url: '' })
      break
  }
}
</script>

<style lang="scss" scoped>
.banner {
  position: absolute;
  top: 0;
  left: 0;
  height: 260px;
  width: 100%;
  background: linear-gradient(180deg, #0a57ed 0%, #74bcff 100%);
}

.box-item {
  box-shadow: 0px 4px 6px 0px rgba(123, 123, 123, 0.28);
}

// .banner-image {
//   width: 100%;
//   height: 100%;
//   display: block;
// }
// .page {
//   background-image: url('@/static/home/banner.png');
//   background-size: cover; /* 确保背景图覆盖整个页面 */
//   background-repeat: no-repeat;
// }
// .header-wrapper {
//   background-image: url('@/static/home/banner.png');
//   box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
//   // background-size: cover; /* 确保背景图覆盖整个页面 */
//   // background-repeat: no-repeat;
// }

.info {
  .info-left {
    background: linear-gradient(180deg, #4b88ff 0%, #2041e4 100%);
  }
  .left-bottom {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.5) 20%, rgba(38, 127, 230, 1) 100%);
  }
  .desc {
    background: rgba(255, 255, 255, 0.25);
  }
}
.weatherType1 {
  :deep(.uv-cell__title-text) {
    color: #f53f3f;
  }
}
.weatherType2 {
  :deep(.uv-cell__title-text) {
    color: #ff7d00;
  }
}
.weatherType3 {
  :deep(.uv-cell__title-text) {
    color: #fb6728;
  }
}
.weatherType4 {
  :deep(.uv-cell__title-text) {
    color: #3254ff;
  }
}
.weatherType5 {
  :deep(.uv-cell__title-text) {
    color: #a0aabb;
  }
}
</style>
