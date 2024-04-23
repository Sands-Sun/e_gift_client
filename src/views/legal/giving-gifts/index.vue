<script setup lang="ts">
import { $t } from '@/locales';
import {
  fetchGivingGiftsList,
  fuzzySearchGiftCompanyList,
  fuzzySearchGiftPersonList,
  fuzzySearchUserList
} from '@/service/api';
import { useAuthStore } from '@/store/modules/auth';
import type { SelectProps } from '@ant-design/icons-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import type { FormInstance, TableColumnsType } from 'ant-design-vue';
import { Form, Modal } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { debounce } from 'lodash-es';
import { computed, createVNode, onMounted, reactive, ref, toRaw, watch } from 'vue';
import type { MentionsProps } from '..';
let authStore: any;
let userInfo: Api.Auth.UserInfo;
let supervisorInfo: Api.Auth.UserInfo;
const applyGivingForm = Form.useForm;
const openApplyDrawerModal = ref<boolean>(false);
const expandSearchFields = ref(true);
const listTableLoading = ref(true);
const showReasonDesc = ref(false);
const listDataSource = ref([] as any);
const givingGiftFormRef = ref();
const searchRangeDate = ref<[Dayjs, Dayjs]>();
const applySearch = ref<string>('');
const giftCompanySearch = ref<string>('');
const giftPersonSearch = ref<string>('');
const userState = reactive({ data: [] as any, value: [] as any, ccValue: [] as any, fetching: true });
const giftCompanyState = reactive({ data: [] as any, value: -1, fetching: true });
const giftCompanyPersonState = reactive({ data: [] as any, value: [] as any, fetching: true });
const searchFormRef = ref<FormInstance>();
const searchFormModelRef = reactive({
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
    key: 'sfUserAppliedName',
    fixed: 'left'
  },
  {
    title: 'form.applicateInfo.applyDate',
    width: 100,
    dataIndex: 'createdDate',
    key: 'createdDate',
    fixed: 'left'
  },
  {
    title: 'form.applicateInfo.applyForCwid',
    dataIndex: 'sfUserAppliedCwid',
    key: 'cwsfUserAppliedCwidid',
    width: 100
  },
  {
    title: 'form.applicateInfo.department',
    dataIndex: 'department',
    key: 'department',
    width: 150
  },
  {
    title: 'form.applicateInfo.employeeLe',
    dataIndex: 'employeeLe',
    key: 'employeeLe',
    width: 150
  },
  {
    title: 'form.searchFrom.applyType',
    dataIndex: 'type',
    key: 'type',
    width: 150
  },
  {
    title: 'form.searchFrom.applyStatus',
    dataIndex: 'status',
    key: 'status',
    width: 150
  },
  {
    title: 'common.action',
    key: 'operation',
    fixed: 'right',
    width: 100
  }
];

const formApplyRules: Record<string, Rule[]> = reactive({
  applyName: [
    {
      required: true,
      message: $t('form.applicateInfo.applyFor_validation')
      // tsmg: 'form.applicateInfo.applyFor_validation'
    }
  ],
  reason: [
    {
      required: true,
      message: $t('page.receivingGifts.applyForm.giftDesc_label_validation')
      // tsmg: 'page.receivingGifts.applyForm.giftDesc_label_validation'
    }
  ],
  reasonType: [
    {
      required: true,
      message: $t('page.receivingGifts.applyForm.giftReason_label_validation')
      // tsmg: 'page.receivingGifts.applyForm.giftReason_label_validation'
    }
  ],
  giftDescType: [
    {
      required: true,
      message: $t('page.receivingGifts.applyForm.giftDesc_label_validation')
      // tsmg: 'page.receivingGifts.applyForm.giftDesc_label_validation'
    }
  ],
  date: [
    {
      required: true,
      message: $t('page.receivingGifts.applyForm.giftReceivingDate_validation')
      // tsmg: 'page.receivingGifts.applyForm.giftReceivingDate_validation'
    }
  ],
  unitValue: [
    {
      required: true,
      message: $t('form.common.unitPrice_validation')
      //  tsmg: 'form.common.unitPrice_validation'
    }
  ],
  volume: [
    {
      required: true,
      message: $t('form.common.quantity_validation')
      // tsmg: 'form.common.quantity_validation'
    }
  ],
  givenCompany: [
    {
      required: true,
      message: $t('page.receivingGifts.applyForm.giftGiverCompanyName_validation')
      // tsmg: 'page.receivingGifts.applyForm.giftGiverCompanyName_validation'
    }
  ],
  givenPersons: [
    {
      required: true,
      message: $t('page.receivingGifts.applyForm.giftGiverEmployeeName_validation')
      // tsmg: 'page.receivingGifts.applyForm.giftGiverEmployeeName_validation'
    }
  ]
  // givingTitle: [{ required: true, message: $t('page.receivingGifts.applyForm.giftGiverTitle_validation') }]
});

const applyModelRef = reactive({
  actionType: '',
  applyName: undefined as any,
  applyForId: undefined as any,
  copyToUserEmails: [] as any,
  applyCCName: undefined,
  reason: '',
  reasonType: '',
  giftDescType: '',
  giftDesc: '',
  date: dayjs(),
  givenCompany: '',
  givenPersons: '',
  isGoSoc: '',
  isBayerCustomer: '',
  // givingTitle: '',
  unitValue: undefined as any,
  volume: undefined as any,
  remark: ''
});

const disabledAfterCurrentDate = (current: Dayjs) => {
  // Can not select days after today and today
  return current && current > dayjs().endOf('day');
};

const { resetFields, validate, validateInfos } = applyGivingForm(applyModelRef, formApplyRules, {
  onValidate: (...args) => console.log(...args)
});

const loadGiftCompanyPersonData = debounce(async (keyword: string) => {
  if (!keyword) {
    giftCompanyPersonState.data = [];
  }
  if (!giftCompanyState.value && giftCompanyState.value === -1) {
    giftCompanyPersonState.data.push({ personName: keyword });
    return;
  }
  const { data: items, error } = await fuzzySearchGiftPersonList(giftCompanyState.value, keyword);
  if (!error) {
    console.log('fuzzySearchGiftPersonList:', items);
    giftCompanyPersonState.data = items;
    if (giftCompanyPersonState.data.length === 0) {
      console.log('gift company person push new key:', keyword);
      giftCompanyPersonState.data.push({ personName: keyword });
    }

    giftCompanyPersonState.fetching = false;
    console.log('giftCompanyState: ', giftCompanyState);
  }
});
const loadGiftCompanyData = debounce(async (keyword: string) => {
  if (!keyword) {
    giftCompanyState.data = [];
  }
  const { data: items, error } = await fuzzySearchGiftCompanyList(keyword);
  if (!error) {
    console.log('giftCompanyInfo:', items);
    if (giftCompanySearch.value !== keyword) {
      return;
    }
    giftCompanyState.data = items;
    if (giftCompanyState.data.length === 0) {
      console.log('push new key:', keyword);
      giftCompanyState.data.push({ companyName: keyword, id: -1 });
    }

    giftCompanyState.fetching = false;
    console.log('giftCompanyState: ', giftCompanyState);
  }
});

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

const ongGiftPersonSearch = (searchValue: string) => {
  giftPersonSearch.value = searchValue;
  giftCompanyPersonState.data = [];
  console.log('Search:', searchValue);
  loadGiftCompanyPersonData(searchValue);
};

const onGiftCompanySearch = (searchValue: string) => {
  giftCompanySearch.value = searchValue;
  giftCompanyState.data = [];
  giftCompanyState.fetching = true;
  console.log('Search:', searchValue);
  loadGiftCompanyData(searchValue);
};

const onGiftCompanyChange = (value: any) => {
  console.log(`selected ${value}`);
  giftCompanyState.value = value;
};

const ccApplyOptions = computed<SelectProps['options']>(() =>
  userState.data.map((user: any) => ({
    label: `${user.firstName} ${user.lastName} <${user.email}>`,
    value: user.email
  }))
);

const applyOptions = computed<MentionsProps['options']>(() =>
  userState.data.map((user: any) => ({
    label: `${user.firstName} ${user.lastName} <${user.email}>`,
    value: user.email
  }))
);

const showApplyDrawerModal = async (type: string, item?: any) => {
  resetFields();
  console.log(`type: ${type}item: `, item);
  userState.data = [];
  if (type === 'create') {
    console.log('create...');
    applyOptions.value.unshift({
      label: `${userInfo.firstName} ${userInfo.lastName} <${userInfo.email}>`,
      value: userInfo.email
    });
    applyModelRef.applyName = applyOptions.value[0];
  }
  openApplyDrawerModal.value = true;
};

const closeApplyDrawerModal = () => {
  openApplyDrawerModal.value = false;
};

// 搜索按钮，
const getListDataByCondition = async (currentPage = 1) => {
  // get search date
  listTableLoading.value = true;
  if (typeof searchRangeDate.value !== 'undefined') {
    searchFormModelRef.beginDate = searchRangeDate.value[0].format('YYYY-MM-DD');
    searchFormModelRef.endDate = searchRangeDate.value[1].format('YYYY-MM-DD');
  }
  searchFormModelRef.currentPage = currentPage;
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

// 表格修改
const handleTableChange = (pag: { pageSize: number; current: number }, filters: any, sorter: any) => {
  console.log('filter: ', filters);
  searchFormModelRef.orders = [];
  if (sorter.columnKey) {
    searchFormModelRef.orders.push({ column: sorter.columnKey, type: sorter.order === 'ascend' ? 'ASC' : 'DESC' });
  }
  getListDataByCondition(pag.current);
};

const onSubmitApply = (value: string) => {
  console.log(`submit type ${value}`);
  validate()
    .then(() => {
      Modal.confirm({
        title: $t('common.tip'),
        icon: createVNode(ExclamationCircleOutlined),
        content: '确定保存赠送？',
        okText: $t('common.confirm'),
        cancelText: $t('common.cancel'),
        async onOk() {
          const requestParam = toRaw(applyModelRef);
          // requestParam.actionType = value;
          // requestParam.applyForId = requestParam.applyName.option.userId;
          // requestParam.copyToUserEmails = requestParam.applyCCName;
          console.log(requestParam);
          // const { error } = await saveReceivingGifts(requestParam);
          // if (!error) {
          //   console.log('success!');
          //   resetFields();
          //   closeApplyDrawerModal();
          // }
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

const onFinishSearch = (values: any) => {
  console.log('Received values of form: ', values);
  console.log('searchFormModelRef: ', searchFormModelRef);
};

const resetSearchForm = () => {
  searchFormRef?.value?.resetFields();
};

const handleChange = (value: any) => {
  console.log(`selected ${value}`);
};
const typeHandleChange = (value: any) => {
  console.log(`value: ${value}`);
  searchFormModelRef.type = value;
};

const statusHandleChange = (value: any) => {
  console.log(`value: ${value}`);
  searchFormModelRef.status = value;
};

const handleChangeReasonType = (value: any) => {
  console.log('change reason reason', value);
  if (value === 'Other') {
    showReasonDesc.value = true;
    formApplyRules.reason = [
      { required: true, message: $t('page.receivingGifts.applyForm.giftDesc_label_validation') }
    ];
  } else {
    showReasonDesc.value = false;
    delete formApplyRules.reason;
  }
};

onMounted(async () => {
  authStore = useAuthStore();
  userInfo = authStore.userInfo;
  supervisorInfo = userInfo.supervisor;
  const listData = await fetchGivingGiftsList({ userId: authStore.userInfo.sfUserId });
  listTableLoading.value = false;
  if (listData?.data?.list && listData.data.list.length > 0) {
    listDataSource.value = [];
    listDataSource.value = listData.data.list;
    listPagination.value.total = listData.data.totalCount;
    listPagination.value.current = listData.data.currPage;
    listPagination.value.pageSize = listData.data.pageSize;
  }
});

// onUpdated(() => {
//   // 切换语言后表单验证失效
//   Object.entries(formApplyRules).forEach(([key, value]) => {
//     console.log(`key: ${key}`);
//     value[0].message = $t(`${value[0].tsmg}`);
//   });
// });

watch(
  () => [userState.value, giftCompanyState.value, giftCompanyPersonState.value],
  ([newVal1, newVal2, newVal3], [oldVal1, oldVal2, oldVal3]) => {
    console.log('newVal1:', newVal1);
    console.log('oldVal1:', oldVal1);
    console.log('newVal2:', newVal2);
    console.log('oldVal2:', oldVal2);
    console.log('newVal3:', newVal3);
    console.log('oldVal3:', oldVal3);
    userState.data = [];
    userState.fetching = false;
    giftCompanyState.data = [];
    giftCompanyState.fetching = false;
    giftCompanyPersonState.data = [];
    giftCompanyPersonState.fetching = false;
  }
);
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
      <a-descriptions :title="$t('form.applicateInfo.applicateInfoTitle')">
        <a-descriptions-item :label="$t('form.applicateInfo.formFiller')">
          {{ userInfo.firstName }} {{ userInfo.lastName }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('form.applicateInfo.employeeNo')">
          {{ userInfo.employeeId }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('form.applicateInfo.department')">{{ userInfo.orgTxt }}</a-descriptions-item>
        <a-descriptions-item :label="$t('form.applicateInfo.supervisor')">
          {{ supervisorInfo.firstName }} {{ supervisorInfo.lastName }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('form.applicateInfo.costCenter')">
          {{ userInfo.costCenter }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('form.applicateInfo.division')">{{ userInfo.division }}</a-descriptions-item>
      </a-descriptions>

      <a-form ref="givingGiftFormRef">
        <a-row :gutter="24">
          <a-col span="10">
            <a-form-item v-bind="validateInfos.applyName" :label="$t('form.applicateInfo.applyFor')">
              <a-select
                v-model:value="applyModelRef.applyName"
                :placeholder="$t('form.common.select_validation')"
                show-search
                label-in-value
                :allow-clear="true"
                :not-found-content="userState.fetching ? null : undefined"
                :options="applyOptions"
                @search="onApplySearch"
              >
                <!--
 <template v-for="item in userState.data" :key="item.sfUserId">
                <a-select-option value="{{item.sfUserId}}">
                  {{ item.firstName }} {{ item.lastName }} {{ item.email }}
                </a-select-option>
              </template>
-->
              </a-select>
            </a-form-item>
          </a-col>
          <a-col span="14">
            <a-form-item v-bind="validateInfos.applyCCName" :label="$t('form.applicateInfo.applyCC')">
              <a-select
                v-model:value="applyModelRef.applyCCName"
                mode="multiple"
                :default-active-first-option="false"
                :allow-clear="true"
                :not-found-content="userState.fetching ? null : undefined"
                :filter-option="false"
                :placeholder="$t('form.common.select_validation')"
                :options="ccApplyOptions"
                @search="onApplySearch"
              ></a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-descriptions :title="$t('page.givingGifts.policy.title')" layout="vertical">
          <a-descriptions-item
            v-for="(item, index) in $tm(`page.givingGifts.policy.desc_${userInfo.companyCode}`)"
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

        <a-descriptions :title="$t('page.givingGifts.applyForm.givingGiftInfo')" />
        <template
          v-if="userInfo.companyCode === '0813' || userInfo.companyCode === '1391' || userInfo.companyCode === '2614'"
        >
          <!--0813 AND 2614 AND 1391 显示下拉列表-->
          <a-row :gutter="24">
            <a-col span="12">
              <a-form-item :label="$t('page.givingGifts.applyForm.giftReason_label')" v-bind="validateInfos.reasonType">
                <a-select v-model:value="applyModelRef.reasonType" @change="handleChangeReasonType">
                  <a-select-option value="Chinese New Year">
                    {{ $t('form.common.option_giftReason_NewYear') }}
                  </a-select-option>
                  <a-select-option value="Mid-Autumn Festival">
                    {{ $t('form.common.option_giftReason_Mid_Autumn') }}
                  </a-select-option>
                  <a-select-option value="Other">{{ $t('form.common.option_Other') }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col span="12">
              <a-form-item
                :label="$t('page.receivingGifts.applyForm.giftDesc_type_label')"
                v-bind="validateInfos.giftDescType"
              >
                <a-select v-model:value="applyModelRef.giftDescType">
                  <a-select-option value="Company Branded Gift">
                    {{ $t('form.common.option_giftDesc_Company_Branded_Gift') }}
                  </a-select-option>
                  <a-select-option value="General Gift">
                    {{ $t('form.common.option_giftDesc_General_Gift') }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row v-show="showReasonDesc" :gutter="24">
            <a-col span="24">
              <a-form-item :label="$t('page.receivingGifts.applyForm.giftDesc_label')" v-bind="validateInfos.reason">
                <a-input
                  v-model:value="applyModelRef.reason"
                  :placeholder="$t('page.receivingGifts.applyForm.giftDesc_label_validation')"
                ></a-input>
              </a-form-item>
            </a-col>
          </a-row>
        </template>
        <template v-else>
          <a-row :gutter="24">
            <a-col span="14">
              <a-form-item v-bind="validateInfos.reasonType" :label="$t('page.givingGifts.applyForm.giftReason_label')">
                <a-input
                  v-model:value="applyModelRef.reasonType"
                  :placeholder="$t('page.givingGifts.applyForm.giftReason_label_validation')"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col span="10">
              <a-form-item v-bind="validateInfos.giftDescType" :label="$t('page.givingGifts.applyForm.giftDesc_label')">
                <a-select v-model:value="applyModelRef.giftDescType" @change="handleChange">
                  <a-select-option value="Cultural Courtesy Gifts">
                    {{ $t('form.common.option_giftDesc_Cultural_Courtesy') }}
                  </a-select-option>
                  <a-select-option value="Other">{{ $t('form.common.option_giftDesc_Other') }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </template>

        <a-row :gutter="24">
          <a-col span="7">
            <a-form-item v-bind="validateInfos.date" :label="$t('page.givingGifts.applyForm.giftGivingDate')">
              <a-date-picker v-model:value="applyModelRef.date" :disabled-date="disabledAfterCurrentDate" />
            </a-form-item>
          </a-col>
          <a-col span="5">
            <a-form-item v-bind="validateInfos.unitValue" :label="$t('form.common.unitPrice')">
              <a-input
                v-model:value="applyModelRef.unitValue"
                :placeholder="$t('form.common.unitPrice_validation')"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col span="5">
            <a-form-item v-bind="validateInfos.volume" :label="$t('form.common.quantity')">
              <a-input
                v-model:value="applyModelRef.volume"
                :placeholder="$t('form.common.quantity_validation')"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col span="5">
            <a-form-item :label="$t('form.common.totalPrice')">
              <a-input-number
                :value="applyModelRef.unitValue * applyModelRef.volume"
                addon-before="￥"
                style="width: 195px"
                disabled="true"
              ></a-input-number>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col span="24">
            <a-form-item
              v-bind="validateInfos.givenCompany"
              :label="$t('page.givingGifts.applyForm.giftGivingCompanyName')"
            >
              <a-select
                :placeholder="$t('form.common.select_validation')"
                show-search
                :allow-clear="true"
                :not-found-content="giftCompanyState.fetching ? null : undefined"
                :default-active-first-option="false"
                :filter-option="false"
                @search="onGiftCompanySearch"
                @change="onGiftCompanyChange"
              >
                <a-select-option v-for="item in giftCompanyState.data" :key="item.id" :value="item.id">
                  {{ item.companyName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col span="24">
            <a-form-item
              v-bind="validateInfos.givenPersons"
              :label="$t('page.givingGifts.applyForm.giftGivingEmployeeName')"
            >
              <a-select
                mode="multiple"
                style="width: 100%"
                :placeholder="$t('form.common.select_validation')"
                @search="ongGiftPersonSearch"
              >
                <a-select-option v-for="item in giftCompanyPersonState.data" :key="item.id" :value="item.id">
                  {{ item.personName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col span="24">
            <a-form-item :label="$t('form.common.upload_person_label')">
              <a-upload
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                :file-list="fileList"
                @change="handleChange"
              >
                <a-button>
                  <upload-outlined></upload-outlined>
                  {{ $t('form.common.upload_file') }}
                </a-button>
              </a-upload>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col span="14">
            <a-form-item v-bind="validateInfos.isGoSoc" :label="$t('page.givingGifts.applyForm.giftRecipientCategory')">
              <a-select v-model:value="applyModelRef.isGoSoc" @change="handleChange">
                <a-select-option value="Government Official">
                  {{ $t('form.common.option_go_sco_Government_Official') }}
                </a-select-option>
                <a-select-option value="Non Government Official">
                  {{ $t('form.common.option_go_sco_Government_Non_Official') }}
                </a-select-option>
                <a-select-option value="HCP">
                  {{ $t('form.common.option_go_sco_HCP') }}
                </a-select-option>
                <a-select-option value="Distributor">
                  {{ $t('form.common.option_go_sco_Distributor') }}
                </a-select-option>
                <a-select-option value="Others">{{ $t('form.common.option_Other') }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col span="10">
            <a-form-item
              v-bind="validateInfos.isBayerCustomer"
              :label="$t('page.givingGifts.applyForm.giftIsBayerCustomer')"
            >
              <a-select v-model:value="applyModelRef.isBayerCustomer" @change="handleChange">
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
          <a-col span="24">
            <a-form-item v-bind="validateInfos.remark" :label="$t('page.givingGifts.applyForm.remark')">
              <a-textarea
                v-model:value="applyModelRef.remark"
                :rows="4"
                :placeholder="$t('page.givingGifts.applyForm.remark_validation')"
                allow-clear
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>

      <a-row :gutter="24">
        <a-col :span="24" style="text-align: right">
          <a-space :size="5">
            <a-button type="primary" html-type="submit" @click.prevent="onSubmitApply('Draft')">
              {{ $t('common.saveDraft') }}
            </a-button>
            <a-button style="margin: 1px" @click="closeApplyDrawerModal">{{ $t('common.cancel') }}</a-button>
            <a-button style="margin: 1px" @click="resetFields">{{ $t('common.reset') }}</a-button>
          </a-space>
        </a-col>
      </a-row>
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
              <a-form-item :label="$t('form.common.reference')">
                <a-input
                  v-model:value="searchFormModelRef.reference"
                  :placeholder="$t('form.common.reference_placeHolder')"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col span="4">
              <a-form-item :label="$t('form.applicateInfo.employeeLe')">
                <a-input
                  v-model:value="searchFormModelRef.companyCode"
                  :placeholder="$t('form.applicateInfo.employeeLe_placeHolder')"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col span="5">
              <a-form-item :label="$t('form.applicateInfo.formFiller')">
                <a-input
                  v-model:value="searchFormModelRef.creator"
                  :placeholder="$t('form.applicateInfo.formFiller_placeHolder')"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col span="5">
              <a-form-item :label="$t('form.applicateInfo.applyFor')">
                <a-input
                  v-model:value="searchFormModelRef.userName"
                  :placeholder="$t('form.applicateInfo.applyFor_placeHolder')"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col span="4">
              <a-form-item label="CWID">
                <a-input v-model:value="searchFormModelRef.cwid"></a-input>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="35">
            <a-col span="5">
              <a-form-item :label="$t('form.searchFrom.applyType')">
                <a-select
                  v-model:value="searchFormModelRef.type"
                  :placeholder="$t('form.common.select_validation')"
                  @change="typeHandleChange($event)"
                >
                  <a-select-option value="draft">{{ $t('form.common.option_draft') }}</a-select-option>
                  <a-select-option value="in-progress">{{ $t('form.common.option_inProcess') }}</a-select-option>
                  <a-select-option value="complete">{{ $t('form.common.option_complete') }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col span="6">
              <a-form-item :label="$t('form.searchFrom.applyStatus')">
                <a-select
                  v-model:value="searchFormModelRef.status"
                  :placeholder="$t('form.common.select_validation')"
                  @change="statusHandleChange($event)"
                >
                  <a-select-option value="rejected">Rejected</a-select-option>
                  <a-select-option value="documented">Documented</a-select-option>
                  <a-select-option value="cancelled">Cancelled</a-select-option>
                  <a-select-option value="approved">Approved</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col span="8">
              <a-form-item :label="$t('form.applicateInfo.applyDate')">
                <a-range-picker v-model:value="searchRangeDate" />
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
        </div>
      </a-form>
    </a-card>

    <a-card :title="$t('common.list')">
      <template #extra>
        <a-button type="link" @click="showApplyDrawerModal('create')">{{ $t('common.newApplyCreate') }}</a-button>
      </template>
      <!--
 <template v-for="(item, index) in columns" v-slot: "item.slotName">
        <span :key="index">{{ $t(item.slotName) }}</span>
      </template>
-->

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
            <a-button type="link">{{ $t('common.viewDetail') }}</a-button>
          </template>

          <template v-if="column.key === 'status'">
            <a-tag :color="record.status === 'Rejected' ? 'volcano' : 'Approved' ? 'geekblue' : 'green'">
              {{ record.status }}
            </a-tag>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<style scoped>
.table_list {
  overflow: hidden;
}

.table_list:hover {
  overflow-x: scroll;
}

.antd-demo-dynamic-option img {
  width: 20px;
  height: 20px;
  margin-right: 0px;
}
</style>
