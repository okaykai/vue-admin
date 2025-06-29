<script setup lang="ts">
import { reqAttr } from '@/api/product/attr'
import {
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAddSku,
} from '@/api/product/spu'
import { ref, reactive } from 'vue'
import type { SkuData } from '@/api/product/spu/type'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

let $emit = defineEmits(['changeScene'])
let attrArr = ref<any>([])
let saleArr = ref<any>([])
let imgArr = ref<any>([])
let table = ref<any>()
let skuParams = reactive<SkuData>({
  category3Id: '',
  spuId: '',
  tmId: '',
  skuName: '',
  salePrice: '',
  weight: '',
  skuDesc: '',
  skuAttrValueList: [
    // {
    //   attrId: '',
    //   valueId: '',
    // },
  ],
  skuSaleAttrValueList: [
    // {
    //   saleAttrId: '',
    //   saleAttrValueId: '',
    // },
  ],
  thumbImg: '',
})
const cancel = () => {
  $emit('changeScene', { flag: 0, params: '' })
}

const initSkuData = async (
  c1Id: number | string,
  c2Id: number | string,
  spu: any,
) => {
  skuParams.category3Id = spu.category3Id
  skuParams.spuId = spu.id
  skuParams.tmId = spu.tmId

  try {
    // 获取平台属性
    let res: any = await reqAttr(c1Id, c2Id, spu.category3Id)
    // 获取销售属性
    let res1: any = await reqSpuHasSaleAttr(spu.id)
    // 获取图片列表
    let res2: any = await reqSpuImageList(spu.id)

    // 处理平台属性数据 (来自reqSpuHasSaleAttr - 解析specValue)
    if (res1.data && Array.isArray(res1.data)) {
      let allPlatformAttrs = []

      res1.data.forEach((item: any) => {
        if (item.specValue) {
          try {
            const specData = JSON.parse(item.specValue)
            if (Array.isArray(specData)) {
              // 将specData转换为平台属性格式
              specData.forEach((spec: any, specIndex: number) => {
                if (
                  spec.key &&
                  spec.valueList &&
                  Array.isArray(spec.valueList)
                ) {
                  const attrValueList = spec.valueList.map(
                    (value: string, valueIndex: number) => ({
                      id: item.id * 100 + specIndex * 10 + valueIndex + 1, // 生成基于item.id的唯一ID
                      valueName: value,
                    }),
                  )

                  allPlatformAttrs.push({
                    id: item.id * 100 + specIndex, // 使用基于item.id的唯一ID
                    attrName: spec.key, // 使用spec.key作为平台属性名称（如：颜色、内存）
                    attrValueList: attrValueList,
                    attrIdAndValueId: '', // 初始化选择值
                  })
                }
              })
            }
          } catch (error) {
            console.error('解析平台属性数据失败:', error, item.specValue)
          }
        }
      })

      attrArr.value = allPlatformAttrs
    } else {
      attrArr.value = []
    }

    // 处理销售属性数据 (来自reqAttr - 真实API结构处理)
    if (res.data && Array.isArray(res.data)) {
      // 将平铺的属性键值对数据转换为分组的销售属性结构
      const attrGroups = new Map()

      res.data.forEach((item: any) => {
        // 只处理有attrKey的项目
        if (item.attrKey) {
          if (!attrGroups.has(item.attrKey)) {
            attrGroups.set(item.attrKey, {
              id: item.id, // 使用真实的item.id
              saleAttrName: item.attrKey,
              spuSaleAttrValueList: [],
              saleIdAndValueId: '',
            })
          }

          // 如果有attrValue，添加到值列表中
          if (item.attrValue && item.attrValue.trim() !== '') {
            const attrGroup = attrGroups.get(item.attrKey)
            // 检查是否已存在相同的值，避免重复
            const existingValue = attrGroup.spuSaleAttrValueList.find(
              (val: any) => val.saleAttrValueName === item.attrValue,
            )

            if (!existingValue) {
              attrGroup.spuSaleAttrValueList.push({
                id: item.id, // 使用真实的item.id
                saleAttrValueName: item.attrValue,
                baseSaleAttrId: item.id, // 使用真实的item.id
              })
            }
          }
        }
      })

      // 转换Map为数组，并为没有值的属性添加默认值
      saleArr.value = Array.from(attrGroups.values()).map((attrGroup: any) => {
        // 如果没有属性值，根据属性名称添加一些默认值
        if (attrGroup.spuSaleAttrValueList.length === 0) {
          let defaultValues = []
          if (attrGroup.saleAttrName === '颜色') {
            defaultValues = ['红色', '蓝色', '黑色', '白色']
          } else if (
            attrGroup.saleAttrName === '尺码' ||
            attrGroup.saleAttrName === '尺寸'
          ) {
            defaultValues = ['S', 'M', 'L', 'XL']
          } else if (attrGroup.saleAttrName === '版本') {
            defaultValues = ['128G', '256G', '512G']
          } else {
            defaultValues = ['默认值1', '默认值2']
          }

          attrGroup.spuSaleAttrValueList = defaultValues.map(
            (value, index) => ({
              id: attrGroup.id * 1000 + index + 1, // 生成基于真实ID的唯一ID
              saleAttrValueName: value,
              baseSaleAttrId: attrGroup.id,
            }),
          )
        }

        return attrGroup
      })
    } else {
      saleArr.value = []
    }

    // 处理图片数据
    imgArr.value = res2.data || []
  } catch (error) {
    console.error('初始化SKU数据失败:', error)
    ElMessage({
      type: 'error',
      message: '加载数据失败，请重试',
    })
  }
}

const handler = (row: any) => {
  if (imgArr.value && table.value) {
    imgArr.value.forEach((item: any) => {
      table.value.toggleRowSelection(item, false)
    })
    table.value.toggleRowSelection(row, true)
  }
  skuParams.thumbImg = row?.imgUrl || ''
}

const save = async () => {
  if (!skuParams.skuName || !skuParams.salePrice) {
    ElMessage({
      type: 'warning',
      message: 'SKU名称和价格为必填项',
    })
    return
  }

  try {
    // 处理平台属性数据
    skuParams.skuAttrValueList = (attrArr.value || []).reduce(
      (prev: any, next: any) => {
        if (next.attrIdAndValueId) {
          let [attrId, valuedId] = next.attrIdAndValueId.split(':')
          prev.push({
            attrId,
            valuedId,
          })
        }
        return prev
      },
      [],
    )

    // 处理销售属性数据
    skuParams.skuSaleAttrValueList = (saleArr.value || []).reduce(
      (prev: any, next: any) => {
        if (next.saleIdAndValueId) {
          let [saleAttrId, saleAttrValued] = next.saleIdAndValueId.split(':')
          prev.push({
            saleAttrId,
            saleAttrValued,
          })
        }
        return prev
      },
      [],
    )

    // 创建符合后端DTO的数据结构
    const skuData = {
      category3Id: skuParams.category3Id,
      spuId: skuParams.spuId,
      skuName: skuParams.skuName,
      salePrice: skuParams.salePrice,
      weight: skuParams.weight,
      skuDesc: skuParams.skuDesc,
      skuAttrValueList: skuParams.skuAttrValueList,
      skuSaleAttrValueList: skuParams.skuSaleAttrValueList,
      thumbImg: skuParams.thumbImg,
    }

    let res = await reqAddSku(skuData)
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: '添加SKU成功',
      })
      $emit('changeScene', { flag: 0, params: '' })
    } else {
      throw new Error(res.message || '添加SKU失败')
    }
  } catch (error) {
    console.error('保存SKU时出错:', error)
    ElMessage({
      type: 'error',
      message: error.message || '添加SKU失败',
    })
  }
}

// 添加表格行选择事件处理函数
const handleSelectionChange = (selection: any[]) => {
  if (selection && selection.length > 0) {
    // 如果有选中的行，使用最后一个选中的作为默认图片
    const selectedRow = selection[selection.length - 1]
    skuParams.thumbImg = selectedRow?.imgUrl || ''
  } else {
    // 如果没有选中的行，清空默认图片
    skuParams.thumbImg = ''
  }
}

defineExpose({
  initSkuData,
})
</script>
<template>
  <el-form label-width="100px">
    <el-form-item label="SKU名称">
      <el-input placeholder="SKU名称" v-model="skuParams.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input
        placeholder="价格(元)"
        type="number"
        v-model="skuParams.salePrice"
      ></el-input>
    </el-form-item>
    <el-form-item label="重量(g)">
      <el-input
        placeholder="重量(g)"
        type="number"
        v-model="skuParams.weight"
      ></el-input>
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input
        placeholder="SKU描述"
        type="textarea"
        v-model="skuParams.skuDesc"
      ></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true" label-width="100px">
        <el-form-item
          :label="item.attrName"
          v-for="(item, index) in attrArr"
          :key="item.id"
          style="width: 30%"
        >
          <el-select v-model="item.attrIdAndValueId">
            <el-option
              :value="`${item.id}:${attrValue.id}`"
              :label="attrValue.valueName"
              v-for="(attrValue, index) in item.attrValueList"
              :key="attrValue.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true" label-width="100px">
        <el-form-item
          :label="item.saleAttrName"
          v-for="(item, index) in saleArr"
          :key="item.id"
          style="width: 30%"
        >
          <el-select v-model="item.saleIdAndValueId">
            <el-option
              :value="`${item.id}:${saleAttrValue.id}`"
              :label="saleAttrValue.saleAttrValueName"
              v-for="(saleAttrValue, index) in item.spuSaleAttrValueList"
              :key="saleAttrValue.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table
        border
        :data="imgArr"
        ref="table"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="80px"
          align="center"
        ></el-table-column>
        <el-table-column label="图片">
          <template #="{ row, $index }">
            <img :src="row.imgUrl" alt="" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作">
          <template #="{ row, $index }">
            <el-button type="primary" size="small" @click="handler(row)">
              设置默认
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="default" @click="save">保存</el-button>
      <el-button size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<style lang="scss" scoped></style>
