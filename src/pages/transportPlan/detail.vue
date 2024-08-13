<route lang="json5">
{
  style: {
    navigationBarTitleText: '运输计划详情',
  },
  needLogin: true,
}
</route>
<template>
  <view class="px-2">
    <uv-cell-group>
      <uv-cell title="运单号" :value="itemData.transportCode"></uv-cell>
      <uv-cell title="MMSI" :value="itemData.mmsi"></uv-cell>
      <uv-cell title="运输船名" :value="itemData.shipName"></uv-cell>
      <uv-cell title="运输货物" :value="itemData.transportGoods"></uv-cell>
      <uv-cell title="起始港" :value="itemData.departPort"></uv-cell>
      <uv-cell title="预计出发时间" :value="itemData.startDate"></uv-cell>
      <uv-cell title="承运人" :value="itemData.carrier"></uv-cell>
      <uv-cell title="联系电话" :value="itemData.phone"></uv-cell>
      <view class="p-b-4 border-b-1">
        <view class="flex flex-row px-4 py-2.5 text-3.75 c-#303133 leading-5.5">描述</view>
        <uv-textarea
          v-model="itemData.remark"
          class="c-#606266 text-3 leading-6"
          count
          disabled
        ></uv-textarea>
      </view>
      <uv-cell title="附件">
        <template v-slot:value>
          <text>{{ itemData.file }}</text>
        </template>
      </uv-cell>
    </uv-cell-group>
  </view>
</template>

<script lang="ts" setup>
import { planQueryById } from '@/service/transportPlan/index'
import { useToast } from '@/utils/modals'
const itemData = ref({})
onLoad(async (options) => {
  const { id } = options
  console.log('itemData', itemData)
  const { code, message, result } = await planQueryById({ id })
  if (code === 200 && result) {
    itemData.value = result || {}

    console.log('itemData.value', itemData.value)
  } else {
    useToast(message)
  }
})
</script>
