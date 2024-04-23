<script setup lang="ts">
import type { SelectProps } from '@ant-design/icons-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import type { FormInstance, TableColumnsType } from 'ant-design-vue';
import { Form, Modal } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';
// import { decamelize } from '@types/humps';
import { $t } from '@/locales';
import { fetchGroupList, fuzzySearchUserList, getGroupById, saveGroup, updateGroup } from '@/service/api';
import { debounce } from 'lodash-es';
import { computed, createVNode, onMounted, onUpdated, reactive, ref, toRaw } from 'vue';
const groupForm = Form.useForm;
const listTableLoading = ref(true);
const openGroupModal = ref<boolean>(false);
const applySearch = ref<string>('');
const listDataSource = ref([] as any);
const searchFormRef = ref<FormInstance>();
const userState = reactive({ data: [] as any, value: [] as any, fetching: true });
const groupFormModelRef = reactive({
  action: '',
  id: undefined,
  bindPersons: [],
  groupName: '',
  fullName: '',
  groupCode: '',
  markDeleted: '',
  status: undefined,
  remark: ''
});
const searchFormModelRef = reactive({
  id: undefined,
  groupName: '',
  fullName: '',
  groupCode: '',
  markDeleted: '',
  createdDate: undefined,
  lastModifiedDate: undefined,
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

const groupFormRules: Record<string, Rule[]> = reactive({
  groupName: [
    {
      required: true,
      message: $t('page.manageGroup.applyForm.groupName_validation'),
      tsmg: 'page.manageGroup.applyForm.groupName_validation'
    }
  ],
  fullName: [
    {
      required: true,
      message: $t('page.manageGroup.applyForm.fullName_validation'),
      tsmg: 'page.manageGroup.applyForm.fullName_validation'
    }
  ],
  groupCode: [
    {
      required: true,
      message: $t('page.manageGroup.applyForm.groupCode_validation'),
      tsmg: 'page.manageGroup.applyForm.groupCode_validation'
    }
  ],
  bindPersons: [
    {
      required: true,
      message: $t('page.manageGroup.applyForm.bindPerson_validation'),
      tsmg: 'page.manageGroup.applyForm.bindPerson_validation'
    }
  ],
  remark: [
    {
      required: true,
      message: $t('page.manageGroup.applyForm.remark_validation'),
      tsmg: 'page.manageGroup.applyForm.remark_validation'
    }
  ]
});

const { resetFields, validate, validateInfos } = groupForm(groupFormModelRef, groupFormRules, {
  onValidate: (...args) => console.log(...args)
});

const closeGroupModal = () => {
  openGroupModal.value = false;
};

const listPagination = ref({
  current: 1,
  pageSize: 5,
  total: 0
  // showSizeChanger: true,
  // showQuickJumper: true
  // pageSizeOptions: ['5', '10', '15', '20'],
  // showTotal: total => `共 ${total} 条`, // 显示总数
  // onShowSizeChange: (current, pageSize) => {
  //   listPagination.value.current = 1;
  //   listPagination.value.pageSize = pageSize;
  //   getListDataByCondition(current); // 显示列表的接口名称
  // },
  // // 改变每页数量时更新显示
  // onChange: (current, size) => {
  //   listPagination.value.current = current;
  //   listPagination.value.pageSize = size;
  //   getListDataByCondition(current);
  // }
});

const getListDataByCondition = async (currentPage = 1) => {
  listTableLoading.value = true;
  searchFormModelRef.currentPage = currentPage;
  const searchParam = toRaw(searchFormModelRef);
  const { data: queryResult, error } = await fetchGroupList(searchParam);
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

const onSubmitGroup = () => {
  validate()
    .then(() => {
      Modal.confirm({
        title: $t('common.tip'),
        icon: createVNode(ExclamationCircleOutlined),
        content: '确定保存人员组？',
        okText: $t('common.confirm'),
        cancelText: $t('common.cancel'),
        async onOk() {
          const requestParam = toRaw(groupFormModelRef);
          requestParam.userEmails = requestParam.bindPersons;
          requestParam.markDeleted = requestParam.status ? 'N' : 'Y';
          console.log('action type: ', requestParam.action);
          // requestParam.actionType = value;
          // requestParam.applyForId = requestParam.applyName.option.userId;
          // requestParam.copyToUserEmails = requestParam.applyCCName;
          console.log(requestParam);
          const { error } =
            groupFormModelRef.action === 'create' ? await saveGroup(requestParam) : await updateGroup(requestParam);
          if (!error) {
            console.log('success!');
            resetFields();
            closeGroupModal();
            getListDataByCondition();
          }
        },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onCancel() {
          console.log('cancel');
        }
      });
    })
    .catch(err => {
      console.log('error', err);
    });
};

const loadUserData = debounce(async (keyword: string) => {
  if (!keyword) {
    userState.data = [];
  }
  const { data: items, error } = await fuzzySearchUserList(keyword);
  if (!error) {
    console.log('userInfo:', items);
    if (applySearch.value !== keyword) {
      return;
    }
    userState.data = items;
    userState.fetching = false;
    console.log('users: ', userState);
  }
}, 800);

const onApplySearch = (searchValue: string) => {
  applySearch.value = searchValue;
  userState.data = [];
  userState.fetching = true;
  console.log('Search:', searchValue);
  loadUserData(searchValue);
};

const applyOptions = computed<SelectProps['options']>(() =>
  userState.data.map((user: any) => ({
    label: `${user.firstName} ${user.lastName} <${user.email}>`,
    value: user.email,
    userId: user.sfUserId
  }))
);

const showGroupModal = async (type: string, item?: any) => {
  resetFields();
  console.log('show apply drawer type:', type);
  userState.data = [];
  groupFormModelRef.action = type;
  if (type === 'create') {
    console.log('create...');
  }
  if (type === 'modify' && item && item.id) {
    item.loading = true;
    applyOptions.value.length = 0;
    const { data, error } = await getGroupById(item.id);
    if (!error) {
      if (data.userToGroups) {
        data.userToGroups.forEach((user: any) => {
          applyOptions.value.push({
            label: `${user.userFirstName} ${user.userLastName} <${user.userEmail}>`,
            value: user.userEmail,
            userId: user.userId
          });
        });
      }
      groupFormModelRef.id = item.id;
      groupFormModelRef.bindPersons = applyOptions.value.map((v: any) => v.value);
      groupFormModelRef.status = data.markDeleted === 'N';
      groupFormModelRef.fullName = data.fullName;
      groupFormModelRef.groupCode = data.groupCode;
      groupFormModelRef.groupName = data.groupName;
      groupFormModelRef.remark = data.remark;
      console.log('success:', data);
      item.loading = false;
    }
  }
  openGroupModal.value = true;
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
  console.log('Received values of form: ', values);
  console.log('formState: ', searchFormModelRef);
};

onMounted(async () => {
  const listData = await fetchGroupList({});
  listTableLoading.value = false;
  if (listData?.data?.list && listData.data.list.length > 0) {
    listDataSource.value = [];
    listDataSource.value = listData.data.list;
    listPagination.value.total = listData.data.totalCount;
    listPagination.value.current = listData.data.currPage;
    listPagination.value.pageSize = listData.data.pageSize;
  }
});

onUpdated(() => {
  // 切换语言后表单验证失效
  Object.entries(groupFormRules).forEach(([key, value]) => {
    console.log(`key: ${key}`);
    value[0].message = $t(`${value[0].tsmg}`);
  });
});
</script>

<template>
  <div>
    <a-modal
      v-model:open="openGroupModal"
      width="500px"
      centered
      :title="$t('page.manageGroup.applyForm.groupRequestTitle')"
      @ok="onSubmitGroup"
    >
      <a-form>
        <a-row :gutter="24">
          <a-col span="24">
            <a-form-item v-bind="validateInfos.groupName" :label="$t('page.manageGroup.applyForm.groupName')">
              <a-input v-model:value="groupFormModelRef.groupName"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col span="24">
            <a-form-item v-bind="validateInfos.fullName" :label="$t('page.manageGroup.applyForm.fullName')">
              <a-input v-model:value="groupFormModelRef.fullName"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col span="24">
            <a-form-item v-bind="validateInfos.groupCode" :label="$t('page.manageGroup.applyForm.groupCode')">
              <a-input v-model:value="groupFormModelRef.groupCode"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col span="24">
            <a-form-item v-bind="validateInfos.bindPersons" :label="$t('page.manageGroup.applyForm.bindPerson')">
              <a-select
                v-model:value="groupFormModelRef.bindPersons"
                mode="multiple"
                :default-active-first-option="false"
                :allow-clear="true"
                :not-found-content="userState.fetching ? null : undefined"
                :filter-option="false"
                placeholder="请选择"
                :options="applyOptions"
                @search="onApplySearch"
              ></a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col span="24">
            <a-form-item :label="$t('common.status')">
              <a-switch
                v-model:checked="groupFormModelRef.status"
                :checked-children="$t('common.enable')"
                :un-checked-children="$t('common.disable')"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col span="24">
            <a-form-item v-bind="validateInfos.remark" :label="$t('page.manageGroup.applyForm.remark')">
              <a-textarea v-model:value="groupFormModelRef.remark" :rows="4" allow-clear />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>

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
            <a-form-item :label="$t('page.manageGroup.applyForm.groupName')">
              <a-input
                v-model:value="searchFormModelRef.groupName"
                :placeholder="$t('page.manageGroup.applyForm.groupName_validation')"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col span="6">
            <a-form-item :label="$t('page.manageGroup.applyForm.groupCode')">
              <a-input
                v-model:value="searchFormModelRef.groupCode"
                :placeholder="$t('page.manageGroup.applyForm.groupCode_validation')"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col span="6">
            <a-form-item :label="$t('page.manageGroup.applyForm.fullName')">
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

    <a-card :title="$t('common.list')">
      <template #extra>
        <a-button type="link" @click="showGroupModal('create')">{{ $t('common.newGroupCreate') }}</a-button>
      </template>
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
            <a-button type="link" :loading="record.loading" @click="showGroupModal('modify', record)">
              {{ $t('common.viewDetail') }}
            </a-button>
          </template>
          <template v-else-if="column.key === 'mark_Deleted'">
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
  </div>
</template>

<style scoped></style>
