import { http } from '@/utils/http'
// 登录
export const login = (data) => {
  return http({
    url: `/sys/login`,
    method: 'POST',
    data,
  })
}
// 获取验证码
export const getCaptcha = (param) => {
  return http({
    url: `/sys/randomImage/${param}`,
    method: 'GET',
  })
}

// 设置应用
export const addMenus = (data) => {
  return http({
    url: `/quickentry/quickEntryRecord/add`,
    method: 'POST',
    data,
  })
}
// 获取应用
export const getMenus = (data) => {
  return http({
    url: `/quickentry/quickEntryRecord/queryByLoginUser`,
    method: 'GET',
    data,
  })
}
// 获取用户应用权限
export const getPermissionMenus = () => {
  return http({
    url: `/sys/permission/getUserPermissionByToken`,
    method: 'GET',
  })
}

// 获取监控
export const getMinitorList = (data) => {
  return http({
    url: `/base/minitor/list`,
    method: 'GET',
    data,
  })
}
// 获取出勤人员
export const getPersonList = (data) => {
  return http({
    url: `/monitor/person/personStatistics`,
    method: 'GET',
    data,
  })
}
// 获取在场车辆
export const getCarList = (data) => {
  return http({
    url: `/monitor/car/carTotalCount`,
    method: 'GET',
    data,
  })
}
