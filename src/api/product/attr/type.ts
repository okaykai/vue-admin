import {TradeMark} from "@/api/product/trademark/type.ts";

export interface ResponseData {
    code: number
    message: string
    success: boolean
}

export interface CategoryObj {
    id: number | string
    name: string
    children?: []
    hasChildren: boolean
    imageUrl: string
    orderNum: number
    parentId?: number
    category2Id?: number
}


export interface CategoryResponseData extends ResponseData {
    data: CategoryObj[]
}

export interface AttrValue {
    key: string;
    valueList: string[];
    inputVisible?: boolean;
    inputValue?: string;
}

export type AttrValueList = AttrValue[]

export interface Attr {
    id?: number;
    specName: string;
    specKey: string;
    specValue: string;
}

export type AttrList = Attr[]

export interface AttrValue {
    key: string;
    valueList: string[];
    editingValue?: {
        [key: string]: boolean
    };
}

export interface Attrs {
    id: number
    createTime: string
    updateTime: string
    isDeleted: number
    specName: string
    specValue: string // This will be a JSON string
}

export type Records = Attrs[]

export interface AttrResponseData extends ResponseData {
    data: Attr[]
}

export interface SpecValue {
    key: string
    valueList: string[]
}

export interface PaginatedResponse<T> {
    records: T[]
    total: number
    size: number
    current: number
    pages: number
}

export interface AttrResponse extends ResponseData {
    data: PaginatedResponse<Attrs>
}
