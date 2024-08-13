<route lang="json5">
{
  style: {
    navigationBarTitleText: '天气预报',
  },
}
</route>
<template>
  <view class="Box bg-#f5f5f5 h-100% py-2.5 overflow-auto">
    <view
      class="mx-2 border-rd-2 p-4 weather-info mb-2.5"
      :style="{
        backgroundImage: `url(../../static/weather/img/${weatherBg(nowWeather.weatherCode)}.png)`,
      }"
    >
      <view class="flex h-6 flex-items-center">
        <uv-icon name="map" class="mr-1.5" color="#ffffff" size="16"></uv-icon>
        <text class="mr-4 color-white font-size-4">{{ nowWeather.cityName }}</text>
        <text class="mr-4 font-size-3.5 color-white font-300">
          {{ decimalDegreesToDMS(nowWeather.lon) }}
        </text>
        <text class="font-size-3.5 color-white font-300">
          {{ decimalDegreesToDMS(nowWeather.lat) }}
        </text>
      </view>
      <view class="h-12.5 flex mt-3 mb-2.5">
        <text class="color-#fff font-size-10.5 font-500 line-height-12.5 mr-3">
          {{ nowWeather.temperature }}°
        </text>
        <view>
          <view class="flex flex-items-center">
            <uv-image
              v-if="nowWeather.weatherCode"
              :src="`/static/weather/img/icon/${nowWeather.weatherCode}.png`"
              width="20px"
              class="mr-1.25"
              height="15px"
            ></uv-image>
            <text class="color-#fff font-size-3.5 font-line-4">
              {{ seaCode.weather[nowWeather.weatherCode] }}
            </text>
          </view>
          <view class="color-#fff font-size-3.5 font-line-4">
            {{ nowWeather.windMark }}风
            {{ getJsonLevel(nowWeather.windSpeed, 'wind_levels').level }}级
          </view>
        </view>
      </view>
      <view class="color-#fff font-size-3 font-line-3.5 mb-3">
        {{ dateStr }}
      </view>
      <view class="weather-item-box border-rd-2 h-31 grid grid-rows-2 grid-cols-3">
        <view v-for="item in todayInfo" :key="item.key">
          <view>{{ item.name }}</view>
          <view>{{ getFixed(item) }}{{ item.unit }}</view>
        </view>
      </view>
    </view>
    <view class="pt-4 px-2.5 mx-2 bg-#fff border-rd-2 pb-5">
      <BlockHeader title="7日天气预报" bgColor="white" barColor="blue" class="mb-1"></BlockHeader>
      <view class="reportBox font-size-3.5 color-#fff">
        <view
          v-for="(item, index) in weekWeather"
          :key="index"
          @click="routerTo(item)"
          :class="weatherType(item.weatherCode)"
          class="border-rd-1 bg-#456CD0 mb-2 flex h-14.5 pl-3 pr-2 py-1.5"
        >
          <view class="text-center w-12 mr-3">
            <view class="line-height-5.5">{{ item.week }}</view>
            <view class="line-height-5">{{ item.date }}</view>
          </view>
          <view class="mr-4 w-10 flex flex-col justify-center items-center">
            <uv-image
              :src="`/static/weather/img/icon/${item.weatherCode}.png`"
              width="22px"
              class="text-center"
              height="22px"
            ></uv-image>
            <view class="" v-if="item.weatherDescription.length < 3">
              {{ item.weatherDescription }}
            </view>
            <uv-notice-bar
              v-else
              :icon="false"
              style="width: 100%"
              :text="item.weatherDescription"
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
          <view class="flex items-center mr-3">
            <view class="line-height-5 font-500">{{ item.minTemperature }}°</view>
            <view class="progress-bar h-1 mx-1.5 w-13 h-1 rounded-1"></view>
            <view class="line-height-5 font-500">{{ item.maxTemperature }}°</view>
          </view>
          <view class="text-center flex-1">
            <view
              class="line-height-5 font-500 text-center"
              style="width: 100%"
              v-if="(item.windMark + '风').length < 4"
            >
              {{ item.windMark }}风
            </view>
            <uv-notice-bar
              v-else
              :icon="false"
              style="width: 100%"
              :text="item.windMark + '风'"
              :speed="30"
              color="#fff"
              :customStyle="{
                background: 'transparent',
                padding: 0,
                display: 'block',
                flex: 'unset',
              }"
            ></uv-notice-bar>
            <text class="line-height-5 font-500">{{ item.windSpeed }}级</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import BlockHeader from '@/components/BlockHeader/index.vue'
import { getWeather } from '@/service/weather/index'
import seaCode from '@/static/weather/js/seaCode.json'
import { onLoad, onShow } from '@dcloudio/uni-app'
import dayjs from 'dayjs'
const weekWeather = ref([])
const todayInfo = ref([
  {
    name: '相对湿度',
    value: '0',
    unit: '%',
    key: 'relaHumidity',
    bit: 0,
  },
  {
    name: '紫外线指数',
    value: '最弱',
    key: 'ultravioletRays',
    unit: '级',
    bit: 0,
  },
  {
    name: '体感',
    value: '0',
    unit: '°',
    key: 'appTemp',
    bit: null,
  },
  {
    name: '能见度',
    value: '0',
    unit: 'Km',
    key: 'visibility',
    bit: null,
  },
  {
    name: '降水量',
    value: '0.0',
    unit: 'mm',
    key: 'precipitation',
    bit: 1,
  },
  {
    name: '气压',
    value: '0',
    unit: 'mb',
    key: 'pressure',
    bit: null,
  },
])
const nowWeather = ref({})
const dateStr = ref('')
const timer = ref(null)
onLoad(async () => {
  await getData()
  timer.value = setInterval(updateTime, 1000)
})
onShow(async () => {
  // await getData()
})
/**
 * @description 获取当前时间
 */
const updateTime = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const date = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  dateStr.value = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`
}
/**
 * @description 获取数据
 */
const getData = async () => {
  try {
    const res = await getWeather()
    const { now, hours, today, week } = res.result || {}

    nowWeather.value = now

    todayInfo.value.forEach((element) => {
      element.value = now[element.key]
    })

    console.log('获取数据', week)

    weekWeather.value = week.map((x, i) => {
      return {
        date: dayjs(String(x.day)).format('MM/DD'),
        Date: dayjs(String(x.day)).format('YYYY-MM-DD'),
        weatherDescription: x.weatherDescription,
        windSpeed: getJsonLevel(x.windSpeed, 'wind_levels').level,
        weatherCode: x.weatherCode,
        temperature: x.temperature,
        week: i === 0 ? '今天' : numberToChineseDay(dayjs(String(x.day)).day()),
        windDirection: x.windDirection,
        maxTemperature: x.maxTemperature,
        minTemperature: x.minTemperature,
        windMark: x.windMark,
      }
    })
  } catch (error) {
    console.error('Error fetching weather data:', error)
  }
}

/**
 * @description 将数字转换为中文
 * @param day
 */
const numberToChineseDay = (day) => {
  const daysMap = {
    0: '星期日',
    1: '星期一',
    2: '星期二',
    3: '星期三',
    4: '星期四',
    5: '星期五',
    6: '星期六',
  }

  return daysMap[day]
}
/**
 * @description 经纬度转化
 * @param decimalDegrees
 */
const decimalDegreesToDMS = (decimalDegrees) => {
  const degrees = Math.floor(decimalDegrees)
  const minutes = Math.floor((decimalDegrees - degrees) * 60)
  const seconds = ((decimalDegrees - degrees - minutes / 60) * 3600).toFixed(0)
  return Math.abs(degrees) + '°' + minutes + '′' + seconds + '″'
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
/**
 * @description 数值小数点
 * @param item
 */
const getFixed = (item) => {
  if (item.bit) {
    return Number(item.value).toFixed(item.bit)
  } else {
    return item.value
  }
}
/**
 * @description 天气类型
 * @param code
 */
const weatherType = (code) => {
  if (code === '1031' || code === '1032' || code === '1033') return 'weatherType1'
  else if (
    code === '1000' ||
    code === '1001' ||
    code === '1002' ||
    code === '1003' ||
    code === '1006' ||
    code === '1028'
  )
    return 'weatherType3'
  else return 'weatherType2'
}
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
const routerTo = (item) => {
  uni.navigateTo({
    url: `/pages/weather/weatherTrend?date=${item.Date}&week=${item.week}`,
  })
}
</script>
<style lang="scss" scoped>
.weather-info {
  background-size: 100% 100%;
  background-repeat: no-repeat;

  .weather-item-box {
    background: linear-gradient(180deg, hsla(0, 0%, 100%, 0.18), hsla(0, 0%, 96.5%, 0.02) 100%);
    > view {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #fff;
      > view {
        &:first-child {
          color: #98b3ff;
          font-size: 14px;
        }
        &:last-child {
          font-size: 16px;
        }
      }
    }
  }
}
.reportBox {
  .weatherType1 {
    background: linear-gradient(180deg, #3254ff 0%, #3177ff 100%);
  }
  .weatherType2 {
    background: linear-gradient(180deg, #456cd0 0%, #024079 100%);
  }
  .weatherType3 {
    background: linear-gradient(180deg, #f05c3b 0%, #feba7c 100%);
  }
}
.progress-bar {
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.2) 0%, #ffffff 100%);
}
</style>
