export interface ResponseData {
    code: number
    message: string
    success: boolean
}

export interface TradeMark {
    id?: number
    name: string
    logo: string
}

export type Records = TradeMark[]

export interface TradeMarkResponseData extends ResponseData {
    data: {
        records?: Records
        total: number
        size: number
        current: number
        searchCount: boolean
        pages: number
    }
}

export interface TradeMarkResponse extends ResponseData {
    data: TradeMark[]
}
