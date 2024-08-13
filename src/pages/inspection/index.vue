<route lang="json5">
{
  style: {
    navigationBarTitleText: '',
  },
  needLogin: true,
}
</route>

<template>
  <view class="bg-#f5f5f5 h-full box-border relative overflow-hidden">
    <view class="bg-#fff px-4">
      <uv-form labelPosition="left" label-width="100">
        <uv-form-item label="检核船舶" prop="ship" @click="handleShowShipPicker" required>
          <uv-input
            v-model="selectedShip.shipName"
            disabled
            disabledColor="#ffffff"
            placeholder="请选择船舶"
            border="none"
          ></uv-input>
          <template v-slot:right>
            <uv-icon name="arrow-right"></uv-icon>
          </template>
        </uv-form-item>
        <uv-picker
          ref="shipPicker"
          @confirm="handleShipConfirm"
          :columns="ships"
          keyName="name"
        ></uv-picker>
      </uv-form>
    </view>
    <template v-if="selectedShip.shipId">
      <BlockHeader title="出海人员" bgColor="#f5f5f5" barColor="#3254FF" class="px-2"></BlockHeader>
      <view class="main bg-#f5f5f5 px-2 overflow-hidden">
        <view class="bg-#fff rounded-1 overflow-auto min-h-150">
          <view class="header flex items-center justify-between p-2 rounded-1">
            <view class="flex items-center justify-start mb-2 w-full" v-show="selectedShip.shipId">
              <image class="w-12 h-12 mr-4" src="../../static/images/user-icon-3.png"></image>

              <view class="flex flex-col justify-between flex-1">
                <text class="text-4 text-[#1d2129] leading-5">
                  {{ currentInspectorName || '暂无检核员' }}
                </text>
                <uv-tags
                  class="w-15 mt-1 bg-gray-400"
                  text="安全员"
                  size="mini"
                  type="success"
                ></uv-tags>
              </view>

              <template v-if="shipType === 'boarding'">
                <uv-button
                  v-if="inspectionStatus === 1"
                  type="primary"
                  text="登船检核"
                  @click="handleInspection"
                ></uv-button>
                <uv-button
                  v-else
                  type="error"
                  text="结束登船"
                  :disabled="inspectionStatus === 3 || !isHasOnboarded"
                  @click="handleEndBoarding"
                ></uv-button>
              </template>
              <template v-else>
                <uv-button
                  v-if="inspectionStatus === 1"
                  type="primary"
                  text="下船检核"
                  @click="handleInspection"
                ></uv-button>
                <div v-else class="relative">
                  <uv-button
                    type="error"
                    text="结束下船"
                    :disabled="inspectionStatus === 3 || !isAllOffboarded"
                    @click="handleEndOffboarding"
                  ></uv-button>
                  <div
                    v-if="inspectionStatus === 3 || !isAllOffboarded"
                    class="absolute inset-0 cursor-not-allowed"
                    @click="handleEndOffboarding"
                  ></div>
                </div>
              </template>
            </view>
          </view>
          <view class="flex-1 mx-2 py-2 overflow-auto border-t">
            <uv-grid :col="4" :border="false">
              <template v-for="(person, index) in currentShipUsers" :key="index">
                <!-- 不展示核检员 -->
                <uv-grid-item v-if="person.userId !== userInfo.id">
                  <view class="relative overflow-hidden">
                    <view
                      class="w-full h-full flex flex-col items-center p-2"
                      :class="{
                        'gray-out':
                          shipType === 'offboarding' && !person.offboarded && !person.outsider,
                      }"
                    >
                      <view
                        class="w-12 h-12 rounded-full relative overflow-hidden"
                        :class="{
                          'warning-out': person.outsider,
                        }"
                      >
                        <image
                          class="absolute inset-0 w-full h-full object-cover"
                          src="../../static/images/user-icon-1.png"
                        />
                      </view>

                      <view
                        class="mt-1 text-4 text-[#4e5969] leading-5"
                        :class="{
                          'warning-text': person.outsider,
                        }"
                      >
                        {{ person.name }}
                      </view>
                    </view>
                    <view
                      v-show="
                        inspectionStatus === 2 &&
                        !(shipType === 'offboarding' && person.offboarded && !person.result)
                      "
                      class="absolute top-2 right-2 w-12 h-12 flex justify-end items-start"
                      @click="handlePersonAction(person)"
                    >
                      <image class="w-4 h-4 rounded-full" :src="getImgSrc(person)" />
                    </view>
                  </view>
                </uv-grid-item>
              </template>
            </uv-grid>
          </view>
        </view>
      </view>
    </template>

    <view
      v-show="inspectionStatus === 2"
      class="absolute bottom-0 left-0 right-0 h-16 flex items-center flex-justify-around bg-white"
    >
      <uv-button class="w-35" type="primary" text="开始检核" @click="handleScan"></uv-button>
    </view>

    <uv-empty
      v-if="!selectedShip.shipId"
      icon="../../static/images/empty-ship.png"
      text="请选择检核船舶后再开始检核人员"
      width="80px"
      height="80px"
      marginTop="80px"
    >
      <uv-button
        class="w-35 m-t-2"
        type="primary"
        text="选择船舶"
        @click="handleShowShipPicker"
      ></uv-button>
    </uv-empty>

    <uv-modal
      ref="reasonModal"
      title=""
      @confirm="handleReasonConfirm"
      show-cancel-button="true"
      :asyncClose="true"
      @close="closeModal"
    >
      <view class="slot-content">
        <uv-form
          :model="personData"
          ref="reasonForm"
          :rules="reasonRules"
          label-width="80"
          class="flex-grow-1"
        >
          <uv-form-item label="处理原因" prop="resultText" @click="showResultSelect" required>
            <uv-input
              v-model="personData.resultText"
              readonly
              placeholder="请选择处理原因"
              border="none"
            ></uv-input>
            <template v-slot:right>
              <uv-icon name="arrow-right"></uv-icon>
            </template>
          </uv-form-item>
          <uv-form-item label="备注" prop="remark" :required="+personData.result === 1">
            <uv-textarea
              v-model="personData.remark"
              :placeholder="+personData.result === 1 ? '请输入转乘船舶名称' : '请输入备注'"
              maxlength="200"
              height="50"
            ></uv-textarea>
          </uv-form-item>
        </uv-form>
      </view>
      <uv-action-sheet
        ref="resultSelect"
        :actions="actions"
        title="请选择原因类型"
        @select="handleResultSelect"
      ></uv-action-sheet>
    </uv-modal>
  </view>
</template>

<script lang="ts" setup>
import BlockHeader from '@/components/BlockHeader/index.vue'
import { useToast, useDialog } from '@/utils/modals/index'
import { useInspectionStore, Person, ShipData } from '@/store/inspection'
import { shipList, shipUsers } from '@/service/inspection/index'
import { useUserStore } from '@/store'
import { checkNetwork } from '@/utils/index'
import { cloneDeep } from 'lodash-es'

const reasonModal = ref(null)
const reasonForm = ref(null)
const reasonRules = {
  resultText: [
    {
      required: true,
      message: '请选择处理原因',
      trigger: ['blur', 'change'],
    },
  ],
  remark: [
    {
      validator: (rule, value, callback) => {
        if (+personData.result === 1 && !value) {
          callback(new Error('请输入转乘船舶名称'))
        } else {
          callback()
        }
      },
      trigger: ['blur', 'change'],
    },
  ],
}

const handleReasonConfirm = () => {
  reasonForm.value
    .validate()
    .then(() => {
      personData.offboarded = true
      inspectionStore.updatePerson(
        'offboarding',
        personData.userId,
        personData,
        selectedShip.shipId,
      )
      reasonModal.value.closeLoading()
      reasonModal.value.close()
    })
    .catch(() => {
      reasonModal.value.closeLoading()
    })
}
const closeModal = () => {
  setTimeout(() => {
    Object.keys(personData).forEach((key) => {
      personData[key] = ''
    })
  }, 200)
}
const actions = [
  {
    type: '1',
    name: '已转乘其他船舶',
    // subname: '备注转乘船舶名称',
  },
  {
    type: '2',
    name: '已下船，未打卡',
  },
  {
    type: '3',
    name: '人员失踪',
  },
  {
    type: '4',
    name: '其他',
  },
]
const resultSelect = ref(null)
const showResultSelect = () => {
  resultSelect.value.open()
}
const handleResultSelect = (e) => {
  personData.result = e.type
  personData.resultText = e.name
}
const shipPicker = ref(null)

const userInfo = useUserStore().userInfo
const inspectionStore = useInspectionStore()

const shipType: any = ref('') // 'boarding'登船，'offboarding'下船
const ships = ref([]) // 船舶数据
// 所选船舶
const selectedShip = reactive({
  shipName: '',
  shipId: '',
})
const personData = reactive<Person>({} as Person)
const inspectionStatus = ref(1) // 是否开始检核: 1未开始，2已开始，3已结束

// 动态获取当前船舶数据
const currentShipData: any = ref([]) // 动态船舶数据

// 当前检核员名称
const currentInspectorName = computed(() => {
  if (shipType.value === 'boarding') {
    return userInfo.name
  } else {
    return (currentShipData.value as ShipData)?.inspectorName || ''
  }
})

// 当前船舶的人员数据
const currentShipUsers = computed(() => {
  return (currentShipData.value as ShipData)?.users || []
})

// 是否有登船人员
const isHasOnboarded = computed(() => currentShipUsers.value.some((person) => person.onboarded))
// 是否已下船
const isAllOffboarded = computed(() => currentShipUsers.value.every((person) => person.offboarded))

onLoad((options) => {
  const { type } = options
  shipType.value = type
  if (type === 'boarding') {
    uni.setNavigationBarTitle({
      title: '登船检核',
    })
  } else if (type === 'offboarding') {
    uni.setNavigationBarTitle({
      title: '下船检核',
    })
  }
})

onMounted(async () => {
  console.log('checkNetwork', checkNetwork())
  if (checkNetwork()) {
    const params = shipType.value === 'boarding' ? { option: 1 } : { option: 2 }
    getShipList(params)
  } else {
    ships.value = await inspectionStore.getAllShip({ option: 9 })
  }
})

const handleShowShipPicker = () => {
  if (ships.value.length > 0) {
    shipPicker.value.open()
  } else {
    useToast('暂无可选船舶')
  }
}

// 获取所有船舶
const getShipList = async (params) => {
  const { code, message, result } = await shipList(params)
  if (code === 200) {
    if (result.length > 0) {
      const ary = result.map((item) => {
        return {
          ...item,
          name: `${item.name}-${item.mmsi}`,
        }
      })
      ships.value = [ary]
    } else {
      ships.value = []
    }
  } else {
    useToast(message)
  }
}

// 选择船舶
const handleShipConfirm = async (e: any) => {
  selectedShip.shipName = e.value[0].name
  selectedShip.shipId = e.value[0].shipDataId

  inspectionStatus.value = 2 // 跳过确认步骤

  searchShipData()
}

const searchShipData = async () => {
  if (shipType.value === 'boarding') {
    const shipData = inspectionStore.getCachedCheckData('boarding') || []

    createShipData(shipData)
  } else {
    const shipData = inspectionStore.getCachedCheckData('offboarding', selectedShip.shipId)
    console.log('shipData', shipData)
    if (!shipData) {
      const { code, message, result } = await shipUsers(selectedShip) // TODO: 下船核检无法实现离线
      if (code === 200) {
        if (result) {
          result.inspector = userInfo.id
          result.inspectorName = userInfo.name
          result.departmentId = userInfo.departmentId
          result.departmentName = userInfo.department

          inspectionStore.setCachedCheckData('offboarding', result, selectedShip.shipId)
          currentShipData.value = result
        } else {
          createShipData()
        }
      } else {
        useToast(message)
      }
    } else {
      shipData.inspector = userInfo.id
      shipData.inspectorName = userInfo.name
      shipData.departmentId = userInfo.departmentId
      shipData.departmentName = userInfo.department
      currentShipData.value = shipData
    }
  }
}

const createShipData = (shipData = []) => {
  currentShipData.value = {
    shipId: selectedShip.shipId,
    shipName: selectedShip.shipName,
    departmentId: userInfo.departmentId,
    departmentName: userInfo.department,
    inspector: userInfo.id,
    inspectorName: userInfo.name,
    users: shipData,
  }
  if (shipType.value === 'boarding') {
    inspectionStore.setCachedCheckData('boarding', shipData)
  } else {
    inspectionStore.setCachedCheckData('offboarding', currentShipData.value, selectedShip.shipId)
  }
  console.log('currentShipData', currentShipData.value)
}

const handleInspection = async () => {
  const text = shipType.value === 'boarding' ? '登船检核' : '下船检核'
  await useDialog(`确认进行${text}？`, {
    showCancelButton: true,
  })
  inspectionStatus.value = 2
}

// 扫码检核
const handleScan = async (): Promise<void> => {
  if (!selectedShip.shipId) {
    useToast('请选择船舶')
    return
  }

  try {
    const res = await uni.scanCode({ scanType: ['qrCode'] }) // TODO
    // const res = {
    //   scanType: 'QR_CODE',
    //   path: '',
    //   charSet: 'UTF-8',
    //   result:
    //     '{"userId":"e9ca23d68d884d4ebb19d07889727dae","userName":"admin","departmentId":"1796098221604528130","name": "小白","departmentName":"长江设计集团","createTime": 1721027982182}',
    //   errMsg: 'scanCode:ok',
    // }
    console.log('res===>', res)

    const codeParams = JSON.parse(res.result) || {}
    const timeDiff = Date.now() - codeParams.createTime

    // 判断是否超过 10 分钟 (10 * 60 * 1000 毫秒)
    if (timeDiff > 10 * 60 * 1000) {
      useToast('二维码已失效，请重新生成')
    } else {
      // 二维码有效，继续处理逻辑
      // const numbers = [
      //   '1-1',
      //   '1-2',
      //   '1-3',
      //   '1-4',
      //   '1-5',
      //   '1-6',
      //   '1-7',
      // ]
      // const randomIndex = Math.floor(Math.random() * numbers.length)
      // const randomValue = numbers[randomIndex]
      // numbers.splice(randomIndex, 1)

      const person = {
        ...codeParams,
        // userId: randomValue, // TODO
      }
      const existingPerson = currentShipUsers.value.find((p) => p.userId === person.userId)

      if (existingPerson) {
        if (person.userId === userInfo.id) {
          useToast('核检员无需扫码')
          return
        } else if (shipType.value === 'boarding' && existingPerson.onboarded) {
          useToast('该人员已登船')
          return
        } else if (shipType.value === 'offboarding' && existingPerson.offboarded) {
          useToast('该人员已下船')
          return
        } else {
          shipType.value === 'boarding' && (existingPerson.onboarded = true)
          shipType.value === 'offboarding' && (existingPerson.offboarded = true)
        }
      } else {
        const newPerson: Person = {
          ...person,
          onboarded: shipType.value === 'boarding',
          offboarded: shipType.value === 'offboarding',
          remark: '',
          resultText: '',
          result: '',
        }
        shipType.value === 'offboarding' && (newPerson.outsider = true)
        inspectionStore.addPerson(shipType.value, newPerson, selectedShip.shipId)
      }
      useToast('扫码成功')
      handleScan()
    }
  } catch (error) {
    console.error('扫码失败：', error)
  }
}

const handlePersonAction = async (person: Person) => {
  if (shipType.value === 'boarding') {
    await useDialog(`确认删除人员 ${person.name}？`, {
      showCancelButton: true,
    })
    inspectionStore.removePerson('boarding', person.userId)
    currentShipData.value.users = inspectionStore.cachedBoardingData
  } else {
    Object.assign(personData, person)
    reasonModal.value.open()
  }
}

const inspectionInfo = {
  userId: userInfo.id,
  userName: userInfo.username,
  name: userInfo.name,
  avatar: userInfo.avatar,
  departmentId: userInfo.departmentId,
  departmentName: userInfo.department,
  result: '',
  resultText: '',
  remark: '核检员',
  onboarded: false, // 已上船
  offboarded: false, // 已下船
  outsider: false, // 是否为外船人
}

const handleEndBoarding = async () => {
  await useDialog('确认结束登船？结束后无法在进行人员登船。', {
    showCancelButton: true,
  })

  // 判断是否存在核检员
  const subShipData = cloneDeep(currentShipData.value)
  const userIndex = subShipData.users.findIndex((item) => item.userId === userInfo.id)
  if (userIndex === -1) {
    subShipData.users.push({
      ...inspectionInfo,
      onboarded: true,
    })
  } else {
    subShipData.users[userIndex].onboarded = true
    subShipData.users[userIndex].offboarded = false
  }
  console.error('subShipData===>', subShipData)
  const { code, message } = await inspectionStore.submitCheckData('boarding', subShipData)
  if (code === 200) {
    inspectionStatus.value = 3
    inspectionStore.clearCachedCheckData('boarding')
    uni.navigateBack()
  } else {
    useToast(message)
  }
}

const handleEndOffboarding = async () => {
  if (!isAllOffboarded.value) {
    useToast('尚有人员未进行下船检核')
    return
  }

  await useDialog('确认结束下船？结束后无法在进行人员下船', {
    showCancelButton: true,
  })
  // 判断是否存在核检员
  const subShipData = cloneDeep(currentShipData.value)
  const userIndex = subShipData.users.findIndex((item) => item.userId === userInfo.id)
  if (userIndex === -1) {
    subShipData.users.push({
      ...inspectionInfo,
      offboarded: true,
    })
  } else {
    subShipData.users[userIndex].onboarded = false
    subShipData.users[userIndex].offboarded = true
  }
  console.error('subShipData===>', subShipData)
  const { code, message } = await inspectionStore.submitCheckData('offboarding', subShipData)
  if (code === 200) {
    inspectionStatus.value = 3
    inspectionStore.clearCachedCheckData('offboarding', selectedShip.shipId)
    uni.navigateBack()
  } else {
    useToast(message)
  }
}

const getImgSrc = (person: Person) => {
  if (shipType.value === 'boarding') {
    return '../../static/images/delete-icon.png'
  } else {
    return '../../static/images/edit-icon.png'
  }
}
</script>

<style lang="scss" scoped>
:deep(.uni-input-input) {
  text-align: right;
}
.header {
  background: linear-gradient(360deg, rgba(157, 214, 255, 0.06) 20%, rgba(50, 84, 255, 0.16) 100%);
}
.gray-out {
  opacity: 0.5;
}
.warning-out {
  border: 1px solid #ff7d00;
}
.warning-text {
  color: #ff7d00;
}
</style>
