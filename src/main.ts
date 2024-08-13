import { createSSRApp } from 'vue'
import App from './App.vue'
import store from './store'
import uvUI from '@climblee/uv-ui'
import JhEmpty from '@/components/jh-empty/index.vue'
import { routeInterceptor, requestInterceptor, prototypeInterceptor } from './interceptors'
import { useDialog, useLoading, useToast } from './utils/modals/index'
import { checkNetwork } from './utils/index'
import { fetchDataAndCache } from '@/utils/offline/offlineDataManager'
import 'virtual:uno.css'
// import VConsole from 'vconsole'

// if (process.env.NODE_ENV === 'development') {
//   new VConsole()
// }

export function createApp() {
  const app = createSSRApp(App)
  app.use(store)
  app.use(uvUI)
  app.use(routeInterceptor)
  app.use(requestInterceptor)
  app.use(prototypeInterceptor)
  app.component('JhEmpty', JhEmpty)
  app.config.globalProperties.$dialog = useDialog
  app.config.globalProperties.$toast = useToast
  app.config.globalProperties.$loading = useLoading
  app.config.globalProperties.$checkNetwork = checkNetwork
  // 调用缓存数据刷新函数
  fetchDataAndCache()
  return {
    app,
  }
}
