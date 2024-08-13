<template>
  <view class="app-grid">
    <BlockHeader v-if="title" :title="title" :barColor="props.barColor" class="mb-1">
      <template #left>
        <slot name="left"></slot>
      </template>
      <template #center>
        <slot name="center"></slot>
      </template>
      <template #right>
        <slot name="right"></slot>
      </template>
    </BlockHeader>
    <uv-grid :col="col" :border="false" :square="false" v-if="apps && apps.length > 0">
      <uv-grid-item v-for="(app, index) in apps" :key="index" @click="handleAppClick(app)">
        <view class="grid-item">
          <view class="icon-wrap relative">
            <image
              class="h-10.5 w-10.5 rounded-full"
              :src="`/static/home/${app.meta.icon || 'menu-icon-default'}.png`"
            ></image>
            <view
              v-if="isRemovable"
              class="absolute top--2 right--2 w-8 h-8 flex justify-center items-center"
              @click.stop="handleRemoveApp(app)"
            >
              <image class="w-4 h-4 rounded-full" src="../../../static/home/app-delete.png" />
            </view>
            <view
              v-if="isAddable(app)"
              class="absolute top--2 right--2 w-8 h-8 flex justify-center items-center"
              @click.stop="handleAddApp(app)"
            >
              <image class="w-4 h-4 rounded-full" src="../../../static/home/app-add.png" />
            </view>
          </view>
          <text class="text-3.5 c-#4E5969 my-2">{{ app.meta.title || '暂未维护' }}</text>
        </view>
      </uv-grid-item>
    </uv-grid>
    <view v-else class="text-3.5 c-#c0c4cc">暂无数据</view>
  </view>
</template>

<script lang="ts" setup>
import BlockHeader from '@/components/BlockHeader/index.vue'
import { AppItem } from '@/store/app'
import packageJson from '@/pages.json'
// 定义 props
const props = withDefaults(
  defineProps<{
    apps: []
    col: number
    editable: boolean
    title: string
    titleProps?: object
    homeApps?: AppItem[] // 首页应用
    barColor: string
  }>(),
  {
    barColor: '#FF7D00',
  },
)

// 定义 emits
const emit = defineEmits(['add', 'remove'])

// 计算是否可添加
const isAddable = computed(() => (app: AppItem) => {
  return props.editable && isHomeApp(app.id)
})

// 计算是否可移除
const isRemovable = computed(() => {
  return props.editable && !props.homeApps
})

// 判断应用是否已存在于首页
const isHomeApp = (appId: string) => {
  return props.homeApps && !props.homeApps.some((app) => app.id === appId)
}
const handleAppClick = (app: AppItem) => {
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

const handleAddApp = (app: AppItem) => {
  emit('add', app)
}

const handleRemoveApp = (app: AppItem) => {
  emit('remove', app)
}
</script>

<style lang="scss" scoped>
.app-grid {
  padding: 8px;
  background: #ffffff;
  border-radius: 8px;
  .grid-title {
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: bold;
  }

  .grid-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
