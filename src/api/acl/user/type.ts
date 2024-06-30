export interface ResponseData {
  code: number
  message: string
  success: boolean
}

export interface User {
  id?: number
  createTime?: string
  updateTime?: string
  userName?: string
  password?: string
  name?: string
  phone?: null
  description:string
  roleName?: string
}

export type Records = User[]

export interface UserResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    pages: number
  }
}

export interface RoleData {
  id?: number
  createTime?: string
  updateTime?: string
  roleName?: string
  remark?: string | null
  roleCode?: string
  description?: string | null
}

export type AllRole = RoleData[]
export interface AllRoleResponseData extends ResponseData {
  data: {
    sysUserRole: number[];
    aliRolesList: AllRole;
  }
}

export interface SetRoleData {
  roleIdList: number[]
  userId: number
}
