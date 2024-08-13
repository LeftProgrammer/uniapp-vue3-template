<route lang="json5">
{
  style: {
    navigationBarTitleText: '工序数据填报',
  },
  needLogin: true,
}
</route>

<template>
  <view class="bg-#f5f5f5 h-full box-border relative overflow-hidden">
    <view class="absolute top-0 right-0 bottom-18 left-0 overflow-auto">
      <BlockHeader
        :title="'工序名称-' + formData.processName"
        bgColor="white"
        barColor="#FF7D00"
        class="px-2"
      ></BlockHeader>
      <uv-form
        :model="formData"
        ref="form"
        :rules="rules"
        label-width="130"
        class="px-4 bg-white overflow-auto"
      >
        <uv-form-item
          label="施工开始时间"
          prop="startTime"
          borderBottom
          @click="handleOpenTime('start')"
          required
        >
          <uv-input
            v-model="formData.startTime"
            border="none"
            placeholder="请选择开始时间"
            readonly
          />
          <uv-datetime-picker
            ref="startTimePicker"
            v-model="startTime"
            mode="datetime"
            :formatter="formatter"
            :disabled="isViewMode"
            border="none"
            @confirm="handleConfirmStart"
          />
          <template v-slot:right>
            <uv-icon name="arrow-right"></uv-icon>
          </template>
        </uv-form-item>
        <uv-form-item
          label="施工结束时间"
          prop="endTime"
          :min-date="formData.startTime || Date.now()"
          borderBottom
          @click="handleOpenTime('end')"
          required
        >
          <uv-input
            v-model="formData.endTime"
            border="none"
            placeholder="请选择结束时间"
            readonly
          />
          <uv-datetime-picker
            ref="endTimePicker"
            v-model="endTime"
            mode="datetime"
            :min-date="formData.startTime"
            :formatter="formatter"
            :disabled="isViewMode"
            border="none"
            @confirm="handleConfirmEnd"
          />

          <template v-slot:right>
            <uv-icon name="arrow-right"></uv-icon>
          </template>
        </uv-form-item>
        <uv-form-item label="耗时(小时)" prop="useTime" borderBottom required>
          <uv-input v-model="formData.useTime" type="number" :disabled="isViewMode" border="none" />
        </uv-form-item>
        <uv-form-item label="填报人" prop="createName" borderBottom required>
          <uv-input v-model="formData.createName" border="none" readonly />
        </uv-form-item>
        <uv-form-item label="施工单位" prop="unitName" borderBottom readonly required>
          <uv-input v-model="formData.unitName" border="none" readonly />
        </uv-form-item>
        <uv-form-item label="附件上传" prop="file" v-show="checkNetwork()">
          <jh-upload v-model="formData.file" :disabled="isViewMode" />
        </uv-form-item>
      </uv-form>
    </view>
    <view
      class="absolute bottom-0 left-0 right-0 h-16 flex items-center flex-justify-around bg-white z-10"
      v-if="!isViewMode"
    >
      <uv-button class="w-35" type="primary" @click="submitForm">提交</uv-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
import BlockHeader from '@/components/BlockHeader/index.vue'
import JhUpload from '@/components/jh-upload/index.vue'
import { useConstructionStore } from '@/store/construction'
import dayjs from 'dayjs'
import { useUserStore } from '@/store'
import { useToast } from '@/utils/modals'
import { checkNetwork } from '@/utils/index'
// import { useToast } from '@/utils/modals'

interface FormDataType {
  processName: string
  pbsId: string
  processId: string
  startTime: string
  endTime: string
  useTime: number | string
  createBy: string
  createName: string
  unitId: string
  unitName: string
  file: string
  constructionState: number
  submitTime: any
}

const formData = reactive<FormDataType>({
  processName: '',
  pbsId: '',
  processId: '',
  startTime: '',
  endTime: '',
  useTime: '',
  createBy: '',
  createName: '',
  unitId: '',
  unitName: '',
  file: '',
  constructionState: null, // 状态: 1未开始, 2已完成
  submitTime: null,
})

const rules = {
  startTime: [
    {
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请选择施工开始时间'))
        } else {
          callback()
        }
      },
      trigger: ['blur', 'change'],
    },
  ],
  endTime: [
    {
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请选择施工结束时间'))
        } else if (formData.startTime && value <= formData.startTime) {
          callback(new Error('施工结束时间必须在施工开始时间之后'))
        } else {
          callback()
        }
      },
      trigger: ['blur', 'change'],
    },
  ],
  useTime: [
    {
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入耗时时间'))
        } else {
          callback()
        }
      },
      trigger: ['blur', 'change'],
    },
  ],
  createName: [
    {
      required: true,
      message: '请填写填报人',
      trigger: 'blur',
    },
  ],
  unitName: [
    {
      required: true,
      message: '请填写施工单位',
      trigger: 'blur',
    },
  ],
}
const form = ref()
const startTimePicker = ref()
const endTimePicker = ref()
const startTime = ref('')
const endTime = ref('')
const isViewMode = ref(false) // 默认非查看模式

const userInfo = useUserStore().userInfo
const constructionStore = useConstructionStore()

onLoad((options) => {
  const params = JSON.parse(decodeURIComponent(options.item))
  console.log('params', params)
  console.log('userInfo', userInfo)
  // isViewMode.value = !!(params.startTime && params.endTime)
  Object.assign(formData, { ...params })

  formData.createBy = params.createBy || userInfo.username
  formData.createName = params.createName || userInfo.name
  formData.unitId = params.unitId || userInfo.departmentId
  formData.unitName = params.unitName || userInfo.department

  startTime.value = formData.startTime
  endTime.value = formData.endTime
})

const formatter = (type, value) => {
  if (type === 'year') {
    return `${value}年`
  }
  if (type === 'month') {
    return `${value}月`
  }
  if (type === 'day') {
    return `${value}日`
  }
  return value
}

const handleOpenTime = (type) => {
  if (isViewMode.value) return
  if (type === 'start') {
    !startTime.value && (startTime.value = dayjs(Date.now()).format('YYYY-MM-DD HH:mm'))
    startTimePicker.value.open()
  } else if (type === 'end') {
    !endTime.value && (endTime.value = dayjs(Date.now()).format('YYYY-MM-DD HH:mm'))
    endTimePicker.value.open()
  }
}
const handleConfirmStart = (e) => {
  formData.startTime = dayjs(e.value).format('YYYY-MM-DD HH:mm')
  nextTick(() => {
    calculateDuration()
    validateField('startTime')
  })
}
const handleConfirmEnd = (e) => {
  formData.endTime = dayjs(e.value).format('YYYY-MM-DD HH:mm')
  nextTick(() => {
    calculateDuration()
    validateField('endTime')
  })
}

// 计算耗时
const calculateDuration = () => {
  if (formData.startTime && formData.endTime) {
    const startTime = new Date(formData.startTime).getTime()
    const endTime = new Date(formData.endTime).getTime()
    formData.useTime = ((endTime - startTime) / (1000 * 60 * 60)).toFixed(1)
  } else {
    formData.useTime = ''
  }
}

const validateField = (field) => {
  form.value.validateField(field, (errorMessage) => {
    if (errorMessage) {
      console.error(`Field ${field} validation failed:`, errorMessage)
    }
  })
}

// 提交表单
const submitForm = async () => {
  form.value.validate().then(async () => {
    formData.constructionState = 2
    formData.submitTime = dayjs(new Date()).format('YYYY-MM-DD HH:mm')
    const { code, message } = await constructionStore.submitConstructionData(formData)
    if (code === 200) {
      useToast('填报成功')
      uni.navigateBack()
    } else {
      useToast(message)
    }
  })
}
</script>
<style lang="scss" scoped>
:deep(.uv-form) {
  .uni-input-input,
  .uni-input-placeholder,
  .uv-form-item__body__right__message {
    text-align: right;
  }
}
</style>
