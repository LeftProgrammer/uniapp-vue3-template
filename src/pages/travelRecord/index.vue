<route lang="json5">
{
  style: {
    navigationBarTitleText: '通行记录',
  },
  needLogin: true,
}
</route>

<template>
  <view class="px-2 pt-2.5 h-100% overflow-auto" v-if="listData.length > 0">
    <view
      v-for="item in listData"
      :key="item.id"
      class="py-3 px-4 flex items-center mb-2 border-rd-1 bg-#fff"
    >
      <uv-image
        src="/static/travelRecord/list-icon.png"
        width="48px"
        height="48px"
        class="mr-2"
      ></uv-image>
      <view class="flex-1">
        <view class="flex items-center mb-1">
          <text class="color-#1d2129 line-height-4 font-size-3.5">{{ item.createTime }}</text>
        </view>
        <view class="flex items-center flex-justify-between line-height-5 font-size-3.5">
          <text class="color-#4e5969 line-height-5 font-size-3.5">
            {{ item.mmsi }}{{ item.shipName }}
          </text>
          <uv-tags
            shape="circle"
            :text="item.type === 1 ? '上船' : '下船'"
            :bgColor="item.type === 1 ? '#3254FF' : ' #00B42A'"
            :borderColor="item.type === 1 ? '#3254FF' : ' #00B42A'"
          ></uv-tags>
        </view>
      </view>
    </view>
  </view>
  <view v-else class="px-2 pt-2.5 h-100% overflow-auto flex justify-center bg-#FFFFFF">
    <uv-empty
      icon="../../static/common/empty.png"
      text="暂无通行记录数据"
      width="160px"
      s
      height="100px"
    ></uv-empty>
  </view>
</template>

<script setup>
import { list } from '@/service/travelRecord/index'
const listData = ref([])
onLoad(() => {
  list().then((res) => {
    console.log('🚀 ~ list ~ res:', res)

    listData.value = res.result
  })
})
</script>
<style scoped></style>
