import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'

export default defineUniPages({
  globalStyle: {
    navigationStyle: 'default',
    navigationBarTitleText: '平川抽蓄',
    navigationBarBackgroundColor: '#0A57ED',
    navigationBarTextStyle: 'black',
    backgroundColor: '#FFFFFF',
  },
  easycom: {
    autoscan: true,
    custom: {
      '^uni-(.*)': '@dcloudio/uni-ui/lib/uni-$1/uni-$1.vue',
      '^uv-(.*)': '@climblee/uv-ui/components/uv-$1/uv-$1.vue',
      '^(?!z-paging-refresh|z-paging-load-more)z-paging(.*)':
        'z-paging/components/z-paging$1/z-paging$1.vue',
    },
  },
  tabBar: {
    color: '#999999',
    selectedColor: '#3254FF',
    backgroundColor: '#F8F8F8',
    borderStyle: 'black',
    height: '50px',
    fontSize: '10px',
    iconWidth: '24px',
    spacing: '3px',
    list: [
      {
        iconPath: 'static/tabbar/overview_01.png',
        selectedIconPath: 'static/tabbar/overview_02.png',
        pagePath: 'pages/home/index',
        text: '概览',
      },
      {
        iconPath: 'static/tabbar/monitor_01.png',
        selectedIconPath: 'static/tabbar/monitor_02.png',
        pagePath: 'pages/monitor/index',
        text: '监控',
      },
    ],
  },
  plugins: {
    // TODO：需要授权？
    // HikVideoPlugin: {
    //   version: '1.0.0',
    //   provider: 'wx0e203209e27b1e66', // 海康威视提供的插件ID
    // },
  },
})
