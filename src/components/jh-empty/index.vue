<template>
  <view
    class="flex flex-col justify-center items-center text-center text-gray-500 box-border overflow-hidden"
  >
    <uv-image
      v-if="image"
      :src="image"
      alt="empty image"
      :width="width"
      :height="height"
    ></uv-image>
    <text class="mt-2 text-3.5 c-#86909C">{{ text }}</text>
  </view>
</template>

<script lang="ts" setup>
const props = defineProps({
  image: {
    type: String,
    default: '/static/common/empty.png',
  },
  text: {
    type: String,
    default: '暂无数据',
  },
  width: {
    type: String,
    default: '100%',
  },
  height: {
    type: String,
    default: '100%',
  },
})
</script>
