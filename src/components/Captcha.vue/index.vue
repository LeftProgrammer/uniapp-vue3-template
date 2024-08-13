<template>
  <view class="captcha">
    <uv-input v-model="localValue" placeholder="请输入验证码" border="bottom">
      <template v-slot:suffix>
        <image class="w-20 h-8 rounded-1" :src="captchaSrc" @click="refreshCaptcha" alt="captcha" />
      </template>
    </uv-input>
  </view>
</template>

<script setup>
import { getCaptcha } from '@/service/home/index'

const props = defineProps({
  modelValue: String,
})

const emit = defineEmits(['update:modelValue'])

const localValue = ref(props.modelValue)

const captchaSrc = ref('')

const refreshCaptcha = async () => {
  const { success, result } = await getCaptcha()
  console.log(success, result)
  if (success) {
    captchaSrc.value = result
  } else {
    // 处理获取验证码失败的情况
    captchaSrc.value = '../../static/login/checkcode.png'
  }
}

const validateCaptcha = () => {
  return true
  // return localValue.value === captchaSrc.value
}

watch(localValue, (newValue) => {
  emit('update:modelValue', newValue)
})

onMounted(() => {
  refreshCaptcha()
})

defineExpose({
  validateCaptcha,
  refreshCaptcha,
})
</script>

<style scoped>
.captcha {
  display: flex;
  align-items: center;
}
img {
  cursor: pointer;
}
</style>
