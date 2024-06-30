export interface ResponseData {
    code: number
    message: string
    success: boolean
}

export interface RoleData {
    id?: number
    createTime?: string
    updateTime?: string
    roleName: string
    remark?: null
}

export type Records = RoleData[]

export interface RoleResponseData extends ResponseData {
    data: {
        records: Records
        total: number
        size: number
        current: number
        orders: []
        optimizeCountSql: boolean
        hitCount: boolean
        countId: null
        maxLimit: null
        searchCount: number
        pages: number
    }
}

export interface MenuData {
    id: number;
    createTime: string;
    updateTime: string;
    parentId: number;
    title: string;
    component: string;
    sortValue: number;
    status: number;
    children: MenuData[];
    select?: boolean;
}

export type MenuList = MenuData[]

export interface MenuResponseData extends ResponseData {
    data: {
        sysMenuList: MenuList;
        roleMenuIds: number[];
    };
}
