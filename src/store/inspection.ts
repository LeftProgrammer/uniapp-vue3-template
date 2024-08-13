import { defineStore } from 'pinia'
import { ref } from 'vue'
import { shipList, shipLeave, shipBack } from '@/service/inspection'
import { checkNetwork } from '@/utils/index'
import { useToast } from '@/utils/modals'

export interface Ship {
  id: string
  name: string
  shipownerName?: string
  shipDataId?: string
  mmsi?: string
  isOut?: string
}

export interface Person {
  userId?: string
  userName?: string
  name?: string
  avatar?: string
  departmentId?: string
  departmentName?: string
  result?: string | number
  resultText?: string
  remark?: string
  onboarded?: boolean // 已上船
  offboarded?: boolean // 已下船
  outsider?: boolean // 是否为外船人
}

export interface ShipData {
  shipId: string
  shipName: string
  departmentId?: string
  departmentName?: string
  inspector?: string
  inspectorName?: string
  users: Person[]
}

export const useInspectionStore = defineStore(
  'inspection',
  () => {
    const ships = ref<any>([])

    const cachedBoardingData = ref<Person[]>([]) // 缓存登船的核检数据
    const cachedOffboardingData = ref<Record<string, ShipData>>({}) // 缓存下船的核检数据

    const pendingBoardingSubmissions = ref<ShipData[]>([]) // 缓存提交的登船数据
    const pendingOffboardingSubmissions = ref<ShipData[]>([]) // 缓存提交的下船数据

    // 获取所有船只
    const getAllShip = async (params: any) => {
      if (checkNetwork()) {
        const { code, result } = await shipList(params)
        if (code === 200 && result && result.length > 0) {
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
        useToast('当前无网络连接，使用缓存数据')
      }
      return ships.value
    }

    // 获取缓存的核检数据
    const getCachedCheckData = (type: 'boarding' | 'offboarding', shipId?: string): any => {
      if (type === 'boarding') {
        return cachedBoardingData.value
      } else {
        return cachedOffboardingData.value[shipId!]
      }
    }

    // 设置缓存的核检数据
    const setCachedCheckData = (
      type: 'boarding' | 'offboarding',
      data: any | ShipData | Person[],
      shipId?: string,
    ): void => {
      if (type === 'boarding') {
        cachedBoardingData.value = data
      } else {
        cachedOffboardingData.value[shipId!] = data
      }
    }

    // 添加人员到缓存
    const addPerson = (type: 'boarding' | 'offboarding', person: Person, shipId?: string): void => {
      if (type === 'boarding') {
        cachedBoardingData.value.push(person)
      } else {
        if (!cachedOffboardingData.value[shipId!]) {
          cachedOffboardingData.value[shipId] = {
            shipId,
            shipName: '', // 根据实际情况设置船名
            departmentId: '',
            departmentName: '',
            inspector: '', // 根据实际情况设置核检员
            inspectorName: '',
            users: [],
          }
        }
        cachedOffboardingData.value[shipId!].users.push(person)
      }
    }

    // 修改缓存中的人员
    const updatePerson = (
      type: 'boarding' | 'offboarding',
      personId: string,
      updatedPerson: Partial<Person>,
      shipId?: string,
    ): void => {
      if (type === 'boarding') {
        const personIndex = cachedBoardingData.value.findIndex((p) => p.userId === personId)
        if (personIndex !== -1) {
          Object.assign(cachedBoardingData.value[personIndex], updatedPerson)
        }
      } else {
        const shipData = cachedOffboardingData.value[shipId!]
        if (shipData) {
          const personIndex = shipData.users.findIndex((p) => p.userId === personId)
          if (personIndex !== -1) {
            Object.assign(shipData.users[personIndex], updatedPerson)
          }
        }
      }
    }

    // 从缓存中移除人员
    const removePerson = (
      type: 'boarding' | 'offboarding',
      personId: string,
      shipId?: string,
    ): void => {
      if (type === 'boarding') {
        cachedBoardingData.value = cachedBoardingData.value.filter((p) => p.userId !== personId)
      } else {
        const shipData = cachedOffboardingData.value[shipId!]
        if (shipData) {
          shipData.users = shipData.users.filter((p) => p.userId !== personId)
        }
      }
    }

    // 清除缓存的核检数据
    const clearCachedCheckData = (type: 'boarding' | 'offboarding', shipId?: string): void => {
      if (type === 'boarding') {
        cachedBoardingData.value = []
      } else {
        delete cachedOffboardingData.value[shipId!]
      }
    }

    // 清除所有缓存的核检数据
    const clearAllCachedCheckData = (type?: 'boarding' | 'offboarding'): void => {
      if (type === 'boarding' || !type) {
        cachedBoardingData.value = []
      }
      if (type === 'offboarding' || !type) {
        cachedOffboardingData.value = {}
      }
    }

    // 提交核检数据
    const submitCheckData = async (type: 'boarding' | 'offboarding', shipData: ShipData) => {
      const submitFunc = type === 'boarding' ? shipLeave : shipBack
      const pendingSubmissions =
        type === 'boarding' ? pendingBoardingSubmissions : pendingOffboardingSubmissions

      if (checkNetwork()) {
        const { code, message } = await submitFunc(shipData)
        if (code === 200) {
          if (type === 'boarding') {
            clearCachedCheckData('boarding')
          } else {
            clearCachedCheckData('offboarding', shipData.shipId)
          }
          useToast(`${type === 'boarding' ? '登船' : '下船'}数据提交成功`)
          return { code, message }
        } else {
          useToast(message)
          return { code, message }
        }
      } else {
        pendingSubmissions.value.push(shipData)
        useToast('当前无网络连接，数据已缓存，稍后将自动提交')
        return { code: 200, message: '数据已缓存' }
      }
    }

    // 清除缓存中的待提交数据
    const clearPendingData = (type: 'boarding' | 'offboarding', shipId: string) => {
      const pendingSubmissions =
        type === 'boarding' ? pendingBoardingSubmissions : pendingOffboardingSubmissions
      pendingSubmissions.value = pendingSubmissions.value.filter((data) => data.shipId !== shipId)
    }

    // 清除缓存中的所有待提交数据
    const clearAllPendingData = (type?: 'boarding' | 'offboarding') => {
      if (type === 'boarding' || !type) {
        pendingBoardingSubmissions.value = []
      }
      if (type === 'offboarding' || !type) {
        pendingOffboardingSubmissions.value = []
      }
    }

    // 同步缓存的待提交数据
    const syncPendingData = async (type?: 'boarding' | 'offboarding') => {
      if (checkNetwork()) {
        if (type === 'boarding' || !type) {
          // 同步登船数据
          const boardingSubmissions = [...pendingBoardingSubmissions.value]
          pendingBoardingSubmissions.value = []
          for (const data of boardingSubmissions) {
            await submitCheckData('boarding', data)
            clearPendingData('boarding', data.shipId)
          }
        }

        if (type === 'offboarding' || !type) {
          // 同步下船数据
          const offboardingSubmissions = [...pendingOffboardingSubmissions.value]
          pendingOffboardingSubmissions.value = []
          for (const data of offboardingSubmissions) {
            await submitCheckData('offboarding', data)
            clearPendingData('offboarding', data.shipId)
          }
        }
      } else {
        // useToast('当前无网络连接，请在有网环境下操作')
        throw new Error('当前无网络连接，请在有网环境下操作')
      }
    }

    return {
      ships,
      cachedBoardingData,
      cachedOffboardingData,
      pendingBoardingSubmissions,
      pendingOffboardingSubmissions,
      getAllShip,
      getCachedCheckData,
      setCachedCheckData,
      addPerson,
      updatePerson,
      removePerson,
      clearCachedCheckData,
      clearAllCachedCheckData,
      submitCheckData,
      clearPendingData,
      clearAllPendingData,
      syncPendingData,
    }
  },
  {
    persist: {
      storage: localStorage, // 使用 localStorage 持久化存储
      paths: [
        'ships',
        'cachedBoardingData',
        'cachedOffboardingData',
        'pendingBoardingSubmissions',
        'pendingOffboardingSubmissions',
      ], // 需要持久化的数据路径
    },
  },
)
