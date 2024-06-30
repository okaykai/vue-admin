import request from '@/utils/request'
import type {TradeMark, TradeMarkResponseData} from './type'
import {TradeMarkResponse} from "./type";

enum API {
    TRADEMARK_URL = '/admin/baseTrademark/',
    ADDTRADEMARK_URL = '/admin/baseTrademark/save',
    UPDATETRADEMARK_URL = '/admin/baseTrademark/update',
    DELETE_URL = '/admin/baseTrademark/remove/',
    ALL_BRAND = '/admin/baseTrademark/find-all',
}

export const findALLBrand = () =>
    request.get<any, TradeMarkResponse>(API.ALL_BRAND)


export const reqHasTradeMark = (page: number, limit: number) =>
    request.get<any, TradeMarkResponseData>(
        API.TRADEMARK_URL + `${page}/${limit}`,
    )

export const reqAddOrUpdateTrademark = (data: TradeMark) => {
    if (data.id) {
        return request.put<any, any>(API.UPDATETRADEMARK_URL, data)
    } else {
        return request.post<any, any>(API.ADDTRADEMARK_URL, data)
    }
}
export const reqDeleteTrademark = (id: number) =>
    request.delete<any, any>(API.DELETE_URL + id)
