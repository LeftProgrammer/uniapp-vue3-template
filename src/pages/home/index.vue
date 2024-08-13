<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5" type="home">
{
  style: {
    navigationStyle: 'custom',
  },
  needLogin: true,
}
</route>
<template>
  <view class="page h-full relative overflow-hidden bg-top bg-no-repeat bg-cover">
    <z-paging ref="paging" refresher-only @onRefresh="onRefresh" :auto="false">
      <template #top>
        <view
          class="header-wrapper p-2.5 z-10 bg-top bg-no-repeat bg-cover"
          :style="{ paddingTop: safeAreaInsets?.top + 10 + 'px' }"
        >
          <view class="h-full flex items-center c-#fff">
            <view class="avatar w-12 h-12 m-r-3 border-2 border-white rounded-1.5">
              <image
                class="w-full h-full rounded-1.5"
                :src="userInfo.picture || '/static/home/avatar.png'"
              />
            </view>
            <view class="flex flex-col justify-between flex-1">
              <view class="flex items-center justify-start h-7 text-5">
                <view class="name">你好，{{ userInfo.name }}</view>
              </view>
              <view class="tip text-3.5">今日工作辛苦了！</view>
            </view>
          </view>
        </view>
      </template>
      <view class="h-full relative overflow-auto p-2.5">
        <view class="info flex justify-between h-35">
          <view
            class="info-left relative p-2 text-white rounded-lg shadow-[0_1_2_0_rgba(37,70,233,0.32)] min-w-40 bg-no-repeat bg-cover"
            @click="handleGoWeather"
            :style="{
              backgroundImage: `url(../../static/weather/img/${weatherBg(weatherData?.weatherCode)}.png)`,
            }"
          >
            <view class="flex items-center">
              <uv-image
                v-if="weatherData?.weatherCode"
                :src="`/static/weather/img/icon/${weatherData?.weatherCode}.png`"
                width="48px"
                height="48px"
              ></uv-image>
              <uv-image
                v-else
                src="/static/weather/img/icon/1036.png"
                width="48px"
                height="48px"
              ></uv-image>
              <view class="ml-2 text-8">{{ weatherData?.temperature }}</view>
              <view class="flex flex-col justify-around h-full ml-1.5">
                <view class="text-3.5">℃</view>
                <view v-if="weatherData?.weatherDescription.length < 4" class="text-3.5">
                  {{ weatherData?.weatherDescription }}
                </view>
                <uv-notice-bar
                  v-else
                  :icon="false"
                  style="width: 100%"
                  :text="weatherData?.weatherDescription"
                  :speed="30"
                  color="#fff"
                  :customStyle="{
                    background: 'transparent',
                    padding: 0,
                    display: 'block',
                    flex: 'unset',
                  }"
                ></uv-notice-bar>
              </view>
            </view>
            <view
              class="left-bottom absolute top-17 right-0 bottom-0 left-0 flex flex-col justify-between py-2.25 px-2 rounded-lg"
            >
              <view class="flex items-center text-3.5">
                <view class="desc h-6 px-3 leading-6 text-center rounded-md">
                  {{ weatherData?.windMark ? `${weatherData?.windMark}风` : '无' }}
                </view>
                <view class="ml-2" v-if="weatherData?.windMark">
                  {{ getJsonLevel(weatherData.windSpeed, 'wind_levels').level }}级
                </view>
              </view>
              <view class="flex items-center text-3.5">
                <view class="desc h-6 px-3 leading-6 text-center rounded-md">能见度</view>
                <view class="ml-2">{{ weatherData?.visibility }}km</view>
              </view>
            </view>
          </view>
          <view class="flex flex-1 flex-col justify-between ml-2">
            <view class="flex h-16.5 px-2 items-center bg-white rounded-lg" @click="handleOpenCode">
              <image class="w-10 h-10" src="../../static/home/code-icon.png"></image>
              <view class="h-10 flex flex-col justify-between ml-2">
                <view class="text-4 font-bold leading-5 text-[#1d2129]">我的通行码</view>
                <view class="text-3 leading-5 text-[#3254ff]">出航请出示</view>
              </view>
            </view>
            <view
              class="flex h-16.5 px-2 items-center bg-white rounded-lg"
              @click="handleOpenRecord"
            >
              <image class="w-10 h-10" src="../../static/home/record-icon.png"></image>
              <view class="h-10 flex flex-col justify-between ml-2">
                <view class="text-4 font-bold leading-5 text-[#1d2129]">出航记录</view>
                <view class="text-3 leading-5 text-[#5ab76f]">已出航{{ countData }}次</view>
              </view>
            </view>
          </view>
        </view>

        <view
          class="menu p-2.75 mt-2.75 bg-white rounded-1.875 shadow-[0_1_1.375_0_rgba(152,178,244,0.1)]"
        >
          <jh-menus :menu-list="menuData" @moreMenu="handleMore" @itemClick="handleItemClick" />
        </view>

        <view class="mt-3">
          <jh-card v-bind="weatherCard">
            <template v-slot:body>
              <view class="py-3 mx-3 border-b border-[#e5e6eb]">
                <template v-if="extremeWeatherData?.content">
                  <view
                    class="text-4 text-[#ff7d00] mb-2"
                    :class="{
                      weatherType1: extremeWeatherData?.warningLevel === '红色',
                      weatherType2: extremeWeatherData?.warningLevel === '黄色',
                      weatherType3: extremeWeatherData?.warningLevel === '橙色',
                      weatherType4: extremeWeatherData?.warningLevel === '蓝色',
                      weatherType5: extremeWeatherData?.warningLevel === '白色',
                    }"
                  >
                    {{ extremeWeatherData?.type }}{{ extremeWeatherData?.warningLevel }}预警
                  </view>
                  <uv-read-more show-height="130rpx" :toggle="true" closeText="全文">
                    <view class="text-4 leading-6 text-[#1d2129]">
                      {{ extremeWeatherData?.content }}
                    </view>
                  </uv-read-more>
                  <view class="text-3.5 text-[#86909c] mt-3">
                    数据来源： {{ extremeWeatherData?.releaseSource }}
                  </view>
                </template>
                <uv-empty
                  v-else
                  icon="../../static/home/empty-weather.png"
                  text="近期无气象预警"
                  width="130px"
                  height="85px"
                ></uv-empty>
              </view>
            </template>

            <template v-slot:footer>
              <view class="w-full h-11.5 flex items-center justify-center">
                <view
                  class="text-4 leading-6 text-[#3254ff]"
                  @click="handleGo('windnotifycationData')"
                >
                  预警详情
                </view>
                <!-- <view v-else class="text-4 leading-6 text-[#ebedf0]">预警详情</view> -->
              </view>
            </template>
          </jh-card>
        </view>
        <view class="mt-3">
          <jh-card v-bind="windShelter">
            <template v-slot:body>
              <view class="py-3 mx-3 border-b border-[#e5e6eb]">
                <template v-if="windnotifycationData?.content">
                  <uv-read-more show-height="130rpx" :toggle="true" closeText="全文">
                    <view class="text-4 leading-6 text-[#1d2129]">
                      {{ windnotifycationData?.content }}
                    </view>
                  </uv-read-more>
                  <view class="text-3.5 text-[#86909c] mt-3">
                    联系人：{{ windnotifycationData?.contactInfo?.name }}
                    {{ windnotifycationData?.contactInfo?.phone }}
                  </view>
                </template>
                <uv-empty
                  v-else
                  icon="../../static/home/empty-wind.png"
                  text="近期无避风通知"
                  width="130px"
                  height="85px"
                ></uv-empty>
              </view>
            </template>
            <template v-slot:footer>
              <view class="w-full h-11.5 flex items-center justify-center">
                <view
                  class="text-4 leading-6 text-[#3254ff]"
                  @click="handleGo('windShelterMonitor')"
                >
                  避风监控
                </view>
                <!-- <view v-else class="text-4 leading-6 text-[#ebedf0]">避风监控</view> -->
              </view>
            </template>
          </jh-card>
        </view>
        <view class="mt-3">
          <jh-card v-bind="fence">
            <template v-slot:body>
              <view class="py-3 mx-3">
                <template v-if="shipAlarmData?.length > 0">
                  <view
                    class="flex items-center justify-between pb-2.5 border-b border-[#e5e6eb]"
                    v-for="(item, index) in shipAlarmData"
                    :key="index"
                  >
                    <view class="flex-1">
                      <view class="text-3.5 text-[#1d2129] leading-5.5">{{ item.name }}</view>
                      <view class="text-3 text-[#86909c] leading-5">
                        {{ dayjs(item.lasttime).format('YYYY-MM-DD HH:mm') }}
                      </view>
                    </view>
                    <view class="text-4 text-[#3254ff] leading-6">定位 ></view>
                  </view>
                </template>
                <uv-empty
                  v-else
                  icon="../../static/home/empty-fence.png"
                  text="围栏内无外部船舶"
                  width="130px"
                  height="85px"
                ></uv-empty>
              </view>
            </template>
          </jh-card>
        </view>
      </view>
    </z-paging>
  </view>
  <uv-modal
    ref="modal"
    title="提示"
    confirmText="知道了"
    content="您的观豚日志有未提交，请尽快提交！"
  ></uv-modal>
</template>

<script setup>
import JhMenus from '@/components/jh-menus/index.vue'
import JhCard from '@/components/jh-card/index.vue'
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
.page {
  background-image: url('@/static/home/banner.png');
  background-size: cover; /* 确保背景图覆盖整个页面 */
  background-repeat: no-repeat;
}
.header-wrapper {
  background-image: url('@/static/home/banner.png');
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
  // background-size: cover; /* 确保背景图覆盖整个页面 */
  // background-repeat: no-repeat;
}

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
