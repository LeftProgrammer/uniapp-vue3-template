import { http } from '@/utils/http'

// 摄像头列表
export const list = (data) => {
  return http({
    url: `/project/projectCamera/getAllCamera`,
    method: 'GET',
    query: data,
  })
}
