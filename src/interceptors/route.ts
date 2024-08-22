/**
 * by 菲鸽 on 2024-03-06
 * 路由拦截，通常也是登录拦截
 * 可以设置路由白名单，或者黑名单，看业务需要选哪一个
 * 我这里应为大部分都可以随便进入，所以使用黑名单
 */
import { useUserStore } from '@/store'
import { getNeedLoginPages, needLoginPages as _needLoginPages } from '@/utils'

console.error('route')
// TODO Check
const loginRoute = '/pages/login/index'

const isLogined = () => {
  const userStore = useUserStore()
  return userStore.isLogined
}

const isDev = import.meta.env.DEV

export const checkAndRedirect = (url?: string) => {
  if (!url) {
    const pages = getCurrentPages()
    if (pages.length === 0) {
      // 页面栈为空时，可能是应用刚启动，这里可以设置一个默认的URL
      url = loginRoute
    } else {
      const currentPage = pages[pages.length - 1]
      url = `/${currentPage.route}`
    }
  }
  const path = url.split('?')[0]
  // 获取需要登录的页面列表
  const needLoginPages = isDev ? getNeedLoginPages() : _needLoginPages

  const isNeedLogin = needLoginPages.includes(path)
  if (!isNeedLogin) {
    return true
  }
  const hasLogin = isLogined()
  if (hasLogin) {
    return true
  }

  const redirectRoute = `${loginRoute}?redirect=${encodeURIComponent(url)}`
  uni.redirectTo({ url: redirectRoute })
  console.log('页面重定向', redirectRoute)
  return false
}

const navigateToInterceptor = {
  invoke({ url }: { url: string }) {
    return checkAndRedirect(url)
  },
}

// // 黑名单登录拦截器 - （适用于大部分页面不需要登录，少部分页面需要登录）
// const navigateToInterceptor = {
//   // 注意，这里的url是 '/' 开头的，如 '/pages/index/index'，跟 'pages.json' 里面的 path 不同
//   invoke({ url }: { url: string }) {
//     console.log('navigateToInterceptor', url)
//     // console.log(url) // /pages/route-interceptor/index?name=feige&age=30
//     const path = url.split('?')[0]
//     let needLoginPages: string[] = []
//     // 为了防止开发时出现BUG，这里每次都获取一下。生产环境可以移到函数外，性能更好
//     if (isDev) {
//       needLoginPages = getNeedLoginPages()
//     } else {
//       needLoginPages = _needLoginPages
//     }
//     const isNeedLogin = needLoginPages.includes(path)
//     console.log('needLoginPages', needLoginPages)
//     console.log('isNeedLogin', isNeedLogin)
//     if (!isNeedLogin) {
//       return true
//     }
//     const hasLogin = isLogined()
//     if (hasLogin) {
//       return true
//     }
//     const redirectRoute = `${loginRoute}?redirect=${encodeURIComponent(url)}`
//     uni.navigateTo({ url: redirectRoute })
//     return false
//   },
// }

export const routeInterceptor = {
  install() {
    uni.addInterceptor('navigateTo', navigateToInterceptor)
    uni.addInterceptor('reLaunch', navigateToInterceptor)
    uni.addInterceptor('redirectTo', navigateToInterceptor)
    // uni.addInterceptor('navigateBack', navigateToInterceptor)
  },
}
