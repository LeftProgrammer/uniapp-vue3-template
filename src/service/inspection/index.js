import { http } from '@/utils/http'

// 本单位船只
export const shipList = (data) => {
  return http({
    url: '/sailingcheck/shipSailingRecord/shipList',
    method: 'GET',
    data,
  })
}

// 结束登船
export const shipLeave = (data) => {
  return http({
    url: `/sailingcheck/shipSailingRecord/leave`,
    method: 'POST',
    data,
  })
}

// 结束下船
export const shipBack = (data) => {
  return http({
    url: `/sailingcheck/shipSailingRecord/back`,
    method: 'POST',
    data,
  })
}

// 详情
export const shipUsers = (data) => {
  return http({
    url: '/sailingcheck/shipSailingRecord/shipUsers',
    method: 'GET',
    data,
  })
}
