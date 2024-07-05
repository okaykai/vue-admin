/*
 * @Description: Stay hungry，Stay foolish
 * @Author: Huccct
 * @Date: 2023-05-28 11:06:52
 * @LastEditors: Huccct
 * @LastEditTime: 2023-05-29 17:12:21
 */
export interface ResponseData {
    code: number
    message: string
    success: boolean
}

export interface SpuData {
    id?: number
    name: string
    proDesc: string
    category1Id: string | number
    category2Id: string | number
    category3Id: string | number
    brandId: number | string
    spuSaleAttrList: null | SaleAttr[]
    spuImageList: null | SpuImg[]
}

export type Records = SpuData[]

export interface HasSpuResponseData extends ResponseData {
    data: {
        records: Records
        total: number
        size: number
        current: number
        searchCount: boolean
        pages: number
    }
}

export interface Trademark {
    id: number
    name: string
    logo: string
}

export interface AllTradeMark extends ResponseData {
    data: Trademark[]
}

export interface SpuImg {
    id?: number
    createTime?: string
    updateTime?: string
    spuId?: number
    imgName?: string
    imgUrl?: string
    name?: string
    url?: string
}

export interface SpuHasImg extends ResponseData {
    data: SpuImg[]
}

export interface SaleAttrValue {
    id?: number
    createTime?: null
    updateTime?: null
    spuId?: number
    baseSaleAttrId: number | string
    saleAttrValueName: string
    saleAttrName?: string
    isChecked?: null
}

export type SpuSaleAttrValueList = SaleAttrValue[]

export interface SaleAttr {
    id?: number
    createTime?: null
    updateTime?: null
    spuId?: number
    baseSaleAttrId: number | string
    saleAttrName: string
    spuSaleAttrValueList: SpuSaleAttrValueList
    flag?: boolean
    saleAttrValue?: string
}

export interface SaleAttrResponseData extends ResponseData {
    data: SaleAttr[]
}

export interface HasSaleAttr {
    id: number
    attrKey: string
}

export interface HasSaleAttrResponseData extends ResponseData {
    data: HasSaleAttr[]
}

export interface Attr {
    attrId: number | string
    valueId: number | string
}

export interface saleAttr {
    saleAttrId: number | string
    saleAttrValueId: number | string
}

export interface SkuData {
    category3Id: string | number //三级分类的ID
    spuId: string | number //已有的SPU的ID
    tmId: string | number //SPU品牌的ID
    skuName: string //sku名字
    salePrice: string | number //sku价格
    weight: string | number //sku重量
    skuDesc: string //sku的描述
    skuAttrValueList?: Attr[]
    skuSaleAttrValueList?: saleAttr[]
    thumbImg: string //sku图片地址
}

export interface SkuInfoData extends ResponseData {
    data: SkuData[]
}
