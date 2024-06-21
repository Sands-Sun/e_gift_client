<script setup lang="ts">
import { $t } from '@/locales';
import {
  feachDeptHeadGroupUsers,
  fetchGetUserInfoById,
  fetchGivingHospitalityList,
  getGivingHospitalityHistoryByApplicationId
} from '@/service/api';
import { useAuthStore } from '@/store/modules/auth';
import { getServiceBaseURL } from '@/utils/service';
import type { SelectProps } from '@ant-design/icons-vue';
import type { FormInstance, TableColumnsType } from 'ant-design-vue';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { debounce } from 'lodash-es';
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';
let authStore: any;
let userInfo: Api.Auth.UserInfo;
// let supervisorInfo: Api.Auth.UserInfo;
const applyUserInfo = ref<Api.Auth.UserInfo>();
const applyUserSupervisorInfo = ref<Api.Auth.UserInfo>();
const uploadFileList = ref([] as any);
const openApplyDrawerModal = ref<boolean>(false);
const expandSearchFields = ref(true);
const listTableLoading = ref(true);
const showAddPersonModal = ref<boolean>(false);
const givingHospitalityFromStatus = reactive({ disableStatus: false, descTypeHistory: false, actionStatus: '' });
const listDataSource = ref([] as any);
const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'N';
const { baseURL } = getServiceBaseURL(import.meta.env, isHttpProxy);
const givingHospitalityFormRef = ref<FormInstance>();
const addPersonModalFormRef = ref<FormInstance>();
const searchRangeDate = ref<[Dayjs, Dayjs]>();
const ccApplyOptions = ref<SelectProps['options']>([]);
const applyOptions = ref<SelectProps['options']>([]);
const userState = reactive({ data: [] as any, ccData: [] as any, fetching: true });
const deptHeadGroupUserState = reactive({ data: [] as any, hidden: true });
const searchFormRef = ref<FormInstance>();
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
  newVersion: 'N',
  userId: '',
  userName: '',
  reference: '',
  companyCode: '',
  creator: '',
  cwid: '',
  status: '',
  type: '',
  beginDate: '',
  endDate: '',
  currentPage: 1,
  pageSize: 5,
  orders: [] as any[]
});

const applyModelRef = reactive<{
  actionType: string;
  applicationId: string;
  createDate: string;
  reference: string;
  applyName: string | undefined;
  applyForId: number;
  deptHead: string | undefined;
  copyToUserEmails: string[];
  applyCCName: string[];
  reason: string;
  hospitalityType: string;
  hospPlace: string;
  date: string;
  companyList: Api.Gifts.GiftCompany[];
  hospActivities: unknown[];
  expensePerHead: number | undefined;
  headCount: number | undefined;
  estimatedTotalExpense: number | undefined;
  remark: string;
  fileId: unknown;
}>({
  actionType: '',
  applicationId: '',
  createDate: dayjs().format('YYYY-MM-DD'),
  reference: '',
  applyName: undefined as any,
  applyForId: undefined as any,
  deptHead: undefined as any,
  copyToUserEmails: [] as any,
  applyCCName: undefined as any,
  reason: '',
  hospitalityType: '',
  hospPlace: '',
  // reasonType: '',
  // giftDescType: '',
  // giftDesc: '',
  date: dayjs().format('YYYY-MM-DD'),
  companyList: [],
  hospActivities: [] as any,
  // isGoSoc: '',
  // isBayerCustomer: '',
  // givingTitle: '',
  expensePerHead: undefined as any, // 估计人均费用
  headCount: undefined as any, // 受邀人人数
  estimatedTotalExpense: undefined as any, // 估计的总费用
  remark: '',
  fileId: undefined
});

const listPagination = ref({
  current: 1,
  pageSize: 5,
  total: 0
});

const columns: TableColumnsType = [
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
    dataIndex: 'createdDate',
    key: 'ba.CREATED_DATE',
    fixed: 'left'
  },
  { title: 'form.common.reference', sorter: true, dataIndex: 'reference', key: 'REFERENCE', width: 120 },
  { title: 'form.applicateInfo.applyForCwid', dataIndex: 'sfUserAppliedCwid', key: 'SF_USER_APPLIED_CWID', width: 100 },
  { title: 'form.applicateInfo.department', dataIndex: 'department', key: 'DEPARTMENT', width: 150 },
  { title: 'form.applicateInfo.employeeLe', dataIndex: 'employeeLe', key: 'COMPANY_CODE', width: 150 },
  { title: 'form.searchFrom.applyType', dataIndex: 'requestType', key: 'requestType', width: 150 },
  {
    title: 'page.givingHospitality.applyForm.giftGivingDate',
    sorter: true,
    width: 100,
    dataIndex: 'hospitalityDate',
    key: 'HOSPITALITY_DATE'
  },
  { title: 'form.searchFrom.applyStatus', sorter: true, dataIndex: 'status', key: 'status', width: 150 },
  {
    title: 'common.action',
    key: 'operation',
    fixed: 'right',
    width: 100
  }
];

const addCompany = () => {
  if (givingHospitalityFromStatus.disableStatus) {
    return;
  }
  applyModelRef.companyList.push({
    id: -1,
    description: '',
    companyName: '',
    key: Date.now(),
    personList: [
      {
        id: -1,
        personName: '',
        positionTitle: '',
        isGoSoc: '',
        isBayerCustomer: '',
        description: '',
        unitValue: undefined,
        volume: undefined,
        companyId: -1,
        key: Date.now()
      }
    ]
  });
};

const removePerson = (person: Api.Gifts.GiftPerson) => {
  if (givingHospitalityFromStatus.disableStatus) {
    return;
  }
  const applyCompany = applyModelRef.companyList.filter(c => c.key === currentCompanyState.key);
  if (applyCompany) {
    const index = applyCompany[0].personList.indexOf(person);
    if (index !== -1) {
      applyCompany[0].personList.splice(index, 1);
    }
  }
};

const checkFirstPerson = () => {
  const applyCompany = applyModelRef.companyList.filter(c => c.key === currentCompanyState.key);
  let result;
  if (applyCompany.length > 0) {
    result = applyCompany[0].personList.length > 1;
  }
  return result;
};

const addPerson = () => {
  if (givingHospitalityFromStatus.disableStatus) {
    return;
  }
  currentCompanyState.personList.push({
    id: -1,
    personName: '',
    positionTitle: '',
    isGoSoc: '',
    isBayerCustomer: '',
    unitValue: undefined,
    volume: undefined,
    description: '',
    companyId: -1,
    key: Date.now()
  });
};

const openAddPersonModal = (item: Api.Gifts.GiftCompany) => {
  currentCompanyState = item;
  showAddPersonModal.value = true;
};

const onSubmitAddPerson = () => {
  addPersonModalFormRef?.value?.validate().then(() => {
    showAddPersonModal.value = false;
  });
};

const onCancelAddPerson = () => {
  addPersonModalFormRef?.value?.resetFields();
  showAddPersonModal.value = false;
};

// 清空记录
const clearApplyModel = () => {
  applyModelRef.actionType = '';
  applyModelRef.applicationId = '';
  applyModelRef.reference = '';
  applyModelRef.deptHead = undefined;
  applyModelRef.applyName = undefined;
  applyModelRef.applyForId = -1;
  applyModelRef.copyToUserEmails = [];
  applyModelRef.applyCCName = [];
  applyModelRef.reason = '';
  applyModelRef.hospitalityType = '';
  applyModelRef.hospPlace = '';
  applyModelRef.date = dayjs().format('YYYY-MM-DD');
  applyModelRef.companyList = [];
  applyModelRef.hospActivities = [];
  applyModelRef.expensePerHead = undefined;
  applyModelRef.headCount = undefined;
  applyModelRef.estimatedTotalExpense = 0;
  applyModelRef.remark = '';
  uploadFileList.value = [];
  givingHospitalityFromStatus.disableStatus = false;
  deptHeadGroupUserState.hidden = true;
};

const loadDeptHeadGroupUserData = debounce(async () => {
  if (!userInfo.companyCode) {
    deptHeadGroupUserState.data = [];
  }
  const { data: items, error } = await feachDeptHeadGroupUsers(userInfo.companyCode, userInfo.division);
  if (!error) {
    deptHeadGroupUserState.data = items;
    console.log('users: ', deptHeadGroupUserState);
  }
}, 800);

const deptHeadGroupUserOptions = computed<SelectProps['options']>(() =>
  deptHeadGroupUserState.data.map((item: any) => ({
    label: `${item.userFirstName} ${item.userLastName} <${item.userEmail}>`,
    value: item.userEmail
  }))
);

const handleChangeApplyUser = (item: any) => {
  console.log('apply user option: ', item);
  if (item) {
    applyModelRef.applyName = item.value;
  }
};

// 搜索按钮，
const getListDataByCondition = async (pag?: { pageSize: number; current: number }) => {
  // get search date
  listTableLoading.value = true;
  if (typeof searchRangeDate.value !== 'undefined') {
    searchFormModelRef.beginDate = searchRangeDate.value[0].format('YYYY-MM-DD');
    searchFormModelRef.endDate = searchRangeDate.value[1].format('YYYY-MM-DD');
  }
  searchFormModelRef.currentPage = pag?.current ? pag?.current : 1;
  searchFormModelRef.pageSize = pag?.pageSize ? pag?.pageSize : 5;
  const { data: queryResult, error } = await fetchGivingHospitalityList(searchFormModelRef);
  console.log(queryResult);
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

const closeApplyDrawerModal = () => {
  openApplyDrawerModal.value = false;
  uploadFileList.value.length = 0;
  givingHospitalityFromStatus.disableStatus = false;
  applyOptions.value.length = 0;
  ccApplyOptions.value.length = 0;
  userState.data = [];
  userState.ccData = [];
};

// 表格修改
const handleTableChange = (pag: { pageSize: number; current: number }, filters: any, sorter: any) => {
  console.log('filter: ', filters);
  searchFormModelRef.orders = [];
  if (sorter.columnKey) {
    searchFormModelRef.orders.push({ column: sorter.columnKey, type: sorter.order === 'ascend' ? 'ASC' : 'DESC' });
  }
  getListDataByCondition(pag);
};

const onFinishSearch = (values: any) => {
  console.log('Received values of form: ', values);
  console.log('searchFormModelRef: ', searchFormModelRef);
};

const resetFromFields = () => {
  givingHospitalityFormRef?.value?.resetFields();
  addPersonModalFormRef?.value?.resetFields();
  clearApplyModel();
};

const showApplyDrawerModal = async (item?: any) => {
  resetFromFields();
  if (item && item.applicationId) {
    item.loading = true;
    // debugger;
    console.log('item: {}', item);
    const { data, error } = await getGivingHospitalityHistoryByApplicationId(item.applicationId);
    if (!error) {
      givingHospitalityFromStatus.actionStatus = data.status;
      userInfo.companyCode = data.employeeLe;
      applyModelRef.createDate = dayjs(data.createdDate).format('YYYY-MM-DD');
      applyModelRef.applicationId = data.applicationId;
      applyModelRef.actionType = data.status;
      applyModelRef.reference = data.reference;
      const applyUser = data.applyForUser;
      userState.data = [{ ...applyUser }];
      applyModelRef.applyName = applyUser.email;
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
            positionType: p.positionType,
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

      if (data.copyToUsers) {
        const ccOptions = [] as any;
        data.copyToUsers.forEach((user: any) => {
          // 排除申请人信息
          if (user.copytoEmail !== userInfo.email) {
            ccOptions.push({
              firstName: user.copytoFirstName,
              lastName: user.copytoLastName,
              email: user.copytoEmail
            });
            // ccApplyOptions.value.push({
            //   label: `${user.copytoFirstName} ${user.copytoLastName} <${user.copytoEmail}>`,
            //   value: user.copytoEmail,
            //   userId: user.sfUserIdCopyTo
            // });
          }
        });
        userState.ccData = ccOptions;
        applyModelRef.applyCCName = ccOptions.map((v: any) => v.email);
      }
      if (data.deptHeadGroup && data.deptHeadGroup.userToGroups.length > 0) {
        deptHeadGroupUserState.hidden = false;
        const deptHeadUser = data.deptHeadGroup.userToGroups[0];
        applyModelRef.deptHead = deptHeadUser.userEmail;
        deptHeadGroupUserState.data.push(deptHeadUser);
      }
      if (data.fileAttach) {
        const attach = data.fileAttach;
        uploadFileList.value.push({
          uid: attach.id,
          name: attach.origFileName,
          // size: Number.parseInt(attach.fileSize, 2),
          // url: `${baseURL}/sys/download/file?fileId=${attach.id}`
          url: attach.filePath
        });
      }

      applyModelRef.hospActivities = data.hospActivities;
      applyModelRef.expensePerHead = data.hospRef.expensePerHead;
      applyModelRef.headCount = data.hospRef.headCount;
      applyModelRef.hospitalityType = data.hospRef.hospitalityType;
      applyModelRef.hospPlace = data.hospRef.hospPlace;
      applyModelRef.date = dayjs(data.hospRef.hospitalityDate).format('YYYY-MM-DD');
      applyModelRef.reason = data.reason;
      // applyModelRef.isHandedOver = data.isHandedOver;
      applyModelRef.remark = data.remark;
      //  hadle history reocrd

      console.log('success:', data);
    }
    setTimeout(() => {
      item.loading = false;
      openApplyDrawerModal.value = true;
    }, 1000);
  }
};

// 重置search表单
const resetSearchForm = () => {
  nextTick(() => {
    searchRangeDate.value = undefined;
    searchFormModelRef.beginDate = '';
    searchFormModelRef.endDate = '';
    searchFormRef?.value?.resetFields();
    getListDataByCondition();
  });
};

onMounted(async () => {
  authStore = useAuthStore();
  userInfo = authStore.userInfo;
  // supervisorInfo = userInfo.supervisor;
  applyUserInfo.value = authStore.userInfo;
  applyUserSupervisorInfo.value = authStore.userInfo;
  console.log(`creator companycode:${userInfo.companyCode}`);
  console.log(`apply user isDeptHead: ${applyUserInfo?.value?.isDeptHead}`);
  console.log(`apply user isCountryHead: ${applyUserInfo?.value?.isCountryHead}`);
  loadDeptHeadGroupUserData();
  const listData = await fetchGivingHospitalityList({ userId: authStore.userInfo.sfUserId, newVersion: 'N' });
  listTableLoading.value = false;
  if (listData?.data?.list && listData.data.list.length > 0) {
    listDataSource.value = [];
    listDataSource.value = listData.data.list;
    listPagination.value.total = listData.data.totalCount;
    listPagination.value.current = listData.data.currPage;
    listPagination.value.pageSize = listData.data.pageSize;
  }
});

// 重新加载申请人信息
const fillInApplyUserInfo = async (newValue: string, oldValue: string) => {
  if (newValue !== oldValue) {
    // debugger;
    const applyOpt = userState.data.filter(a => a.email === applyModelRef.applyName);
    console.log(applyOpt);
    if (applyOpt.length > 0) {
      const { data, error } = await fetchGetUserInfoById(applyOpt[0].sfUserId);
      if (!error) {
        // console.log(data);
        applyUserInfo.value = data;
        applyUserSupervisorInfo.value = data.supervisor;
      }
    }
  }
};

const hideDeptHeadDropDown = (newPerHead: number, newHeadCount: number) => {
  applyModelRef.estimatedTotalExpense = Number.isNaN(newPerHead * newHeadCount) ? undefined : newPerHead * newHeadCount;
  // 隐藏部门经理下拉列表
  deptHeadGroupUserState.hidden = false;
  if (applyUserInfo?.value?.isCountryHead || applyUserInfo?.value?.isDeptHead) {
    deptHeadGroupUserState.hidden = true;
  }
  if (!newPerHead || newPerHead <= 300) {
    deptHeadGroupUserState.hidden = true;
  }
};

watch(
  () => [
    applyModelRef.applyName,
    userState.data,
    userState.ccData,
    applyModelRef.expensePerHead,
    applyModelRef.headCount,
    applyModelRef.companyList
  ],
  (
    [newApplyName, newUserVal, newUserCCVal, newPerHead, newHeadCount, newCompanyList],
    [oldApplyName, oldUserVal, oldUserCCVal, oldPerHead, oldHeadCount, oldCompanyList]
  ) => {
    console.log('newApplyName:', newApplyName);
    console.log('newUserVal:', newUserVal);
    console.log('newUserCCVal:', newUserCCVal);
    console.log('oldUserVal:', oldUserVal);
    console.log('oldUserCCVal:', oldUserCCVal);
    console.log('oldApplyName:', oldApplyName);
    console.log('newPerHead: ', newPerHead);
    console.log('newHeadCount: ', newHeadCount);
    console.log('oldPerHead: ', oldPerHead);
    console.log('oldHeadCount: ', oldHeadCount);
    console.log('newCompanyList:', newCompanyList);
    console.log('oldCompanyList:', oldCompanyList);

    ccApplyOptions.value = userState.ccData.map((user: any) => ({
      label: `${user.firstName} ${user.lastName} <${user.email}>`,
      value: user.email
    }));

    applyOptions.value = userState.data.map((user: any) => ({
      label: `${user.firstName} ${user.lastName} <${user.email}>`,
      value: user.email,
      sfUserId: user.sfUserId
    }));
    fillInApplyUserInfo(newApplyName, oldApplyName).then(() => {
      hideDeptHeadDropDown(newPerHead, newHeadCount);
    });
  }
);
</script>

<template>
  <div>
    <a-drawer
      :title="$t('page.givingHospitality.applyForm.givingHospitalityRequestTitle')"
      width="75%"
      size="large"
      :open="openApplyDrawerModal"
      @close="closeApplyDrawerModal"
    >
      <a-descriptions :title="$t('form.applicateInfo.formFillerInfoTitle')" :column="2">
        <a-descriptions-item :label="$t('form.applicateInfo.formFiller')">
          {{ userInfo.firstName }} {{ userInfo.lastName }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('form.applicateInfo.applyDate')">
          {{ applyModelRef.createDate }}
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
      <a-descriptions :title="$t('form.applicateInfo.applicateInfoTitle')"></a-descriptions>

      <a-form ref="givingHospitalityFormRef" :model="applyModelRef" :disabled="true">
        <a-row :gutter="24">
          <a-col span="10">
            <a-form-item :label="$t('form.applicateInfo.applyFor')" name="applyName">
              <a-select
                v-model:value="applyModelRef.applyName"
                :default-active-first-option="true"
                :placeholder="$t('form.common.select_validation')"
                show-search
                label-in-value
                :allow-clear="true"
                :not-found-content="userState.fetching ? null : undefined"
                :options="applyOptions"
                @change="handleChangeApplyUser"
              ></a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-descriptions>
          <!--
 <a-descriptions-item :label="$t('form.applicateInfo.applyFor')">
            {{ applyUserInfo?.firstName }} {{ applyUserInfo?.lastName }}
          </a-descriptions-item>
-->
          <a-descriptions-item :label="$t('form.applicateInfo.employeeNo')">
            {{ applyUserInfo?.employeeId }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('form.applicateInfo.department')">
            {{ applyUserInfo?.orgTxt }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('form.applicateInfo.supervisor')">
            {{ applyUserSupervisorInfo?.firstName }} {{ applyUserSupervisorInfo?.lastName }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('form.applicateInfo.costCenter')">
            {{ applyUserInfo?.costCenter }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('form.applicateInfo.division')">
            {{ applyUserInfo?.division }}
          </a-descriptions-item>
        </a-descriptions>
        <a-row :gutter="24">
          <a-col span="24">
            <a-form-item name="applyCCName" :label="$t('form.applicateInfo.applyCC')">
              <a-select
                v-model:value="applyModelRef.applyCCName"
                mode="multiple"
                :default-active-first-option="false"
                :allow-clear="true"
                :not-found-content="userState.fetching ? null : undefined"
                :filter-option="false"
                :placeholder="$t('form.common.select_validation')"
                :options="ccApplyOptions"
              ></a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <template v-if="!deptHeadGroupUserState.hidden">
          <a-row :gutter="24">
            <a-col span="10">
              <a-form-item :label="$t('form.applicateInfo.deptHead')" name="deptHead">
                <a-select
                  v-model:value="applyModelRef.deptHead"
                  :default-active-first-option="true"
                  :placeholder="$t('form.applicateInfo.deptHead_validation')"
                  show-search
                  label-in-value
                  :allow-clear="true"
                  :not-found-content="userState.fetching ? null : undefined"
                  :options="deptHeadGroupUserOptions"
                ></a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </template>
        <a-descriptions :title="$t('page.givingHospitality.applyForm.givingHospitalityInfo')" />

        <a-row :gutter="24">
          <a-col span="24">
            <a-form-item :label="$t('page.givingHospitality.applyForm.giftReason_label')" name="reason">
              <a-input
                v-model:value="applyModelRef.reason"
                :placeholder="$t('page.givingGifts.applyForm.giftDesc_label_validation')"
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col span="16">
            <a-form-item :label="$t('page.givingHospitality.applyForm.giftHospitalityType')" name="hospitalityType">
              <a-input
                v-model:value="applyModelRef.hospitalityType"
                :placeholder="$t('page.givingHospitality.applyForm.giftHospitalityType_validation')"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col span="8">
            <a-form-item :label="$t('page.givingHospitality.applyForm.giftHospPlace')" name="hospPlace">
              <a-input
                v-model:value="applyModelRef.hospPlace"
                :placeholder="$t('page.givingHospitality.applyForm.giftHospPlace_validation')"
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :flex="1">
            <a-form-item name="date" :label="$t('page.givingHospitality.applyForm.giftGivingDate')">
              <a-date-picker v-model:value="applyModelRef.date" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
            </a-form-item>
          </a-col>
          <a-col :flex="1">
            <a-form-item name="expensePerHead" :label="$t('page.givingHospitality.applyForm.giftExpensePerHead')">
              <a-input-number
                v-model:value="applyModelRef.expensePerHead"
                :placeholder="$t('page.givingHospitality.applyForm.giftExpensePerHead_validation')"
                :step="0.01"
              ></a-input-number>
            </a-form-item>
          </a-col>
          <a-col :flex="2">
            <a-form-item
              style="white-space: normal"
              name="headCount"
              :label="$t('page.givingHospitality.applyForm.giftHeadCount')"
            >
              <a-input-number
                v-model:value="applyModelRef.headCount"
                :placeholder="$t('page.givingHospitality.applyForm.giftHeadCount_validation')"
                :min="1"
              ></a-input-number>
            </a-form-item>
          </a-col>
          <a-col :flex="1">
            <a-form-item :label="$t('form.common.totalPrice')" name="estimatedTotalExpense">
              <a-input-number
                :value="applyModelRef.estimatedTotalExpense"
                :placeholder="$t('page.givingHospitality.applyForm.giftEstimatedTotalExpense_validation')"
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
              ></a-upload>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col span="24">
            <a-form-item :label="$t('page.givingHospitality.applyForm.remark')" name="remark">
              <a-textarea v-model:value="applyModelRef.remark" :rows="4" allow-clear />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>

      <!--显示历史操作记录-->
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
    </a-drawer>

    <a-card :title="$t('common.search')">
      <template #extra>
        <a-button type="link" @click="expandSearchFields = !expandSearchFields">
          <template v-if="expandSearchFields">{{ $t('common.shrink') }}</template>
          <template v-else>{{ $t('common.expand') }}</template>
        </a-button>
      </template>
      <a-form
        ref="searchFormRef"
        name="advanced_search"
        class="ant-advanced-search-form"
        :model="searchFormModelRef"
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
            <a-col span="8">
              <a-form-item :label="$t('form.searchFrom.applyStatus')" name="status">
                <a-select v-model:value="searchFormModelRef.status" :placeholder="$t('form.common.select_validation')">
                  <a-select-opt-group :label="$t('form.common.option_draft')">
                    <a-select-option value="Draft">Draft</a-select-option>
                  </a-select-opt-group>
                  <a-select-opt-group :label="$t('form.common.option_inProcess')">
                    <a-select-option value="For Line Manager Approval">For Line Manager Approval</a-select-option>
                    <a-select-option value="For Subgroup Compliance Officer Approval">For SCO Approval</a-select-option>
                    <!--1391 2614 department Head approve-->
                    <a-select-option value="For Department Head Approval">For Department Head Approval</a-select-option>
                    <a-select-option value="For Country Head Approval">For Country Head Approval</a-select-option>
                  </a-select-opt-group>
                  <a-select-opt-group :label="$t('form.common.option_complete')">
                    <!-- <a-select-option value="Documented">Documented</a-select-option> -->
                    <a-select-option value="Approved">Approved</a-select-option>
                    <a-select-option value="Rejected">Rejected</a-select-option>
                    <a-select-option value="Cancelled">Cancelled</a-select-option>
                  </a-select-opt-group>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col span="11">
              <a-form-item :label="$t('form.applicateInfo.applyDate')">
                <a-range-picker v-model:value="searchRangeDate" />
              </a-form-item>
            </a-col>
            <a-col :span="5" style="text-align: right">
              <a-space :size="5">
                <a-button type="primary" ghost html-type="submit" @click="getListDataByCondition()">
                  <div class="flex-y-center gap-8px">
                    <icon-ic-round-search class="text-icon" />
                    <span>{{ $t('common.search') }}</span>
                  </div>
                </a-button>
                <a-button style="margin: 1px" @click="resetSearchForm()">
                  <div class="flex-y-center gap-8px">
                    <icon-ic-round-refresh class="text-icon" />
                    <span>{{ $t('common.reset') }}</span>
                  </div>
                </a-button>
              </a-space>
            </a-col>
          </a-row>
        </div>
      </a-form>
    </a-card>

    <a-card :title="$t('common.list')">
      <a-table
        :columns="columns"
        :data-source="listDataSource"
        :scroll="{ x: 1500 }"
        class="table-list"
        :loading="listTableLoading"
        :pagination="listPagination"
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
          <template v-else-if="column.key === 'ba.CREATED_DATE'">
            {{ dayjs(record.createdDate).format('YYYY-MM-DD') }}
          </template>
          <template v-else-if="column.key === 'status'">
            <span>
              <template v-if="record.status === 'Draft'">
                <a-tag color="green">{{ record.status.toUpperCase() }}</a-tag>
              </template>
              <template v-else-if="record.status === 'Approved'">
                <a-tag color="cyan">{{ record.status.toUpperCase() }}</a-tag>
              </template>
              <template v-else-if="record.status === 'Documented'">
                <a-tag color="geekblue">{{ record.status.toUpperCase() }}</a-tag>
              </template>
              <template v-else-if="record.status === 'Rejected'">
                <a-tag color="red">{{ record.status.toUpperCase() }}</a-tag>
              </template>
              <template v-else-if="record.status === 'Cancelled'">
                <a-tag color="orange">{{ record.status.toUpperCase() }}</a-tag>
              </template>
              <template v-else>
                <a-tag color="volcano">{{ record.status.toUpperCase() }}</a-tag>
              </template>
            </span>
          </template>
        </template>
      </a-table>
    </a-card>

    <!--添加person modal-->
    <a-modal
      v-model:open="showAddPersonModal"
      width="850px"
      :title="$t('form.common.addPerson')"
      @cancel="onCancelAddPerson"
      @ok="onSubmitAddPerson"
    >
      <a-form ref="addPersonModalFormRef" :model="currentCompanyState" :disabled="true">
        <template v-for="(person, index) in currentCompanyState.personList" :key="person.key">
          <a-divider orientation="left" />

          <template
            v-if="userInfo.companyCode === '0813' || userInfo.companyCode === '2614' || userInfo.companyCode === '1391'"
          >
            <a-row :gutter="24">
              <a-col :span="10">
                <a-form-item
                  :label="$t('page.givingHospitality.applyForm.gitfHospEmployeeIsGoSoc')"
                  :name="['personList', index, 'isGoSoc']"
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
              <a-col :span="10">
                <a-form-item
                  :label="$t('page.givingHospitality.applyForm.giftHospEmployeeIsBayerCustomer')"
                  :name="['personList', index, 'isBayerCustomer']"
                >
                  <a-select v-model:value="person.isBayerCustomer">
                    <a-select-option value="Yes">{{ $t('form.common.option_yes') }}</a-select-option>
                    <a-select-option value="No">{{ $t('form.common.option_no') }}</a-select-option>
                    <a-select-option value="Not applicable">
                      {{ $t('form.common.option_not_Applicable') }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </template>
          <template v-else>
            <a-row :gutter="24">
              <a-col :span="10">
                <a-form-item
                  :label="$t('page.givingHospitality.applyForm.gitfHospEmployeeIsGoSoc')"
                  :name="['personList', index, 'positionType']"
                >
                  <a-select v-model:value="person.positionType">
                    <a-select-option value="Government Official">
                      {{ $t('form.common.option_go_sco_Government_Official') }}
                    </a-select-option>
                    <a-select-option value="Distributor">
                      {{ $t('form.common.option_go_sco_Distributor') }}
                    </a-select-option>
                    <a-select-option value="Others (e.g. business partner)">
                      {{ $t('form.common.option_Other') }}
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
              >
                <a-input v-model:value="person.personName"></a-input>
              </a-form-item>
            </a-col>

            <a-col :span="10">
              <a-form-item
                :label="$t('page.givingHospitality.applyForm.giftHospTitle')"
                :name="['personList', index, 'positionTitle']"
              >
                <a-input v-model:value="person.positionTitle"></a-input>
              </a-form-item>
            </a-col>

            <a-col :span="4">
              &nbsp;
              <PlusCircleOutlined class="dynamic-add-del-button" @click="addPerson" />
              &nbsp;
              <MinusCircleOutlined
                v-if="checkFirstPerson()"
                class="dynamic-add-del-button"
                @click="removePerson(person)"
              />
            </a-col>
          </a-row>
        </template>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped>
.table_list {
  overflow: hidden;
}
.table_list:hover {
  overflow-x: scroll;
}

.ant-form-item-label {
  word-wrap: break-word;
  word-break: break-all;
}
.dynamic-add-del-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}
.dynamic-add-del-button:hover {
  color: #777;
}
.dynamic-add-del-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
