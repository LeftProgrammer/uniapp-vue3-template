import { defineStore } from 'pinia'
import { addMenus, getMenus, getPermissionMenus } from '@/service/home/index'
import { isString } from 'lodash-es'
import { checkNetwork } from '@/utils/index'
import { useToast } from '@/utils/modals'

const filterRoutes = (routes) => {
  return routes.filter((route) => {
    if (route.children && route.children.length > 0) {
      const filteredChildren = route.children.filter((child) => child.appShow)
      if (filteredChildren.length > 0) {
        route.children = filteredChildren
        return true
      }
    }
    return false
  })
}

export interface AppItem {
  // id: string
  // name: string
  // icon: string
  // path?: string
  path: string
  component: string
  route: string
  meta: {
    keepAlive: boolean
    internalOrExternal: boolean
    title: string
  }
  name: string
  id: string
}

export interface ModuleItem {
  id: string
  name: string
  apps: AppItem[]
}

export interface AppState {
  allApps: []
  homeApps: AppItem[]
  editingHomeApps: AppItem[]
}

export const useAppStore = defineStore(
  'app',
  () => {
    const allApps = ref([])
    const homeApps = ref<AppItem[]>([])
    const fromRoute = ref('') // 页面来源

    const setAllApps = (newAllApps) => {
      allApps.value = newAllApps
    }
    const clearAllApps = () => {
      allApps.value = []
    }

    const updateHomeApps = (newHomeApps: AppItem[]): Promise<void> => {
      return saveHomeApps(newHomeApps)
        .then(() => {
          homeApps.value = newHomeApps
          console.log('Home apps updated successfully')
        })
        .catch((err) => {
          console.error('Error updating home apps:', err)
          throw err // 重新抛出错误，以便外部调用者可以捕获
        })
    }

    const clearHomeApps = async () => {
      try {
        await saveHomeApps([])
        homeApps.value = []
      } catch (err) {
        console.error('Error clearing home apps:', err)
      }
    }

    const saveHomeApps = (apps) => {
      return new Promise((resolve, reject) => {
        if (checkNetwork()) {
          // 判断是否有网络
          addMenus({ path: JSON.stringify(apps) })
            .then(({ code, message }) => {
              if (code === 200) {
                resolve({ code, message })
              } else {
                const message = '请求异常'
                useToast(message)
                reject(message)
              }
            })
            .catch(() => {
              const message = '网络异常，请检查网络'
              useToast(message)
              reject(message)
            })
        } else {
          const message = '请在有网环境下操作'
          useToast(message)
          reject(message)
        }
      })
    }

    const fetchHomeApps = async () => {
      if (checkNetwork()) {
        try {
          const { code, result } = await getMenus()
          if (code === 200 && result?.path) {
            const resultPath = JSON.parse(result.path)
            homeApps.value = Array.isArray(resultPath) ? resultPath : []
          } else {
            homeApps.value = []
          }
        } catch (error) {
          console.error('Error fetching home apps:', error)
          homeApps.value = []
        }
      }
      console.log('homeApps.value', homeApps.value)
      return homeApps.value
    }

    const fetchUserPermission = async () => {
      if (checkNetwork()) {
        try {
          const { code, result } = await getPermissionMenus()
          if (code === 200 && result?.menu?.length > 0) {
            console.log('所有 的路由', result.menu)
            const appMenu = result.menu.find((item) => item.path === '/app')
            if (appMenu?.children) {
              allApps.value = appMenu.children
              await fetchHomeApps() // 获取常用应用
              homeApps.value = homeApps.value.filter((app) =>
                routeExistsInAllApps(app.component, allApps.value),
              )
              await saveHomeApps(homeApps.value) // 保存匹配后的 homeApps
            }
          }
        } catch (error) {
          console.error('Error fetching user permission:', error)
        }
      }
      console.log('最终的路由', allApps.value)
      return allApps.value
    }

    const routeExistsInAllApps = (component, routes) => {
      for (const route of routes) {
        if (route.component === component) {
          return true
        }
        if (route.children && route.children.length > 0) {
          if (routeExistsInAllApps(component, route.children)) {
            return true
          }
        }
      }
      return false
    }

    const setFromRoute = (route: string | null) => {
      fromRoute.value = route
    }

    return {
      allApps,
      homeApps,
      fromRoute,
      setAllApps,
      clearAllApps,
      updateHomeApps,
      clearHomeApps,
      saveHomeApps,
      fetchHomeApps,
      setFromRoute,
      fetchUserPermission,
    }
  },
  {
    persist: true,
  },
)
