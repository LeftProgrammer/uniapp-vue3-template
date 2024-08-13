// offlineDataManager.ts
import { useConstructionStore } from '@/store/construction'
import { useInspectionStore } from '@/store/inspection'
import { fetchBaseData } from '@/utils/offline/fetchBaseData'
import { checkNetwork } from '@/utils/index'
import { useToast } from '@/utils/modals'

interface moduleItem {
  key: string
  name: string
  data: any
}

const getStores = () => {
  const constructionStore = useConstructionStore()
  const inspectionStore = useInspectionStore()
  return { constructionStore, inspectionStore }
}

const fetchDataAndCache = async (): Promise<void> => {
  console.error('fetchDataAndCache===>', fetchDataAndCache)
  const { constructionStore, inspectionStore } = getStores()
  if (!checkNetwork()) {
    useToast('当前无网络连接，使用缓存数据')
    return
  }
  await fetchBaseData(constructionStore, inspectionStore)
  useToast('数据已更新')
}

const getAllCachedData = (): moduleItem[] => {
  const { constructionStore, inspectionStore } = getStores()
  return [
    {
      key: 'constructionData',
      name: '风机/海缆施工',
      data: constructionStore.pendingSubmissions,
    },
    {
      key: 'boardingData',
      name: '登船核检',
      data: inspectionStore.pendingBoardingSubmissions,
    },
    {
      key: 'offboardingData',
      name: '下船核检',
      data: inspectionStore.pendingOffboardingSubmissions,
    },
  ]
}

const setCachedData = (module: moduleItem): void => {
  const { constructionStore, inspectionStore } = getStores()
  switch (module.key) {
    case 'constructionData':
      constructionStore.pendingSubmissions = module.data
      break
    case 'boardingData':
      inspectionStore.pendingBoardingSubmissions = module.data
      break
    case 'offboardingData':
      inspectionStore.pendingOffboardingSubmissions = module.data
      break
    default:
      console.warn(`Invalid cache key: ${module.name}`)
  }
}

const clearCachedData = (module?: moduleItem): void => {
  const { constructionStore, inspectionStore } = getStores()
  if (module) {
    switch (module.key) {
      case 'constructionData':
        constructionStore.clearAllPendingData()
        useToast(`${module.name}待数据已清除`)
        break
      case 'boardingData':
        inspectionStore.clearAllPendingData('boarding')
        useToast(`${module.name}待数据已清除`)
        break
      case 'offboardingData':
        inspectionStore.clearAllPendingData('offboarding')
        useToast(`${module.name}待数据已清除`)
        break
      default:
        console.warn(`Invalid cache key: ${module.name}`)
    }
  } else {
    constructionStore.clearAllPendingData()
    inspectionStore.clearAllPendingData()
    useToast('数据已清除')
  }
}

const syncCacheData = async (module?: moduleItem): Promise<void> => {
  const { constructionStore, inspectionStore } = getStores()
  try {
    if (module) {
      // 同步单个模块的待提交数据
      switch (module.key) {
        case 'constructionData':
          await constructionStore.syncPendingData()
          useToast(`模块 ${module.name} 的待提交数据已同步并清除`)
          break
        case 'boardingData':
          await inspectionStore.syncPendingData('boarding')
          useToast(`模块 ${module.name} 的待提交数据已同步并清除`)
          break
        case 'offboardingData':
          await inspectionStore.syncPendingData('offboarding')
          useToast(`模块 ${module.name} 的待提交数据已同步并清除`)
          break
        default:
          console.warn(`Invalid module: ${module.name}`)
      }
    } else {
      // 同步所有模块的待提交数据
      // const results = await Promise.allSettled([
      //   constructionStore.syncPendingData(),
      //   inspectionStore.syncPendingData('boarding'),
      //   inspectionStore.syncPendingData('offboarding'),
      // ])

      // results.forEach((result, index) => {
      //   if (result.status === 'fulfilled') {
      //     switch (index) {
      //       case 0:
      //         constructionStore.clearAllPendingData()
      //         // useToast('模块 constructionData 的待提交数据已同步并清除')
      //         break
      //       case 1:
      //         inspectionStore.clearAllPendingData('boarding')
      //         // useToast('模块 boardingData 的待提交数据已同步并清除')
      //         break
      //       case 2:
      //         inspectionStore.clearAllPendingData('offboarding')
      //         // useToast('模块 offboardingData 的待提交数据已同步并清除')
      //         break
      //     }
      //   } else {
      //     useToast(`模块 ${index} 的待提交数据同步失败，请稍后重试`)
      //   }
      // })

      const modules = getAllCachedData()
      for (const mod of modules) {
        if (mod.data.length > 0) {
          syncCacheData(mod)
        }
      }
    }
  } catch (error) {
    console.log('error', error)
    useToast(error.message || error.Error || '同步待提交数据失败，请稍后重试')
  }
}

export { fetchDataAndCache, getAllCachedData, setCachedData, clearCachedData, syncCacheData }
