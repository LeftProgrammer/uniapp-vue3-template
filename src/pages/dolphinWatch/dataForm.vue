<template>
  <view class="mb-2.5 px-4 bg-#fff">
    <BlockHeader :title="`记录${index}`" bgColor="white" barColor="#066FEC">
      <template v-slot:right>
        <text class="color-#3254FF font-size-3.5 mr-1.75" @click="record.packUp = !record.packUp">
          {{ record.packUp ? '展开' : '收起' }}
        </text>
        <text class="color-#F53F3f font-size-3.5" @click="del" v-if="!isView">删除</text>
      </template>
    </BlockHeader>
    <uv-form
      v-show="!record.packUp"
      labelPosition="left"
      :model="record"
      :rules="rules"
      ref="form"
      labelWidth="140"
    >
      <uv-form-item
        label="出现时间"
        prop="startDate"
        :required="true"
        borderBottom
        @click="showPicker('startDate')"
      >
        <uv-input
          v-model="record.startDate"
          disabled
          inputAlign="right"
          disabledColor="#ffffff"
          placeholder="请选择"
          border="none"
        ></uv-input>
        <template v-slot:right>
          <uv-icon name="arrow-right"></uv-icon>
        </template>
      </uv-form-item>
      <uv-form-item
        label="离开时间"
        prop="endDate"
        :required="true"
        borderBottom
        @click="showPicker('endDate')"
      >
        <uv-input
          v-model="record.endDate"
          disabled
          inputAlign="right"
          disabledColor="#ffffff"
          placeholder="请选择"
          border="none"
        ></uv-input>
        <template v-slot:right>
          <uv-icon name="arrow-right"></uv-icon>
        </template>
      </uv-form-item>
      <uv-form-item label="天气状况" prop="weather" borderBottom>
        <uv-input
          v-model="record.weather"
          inputAlign="right"
          placeholder="请输入"
          border="none"
          :readonly="isView"
        ></uv-input>
      </uv-form-item>
      <uv-form-item label="白海豚位置" prop="position" borderBottom>
        <uv-input
          v-model="record.position"
          inputAlign="right"
          placeholder="例如：52.0,52.0"
          border="none"
          :readonly="isView"
        ></uv-input>
      </uv-form-item>
      <uv-form-item
        label="是否影响施工"
        prop="isConstructionAffected"
        :required="true"
        borderBottom
      >
        <uv-switch v-model="record.isConstructionAffected" :disabled="isView"></uv-switch>
      </uv-form-item>
      <uv-form-item
        v-if="record.isConstructionAffected"
        label="施工状态及采取措施"
        labelPosition="top"
        prop="statusAction"
        :required="true"
        borderBottom
      >
        <uv-textarea
          count
          maxlength="500"
          :disabled="isView"
          v-model="record.statusAction"
          placeholder="请输入"
        ></uv-textarea>
      </uv-form-item>
      <uv-form-item label="附件" prop="dataForm">
        <jh-upload v-model="record.pictures" :disabled="isView" :limit="3" />
      </uv-form-item>
    </uv-form>
  </view>
  <uv-datetime-picker
    ref="datetimePicker"
    :filter="filter"
    mode="datetime"
    :minDate="minDate"
    :maxDate="maxDate"
    @confirm="confirm"
  ></uv-datetime-picker>
</template>

<script setup>
import BlockHeader from '@/components/BlockHeader/index.vue'
import JhUpload from '@/components/jh-upload/index.vue'
import dayjs from 'dayjs'
import { defineEmits, computed, toRefs } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
const emit = defineEmits(['delRecord'])
const props = defineProps({
  index: {
    type: Number,
    default: 1,
  },
  defaForm: {
    type: Object,
    default: () => ({}),
  },
  isView: {
    type: Boolean,
    default: false,
  },
  watchDate: {
    type: String,
    default: '',
  },
})
const { watchDate, isView, defaForm, index } = toRefs(props)
const record = ref({})
onMounted(() => {
  record.value = defaForm.value
})
const filter = (type, options) => {
  if (type === 'minute') {
    return options.filter((option) => option % 5 === 0)
  }
  return options
}
const form = ref(null)
const rules = ref({
  startDate: {
    type: 'string',
    required: true,
    message: '请填写出现时间',
    trigger: ['blur', 'change'],
  },
  endDate: {
    type: 'string',
    required: true,
    message: '请填写出现时间',
    trigger: ['blur', 'change'],
  },
  // position: {
  //   type: 'string',
  //   required: true,
  //   message: '请填写白海豚位置',
  //   trigger: ['blur', 'change'],
  // },
  isConstructionAffected: {
    type: 'boolean',
    required: true,
    message: '请选择是否影响施工',
    trigger: ['blur', 'change'],
  },
  statusAction: {
    type: 'string',
    required: true,
    message: '请填写施工状态及采取措施',
    trigger: ['blur', 'change'],
  },
})
// 时间选择
const datetimePicker = ref(null)
const pickerType = ref('')
const minDate = computed(() => {
  return dayjs(`${watchDate.value} ${record.value.startDate || ' 00:00'}:00`).valueOf()
})
const maxDate = computed(() => {
  return dayjs(`${watchDate.value} ${record.value.endDate || '23:59'}:00`).valueOf()
})

watch(
  record,
  () => {
    console.log('record', record.value)
  },
  {
    deep: true,
  },
)
const showPicker = (type) => {
  if (isView.value) return
  pickerType.value = type
  datetimePicker.value.open()
}
const confirm = (e) => {
  record.value[pickerType.value] = dayjs(e.value).format('HH:mm')
}
// 文件上传
const fileList = ref([])
const VITE_UPLOAD_BASEURL = import.meta.env.VITE_UPLOAD_BASEURL
const afterRead = async (event) => {
  const { file } = event
  const data = new FormData()
  data.append('biz111', 'temp') // 添加 biz 参数
  data.append('file111', file.file) // 添加 file 参数，注意使用 file.file 获取文件对象

  const uploadResult = await uni.uploadFile({
    url: VITE_UPLOAD_BASEURL, // 替换为你的上传地址
    name: 'file',
    data,
  })

  console.error('uploadResult', uploadResult)

  if (uploadResult.statusCode !== 200) {
    throw new Error(`上传失败，状态码：${uploadResult.statusCode}`)
  }
  const response = JSON.parse(uploadResult.data)
  // 处理上传成功后的逻辑，例如更新 formData.attachments
}
const deletePic = () => {}
// 表单校验
const checkForm = () => {
  return new Promise((resolve, reject) => {
    form.value
      .validate()
      .then((res) => {
        resolve()
      })
      .catch((errors) => {
        reject(new Error())
      })
  })
}
const del = () => {
  emit('delRecord', index.value)
}
defineExpose({ checkForm })
</script>
<style scoped lang="scss">
.uv-form {
  :deep(.uv-form-item__body__right__content__slot) {
    justify-content: flex-end;
  }
}
.uv-popup {
  :deep(.uni-picker-view-wrapper) {
    .uv-picker__view__column {
      &:nth-child(1) {
        display: none;
      }
      &:nth-child(2) {
        display: none;
      }
      &:nth-child(3) {
        display: none;
      }
    }
  }
}
</style>
