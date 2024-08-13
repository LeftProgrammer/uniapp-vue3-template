<template>
  <view class="jh-menu">
    <view class="menu-header" v-if="showHeader">
      <slot name="left">
        <view class="menu-title" v-if="title">{{ title }}</view>
      </slot>
      <slot name="right">
        <view class="more-btn" v-if="moreText" @click="handleMoreClick">{{ moreText }}</view>
      </slot>
    </view>
    <uv-scroll-list
      ref="scrollList"
      class="scroll-list"
      :scroll-x="true"
      :scroll-y="false"
      :indicator="showIndicator"
      v-bind="$attrs"
    >
      <uv-grid v-if="menuList.length > 0" :col="5" align="center">
        <uv-grid-item
          :customStyle="{ width: 135 + 'rpx' }"
          v-for="(item, index) in menuList"
          :index="index"
          :key="index"
          @click="handleItemClick(item)"
        >
          <image
            class="h-10.5 w-10.5 rounded-full"
            :src="`/static/home/${item.meta.icon || 'menu-icon-default'}.png`"
          ></image>
          <text class="text-3.5 c-#4E5969 my-2">
            {{ item.meta.title || '暂未维护' }}
          </text>
        </uv-grid-item>
      </uv-grid>
      <view v-else class="text-3.5 c-#c0c4cc">暂无数据</view>
    </uv-scroll-list>
  </view>
</template>

<script setup>
import { defineEmits, ref, onMounted, nextTick, computed } from 'vue'
import packageJson from '@/pages.json'
const props = defineProps({
  // 组件标题
  title: {
    type: String,
    default: '常用功能',
  },
  // 更多按钮文字
  moreText: {
    type: String,
    default: '更多 >',
  },
  // 菜单列表数据
  menuList: {
    type: Array,
    default: () => [],
    required: true,
  },
  // 页面可显示的列数
  col: {
    type: Number,
    default: 5,
  },
})

const emit = defineEmits(['moreMenu', 'itemClick'])

const scrollList = ref(null)

const showHeader = computed(() => {
  return !!props.title || !!props.moreText
})

const showIndicator = computed(() => {
  return props.menuList.length > props.col
})

const handleMoreClick = () => {
  emit('moreMenu')
}

// const handleItemClick = (item) => {
//   if (emit('itemClick', item)) {
//     emit('itemClick', item)
//   } else {
//     item.path && uni.navigateTo(item.path)
//   }
// }

const handleItemClick = (app) => {
  console.log('跳转路由', app.component)
  console.log('packageJson', packageJson.pages)
  // 这里需要做一件事 就是确保地址是可用的 即 判断当前路由 是不是在 packageJson里面
  // 还要考虑 带参数的路由
  const item = packageJson.pages.find((item) => app.component.includes(item.path))
  if (!item) {
    uni.showToast({
      title: '该菜单暂不可用',
      icon: 'none',
    })
    return
  }
  if (!props.editable && app.component) {
    uni.navigateTo({ url: '/' + app.component })
  }
}
</script>

<style lang="scss" scoped>
.jh-menu {
  .menu-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 22rpx;

    .menu-title {
      font-size: 31rpx;
      font-weight: bold;
      line-height: 46rpx;
      color: #1d2129;
    }

    .more-btn {
      font-size: 27rpx;
      color: #86909c;
    }
  }
  :deep(.uv-scroll-list) {
    padding-bottom: 0;
    margin-top: 19rpx;
  }
}
</style>
