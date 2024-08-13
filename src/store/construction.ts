import { defineStore } from 'pinia'
import {
  constructionList,
  getAllProcessesList,
  constructionAddList,
  constructionCommitBatch,
} from '@/service/construction/index'
import { checkNetwork } from '@/utils/index'
import { useToast } from '@/utils/modals'

export interface ConstructionItem {}

export interface ProcessItem {
  id: string
  name: string
  // 其他属性
}

export interface FormDataType {
  processId: string
  processName: string
  pbsId: string
  startTime: string
  endTime: string
  useTime: number | string
  createBy: string
  createName: string
  unitId: string
  unitName: string
  file: string
  constructionState: number
}

export const useConstructionStore = defineStore(
  'construction',
  () => {
    const windTurbineData = ref<ConstructionItem[]>([])
    const cableData = ref<ConstructionItem[]>([])
    const processList = ref<ProcessItem[]>([])
    const pendingSubmissions = ref<FormDataType[]>([]) // 缓存的待提交数据

    // 获取风机数据
    const getWindTurbineData = async () => {
      if (checkNetwork()) {
        const { code, result } = await constructionList({ type: 'B06A01A01' })
        if (code === 200 && result) {
          windTurbineData.value = result
        }
      }
      return windTurbineData.value
    }

    // 获取海缆数据
    const getCableData = async () => {
      if (checkNetwork()) {
        const { code, result } = await constructionList({ type: 'B06A01A02' })
        if (code === 200 && result) {
          cableData.value = result
        }
      }
      return cableData.value
    }

    // 获取所有工序列表
    const getAllProcesses = async () => {
      if (checkNetwork()) {
        const { code, result } = await getAllProcessesList()
        if (code === 200 && result) {
          processList.value = result
        }
      }
      return processList.value
    }

    // 提交数据
    const submitConstructionData = async (formData) => {
      if (checkNetwork()) {
        const params = { constructionLogs: [formData], pbsId: formData.pbsId }
        return await constructionAddList(params)
      } else {
        if (pendingSubmissions.value.length > 0) {
          const index = pendingSubmissions.value.findIndex(
            (item) => item.pbsId === formData.pbsId && item.processId === formData.processId,
          )

          if (index !== -1) {
            pendingSubmissions.value[index] = Object.assign(
              pendingSubmissions.value[index],
              formData,
            )
          } else {
            pendingSubmissions.value.push(formData)
          }
        } else {
          pendingSubmissions.value.push(formData)
        }
        return { code: 200, message: '当前无网络连接，数据已缓存，稍后将自动提交' }
      }
    }

    const clearPendingData = (processId: string) => {
      pendingSubmissions.value = pendingSubmissions.value.filter(
        (data) => data.processId !== processId,
      )

      console.error('clearPendingData', pendingSubmissions.value)
    }

    const clearAllPendingData = () => {
      pendingSubmissions.value = []
    }

    // TODO: 上传图片的处理
    // 同步缓存的待提交数据
    const syncPendingData = async () => {
      console.error('construction-pendingSubmissions', pendingSubmissions.value)
      if (!checkNetwork()) {
        throw new Error('当前无网络连接，请在有网环境下操作')
      }
      const params = pendingSubmissions.value
      const { code, result = [], success } = await constructionCommitBatch(params)
      console.error('construction-code, result, success', code, result, success)
      if (code === 200) {
        if (success) {
          result.forEach((item) => {
            if (item.code === 0) {
              clearPendingData(item.processId)
            }
          })
        } else {
          useToast('部分数据同步失败')
        }
      } else {
        throw new Error('同步数据失败，请稍后重试')
      }
    }

    // 清除所有数据
    const clearAllData = () => {
      windTurbineData.value = []
      cableData.value = []
      processList.value = []
      pendingSubmissions.value = []
    }

    return {
      windTurbineData,
      cableData,
      processList,
      pendingSubmissions,
      getWindTurbineData,
      getCableData,
      getAllProcesses,
      submitConstructionData,
      clearAllPendingData,
      syncPendingData,
      clearAllData,
    }
  },
  {
    persist: {
      storage: localStorage, // 使用 localStorage 持久化存储
      paths: ['windTurbineData', 'cableData', 'processList', 'pendingSubmissions'], // 需要持久化的数据路径
    },
  },
)
