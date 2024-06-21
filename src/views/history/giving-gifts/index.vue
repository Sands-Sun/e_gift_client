<script setup lang="ts">
import { $t } from '@/locales';
import { fetchGetUserInfoById, fetchGivingGiftsList, getGivingGiftsHistoryByApplicationId } from '@/service/api';
import { useAuthStore } from '@/store/modules/auth';
import type { SelectProps } from '@ant-design/icons-vue';
import type { FormInstance, TableColumnsType } from 'ant-design-vue';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';
const authStore = useAuthStore();
const userInfo = authStore.userInfo;
// const applyUserInfo = ref<Api.Auth.UserInfo>();
// const applyUserSupervisorInfo = ref<Api.Auth.UserInfo>();
const applyUserInfo = reactive<{
  creatorUserInfo: Api.Auth.UserInfo | undefined;
  userInfo: Api.Auth.UserInfo | undefined;
  supervisor: Api.Auth.UserInfo | undefined;
}>({
  creatorUserInfo: undefined,
  userInfo: undefined,
  supervisor: undefined
});
const openApplyDrawerModal = ref<boolean>(false);
const givingGiftFormRef = ref<FormInstance>();
const searchFormRef = ref<FormInstance>();
const expandSearchFields = ref(true);
const listTableLoading = ref(true);
// const showReasonDesc = ref(false);
const listDataSource = ref([] as any);
const searchRangeDate = ref<[Dayjs, Dayjs]>();
const ccApplyOptions = ref<SelectProps['options']>([]);
const applyOptions = ref<SelectProps['options']>([]);
const userState = reactive({ data: [] as any, ccData: [] as any, fetching: true });
const deptHeadGroupUserState = reactive({ data: [] as any, hidden: true });
const applyModelRef = reactive<{
  actionType: string;
  applicationId: string;
  createDate: string;
  reference: string;
  applyName: string;
  applyForId: number;
  countryHead: string | undefined;
  deptHead: string | undefined;
  copyToUserEmails: string[];
  applyCCName: string[];
  reason: string;
  reasonType: string;
  giftDescType: string;
  giftDesc: string;
  date: string;
  givenCompany: string;
  givenPerson: string;
  giftsActivities: unknown[];
  isGoSoc: string;
  isBayerCustomer: string;
  unitValue: number | undefined;
  volume: number | undefined;
  totalValue: number | undefined;
  remark: string;
  fileId: unknown;
}>({
  actionType: '',
  applicationId: '',
  createDate: dayjs().format('YYYY-MM-DD'),
  reference: '',
  applyName: '',
  applyForId: undefined as any,
  deptHead: undefined as any,
  countryHead: undefined as any,
  copyToUserEmails: [] as any,
  applyCCName: undefined as any,
  reason: '',
  reasonType: '',
  giftDescType: '',
  giftDesc: '',
  date: dayjs().format('YYYY-MM-DD'),
  givenCompany: '',
  givenPerson: '',
  giftsActivities: [] as any,
  isGoSoc: '',
  isBayerCustomer: '',
  // givingTitle: '',
  unitValue: undefined as any,
  volume: undefined as any,
  totalValue: undefined as any,
  remark: '',
  fileId: undefined
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
    title: 'page.givingGifts.applyForm.giftGivingDate',
    sorter: true,
    width: 100,
    dataIndex: 'givenDate',
    key: 'GIVEN_DATE'
  },
  { title: 'form.searchFrom.applyStatus', sorter: true, dataIndex: 'status', key: 'status', width: 150 },
  {
    title: 'common.action',
    key: 'operation',
    fixed: 'right',
    width: 100
  }
];

const deptHeadGroupUserOptions = computed<SelectProps['options']>(() =>
  deptHeadGroupUserState.data.map((item: any) => ({
    label: `${item.userFirstName} ${item.userLastName} <${item.userEmail}>`,
    value: item.userEmail
  }))
);

// 清空记录
const clearApplyModel = () => {
  applyModelRef.actionType = '';
  applyModelRef.applicationId = '';
  applyModelRef.reference = '';
  applyModelRef.deptHead = undefined;
  applyModelRef.applyName = '';
  applyModelRef.applyForId = -1;
  applyModelRef.copyToUserEmails = [];
  applyModelRef.applyCCName = [];
  applyModelRef.reason = '';
  applyModelRef.reasonType = '';
  applyModelRef.giftDescType = '';
  applyModelRef.giftDesc = '';
  applyModelRef.isGoSoc = '';
  applyModelRef.isBayerCustomer = '';
  applyModelRef.date = dayjs().format('YYYY-MM-DD');
  applyModelRef.givenCompany = '';
  applyModelRef.givenPerson = '';
  applyModelRef.giftsActivities = [];
  applyModelRef.unitValue = undefined;
  applyModelRef.volume = undefined;
  applyModelRef.remark = '';
};

const resetFromFields = () => {
  givingGiftFormRef?.value?.resetFields();
  clearApplyModel();
};

const showApplyDrawerModal = async (item?: any) => {
  resetFromFields();
  if (item && item.applicationId) {
    item.loading = true;
    console.log('item: {}', item);
    const { data, error } = await getGivingGiftsHistoryByApplicationId(item.applicationId);
    if (!error) {
      deptHeadGroupUserState.hidden = true;
      applyModelRef.createDate = dayjs(data.createdDate).format('YYYY-MM-DD');
      applyModelRef.applicationId = data.applicationId;
      applyModelRef.actionType = data.status;
      applyModelRef.reference = data.reference;
      const applyUser = data.applyForUser;
      userState.data = [{ ...applyUser }];
      applyUserInfo.userInfo = applyUser;
      applyUserInfo.supervisor = applyUser.supervisor;
      applyUserInfo.creatorUserInfo = data.creatorUser;
      applyModelRef.applyName = applyUser.email;
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

      // applyModelRef.applyCCName = ccApplyOptions.value.map((v: any) => v.value);
      applyModelRef.unitValue = data.giftsRef.unitValue;
      applyModelRef.volume = data.giftsRef.volume;
      applyModelRef.totalValue = data.totalValue;
      applyModelRef.date = dayjs(data.giftsRef.givenDate).format('YYYY-MM-DD');
      applyModelRef.givenCompany = data.giftsRef.givenCompany;
      applyModelRef.givenPerson = data.giftsRef.givenPerson;
      applyModelRef.giftsActivities = data.giftsActivities;
      applyModelRef.isBayerCustomer = data.giftsRef.isBayerCustomer;
      applyModelRef.reasonType = data.reasonType;
      applyModelRef.reason = data.reason;
      applyModelRef.giftDescType = data.giftsRef.giftDescType;
      applyModelRef.giftDesc = data.giftsRef.giftDesc;
      applyModelRef.isGoSoc = data.giftsRef.isGoSoc;
      // applyModelRef.isHandedOver = data.isHandedOver;
      applyModelRef.remark = data.remark;

      console.log('success:', data);
    }
    item.loading = false;
    openApplyDrawerModal.value = true;
  }
};

const closeApplyDrawerModal = () => {
  openApplyDrawerModal.value = false;
  ccApplyOptions.value.length = 0;
  userState.data = [];
  userState.ccData = [];
};

const onFinishSearch = (values: any) => {
  console.log('Received values of form: ', values);
  console.log('searchFormModelRef: ', searchFormModelRef);
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
  const { data: queryResult, error } = await fetchGivingGiftsList(searchFormModelRef);
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

// 表格修改
const handleTableChange = (pag: { pageSize: number; current: number }, filters: any, sorter: any) => {
  console.log('filter: ', filters);
  searchFormModelRef.orders = [];
  if (sorter.columnKey) {
    searchFormModelRef.orders.push({ column: sorter.columnKey, type: sorter.order === 'ascend' ? 'ASC' : 'DESC' });
  }
  getListDataByCondition(pag);
};

// 重新加载申请人信息
const reloadApplyUserInfo = async (newValue: string, oldValue: string) => {
  if (newValue !== oldValue) {
    // debugger;
    const applyOpt = userState.data.filter(a => a.email === applyModelRef.applyName);
    console.log(applyOpt);
    if (applyOpt.length > 0) {
      const { data, error } = await fetchGetUserInfoById(applyOpt[0].sfUserId);
      if (!error) {
        // console.log(data);
        applyUserInfo.userInfo = data;
        applyUserInfo.supervisor = data.supervisor;
      }
    }
  }
};

watch(
  () => [applyModelRef.applyName, userState.data, userState.ccData],
  async ([newApplyName, newUserVal, newUserCCVal], [oldApplyName, oldUserVal, oldUserCCVal]) => {
    // debugger;
    console.log('newApplyName:', newApplyName);
    console.log('newUserVal:', newUserVal);
    console.log('newUserCCVal:', newUserCCVal);
    console.log('oldApplyName:', oldApplyName);
    console.log('oldUserVal: ', oldUserVal);
    console.log('oldUserCCVal:', oldUserCCVal);

    ccApplyOptions.value = userState.ccData.map((user: any) => ({
      label: `${user.firstName} ${user.lastName} <${user.email}>`,
      value: user.email
    }));

    applyOptions.value = userState.data.map((user: any) => ({
      label: `${user.firstName} ${user.lastName} <${user.email}>`,
      value: user.email,
      sfUserId: user.sfUserId
    }));
    reloadApplyUserInfo(newApplyName, oldApplyName);
  },
  { deep: true }
);

onMounted(async () => {
  applyUserInfo.userInfo = userInfo;
  applyUserInfo.creatorUserInfo = userInfo;
  applyUserInfo.supervisor = userInfo.supervisor;
  console.log(`creator companycode:${userInfo.companyCode}`);
  console.log(`apply user isDeptHead: ${applyUserInfo?.userInfo?.isDeptHead}`);
  console.log(`apply user isCountryHead: ${applyUserInfo?.userInfo?.isCountryHead}`);
  const listData = await fetchGivingGiftsList({ userId: authStore.userInfo.sfUserId, newVersion: 'N' });
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
    <a-drawer
      :title="$t('page.givingGifts.applyForm.givingGiftRequestTitle')"
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

      <a-form ref="givingGiftFormRef" :model="applyModelRef" :disabled="true">
        <a-row :gutter="24">
          <a-col span="10">
            <a-form-item
              :label="$t('form.applicateInfo.applyFor')"
              name="applyName"
              :rules="[
                {
                  required: true,
                  message: $t('form.applicateInfo.applyFor_validation')
                }
              ]"
            >
              <a-select
                v-model:value="applyModelRef.applyName"
                :default-active-first-option="true"
                :placeholder="$t('form.common.select_validation')"
                show-search
                label-in-value
                :allow-clear="true"
                :not-found-content="userState.fetching ? null : undefined"
                :options="applyOptions"
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
          <a-descriptions-item :label="$t('form.applicateInfo.division')" :span="2">
            {{ applyUserInfo?.userInfo?.division }}
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

        <a-row :gutter="24">
          <template v-if="!deptHeadGroupUserState.hidden">
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
          </template>
        </a-row>
        <a-descriptions :title="$t('page.givingGifts.applyForm.givingGiftInfo')" />
        <a-row :gutter="24">
          <a-col span="12">
            <a-form-item :label="$t('page.givingGifts.applyForm.giftReason_type_label')" name="reasonType">
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
          <a-col span="12">
            <a-form-item :label="$t('page.givingGifts.applyForm.giftDesc_type_label')" name="giftDescType">
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
                  {{ $t('form.common.option_Other') }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col span="24">
            <a-form-item :label="$t('page.givingGifts.applyForm.giftReason_label')" name="reason">
              <a-input
                v-model:value="applyModelRef.reason"
                :placeholder="$t('page.givingGifts.applyForm.giftReason_label_validation')"
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
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
                <a-select-option value="Not Applicable">
                  {{ $t('form.common.option_not_Applicable') }}
                </a-select-option>
                <a-select-option value="HCP">
                  {{ $t('form.common.option_go_sco_HCP') }}
                </a-select-option>

                <a-select-option value="Distributor">
                  {{ $t('form.common.option_go_sco_Distributor') }}
                </a-select-option>

                <a-select-option value="Other">
                  {{ $t('form.common.option_Other') }}
                </a-select-option>
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
        <!--添加礼品名称-->
        <!--
 <a-row :gutter="24">
          <a-col span="14">
            <a-form-item
              name="giftDesc"
              :label="$t('page.givingGifts.applyForm.giftDesc_label')"
              :rules="[{ required: true, message: $t('page.givingGifts.applyForm.giftDesc_label_validation') }]"
            >
              <a-input
                v-model:value="applyModelRef.giftDesc"
                :placeholder="$t('page.givingGifts.applyForm.giftDesc_label_validation')"
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
-->
        <a-row :gutter="24">
          <a-col span="5">
            <a-form-item name="date" :label="$t('page.givingGifts.applyForm.giftGivingDate')">
              <a-date-picker v-model:value="applyModelRef.date" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
            </a-form-item>
          </a-col>
          <a-col span="7">
            <a-form-item name="giftDesc" :label="$t('page.givingGifts.applyForm.giftDesc_label')">
              <a-input v-model:value="applyModelRef.giftDesc"></a-input>
            </a-form-item>
          </a-col>
          <a-col span="5">
            <a-form-item name="volume" :label="$t('form.common.quantity')">
              <a-input-number v-model:value="applyModelRef.volume" :min="1"></a-input-number>
            </a-form-item>
          </a-col>
          <a-col span="5">
            <a-form-item :label="$t('form.common.totalPrice')">
              <a-input-number
                :value="applyModelRef.totalValue"
                addon-before="￥"
                style="width: 195px"
                :step="0.01"
                disabled="true"
              ></a-input-number>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col span="24">
            <a-form-item :label="$t('page.givingGifts.applyForm.giftGivingCompanyName')" name="givenCompany">
              <a-input v-model:value="applyModelRef.givenCompany"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col span="24">
            <a-form-item :label="$t('page.givingGifts.applyForm.giftGivingEmployeeName')" name="givenPerson">
              <a-input v-model:value="applyModelRef.givenPerson"></a-input>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col span="24">
            <a-form-item :label="$t('page.givingGifts.applyForm.remark')" name="remark">
              <a-textarea v-model:value="applyModelRef.remark" :rows="4" allow-clear />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>

      <!--显示历史操作记录-->
      <a-descriptions :title="$t('form.common.historyLog')">
        <a-descriptions-item :label="$t('form.common.operationInfo')" span="4">
          <ul>
            <li v-for="(item, index) in applyModelRef.giftsActivities" :key="item.appActivityDataId">
              <template v-if="item.sfUserIdSubmitter === 9999">&nbsp; {{ index + 1 }}. System &nbsp;</template>
              <template v-else>
                &nbsp; {{ index + 1 }}. {{ item.userFirstName }} {{ item.userLastName }} &nbsp;
              </template>
              <strong>{{ item.action }}</strong>
              &nbsp; at &nbsp;
              {{ item.createdDate }}
            </li>
          </ul>
        </a-descriptions-item>

        <a-descriptions-item :label="$t('form.common.remarkInfo')" span="4">
          <ul>
            <li v-for="(item, index) in applyModelRef.giftsActivities" :key="item.appActivityDataId">
              <template v-if="item.sfUserIdSubmitter === 9999">&nbsp; {{ index + 1 }}. System &nbsp;</template>
              <template v-else>
                &nbsp; {{ index + 1 }}. {{ item.userFirstName }} {{ item.userLastName }} &nbsp;
              </template>
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
  </div>
</template>

<style scoped></style>
