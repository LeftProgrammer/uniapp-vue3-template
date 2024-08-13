<route lang="json5">
{
  style: {
    navigationStyle: 'custom',
  },
  needLogin: true,
}
</route>

<template>
  <view class="h-full flex flex-col bg-#F5F5F5 relative">
    <view
      class="h-56 rounded-bl-12 rounded-br-12 absolute top-0 left-0 right-0 bg-gradient-to-b from-#267af8 to-#3254ff"
    ></view>

    <view
      class="absolute top-0 left-2.5 right-2.5 bottom-30 z-1 flex flex-col text-3.5 overflow-auto"
    >
      <view class="flex flex-col text-white px-3 mt-18 overflow-hidden">
        <view class="flex items-center">
          <image
            :src="user.picture || '/static/home/avatar.png'"
            class="w-14 h-14 rounded-full mr-4"
          />
          <view class="h-full flex flex-col justify-around">
            <view class="text-4">{{ user.name }}</view>
            <uv-tags :text="user.department" type="warning" shape="circle"></uv-tags>
          </view>
        </view>
        <view class="flex justify-between mt-5">
          <view class="flex items-center">
            <uv-icon name="account" color="#fff" size="20" class="mr-2"></uv-icon>
            <text>账号: {{ user.username }}</text>
          </view>
          <view class="flex items-center">
            <uv-icon name="phone" color="#fff" size="20" class="mr-2"></uv-icon>
            <text>手机号: {{ user.phone }}</text>
          </view>
        </view>
      </view>

      <!-- App系统信息展示 -->
      <view class="mt-3 p-4 bg-white rounded-lg shadow-md">
        <view class="flex justify-between items-center mb-3">
          <view class="flex items-center">
            <view class="h-3 w-0.75 bg-#3254FF mr-1.5"></view>
            <view class="text-4 c-#4E5969 font-bold">系统信息</view>
          </view>
        </view>
        <view class="mt-2.5">
          <view class="flex justify-between items-center">
            <view class="c-#86909C">当前版本号: {{ appVersion.current }}</view>
            <view class="c-#4E5969" v-show="appVersion.current === appVersion.latest">
              已是最新版本
            </view>
          </view>
          <view
            class="flex justify-between items-center mt-3"
            v-show="appVersion.current !== appVersion.latest"
          >
            <view class="text-4 c-#1D2129 font-bold">最新版本: {{ appVersion.latest }}</view>
            <view @click="checkForUpdate" class="flex items-center">
              <uv-button type="primary" shape="circle" size="small" text="开始升级"></uv-button>
            </view>
          </view>
        </view>
      </view>

      <!-- 离线存储 -->
      <view class="mt-3 p-4 bg-white rounded-lg shadow-md">
        <view class="flex justify-between items-center mb-3">
          <view class="flex items-center">
            <view class="h-3 w-0.75 bg-#3254FF mr-1.5"></view>
            <view class="text-4 c-#4E5969 font-bold">离线存储</view>
          </view>
          <view class="flex items-center" @click="syncAllPendingData" v-show="hasPendingData">
            <image class="update w-3.5 h-3.5 mr-1" src="@/static/images/update-icon.png" />
            <text class="font-bold c-#1690ff">数据同步</text>
          </view>
        </view>
        <view class="mt-2.5" v-if="hasPendingData">
          <template v-for="module in pendingData" :key="module.key">
            <view
              v-if="module.data.length > 0"
              class="flex justify-between items-center mt-3 pb-4 border-b-1 border-#e5e6eb"
            >
              <text class="c-#1D2129 font-bold">{{ module.name }} - 离线数据</text>
              <view class="flex items-center">
                <uv-icon
                  name="checkbox-mark"
                  color="#1f94ff"
                  size="28"
                  class="mr-4"
                  @click="syncModulePendingData(module)"
                ></uv-icon>
                <uv-icon
                  name="trash-fill"
                  color="#f56c6c"
                  size="28"
                  @click="clearModulePendingData(module)"
                ></uv-icon>
              </view>
            </view>
          </template>
        </view>
        <view v-else>
          <jh-empty text="暂无离线数据" width="200px" height="120px"></jh-empty>
        </view>
      </view>
    </view>
    <!-- 底部功能按钮 -->
    <view class="absolute bottom-2.5 left-2.5 right-2.5 z-10">
      <uv-button class="w-full mb-3" type="error" @click="clearAllCache">清除缓存</uv-button>
      <uv-button class="w-full" type="primary" @click="handleLogout">退出登录</uv-button>
    </view>

    <!-- 修改密码弹窗 -->
    <uv-popup
      class="password-popup"
      ref="popupRef"
      mode="center"
      :round="10"
      closeable
      @close="handleClose"
    >
      <view class="popup-title mt-2.5 text-center text-base">修改密码</view>
      <uv-form
        labelPosition="left"
        :model="passwordModel"
        :rules="passwordRules"
        ref="passwordForm"
        labelWidth="90"
        class="password-form px-8.75 pb-13.75 w-87.5"
      >
        <uv-form-item label="原始密码" prop="oldpassword" borderBottom>
          <uv-input
            type="password"
            placeholder="请输入原始密码"
            v-model="passwordModel.oldpassword"
            border="none"
            clearable
          ></uv-input>
        </uv-form-item>
        <uv-form-item label="新密码" prop="password" borderBottom>
          <uv-input
            type="password"
            placeholder="请输入新密码"
            v-model="passwordModel.password"
            border="none"
            clearable
          ></uv-input>
        </uv-form-item>
        <uv-form-item label="确认密码" prop="confirmpassword" borderBottom>
          <uv-input
            type="password"
            placeholder="请再次输入新密码"
            v-model="passwordModel.confirmpassword"
            border="none"
            clearable
          ></uv-input>
        </uv-form-item>
      </uv-form>
      <uv-button class="sure-btn absolute bottom-0 w-full" @click="handleSure" type="primary">
        确定
      </uv-button>
    </uv-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '@/store'
import { useToast, useDialog } from '@/utils/modals'
// import { updatePassword } from '@/api/common/index'
import checkUpdate from '@/uni_modules/uni-upgrade-center-app/utils/check-update'
import {
  getAllCachedData,
  syncCacheData,
  clearCachedData,
} from '@/utils/offline/offlineDataManager'

const userStore = useUserStore()
const user = ref({
  picture: '',
  username: '',
  name: '',
  department: '',
  phone: '',
})

const appVersion = ref({
  current: '1.0.0',
  latest: '1.0.0',
})

const popupRef = ref(null)
const passwordModel = ref({
  oldpassword: '',
  password: '',
  confirmpassword: '',
})

const passwordRules = {
  oldpassword: [
    { type: 'string', required: true, message: '请输入原始密码', trigger: ['blur', 'change'] },
  ],
  password: [
    {
      type: 'string',
      required: true,
      message: '密码由数字、字母和特殊符号组成，长度8-16位',
      trigger: ['blur', 'change'],
    },
    {
      pattern: /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&*])[\da-zA-Z~!@#$%^&*]{8,16}$/,
      message: '密码由数字、字母和特殊符号组成，长度8-16位',
      trigger: ['blur', 'change'],
    },
  ],
  confirmpassword: {
    type: 'string',
    required: true,
    trigger: ['blur', 'change'],
    validator: (rule, value, callback) => {
      if (!value && passwordModel.value.password) {
        callback(new Error('请再次输入新密码'))
      } else if (value !== passwordModel.value.password) {
        callback(new Error('两次密码输入不一致'))
      } else {
        callback()
      }
    },
  },
}

const pendingData = computed(() => getAllCachedData())

console.error('pendingData', pendingData.value)
const hasPendingData = computed(() => pendingData.value.some((module) => module.data.length > 0))
const syncAllPendingData = async () => {
  const confirmed = await useDialog('确认数据同步？', {
    showCancelButton: true,
  })
  if (confirmed) {
    await syncCacheData()
  }
}

const syncModulePendingData = async (module) => {
  const confirmed = await useDialog(`确认同步${module.name}缓存？`, {
    showCancelButton: true,
  })
  if (confirmed) {
    await syncCacheData(module)
  }
}

const clearModulePendingData = async (module) => {
  const confirmed = await useDialog(`确认清除${module.name}缓存？`, {
    showCancelButton: true,
  })
  if (confirmed) {
    clearCachedData(module)
  }
}

onMounted(() => {
  const userInfo = userStore.userInfo
  console.log('userInfo', userInfo)
  user.value = {
    picture: userInfo.picture,
    username: userInfo.username,
    name: userInfo.name,
    department: userInfo.department,
    phone: userInfo.phone,
  }
})

const clearAllCache = async () => {
  const confirmed = await useDialog('确认清除所有缓存？清除后需重新登录。', {
    showCancelButton: true,
  })
  if (confirmed) {
    uni.clearStorageSync()
    userStore.reset()
    handleLogout(false)
  }
}

const handleLogout = async (isModal = true) => {
  if (isModal) {
    const confirmed = await useDialog('确认退出登录？', {
      showCancelButton: true,
    })
    if (!confirmed) return
  }

  userStore.clearToken()
  useToast('退出成功')
  uni.navigateTo({ url: '/pages/login/index' })
}

const checkForUpdate = async () => {
  checkUpdate()
    .then((res) => {
      console.log('云函数调用成功:', res)
    })
    .catch((err) => {
      console.error('云函数调用失败:', err)
    })
  if (appVersion.value.current === appVersion.value.latest) {
    useToast('当前已是最新版本')
  } else {
    const confirmed = await useDialog('有新版本，确认更新吗？', {
      showCancelButton: true,
    })
    if (confirmed) {
      useToast('开始更新...')
      // TODO: 实现具体更新逻辑
    }
  }
}

const openPasswordPopup = () => {
  popupRef.value.open()
}

const handleClose = () => {
  popupRef.value.close()
  passwordModel.value.oldpassword = ''
  passwordModel.value.password = ''
  passwordModel.value.confirmpassword = ''
}

const handleSure = () => {
  popupRef.value
    .validate()
    .then(async () => {
      passwordModel.value.username = user.value.username
      try {
        const res = {}
        // await updatePassword(passwordModel.value)
        if (res.code === 200) {
          useToast('密码修改成功')
          handleClose()
          uni.clearStorageSync()
          userStore.logout()
        } else {
          useToast(res.message)
        }
      } catch {
        useToast('网络异常')
      }
    })
    .catch((errors) => {
      console.error('验证失败:', errors)
    })
}
</script>
