<template>
  <uni-file-picker
    v-if="!disabled"
    :auto-upload="true"
    :limit="limit"
    v-model="localImageValue"
    file-mediatype="image"
    mode="grid"
    @select="select"
    @progress="progress"
    @success="success"
    @fail="fail"
    name="test"
    :title="'最多选择' + limit + '张图片'"
  />
  <div v-else class="preview">
    <img
      v-for="(item, i) in localImageValue"
      @click="previewImage(item.url)"
      class="viewImg"
      :src="item.url"
      :key="i"
    />
  </div>
</template>

<script setup>
import { useUserStore } from '@/store'
import { ref, watch } from 'vue'
const baseUrl = import.meta.env.VITE_UPLOAD_BASEURL

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  limit: {
    type: Number,
    default: 9,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const localImageValue = ref([])

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      localImageValue.value = val.split(',').map((url) => ({ url }))
    }
  },
  { immediate: true },
)

watch(
  localImageValue,
  (val) => {
    const urls = val.map((item) => item.url)
    emit('update:modelValue', urls.join(','))
  },
  { deep: true },
)
const userStore = useUserStore()
const updata = async (filePath) => {
  console.log('=======上传图片======>', baseUrl, filePath)
  await uni.uploadFile({
    url: baseUrl,
    filePath,
    header: {
      // "Content-Type": "multipart/form-data",
      Accept: '*/*',
      'X-Access-Token': userStore.token,
    },
    formData: {},
    success(res) {
      const response = JSON.parse(res.data)
      console.log('=======上传图片返回======>', res)
      if (response.data.url !== undefined) {
        localImageValue.value.push({ url: response.data.url })
        uni.showToast({
          title: '上传图片成功',
          duration: 2000,
        })
      } else {
        uni.showToast({
          title: '上传图片失败,请重试!',
          icon: 'none',
          duration: 2000,
        })
      }
    },
    fail(err) {
      console.log('=======上传图片失败======>', err)
      uni.showToast({
        title: '上传图片失败,请重试!',
        icon: 'none',
        duration: 2000,
      })
    },
  })
}

const select = async (e) => {
  console.log('e', e.tempFilePaths)
  // 使用for循环
  for (let i = 0; i < e.tempFilePaths.length; i++) {
    await updata(e.tempFilePaths[i])
  }

  // e.tempFilePaths.forEach((item) => {
  //   updata(item)
  // })
}

const progress = (e) => {
  console.log('上传进度：', e)
}

const success = (e) => {
  console.log('上传成功')
}

const fail = (e) => {
  console.log('上传失败：', e)
}

const previewImage = (url) => {
  uni.previewImage({
    urls: [url],
  })
}
</script>

<style lang="scss" scoped>
.preview {
  display: grid;
  grid-template-columns: 240rpx 240rpx 240rpx; // 三列
  /* 设置间距 */
  grid-gap: 20rpx;
  .viewImg {
    width: 240rpx;
    height: 240rpx;
  }
}
</style>
