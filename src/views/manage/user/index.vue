<script setup lang="ts">
import { fetchGetUserInfoById, fetchUserList } from '@/service/api';
import type { FormInstance, TableColumnsType } from 'ant-design-vue';
import { onMounted, reactive, ref, toRaw } from 'vue';
const searchFormRef = ref<FormInstance>();
const listTableLoading = ref(true);
const openDrawerModal = ref<boolean>(false);
const listDataSource = ref([] as any);
const searchFormModelRef = reactive({
  cwid: '',
  firsName: '',
  lastName: '',
  chineseName: '',
  englishName: '',
  email: '',
  gender: '',
  companyCode: '',
  department: '',
  currentPage: 1,
  orders: [] as any[]
});
const applyModelRef = reactive<{ user: Api.Auth.UserInfo }>({
  user: undefined as any
});
const tableColumns: TableColumnsType = [
  {
    title: 'page.manageUser.applyForm.userFirstName',
    sorter: true,
    width: 80,
    dataIndex: 'firstName',
    key: 'bu.FIRST_NAME'
  },
  {
    title: 'page.manageUser.applyForm.userLastName',
    sorter: true,
    width: 80,
    dataIndex: 'lastName',
    key: 'bu.LAST_NAME'
  },
  {
    title: 'page.manageUser.applyForm.userChineseName',
    sorter: true,
    dataIndex: 'chineseName',
    key: 'bu.CHINESE_NAME',
    width: 100
  },
  {
    title: 'form.applicateInfo.employeeNo',
    sorter: true,
    dataIndex: 'employeeId',
    key: 'bu.EMPLOYEE_ID',
    width: 80
  },
  {
    title: 'form.applicateInfo.employeeLe',
    sorter: true,
    dataIndex: 'companyCode',
    key: 'bu.COMPANY_CODE',
    width: 80
  },
  { title: 'common.createdDate', sorter: true, dataIndex: 'createdDate', key: 'bu.CREATED_DATE', width: 100 },
  {
    title: 'common.lastModifiedDate',
    sorter: true,
    dataIndex: 'lastModifiedDate',
    key: 'bu.LAST_MODIFIED_DATE',
    width: 100
  },
  { title: 'common.status', sorter: true, dataIndex: 'markDeleted', key: 'bu.MARK_DELETED', width: 80 },
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

const closeDrawerModal = () => {
  openDrawerModal.value = false;
};

const showDrawerModal = async (item?: any) => {
  console.info('item: ', item);
  const { data, error } = await fetchGetUserInfoById(item.sfUserId);
  if (!error) {
    applyModelRef.user = data;
  }
  openDrawerModal.value = true;
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
            <a-form-item label="CWID" name="cwid">
              <a-input v-model:value="searchFormModelRef.cwid"></a-input>
            </a-form-item>
          </a-col>
          <a-col span="6">
            <a-form-item :label="$t('page.manageUser.applyForm.userChineseName')" name="chineseName">
              <a-input v-model:value="searchFormModelRef.chineseName"></a-input>
            </a-form-item>
          </a-col>
          <a-col span="6">
            <a-form-item :label="$t('page.manageUser.applyForm.userEnglishName')" name="englishName">
              <a-input v-model:value="searchFormModelRef.englishName"></a-input>
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

    <a-card :title="$t('common.list')">
      <a-table
        :columns="tableColumns"
        :pagination="listPagination"
        :loading="listTableLoading"
        :data-source="listDataSource"
        :scroll="{ x: 1500 }"
        class="table-list"
        @change="handleTableChange"
      >
        <!--语言切换时表头显示-->
        <template #headerCell="{ column }">
          <span>
            {{ $tm(`${column.title}`) }}
          </span>
        </template>

        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'operation'">
            <a-button type="link" :loading="record.loading" @click="showDrawerModal(record)">
              {{ $t('common.viewDetail') }}
            </a-button>
          </template>

          <template v-else-if="column.key === 'bu.MARK_DELETED'">
            <span>
              <template v-if="record.markDeleted === 'Y'">
                <a-tag color="red">{{ $t('common.disable') }}</a-tag>
              </template>
              <template v-else>
                <a-tag color="green">{{ $t('common.enable') }}</a-tag>
              </template>
            </span>
          </template>
        </template>
      </a-table>
    </a-card>

    <a-drawer title="员工详细信息" width="75%" size="large" :open="openDrawerModal" @close="closeDrawerModal">
      <a-descriptions title="员工基本信息">
        <a-descriptions-item label="英文名">
          {{ applyModelRef.user.firstName }} {{ applyModelRef.user.lastName }}
        </a-descriptions-item>
        <a-descriptions-item label="中文名">
          {{ applyModelRef.user.chineseName }}
        </a-descriptions-item>
        <a-descriptions-item label="CWID">
          {{ applyModelRef.user.cwid }}
        </a-descriptions-item>
        <a-descriptions-item label="邮箱">
          {{ applyModelRef.user.email }}
        </a-descriptions-item>
        <a-descriptions-item label="员工编号">
          {{ applyModelRef.user.employeeId }}
        </a-descriptions-item>
        <a-descriptions-item label="DIVISION">
          {{ applyModelRef.user.division }}
        </a-descriptions-item>
        <a-descriptions-item label="公司编号">
          {{ applyModelRef.user.companyCode }}
        </a-descriptions-item>
        <a-descriptions-item label="成本中心">
          {{ applyModelRef.user.costCenter }}
        </a-descriptions-item>
        <a-descriptions-item label="组织">
          {{ applyModelRef.user.orgTxt }}
        </a-descriptions-item>
        <a-descriptions-item label="职位">
          {{ applyModelRef.user.positionTxt }}
        </a-descriptions-item>
        <a-descriptions-item label="oUDescription">
          {{ applyModelRef.user.oUDescription }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('common.status')">
          <template v-if="applyModelRef.user.markDeleted === 'Y'">
            <a-tag color="red">{{ $t('common.disable') }}</a-tag>
          </template>
          <template v-else>
            <a-tag color="green">{{ $t('common.enable') }}</a-tag>
          </template>
        </a-descriptions-item>
      </a-descriptions>

      <a-descriptions title="上级主管基本信息">
        <a-descriptions-item label="英文名">
          {{ applyModelRef.user.supervisor.firstName }} {{ applyModelRef.user.supervisor.lastName }}
        </a-descriptions-item>
        <a-descriptions-item label="中文名">
          {{ applyModelRef.user.supervisor.chineseName }}
        </a-descriptions-item>
        <a-descriptions-item label="CWID">
          {{ applyModelRef.user.supervisor.cwid }}
        </a-descriptions-item>
        <a-descriptions-item label="邮箱">
          {{ applyModelRef.user.supervisor.email }}
        </a-descriptions-item>
        <a-descriptions-item label="员工编号">
          {{ applyModelRef.user.supervisor.employeeId }}
        </a-descriptions-item>
        <a-descriptions-item label="DIVISION">
          {{ applyModelRef.user.supervisor.division }}
        </a-descriptions-item>
        <a-descriptions-item label="公司编号">
          {{ applyModelRef.user.supervisor.companyCode }}
        </a-descriptions-item>
        <a-descriptions-item label="成本中心">
          {{ applyModelRef.user.supervisor.costCenter }}
        </a-descriptions-item>
        <a-descriptions-item label="组织">
          {{ applyModelRef.user.supervisor.orgTxt }}
        </a-descriptions-item>
        <a-descriptions-item label="职位">
          {{ applyModelRef.user.supervisor.positionTxt }}
        </a-descriptions-item>
        <a-descriptions-item label="oUDescription">
          {{ applyModelRef.user.supervisor.oUDescription }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('common.status')">
          <template v-if="applyModelRef.user.supervisor.markDeleted === 'Y'">
            <a-tag color="red">{{ $t('common.disable') }}</a-tag>
          </template>
          <template v-else>
            <a-tag color="green">{{ $t('common.enable') }}</a-tag>
          </template>
        </a-descriptions-item>
      </a-descriptions>
    </a-drawer>
  </div>
</template>

<style scoped></style>
