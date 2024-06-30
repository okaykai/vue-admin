<script setup lang="ts">
import {onMounted, ref, computed, watch} from 'vue'
import useCategoryStore from '@/store/modules/category'
import type {CascaderNode, CascaderOption} from 'element-plus'

let categoryStore = useCategoryStore()
onMounted(() => {
  getC1()
  categoryStore.findCategoryByParentId()
  categoryStore.findAllBrand()
})


const queryDto = ref({brandId: '', categoryId: ''})

// 定义搜索表单数据模型
const brandList = computed(() => categoryStore.brandList)

// 定义表格数据模型
const list = ref([])
// 分页条数据模型
const total = ref(0)

const searchCategoryIdList = ref([])


interface CascaderNodeType {
  value: any;
  level: number;

  [key: string]: any;
}

interface CascaderOptionType {
  value: string | number;
  label: string;
  children?: CascaderOptionType[];

  [key: string]: any;
}


// 加载列表
const props = {
  lazy: true,
  value: 'id',
  label: 'name',
  leaf: 'leaf',
  async lazyLoad(node: CascaderNodeType, resolve: (data: CascaderOptionType[]) => void) {
    const nodeValue = typeof node.value === 'undefined' ? 0 : node.value;
    try {
      const result = await categoryStore.findCategoryByParentId(nodeValue as number);
      if (result && result.data) {
        const data = result.data.map((item: any) => ({
          ...item,
          leaf: !item.hasChildren
        }));

        // 在这里打印 data
        console.log('Data to be resolved:', data);
        resolve(data);
      } else {
        resolve([]);
      }
    } catch (error) {
      console.error('Error loading cascader options:', error);
      resolve([]);
    }
  }
};
const categoryProps = ref(props)

//重置分页搜索条件
const resetData = () => {
  queryDto.value = {brandId: '', categoryId: ''}
  searchCategoryIdList.value = []
  fetchData()
}

// 分页列表查询
// const fetchData = async () => {
//   if (searchCategoryIdList.value.length == 3) {
//     queryDto.value.categoryId = searchCategoryIdList.value[2]
//   }
//   const {data} = await GetCategoryBrandPageList(pageParams.value.page, pageParams.value.limit, queryDto.value)
//   list.value = data.records
//   total.value = data.total
// }
const fetchData = async () => {
  if (searchCategoryIdList.value.length == 3) {

    queryDto.value.categoryId = searchCategoryIdList.value[2]
  }
}
const getC1 = async () => {
  // categoryStore.getC1()
}


const findCategoryBrand = async () => {
  categoryStore.findCategoryByParentId();
}


const handler = (n: number) => {
  if (n === 1) {
    categoryStore.c2Id = ''
    categoryStore.c3Id = ''
    categoryStore.c3Arr = []
    categoryStore.getC2()
  } else if (n === 2) {
    categoryStore.c3Id = ''
    categoryStore.getC3()
  }
}

watch(() => searchCategoryIdList.value, (newValue) => {
  categoryStore.setSearchCategoryIdList(newValue)

  console.log(categoryStore.brandId)
})

watch(() => queryDto.value.brandId, (newBrandId) => {
  categoryStore.setBrandIdChange(newBrandId)
})


defineProps(['scene'])
</script>
<template>
  <el-card>
    <el-form :inline="true">
      <el-row>
        <el-col :span="12">
          <el-form-item label="品牌">
            <el-select class="m-2" placeholder="选择品牌" style="width: 100%"
                       v-model="queryDto.brandId">
              <el-option v-for="item in brandList" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分类">
            <el-cascader :props="categoryProps" style="width: 100%" v-model="searchCategoryIdList"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="display:flex">
        <el-button type="primary" @click="fetchData()">
          搜索
        </el-button>
        <el-button @click="resetData">重置</el-button>
      </el-row>
      <!--      <el-form-item label="二级分类">-->
      <!--        <el-select-->
      <!--            :disabled="scene === 0 ? false : true"-->
      <!--            v-model="categoryStore.c2Id"-->
      <!--            @change="handler(2)"-->
      <!--        >-->
      <!--          <el-option-->
      <!--              v-for="(c2, index) in categoryStore.c2Arr"-->
      <!--              :key="c2.id"-->
      <!--              :label="c2.name"-->
      <!--              :value="c2.id"-->
      <!--          ></el-option>-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="三级分类">-->
      <!--        <el-select-->
      <!--            :disabled="scene === 0 ? false : true"-->
      <!--            v-model="categoryStore.c3Id"-->
      <!--        >-->
      <!--          <el-option-->
      <!--              v-for="(c3, index) in categoryStore.c3Arr"-->
      <!--              :key="c3.id"-->
      <!--              :label="c3.name"-->
      <!--              :value="c3.id"-->
      <!--          ></el-option>-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->
    </el-form>
  </el-card>
</template>
<style lang="scss" scoped></style>
