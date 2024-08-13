<route lang="json5">
{
  style: {
    navigationBarTitleText: '新增避风通知',
  },
  needLogin: true,
}
</route>

<template>
  <view class="bg-#f5f5f5 h-full box-border relative overflow-hidden">
    <view class="absolute top-0 right-0 bottom-18 left-0 overflow-auto">
      <BlockHeader title="基础信息" bgColor="white" barColor="#FF7D00" class="px-2"></BlockHeader>
      <uv-form
        :model="formData"
        ref="form"
        :rules="rules"
        label-width="130"
        class="px-4 bg-white overflow-auto"
      >
        <uv-form-item label="通知编号" prop="code" borderBottom required>
          <uv-input
            v-model="formData.code"
            border="none"
            placeholder="请输入通知编号"
            :disabled="isViewMode"
          />
        </uv-form-item>
        <uv-form-item label="通知名称" prop="name" borderBottom required>
          <uv-input
            v-model="formData.name"
            border="none"
            placeholder="请输入通知名称"
            :disabled="isViewMode"
          />
        </uv-form-item>
        <uv-form-item
          label="计划避风开始时间"
          prop="planStartDate"
          borderBottom
          @click="handleOpenTime('start')"
          required
        >
          <uv-input
            v-model="formData.planStartDate"
            border="none"
            placeholder="请选择开始时间"
            readonly
          />
          <uv-datetime-picker
            ref="planStartDatePicker"
            v-model="planStartDate"
            mode="datetime"
            :min-date="nowDate"
            :disabled="isViewMode"
            :formatter="formatter"
            border="none"
            @confirm="handleConfirmStart"
          />
          <template v-slot:right>
            <uv-icon name="arrow-right"></uv-icon>
          </template>
        </uv-form-item>
        <uv-form-item
          label="计划避风结束时间"
          prop="planEndDate"
          borderBottom
          @click="handleOpenTime('end')"
          required
        >
          <uv-input
            v-model="formData.planEndDate"
            border="none"
            placeholder="请选择结束时间"
            readonly
          />
          <uv-datetime-picker
            ref="planEndDatePicker"
            v-model="planEndDate"
            mode="datetime"
            :min-date="formData.planStartDate || nowDate"
            :disabled="isViewMode"
            :formatter="formatter"
            border="none"
            @confirm="handleConfirmEnd"
          />

          <template v-slot:right>
            <uv-icon name="arrow-right"></uv-icon>
          </template>
        </uv-form-item>
        <uv-form-item
          label="截止上报时间"
          prop="deadline"
          borderBottom
          @click="handleOpenTime('deadline')"
          required
        >
          <uv-input
            v-model="formData.deadline"
            border="none"
            placeholder="请选择截止上报时间"
            readonly
          />
          <uv-datetime-picker
            ref="deadlinePicker"
            v-model="deadline"
            mode="datetime"
            :disabled="isViewMode"
            :formatter="formatter"
            border="none"
            @confirm="handleConfirmDeadline"
          />

          <template v-slot:right>
            <uv-icon name="arrow-right"></uv-icon>
          </template>
        </uv-form-item>
        <uv-form-item
          label="联系人"
          prop="contactInfo"
          borderBottom
          @click="handleOpenSelect1"
          required
        >
          <view class="text-wrap break-all">{{ contactInfo }}</view>
          <template v-slot:right>
            <uv-icon name="arrow-right"></uv-icon>
          </template>
          <jh-select
            :list="allPerson1"
            ref="personSelect1"
            reverse
            textField="name"
            valueField="id"
            :show="selectShow1"
            @confirm="confirmSelect1"
            @close="onCloseSelect1"
          ></jh-select>
        </uv-form-item>
        <uv-form-item
          label="通知人员"
          prop="receiverInfo"
          borderBottom
          required
          @click="handleOpenSelect2"
        >
          <view v-show="formData.receiverInfo.length > 0" class="text-wrap break-all">
            {{ receiverInfo }}
            <!-- <uv-tags
              v-for="(item, index) in formData.receiverInfo"
              :key="index"
              :text="item?.name + '-' + item?.phone"
              plain
              type="info"
            ></uv-tags> -->
          </view>
          <template v-slot:right>
            <uv-icon name="arrow-right"></uv-icon>
          </template>

          <jh-select
            :list="allPerson2"
            ref="personSelect2"
            reverse
            textField="name"
            valueField="id"
            multiple
            :show="selectShow2"
            @confirm="confirmSelect2"
            @close="onCloseSelect2"
          ></jh-select>
        </uv-form-item>

        <uv-form-item label="避风内容" prop="content" borderBottom>
          <uv-textarea
            v-model="formData.content"
            placeholder="请输入避风内容"
            :disabled="isViewMode"
          ></uv-textarea>
        </uv-form-item>
        <uv-form-item label="附件上传" prop="file">
          <jh-upload v-model="formData.file" :disabled="false" />
        </uv-form-item>
      </uv-form>
    </view>
    <view
      class="absolute bottom-0 left-0 right-0 h-16 flex items-center flex-justify-around bg-white z-10"
      v-if="[0, 1].includes(formData.state)"
    >
      <template v-if="formData.state === 0">
        <uv-button class="w-35" type="primary" :plain="true" @click="submitForm('save')">
          保存草稿
        </uv-button>
        <uv-button class="w-35" type="primary" @click="submitForm('release')">发布</uv-button>
      </template>
      <uv-button class="w-35" v-if="formData.state === 1" type="primary" @click="submitForm('end')">
        结束避风
      </uv-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
import BlockHeader from '@/components/BlockHeader/index.vue'
import JhSelect from '@/components/jh-select/index.vue'
import dayjs from 'dayjs'
import { cloneDeep, pick, map, isString } from 'lodash-es'
import JhUpload from '@/components/jh-upload/index.vue'
import {
  noticeAdd,
  noticeEdit,
  noticeRelease,
  noticeSetEnd,
} from '@/service/windShelter/notice/index'
import { getAllPerson } from '@/service/common/index'

// import { useUserStore } from '@/store'
import { useToast } from '@/utils/modals'

interface FormDataType {
  id: string
  code: string
  name: string
  planStartDate: string
  planEndDate: string
  deadline: string
  contactInfo: any
  receiverInfo: any
  content: string
  file: string
  state: number
}

const formData = reactive<FormDataType>({
  id: '',
  code: '',
  name: '',
  planStartDate: '',
  planEndDate: '',
  deadline: '',
  contactInfo: {},
  receiverInfo: [],
  content: '',
  file: '',
  state: 0, // 状态: 0草稿, 1已发布, 2已结束
})

const rules = {
  code: [
    {
      required: true,
      message: '请输入通知编号',
      trigger: ['blur', 'change'],
    },
  ],
  name: [
    {
      required: true,
      message: '请输入通知名称',
      trigger: ['blur', 'change'],
    },
  ],
  planStartDate: [
    {
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请选择计划避风开始时间'))
        }
        // else if (value < nowDate) {
        //   callback(new Error('计划开始时间需晚于当前时间'))
        // }
        else {
          callback()
        }
      },
      trigger: ['blur', 'change'],
    },
  ],
  planEndDate: [
    {
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请选择计划避风结束时间'))
        } else if (formData.planStartDate && value <= formData.planStartDate) {
          callback(new Error('计划结束时间须在计划开始时间之后'))
        } else {
          callback()
        }
      },
      trigger: ['blur', 'change'],
    },
  ],
  deadline: [
    {
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请选择截止上报时间'))
        } else if (!(value >= nowDate && formData.planEndDate && value <= formData.planEndDate)) {
          callback(new Error('截止上报时间须在当前时间之后且在计划结束时间之前'))
        } else {
          callback()
        }
      },
      trigger: ['blur', 'change'],
    },
  ],
  contactInfo: [
    {
      validator: (rule, value, callback) => {
        if (!value || !value.name) {
          //   callback(new Error('请选择联系人'))
          callback()
        } else {
          callback()
        }
      },
      trigger: ['blur', 'change'],
    },
  ],
  receiverInfo: [
    {
      validator: (rule, value, callback) => {
        if (!value || value.length === 0) {
          callback(new Error('请选择通知人员'))
        } else {
          callback()
        }
      },
      trigger: ['blur', 'change'],
    },
  ],
}
const VITE_UPLOAD_BASEURL = import.meta.env.VITE_UPLOAD_BASEURL
const nowDate = dayjs(Date.now()).format('YYYY-MM-DD HH:mm')
const allPerson1 = ref([])
const allPerson2 = ref([])
const form = ref()
const planStartDatePicker = ref()
const planEndDatePicker = ref()
const deadlinePicker = ref()
const planStartDate = ref()
const planEndDate = ref()
const deadline = ref()

const selectShow1 = ref(false)
const selectShow2 = ref(false)
const contactInfo = ref('')
const receiverInfo = ref('')

const isViewMode = ref(false) // 默认非查看模式

// const userInfo = useUserStore().userInfo

onLoad((options) => {
  const params = JSON.parse(decodeURIComponent(options.item))
  console.log('params', params)
  nextTick(() => {
    Object.assign(formData, { ...params })

    if ([1, 2].includes(params.state)) {
      isViewMode.value = true
      uni.setNavigationBarTitle({
        title: '避风通知详情',
      })
    } else {
      isViewMode.value = false
      uni.setNavigationBarTitle({
        title: '新增避风通知',
      })
    }

    planStartDate.value = formData.planStartDate
    planEndDate.value = formData.planEndDate
    deadline.value = formData.deadline

    if (isString(formData.contactInfo)) {
      formData.contactInfo = JSON.parse(formData.contactInfo)
    } else {
      formData.contactInfo = {}
    }
    if (Object.keys(formData.contactInfo).length > 0) {
      contactInfo.value = `${formData.contactInfo.name}-${formData.contactInfo.phone}`
    }
    if (isString(formData.receiverInfo)) {
      formData.receiverInfo = JSON.parse(formData.receiverInfo)
    } else {
      formData.receiverInfo = []
    }
    if (formData.receiverInfo.length > 0) {
      receiverInfo.value = formData.receiverInfo
        .map((item) => `${item.name}-${item.phone}`)
        .join('; ')
    }
    console.log('formData', formData)
  })
  getPerson()
})

const getPerson = () => {
  return new Promise((resolve, reject) => {
    getAllPerson()
      .then((res) => {
        const { code, result = {} } = res
        if (code === 200) {
          allPerson1.value = cloneDeep(result.records || [])
          const obj = allPerson1.value.find((item) => item.id === formData.contactInfo?.id)
          obj && (obj.checked = true)

          allPerson2.value = cloneDeep(result.records || [])
          allPerson2.value.forEach((item) => {
            item.checked = false
            formData.receiverInfo.forEach((item2) => {
              if (item.id === item2.id) {
                item.checked = true
              }
            })
          })
        }
        resolve(result.records)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const handleOpenSelect1 = () => {
  if (isViewMode.value) return
  selectShow1.value = true
}
const handleOpenSelect2 = () => {
  if (isViewMode.value) return
  selectShow2.value = true
}
const confirmSelect1 = (e) => {
  formData.contactInfo = pick(e.options, ['id', 'name', 'phone'])
  contactInfo.value = `${formData.contactInfo.name}-${formData.contactInfo.phone}`
  onCloseSelect1()
  validateField('contactInfo')
}
const confirmSelect2 = (e) => {
  formData.receiverInfo = map(e.options, (item) => pick(item, ['id', 'name', 'phone']))
  receiverInfo.value = formData.receiverInfo?.map((item) => `${item.name}-${item.phone}`).join('; ')
  onCloseSelect2()
  validateField('receiverInfo')
}
const onCloseSelect1 = () => {
  selectShow1.value = false
}
const onCloseSelect2 = () => {
  selectShow2.value = false
}

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
    !planStartDate.value && (planStartDate.value = nowDate)
    planStartDatePicker.value.open()
  } else if (type === 'end') {
    !planEndDate.value && (planEndDate.value = nowDate)
    planEndDatePicker.value.open()
  } else if (type === 'deadline') {
    !deadline.value && (deadline.value = nowDate)
    deadlinePicker.value.open()
  }
}
const handleConfirmStart = (e) => {
  formData.planStartDate = dayjs(e.value).format('YYYY-MM-DD HH:mm')
  validateField('planStartDate')
}
const handleConfirmEnd = (e) => {
  formData.planEndDate = dayjs(e.value).format('YYYY-MM-DD HH:mm')
  validateField('planEndDate')
}
const handleConfirmDeadline = (e) => {
  console.error('handleConfirmDeadline', e)
  formData.deadline = dayjs(e.value).format('YYYY-MM-DD HH:mm')
  validateField('deadline')
}

watch(
  () => formData.file,
  (e) => {
    console.log('文件资源发生变化', e)
  },
)
const validateField = (field) => {
  form.value.validateField(field, (errorMessage) => {
    if (errorMessage) {
      console.error(`Field ${field} validation failed:`, errorMessage)
    }
  })
}

// 提交表单
const submitForm = async (type) => {
  form.value.validate().then(async () => {
    const params = cloneDeep(formData)
    params.contactInfo = JSON.stringify(formData.contactInfo)
    params.receiverInfo = JSON.stringify(formData.receiverInfo)
    let res
    if (type === 'save') {
      if (!formData.id) {
        res = await noticeAdd(params)
      } else {
        res = await noticeEdit(params)
      }
    } else if (type === 'release') {
      res = await noticeRelease(params)
    } else if (type === 'end') {
      res = await noticeSetEnd(params)
    }
    const { code, message } = res
    if (code === 200) {
      useToast('操作成功')
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
