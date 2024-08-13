// 所有菜单
export const menus = [
  {
    id: '1',
    name: '登船检核',
    apps: [
      {
        id: '101',
        name: '登船检验',
        icon: '../../static/home/menu-icon-1.png',
        path: '/pages/inspection/index?type=boarding',
      },
      {
        id: '102',
        name: '下船检核',
        icon: '../../static/home/menu-icon-2.png',
        path: '/pages/inspection/index?type=offboarding',
      },
    ],
  },
  {
    id: '2',
    name: '施工管理',
    apps: [
      {
        id: '201',
        name: '风机施工',
        icon: '../../static/home/menu-icon-3.png',
        path: '/pages/construction/index?code=B06A01A01',
      },
      {
        id: '202',
        name: '海缆施工',
        icon: '../../static/home/menu-icon-4.png',
        path: '/pages/construction/index?code=B06A01A02',
      },
      {
        id: '203',
        name: '观豚日志',
        icon: '../../static/home/menu-icon-5.png',
        path: '/pages/dolphinWatch/index',
      },
    ],
  },
  {
    id: '3',
    name: '安全管理',
    apps: [
      {
        id: '301',
        name: '视频监控',
        icon: '../../static/home/menu-icon-6.png',
        path: '/pages/video/index',
      },

      {
        id: '302',
        name: '避风通知',
        icon: '../../static/home/menu-icon-8.png',
        path: '/pages/windShelter/notice/index',
      },
      // { id: '304', name: '避风计划', icon: '../../static/home/menu-icon-9.png', path: '' },
      {
        id: '303',
        name: '避风监控',
        icon: '../../static/home/menu-icon-10.png',
        path: '/pages/windShelter/monitor/index',
      },
      {
        id: '304',
        name: '避风报备',
        icon: '../../static/home/menu-icon-9.png',
        path: '/pages/windShelter/report/index',
      },
    ],
  },
  {
    id: '4',
    name: '气象管理',
    apps: [
      {
        id: '401',
        name: '气象预警',
        icon: '../../static/home/menu-icon-15.png',
        path: '/pages/weather/weatherWarn',
      },
      {
        id: '402',
        name: '气象评估',
        icon: '../../static/home/menu-icon-7.png',
        path: '/pages/weather/evaluate',
      },
    ],
  },
  {
    id: '5',
    name: '综合查询',
    apps: [
      // {
      //   id: '501',
      //   name: '出航统计',
      //   icon: '../../static/home/menu-icon-11.png',
      //   path: '',
      // },
      // {
      //   id: '502',
      //   name: '施工进度',
      //   icon: '../../static/home/menu-icon-12.png',
      //   path: '',
      // },
      // { id: '503', name: '运输进度', icon: '../../static/home/menu-icon-12.png', path: '' },
      // { id: '504', name: '观豚分析', icon: '../../static/home/menu-icon-13.png', path: '' },
      {
        id: '501',
        name: '运输计划',
        icon: '../../static/home/menu-icon-14.png',
        path: '/pages/transportPlan/index',
      },
      {
        id: '502',
        name: '通讯录',
        icon: '../../static/home/menu-icon-9.png',
        path: '/pages/contactList/index',
      },
    ],
  },
]
