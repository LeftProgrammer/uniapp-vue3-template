<route lang="json5">
{
  style: {
    navigationBarTitleText: '避风报备',
  },
  needLogin: true,
}
</route>
<template>
  <view class="h-100% px-2 pt-2.5 box-border overflow-auto">
    <view v-for="item in list" :key="item.id" @click="routerTo(item)" class="mb-2.5">
      <jh-card :titleText="item.name" :tagText="item.createTime" v-bind="cardProps">
        <template v-slot:right>
          <uv-tags
            v-if="item.type == 2 || item.type == 3 || item.state == 2"
            :text="
              item.type == 2
                ? '已报备'
                : item.type == 3
                  ? '已超期'
                  : item.state == 2
                    ? '已结束'
                    : ''
            "
            size="mini"
            :type="
              item.type == 2
                ? 'success'
                : item.type == 3
                  ? 'error'
                  : item.state == 2
                    ? 'warning'
                    : ''
            "
          ></uv-tags>
        </template>
        <template v-slot:body>
          <view
            v-if="item.type == 1 && item.state != 2"
            class="h-7 flex-items-center mx-3 px-2.5 mb-2.5 bg-#FFF5EB font-3.5 line-height-4 flex justify-between"
          >
            <view class="h-100% flex items-center">
              <image src="/static/shelterWind/hourglass.png" class="w-4 h-4 mr-1.5"></image>
              <text class="color-#4E5969">距离截止上报时间还剩</text>
            </view>
            <text :class="item.gtFive ? 'color-#00B42A' : 'color-#FF7D00'">{{ item.dateCN }}</text>
          </view>

          <view class="py-3 mx-3 border-b border-[#e5e6eb] h-30 flex flex-col justify-between">
            <view class="text-4 c-#86909C">
              计划避风开始时间:
              <text class="text-4 c-#4E5969 ml-1">{{ item.planStartDate }}</text>
            </view>
            <view class="text-4 c-#86909C">
              计划避风结束时间:
              <text class="text-4 c-#4E5969 ml-1">{{ item.planEndDate }}</text>
            </view>
            <view class="text-4 c-#86909C">
              本次截止上报时间:
              <text class="text-4 c-#4E5969 ml-1">{{ item.deadline }}</text>
            </view>
          </view>
        </template>

        <template v-slot:footer>
          <view class="w-full p-3 text-4 c-#1D2129 text-wrap break-all">
            通知人员：
            {{
              JSON.parse(item.receiverInfo)
                .map((x) => `${x.name}-${x.phone}`)
                .join('、')
            }}
          </view>
        </template>
      </jh-card>
    </view>
  </view>
</template>

<script setup>
import JhCard from '@/components/jh-card/index.vue'
import { getwindShelter } from '@/service/windShelter/report/index.js'
import dayjs from 'dayjs'
import { onLoad, onShow, onReachBottom } from '@dcloudio/uni-app'
const list = ref([])
onShow(() => {
  getList()
})
const cardProps = reactive({
  header: {
    bgcolor: 'linear-gradient(360deg, rgba(157, 214, 255, 0.03) 20%, rgb(50, 84, 255, 0.16) 100%)',
  },
  imageUrl: '/static/shelterWind/shelterWind.png',
  // title: {
  //   text: '气象预警',
  // },
  tag: {
    text: '无',
  },
})
/**
 * @description 获取报备列表
 */
const getList = () => {
  getwindShelter().then((res) => {
    const unReportedList = res.result.unReportedList || []
    const reportedList = res.result.reportedList || []
    list.value = [
      ...unReportedList.map((x) => {
        // type 1倒计时 2已报备 3已超期
        x.type = 1
        const start = dayjs(new Date())
        const end = dayjs(x.deadline)
        if (start.isBefore(end)) {
          const totalMinutes = end.diff(start, 'minute')
          const days = Math.floor(totalMinutes / (24 * 60))
          const hours = Math.floor((totalMinutes % (24 * 60)) / 60)
          const minutes = totalMinutes % 60
          x.dateCN = `${days} 天 ${hours}小时 ${minutes}分`
          x.gtFive = totalMinutes > 5 * 60
        } else {
          x.type = 3
          x.dateCN = '已结束'
        }
        return x
      }),
      ...reportedList.filter((x) => (x.type = 2)),
    ]
  })
}
const routerTo = (item) => {
  const isView = dayjs(item.deadline).isBefore(dayjs(new Date())) || item.state === 2
  console.log('🚀 ~ routerTo ~ isView:', isView)
  uni.navigateTo({
    url: `/pages/windShelter/report/detail?id=${item.id}&name=${item.name}&type=${item.type}&deadline=${item.deadline}&disabled=${isView ? 1 : 0}`,
  })
}
</script>

<style lang="scss" scoped>
.title-bg {
  background: linear-gradient(360deg, rgba(157, 214, 255, 0.03) 20%, rgb(50, 84, 255, 0.16) 100%);
}
.clacW {
  width: calc(100% - 60px - 61px);
}
</style>
