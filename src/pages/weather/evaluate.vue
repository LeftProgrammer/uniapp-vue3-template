<route lang="json5">
{
  style: {
    navigationBarTitleText: '气象评估',
  },
}
</route>
<template>
  <uv-calendars ref="calendars" @confirm="confirm" :startDate="startDate" :endDate="endDate" />
  <uv-sticky class="mb-2.5" bgColor="#fff">
    <uv-tabs
      :list="list"
      :lineWidth="100"
      :lineColor="'#3254ff'"
      @click="tabClick"
      :customStyle="{ bottom: 0 }"
      :itemStyle="{ width: '50%', height: '48px' }"
    ></uv-tabs>
  </uv-sticky>
  <view class="bg-#3254FF h-8 px-2.5 flex justify-between items-center">
    <uv-icon name="arrow-left" color="#fff" size="16" @click="pre"></uv-icon>
    <view class="color-#fff line-height-5.2 font-size-4" @click="open">
      <text class="mr-4">{{ date }}</text>
      <text>星期{{ numberToChinese(dayOfWeek) }}</text>
    </view>
    <uv-icon name="arrow-right" color="#fff" size="16" @click="next"></uv-icon>
  </view>
  <view class="px-2.5 py-4 bg-#fff mb-2.5">
    <view class="flex mb-2.5">
      <view class="w-15%"></view>
      <view v-for="item in types" :key="item.key" class="w-17% flex justify-center items-center">
        <uv-image
          :src="`/static/weather/img/icon-${item.key}.png`"
          width="20px"
          height="20px"
        ></uv-image>
      </view>
    </view>
    <view class="flex h-6.5 mb-2.5 items-center bg-#F2F3F5">
      <view class="w-15% color-#000 text-center">最高</view>
      <view
        class="color-#000 w-17% text-center"
        :class="{ 'color-#F53F3F': maxOver.indexOf(item.key) != -1 }"
        v-for="item in types"
        :key="item.key"
      >
        {{ max[item.key] }}
      </view>
    </view>
    <view class="flex h-6.5 items-center justify-around">
      <view class="w-15% color-#4E5969 text-center">最低</view>
      <view
        class="color-#4E5969 w-17% text-center"
        :class="{ 'color-#F53F3F': minOver.indexOf(item.key) != -1 }"
        v-for="item in types"
        :key="item.key"
      >
        {{ min[item.key] }}
      </view>
    </view>
  </view>
  <view class="p-2.5 bg-#fff">
    <view
      class="h-8 bg-#f2f3f5 color-#1D2129 flex items-center font-size-3.5 border-left border-bottom border-right th"
    >
      <view class="border-right w-15%">时间</view>
      <view class="border-right w-17%" v-for="item in types" :key="item.key">{{ item.name }}</view>
    </view>
    <view
      v-for="(item, index) in processCheck"
      :key="item"
      class="h-9.5 flex items-center font-size-3.5 border-left border-bottom border-right tr"
    >
      <view class="border-right h-100% line-height-9.5 w-15% text-align-center">
        {{ String(index).padStart(2, '0') }}:00
      </view>
      <view
        @click="openDialog(item.windSpeedCheck, item.windSpeedWarn)"
        class="border-right w-17%"
        :class="{ 'color-#F53F3F': !item.windSpeedCheck }"
      >
        {{ item.windSpeed }}
      </view>
      <view
        class="border-right w-17%"
        @click="openDialog(item.waveHeightCheck, item.waveHeightWarn)"
        :class="{ 'color-#F53F3F': !item.waveHeightCheck }"
      >
        {{ item.waveHeight }}
      </view>
      <view
        class="border-right w-17%"
        @click="openDialog(item.visibilityCheck, item.visibilityWarn)"
        :class="{ 'color-#F53F3F': !item.visibilityCheck }"
      >
        {{ item.visibility }}
      </view>
      <view
        class="border-right w-17%"
        @click="openDialog(item.temperatureCheck, item.temperatureWarn)"
        :class="{ 'color-#F53F3F': !item.temperatureCheck }"
      >
        {{ item.temperature }}
      </view>
      <view
        class="w-17%"
        @click="openDialog(item.precipitationCheck, item.precipitationWarn)"
        :class="{ 'color-#F53F3F': !item.precipitationCheck }"
      >
        {{ item.precipitation }}
      </view>
    </view>
  </view>
  <uv-modal ref="modal" title="影响工序及施工标准" confirmText="知道了">
    <view class="w-100%">
      <view v-for="(item, index) in content" :key="index" class="color-#4E5969 mb-2.5 w-100%">
        <text class="mr-2.5">{{ item.name }}</text>
        <text>{{ types.find((x) => x.key === item.condition).name }}</text>
        <text>{{ symbolType(item.symbol) }}</text>
        <text>{{ item.num }}</text>
      </view>
    </view>
  </uv-modal>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { buildList, setSailList } from '@/service/weather/evaluate'
import dayjs from 'dayjs'
import { escape } from 'lodash-es'
onLoad(() => {
  const today = dayjs(new Date())
  startDate.value = today.format('YYYY-MM-DD')
  endDate.value = today.add(6, 'day').format('YYYY-MM-DD')
  date.value = today.format('YYYY-MM-DD')
  dayOfWeek.value = today.day()
  dayIndex.value = 0
  getBuildList()
  getSetSailList()
})
const list = ref([{ name: '施工气象评估' }, { name: '出航气象评估' }])
const dayIndex = ref(0)
/**
 * @description 施工评估
 */
const getBuildList = () => {
  buildList().then((res) => {
    buildListData.value = res.result || []
  })
}
/**
 * @description 施工评估
 */
const getSetSailList = () => {
  setSailList().then((res) => {
    setSailListData.value = res.result || []
  })
}
const buildListData = ref([])
const setSailListData = ref([])
const listData = computed(() => {
  return (current.value === 0 ? buildListData.value : setSailListData.value) || []
})
const max = computed(() => {
  if (listData.value[dayIndex.value]) return listData.value[dayIndex.value].max
  else return {}
})
const min = computed(() => {
  if (listData.value[dayIndex.value]) return listData.value[dayIndex.value].min
  else return {}
})
const maxOver = computed(() => {
  if (!listData.value[dayIndex.value]) return []
  else return Object.keys(listData.value[dayIndex.value]?.maxOver)
})
const minOver = computed(() => {
  if (!listData.value[dayIndex.value]) return []
  else return Object.keys(listData.value[dayIndex.value]?.minOver)
})
const processCheck = computed(() => {
  if (listData.value[dayIndex.value]) return listData.value[dayIndex.value].processCheck
  else return []
})
const calendars = ref(null)
const date = ref('')
const startDate = ref(null)
const endDate = ref(null)
const dayOfWeek = ref(null)
const open = () => {
  calendars.value.open()
}
/**
 * @description 数字转中文
 * @param number
 */
const numberToChinese = (number: number) => {
  if (number === 0) return '日'
  if (number === 1) return '一'
  if (number === 2) return '二'
  if (number === 3) return '三'
  if (number === 4) return '四'
  if (number === 5) return '五'
  if (number === 6) return '六'
}
/**
 * @description 符号转换
 * @param type
 */
const symbolType = (type: string) => {
  if (type === 'gt') return '>'
  if (type === 'gte') return '>='
  if (type === 'eq') return '='
  if (type === 'lt') return '<'
  if (type === 'lte') return '<='
}
/**
 * @description 上一天
 */
const pre = () => {
  if (dayIndex.value === 0) return
  dayIndex.value -= 1
  date.value = dayjs(new Date()).add(dayIndex.value, 'day').format('YYYY-MM-DD')
  dayOfWeek.value = dayjs(date.value).day()
}
/**
 * @description 下一天
 */
const next = () => {
  if (dayIndex.value === 6) return
  dayIndex.value += 1
  date.value = dayjs(new Date()).add(dayIndex.value, 'day').format('YYYY-MM-DD')
  dayOfWeek.value = dayjs(date.value).day()
}
/**
 * @description 日历选择
 * @param e
 */
const confirm = (e) => {
  const index =
    e.fulldate === dayjs(new Date()).format('YYYY-MM-DD')
      ? 0
      : dayjs(e.fulldate).diff(dayjs(new Date()), 'day') + 1
  dayIndex.value = index
  date.value = e.fulldate
  dayOfWeek.value = dayjs(e.fulldate).day()
}
const current = ref(0)
const tabClick = ({ index }) => {
  current.value = index
}
const types = ref([
  {
    key: 'wind',
    name: '风速',
    max: 66,
    min: 55,
  },
  {
    key: 'wave',
    name: '浪高',
    max: 66,
    min: 55,
  },
  {
    key: 'vis',
    name: '能见度',
    max: 66,
    min: 55,
  },
  {
    key: 'tem',
    name: '温度',
    max: 66,
    min: 55,
  },
  {
    name: '降雨量',
    key: 'water',
    max: 66,
    min: 55,
  },
])
const modal = ref(null)
const content = ref(null)
const openDialog = (flag, data) => {
  if (flag) return
  modal.value.open()
  content.value = data
}
</script>
<style scoped lang="scss">
.uv-tabs {
  :deep(.uv-tabs__wrapper__nav__line) {
    bottom: 0;
  }
}
.border-top {
  border-top: 1px solid #e5e6eb;
}
.border-bottom {
  border-bottom: 1px solid #e5e6eb;
}
.border-left {
  border-left: 1px solid #e5e6eb;
}
.border-right {
  border-right: 1px solid #e5e6eb;
}
.th {
  view {
    height: 100%;
    line-height: 32px;
    text-align: center;
  }
}
.tr {
  view {
    height: 100%;
    line-height: 38px;
    text-align: center;
  }
}
.uv-popup {
  :deep(.uv-modal) {
    .uv-modal__title {
      color: #1d2129;
    }
    .uv-modal__content {
      padding-left: 18px;
    }
  }
}
</style>
