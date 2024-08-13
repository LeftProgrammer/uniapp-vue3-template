import { defineStore } from 'pinia'
import { checkNetwork } from '@/utils/index'
import { useToast } from '@/utils/modals/index'

export const useDataBaseStore = defineStore(
  'database',
  () => {
    const dataBase = ref({
      dolphinWatch: [],
    })
    /**
     * @description 获取所有缓存数据
     * @param key 表
     * @returns
     */
    const get = async (key: string, timestamp: string) => {
      if (timestamp) {
        return dataBase.value[key].find((x) => x.timestamp === timestamp).data
      } else {
        return dataBase.value[key]
      }
    }
    /**
     * @description 添加缓存
     * @param key 模块名
     * @param data 数据
     * @param flag 有网络但很差，强制缓存
     * @param timestamp 时间戳 类似id 用于修改
     */
    const set = (key: string, data: any, flag: boolean = false, timestamp: string) => {
      if (checkNetwork() && !flag) {
        return false
      }
      const oldData = dataBase.value[key]
      if (timestamp) {
        dataBase.value[key].splice(
          oldData.findIndex((x: any) => x.timestamp === timestamp),
          1,
          { data, timestamp },
        )
      } else {
        dataBase.value[key] = [{ data, timestamp: String(new Date().getTime()) }, ...oldData]
      }
      if (!checkNetwork() || flag) {
        useToast(flag ? '当前网络较差，数据已缓存' : '当前无网络，缓存成功！')
        return true
      }
    }
    /**
     * @description 删除缓存数据
     * @param key 表名
     * @param timestamp 时间戳 类似id 不传全部置空
     */
    const del = (key: string, timestamp: number) => {
      if (timestamp) {
        const index = dataBase.value[key].findIndex((x) => x.timestamp === timestamp)
        dataBase.value[key].splice(index, 1)
      } else {
        dataBase.value[key] = []
      }
    }

    return {
      get,
      set,
      del,
      dataBase,
    }
  },
  {
    persist: true,
  },
)
