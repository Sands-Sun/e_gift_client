<script setup lang="tsx">
import { enableStatusOptions } from '@/constants/business';
import { $t } from '@/locales';
import { deleteRole, fetchAllRoutes, fetchRole, fuzzySearchUserList, saveRole } from '@/service/api';
import type { SelectProps } from '@ant-design/icons-vue';
import type { FormInstance, TableColumnsType, TreeProps } from 'ant-design-vue';
import { Button, Popconfirm, message } from 'ant-design-vue';
import { debounce } from 'lodash-es';
import { nextTick, onMounted, reactive, ref, toRaw, watch } from 'vue';
const userState = reactive({ data: [] as any, fetching: true });
const applyOptions = ref<SelectProps['options']>([]);
const searchFormRef = ref<FormInstance>();
const userRoleFromRef = ref<FormInstance>();
const applySearch = ref<string>('');
const listDataSource = ref([] as any);
const listTableLoading = ref(true);
const visible = ref<boolean>(false);
const title = ref<string>();
const expandedKeys = ref<string[]>([]);
const selectedKeys = ref<string[]>([]);
const checkedKeys = ref<string[]>([]);

const fieldNames: TreeProps['fieldNames'] = {
  title: 'name',
  key: 'id'
};
const treeData: Ref<TreeProps['treeData']> = ref([]);
const listPagination = ref({
  total: 0,
  current: 1,
  pageSize: 10
});
const tableColumns: TableColumnsType = [
  {
    title: 'page.manage.table.index',
    dataIndex: 'id',
    key: 'ID'
  },
  {
    title: 'page.manage.table.roleName',
    dataIndex: 'roleName',
    key: 'ROLE_NAME'
  },
  {
    title: 'page.manage.table.desc',
    dataIndex: 'remark',
    key: 'REMARK'
  },
  {
    title: 'page.manage.table.status',
    dataIndex: 'markForDelete',
    key: 'MARK_FOR_DELETE'
  },
  {
    title: 'common.operate',
    key: 'operate',
    align: 'center',
    width: 130
  }
];

const searchParams = reactive({
  roleName: '',
  status: '',
  markDeleted: '',
  currentPage: 1,
  orders: [] as any[]
});

const roleModel = reactive({
  id: '',
  roleName: '',
  status: '',
  remark: '',
  userEmails: [],
  functions: '',
  markDeleted: ''
});

const loadUserData = debounce(async (keyword: string) => {
  if (!keyword) {
    userState.data = [];
  }
  const queryParam = { keyword, baseOnCompany: false, division: '' };
  const { data: items, error } = await fuzzySearchUserList(queryParam);
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

const getListDataByCondition = async (currentPage = 1) => {
  listTableLoading.value = true;
  searchParams.currentPage = currentPage;
  const searchParam = toRaw(searchParams);
  if (searchParam.status === '0') {
    searchParam.markDeleted = 'N';
  } else if (searchParam.status === '1') {
    searchParam.markDeleted = 'Y';
  }
  const { data: queryResult, error } = await fetchRole(searchParam);
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

// rest button
const reset = async () => {
  nextTick(() => {
    searchParams.roleName = '';
    searchParams.status = '';
    searchParams.markDeleted = '';
    getListDataByCondition();
  });
};

// tale change
const handleTableChange = (pag: { pageSize: number; current: number }, filters: any, sorter: any) => {
  listTableLoading.value = true;
  console.log('filter: ', filters);
  searchParams.orders = [];
  if (sorter.columnKey) {
    searchParams.orders.push({ column: sorter.columnKey, type: sorter.order === 'ascend' ? 'ASC' : 'DESC' });
  }
  getListDataByCondition(pag.current);
};

const resetFromFields = () => {
  roleModel.id = '';
  roleModel.markDeleted = '';
  roleModel.status = '';
  roleModel.remark = '';
  roleModel.roleName = '';
  roleModel.userEmails = [];
  roleModel.functions = '';
  userState.data = [];
  checkedKeys.value = [];
  selectedKeys.value = [];
  expandedKeys.value = [];
};

const closeDrawer = () => {
  userRoleFromRef?.value?.resetFields();
  visible.value = false;
  // resetFromFields();
};

const addRole = async () => {
  resetFromFields();
  // editId = '-1';
  const routers = await fetchAllRoutes();
  treeData.value = routers.data;
  visible.value = true;
  title.value = $t('page.manage.role.common.addTitle');
};

const handleSubmit = async () => {
  // add role
  // debugger;
  console.log('s');

  userRoleFromRef?.value
    ?.validate()
    .then(async () => {
      // debugger;
      const newRole = toRaw(roleModel);
      newRole.functions = checkedKeys.value.toString();
      newRole.markDeleted = newRole.status === '0' ? 'N' : 'Y';
      // if (editId !== '-1') {
      //   newRole.id = editId;
      // }
      const { error } = await saveRole(newRole);
      if (!error) {
        message.info('操作成功');
        reset();
        closeDrawer();
        visible.value = false;
      }
    })
    .catch(err => {
      console.log('error', err);
    });
};

const handleEdit = async (record: any) => {
  // editId = record.id;
  const routers = await fetchAllRoutes();
  treeData.value = routers.data;
  visible.value = true;
  title.value = $t('page.manage.role.common.editTitle');
  roleModel.id = record.id;
  roleModel.roleName = record.roleName;
  roleModel.status = record.markDeleted === 'N' ? '0' : '1';
  roleModel.remark = record.remark;
  if (record.userToRoles) {
    const options = [] as any;
    record.userToRoles.forEach((user: any) => {
      options.push({
        firstName: user.userFirstName,
        lastName: user.userLastName,
        email: user.userEmail
      });
      userState.data = options;
      roleModel.userEmails = options.map((v: any) => v.email);
    });
  }
  const keyStrArray = record.functions.split(',');
  checkedKeys.value = keyStrArray.map(Number);
  expandedKeys.value = keyStrArray.map(Number);
};

const handleDelete = async (id: any) => {
  const ids = [];
  ids.push(id);
  const { error } = await deleteRole(ids);
  if (!error) {
    message.info('操作成功');
    reset();
    visible.value = false;
  }
};

watch(
  () => [userState.data],
  ([newUserVal], [oldUserVal]) => {
    console.log('newUserVal:', newUserVal);
    console.log('oldUserVal: ', oldUserVal);
    applyOptions.value = userState.data.map((user: any) => ({
      label: `${user.firstName} ${user.lastName} <${user.email}>`,
      value: user.email
    }));
  },
  { deep: true }
);

onMounted(async () => {
  // 初始加载数据
  const resultData = await fetchRole({});
  listTableLoading.value = false;
  if (resultData?.data?.list && resultData.data.list.length > 0) {
    listDataSource.value = [];
    listDataSource.value = resultData.data.list;
    listPagination.value.current = resultData.data?.currPage;
    listPagination.value.total = resultData.data?.totalCount;
  }
});
</script>

<template>
  <div class="flex-col-stretch card-gap min-h-500px gap-16px overflow-hidden lt-sm:overflow-auto">
    <a-card :title="$t('common.search')" :bordered="false" class="card-wrapper">
      <a-form ref="searchFormRef" :model="searchParams" :label-width="80">
        <a-row :gutter="[16, 16]" wrap>
          <a-col :span="24" :md="12" :lg="9">
            <a-formItem :label="$t('page.manage.role.roleName')" name="roleName" class="m-0">
              <a-input v-model:value="searchParams.roleName" />
            </a-formItem>
          </a-col>
          <a-col :span="24" :md="12" :lg="9">
            <a-formItem :label="$t('page.manage.role.roleStatus')" name="status" class="m-0">
              <a-select v-model:value="searchParams.status" allow-clear>
                <a-selectOption v-for="option in enableStatusOptions" :key="option.value" :value="option.value">
                  {{ $t(option.label) }}
                </a-selectOption>
              </a-select>
            </a-formItem>
          </a-col>
          <a-col :span="24" :md="12" :lg="6">
            <a-formItem class="m-0">
              <div class="w-full flex-y-center justify-end gap-12px">
                <a-button type="primary" ghost @click="getListDataByCondition()">
                  <div class="flex-y-center gap-8px">
                    <icon-ic-round-search class="text-icon" />
                    <span>{{ $t('common.search') }}</span>
                  </div>
                </a-button>
                <a-button @click="reset()">
                  <div class="flex-y-center gap-8px">
                    <icon-ic-round-refresh class="text-icon" />
                    <span>{{ $t('common.reset') }}</span>
                  </div>
                </a-button>
              </div>
            </a-formItem>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card
      :title="$t('page.manage.role.title')"
      :bordered="false"
      :body-style="{ flex: 1, overflow: 'hidden' }"
      class="flex-col-stretch card-gap sm:flex-1-hidden card-wrapper"
    >
      <template #extra>
        <div class="flex flex-wrap justify-end gap-x-12px gap-y-8px lt-sm:(w-200px py-12px)">
          <slot name="prefix"></slot>
          <slot name="default">
            <a-button size="small" ghost type="primary" @click="addRole()">
              <div class="flex-y-center gap-8px">
                <icon-ic-round-plus class="text-icon" />
                <span>{{ $t('common.add') }}</span>
              </div>
            </a-button>
          </slot>
          <slot name="suffix"></slot>
        </div>
      </template>
      <a-table
        :columns="tableColumns"
        :data-source="listDataSource"
        :pagination="listPagination"
        :loading="listTableLoading"
        @change="handleTableChange"
      >
        <!--语言切换时表头显示-->
        <template #headerCell="{ column }">
          <span>
            {{ $tm(`${column.title}`) }}
          </span>
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'operate'">
            <div class="flex-center gap-8px">
              <Button type="primary" ghost size="small" @click="handleEdit(record)">{{ $t('common.edit') }}</Button>
              <Popconfirm :content="$t('common.confirmDelete')" @confirm="handleDelete(record.id)">
                <Button danger size="small">{{ $t('common.delete') }}</Button>
              </Popconfirm>
            </div>
          </template>
          <template v-else-if="column.key === 'MARK_FOR_DELETE'">
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

    <a-drawer v-model:open="visible" :title="title" width="35%">
      <a-form ref="userRoleFromRef" :model="roleModel">
        <a-formItem
          :label="$t('page.manage.role.roleName')"
          name="roleName"
          :rules="[
            {
              required: true,
              message: $t('page.manage.role.roleName_validation')
            }
          ]"
        >
          <a-input v-model:value="roleModel.roleName" />
        </a-formItem>
        <a-formItem
          :label="$t('page.manage.role.bindPerson')"
          name="userEmails"
          :rules="[
            {
              required: true,
              message: $t('form.common.select_validation')
            }
          ]"
        >
          <a-select
            v-model:value="roleModel.userEmails"
            mode="multiple"
            :default-active-first-option="false"
            :allow-clear="true"
            :not-found-content="userState.fetching ? null : undefined"
            :filter-option="false"
            :placeholder="$t('form.common.select_validation')"
            :options="applyOptions"
            @search="onApplySearch"
          ></a-select>
        </a-formItem>

        <a-formItem
          :label="$t('page.manage.role.roleStatus')"
          name="status"
          :rules="[
            {
              required: true,
              message: $t('form.common.select_validation')
            }
          ]"
        >
          <a-radio-group v-model:value="roleModel.status">
            <a-radio value="0">{{ $t('page.manage.common.status.enable') }}</a-radio>
            <a-radio value="1">{{ $t('page.manage.common.status.disable') }}</a-radio>
          </a-radio-group>
        </a-formItem>
        <a-formItem
          :label="$t('page.manage.role.roleDesc')"
          name="remark"
          :rules="[
            {
              required: true,
              message: $t('page.manage.role.roleDesc_validation')
            }
          ]"
        >
          <a-input v-model:value="roleModel.remark" />
        </a-formItem>
        <a-formItem :label="$t('page.manage.role.roleMenu')" name="roleDesc">
          <br />
          <a-tree
            v-model:expandedKeys="expandedKeys"
            v-model:selectedKeys="selectedKeys"
            v-model:checkedKeys="checkedKeys"
            checkable
            :tree-data="treeData"
            :field-names="fieldNames"
          />
        </a-formItem>
      </a-form>
      <template #footer>
        <div class="flex-y-center justify-end gap-12px">
          <a-button @click="closeDrawer">{{ $t('common.cancel') }}</a-button>
          <a-button type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</a-button>
        </div>
      </template>
    </a-drawer>
  </div>
</template>

<style scoped>
.card-gap {
  margin-top: 2%;
}
</style>
