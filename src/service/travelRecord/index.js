import { http } from '@/utils/http'

// 出行记录
export const list = (data) => {
  return http({
    url: `/sailingcheck/userBoardRecord/myHis`,
    method: 'GET',
    query: data,
  })
}
