<script setup lang="ts">
import { fetchUserList } from '@/service/api';
import type { FormInstance, TableColumnsType } from 'ant-design-vue';
import { onMounted, reactive, ref, toRaw } from 'vue';

const searchFormRef = ref<FormInstance>();
const listTableLoading = ref(true);
const listDataSource = ref([] as any);
const searchFormModelRef = reactive({
  cwid: '',
  firsName: '',
  lastName: '',
  email: '',
  gender: '',
  companyCode: '',
  department: '',
  currentPage: 1,
  orders: [] as any[]
});

const tableColumns: TableColumnsType = [
  {
    title: 'page.manageGroup.applyForm.groupName',
    sorter: true,
    width: 100,
    dataIndex: 'groupName',
    key: 'GROUP_NAME'
  },
  {
    title: 'page.manageGroup.applyForm.groupCode',
    sorter: true,
    width: 100,
    dataIndex: 'groupCode',
    key: 'GROUP_CODE'
  },
  {
    title: 'page.manageGroup.applyForm.fullName',
    sorter: true,
    dataIndex: 'fullName',
    key: 'FULL_NAME',
    width: 150
  },
  { title: 'page.manageGroup.applyForm.remark', sorter: true, dataIndex: 'remark', key: 'REMARK', width: 150 },
  { title: 'common.createdDate', sorter: true, dataIndex: 'createdDate', key: 'CREATED_DATE', width: 100 },
  {
    title: 'common.lastModifiedDate',
    sorter: true,
    dataIndex: 'lastModifiedDate',
    key: 'LAST_MODIFIED_DATE',
    width: 100
  },
  { title: 'common.status', sorter: true, dataIndex: 'markDeleted', key: 'MARK_DELETED', width: 100 },
  {
    title: 'common.action',
    key: 'operation',
    fixed: 'right',
    width: 100
  }
];

const listPagination = ref({
  current: 1,
  pageSize: 5,
  total: 0
});

const getListDataByCondition = async (currentPage = 1) => {
  listTableLoading.value = true;
  searchFormModelRef.currentPage = currentPage;
  const searchParam = toRaw(searchFormModelRef);
  const { data: queryResult, error } = await fetchUserList(searchParam);
  listDataSource.value = [];
  if (!error) {
    if (queryResult.list !== null && queryResult.list?.length > 0) {
      listDataSource.value = queryResult?.list;
      listPagination.value.total = queryResult?.totalCount ? queryResult?.totalCount : 0;
      listPagination.value.current = queryResult?.currPage ? queryResult?.currPage : 1;
      listPagination.value.pageSize = queryResult?.pageSize ? queryResult?.pageSize : 5;
    }
  }
  listTableLoading.value = false;
};

// 表格修改
const handleTableChange = (pag: { pageSize: number; current: number }, filters: any, sorter: any) => {
  console.log('filter: ', filters);
  searchFormModelRef.orders = [];
  if (sorter.columnKey) {
    searchFormModelRef.orders.push({ column: sorter.columnKey, type: sorter.order === 'ascend' ? 'ASC' : 'DESC' });
  }
  getListDataByCondition(pag.current);
};

const resetSearchForm = () => {
  searchFormRef?.value?.resetFields();
};

const onFinishSearch = (values: any) => {
  console.log('User values of form: ', values);
  console.log('formState: ', searchFormModelRef);
};
onMounted(async () => {
  const listData = await fetchUserList({});
  listTableLoading.value = false;
  if (listData?.data?.list && listData.data.list.length > 0) {
    listDataSource.value = [];
    listDataSource.value = listData.data.list;
    listPagination.value.total = listData.data.totalCount;
    listPagination.value.current = listData.data.currPage;
    listPagination.value.pageSize = listData.data.pageSize;
  }
});
</script>

<template>
  <div>
    <a-card :title="$t('common.search')">
      <a-form
        ref="searchFormRef"
        :model="searchFormModelRef"
        name="advanced_search"
        class="ant-advanced-search-form"
        @finish="onFinishSearch"
      >
        <a-row :gutter="8">
          <a-col span="6">
            <a-form-item :label="$t('page.manageGroup.applyForm.groupName')" name="cwid">
              <a-input
                v-model:value="searchFormModelRef.cwid"
                :placeholder="$t('page.manageGroup.applyForm.groupName_validation')"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col span="6">
            <a-form-item :label="$t('page.manageGroup.applyForm.groupCode')" name="groupCode">
              <a-input
                v-model:value="searchFormModelRef.groupCode"
                :placeholder="$t('page.manageGroup.applyForm.groupCode_validation')"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col span="6">
            <a-form-item :label="$t('page.manageGroup.applyForm.fullName')" name="fullName">
              <a-input
                v-model:value="searchFormModelRef.fullName"
                :placeholder="$t('page.manageGroup.applyForm.fullName_validation')"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="5" style="text-align: right">
            <a-space :size="5">
              <a-button type="primary" html-type="submit" @click="getListDataByCondition()">
                {{ $t('common.search') }}
              </a-button>
              <a-button style="margin: 1px" @click="resetSearchForm()">{{ $t('common.reset') }}</a-button>
            </a-space>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
  </div>
</template>

<style scoped></style>
