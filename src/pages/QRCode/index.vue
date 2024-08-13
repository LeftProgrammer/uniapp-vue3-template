<route lang="json5">
{
  style: {
    navigationBarTitleText: '通行码',
  },
  needLogin: true,
}
</route>

<template>
  <view class="px-2.5 py-3.5 h-100% box overflow-auto">
    <view class="bg-white border-rd-2 pt-3 px-1 pb-1 mb-2.5">
      <view class="font-size-8 line-height-11 color-#1d2129 mb-1.5 text-center">
        {{ userInfo.name }}
      </view>
      <view class="font-size-4 line-height-5 color-#86909c text-center mb-2.5">
        {{ userInfo.phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3') }}
      </view>
      <view class="mb-2.5 flex justify-center">
        <uv-qrcode ref="qrcode" size="194px" :value="qrContent"></uv-qrcode>
      </view>
      <view class="mb-5.5 flex justify-center">
        <text class="color-#4E5969 font-size-4 line-height-5 mr-2">
          {{ dateStr }}
        </text>
        <uv-icon name="reload" size="14" color="#4e5969" @click="refresh"></uv-icon>
      </view>
      <uv-notice-bar
        :icon="false"
        color="#ff9a2e"
        bgColor="#ffece5"
        :text="`您的编号为 ${userInfo.code}，请勿将二维码给他人使用`"
      ></uv-notice-bar>
    </view>
    <view class="bg-white border-rd-2 p-4">
      <view class="font-size-4.5 color-#ff7d00 line-height-6">乘船注意事项</view>
      <view
        class="font-size-3.5 line-height-6 color-#4e5969"
        v-for="item in list"
        :key="item.value"
      >
        {{ item.value }}、{{ item.text }}
      </view>
    </view>
  </view>
</template>

<script setup>
import { useDictionaryStore } from '@/store/dict'
import { useUserStore } from '@/store'
const dateStr = ref('')
const timer = ref(null)
const updateTime = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const date = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  dateStr.value = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`
}
timer.value = setInterval(updateTime, 1000)
/**
 * @description 刷新二维码
 */
const qrcode = ref('qrcode')
const refresh = () => {
  qrContent.value = JSON.stringify({
    userId: id,
    userName: username,
    name,
    departmentId,
    departmentName: department,
    createTime: new Date().getTime(),
  })
  qrcode.value.remake()
}
const userInfo = reactive(useUserStore().userInfo)
const { id, username, name, department, departmentId } = userInfo
const qrContent = ref(
  JSON.stringify({
    userId: id,
    userName: username,
    name,
    departmentId,
    departmentName: department,
    createTime: new Date().getTime(),
  }),
)
const list = ref([])
/**
 * @description 获取字典
 */
const fetchValue = async () => {
  const dictionaryStore = useDictionaryStore()
  list.value = await dictionaryStore.get('boating_precautions')
}
fetchValue()
// 在组件销毁前清除定时器
onUnmounted(() => {
  clearInterval(timer.value)
})
</script>
<style lang="scss" scoped>
.box {
  background: linear-gradient(141deg, #3254ff 0%, #75b5ff 33%, #ffffff 100%);
}
</style>
