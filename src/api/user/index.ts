// 统一管理用户相关接口
import request from '@/utils/request'
import type {
    CaptchaResponseData,
    LoginFormData,
    LoginResponseData,
    userInfoResponseData,
} from './type'

enum API {
    LOGIN_URL = '/admin/acl/index/login',
    USERINFO_URL = '/admin/acl/index/info',
    LOGOUT_URL = '/admin/acl/index/logout',
    CAPTCHA_URL = '/admin/acl/index/captcha',
}

export const reqLogin = (data: LoginFormData) =>
    request.post<any, LoginResponseData>(API.LOGIN_URL, data)

export const reqUserInfo = () =>
    request.get<any, userInfoResponseData>(API.USERINFO_URL)

export const reqLogOut = () => request.get<any, any>(API.LOGOUT_URL)

export const reqCaptcha = () =>
    request.get<any, CaptchaResponseData>(API.CAPTCHA_URL, {})


