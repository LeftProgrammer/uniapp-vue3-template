import { http } from '@/utils/http'

export const getDictItems = (data) => {
  return http({
    url: `/sys/dict/getDictItems/${data}`,
    method: 'GET',
  })
}
