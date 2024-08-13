import { http } from '@/utils/http'

// 获取施工评估
export const buildList = (data) => {
  return http({
    url: `/sea/weatherInfo/processAssessNew`,
    method: 'GET',
    query: data,
  })
}
// 获取出航评估
export const setSailList = (data) => {
  return http({
    url: `/sea/weatherInfo/sailingAssessNew`,
    method: 'GET',
    query: data,
  })
}
