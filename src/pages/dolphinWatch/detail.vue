<route lang="json5">
{
  style: {
    navigationBarTitleText: '观豚日志',
  },
  needLogin: true,
}
</route>
<template>
  <view class="bg-#f5f5f5 h-100% position-relative flex flex-col">
    <view class="content overflow-auto flex-1">
      <view class="bg-#fff px-4 mb-2.5">
        <BlockHeader title="基本资料" bgColor="white" barColor="#FF7D00"></BlockHeader>
        <uv-form labelPosition="left" :model="model" :rules="rules" ref="form" labelWidth="200">
          <uv-form-item
            label="观测日期"
            prop="watchDate"
            :required="true"
            borderBottom
            @click="showPicker('watchDate')"
          >
            <uv-input
              v-model="model.watchDate"
              disabled
              inputAlign="right"
              disabledColor="#ffffff"
              placeholder="请选择观测日期"
              border="none"
            ></uv-input>
            <template v-slot:right>
              <uv-icon name="arrow-right"></uv-icon>
            </template>
          </uv-form-item>
          <uv-form-item
            label="所属船舶"
            prop="shipName"
            :required="true"
            borderBottom
            @click="showPicker('ship')"
          >
            <uv-input
              v-model="model.shipName"
              disabled
              inputAlign="right"
              disabledColor="#ffffff"
              placeholder="请选择所属船舶"
              border="none"
            ></uv-input>
            <template v-slot:right>
              <uv-icon name="arrow-right"></uv-icon>
            </template>
          </uv-form-item>
          <uv-form-item label="观测人员" prop="username" :required="true" borderBottom>
            <uv-input v-model="model.username" inputAlign="right" border="none" readonly></uv-input>
          </uv-form-item>
          <uv-form-item label="是否观测到白海豚" prop="exsitDolphin" :required="true" borderBottom>
            <uv-switch
              v-model="model.exsitDolphin"
              :disabled="isView"
              @change="switchChange"
              asyncChange
            ></uv-switch>
          </uv-form-item>
        </uv-form>
      </view>
      <view>
        <dataForm
          v-for="(item, index) in details"
          :defaForm="item"
          :index="index + 1"
          :key="index"
          :watchDate="model.watchDate"
          @delRecord="delRecord"
          :ref="(el) => (dataFormRef[index] = el)"
          :is-view="isView"
        ></dataForm>
        <view
          class="bg-#fff h-11.75 flex flex-items-center flex-justify-center mb-2.5"
          v-if="!isView && model.exsitDolphin"
          @click="addRecord"
        >
          <uv-image
            src="../../static/dolphinWatch/add-icon.png"
            width="24px"
            height="24px"
            class="mr-2.5"
          ></uv-image>
          新增记录
        </view>
      </view>
    </view>
    <view class="h-16 bg-#fff py-3 px-14" v-if="!isView">
      <uv-button type="primary" color="#3254FF" @click="save" text="保存数据"></uv-button>
    </view>
  </view>
  <uv-calendars ref="calendars" @confirm="confirm" :endDate="nowDate" />
  <uv-picker ref="ship" :columns="shipList" keyName="name" @confirm="confirm"></uv-picker>
</template>

<script setup>
import BlockHeader from '@/components/BlockHeader/index.vue'
import { onLoad } from '@dcloudio/uni-app'
import { useUserStore } from '@/store'
import { queryById, add, edit, getShip, getSaillingShipName } from '@/service/dolphinWatch/index'
import dayjs from 'dayjs'
import dataForm from './dataForm.vue'
import { useToast } from '@/utils/modals/index'
import { useDataBaseStore } from '@/store/database'
import { deepCopy } from '@/utils/index'
// ------------------------------ 通用
const isView = ref(false)
const modalType = ref(null)
const timestampId = ref('')
const form = ref(null)
const nowDate = ref(dayjs(new Date()).format('YYYY-MM-DD'))
onLoad(async (e) => {
  // type 1新增 2编辑 3删除 4查看详情 5暂存数据 6新增且今日提交 7新增且今日有暂存数据
  const { type, id, timestamp } = e
  modalType.value = type
  timestampId.value = timestamp
  isView.value = type === '4'
  await getShipList()
  if (type === '1') {
    model.value.watchDate = nowDate.value
    model.value.username = useUserStore().userInfo.realname
    model.value.exsitDolphin = true
    addRecord()
    getNowShip()
  } else if (type === '5' || type === '7') {
    dataBaseStore.get('dolphinWatch', timestamp).then((res) => {
      model.value = deepCopy(res)
      model.value.exsitDolphin = model.value.exsitDolphin === 1
      const ship = shipList.value[0].find((x) => x.shipDataId === model.value.shipId) || {}
      model.value.shipName = ship.name
      details.value = model.value.details.map((x) => {
        x.isConstructionAffected = x.isConstructionAffected === '1'
        x.startDate = dayjs(x.startDate * 1000).format('HH:mm')
        x.endDate = dayjs(x.endDate * 1000).format('HH:mm')
        x.packUp = type === '7'
        return x
      })
      if (type === '7') {
        details.value.push({
          packUp: false,
          isConstructionAffected: false,
        })
      }
    })
  } else {
    // 查详情
    queryById({ id }).then((res) => {
      model.value = res.result
      model.value.exsitDolphin = model.value.exsitDolphin === 1
      const ship = shipList.value[0].find((x) => x.shipDataId === model.value.shipId) || {}
      model.value.shipName = ship.name
      details.value = res.result.details.map((x) => {
        x.isConstructionAffected = x.isConstructionAffected === '1'
        x.startDate = dayjs(x.startDate * 1000).format('HH:mm')
        x.endDate = dayjs(x.endDate * 1000).format('HH:mm')
        x.packUp = type === '6'
        return x
      })
      if (type === '6') {
        details.value.push({
          packUp: false,
          isConstructionAffected: false,
        })
      }
    })
  }
  console.log('最终的record', details.value)
})
const dataFormRef = ref([])
const dataBaseStore = useDataBaseStore()
const getNowShip = () => {
  // 获取登船船舶
  getSaillingShipName({ dateStr: dayjs(model.value.watchDate).format('YYYY-MM-DD') }).then(
    (res) => {
      const result = res.result || {}
      model.value.shipId = result.shipId
      model.value.shipName = result.shipName
    },
  )
}
/**
 * @description 保存数据
 */
const save = () => {
  form.value
    .validate()
    .then(() => {
      Promise.all(dataFormRef.value.filter((x) => x).map((x) => x.checkForm()))
        .then(() => {
          const obj = deepCopy(model.value)
          obj.exsitDolphin = obj.exsitDolphin ? 1 : 0
          const data = deepCopy(details.value)
          data.forEach((x) => {
            x.isConstructionAffected = x.isConstructionAffected ? '1' : '0'
            x.startDate = dayjs(`${obj.watchDate} ${x.startDate}`).valueOf() / 1000
            x.endDate = dayjs(`${obj.watchDate} ${x.endDate}`).valueOf() / 1000
            // x.pictures = ''
          })
          const params = {
            ...obj,
            details: data,
          }
          const flag = dataBaseStore.set('dolphinWatch', params, false, timestampId.value)
          if (flag) {
            uni.navigateBack()
            return
          }
          const http = !params.id ? add(params) : edit(params)
          http
            .then((res) => {
              useToast(res.message)
              if (res.success) {
                if (modalType.value === '5' || modalType.value === '7')
                  dataBaseStore.del('dolphinWatch', timestampId.value)
                uni.navigateBack()
              }
            })
            .catch(() => {
              dataBaseStore.set('dolphinWatch', params, true, timestampId.value)
              uni.navigateBack()
            })
        })
        .catch(() => {})
    })
    .catch((errors) => {})
}
/**
 * @description 获取船舶
 */
const shipList = ref([[]])
const getShipList = async () => {
  await getShip().then((res) => {
    shipList.value = [res.result]
  })
}
// ------------------------- 基本信息
const model = ref({})
const rules = ref({
  watchDate: {
    type: 'string',
    required: true,
    message: '请填写观测日期',
    trigger: ['blur', 'change'],
  },
  shipName: {
    type: 'string',
    required: true,
    message: '请选择所属船舶',
    trigger: ['blur', 'change'],
  },
  username: {
    type: 'string',
    required: true,
    message: '请填写观测人员',
    trigger: ['blur', 'change'],
  },
  exsitDolphin: {
    type: 'boolean',
    required: true,
    message: '请选择是否观察到白海豚',
    trigger: ['blur', 'change'],
  },
})
// -------------------------- 记录
const details = ref([])
const recordIndex = ref(null)
const addRecord = () => {
  details.value.push({ isConstructionAffected: false, packUp: false })
}
const delRecord = (index) => {
  details.value.splice(index - 1, 1)
}
const switchChange = (e) => {
  if (!e) {
    if (details.value.length > 0) {
      useToast('有记录不可关闭')
    } else {
      model.value.exsitDolphin = false
    }
  } else {
    model.value.exsitDolphin = true
  }
}
// -------------------------- 弹出层
const pickerType = ref('')
const ship = ref(null)
const calendars = ref(null)

const showPicker = (type, index) => {
  if (isView.value) return
  recordIndex.value = index
  pickerType.value = type
  if (type === 'watchDate') calendars.value.open()
  if (type === 'ship') ship.value.open()
}
const confirm = (e) => {
  if (pickerType.value === 'ship') {
    model.value.shipName = e.value[0].name
    model.value.shipId = e.value[0].shipDataId
  } else {
    model.value.watchDate = e.fulldate
    getNowShip()
  }
}
</script>
<style scoped lang="scss">
.content {
  .uv-form {
    :deep(.uv-form-item__body__right__content__slot) {
      justify-content: flex-end;
    }
  }
}
</style>
