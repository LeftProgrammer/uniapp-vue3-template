import { http } from '@/utils/http'

// 避风监控
export const list = (data) => {
  return http({
    url: '/wind/windNotification/monitor',
    method: 'GET',
    data,
  })
}
