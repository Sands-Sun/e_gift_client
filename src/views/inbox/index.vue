<script setup lang="ts">
import { $t } from '@/locales';
import {
  fetchGetUserInfoById,
  fetchTaskList,
  getGivingGiftsByApplicationId,
  getGivingHospitalityByApplicationId,
  handleTask
} from '@/service/api';
import { useAuthStore } from '@/store/modules/auth';
import { getServiceBaseURL } from '@/utils/service';
import type { SelectProps } from '@ant-design/icons-vue';
import { ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons-vue';
import type { FormInstance, TableColumnsType } from 'ant-design-vue';
import { Modal } from 'ant-design-vue';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { computed, createVNode, onMounted, reactive, ref, toRaw } from 'vue';
let authStore: any;
let userInfo: Api.Auth.UserInfo;
const applyUserInfo = reactive<{ userInfo: Api.Auth.UserInfo | undefined; supervisor: Api.Auth.UserInfo | undefined }>({
  userInfo: undefined,
  supervisor: undefined
});
const expandSearchFields = ref(true);
const expandPolicyDescription = ref(true);
const openApplyDrawerModal = ref<boolean>(false);
const openApproveModal = ref<boolean>(false);
const uploadFileList = ref([] as any);
const searchRangeDate = ref<[Dayjs, Dayjs]>();
const searchFormRef = ref();
const listTableLoading = ref(true);
const showReasonDesc = ref(false);
const showAddPersonModal = ref<boolean>(false);
const listDataSource = ref([] as any);
const applyGiftFormRef = ref<FormInstance>();
const addPersonModalFormRef = ref<FormInstance>();
const approvalModalFormRef = ref<FormInstance>();
const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'N';
const { baseURL } = getServiceBaseURL(import.meta.env, isHttpProxy);
const userState = reactive({ data: [] as any, value: [] as any, ccValue: [] as any, fetching: true });
const giftCompanyPersonState = reactive({ data: [] as any, value: [] as any });
const approvalModelRef = reactive({ comment: undefined, approve: '', processType: '', taskId: '', applicationId: '' });
let currentCompanyState = reactive<{
  companyName: string;
  personList: Api.Gifts.GiftPerson[];
  key: number;
}>({
  companyName: '',
  personList: [],
  key: 0
});
const searchFormModelRef = reactive({
  userId: '',
  userName: '',
  reference: '',
  companyCode: '',
  creator: '',
  cwid: '',
  applyType: '',
  type: '',
  beginDate: '',
  endDate: '',
  currentPage: 1,
  orders: [] as any[]
});
const listPagination = ref({
  current: 1,
  pageSize: 5,
  total: 0
});

const tableColumns: TableColumnsType = [
  {
    title: 'form.applicateInfo.applyFor',
    width: 100,
    dataIndex: 'sfUserAppliedName',
    key: 'SF_USER_APPLIED_NAME',
    fixed: 'left'
  },
  {
    title: 'form.applicateInfo.applyDate',
    sorter: true,
    width: 100,
    dataIndex: 'applicationDate',
    key: 'APPLICATION_DATE',
    fixed: 'left'
  },
  { title: 'form.common.reference', sorter: true, dataIndex: 'reference', key: 'REFERENCE', width: 120 },
  { title: 'form.applicateInfo.applyForCwid', dataIndex: 'sfUserAppliedCwid', key: 'SF_USER_APPLIED_CWID', width: 100 },
  { title: 'form.applicateInfo.department', dataIndex: 'department', key: 'DEPARTMENT', width: 150 },
  { title: 'form.applicateInfo.employeeLe', dataIndex: 'employeeLe', key: 'COMPANY_CODE', width: 150 },
  { title: 'form.searchFrom.applyType', dataIndex: 'requestType', key: 'requestType', width: 150 },
  { title: 'form.searchFrom.applyStatus', sorter: true, dataIndex: 'status', key: 'status', width: 150 },
  {
    title: 'common.action',
    key: 'operation',
    fixed: 'right',
    width: 100
  }
];

const applyModelRef = reactive<{
  taskId: string;
  requestType: string;
  actionType: string;
  applicationId: string;
  reference: string;
  applyName: string;
  applyForId: number;
  copyToUserEmails: string[];
  applyCCName: string[];
  reason: string;
  reasonType: string;
  giftDescType: string;
  giftDesc: string;
  date: Dayjs;
  companyList: Api.Gifts.GiftCompany[];
  giftsActivities: unknown[];
  hospActivities: unknown[];
  isGoSoc: string;
  isBayerCustomer: string;
  unitValue: number | undefined;
  volume: number | undefined;
  hospitalityType: string;
  hospPlace: string;
  expensePerHead: number | undefined;
  headCount: number | undefined;
  totalValue: number;
  estimatedTotalExpense: number | undefined;
  remark: string;
  fileId: unknown;
}>({
  taskId: '',
  requestType: '',
  actionType: '',
  applicationId: '',
  reference: '',
  applyName: undefined as any,
  applyForId: undefined as any,
  copyToUserEmails: [] as any,
  applyCCName: [],
  reason: '',
  reasonType: '',
  giftDescType: '',
  giftDesc: '',
  date: dayjs(),
  companyList: [],
  giftsActivities: [] as any,
  hospActivities: [] as any,
  isGoSoc: '',
  isBayerCustomer: '',
  hospitalityType: '',
  hospPlace: '',
  // givingTitle: '',
  unitValue: undefined as any,
  volume: undefined as any,
  totalValue: undefined as any,
  expensePerHead: undefined as any, // 估计人均费用
  headCount: undefined as any, // 受邀人人数
  estimatedTotalExpense: undefined as any, // 估计的总费用
  remark: '',
  fileId: undefined
});

const ccApplyOptions = computed<SelectProps['options']>(() =>
  userState.data.map((user: any) => ({
    label: `${user.firstName} ${user.lastName} <${user.email}>`,
    value: user.email
  }))
);

const applyOptions = computed<SelectProps['options']>(() =>
  userState.data.map((user: any) => ({
    label: `${user.firstName} ${user.lastName} <${user.email}>`,
    value: user.email
  }))
);

// 搜索按钮
const getListDataByCondition = async (currentPage = 1) => {
  listTableLoading.value = true;
  // get search date
  if (typeof searchRangeDate.value !== 'undefined') {
    searchFormModelRef.beginDate = searchRangeDate.value[0].format('YYYY-MM-DD');
    searchFormModelRef.endDate = searchRangeDate.value[1].format('YYYY-MM-DD');
  }
  searchFormModelRef.currentPage = currentPage;
  const { data: queryResult, error } = await fetchTaskList(searchFormModelRef);
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

const showApplyGivingHosp = (data: any) => {
  applyModelRef.expensePerHead = data.hospRef.expensePerHead;
  applyModelRef.headCount = data.hospRef.headCount;
  applyModelRef.hospitalityType = data.hospRef.hospitalityType;
  applyModelRef.hospPlace = data.hospRef.hospPlace;
  applyModelRef.date = dayjs(data.hospRef.hospitalityDate);
  data.companyList.forEach(c => {
    const company = {
      id: c.id,
      companyName: c.companyName,
      description: c.description,
      key: Date.now(),
      personList: [] as any
    };
    c.personList.forEach(p => {
      const person = {
        id: p.id,
        personName: p.personName,
        positionTitle: p.positionTitle,
        isGoSoc: p.isGoSoc,
        isBayerCustomer: p.isBayerCustomer,
        companyId: p.companyId,
        description: p.description,
        key: Date.now()
      };
      company.personList.push(person);
    });
    applyModelRef.companyList.push(company);
  });
  applyModelRef.reason = data.reason;
  applyModelRef.remark = data.remark;
  console.log('success:', data);
  applyModelRef.hospActivities = data.hospActivities;
};

const showApplyGivingGift = (data: any) => {
  applyModelRef.unitValue = data.giftsRef.unitValue;
  applyModelRef.volume = data.giftsRef.volume;
  applyModelRef.date = dayjs(data.giftsRef.givenDate);
  applyModelRef.totalValue = data.totalValue;
  data.companyList.forEach(c => {
    const company = {
      id: c.id,
      companyName: c.companyName,
      description: c.description,
      key: Date.now(),
      personList: [] as any
    };
    c.personList.forEach(p => {
      const person = {
        id: p.id,
        personName: p.personName,
        positionTitle: p.positionTitle,
        companyId: p.companyId,
        unitValue: p.unitValue,
        volume: p.volume,
        description: p.description,
        key: Date.now()
      };
      company.personList.push(person);
    });
    applyModelRef.companyList.push(company);
  });

  applyModelRef.isBayerCustomer = data?.giftsRef?.isBayerCustomer;
  applyModelRef.reasonType = data?.reasonType;
  applyModelRef.reason = data?.reason;
  applyModelRef.giftDescType = data?.giftsRef?.giftDescType;
  applyModelRef.isGoSoc = data?.giftsRef?.isGoSoc;
  // applyModelRef.isHandedOver = data.isHandedOver;
  applyModelRef.remark = data.remark;

  console.log('success:', data);
  applyModelRef.giftsActivities = data.giftsActivities;
};

const fillInApplyUserInfo = async (userId: string) => {
  console.info('fill in apply user info:', userId);
  const { error, data } = await fetchGetUserInfoById(userId);
  if (!error) {
    applyUserInfo.userInfo = data;
    applyUserInfo.supervisor = data.supervisor;
    console.log(`companycode:${userInfo.companyCode}`);
  }
};

// 清空记录
const clearApplyModel = () => {
  applyModelRef.actionType = '';
  applyModelRef.applicationId = '';
  applyModelRef.reference = '';
  applyModelRef.applyName = '';
  applyModelRef.applyForId = -1;
  applyModelRef.copyToUserEmails = [];
  applyModelRef.applyCCName = [];
  applyModelRef.reason = 'NA';
  applyModelRef.reasonType = '';
  applyModelRef.giftDescType = '';
  applyModelRef.date = dayjs();
  applyModelRef.companyList = [];
  applyModelRef.giftsActivities = [];
  applyModelRef.unitValue = undefined;
  applyModelRef.volume = undefined;
  applyModelRef.expensePerHead = undefined;
  applyModelRef.headCount = undefined;
  applyModelRef.estimatedTotalExpense = 0;
  applyModelRef.remark = '';
};

const resetFromFields = () => {
  applyGiftFormRef?.value?.resetFields();
  addPersonModalFormRef?.value?.resetFields();
  clearApplyModel();
};

const showApplyDrawerModal = async (item?: any) => {
  resetFromFields();
  // debugger;
  giftCompanyPersonState.data = [];
  userState.data = [];
  if (item.applicationId) {
    item.loading = true;
    applyModelRef.requestType = item.requestType;
    applyModelRef.taskId = item.taskId;
    ccApplyOptions.value.length = 0;
    const { error, data } =
      item.requestType === 'Giving Gifts'
        ? await getGivingGiftsByApplicationId(item.applicationId)
        : await getGivingHospitalityByApplicationId(item.applicationId);

    if (!error) {
      fillInApplyUserInfo(data.sfUserIdAppliedFor).then(() => {
        applyModelRef.applicationId = data.applicationId;
        applyModelRef.actionType = data.status;
        applyModelRef.reference = data.reference;
        applyOptions.value.unshift({
          label: `${data?.sfUserAppliedName} <${data?.sfUserAppliedEmail}>`,
          value: data?.sfUserAppliedEmail,
          userId: data?.sfUserIdAppliedFor
        });
        applyModelRef.applyName = applyOptions.value[0];
        if (data?.copyToUsers) {
          data.copyToUsers.forEach((user: any) => {
            // 排除申请人信息
            if (user.copytoEmail !== userInfo.email) {
              ccApplyOptions.value.push({
                label: `${user.copytoFirstName} ${user.copytoLastName} <${user.copytoEmail}>`,
                value: user.copytoEmail,
                userId: user.sfUserIdCopyTo
              });
            }
          });
        }
        if (data.fileAttach) {
          const attach = data.fileAttach;
          uploadFileList.value.push({
            uid: attach.id,
            name: attach.origFileName,
            size: Number.parseInt(attach.fileSize, 2),
            url: `${baseURL}/sys/download/file?fileId=${attach.id}`
          });
        }
        applyModelRef.applyCCName = ccApplyOptions.value.map((v: any) => v.value);
        if (item.requestType === 'Giving Gifts') {
          showApplyGivingGift(data);
        }
        if (item.requestType === 'Giving Hospitality') {
          showApplyGivingHosp(data);
        }
        item.loading = false;
        openApplyDrawerModal.value = true;
      });
    }
  }
};

const closeApplyDrawerModal = () => {
  openApplyDrawerModal.value = false;
  uploadFileList.value.length = 0;
  ccApplyOptions.value.length = 0;
  giftCompanyPersonState.data = [];
  userState.data = [];
};

const openAddPersonModal = (item: Api.Gifts.GiftCompany) => {
  // debugger;
  currentCompanyState = item;
  showAddPersonModal.value = true;
};

const onSubmitAddPerson = () => {
  addPersonModalFormRef?.value?.validateFields().then(() => {
    showAddPersonModal.value = false;
  });
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

const showApprovalModal = () => {
  openApproveModal.value = true;
};

const closeApprovalModal = () => {
  openApproveModal.value = false;
};

const onSubmitApproval = (taskId: string, type: string) => {
  console.info('taskId: ', taskId);
  console.info('type: ', type);
  approvalModalFormRef?.value
    ?.validate()
    .then(() => {
      Modal.confirm({
        title: $t('common.tip'),
        icon: createVNode(ExclamationCircleOutlined),
        content: $t('common.confirmApprove'),
        okText: $t('common.confirm'),
        cancelText: $t('common.cancel'),
        async onOk() {
          const requestParam = toRaw(approvalModelRef);
          requestParam.applicationId = applyModelRef.applicationId;
          requestParam.approve = type;
          requestParam.taskId = taskId;
          requestParam.processType = applyModelRef.requestType;
          console.log(requestParam);
          const { error } = await handleTask(requestParam);
          if (!error) {
            console.log('success!');
            approvalModalFormRef.value?.resetFields();
            closeApprovalModal();
            closeApplyDrawerModal();
            getListDataByCondition();
          }
        },
        onCancel() {
          console.log('cancel');
        }
      });
    })
    .catch(error => {
      console.log('error', error);
    });
};

// 重置search表单
const resetSearchForm = () => {
  searchRangeDate.value = undefined;
  searchFormModelRef.beginDate = '';
  searchFormModelRef.endDate = '';
  searchFormRef?.value?.resetFields();
};

const onFinishSearch = (values: any) => {
  console.log('Received values of form: ', values);
  console.log('formState: ', searchFormModelRef);
};

const showDrawerModalTitle = () => {
  let title;
  if (applyModelRef.requestType === 'Giving Gifts') {
    title = $t('page.givingGifts.applyForm.givingGiftRequestTitle');
  } else if (applyModelRef.requestType === 'Giving Hospitality') {
    title = $t('page.givingHospitality.applyForm.givingHospitalityRequestTitle');
  }
  return title;
};

onMounted(async () => {
  authStore = useAuthStore();
  userInfo = authStore.userInfo;
  console.log(`companycode:${userInfo.companyCode}`);
  const listData = await fetchTaskList({ userId: authStore.userInfo.sfUserId });
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
      <template #extra>
        <a-button type="link" @click="expandSearchFields = !expandSearchFields">
          <template v-if="expandSearchFields">{{ $t('common.shrink') }}</template>
          <template v-else>{{ $t('common.expand') }}</template>
        </a-button>
      </template>
      <a-form
        ref="searchFormRef"
        :model="searchFormModelRef"
        name="advanced_search"
        class="ant-advanced-search-form"
        @finish="onFinishSearch"
      >
        <div v-show="expandSearchFields">
          <a-row :gutter="8">
            <a-col span="6">
              <a-form-item :label="$t('form.common.reference')" name="reference">
                <a-input
                  v-model:value="searchFormModelRef.reference"
                  :placeholder="$t('form.common.reference_placeHolder')"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col span="4">
              <a-form-item :label="$t('form.applicateInfo.employeeLe')" name="companyCode">
                <a-input
                  v-model:value="searchFormModelRef.companyCode"
                  :placeholder="$t('form.applicateInfo.employeeLe_placeHolder')"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col span="5">
              <a-form-item :label="$t('form.applicateInfo.formFiller')" name="creator">
                <a-input
                  v-model:value="searchFormModelRef.creator"
                  :placeholder="$t('form.applicateInfo.formFiller_placeHolder')"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col span="5">
              <a-form-item :label="$t('form.applicateInfo.applyFor')" name="userName">
                <a-input
                  v-model:value="searchFormModelRef.userName"
                  :placeholder="$t('form.applicateInfo.applyFor_placeHolder')"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col span="4">
              <a-form-item label="CWID" name="cwid">
                <a-input v-model:value="searchFormModelRef.cwid"></a-input>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="35">
            <a-col span="6">
              <a-form-item :label="$t('form.searchFrom.applyType')" name="applyType">
                <a-select v-model:value="searchFormModelRef.applyType">
                  <a-select-option value="Giving Gifts">{{ $t('form.searchFrom.givingGifts') }}</a-select-option>
                  <a-select-option value="Giving Hospitality">
                    {{ $t('form.searchFrom.givingHospitality') }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col span="10">
              <a-form-item :label="$t('page.receivingGifts.applyForm.giftReceivingDate')" name="searchRangeDate">
                <a-range-picker v-model:value="searchRangeDate" />
              </a-form-item>
            </a-col>
            <a-col span="8" style="text-align: right">
              <a-space :size="5">
                <a-button type="primary" html-type="submit" @click="getListDataByCondition()">
                  {{ $t('common.search') }}
                </a-button>
                <a-button style="margin: 1px" @click="resetSearchForm()">{{ $t('common.reset') }}</a-button>
              </a-space>
            </a-col>
          </a-row>
        </div>
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
            <a-button type="link" :loading="record.loading" @click="showApplyDrawerModal(record)">
              {{ $t('common.viewDetail') }}
            </a-button>
          </template>
          <template v-else-if="column.key === 'givingDate'">
            {{ record.givingDate }}
          </template>
          <template v-else-if="column.key === 'status'">
            <span>
              <template v-if="record.status === 'Draft'">
                <a-tag color="green">{{ record.status.toUpperCase() }}</a-tag>
              </template>
              <template v-else-if="record.status === 'Documented'">
                <a-tag color="geekblue">{{ record.status.toUpperCase() }}</a-tag>
              </template>
              <template v-else>
                <a-tag color="volcano">{{ record.status.toUpperCase() }}</a-tag>
              </template>
            </span>
          </template>
        </template>
      </a-table>
    </a-card>

    <a-drawer
      :title="showDrawerModalTitle()"
      width="75%"
      size="large"
      :open="openApplyDrawerModal"
      @close="closeApplyDrawerModal"
    >
      <a-descriptions :title="$t('form.applicateInfo.applicateInfoTitle')">
        <a-descriptions-item :label="$t('form.applicateInfo.formFiller')">
          {{ applyUserInfo?.userInfo?.firstName }} {{ applyUserInfo?.userInfo?.lastName }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('form.applicateInfo.employeeNo')">
          {{ applyUserInfo?.userInfo?.employeeId }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('form.applicateInfo.department')">
          {{ applyUserInfo?.userInfo?.orgTxt }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('form.applicateInfo.supervisor')">
          {{ applyUserInfo?.supervisor?.firstName }} {{ applyUserInfo?.supervisor?.lastName }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('form.applicateInfo.costCenter')">
          {{ applyUserInfo?.userInfo?.costCenter }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('form.applicateInfo.division')">
          {{ applyUserInfo?.userInfo?.division }}
        </a-descriptions-item>

        <template v-if="applyModelRef.reference !== ''">
          <a-descriptions-item :label="$t('form.common.reference')">
            <strong>{{ applyModelRef.reference }}</strong>
          </a-descriptions-item>
        </template>

        <template v-if="applyModelRef.actionType !== ''">
          <a-descriptions-item :label="$t('common.status')">
            <span>
              <template v-if="applyModelRef.actionType === 'Draft'">
                <a-tag color="green">{{ applyModelRef.actionType.toUpperCase() }}</a-tag>
              </template>
              <template v-else-if="applyModelRef.actionType === 'Approved'">
                <a-tag color="cyan">{{ applyModelRef.actionType.toUpperCase() }}</a-tag>
              </template>
              <template v-else-if="applyModelRef.actionType === 'Documented'">
                <a-tag color="geekblue">{{ applyModelRef.actionType.toUpperCase() }}</a-tag>
              </template>
              <template v-else-if="applyModelRef.actionType === 'Rejected'">
                <a-tag color="red">{{ applyModelRef.actionType.toUpperCase() }}</a-tag>
              </template>
              <template v-else-if="applyModelRef.actionType === 'Cancelled'">
                <a-tag color="orange">{{ applyModelRef.actionType.toUpperCase() }}</a-tag>
              </template>
              <template v-else>
                <a-tag color="volcano">{{ applyModelRef.actionType.toUpperCase() }}</a-tag>
              </template>
            </span>
          </a-descriptions-item>
        </template>
      </a-descriptions>

      <a-form ref="applyGiftFormRef" :model="applyModelRef" :disabled="true">
        <!--员工基础信息-->
        <a-row :gutter="24">
          <a-col span="10">
            <a-form-item :label="$t('form.applicateInfo.applyFor')" name="applyName">
              <a-select
                v-model:value="applyModelRef.applyName"
                :placeholder="$t('form.common.select_validation')"
                show-search
                label-in-value
                :not-found-content="userState.fetching ? null : undefined"
                :options="applyOptions"
              ></a-select>
            </a-form-item>
          </a-col>
          <a-col span="14">
            <a-form-item name="applyCCName" :label="$t('form.applicateInfo.applyCC')">
              <a-select
                v-model:value="applyModelRef.applyCCName"
                mode="multiple"
                :default-active-first-option="false"
                :not-found-content="userState.fetching ? null : undefined"
                :filter-option="false"
                :placeholder="$t('form.common.select_validation')"
                :options="ccApplyOptions"
              ></a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row justify="end">
          <a-col>
            <a-button type="link" :disabled="false" @click="expandPolicyDescription = !expandPolicyDescription">
              <template v-if="expandPolicyDescription">{{ $t('common.shrink') }}</template>
              <template v-else>{{ $t('common.expand') }}</template>
            </a-button>
          </a-col>
        </a-row>
        <template v-if="applyModelRef.requestType === 'Giving Gifts'">
          <!--giving gifts template-->
          <div v-show="expandPolicyDescription">
            <a-descriptions :title="$t('page.givingGifts.policy.title')" layout="vertical">
              <a-descriptions-item
                v-for="(item, index) in $tm(`page.givingGifts.policy.desc_${applyUserInfo?.userInfo?.companyCode}`)"
                :key="index"
                :span="3"
                :label="item.label"
              >
                <ul>
                  <li v-for="(detail, index) in item.items" :key="detail">
                    &nbsp; &nbsp; {{ index + 1 }} ) {{ detail.value }}
                    <template v-if="detail.items.length > 0">
                      <li v-for="(subDetail, subIndex) in detail.items" :key="subDetail">
                        &nbsp; &nbsp; {{ subIndex + 1 }} ) {{ subDetail.value }}
                      </li>
                    </template>
                  </li>
                </ul>
              </a-descriptions-item>
            </a-descriptions>
          </div>

          <a-descriptions :title="$t('page.givingGifts.applyForm.givingGiftInfo')" />
          <template
            v-if="
              applyUserInfo?.userInfo?.companyCode === '0813' ||
              applyUserInfo?.userInfo?.companyCode === '1391' ||
              applyUserInfo?.userInfo?.companyCode === '2614'
            "
          >
            <!--0813 AND 2614 AND 1391 显示下拉列表-->
            <a-row :gutter="24">
              <a-col span="12">
                <a-form-item
                  :label="$t('page.givingGifts.applyForm.giftReason_type_label')"
                  name="reasonType"
                  :rules="[
                    {
                      required: true,
                      message: $t('page.givingGifts.applyForm.giftReason_type_label_validation')
                    }
                  ]"
                >
                  <a-select v-model:value="applyModelRef.reasonType" :dropdown-match-select-width="false">
                    <a-select-option value="Chinese New Year">
                      {{ $t('form.common.option_giftReason_NewYear') }}
                    </a-select-option>
                    <a-select-option value="Mid-Autumn Festival">
                      {{ $t('form.common.option_giftReason_Mid_Autumn') }}
                    </a-select-option>
                    <a-select-option value="Other">{{ $t('form.common.option_giftReason_Other') }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <!--0813 下拉列表-->
              <template v-if="applyUserInfo?.userInfo?.companyCode === '0813'">
                <a-col span="12">
                  <a-form-item
                    :label="$t('page.givingGifts.applyForm.giftDesc_type_label')"
                    name="giftDescType"
                    :rules="[
                      {
                        required: true,
                        message: $t('page.givingGifts.applyForm.giftDesc_type_label_validation')
                      }
                    ]"
                  >
                    <a-select v-model:value="applyModelRef.giftDescType">
                      <a-select-option value="Company Branded Gift">
                        {{ $t('form.common.option_giftDesc_Company_Branded_Gift') }}
                      </a-select-option>
                      <a-select-option value="General Gift">
                        {{ $t('form.common.option_giftDesc_General_Gift') }}
                      </a-select-option>
                      <a-select-option value="Medicine Gift">
                        {{ $t('form.common.option_giftDesc_Medicine') }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </template>
              <template
                v-else-if="
                  applyUserInfo?.userInfo?.companyCode === '1391' || applyUserInfo?.userInfo?.companyCode === '2614'
                "
              >
                <a-col span="12">
                  <a-form-item
                    :label="$t('page.givingGifts.applyForm.giftDesc_type_label')"
                    name="giftDescType"
                    :rules="[
                      {
                        required: true,
                        message: $t('page.givingGifts.applyForm.giftDesc_type_label_validation')
                      }
                    ]"
                  >
                    <a-select v-model:value="applyModelRef.giftDescType">
                      <a-select-option
                        value="Promotional Supplies Gifts"
                        :title="$t('form.common.option_giftDesc_Promotional_Supplies')"
                      >
                        {{ $t('form.common.option_giftDesc_Promotional_Supplies') }}
                      </a-select-option>
                      <a-select-option value="Cultural Courtesy Gifts">
                        {{ $t('form.common.option_giftDesc_Cultural_Courtesy') }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </template>
            </a-row>

            <a-row v-show="showReasonDesc" :gutter="24">
              <a-col span="24">
                <a-form-item
                  :label="$t('page.givingGifts.applyForm.giftReason_label')"
                  name="reason"
                  :rules="[
                    {
                      required: true,
                      message: $t('page.givingGifts.applyForm.giftReason_label_validation')
                    }
                  ]"
                >
                  <a-input
                    v-model:value="applyModelRef.reason"
                    :placeholder="$t('page.givingGifts.applyForm.giftReason_label_validation')"
                  ></a-input>
                </a-form-item>
              </a-col>
            </a-row>
          </template>
          <template v-else>
            <a-row :gutter="24">
              <!--0882 区分 CH 和 PH-->
              <template v-if="userInfo.division === 'CH'">
                <a-col span="12">
                  <a-form-item name="giftDescType" :label="$t('page.givingGifts.applyForm.giftDesc_label')">
                    <a-select v-model:value="applyModelRef.giftDescType">
                      <a-select-option
                        value="Promotional Supplies Gifts"
                        :title="$t('form.common.option_giftDesc_Promotional_Supplies')"
                      >
                        {{ $t('form.common.option_giftDesc_Promotional_Supplies') }}
                      </a-select-option>
                      <a-select-option value="Cultural Courtesy Gifts">
                        {{ $t('form.common.option_giftDesc_Cultural_Courtesy') }}
                      </a-select-option>
                      <a-select-option value="Other">
                        {{ $t('form.common.option_giftDesc_Other') }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </template>
              <template v-else>
                <a-col span="10">
                  <a-form-item :label="$t('page.givingGifts.applyForm.giftDesc_type_label')" name="reason">
                    <a-input
                      v-model:value="applyModelRef.reason"
                      :placeholder="$t('page.givingGifts.applyForm.giftDesc_type_label_validation')"
                    ></a-input>
                  </a-form-item>
                </a-col>
              </template>
            </a-row>
          </template>

          <a-row :gutter="24">
            <a-col span="14">
              <a-form-item :label="$t('page.givingGifts.applyForm.giftRecipientCategory')" name="isGoSoc">
                <a-select v-model:value="applyModelRef.isGoSoc">
                  <a-select-option value="Yes">
                    {{ $t('form.common.option_go_sco_Government_Official') }}
                  </a-select-option>
                  <a-select-option value="No">
                    {{ $t('form.common.option_go_sco_Government_Non_Official') }}
                  </a-select-option>
                  <a-select-option value="HCP">
                    {{ $t('form.common.option_go_sco_HCP') }}
                  </a-select-option>
                  <!--
 <a-select-option value="Distributor">
                  {{ $t('form.common.option_go_sco_Distributor') }}
                </a-select-option>
-->
                  <a-select-option value="Others">{{ $t('form.common.option_Other') }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col span="10">
              <a-form-item name="isBayerCustomer" :label="$t('page.givingGifts.applyForm.giftIsBayerCustomer')">
                <a-select v-model:value="applyModelRef.isBayerCustomer">
                  <a-select-option value="Yes">{{ $t('form.common.option_yes') }}</a-select-option>
                  <a-select-option value="No">{{ $t('form.common.option_no') }}</a-select-option>
                  <a-select-option value="Not Applicable">
                    {{ $t('form.common.option_not_Applicable') }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="24">
            <a-col span="7">
              <a-form-item name="date" :label="$t('page.givingGifts.applyForm.giftGivingDate')">
                <a-date-picker v-model:value="applyModelRef.date" value-format="YYYY-MM-DD" />
              </a-form-item>
            </a-col>
            <a-col span="5">
              <a-form-item name="unitValue" :label="$t('form.common.unitPrice')">
                <a-input-number
                  v-model:value="applyModelRef.unitValue"
                  :placeholder="$t('form.common.unitPrice_validation')"
                  :step="0.01"
                ></a-input-number>
              </a-form-item>
            </a-col>
            <a-col span="5">
              <a-form-item name="volume" :label="$t('form.common.quantity')">
                <a-input-number
                  v-model:value="applyModelRef.volume"
                  :placeholder="$t('form.common.quantity_validation')"
                  :min="1"
                ></a-input-number>
              </a-form-item>
            </a-col>
            <a-col span="5">
              <a-form-item :label="$t('form.common.totalPrice')">
                <a-input-number
                  :value="applyModelRef.totalValue"
                  addon-before="￥"
                  style="width: 195px"
                  :step="0.01"
                ></a-input-number>
              </a-form-item>
            </a-col>
          </a-row>

          <div v-for="(company, index) in applyModelRef.companyList" :key="company.key">
            <a-row :gutter="24">
              <a-col span="18">
                <a-form-item
                  :label="$t('page.givingGifts.applyForm.giftGivingCompanyName')"
                  :name="['companyList', index, 'companyName']"
                >
                  <a-input v-model:value="company.companyName"></a-input>
                </a-form-item>
              </a-col>
              <a-col span="5">
                <a-button
                  html-type="button"
                  type="dashed"
                  :disabled="false"
                  style="margin: 0 8px"
                  @click="openAddPersonModal(company)"
                >
                  {{ $t('form.common.viewPerson') }}
                </a-button>
              </a-col>
            </a-row>
          </div>

          <a-row :gutter="24">
            <a-col span="12">
              <a-form-item :label="$t('form.common.upload_person_label')">
                <a-upload
                  v-model:file-list="uploadFileList"
                  :action="`${baseURL}/sys/upload/file?module=giving&type=CompanyPerson`"
                  :max-count="1"
                >
                  <a-button>
                    <UploadOutlined></UploadOutlined>
                    {{ $t('form.common.upload_file') }}
                  </a-button>
                </a-upload>
              </a-form-item>
            </a-col>
            <a-col span="4">
              <a-button
                type="link"
                :href="`${baseURL}/sys/download/template?module=CompanyPerson&fileName=eGiftCompanyPersonTemplate.xlsx`"
              >
                {{ $t('form.common.upload_template') }}
              </a-button>
            </a-col>
          </a-row>

          <a-row :gutter="24">
            <a-col span="24">
              <a-form-item :label="$t('page.givingGifts.applyForm.remark')" name="remark">
                <a-textarea
                  v-model:value="applyModelRef.remark"
                  :rows="4"
                  :placeholder="$t('page.givingGifts.applyForm.remark_validation')"
                  allow-clear
                />
              </a-form-item>
            </a-col>
          </a-row>
        </template>
        <template v-else-if="applyModelRef.requestType === 'Giving Hospitality'">
          <!-- giving hospitality template-->
          <div v-show="expandPolicyDescription">
            <a-descriptions :title="$t('page.givingHospitality.policy.title')" layout="vertical">
              <a-descriptions-item
                v-for="(item, index) in $tm(`page.givingHospitality.policy.desc_${userInfo.companyCode}`)"
                :key="index"
                :span="3"
                :label="item.label"
              >
                <ul style="list-style-position: outside">
                  <li v-for="(detail, index) in item.items" :key="detail" style="text-indent: -1em">
                    &emsp;{{ index + 1 }}. {{ detail.value }}
                    <template v-if="detail.items.length > 0">
                      <li v-for="(subDetail, subIndex) in detail.items" :key="subDetail" style="text-indent: -1em">
                        &emsp;&emsp;{{ subIndex + 1 }} ) {{ subDetail.value }}
                        <template v-if="subDetail && subDetail.items && subDetail.items.length > 0">
                          <li v-for="subsDetail in subDetail.items" :key="subsDetail" style="text-indent: -1em">
                            &emsp;&emsp;&emsp; • {{ subsDetail.value }}
                          </li>
                        </template>
                      </li>
                    </template>
                  </li>
                </ul>
              </a-descriptions-item>
            </a-descriptions>
          </div>
          <a-descriptions :title="$t('page.givingHospitality.applyForm.givingHospitalityInfo')" />
          <a-row :gutter="24">
            <a-col span="24">
              <a-form-item :label="$t('page.givingHospitality.applyForm.giftReason_label')" name="reason">
                <a-input v-model:value="applyModelRef.reason"></a-input>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col span="16">
              <a-form-item :label="$t('page.givingHospitality.applyForm.giftHospitalityType')" name="hospitalityType">
                <a-input v-model:value="applyModelRef.hospitalityType"></a-input>
              </a-form-item>
            </a-col>
            <a-col span="8">
              <a-form-item :label="$t('page.givingHospitality.applyForm.giftHospPlace')" name="hospPlace">
                <a-input v-model:value="applyModelRef.hospPlace"></a-input>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row>
            <a-col :flex="1">
              <a-form-item name="date" :label="$t('page.givingHospitality.applyForm.giftGivingDate')">
                <a-date-picker v-model:value="applyModelRef.date" value-format="YYYY-MM-DD" />
              </a-form-item>
            </a-col>
            <a-col :flex="1">
              <a-form-item name="expensePerHead" :label="$t('page.givingHospitality.applyForm.giftExpensePerHead')">
                <a-input-number v-model:value="applyModelRef.expensePerHead" :step="0.01"></a-input-number>
              </a-form-item>
            </a-col>
            <a-col :flex="2">
              <a-form-item
                style="white-space: normal"
                name="headCount"
                :label="$t('page.givingHospitality.applyForm.giftHeadCount')"
              >
                <a-input-number v-model:value="applyModelRef.headCount" :min="1"></a-input-number>
              </a-form-item>
            </a-col>
            <a-col :flex="1">
              <a-form-item :label="$t('form.common.totalPrice')" name="estimatedTotalExpense">
                <a-input-number
                  :value="applyModelRef.estimatedTotalExpense"
                  addon-before="￥"
                  style="width: 195px"
                  :step="0.01"
                ></a-input-number>
              </a-form-item>
            </a-col>
          </a-row>
          <div v-for="(company, index) in applyModelRef.companyList" :key="company.key">
            <a-row :gutter="24">
              <a-col span="20">
                <a-form-item
                  :label="$t('page.givingGifts.applyForm.giftGivingCompanyName')"
                  :name="['companyList', index, 'companyName']"
                >
                  <a-input v-model:value="company.companyName"></a-input>
                </a-form-item>
              </a-col>
              <a-col span="4">
                <a-button
                  html-type="button"
                  type="dashed"
                  :disabled="false"
                  style="margin: 0 8px"
                  @click="openAddPersonModal(company)"
                >
                  {{ $t('form.common.viewPerson') }}
                </a-button>
              </a-col>
            </a-row>
          </div>
        </template>
      </a-form>

      <!--显示历史操作记录-->
      <template v-if="applyModelRef.requestType === 'Giving Gifts'">
        <a-descriptions :title="$t('form.common.historyLog')">
          <a-descriptions-item :label="$t('form.common.operationInfo')" span="4">
            <ul>
              <li v-for="(item, index) in applyModelRef.giftsActivities" :key="item.appActivityDataId">
                &nbsp; {{ index + 1 }}. {{ item.userFirstName }} {{ item.userLastName }} &nbsp;
                <strong>{{ item.action }}</strong>
                &nbsp; at &nbsp;
                {{ item.createdDate }}
              </li>
            </ul>
          </a-descriptions-item>

          <a-descriptions-item :label="$t('form.common.remarkInfo')" span="4">
            <ul>
              <li v-for="(item, index) in applyModelRef.giftsActivities" :key="item.appActivityDataId">
                &nbsp; {{ index + 1 }}. {{ item.userFirstName }} {{ item.userLastName }} &nbsp;
                <strong>wrote at {{ item.createdDate }}</strong>
                &nbsp;
                {{ item.remark }}
              </li>
            </ul>
          </a-descriptions-item>
        </a-descriptions>
      </template>
      <template v-else-if="applyModelRef.requestType === 'Giving Hospitality'">
        <a-descriptions :title="$t('form.common.historyLog')">
          <a-descriptions-item :label="$t('form.common.operationInfo')" span="4">
            <ul>
              <li v-for="(item, index) in applyModelRef.hospActivities" :key="item.appActivityDataId">
                &nbsp; {{ index + 1 }}. {{ item.userFirstName }} {{ item.userLastName }} &nbsp;
                <strong>{{ item.action }}</strong>
                &nbsp; at &nbsp;
                {{ item.createdDate }}
              </li>
            </ul>
          </a-descriptions-item>

          <a-descriptions-item :label="$t('form.common.remarkInfo')" span="4">
            <ul>
              <li v-for="(item, index) in applyModelRef.hospActivities" :key="item.appActivityDataId">
                &nbsp; {{ index + 1 }}. {{ item.userFirstName }} {{ item.userLastName }} &nbsp;
                <strong>wrote at {{ item.createdDate }}</strong>
                &nbsp;
                {{ item.remark }}
              </li>
            </ul>
          </a-descriptions-item>
        </a-descriptions>
      </template>

      <a-row :gutter="24">
        <a-col :span="24" style="text-align: right">
          <a-button style="margin: 1px" html-type="submit" @click="showApprovalModal">
            {{ $t('common.approve') }}
          </a-button>
        </a-col>
      </a-row>
    </a-drawer>

    <!--审批 modal-->
    <a-modal
      v-model:open="openApproveModal"
      width="500px"
      centered
      :title="$t('form.common.approveComment')"
      :ok-text="$t('common.agreeApprove')"
      :cancel-text="$t('common.rejectApprove')"
    >
      <template #footer>
        <a-button key="approve" type="primary" @click="onSubmitApproval(applyModelRef.taskId, 'Approved')">
          {{ $t('common.agreeApprove') }}
        </a-button>
        <a-button key="reject" @click="onSubmitApproval(applyModelRef.taskId, 'Rejected')">
          {{ $t('common.rejectApprove') }}
        </a-button>
      </template>
      <!--审批-->
      <a-form ref="approvalModalFormRef" :model="approvalModelRef">
        <a-row :gutter="24">
          <a-col span="24">
            <a-form-item
              name="comment"
              :rules="[
                {
                  required: true,
                  message: $t('form.common.approveComment'),
                  trigger: 'change'
                }
              ]"
            >
              <a-textarea
                v-model:value="approvalModelRef.comment"
                :auto-size="{ minRows: 5, maxRows: 10 }"
              ></a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>

    <!--添加person modal-->
    <a-modal
      v-model:open="showAddPersonModal"
      width="650px"
      :title="$t('form.common.addPerson')"
      @ok="onSubmitAddPerson"
    >
      <a-form ref="addPersonModalFormRef" :model="currentCompanyState" :disabled="true">
        <template v-for="(person, index) in currentCompanyState.personList" :key="person.key">
          <a-divider orientation="left" />
          <template v-if="applyModelRef.requestType === 'Giving Gifts'">
            <a-row :gutter="24">
              <a-col span="12">
                <a-form-item
                  :label-col="{ span: 10 }"
                  :wrapper-col="{ span: 14 }"
                  :label="$t('page.receivingGifts.applyForm.giftGiverEmployeeName')"
                  :name="['personList', index, 'personName']"
                >
                  <a-input v-model:value="person.personName"></a-input>
                </a-form-item>
              </a-col>

              <a-col span="12">
                <a-form-item
                  :label-col="{ span: 12 }"
                  :wrapper-col="{ span: 12 }"
                  :label="$t('page.receivingGifts.applyForm.giftGiverTitle_validation')"
                  :name="['personList', index, 'positionTitle']"
                >
                  <a-input v-model:value="person.positionTitle"></a-input>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col span="10">
                <a-form-item
                  :label-col="{ span: 8 }"
                  :wrapper-col="{ span: 14 }"
                  :label="$t('form.common.unitPrice')"
                  :name="['personList', index, 'unitValue']"
                >
                  <a-input-number
                    v-model:value="person.unitValue"
                    :style="{ width: '130px' }"
                    :min="1"
                    :step="0.01"
                  ></a-input-number>
                </a-form-item>
              </a-col>

              <a-col span="10">
                <a-form-item
                  :label-col="{ span: 11 }"
                  :wrapper-col="{ span: 14 }"
                  :label="$t('form.common.quantity')"
                  :name="['personList', index, 'volume']"
                >
                  <a-input-number v-model:value="person.volume" :style="{ width: '130px' }" :min="1"></a-input-number>
                </a-form-item>
              </a-col>
            </a-row>
          </template>
          <template v-else-if="applyModelRef.requestType === 'Giving Hospitality'">
            <template
              v-if="
                userInfo.companyCode === '0813' || userInfo.companyCode === '2614' || userInfo.companyCode === '1391'
              "
            >
              <a-row :gutter="24">
                <a-col :span="10">
                  <a-form-item
                    :label="$t('page.givingHospitality.applyForm.gitfHospEmployeeIsGoSoc')"
                    :name="['personList', index, 'isGoSoc']"
                    :rules="{
                      required: true,
                      message: $t('form.common.select_validation'),
                      trigger: 'change'
                    }"
                  >
                    <a-select v-model:value="person.isGoSoc">
                      <a-select-option value="Yes">
                        {{ $t('form.common.option_go_sco_Government_Official') }}
                      </a-select-option>
                      <a-select-option value="No">
                        {{ $t('form.common.option_go_sco_Government_Non_Official') }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <template v-if="userInfo.companyCode === '2614' || userInfo.companyCode === '1391'">
                  <a-col :span="10">
                    <a-form-item
                      :label="$t('page.givingHospitality.applyForm.giftHospEmployeeIsBayerCustomer')"
                      :name="['personList', index, 'isBayerCustomer']"
                      :rules="{
                        required: true,
                        message: $t('form.common.select_validation'),
                        trigger: 'change'
                      }"
                    >
                      <a-select v-model:value="person.isBayerCustomer">
                        <a-select-option value="Yes">{{ $t('form.common.option_yes') }}</a-select-option>
                        <a-select-option value="No">{{ $t('form.common.option_no') }}</a-select-option>
                        <a-select-option value="Not Applicable">
                          {{ $t('form.common.option_not_Applicable') }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                </template>
              </a-row>
            </template>
            <template v-else>
              <a-row :gutter="24">
                <a-col :span="10">
                  <a-form-item
                    :label="$t('page.givingHospitality.applyForm.gitfHospEmployeeIsGoSoc')"
                    :name="['personList', index, 'isGoSoc']"
                    :rules="{
                      required: true,
                      message: $t('form.common.select_validation'),
                      trigger: 'change'
                    }"
                  >
                    <a-select v-model:value="person.isGoSoc">
                      <a-select-option value="Yes">
                        {{ $t('form.common.option_go_sco_Government_Official') }}
                      </a-select-option>
                      <a-select-option value="No">
                        {{ $t('form.common.option_go_sco_Government_Non_Official') }}
                      </a-select-option>
                      <a-select-option value="HCP">
                        {{ $t('form.common.option_go_sco_HCP') }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
            </template>

            <a-row :gutter="24">
              <a-col :span="10">
                <a-form-item
                  :label="$t('page.givingHospitality.applyForm.giftHospEmployeeName')"
                  :dropdown-match-select-width="false"
                  :name="['personList', index, 'personName']"
                  :rules="{
                    required: true,
                    message: $t('page.givingHospitality.applyForm.giftHospEmployeeName_validation'),
                    trigger: 'change'
                  }"
                >
                  <a-input v-model:value="person.personName"></a-input>
                </a-form-item>
              </a-col>

              <a-col :span="10">
                <a-form-item
                  :label="$t('page.givingHospitality.applyForm.giftHospTitle')"
                  :name="['personList', index, 'positionTitle']"
                  :rules="{
                    required: true,
                    message: $t('page.givingHospitality.applyForm.giftHospTitle_validation'),
                    trigger: 'change'
                  }"
                >
                  <a-input v-model:value="person.positionTitle"></a-input>
                </a-form-item>
              </a-col>
            </a-row>
          </template>
        </template>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped></style>
