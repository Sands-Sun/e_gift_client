<script setup lang="ts">
import { $t } from '@/locales';
import {
  fuzzySearchGiftCompanyList,
  fuzzySearchGiftPersonList,
  fuzzySearchUserList,
  getReceivingGiftsByApplicationId,
  saveReceivingGifts
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
import { computed, createVNode, reactive, ref, toRaw, watch } from 'vue';
const authStore = useAuthStore();
const userInfo = authStore.userInfo;
const supervisorInfo = userInfo.supervisor;
const applyReceivingForm = Form.useForm;
const openApplyDrawerModal = ref<boolean>(false);
const showTotalValue = ref(true);
const showReasonDesc = ref(false);
const receivingGiftFormRef = ref();
const applySearch = ref<string>('');
const giftCompanySearch = ref<string>('');
const giftPersonSearch = ref<string>('');
const userState = reactive({ data: [] as any, value: [] as any, ccValue: [] as any, fetching: true });
const giftCompanyState = reactive({ data: [] as any, value: -1, fetching: true });
const giftCompanyPersonState = reactive({ data: [] as any, value: [] as any, fetching: true });
const formApplyRules: Record<string, Rule[]> = {
  applyName: [{ required: true, message: $t('page.receivingGifts.applyForm.giftApplyName_validation') }],
  reason: [{ required: true, message: $t('page.receivingGifts.applyForm.giftDesc_label_validation') }],
  reasonType: [{ required: true, message: $t('page.receivingGifts.applyForm.giftReason_label_validation') }],
  giftDescType: [{ required: true, message: $t('page.receivingGifts.applyForm.giftDesc_label_validation') }],
  date: [{ required: true, message: $t('page.receivingGifts.applyForm.giftReceivingDate_validation') }],
  unitValue: [{ required: true, message: $t('page.receivingGifts.applyForm.unitPrice_validation') }],
  estimatedTotalValue: [{ required: true, message: $t('page.receivingGifts.applyForm.totalPrice_validation') }],
  giftOverallReason: [{ required: true, message: $t('page.receivingGifts.applyForm.giftOverallReason_validation') }],
  volume: [{ required: true, message: $t('page.receivingGifts.applyForm.quantity_validation') }],
  givingCompany: [{ required: true, message: $t('page.receivingGifts.applyForm.giftGiverCompanyName_validation') }],
  givingPersons: [{ required: true, message: $t('page.receivingGifts.applyForm.giftGiverEmployeeName_validation') }],
  givingTitle: [{ required: true, message: $t('page.receivingGifts.applyForm.giftGiverTitle_validation') }],
  isHandedOver: [{ required: true, message: $t('page.receivingGifts.applyForm.giftBayerCoustomer_validation') }]
};

let applyModelRef = reactive({
  applyName: undefined,
  applyCCName: undefined,
  giftOverallReason: undefined,
  reason: '',
  reasonType: '',
  giftDescType: '',
  date: '',
  givingCompany: undefined,
  givingPersons: undefined,
  givingTitle: '',
  unitValue: undefined,
  volume: undefined,
  estimatedTotalValue: 0,
  isHandedOver: '',
  remark: ''
});
const loadGiftCompanyPersonData = debounce(async (keyword: string) => {
  // debugger;
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
      console.log('push new key:', keyword);
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
  // giftCompanyPersonState.data = [];
  console.log('Search:', searchValue);
  loadGiftCompanyPersonData(searchValue);
};

const onGiftCompanySearch = (searchValue: string) => {
  giftCompanySearch.value = searchValue;
  // giftCompanyState.data = [];
  giftCompanyState.fetching = true;
  console.log('Search:', searchValue);
  loadGiftCompanyData(searchValue);
};

const onGiftCompanyChange = (value: any, option: any) => {
  console.log(`selected ${value}`);
  giftCompanyState.value = option['data-item'].id;
};

const ccApplyOptions = computed<SelectProps['options']>(() =>
  userState.data.map((user: any) => ({
    label: `${user.firstName} ${user.lastName} <${user.email}>`,
    value: user.email,
    userId: user.sfUserId
  }))
);

const applyOptions = computed<SelectProps['options']>(() =>
  userState.data.map((user: any) => ({
    label: `${user.firstName} ${user.lastName} <${user.email}>`,
    value: user.email,
    userId: user.sfUserId
  }))
);

const showApplyDrawerModal = async (type: string, applicationId?: string) => {
  console.log('show apply drawer type:', type);
  if (type === 'create') {
    console.log('create...');
    applyOptions.value.unshift({
      label: `${userInfo.firstName} ${userInfo.lastName} <${userInfo.email}>`,
      value: userInfo.email
    });
    applyModelRef.applyName = applyOptions.value[0];
  }
  if (type === 'modify' && applicationId !== '') {
    console.log('modify...');
    const { data, error } = await getReceivingGiftsByApplicationId(applicationId);
    if (!error) {
      applyModelRef = { ...data };

      console.log('success:', data);
    }
  }
  openApplyDrawerModal.value = true;
};

const closeApplyDrawerModal = () => {
  openApplyDrawerModal.value = false;
};

const { resetFields, validate, validateInfos } = applyReceivingForm(applyModelRef, formApplyRules, {
  onValidate: (...args) => console.log(...args)
});

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

const handleChangeOverallReason = (e: any) => {
  console.log('change overll reason', e);
  if (e.target.value === 'No') {
    delete formApplyRules.estimatedTotalValue;
    showTotalValue.value = false;
  } else {
    formApplyRules.estimatedTotalValue = [
      { required: true, message: $t('page.receivingGifts.applyForm.totalPrice_validation') }
    ];
    showTotalValue.value = true;
  }
};

// 根据公司动态移除验证field
const dynamicRemoveRuleRef = computed(() => {
  if (userInfo.companyCode === '0813' || userInfo.companyCode === '1391') {
    delete formApplyRules.givingTitle;
    delete formApplyRules.estimatedTotalValue;
    delete formApplyRules.giftOverallReason;
    delete formApplyRules.reason;
  } else {
    delete formApplyRules.unitValue;
    delete formApplyRules.volume;
    delete formApplyRules.giftDescType;
  }
  return formApplyRules;
});

const onSubmitApply = (value: string) => {
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
          requestParam.actionType = value;
          requestParam.applyForId = requestParam.applyName.option.userId;
          requestParam.copyToUserEmails = requestParam.applyCCName;
          console.log(requestParam);
          const { error } = await saveReceivingGifts(requestParam);
          if (!error) {
            console.log('success!');
            resetFields();
            closeApplyDrawerModal();
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

watch(
  () => [userState.value, giftCompanyState.value, giftCompanyPersonState.value],
  ([newVal1, newVal2, newVal3], [oldVal1, oldVal2, oldVal3]) => {
    console.log('newVal1:', newVal1);
    console.log('newVal2:', newVal2);
    console.log('newVal3:', newVal3);
    console.log('oldVal1:', oldVal1);
    console.log('oldVal2:', oldVal2);
    console.log('oldVal3:', oldVal3);
    userState.data = [];
    userState.fetching = false;
    giftCompanyState.data = [];
    giftCompanyState.fetching = false;
    giftCompanyPersonState.data = [];
    giftCompanyPersonState.fetching = false;
  }
);

const expand = ref(true);
const formRef = ref<FormInstance>();
const formState = reactive({});
const value1 = ref();
const value2 = ref();
const dateValue = ref<[Dayjs, Dayjs]>();

const columns: TableColumnsType = [
  { title: '申请者', width: 100, dataIndex: 'apply', key: 'apply', fixed: 'left' },
  { title: '申请日期', width: 100, dataIndex: 'date', key: 'date', fixed: 'left' },
  { title: 'CWID', dataIndex: 'cwid', key: '1', width: 100 },
  { title: '部门', dataIndex: 'dept', key: '2', width: 150 },
  { title: '公司编号', dataIndex: 'leCode', key: '3', width: 150 },
  { title: '申请类型', dataIndex: 'type', key: '4', width: 150 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 150 },
  {
    title: '操作',
    key: 'operation',
    fixed: 'right',
    width: 100
  }
];

interface DataItem {
  applicationId: string;
  apply: string;
  date: string;
  cwid: string;
  dept: string;
  leCode: string;
  type: string;
  status: string;
}

const data: DataItem[] = [];
for (let i = 0; i < 10; i++) {
  data.push({
    applicationId: '2240',
    apply: 'Bing Wang',
    date: '2023-04-12',
    cwid: 'CSWNB',
    dept: `Regulatory Science Greater China. ${i}`,
    leCode: '1391',
    type: 'Draft',
    status: 'Completed'
  });
}

for (let i = 0; i < 10; i++) {
  data.push({
    applicationId: '2240',
    apply: 'Suqin Yang',
    date: '2023-03-12',
    cwid: 'CSWNB',
    dept: `Herbicide Product Development Managemt. ${i}`,
    leCode: '0882',
    type: 'Submit',
    status: 'Approved'
  });
}

for (let i = 0; i < 10; i++) {
  data.push({
    applicationId: '2240',
    apply: 'Mabel Tian',
    date: '2022-03-12',
    cwid: 'CHTMB',
    dept: `Branding & Marketing Excellence Manager. ${i}`,
    leCode: '0813',
    type: 'Submit',
    status: 'Rejected'
  });
}

const onFinish = (values: any) => {
  console.log('Received values of form: ', values);
  console.log('formState: ', formState);
};

const focus = () => {
  console.log('focus');
};

const disabledDate = (current: Dayjs) => {
  // Can not select days before today and today
  return current && current < dayjs().endOf('day');
};

// const provide_date = ref<Dayjs>();
</script>

<template>
  <div>
    <a-drawer title="接受礼品申请" width="75%" size="large" :open="openApplyDrawerModal" @close="closeApplyDrawerModal">
      <a-descriptions title="申请人信息">
        <a-descriptions-item label="填表人">{{ userInfo.firstName }} {{ userInfo.lastName }}</a-descriptions-item>
        <a-descriptions-item label="员工号">{{ userInfo.employeeId }}</a-descriptions-item>
        <a-descriptions-item label="部门">{{ userInfo.orgTxt }}</a-descriptions-item>
        <a-descriptions-item label="主管">
          {{ supervisorInfo.firstName }} {{ supervisorInfo.lastName }}
        </a-descriptions-item>
        <a-descriptions-item label="成本中心">{{ userInfo.costCenter }}</a-descriptions-item>
        <a-descriptions-item label="DIVISION">{{ userInfo.division }}</a-descriptions-item>
      </a-descriptions>

      <a-form ref="receivingGiftFormRef" v-bind="dynamicRemoveRuleRef">
        <a-row :gutter="24">
          <a-col span="10">
            <a-form-item v-bind="validateInfos.applyName" label="申请人">
              <a-select
                v-model:value="applyModelRef.applyName"
                placeholder="请选择"
                show-search
                label-in-value
                :allow-clear="true"
                :not-found-content="userState.fetching ? null : undefined"
                :options="applyOptions"
                @search="onApplySearch"
              >
                <!--
  <a-select-option
                  v-for="item in userState.data"
                  :key="item.email"
                  :value="item.email"
                >
                  {{ item.firstName }} {{ item.lastName }} &lt;{{ item.email }}&lg;
                </a-select-option>
  -->
              </a-select>
            </a-form-item>
          </a-col>
          <a-col span="14">
            <a-form-item label="抄送">
              <a-select
                v-model:value="applyModelRef.applyCCName"
                mode="multiple"
                :default-active-first-option="false"
                :allow-clear="true"
                :not-found-content="userState.fetching ? null : undefined"
                :filter-option="false"
                placeholder="请选择"
                :options="ccApplyOptions"
                @search="onApplySearch"
              >
                <!--
  <a-select-option
                  v-for="item in userState.data"
                  :key="item.email"
                  :value="item.email"
                >
                  {{ item.firstName }} {{ item.lastName }} &lt;{{ item.email }}&lg;
                </a-select-option>
  -->
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <!--政策提示内容-->
      <a-descriptions :title="$t('page.receivingGifts.policy.title')" layout="vertical">
        <a-descriptions-item
          v-for="(item, index) in $tm(`page.receivingGifts.policy.desc_${userInfo.companyCode}`)"
          :key="index"
          :span="3"
          :label="item.label"
        >
          <ul>
            <li v-for="detail in item.items" :key="detail">
              - {{ detail.value }}
              <template v-if="detail.items.length > 0">
                <li v-for="(subDetail, subIndex) in detail.items" :key="subDetail">
                  &nbsp; &nbsp; {{ subIndex + 1 }} ) {{ subDetail.value }}
                </li>
              </template>
            </li>
          </ul>
        </a-descriptions-item>
      </a-descriptions>
      <a-form>
        <template v-if="userInfo.companyCode === '0813' || userInfo.companyCode === '1391'">
          <!--0813 AND 1391 显示下拉列表-->
          <a-row :gutter="24">
            <a-col span="12">
              <a-form-item
                :label="$t(`page.receivingGifts.applyForm.giftReason_label_${userInfo.companyCode}`)"
                v-bind="validateInfos.reasonType"
              >
                <a-select v-model:value="applyModelRef.reasonType" @change="handleChangeReasonType">
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
          <!--0882 AND 1954 AND 1955 显示输入框-->
          <a-row :gutter="24">
            <a-col span="24">
              <a-form-item
                :label="$t(`page.receivingGifts.applyForm.giftReason_label_${userInfo.companyCode}`)"
                v-bind="validateInfos.reasonType"
              >
                <a-input
                  v-model:value="applyModelRef.reasonType"
                  :placeholder="$t('page.receivingGifts.applyForm.giftReason_label_validation')"
                ></a-input>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
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

        <!--0813 AND 1391 需要输入单价和总价-->
        <template v-if="userInfo.companyCode === '0813' || userInfo.companyCode === '1391'">
          <a-row :gutter="24">
            <a-col span="6">
              <a-form-item :label="$t('page.receivingGifts.applyForm.giftReceivingDate')" v-bind="validateInfos.date">
                <a-date-picker v-model:value="applyModelRef.date" style="width: 140px" />
              </a-form-item>
            </a-col>
            <a-col span="7">
              <a-form-item :label="$t('page.receivingGifts.applyForm.unitPrice')" v-bind="validateInfos.unitValue">
                <a-input-number
                  v-model:value="applyModelRef.unitValue"
                  addon-before="￥"
                  style="width: 195px"
                  :placeholder="$t('page.receivingGifts.applyForm.unitPrice_validation')"
                  :step="0.1"
                ></a-input-number>
              </a-form-item>
            </a-col>
            <a-col span="4">
              <a-form-item :label="$t('page.receivingGifts.applyForm.quantity')" v-bind="validateInfos.volume">
                <a-input-number
                  v-model:value="applyModelRef.volume"
                  :placeholder="$t('page.receivingGifts.applyForm.quantity_validation')"
                  :min="1"
                ></a-input-number>
              </a-form-item>
            </a-col>
            <a-col span="6">
              <a-form-item :label="$t('page.receivingGifts.applyForm.totalPrice')">
                <a-input-number
                  :value="applyModelRef.unitValue * applyModelRef.volume"
                  addon-before="￥"
                  style="width: 195px"
                  disabled="true"
                ></a-input-number>
              </a-form-item>
            </a-col>
          </a-row>
        </template>
        <template v-else>
          <a-row :gutter="24">
            <a-col span="6">
              <a-form-item
                :label="$t('page.receivingGifts.applyForm.giftReceivingDate')"
                v-bind="validateInfos.givingDate"
              >
                <a-date-picker v-model:value="applyModelRef.date" />
              </a-form-item>
            </a-col>
            <a-col span="11">
              <a-form-item
                :label="$t('page.receivingGifts.applyForm.giftOverallReason')"
                v-bind="validateInfos.giftOverallReason"
              >
                <a-radio-group
                  v-model:value="applyModelRef.giftOverallReason"
                  name="overallReasonradioGroup"
                  @change="handleChangeOverallReason"
                >
                  <a-radio value="Yes">{{ $t('form.common.option_yes') }}</a-radio>
                  <a-radio value="No">{{ $t('form.common.option_no') }}</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col span="7">
              <a-form-item
                v-show="showTotalValue"
                :label="$t('page.receivingGifts.applyForm.giftOverallPrice')"
                v-bind="validateInfos.estimatedTotalValue"
              >
                <a-input
                  v-model:value="applyModelRef.estimatedTotalValue"
                  :placeholder="$t('page.receivingGifts.applyForm.giftOverallPrice_validation')"
                ></a-input>
              </a-form-item>
            </a-col>
          </a-row>
        </template>

        <a-row :gutter="24">
          <a-col span="24">
            <a-form-item
              :label="$t('page.receivingGifts.applyForm.giftGiverCompanyName')"
              v-bind="validateInfos.givingCompany"
            >
              <a-select
                v-model:value="applyModelRef.givingCompany"
                placeholder="请选择"
                show-search
                :allow-clear="true"
                :not-found-content="giftCompanyState.fetching ? null : undefined"
                :default-active-first-option="false"
                :filter-option="false"
                @search="onGiftCompanySearch"
                @change="onGiftCompanyChange"
              >
                <a-select-option
                  v-for="item in giftCompanyState.data"
                  :key="item.companyName"
                  :data-item="item"
                  :value="item.companyName"
                >
                  {{ item.companyName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col span="24">
            <a-form-item
              :label="$t('page.receivingGifts.applyForm.giftGiverEmployeeName')"
              v-bind="validateInfos.givingPersons"
            >
              <a-select
                v-model:value="applyModelRef.givingPersons"
                mode="multiple"
                :default-active-first-option="false"
                :allow-clear="true"
                :not-found-content="giftCompanyPersonState.fetching ? null : undefined"
                :filter-option="false"
                placeholder="请选择"
                @search="ongGiftPersonSearch"
              >
                <a-select-option
                  v-for="item in giftCompanyPersonState.data"
                  :key="item.personName"
                  :value="item.personName"
                >
                  {{ item.personName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <template v-if="userInfo.companyCode === '0813' || userInfo.companyCode === '1391'">
          <a-row :gutter="24">
            <a-col span="24">
              <a-form-item
                v-bind="validateInfos.isHandedOver"
                :label="$t(`page.receivingGifts.applyForm.giftBayerCoustomer_label_${userInfo.companyCode}`)"
              >
                <a-select v-model:value="applyModelRef.isHandedOver">
                  <a-select-option value="Y">{{ $t('form.common.option_yes') }}</a-select-option>
                  <a-select-option value="N">{{ $t('form.common.option_no') }}</a-select-option>
                  <a-select-option value="NA">{{ $t('form.common.option_not_Applicable') }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <!--0882 AND 1954 AND 1955 显示提供者职位-->
        </template>

        <template v-else>
          <a-row :gutter="24">
            <a-col span="12">
              <a-form-item
                v-bind="validateInfos.givingTitle"
                :label="$t('page.receivingGifts.applyForm.giftGiverTitle')"
              >
                <a-input
                  v-model:value="applyModelRef.givingTitle"
                  :placeholder="$t('page.receivingGifts.applyForm.giftGiverTitle_validation')"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col span="12">
              <a-form-item
                v-bind="validateInfos.isHandedOver"
                :label="$t(`page.receivingGifts.applyForm.giftBayerCoustomer_label_${userInfo.companyCode}`)"
              >
                <a-select ref="select" v-model:value="applyModelRef.isHandedOver" @focus="focus">
                  <a-select-option value="Y">{{ $t('form.common.option_yes') }}</a-select-option>
                  <a-select-option value="N">{{ $t('form.common.option_no') }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </template>
        <a-row :gutter="24">
          <a-col span="24">
            <a-form-item :label="$t('page.receivingGifts.applyForm.remark')">
              <a-textarea
                v-model:value="applyModelRef.remark"
                :rows="4"
                :placeholder="$t('page.receivingGifts.applyForm.remark_validation')"
                allow-clear
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>

      <a-row :gutter="24">
        <a-col :span="24" style="text-align: right">
          <a-space :size="5">
            <a-button type="primary" html-type="submit" @click.prevent="onSubmitApply('Draft')">提交</a-button>
            <a-button style="margin: 1px">取消</a-button>
            <a-button style="margin: 1px" @click="resetFields">重置</a-button>
          </a-space>
        </a-col>
      </a-row>
    </a-drawer>

    <a-card title="搜索">
      <template #extra>
        <a-button type="link" @click="expand = !expand">
          <template v-if="expand">收叠</template>
          <template v-else>展开</template>
        </a-button>
      </template>
      <a-form
        ref="formRef"
        name="advanced_search"
        class="ant-advanced-search-form"
        :model="formState"
        @finish="onFinish"
      >
        <div v-show="expand">
          <a-row :gutter="8">
            <a-col span="6">
              <a-form-item label="申请编号">
                <a-input placeholder="请输入申请编号..."></a-input>
              </a-form-item>
            </a-col>
            <a-col span="4">
              <a-form-item label="公司编号">
                <a-input placeholder="公司编号..."></a-input>
              </a-form-item>
            </a-col>
            <a-col span="5">
              <a-form-item label="制表者">
                <a-input placeholder="请输入制表者..."></a-input>
              </a-form-item>
            </a-col>
            <a-col span="5">
              <a-form-item label="申请者">
                <a-input placeholder="请输入申请者..."></a-input>
              </a-form-item>
            </a-col>
            <a-col span="4">
              <a-form-item label="CWID">
                <a-input placeholder="请输入CWID..."></a-input>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="35">
            <a-col span="4">
              <a-form-item label="类型">
                <a-select v-model:value="value1" @focus="focus">
                  <a-select-option value="draft">草稿</a-select-option>
                  <a-select-option value="complete">完成</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col span="5">
              <a-form-item label="状态">
                <a-select v-model:value="value2" @focus="focus">
                  <a-select-option value="documented">Documented</a-select-option>
                  <a-select-option value="cancelled">Cancelled</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col span="10">
              <a-form-item label="申请日期">
                <a-range-picker v-model:value="dateValue" :disabled-date="disabledDate" />
              </a-form-item>
            </a-col>
            <a-col :span="5" style="text-align: right">
              <a-space :size="5">
                <a-button type="primary" html-type="submit">搜索</a-button>
                <a-button style="margin: 1px" @click="() => formRef.resetFields()">清除</a-button>
              </a-space>
            </a-col>
          </a-row>
        </div>
        <!--
 <a-row :gutter="24">
          <a-col :span="24" style="text-align: right">
            <a style="font-size: 12px" @click="expand = !expand">
              <template v-if="expand">收叠</template>
              <template v-else>展开</template>
            </a>
          </a-col>
        </a-row>
-->
      </a-form>
    </a-card>

    <a-card title="列表">
      <template #extra><a-button type="link" @click="showApplyDrawerModal('create')">新建申请</a-button></template>
      <a-table :columns="columns" :data-source="data" :scroll="{ x: 1500 }" class="table-list">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'operation'">
            <a-button type="link" @click="showApplyDrawerModal('modify', record.applicationId)">查看详细信息</a-button>
          </template>

          <template v-else-if="column.key === 'status'">
            <span>
              <a-tag
                :color="record.status === 'Rejected' ? 'volcano' : record.status === 'Approved' ? 'geekblue' : 'green'"
              >
                {{ record.status.toUpperCase() }}
              </a-tag>
            </span>
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
:deep() .ant-form-item-required {
  text-align: left;
  word-break: break-all;
  white-space: pre-wrap;
  height: auto;
  line-height: 20px;
  vertical-align: bottom;
}
</style>
