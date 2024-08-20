<route lang="json5">
{
  style: {
    navigationBarTitleText: '视频详情',
  },
  needLogin: true,
}
</route>
<template>
  <view class="h-full flex flex-col bg-#F5F5F5">
    <view class="h-52">
      <video
        id="video"
        :src="params.equipmentUrl"
        controls
        autoplay
        loop
        muted="false"
        object-fit="contain"
        @play="onPlay"
        @pause="onPause"
        @ended="onEnded"
        class="w-full h-full"
      />
    </view>
    <view class="px-4 pt-2 pb-4 mb-4 bg-#FFFFFF">
      <view class="text-4 c-#1D2129 mb-2">{{ params.minitorName }}</view>
      <view class="text-3.5 c-#999999 mb-1">编号：{{ params.equipmentSerial }}</view>
      <view class="text-3.5 c-#999999 mb-">类型：{{ getDictName(params.minitorType) }}</view>
    </view>
    <view class="flex-1 px-4.5 bg-#FFFFFF text-3.5 c-#555555">
      <view class="flex items-center py-4 border-b-1">
        <image class="w-6 h-6" src="../../static/monitor/img_03.png" />
        <text class="ml-2 mr-2.5">设备名称：</text>
        <text class="c-#000000">xxx监控设备高清设备</text>
      </view>
      <view class="flex items-center py-4 border-b-1">
        <image class="w-6 h-6" src="../../static/monitor/img_03.png" />
        <text class="ml-2 mr-2.5">抓拍时间：</text>
        <text class="c-#000000">{{ params.createTime }}</text>
      </view>
      <view class="flex items-center py-4">
        <image class="w-6 h-6" src="../../static/monitor/img_03.png" />
        <text class="ml-2 mr-2.5">事件描述：</text>
        <text class="c-#F44444">未带安全帽</text>
      </view>
    </view>
  </view>
</template>
<script setup>
import { getDictItems } from '@/service/dict'

const params = ref({})
const minitorDeviceType = ref([])
// 定义视频流地址
onLoad((options) => {
  params.value = JSON.parse(decodeURIComponent(options.item))

  getDictItems('minitorDeviceType').then((res) => {
    console.log('minitorDeviceType', res)
    const processedResult = (res.result || []).map((item) => {
      return {
        label: item.title,
        value: item.value,
      }
    })
    minitorDeviceType.value = processedResult
  })
})

// 使用 onMounted 生命周期钩子
onMounted(() => {})

const onPlay = () => {
  console.log('Video is playing')
}
const onPause = () => {
  console.log('Video is paused')
}
const onEnded = () => {
  console.log('Video playback ended')
}

const getDictName = (code) => {
  const item = minitorDeviceType.value.find((x) => x.value === code)
  return item ? item.label : ''
}
</script>
