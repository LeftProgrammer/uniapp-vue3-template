<route lang="json5">
{
  style: {
    navigationBarTitleText: '应用管理',
  },
  needLogin: true,
}
</route>
<template>
  <uv-loading-page :loading="loading" loading-text="加载中..." font-size="24rpx"></uv-loading-page>
  <view class="h-full px-2 relative overflow-auto">
    <view class="my-2.5">
      <AppGrid
        title="首页常用功能"
        :apps="originalHomeApps"
        :editable="isEdit"
        @remove="removeHomeApp"
        :col="5"
      >
        <template #right v-if="fromRoute === 'home'">
          <view class="flex items-center">
            <text v-if="isEdit" class="text-3.5 c-#3254FF" @click="handleCancelEdit">取消</text>
            <uv-button
              type="primary"
              :text="isEdit ? '保存' : '编辑'"
              @click="handleEdit"
              size="small"
              class="ml-4"
            ></uv-button>
          </view>
        </template>
      </AppGrid>

      <view class="module-apps mt-2.5">
        <view v-for="module in allApps" :key="module.id" class="module-item mb-2.5">
          <AppGrid
            :title="module.meta.title"
            :homeApps="originalHomeApps"
            :apps="module.children"
            :editable="isEdit"
            @add="addHomeApp"
            :col="5"
            :barColor="module.meta.icon"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useAppStore, AppItem } from '@/store/app'
import { useToast } from '@/utils/modals/index'
import AppGrid from './components/AppGrid.vue'
import { menus } from './components/data'

const { safeAreaInsets } = uni.getSystemInfoSync()
const appStore = useAppStore()
const loading = ref(true)
const fromRoute = ref('')
// 是否处于编辑状态
const isEdit = ref(false)

// 首页应用列表
const homeApps = ref([])
const allApps = computed(() => appStore.allApps)
const originalHomeApps = ref<AppItem[]>([])

onShow(async () => {
  loading.value = true
  await appStore.fetchUserPermission()
  console.log('onShow', appStore.allApps)
  homeApps.value = await appStore.fetchHomeApps()
  originalHomeApps.value = [...homeApps.value]
  fromRoute.value = appStore.fromRoute
  isEdit.value = false
  appStore.setFromRoute(null)
  setTimeout(() => {
    loading.value = false
  }, 300)
})

// 返回上一页
const handleGoBack = () => {
  uni.switchTab({
    url: '/pages/home/index',
  })
}

// 处理编辑按钮点击事件
const handleEdit = () => {
  if (!isEdit.value) {
    isEdit.value = !isEdit.value
    // 进入编辑模式，更新副本
    originalHomeApps.value = [...homeApps.value]
    console.log('homeApps.value', homeApps.value)
    console.log('originalHomeApps.value', originalHomeApps.value)
  } else {
    // 保存修改到缓存
    appStore
      .updateHomeApps([...originalHomeApps.value])
      .then(() => {
        useToast('保存成功')
        handleGoBack()
        isEdit.value = !isEdit.value
      })
      .catch((err) => {
        useToast(err)
      })
  }
}

// 处理取消编辑按钮点击事件
const handleCancelEdit = async () => {
  originalHomeApps.value = [...homeApps.value]
  isEdit.value = false
}

// 添加应用到首页
const addHomeApp = (app: AppItem) => {
  if (originalHomeApps.value.length >= 10) {
    useToast('首页应用最多添加 10 个')
    return
  }
  originalHomeApps.value.push(app)
}

// 从首页移除应用
const removeHomeApp = (app: AppItem) => {
  const index = originalHomeApps.value.findIndex((item) => item.id === app.id)
  if (index > -1) {
    originalHomeApps.value.splice(index, 1)
  }
}
</script>
