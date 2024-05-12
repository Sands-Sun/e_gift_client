<script setup lang="tsx">
import { ref } from 'vue';
import { Button, Popconfirm, Tag, message } from 'ant-design-vue';
import { $t } from '@/locales';
import { enableStatusOptions } from '@/constants/business';
import { deleteRole, fetchAllRoutes, fetchRole, saveRole } from '@/service/api';

const columns = [
  {
    title: $t('page.manage.table.index'),
    dataIndex: 'id',
    key: 'id'
  },
  {
    title: $t('page.manage.table.roleName'),
    dataIndex: 'roleName',
    key: 'roleName'
  },
  {
    title: $t('page.manage.table.desc'),
    dataIndex: 'remark',
    key: 'remark'
  },
  {
    title: $t('page.manage.table.status'),
    dataIndex: 'markForDelete',
    key: 'markForDelete'
  },
  {
    key: 'operate',
    title: $t('common.operate'),
    align: 'center',
    width: 130,
    customRender: ({ record }) => (
      <div class="flex-center gap-8px">
        <Button type="primary" ghost size="small" onClick={() => handleEdit(record)}>
          {$t('common.edit')}
        </Button>
        <Popconfirm onConfirm={() => handleDelete(record.id)} content={$t('common.confirmDelete')}>
          <Button danger size="small">
            {$t('common.delete')}
          </Button>
        </Popconfirm>
      </div>
    )
  }
];
const dataList = ref([]);
const loading = ref(false);
const pagination = ref({
  total: 0,
  current: 1,
  pageSize: 10
});
const visible = ref<boolean>(false);
const title = ref<string>();
const expandedKeys = ref<string[]>([]);
const selectedKeys = ref<string[]>([]);
const checkedKeys = ref<string[]>([]);
const adrawerform = ref();
let editId = '-1';

const fieldNames: TreeProps['fieldNames'] = {
  title: 'name',
  key: 'id'
};
const treeData: Ref<TreeProps['treeData']> = ref([]);

interface SearchParams {
  roleName: string;
  status: string;
}
interface RoleInfo {
  roleName: string;
  status: string;
  roleDesc: string;
}
const searchParams = ref<SearchParams>({
  roleName: '',
  status: ''
});

const roleModel = ref<RoleInfo>({
  roleName: '',
  status: '',
  roleDesc: ''
});

// 初始加载数据
const param = {
  current: 1,
  pageSize: 10
};
const resultData = await fetchRole(param);
dataList.value = resultData.data.list;
pagination.value.current = resultData.data.currpage;
pagination.value.total = resultData.data.totalCount;

// rest button
const reset = async () => {
  loading.value = true;
  searchParams.value.roleName = '';
  searchParams.value.status = '';
  const param = {
    current: 1,
    pageSize: 10
  };
  const resultData = await fetchRole(param);
  dataList.value = resultData.data.list;
  pagination.value.current = resultData.data.currpage;
  pagination.value.total = resultData.data.totalCount;
  loading.value = false;
};

// search button
const search = async () => {
  loading.value = true;
  const params = {
    current: 1,
    pageSize: 10,
    ...searchParams.value
  };

  const resultData = await fetchRole(params);
  dataList.value = resultData.data.list;
  pagination.value.current = resultData.data.currpage;
  pagination.value.total = resultData.data.totalCount;

  loading.value = false;
};

// tale change
const handleTableChange = async () => {
  loading.value = true;
  const params = {
    ...pagination.value,
    ...searchParams.value
  };

  const resultData = await fetchRole(params);
  dataList.value = resultData.data.list;
  pagination.value.current = resultData.data.currpage;
  pagination.value.total = resultData.data.totalCount;

  loading.value = false;
};

const closeDrawer = () => {
  adrawerform.value.resetFields();
  visible.value = false;
  checkedKeys.value = [];
  selectedKeys.value = [];
  expandedKeys.value = [];
};

const addRole = async () => {
  editId = '-1';
  const routers = await fetchAllRoutes();
  treeData.value = routers.data;
  visible.value = true;
  title.value = $t('page.manage.role.common.addTitle');
};

const handleSubmit = async () => {
  // add role
  debugger;
  console.log('s');

  const newRole = {
    ...roleModel.value,
    status: roleModel.value.status.toString(),
    function: checkedKeys.value.toString()
  };
  if (editId !== '-1') {
    newRole.id = editId;
  }
  const result = await saveRole(newRole);
  if (result.data === 'success') {
    message.info('操作成功');
    reset();
    closeDrawer();
    visible.value = false;
  }
};

const handleEdit = async record => {
  editId = record.id;
  const routers = await fetchAllRoutes();
  treeData.value = routers.data;
  visible.value = true;
  title.value = $t('page.manage.role.common.editTitle');
  roleModel.value.roleName = record.roleName;
  roleModel.value.status = record.markForDelete;
  roleModel.value.roleDesc = record.remark;
  const keyStrArray = record.functions.split(',');

  checkedKeys.value = keyStrArray.map(Number);
  expandedKeys.value = keyStrArray.map(Number);
};

const handleDelete = async id => {
  const ids = [];
  ids.push(id);
  const result = await deleteRole(ids);
  if (result.data === 'success') {
    message.info('操作成功');
    reset();
    visible.value = false;
  }
};
</script>

<template>
  <div class="flex-col-stretch card-gap min-h-500px gap-16px overflow-hidden lt-sm:overflow-auto">
    <ACard :title="$t('common.search')" :bordered="false" class="card-wrapper">
      <AForm :model="searchParams" :label-width="80">
        <ARow :gutter="[16, 16]" wrap>
          <ACol :span="24" :md="12" :lg="9">
            <AFormItem :label="$t('page.manage.role.roleName')" name="roleName" class="m-0">
              <AInput v-model:value="searchParams.roleName" />
            </AFormItem>
          </ACol>
          <ACol :span="24" :md="12" :lg="9">
            <AFormItem :label="$t('page.manage.role.roleStatus')" name="status" class="m-0">
              <ASelect v-model:value="searchParams.status" allow-clear>
                <ASelectOption v-for="option in enableStatusOptions" :key="option.value" :value="option.value">
                  {{ $t(option.label) }}
                </ASelectOption>
              </ASelect>
            </AFormItem>
          </ACol>
          <ACol :span="24" :md="12" :lg="6">
            <AFormItem class="m-0">
              <div class="w-full flex-y-center justify-end gap-12px">
                <AButton @click="reset()">
                  <div class="flex-y-center gap-8px">
                    <icon-ic-round-refresh class="text-icon" />
                    <span>{{ $t('common.reset') }}</span>
                  </div>
                </AButton>
                <AButton type="primary" ghost @click="search()">
                  <div class="flex-y-center gap-8px">
                    <icon-ic-round-search class="text-icon" />
                    <span>{{ $t('common.search') }}</span>
                  </div>
                </AButton>
              </div>
            </AFormItem>
          </ACol>
        </ARow>
      </AForm>
    </ACard>
    <ACard
      :title="$t('page.manage.role.title')"
      :bordered="false"
      :body-style="{ flex: 1, overflow: 'hidden' }"
      class="flex-col-stretch card-gap sm:flex-1-hidden card-wrapper"
    >
      <template #extra>
        <div class="flex flex-wrap justify-end gap-x-12px gap-y-8px lt-sm:(w-200px py-12px)">
          <slot name="prefix"></slot>
          <slot name="default">
            <AButton size="small" ghost type="primary" @click="addRole()">
              <div class="flex-y-center gap-8px">
                <icon-ic-round-plus class="text-icon" />
                <span>{{ $t('common.add') }}</span>
              </div>
            </AButton>
          </slot>
          <slot name="suffix"></slot>
        </div>
      </template>
      <a-table
        :columns="columns"
        :data-source="dataList"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      ></a-table>
    </ACard>

    <ADrawer v-model:open="visible" :title="title" :width="360">
      <AForm ref="adrawerform" :model="roleModel">
        <AFormItem :label="$t('page.manage.role.roleName')" name="roleName">
          <AInput v-model:value="roleModel.roleName" />
        </AFormItem>
        <AFormItem :label="$t('page.manage.role.roleStatus')" name="status">
          <a-radio-group v-model:value="roleModel.status">
            <a-radio value="0">{{ $t('page.manage.common.status.enable') }}</a-radio>
            <a-radio value="1">{{ $t('page.manage.common.status.disable') }}</a-radio>
          </a-radio-group>
        </AFormItem>
        <AFormItem :label="$t('page.manage.role.roleDesc')" name="roleDesc">
          <AInput v-model:value="roleModel.roleDesc" />
        </AFormItem>
        <AFormItem :label="$t('page.manage.role.roleDesc')" name="roleDesc">
          <br />
          <a-tree
            v-model:expandedKeys="expandedKeys"
            v-model:selectedKeys="selectedKeys"
            v-model:checkedKeys="checkedKeys"
            checkable
            :tree-data="treeData"
            :field-names="fieldNames"
          />
        </AFormItem>
      </AForm>
      <template #footer>
        <div class="flex-y-center justify-end gap-12px">
          <AButton @click="closeDrawer">{{ $t('common.cancel') }}</AButton>
          <AButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</AButton>
        </div>
      </template>
    </ADrawer>
  </div>
</template>

<style scoped>
.card-gap {
  margin-top: 2%;
}
</style>
