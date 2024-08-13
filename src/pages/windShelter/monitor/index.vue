<route lang="json5">
{
  style: {
    navigationBarTitleText: '避风监控',
  },
  needLogin: true,
}
</route>
<template>
  <view class="pt-2.5 px-2 h-100% overflow-auto">
    <view class="px-2.5 pt-7 border-rd-1.5 bg-#fff position-relative mb-2.5">
      <view
        v-if="notify.name.length < 17"
        class="position-absolute top-4 left-50% border-rd-4 px-3 h-8 line-height-8 bg-#f53f3f color-#fff font-size-4 transform-translate-x--50%"
        style="width: max-content"
      >
        {{ notify.name }}
      </view>
      <uv-notice-bar
        v-else
        class="position-absolute top-4 left-50% max-w-80% transform-translate-x--50% border-rd-4"
        bgColor="#f53f3f"
        fontSize="16"
        color="#fff"
        :icon="false"
        :text="notify.name"
        :customStyle="{
          padding: '4px',
          display: 'block',
          flex: 'unset',
        }"
      ></uv-notice-bar>
      <view class="border-rd-1.5 bg pt-9 px-3.5 pb-4 color-#1D2129 font-size-3.5 line-height-5.5">
        {{ notify.content }}
      </view>
      <view class="color-#F53F3F font-size-3 line-height-5.5 mt-2.5 px-3.5 pb-5">
        计划避风时间：{{ notify.planStartDate.slice(0, 16) }}~{{ notify.planEndDate.slice(0, 16) }}
      </view>
    </view>
    <view class="pt-4 px-2.5 bg-#fff border-rd-1.5 mb-2.5">
      <BlockHeader title="避风落实情况" bgColor="white" barColor="#FF7D00"></BlockHeader>
      <view
        v-for="(item, index) in reportDetail"
        :key="index"
        :class="index + 1 === reportDetail.length ? '' : 'bottom-line'"
        class="mt-4 pb-2"
      >
        <view class="color-#1D2129 line-height-4 font-size-3.5 mb-4">{{ item.name }}</view>
        <view v-if="!item.ships" class="ml-6">暂未报备</view>
        <view v-else class="flex flex-warp">
          <view
            class="w-25% flex flex-col justify-center items-center mb-2.5"
            v-for="(item1, index1) in item.ships"
            :key="index1"
          >
            <uv-image
              src="/static/shelterWind/ship-icon.png"
              width="42px"
              height="42px"
              class="mb-1.5"
            ></uv-image>
            <view class="color-#4E5969 line-height-4 text-center font-size-3.5 w-100% px-1">
              <view v-if="item1.shipName.length < 6">
                {{ item1.shipName }}
              </view>
              <uv-notice-bar
                v-else
                :icon="false"
                style="width: 100%"
                :text="item1.shipName"
                :speed="30"
                color="#000"
                :customStyle="{
                  background: 'transparent',
                  padding: 0,
                  display: 'block',
                  flex: 'unset',
                }"
              ></uv-notice-bar>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { onLoad, onShow } from '@dcloudio/uni-app'
import BlockHeader from '@/components/BlockHeader/index.vue'
import { list } from '@/service/windShelter/monitor/index.js'
onLoad(() => {
  list().then((res) => {
    const data = res.result || {}
    reportDetail.value = data.reportDetail || []
    notify.value = data.notify || {}
  })
})
const notify = ref({})
const reportDetail = ref([])
</script>
<style scoped lang="scss">
.bg {
  background: linear-gradient(360deg, rgba(255, 141, 141, 0.04) 0%, rgb(242 82 82 / 20%) 100%);
}
.bottom-line {
  border-bottom: 1px solid #f2f2f2;
}
</style>
