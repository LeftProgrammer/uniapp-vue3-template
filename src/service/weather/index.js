import { http } from '@/utils/http'

// 获取天气
export const getWeather = (data) => {
  return http({
    url: `/sea/weatherInfo/get7dayInfo`,
    method: 'GET',
    query: data,
  })
}
// 获取天气预警
export const getWeatherWarn = (data) => {
  return http({
    url: `/sea/extremeWeather/list`,
    method: 'GET',
    query: data,
  })
}
