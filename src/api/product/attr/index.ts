import request from '@/utils/request'
import type {CategoryResponseData, AttrResponseData, Attr, AttrResponse} from './type'

enum API {
    C1_URL = '/admin/product/getCategory1',
    C2_URL = '/admin/product/getCategory2/',
    C3_URL = '/admin/product/getCategory3/',
    ATTR_URL = '/admin/product/attrInfoList/',
    ADDORUPDATEATTR_URL = '/admin/product/product-spec/',
    DELETEATTR_URL = '/admin/product/product-spec/remove/',
    FINDCATEGORYBYPARENTID = '/admin/product/category-brand/find-category',
    SPECLIST = '/admin/product/product-spec/',
}

export const FindCategoryByParentId = (categoryId: number) => {
    const url = `${API.FINDCATEGORYBYPARENTID}/${categoryId}`;
    return request.get<any, CategoryResponseData>(url);
}
export const reqC1 = () => request.get<any, CategoryResponseData>(API.C1_URL)

export const reqC2 = (category1Id: number | string) =>
    request.get<any, CategoryResponseData>(API.C2_URL + category1Id)

export const reqC3 = (category2Id: number | string) =>
    request.get<any, CategoryResponseData>(API.C3_URL + category2Id)

export const reqAttr = (
    category1Id: number | string,
    category2Id: number | string,
    category3Id: number | string,
) =>
    request.get<any, AttrResponseData>(
        API.ATTR_URL + `${category1Id}/${category2Id}/${category3Id}`,
    )

export const getSpecList = (page: number, limit: number) =>
    request.get<any, AttrResponse>(API.SPECLIST + `${page}/${limit}`)

export const reqAddOrUpdateAttr = (data: Attr) => {
    if (data.id) {
        // 更新操作
        return request.put<any, any>(`${API.ADDORUPDATEATTR_URL}update`, data)
    } else {
        // 新增操作
        return request.post<any, any>(`${API.ADDORUPDATEATTR_URL}save`, data)
    }
}

export const reqRemoveAttr = (attrId: number) =>
    request.delete<any, any>(API.DELETEATTR_URL + attrId)
