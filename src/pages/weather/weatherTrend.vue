<route lang="json5">
{
  style: {
    navigationBarTitleText: '天气趋势',
  },
}
</route>
<template>
  <view class="flex h-14 px-4 flex-items-center flex-justify-end">
    <!-- <uv-tags text="今天" bgColor="#3254FF"></uv-tags> -->
    <view @click="open">
      <text class="color-#3254FF font-size-4 mr-4">{{ date }}</text>
      <text class="color-#1D2129 font-size-3.5">{{ week }}</text>
    </view>
  </view>
  <view class="chart-box bg-#f5f5f5 py-2.5 px-2 overflow-y-auto">
    <view v-for="item in weatherTrend" :key="item.key" class="bg-#fff border-rd-2 h-61.5 mb-2.5">
      <qiun-data-charts type="line" ref="charts" :chartData="item.chartData" :opts="opts(item)" />
    </view>
  </view>
  <uv-calendars
    ref="calendars"
    @confirm="confirm"
    :startDate="startDate"
    :clearDate="false"
    :endDate="endDate"
  />
</template>

<script setup>
import { onLoad, onShow } from '@dcloudio/uni-app'
import dayjs from 'dayjs'
import { getWeather } from '@/service/weather/index'
const date = ref('')
const week = ref('')
const charts = ref(null)
const weatherTrend = ref([
  {
    title: '气温趋势(℃)',
    key: 'temperature',
    chartData: [],
    min: -10,
    max: 40,
  },
  {
    title: '风力趋势(m/s)',
    key: 'windSpeed',
    chartData: [],
    min: 0,
    max: 35,
  },
  {
    title: '能见度趋势(km)',
    key: 'visibility',
    chartData: [],
    min: 0,
    max: 25,
  },
  {
    title: '浪高趋势(m)',
    key: 'waveHeight',
    chartData: [],
    min: 0,
    max: 5,
  },
  {
    title: '降水量趋势(mm/h)',
    key: 'precipitation',
    chartData: [],
    min: 0,
    max: 40,
  },
])
const todayWeathweather = ref([])
/**
 * @description 获取路由传参
 */
onLoad((e) => {
  date.value = e.date
  week.value = e.week
  getData()
})
/**
 * @description 获取数据
 */
const getData = () => {
  getWeather({ day: dayjs(date.value).format('YYYYMMDD') }).then((res) => {
    const { today } = res.result || {}
    todayWeathweather.value = today
    weatherTrend.value.forEach((x) => {
      x.chartData = chartData(x)
    })
  })
}
/**
 * @description 图标数据
 * @param item
 */
const chartData = (item) => {
  return {
    categories: [
      '0:00',
      '1:00',
      '2:00',
      '3:00',
      '4:00',
      '5:00',
      '6:00',
      '7:00',
      '8:00',
      '9:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
      '20:00',
      '21:00',
      '22:00',
      '23:00',
      '24:00',
    ],
    series: [
      {
        name: item.title,
        data: todayWeathweather.value.map((x) => x[item.key]),
      },
    ],
  }
}
/**
 * @description 图标配置
 * @param item
 */
const opts = (item) => {
  return {
    color: ['#3254FF'],
    padding: [25, 15, 20, 15],
    enableScroll: false,
    legend: { show: false },
    dataLabel: false,
    dataPointShape: false,
    xAxis: {
      disableGrid: true,
      labelCount: 8,
    },

    yAxis: {
      gridType: 'dash',
      showTitle: true,
      dashLength: 2,
      data: [
        {
          position: 'left',
          title: item.title,
          titleOffsetX: 25,
          min: item.min,
          max: item.max,
        },
      ],
    },
    extra: {
      line: {
        type: 'curve',
        width: 2,
        activeType: 'hollow',
        linearType: 'custom',
      },
    },
  }
}
const calendars = ref(null)
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
const startDate = ref(dayjs(new Date()).format('YYYY-MM-DD'))
const endDate = ref(dayjs(new Date()).add(7, 'day').format('YYYY-MM-DD'))
const open = () => {
  calendars.value.open()
}
const confirm = (e) => {
  date.value = e.fulldate
  week.value = numberToChineseDay(dayjs(e.fulldate).day())
  getData()
}
</script>
<style scoped lang="scss">
.chart-box {
  height: calc(100% - 56px);
}
</style>
