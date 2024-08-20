<template>
  <view
    class="block-header"
    :style="[headerStyle, { height: `${height}rpx`, backgroundColor: bgColor }]"
  >
    <view class="left" :style="leftStyle">
      <slot name="left">
        <view class="left-bar" :style="{ backgroundColor: barColor }"></view>
      </slot>
    </view>
    <view class="center" :style="centerStyle">
      <slot name="center">
        <view class="title">{{ title }}</view>
      </slot>
    </view>
    <view class="right" :style="rightStyle">
      <slot name="right"></slot>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  bgColor: {
    type: String,
    default: 'transparent',
  },
  barColor: {
    type: String,
    default: '#1851E4',
  },
  height: {
    type: Number,
    default: 80, // rpx
  },
  headerStyle: {
    type: Object,
    default: () => ({}),
  },
  leftStyle: {
    type: Object,
    default: () => ({}),
  },
  centerStyle: {
    type: Object,
    default: () => ({}),
  },
  rightStyle: {
    type: Object,
    default: () => ({}),
  },
})
</script>

<style scoped>
.block-header {
  display: flex;
  align-items: center;
  /* padding: 16rpx; */
}

.left {
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto;
  margin-right: 20rpx;
}

.left-bar {
  width: 16rpx;
  height: 100%;
}

.center {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
  color: #1d2129;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.right {
  margin-left: auto;
  display: flex;
  align-items: center;
}
</style>
