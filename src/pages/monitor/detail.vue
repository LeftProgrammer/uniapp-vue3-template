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
    <!-- 海康威视视频插件 -->
    <!-- <hik-video-plugin
      id="hikVideo"
      :deviceSerial="params.equipmentSerial"
      channelNo="1"
      :accessToken="accessToken"
      autoplay="true"
      show-fullscreen-btn="true"
      show-play-btn="true"
      show-progress="true"
      @error="onVideoError"
    ></hik-video-plugin> -->

    <!-- 备用的普通视频播放 -->
    <view class="h-52 relative overflow-hidden border-none">
      <video
        id="video"
        :src="params.equipmentUrl"
        controls
        autoplay
        loop
        muted="false"
        object-fit="contain"
        :direction="90"
        @play="onPlay"
        @pause="onPause"
        @ended="onEnded"
        @fullscreenchange="onFullscreenChange"
        class="w-full h-full"
      />
    </view>

    <!-- 视频详细信息 -->
    <view class="px-4 pt-2 pb-4 mb-4 bg-#FFFFFF">
      <view class="text-4 c-#1D2129 mb-2">{{ params.minitorName }}</view>
      <view class="text-3.5 c-#999999 mb-1">编号：{{ params.equipmentSerial }}</view>
      <view class="text-3.5 c-#999999 mb-">类型：{{ getDictName(params.minitorType) }}</view>
    </view>
    <view class="flex-1 px-4.5 bg-#FFFFFF text-3.5 c-#555555">
      <view class="flex items-center py-4 border-b-1">
        <image class="w-6 h-6" src="../../static/monitor/img_03.png" />
        <text class="ml-2 mr-2.5">设备名称：</text>
        <text class="c-#000000">{{ params.minitorName }}</text>
      </view>
      <view class="flex items-center py-4 border-b-1">
        <image class="w-6 h-6" src="../../static/monitor/img_03.png" />
        <text class="ml-2 mr-2.5">抓拍时间：</text>
        <text class="c-#000000">{{ params.createTime }}</text>
      </view>
      <view class="flex items-center py-4">
        <image class="w-6 h-6" src="../../static/monitor/img_03.png" />
        <text class="ml-2 mr-2.5">事件描述：</text>
        <text v-if="params.remark" class="c-#F44444">{{ params.remark }}</text>
        <text v-else class="c-#000000">-</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { getDictItems } from '@/service/dict'

const params = ref({})
const minitorDeviceType = ref([])

onLoad(async (options) => {
  params.value = JSON.parse(decodeURIComponent(options.item))
  // await ensureAccessToken() // 确保 AccessToken 获取成功
  getDictItems('minitorDeviceType').then((res) => {
    console.log('minitorDeviceType', res)
    const processedResult = (res.result || []).map((item) => ({
      label: item.title,
      value: item.value,
    }))
    minitorDeviceType.value = processedResult
  })
})

// 页面卸载时销毁视频
onUnload(() => {
  const videoContext = uni.createVideoContext('video')
  videoContext.stop()
})

const onPlay = () => {
  console.log('Video is playing')
}

const onPause = () => {
  console.log('Video is paused')
}

const onEnded = () => {
  console.log('Video playback ended')
}

const onFullscreenChange = (event) => {
  if (event.detail.fullScreen) {
    console.log('Video is in full screen mode')
  } else {
    console.log('Video exited full screen mode')
  }
}

const getDictName = (code) => {
  const item = minitorDeviceType.value.find((x) => x.value === code)
  return item ? item.label : ''
}

// const accessToken = ref('')
// // 获取 AccessToken 的函数
// const fetchAccessToken = async () => {
//   try {
//     const res = await http.post('https://open.ys7.com/api/lapp/token/get', {
//       appKey: '17240650377661671',
//       appSecret: 'CsFKDaiBBPPJXNhyxrXo',
//     })
//     if (res.code === '200') {
//       accessToken.value = res.data.accessToken
//     } else {
//       console.error('获取 AccessToken 失败:', res.msg)
//     }
//   } catch (error) {
//     console.error('请求 AccessToken 失败:', error)
//   }
// }
// // 检查并刷新 AccessToken 的函数
// const ensureAccessToken = async () => {
//   if (!accessToken.value) {
//     await fetchAccessToken()
//   }
// }
// const onVideoError = (event) => {
//   console.error('视频播放错误:', event)
//   // 处理 AccessToken 失效的问题
//   if (event.detail && event.detail.errCode === '20002') {
//     console.log('AccessToken 失效，正在重新获取...')
//     fetchAccessToken().then(() => {
//       // AccessToken 刷新后可以重新加载插件或页面
//       console.log('AccessToken 已刷新，重新加载视频')
//     })
//   }
// }
</script>
