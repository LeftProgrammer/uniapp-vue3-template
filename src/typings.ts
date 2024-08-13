// 全局要用的类型放到这里

type IResData<T> = {
  result: any[]
  code: number
  msg: string
  message: string
  success: boolean
  data: T
}

// uni.uploadFile文件上传参数
type IUniUploadFileOptions = {
  file?: File
  files?: UniApp.UploadFileOptionFiles[]
  filePath?: string
  name?: string
  formData?: any
}

type IUserInfo = {
  id: string
  avatar?: string
  picture?: string
  username?: string
  name?: string
  departmentId?: string
  department?: string
  code?: string
  phone?: string
  /** 微信的 openid，非微信没有这个字段 */
  openid?: string
}

enum TestEnum {
  A = 'a',
  B = 'b',
}
