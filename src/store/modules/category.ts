import {FindCategoryByParentId, reqC1, reqC2, reqC3} from '@/api/product/attr'
import {defineStore} from 'pinia'
import type {CategoryResponseData} from '@/api/product/attr/type'
import type {TradeMarkResponseData} from '@/api/product/trademark/type'
import {CategoryState} from './types/types'
import {findALLBrand} from "@/api/product/trademark";
import type {TradeMark} from '@/api/product/trademark/type'
import {TradeMarkResponse} from "@/api/product/trademark/type";

let useCategoryStore = defineStore('Category', {
    state: (): CategoryState => {
        return {
            c1Id: '',
            c2Id: '',
            c3Id: '',
            c1Arr: [],
            c2Arr: [],
            c3Arr: [],
            brandList: [],
            brandId: '',
            searchCategoryIdList: [],
        }
    },
//     actions: {
//         async findCategoryByParentId() {
//         let res: CategoryResponseData = await FindCategoryByParentId(0)
//           if (res.code === 200){
//             this.c2Arr = res.data
//           }
//         }
//     },
// })
    actions: {
        setBrandIdChange(brandId: string | number) {
            this.brandId = brandId
        },
        setSearchCategoryIdList(list: []) {
            this.searchCategoryIdList = list
        },
        async getC1() {
            let res: CategoryResponseData = await reqC1()
            if (res.code === 200) {
                this.c1Arr = res.data
            }
        },
        async getC2() {
            let res: CategoryResponseData = await reqC2(this.c1Id)
            if (res.code === 200) {
                this.c2Arr = res.data
            }
        },
        async getC3() {
            let res: CategoryResponseData = await reqC3(this.c2Id)
            if (res.code === 200) {
                this.c3Arr = res.data
            }
        },
        async findCategoryByParentId(categoryId: number = 0) {
            const res: CategoryResponseData = await FindCategoryByParentId(categoryId)
            if (res.code === 200) {
                return res
            }
        },
        async findAllBrand() {
            let res: TradeMarkResponse = await findALLBrand()
            if (res.code === 200) {
                this.brandList = res.data
            }
        }
    },
    getters: {},
})

export default useCategoryStore
