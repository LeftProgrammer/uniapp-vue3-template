<template>
  <uploadTemplate
    :file-list="uploadFileList"
    multiple
    :max-count="props.limit"
    @after-read="afterRead"
    @delete="deletePic"
    @clickPreview="clickPreview"
    :previewFullImage="previewFullImage"
    accept="image"
    :disabled="props.disabled"
  ></uploadTemplate>
</template>

<script setup>
import uploadTemplate from './uploadTemplate.vue'
import { defineProps, withDefaults, defineEmits, ref, watch } from 'vue'
const baseUrl = import.meta.env.VITE_UPLOAD_BASEURL
const preiview = import.meta.env.VITE_PREVIEW_BASEURL

const props = defineProps({
  modelValue: {
    type: String,
    default: () => {
      return '[]'
    },
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  limit: {
    type: Number,
    default: 10,
  },
  // ['modelValue', 'disabled', 'limit']
})
const emit = defineEmits(['update:modelValue'])
const previewFullImage = ref(false)
watch(
  () => props.modelValue,
  (newValue) => {
    console.log('props.fileList', JSON.parse(newValue))
    if (typeof newValue === 'string') {
      uploadFileList.value = JSON.parse(newValue)
    }
    console.log('显示的文件信息', uploadFileList.value)
  },
  {
    deep: true,
  },
  // { immediate: true },
)

const uploadFileList = ref([])
const deletePic = (event) => {
  uploadFileList.value.splice(event.index, 1)
  emit('update:modelValue', JSON.stringify(uploadFileList.value))
}

const uidGenerator = () => {
  return '-' + parseInt(Math.random() * 10000 + 1, 10)
}

const afterRead = async (event, files, name) => {
  console.log('=======afterRead======>***', event, files, name)
  const lists = [].concat(event.file)
  let fileListLen = uploadFileList.value.length
  lists.forEach((item) => {
    console.log('item', item)
    uploadFileList.value.push({
      ...item,
      status: 'uploading',
      message: '上传中',
    })
  })

  for (let i = 0; i < lists.length; i++) {
    console.log('=======上传图片返回1======>', lists)
    const result = await uploadFilePromise(lists[i].url)
    const item = uploadFileList.value[fileListLen]
    uploadFileList.value.splice(fileListLen, 1, {
      name: result,
      size: item.size,
      type: item.type,
      status: 'success',
      url: preiview + '/' + result, // 拼接上地址
      uid: uidGenerator(),
    })
    fileListLen++
  }
  emit('update:modelValue', JSON.stringify(uploadFileList.value))
}

const uploadFilePromise = (url) => {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: baseUrl,
      filePath: url,
      name: 'file',
      formData: {},
      success: (res) => {
        console.log('=======上传图片返回1======>', url, JSON.parse(res.data))
        setTimeout(() => {
          resolve(JSON.parse(res.data).message)
        }, 1000)
      },
      fail: (err) => {
        reject(err)
      },
    })
  })
}
const clickPreview = ({ deletable, index, isImage, isVideo, name, url }) => {
  console.log('=======点击图片======>', index, isImage, isVideo, url)
  const file = uploadFileList.value[index]
  console.log('文件类型', file)
  previewFile(file)
  // if (fileType.includes('image')) {
  //   previewFullImage.value = true
  // } else {
  //   previewFullImage.value = false
  //   // 单独预览文件

  // }
}

// 预览图片和文件成功
const previewFile = (item) => {
  // 流程步骤: 利用下载文件功能 先生成临时文件 - 调用api打开临时文件里面的内容,从而生成预览的效果,但是这个未能真实的下载到本地
  // 1.pdfUrl  可以直接在浏览器打开  2.一定要在小程序后台配置该pdf的域名 让其可以下载
  uni.showLoading({
    title: '正在打开...',
  })
  const schedule = 0 // 载入进度为0

  const downloadTask = uni.downloadFile({
    url: item.url, // 图片或者文件地址
    success: function (res) {
      // console.log('下载的res', res)
      const filepathss = plus.io.convertLocalFileSystemURL(res.tempFilePath) // 这行代码是获取文件在手机中的绝对路径。
      //  文件打开文件预览
      uni.openDocument({
        filePath: filepathss,
        // fileType: 'pdf',
        success: function (res) {
          uni.hideLoading()
          console.log('打开文档成功')
        },
        fail: function (err) {
          uni.hideLoading()
          uni.showToast({
            title: '没有相关应用打开该文件',
            duration: 1500,
            icon: 'none',
          })
          console.log('打开失败', err)
        },
      })
    },
    fail: function (err) {
      console.log('下载失败原因', err)
      uni.hideLoading()
      uni.showModal({
        title: '您需要授权相册权限',
        success(res) {
          if (res.confirm) {
            uni.openSetting({
              success(res) {},
              fail(res) {
                console.log(res)
              },
            })
          }
        },
      })
    },
  })
  downloadTask.onProgressUpdate((res) => {
    console.log('下载进度' + res.progress)
    // schedule = res.progress
    // console.log('已经下载的数据长度' + res.totalBytesWritten);
    // console.log('预期需要下载的数据总长度' + res.totalBytesExpectedToWrite);
  })
  // console.log(item, this.$url(item.template), '加载的当前文件');
  // this.$apiGet(`/api/file/download/${item.template}`).then(res => {
  // 	console.log(res, '下载的文件');
  // });
}
</script>
