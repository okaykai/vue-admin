export interface ResponseData {
    code: number
    message: string
    ok: boolean
}

export interface Permission {
    id: number
    createTime: string
    updateTime: string
    pid: number
    title: string
    component: null
    toCode: null
    type: number
    status: null
    level: number
    children?: PermissionList
    select: boolean
}

export type PermissionList = Permission[]

export interface PermissionResponseData extends ResponseData {
    data: PermissionList
}

export interface MenuParams {
    id?: number
    component: string
    level: number
    title: string
    parentId: number
}