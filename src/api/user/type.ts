// 登录接口需要携带参数ts类型
export interface LoginFormData {
  username?: string
  password?: string
  captcha?: string;
  codeKey?: string;
}

export interface ResponseData {
  code?: number
  message?: string
  success?: boolean
}

// export interface LoginResponseData extends ResponseData {
//   data?: string // 在TypeScript中 data?表示后面的参数是可选的
// }

export interface LoginResponseData extends ResponseData {
  data?: {
    token?: string;
    refresh_token?: string;
  }
}

export interface userInfoResponseData extends ResponseData {
  data: {
    routes: string[]
    buttons: string[]
    roles: string[]
    name: string
    avatar: string
  }
}

export interface CaptchaResponseData extends ResponseData {
  data: {
    codeKey: string,
    codeValue: string,
  }
}
