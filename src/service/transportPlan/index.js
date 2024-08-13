import { http } from '@/utils/http'

export const planList = (data) => {
  return http({
    url: '/ship/transportPlan/list',
    method: 'GET',
    data,
  })
}

export const planQueryById = (data) => {
  return http({
    url: '/ship/transportPlan/queryById',
    method: 'GET',
    data,
  })
}
