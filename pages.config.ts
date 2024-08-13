import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'

export default defineUniPages({
  globalStyle: {
    navigationStyle: 'default',
    navigationBarTitleText: '钦州海风',
    navigationBarBackgroundColor: '#f8f8f8',
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
        iconPath: 'static/tabbar/home.png',
        selectedIconPath: 'static/tabbar/homeHL.png',
        pagePath: 'pages/home/index',
        text: '首页',
      },
      {
        iconPath: 'static/tabbar/todo.png',
        selectedIconPath: 'static/tabbar/todoHL.png',
        pagePath: 'pages/todo/index',
        text: '待办',
      },
      {
        iconPath: 'static/tabbar/mine.png',
        selectedIconPath: 'static/tabbar/mineHL.png',
        pagePath: 'pages/application/index',
        text: '应用',
      },
      {
        iconPath: 'static/tabbar/mine.png',
        selectedIconPath: 'static/tabbar/mineHL.png',
        pagePath: 'pages/mine/index',
        text: '我的',
      },
      // {
      //   iconPath: 'static/tabbar/mine.png',
      //   selectedIconPath: 'static/tabbar/mineHL.png',
      //   pagePath: 'pages/login/index',
      //   text: '登录',
      // },
    ],
  },
  pages: [
    {
      path: 'uni_modules/uni-upgrade-center-app/pages/upgrade-popup',
      style: {
        disableScroll: true,
        'app-plus': {
          backgroundColorTop: 'transparent',
          background: '#00000000',
          titleNView: false,
          scrollIndicator: 'none',
          popGesture: 'none',
          animationType: 'fade-in',
          animationDuration: 200,
        },
      },
    },
  ],
})
