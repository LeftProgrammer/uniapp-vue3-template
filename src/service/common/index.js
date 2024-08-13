import { http } from '@/utils/http'

// 获取人员
export const getAllPerson = (data) => {
  return http({
    url: '/person/personInfo/listNoPage',
    method: 'GET',
    data,
  })
}

// 通讯录
export const getPersons = (data) => {
  return http({
    url: '/person/personInfo/getPersonInfoNoPage',
    method: 'GET',
    data,
  })
}
// 人员信息
export const getPersonInfo = (data) => {
  return http({
    url: '/person/personInfo/queryById',
    method: 'GET',
    data,
  })
}
