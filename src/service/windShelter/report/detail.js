import { http, httpGet } from '@/utils/http'

// 获取避风报备
export const getDetail = (data) => {
  return http({
    url: '/wind/windReport/queryByNotifyId',
    method: 'GET',
    query: data,
  })
}
// 获取联系人
export const getPerson = (data) => {
  return http({
    url: '/person/personInfo/listNoPage',
    method: 'GET',
    params: data,
  })
}
// 获取港口
export const getPort = (data) => {
  return http({
    url: '/project/projectFence/list',
    method: 'GET',
    query: data,
  })
}
// 获取用户信息
export const getUser = (data) => {
  return http({
    url: '/person/personInfo/queryByUsername',
    method: 'GET',
    params: data,
  })
}
// 获取船舶
export const getShip = (data) => {
  return http({
    url: '/wind/windReport/getShipList',
    method: 'GET',
    params: data,
  })
}
// 填报
export const add = (data) => {
  return http({
    url: '/wind/windReport/add ',
    method: 'POSt',
    data,
  })
}
// 填报
export const edit = (data) => {
  return http({
    url: '/wind/windReport/edit ',
    method: 'PUT',
    data,
  })
}
