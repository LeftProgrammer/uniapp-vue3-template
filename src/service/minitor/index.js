import { http } from '@/utils/http'

// 获取监控列表
export const getMinitorList = (data) => {
  return http({
    url: `/base/minitor/list`,
    method: 'GET',
    data,
  })
}
