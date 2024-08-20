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
  <view class="page h-full overflow-hidden bg-#fff">
    <view class="w-full h-full relative overflow-auto">
      <view class="banner z-1 absolute top-0 left-0 right-0 h-65"></view>
      <view class="absolute z-10 left-0 right-0">
        <view class="w-full h-41 px-3 m-t-3">
          <view class="w-full h-full p-0.5 rounded-2 flex justify-center items-center bg-#FFFFFF">
            <image class="w-full h-full rounded-2" src="../../static/home/head_img.png" />
          </view>
        </view>
        <view class="flex justify-between items-center h-24 px-3 m-t-6">
          <view
            class="box-item w-28 h-full flex flex-col justify-between items-center py-2.5 bg-#fff rounded-1"
          >
            <image class="w-7 h-7" src="../../static/home/img_01.png" />
            <text class="c-#9C9C9C text-3">视频监控</text>
            <text class="c-#222222 text-5 font-600">{{ monitorNum }}</text>
          </view>
          <view
            class="box-item w-28 h-full flex flex-col justify-between items-center py-2.5 bg-#fff rounded-1"
          >
            <image class="w-7 h-7" src="../../static/home/img_02.png" />
            <text class="c-#9C9C9C text-3">在场车辆</text>
            <text class="c-#222222 text-5 font-600">{{ personNum }}</text>
          </view>
          <view
            class="box-item w-28 h-full flex flex-col justify-between items-center py-2.5 bg-#fff rounded-1"
          >
            <image class="w-7 h-7" src="../../static/home/img_03.png" />
            <text class="c-#9C9C9C text-3">在场人员</text>
            <text class="c-#222222 text-5 font-600">{{ carNum }}</text>
          </view>
        </view>

        <view class="w-full px-2 mt-10">
          <image class="w-full h-74" src="../../static/home/content_01.png" />
        </view>

        <view class="w-full mt-9">
          <image class="w-full h-324" src="../../static/home/content_02.png" />
        </view>

        <!-- <view class="m-t-10 px-3">
          <view class="flex items-center my-2.5">
            <view class="w-1 h-2.5 bg-#1851E4 mr-1.5"></view>
            <text class="text-4 c-#000000">工期介绍</text>
          </view>
          <view class="w-full flex m-b-2">
            <view class="px-3 py-2 flex items-center flex-1 bg-#EAF5FF rounded-1">
              <image class="w-8 h-8" src="../../static/home/avatar.png" />
              <view class="flex flex-col justify-between m-l-2.5">
                <text class="c-#9C9C9C text-3 m-b-1">总工期</text>
                <text class="c-#3254FF text-4">69个月</text>
              </view>
            </view>
            <view class="w-2"></view>
            <view class="px-3 py-2 flex items-center flex-1 bg-#EAF5FF rounded-1">
              <image class="w-8 h-8" src="../../static/home/avatar.png" />
              <view class="flex flex-col justify-between m-l-2.5">
                <text class="c-#9C9C9C text-3 m-b-1">总投资</text>
                <text class="c-#3254FF text-4">99.7亿元</text>
              </view>
            </view>
          </view>
          <view class="w-full flex m-b-2">
            <view class="px-3 py-2 flex items-center flex-1 bg-#EAF5FF rounded-1">
              <image class="w-8 h-8" src="../../static/home/avatar.png" />
              <view class="flex flex-col justify-between m-l-2.5">
                <text class="c-#9C9C9C text-3 m-b-1">装机容量</text>
                <text class="c-#3254FF text-4">1180MW</text>
              </view>
            </view>
            <view class="w-2"></view>
            <view class="px-3 py-2 flex items-center flex-1 bg-#EAF5FF rounded-1">
              <image class="w-8 h-8" src="../../static/home/avatar.png" />
              <view class="flex flex-col justify-between m-l-2.5">
                <text class="c-#9C9C9C text-3 m-b-1">年发电量</text>
                <text class="c-#3254FF text-4">20亿千瓦时</text>
              </view>
            </view>
          </view>
          <view class="w-full flex m-b-2">
            <view class="px-3 py-2 flex items-center flex-1 bg-#EAF5FF rounded-1">
              <image class="w-8 h-8" src="../../static/home/avatar.png" />
              <view class="flex flex-col justify-between m-l-2.5">
                <text class="c-#9C9C9C text-3 m-b-1">年抽水量</text>
                <text class="c-#3254FF text-4">27.21亿千瓦时</text>
              </view>
            </view>
            <view class="w-2"></view>
            <view class="px-3 py-2 flex items-center flex-1 bg-#EAF5FF rounded-1">
              <image class="w-8 h-8" src="../../static/home/avatar.png" />
              <view class="flex flex-col justify-between m-l-2.5">
                <text class="c-#9C9C9C text-3 m-b-1">核准日期</text>
                <text class="c-#3254FF text-4">2023年11月30日</text>
              </view>
            </view>
          </view>
          <view class="w-full flex">
            <view class="px-3 py-2 flex items-center flex-1 bg-#EAF5FF rounded-1">
              <image class="w-8 h-8" src="../../static/home/avatar.png" />
              <view class="flex flex-col justify-between m-l-2.5">
                <text class="c-#9C9C9C text-3 m-b-1">计划完工日期</text>
                <text class="c-#3254FF text-4">2028年首台机组投产，2029年全部建成</text>
              </view>
            </view>
          </view>
        </view>

        <view class="m-t-9 bg-#CADFFF p-3 rounded-3 m-b-3">
          <view class="flex items-center my-2.5">
            <view class="w-1 h-2.5 bg-#1851E4 mr-1.5"></view>
            <text class="text-4 c-#000000">引水工程</text>
          </view>
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
        </view> -->
      </view>
    </view>
  </view>
</template>

<script setup>
import { getMinitorList } from '@/service/home'
import { useToast } from '@/utils/modals/index'

const monitorNum = ref(0)
const personNum = ref(0)
const carNum = ref(0)

onLoad(() => {
  getMonitorNum()
})

const getMonitorNum = async (params) => {
  const { code, message, result } = await getMinitorList(params)
  if (code === 200 && result) {
    monitorNum.value = result.total || 0
    personNum.value = result.total + 10 || 0
    carNum.value = result.total + 23 || 0
  } else {
    useToast(message)
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
</style>
