<route lang="json5">
{
  style: {
    navigationBarTitleText: '待办',
  },
  needLogin: true,
}
</route>

<template>
  <view class="bg-#f5f5f5 overflow-auto pt-2.5 px-2 h-100%" v-if="listData.length > 0">
    <jh-card
      class="mb-2.5"
      v-bind="windShelter"
      v-for="item in listData"
      :key="item.id"
      :titleText="item.windNotification?.name"
      :tagText="item.windNotification?.createTime"
      @longpress="handleLongPress(item)"
    >
      <template v-slot:body>
        <view class="pb-3 mx-3 border-b border-[#e5e6eb]">
          <view
            class="h-7 flex-items-center px-2.5 mb-2.5 bg-#FFF5EB font-3.5 line-height-4 flex justify-between"
          >
            <view class="color-#4E5969 flex h-100% items-center">
              <image src="/static/shelterWind/hourglass.png" class="w-4 h-4 mr-1.5"></image>
              <text>
                {{ item.type === 2 ? '超时' : '距离截止上报时间还剩' }}
              </text>
            </view>
            <text v-show="item.type != 2" :class="item.gtFive ? 'color-#00B42A' : 'color-#FF7D00'">
              {{ item.dateCN }}
            </text>
          </view>
          <view class="color-#4E5969 mx-3 font-4 line-height-5.5">
            {{ item.windNotification?.content }}
          </view>
        </view>
      </template>

      <template v-slot:footer v-if="item.type != 2">
        <view class="w-full h-11.5 flex px-3 items-center justify-between" @click="routerTo(item)">
          <text :class="item.type == 1 ? 'color-#1D2129' : 'color-#4E5969'">填写避风内容</text>
          <uv-icon name="arrow-right" color="#4E5969" size="16"></uv-icon>
        </view>
      </template>
    </jh-card>
  </view>
  <view v-else class="bg-#FFFFFF overflow-auto flex justify-center pt-2.5 px-2 h-100%">
    <uv-empty icon="../../static/common/empty.png" text="暂无待办任务"></uv-empty>
  </view>
</template>

<script setup>
import { list, remove } from '@/service/todo/index'
import JhCard from '@/components/jh-card/index.vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { useDialog, useToast } from '@/utils/modals/index'
import dayjs from 'dayjs'
const windShelter = reactive({
  header: {
    bgcolor:
      'linear-gradient(360deg, rgba(157, 255, 249, 0.03) 20%, rgb(17, 203, 233, 0.16) 100%);',
  },
  border: true,
  line: true,
  imageUrl: '../../static/home/card-icon-2.png',
  title: {
    text: '避风通知',
  },
  tag: {
    text: '',
  },
})
const listData = ref([])
onShow(() => {
  getList()
})
const getList = () => {
  list().then((res) => {
    listData.value = res.result.map((x) => {
      const start = dayjs(new Date())
      const end = dayjs(x.windNotification?.deadline)
      if (start.isBefore(end)) {
        const totalMinutes = end.diff(start, 'minute')
        const days = Math.floor(totalMinutes / (24 * 60))
        const hours = Math.floor((totalMinutes % (24 * 60)) / 60)
        const minutes = totalMinutes % 60
        x.dateCN = `${days} 天 ${hours}小时 ${minutes}分`
        x.type = 1
        x.gtFive = totalMinutes > 5 * 60
      } else {
        x.type = 2
        x.dateCN = '未报备'
      }
      return x
    })
  })
}
const handleLongPress = (item) => {
  useDialog('确定删除待办?', {
    showCancelButton: true,
  }).then((res) => {
    remove({
      id: item.id,
    }).then((res) => {
      useToast('删除成功')
      getList()
    })
  })
}
const routerTo = (item) => {
  if (item.type === 2) return
  uni.navigateTo({
    url: `/pages/windShelter/report/detail?id=${item.windNotification.id}&name=${
      item.windNotification?.name
    }&type=1&deadline=${item.windNotification?.deadline}`,
  })
}
</script>

<style lang="scss" scoped></style>
