<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue'
import {reqAddOrUpdateAttr, reqRemoveAttr, getSpecList} from '@/api/product/attr'
import type {Attr, AttrValue, Attrs, AttrResponse} from '@/api/product/attr/type'
import {ElMessage} from 'element-plus'

const scene = ref<number>(0)
const specList = ref<Attrs[]>([])
const attrParams = reactive<Attr>({
  id: undefined,
  specName: '',
  specValue: '[]',
})

const parseSpecValue = (specValueString: string): AttrValue[] => {
  try {
    return JSON.parse(specValueString)
  } catch (error) {
    console.error('Error parsing specValue:', error)
    return []
  }
}

const stringifySpecValue = (specValueList: AttrValue[]): string => {
  return JSON.stringify(
      specValueList.map(({key, valueList}) => ({key, valueList}))
  )
}

onMounted(() => {
  getAttr()
})

const getAttr = async (page = 1, limit = 10) => {
  try {
    const res: AttrResponse = await getSpecList(page, limit)
    if (res.code === 200) {
      specList.value = res.data.records
    }
  } catch (error) {
    console.error('Error fetching spec list:', error)
    ElMessage.error('获取规格列表失败')
  }
}

const addAttr = () => {
  Object.assign(attrParams, {id: undefined, specName: '', specValue: '[]'})
  scene.value = 1
}

const updateAttr = (row: Attrs) => {
  Object.assign(attrParams, row)
  scene.value = 1
}

const cancel = () => {
  scene.value = 0
}

const addAttrValue = () => {
  const attrValueList = parseSpecValue(attrParams.specValue)
  if (attrParams.specName) {
    attrValueList.push({key: attrParams.specName, valueList: []})
    attrParams.specValue = stringifySpecValue(attrValueList)
    attrParams.specName = '' // 重置specName
  } else {
    ElMessage.error('请先填写属性名称')
  }
}

const save = async () => {
  try {
    const attrValueList = parseSpecValue(attrParams.specValue)
    attrParams.specValue = stringifySpecValue(attrValueList)

    const res: any = await reqAddOrUpdateAttr(attrParams)
    if (res.code === 200) {
      scene.value = 0
      ElMessage.success(attrParams.id ? '修改成功' : '添加成功')
      getAttr()
    } else {
      ElMessage.error(attrParams.id ? '修改失败' : '添加失败')
    }
  } catch (error) {
    console.error('Error saving attr:', error)
    ElMessage.error('保存失败')
  }
}

const deleteAttr = async (attrId: number) => {
  try {
    const res: any = await reqRemoveAttr(attrId)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      getAttr()
    } else {
      ElMessage.error('删除失败')
    }
  } catch (error) {
    console.error('Error deleting attr:', error)
    ElMessage.error('删除失败')
  }
}

const handleInputConfirm = (row: AttrValue, inputValue: string) => {
  if (inputValue && !row.valueList.includes(inputValue)) {
    row.valueList.push(inputValue)
  }
  row.inputVisible = false
  row.inputValue = ''
  attrParams.specValue = stringifySpecValue(parseSpecValue(attrParams.specValue)) // 更新specValue
}
</script>

<template>
  <el-card style="margin: 10px 0">
    <div v-if="scene === 0">
      <el-button type="primary" size="default" icon="Plus" @click="addAttr">
        添加平台属性
      </el-button>
      <el-table border style="margin: 10px 0" :data="specList">
        <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
        <el-table-column label="属性名称" prop="specName"></el-table-column>
        <el-table-column label="属性值列表">
          <template #default="{ row }">
            <el-tag style="margin-left: 5px" v-for="(value, index) in parseSpecValue(row.specValue)[0]?.valueList || []"
                    :key="index" closable>
              {{ value }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="primary" @click="updateAttr(row)">编辑</el-button>
            <el-button type="danger" @click="deleteAttr(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-else>
      <el-form :inline="true">
        <el-form-item label="属性名称">
          <el-input v-model="attrParams.specName"></el-input>
        </el-form-item>
      </el-form>
      <el-button style="margin: 10px 0" type="primary" @click="addAttrValue" :disabled="!attrParams.specName">
        添加属性值
      </el-button>
      <el-button style="margin: 10px 0;margin-left: 5px" @click="cancel">取消</el-button>
      <el-table border :data="parseSpecValue(attrParams.specValue)">
        <el-table-column label="属性值名称">
          <template #default="{ row }">
            <el-tag style="margin-left: 5px" v-for="(value, index) in row.valueList" :key="index" closable>
              {{ value }}
            </el-tag>
            <el-input
                v-if="row.inputVisible"
                v-model="row.inputValue"
                @keyup.enter="handleInputConfirm(row, row.inputValue)"
                @blur="handleInputConfirm(row, row.inputValue)"
            ></el-input>
            <el-button v-else @click="row.inputVisible = true">+ 新属性值</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button style="margin: 10px 0" type="primary" @click="save"
                 :disabled="!parseSpecValue(attrParams.specValue).length">
        保存
      </el-button>
      <el-button style="margin: 10px 0;margin-left: 5px" @click="cancel">取消</el-button>
    </div>
  </el-card>
</template>
<style>
.div-atrr {
  padding: 5px 10px;
  margin: 0 10px;
  background-color: powderblue;
  border-radius: 10px;
}
</style>