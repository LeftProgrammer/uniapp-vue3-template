<route lang="json5">
{
  style: {
    navigationBarTitleText: '视频监控',
  },
  needLogin: true,
}
</route>
<template>
  <uv-sticky offset-top="0">
    <view class="h-14 bg-#fff mb-2.5 px-3 pt-2.5">
      <uv-input
        placeholder="请输入设备名称"
        prefixIcon="search"
        shape="circle"
        :placeholderStyle="{ color: '#86909C' }"
        border="surround"
        v-model="cameraName"
        :clearable="true"
      ></uv-input>
    </view>
  </uv-sticky>
  <BlockHeader
    :title="`监控列表(${cameraList.length})`"
    barColor="#FF7D00"
    class="mx-3"
  ></BlockHeader>
  <view class="box overflow-auto">
    <view class="grid grid-cols-2 mx-3 gap-2.15">
      <view v-for="item in cameraList" :key="item.id" class="w-100% h-40 border-rd-2 bg-#fff">
        <view class="video border-rd-2">
          <view class="bg-#D6D6D6 w-100% h-100% border-rd-t-2 flex items-center justify-center">
            <uv-image src="/static/video/offline.png" width="62px" height="58px"></uv-image>
          </view>
        </view>
        <view class="h-10 px-2.5 line-height-10 color-#1D2129 font-size-3.5 truncate">
          {{ item.name }}
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import BlockHeader from '@/components/BlockHeader/index.vue'
import { list } from '@/service/video/index'
import { onLoad } from '@dcloudio/uni-app'
import { computed } from 'vue'
onLoad(() => {
  list().then((res) => {
    listData.value = res.result
  })
})
const listData = ref([])
const cameraName = ref('')
const cameraList = computed(() => {
  return listData.value.filter((x) => x.name.includes(cameraName.value))
})
</script>
<style scoped lang="scss">
.uv-input {
  background: #eff2ff;
}
.box {
  height: calc(100% - 66px - 40px - 10px);
  .video {
    height: calc(100% - 40px);
  }
}
</style>
