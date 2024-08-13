import { http } from '@/utils/http'

export const list = (data) => {
  return http({
    url: `/construction/monitorDolphinLog/list`,
    method: 'GET',
    query: data,
  })
}
export const del = (data) => {
  return http({
    url: `/construction/monitorDolphinLog/delete`,
    method: 'delete',
    query: data,
  })
}
export const add = (data) => {
  return http({
    url: `/construction/monitorDolphinLog/add`,
    method: 'POST',
    data,
  })
}
export const edit = (data) => {
  return http({
    url: `/construction/monitorDolphinLog/edit`,
    method: 'PUT',
    data,
  })
}
// 查详情
export const queryById = (data) => {
  return http({
    url: `/construction/monitorDolphinLog/queryById`,
    method: 'GET',
    query: data,
  })
}
// 查询当前所在船舶
export const getSaillingShipName = (data) => {
  return http({
    url: `/construction/monitorDolphinLog/getSaillingShipName`,
    method: 'GET',
    query: data,
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
