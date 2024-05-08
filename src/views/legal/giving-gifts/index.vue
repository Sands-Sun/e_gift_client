<script setup lang="ts">
import { $t } from '@/locales';
import {
  cancelGivingGifts,
  deleteDraftGivingGifts,
  fetchGivingGiftsList,
  fuzzySearchUserList,
  getGivingGiftsByApplicationId,
  saveGivingGifts,
  updateGivingGifts
} from '@/service/api';
import { useAuthStore } from '@/store/modules/auth';
import { getServiceBaseURL } from '@/utils/service';
import type { SelectProps } from '@ant-design/icons-vue';
import {
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  UploadOutlined
} from '@ant-design/icons-vue';
import type { FormInstance, TableColumnsType, UploadChangeParam, UploadProps } from 'ant-design-vue';
import { Modal, Upload, message } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { debounce } from 'lodash-es';
import { computed, createVNode, h, onMounted, reactive, ref, toRaw, watch } from 'vue';
let authStore: any;
let userInfo: Api.Auth.UserInfo;
let supervisorInfo: Api.Auth.UserInfo;
const givingCancelFormRef = ref();
const openCancelModal = ref<boolean>(false);
const uploadFileList = ref([] as any);
const openApplyDrawerModal = ref<boolean>(false);
const expandSearchFields = ref(true);
const listTableLoading = ref(true);
const showReasonDesc = ref(false);
const showAddPersonModal = ref<boolean>(false);
const givingGiftFromStatus = reactive({ disableStatus: false, descTypeHistory: false, actionStatus: '' });
const listDataSource = ref([] as any);
const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'N';
const { baseURL } = getServiceBaseURL(import.meta.env, isHttpProxy);
const givingGiftFormRef = ref<FormInstance>();
const addPersonModalFormRef = ref<FormInstance>();
const searchRangeDate = ref<[Dayjs, Dayjs]>();
const applySearch = ref<string>('');
const userState = reactive({ data: [] as any, value: [] as any, ccValue: [] as any, fetching: true });
const giftCompanyPersonState = reactive({ data: [] as any, value: [] as any });
const applyFormCancelModelRef = reactive({ remark: undefined, applicationId: '' });
let currentCompanyState = reactive<{
  companyName: string;
  personList: Api.Gifts.GiftPerson[];
  key: number;
}>({
  companyName: '',
  personList: [],
  key: 0
});

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
    key: 'SF_USER_APPLIED_NAME',
    fixed: 'left'
  },
  {
    title: 'form.applicateInfo.applyDate',
    sorter: true,
    width: 100,
    dataIndex: 'givenDate',
    key: 'GIVEN_DATE',
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

const applyFormCancelRules: Record<string, Rule[]> = reactive({
  remark: [{ required: true, message: $t('form.common.cancelReson') }]
});

const applyModelRef = reactive<{
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
  isGoSoc: string;
  isBayerCustomer: string;
  unitValue: number;
  volume: number;
  remark: string;
  fileId: unknown;
}>({
  actionType: '',
  applicationId: '',
  reference: '',
  applyName: undefined as any,
  applyForId: undefined as any,
  copyToUserEmails: [] as any,
  applyCCName: undefined as any,
  reason: '',
  reasonType: '',
  giftDescType: '',
  giftDesc: '',
  date: dayjs(),
  companyList: [],
  giftsActivities: [] as any,
  isGoSoc: '',
  isBayerCustomer: '',
  // givingTitle: '',
  unitValue: undefined as any,
  volume: undefined as any,
  remark: '',
  fileId: undefined
});

const disabledAfterCurrentDate = (current: Dayjs) => {
  // Can not select days after today and today
  return current && current > dayjs().endOf('day');
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

// 选择 Other 移除验证
const handleChangeReasonType = (value: any) => {
  console.log('change reason', value);
  if (value === 'Other') {
    applyModelRef.reason = '';
    showReasonDesc.value = true;
  } else {
    applyModelRef.reason = 'NA';
    showReasonDesc.value = false;
  }
};

const handleChangeGiftDesc = (value: any) => {
  console.log('change gift desc', value);
  if (value === 'Medicine Gift') {
    Modal.info({
      title: '赠送药品提示',
      content: h('div', {}, [h('p', '任何药品作为礼品赠送需特批 （禁止赠送处方药和甲类非处方药）')]),
      onOk() {
        console.log('ok');
      }
    });
  }
};

const handleUploadChange = ({ file, fileList }: UploadChangeParam) => {
  if (file.status === 'done') {
    message.success(`${file.name} file uploaded successfully`);
    applyModelRef.fileId = fileList[0].response?.data?.id;
    fileList.forEach(f => {
      f.url = `${baseURL}/sys/download/file?fileId=${applyModelRef.fileId}`;
    });
  } else if (file.status === 'error') {
    message.error(`${file.name} file upload failed.`);
  }
};
const beforeUpload: UploadProps['beforeUpload'] = file => {
  const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  if (!isExcel) {
    message.error(`${file.name} is not a xlsx file`);
  }
  return isExcel || Upload.LIST_IGNORE;
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
  applyModelRef.reason = '';
  applyModelRef.reasonType = '';
  applyModelRef.giftDescType = '';
  applyModelRef.date = dayjs();
  applyModelRef.companyList = [];
  applyModelRef.giftsActivities = [];
  applyModelRef.unitValue = undefined;
  applyModelRef.volume = undefined;
  applyModelRef.remark = '';
};

const resetFromFields = (updateStatus = false) => {
  givingGiftFormRef?.value?.resetFields();
  addPersonModalFormRef?.value?.resetFields();
  clearApplyModel();

  if (!updateStatus && applyModelRef.companyList.length === 0) {
    applyModelRef.companyList.push({
      id: -1,
      companyName: '',
      description: '',
      key: Date.now(),
      personList: [{ id: -1, personName: '', positionTitle: '', companyId: -1, description: '', key: Date.now() }]
    });
  }
};

const showApplyDrawerModal = async (type: string, item?: any) => {
  resetFromFields(type === 'Modify');
  console.log(`type: ${type}item: `, item);
  givingGiftFromStatus.actionStatus = type;
  console.log('show apply drawer type:', type);
  if (type === 'Create') {
    console.log('create...');
    applyOptions.value.unshift({
      label: `${userInfo.firstName} ${userInfo.lastName} <${userInfo.email}>`,
      value: userInfo.email
    });
    applyModelRef.applyName = applyOptions.value[0];
  }
  if (type === 'Modify' && item && item.applicationId) {
    item.loading = true;
    console.log('item: {}', item);
    const { data, error } = await getGivingGiftsByApplicationId(item.applicationId);
    if (!error) {
      givingGiftFromStatus.actionStatus = data.status;
      applyModelRef.applicationId = data.applicationId;
      applyModelRef.actionType = data.status;
      applyModelRef.reference = data.reference;
      applyOptions.value.unshift({
        label: `${data.sfUserAppliedName} <${data.sfUserAppliedEmail}>`,
        value: data.sfUserAppliedEmail,
        userId: data.sfUserIdAppliedFor
      });
      applyModelRef.applyName = applyOptions.value[0];
      if (data.copyToUsers) {
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
      applyModelRef.unitValue = data.giftsRef.unitValue;
      applyModelRef.volume = data.giftsRef.volume;
      // applyModelRef.givenCompany = data.giftsRef.givenCompany;
      // applyModelRef.givenPersons = data.giftsRef.givingPerson;
      // giftCompanyPersonState.data = data.giftsRef.giftsPersons.map((v: any) => v.personName);
      // applyModelRef.givenPersons = giftCompanyPersonState.data;
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
            description: p.description,
            key: Date.now()
          };
          company.personList.push(person);
        });
        applyModelRef.companyList.push(company);
      });

      applyModelRef.isBayerCustomer = data.giftsRef.isBayerCustomer;
      applyModelRef.reasonType = data.reasonType;
      handleChangeReasonType(applyModelRef.reasonType);
      applyModelRef.reason = data.reason;
      applyModelRef.giftDescType = data.giftsRef.giftDescType;
      applyModelRef.isGoSoc = data.giftsRef.isGoSoc;
      // applyModelRef.isHandedOver = data.isHandedOver;
      applyModelRef.remark = data.remark;
      //  hadle history reocrd

      console.log('success:', data);

      if (data.status !== 'Draft') {
        applyModelRef.giftsActivities = data.giftsActivities;
        givingGiftFromStatus.disableStatus = true;
      }
    }
    item.loading = false;
  }
  openApplyDrawerModal.value = true;
};

const closeApplyDrawerModal = () => {
  openApplyDrawerModal.value = false;
  uploadFileList.value.length = 0;
  givingGiftFromStatus.disableStatus = false;
  givingGiftFromStatus.descTypeHistory = false;
  ccApplyOptions.value.length = 0;
  giftCompanyPersonState.data = [];
  userState.data = [];
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

const showCancelModal = () => {
  openCancelModal.value = true;
};

const closeCancelModal = () => {
  openCancelModal.value = false;
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

const onSubmitCancel = () => {
  givingCancelFormRef.value
    .validate()
    .then(() => {
      Modal.confirm({
        title: $t('common.tip'),
        icon: createVNode(ExclamationCircleOutlined),
        content: $t('common.confirmCancel'),
        okText: $t('common.confirm'),
        cancelText: $t('common.cancel'),
        async onOk() {
          const requestParam = toRaw(applyFormCancelModelRef);
          requestParam.applicationId = applyModelRef.applicationId;
          console.log(requestParam);
          const { error } = await cancelGivingGifts(requestParam);
          if (!error) {
            console.log('success!');
            givingCancelFormRef.value?.resetFields();
            closeCancelModal();
            // closeApplyDrawerModal();
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

// 修改提交
const onModifyApply = (value: string) => {
  givingGiftFormRef?.value
    ?.validate()
    .then(() => {
      let confirmContent = '';
      if (value === 'Draft') {
        console.log('update draft...');
        confirmContent = `${$t('common.confirm')} ${$t('common.saveDraft')} ?`;
      } else if (value === 'Submit') {
        console.log('modify submit...');
        confirmContent = `${$t('common.confirm')} ${$t('common.submit')} ?`;
      } else if (value === 'Delete') {
        console.log('modify delete draft...');
        confirmContent = `${$t('common.confirm')} ${$t('common.delete')} ?`;
      }

      Modal.confirm({
        title: $t('common.tip'),
        icon: createVNode(ExclamationCircleOutlined),
        content: confirmContent,
        okText: $t('common.confirm'),
        cancelText: $t('common.cancel'),
        async onOk() {
          const requestParam = toRaw(applyModelRef);
          requestParam.actionType = value;
          requestParam.applyForId = requestParam.applyName.userId;
          requestParam.copyToUserEmails = requestParam.applyCCName;
          console.log(requestParam);
          if (value === 'Draft' || value === 'Submit') {
            console.log('update draft...');
            await updateGivingGifts(requestParam);
          } else if (value === 'Delete') {
            console.log('modify delete draft...');
            await deleteDraftGivingGifts(requestParam.applicationId);
          }
          resetFromFields();
          closeApplyDrawerModal();
          getListDataByCondition();
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

const onSubmitApply = (value: string) => {
  let confirmContent = '';
  if (value === 'Draft') {
    console.log('update draft...');
    confirmContent = `${$t('common.confirm')} ${$t('common.saveDraft')} ?`;
  } else if (value === 'Submit') {
    console.log('modify submit...');
    confirmContent = `${$t('common.confirm')} ${$t('common.submit')} ?`;
  }
  console.log(`submit type ${value}`);
  const personArr = [];
  applyModelRef.companyList.forEach(c => {
    c.personList.forEach(p => {
      personArr.push(p);
    });
  });
  if (!applyModelRef.fileId && applyModelRef.volume !== personArr.length) {
    Modal.warning({
      title: '人员与数量不符',
      content: h('div', {}, [h('p', `提供人员：${personArr.length}`), h('p', `数量：${applyModelRef.volume}`)]),
      onOk() {
        console.log('ok');
      }
    });
    return;
  }

  givingGiftFormRef?.value
    ?.validate()
    .then(() => {
      Modal.confirm({
        title: $t('common.tip'),
        icon: createVNode(ExclamationCircleOutlined),
        content: confirmContent,
        okText: $t('common.confirm'),
        cancelText: $t('common.cancel'),
        async onOk() {
          debugger;
          const requestParam = toRaw(applyModelRef);
          requestParam.actionType = value;
          requestParam.applyForId = requestParam.applyName.userId;
          requestParam.copyToUserEmails = requestParam.applyCCName;
          console.log(requestParam);
          const { error } = await saveGivingGifts(requestParam);
          if (!error) {
            console.log('success!');
            resetFromFields();
            closeApplyDrawerModal();
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

const onFinishSearch = (values: any) => {
  console.log('Received values of form: ', values);
  console.log('searchFormModelRef: ', searchFormModelRef);
};

// 根据公司动态移除验证field
// const dynamicRemoveRuleRef = computed(() => {
//   if (userInfo.companyCode === '0882' || userInfo.companyCode === '1954' ||
//    userInfo.companyCode === '1955') {
//     delete formApplyRules.reason;
//   }
//   return formApplyRules;
// });

// 重置search表单
const resetSearchForm = () => {
  searchRangeDate.value = undefined;
  searchFormModelRef.beginDate = '';
  searchFormModelRef.endDate = '';
  searchFormRef?.value?.resetFields();
};

const removeCompany = (item: Api.Gifts.GiftCompany) => {
  if (givingGiftFromStatus.disableStatus) {
    return;
  }
  const index = applyModelRef.companyList.indexOf(item);
  if (index !== -1) {
    applyModelRef.companyList.splice(index, 1);
  }
};

const addCompany = () => {
  if (givingGiftFromStatus.disableStatus) {
    return;
  }
  applyModelRef.companyList.push({
    id: -1,
    description: '',
    companyName: '',
    key: Date.now(),
    personList: [{ id: -1, personName: '', positionTitle: '', description: '', companyId: -1, key: Date.now() }]
  });
};

const openAddPersonModal = (item: Api.Gifts.GiftCompany) => {
  currentCompanyState = item;
  showAddPersonModal.value = true;
};

const removePerson = (person: Api.Gifts.GiftPerson) => {
  if (givingGiftFromStatus.disableStatus) {
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
  if (givingGiftFromStatus.disableStatus) {
    return;
  }
  currentCompanyState.personList.push({
    id: -1,
    personName: '',
    positionTitle: '',
    description: '',
    companyId: -1,
    key: Date.now()
  });
};

const onSubmitAddPerson = () => {
  addPersonModalFormRef?.value?.validateFields().then(() => {
    showAddPersonModal.value = false;
  });
};

// 重置申请列表
const resetApplyFrom = () => {
  Modal.confirm({
    title: $t('common.tip'),
    icon: createVNode(ExclamationCircleOutlined),
    content: `${$t('common.confirm')} ${$t('common.reset')} ?`,
    okText: $t('common.confirm'),
    cancelText: $t('common.cancel'),
    async onOk() {
      resetFromFields();
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onCancel() {
      console.log('cancel');
    }
  });
};

const handleChange = (value: any) => {
  console.log(`selected ${value}`);
};
const typeHandleChange = (value: any) => {
  console.log(`value: ${value}`);
  searchFormModelRef.type = value;
};

onMounted(async () => {
  authStore = useAuthStore();
  userInfo = authStore.userInfo;
  supervisorInfo = userInfo.supervisor;
  console.log(`companycode:${userInfo.companyCode}`);
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
  () => [userState.value, giftCompanyPersonState.value],
  ([newVal1, newVal3], [oldVal1, oldVal3]) => {
    console.log('newVal1:', newVal1);
    console.log('oldVal1:', oldVal1);
    console.log('newVal3:', newVal3);
    console.log('oldVal3:', oldVal3);
    userState.data = [];
    userState.fetching = false;
    giftCompanyPersonState.data = [];
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

      <a-form ref="givingGiftFormRef" :model="applyModelRef" :disabled="givingGiftFromStatus.disableStatus">
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
              <a-form-item
                :label="$t('page.givingGifts.applyForm.giftReason_label')"
                name="reasonType"
                :rules="[
                  {
                    required: true,
                    message: $t('page.givingGifts.applyForm.giftReason_label_validation')
                  }
                ]"
              >
                <a-select
                  v-model:value="applyModelRef.reasonType"
                  :dropdown-match-select-width="false"
                  @change="handleChangeReasonType"
                >
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
            <template v-if="userInfo.companyCode === '0813'">
              <a-col span="12">
                <a-form-item
                  :label="$t('page.givingGifts.applyForm.giftDesc_type_label')"
                  name="giftDescType"
                  :rules="[
                    {
                      required: true,
                      message: $t('page.givingGifts.applyForm.giftDesc_label_validation')
                    }
                  ]"
                >
                  <a-select v-model:value="applyModelRef.giftDescType" @change="handleChangeGiftDesc">
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
            <template v-else-if="userInfo.companyCode === '1391' || userInfo.companyCode === '2614'">
              <a-col span="12">
                <a-form-item
                  :label="$t('page.givingGifts.applyForm.giftDesc_type_label')"
                  name="giftDescType"
                  :rules="[
                    {
                      required: true,
                      message: $t('page.givingGifts.applyForm.giftDesc_label_validation')
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
                :label="$t('page.givingGifts.applyForm.giftDesc_label')"
                name="reason"
                :rules="[
                  {
                    required: true,
                    message: $t('page.givingGifts.applyForm.giftDesc_label_validation')
                  }
                ]"
              >
                <a-input
                  v-model:value="applyModelRef.reason"
                  :placeholder="$t('page.givingGifts.applyForm.giftDesc_label_validation')"
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
                <a-form-item
                  name="giftDescType"
                  :label="$t('page.givingGifts.applyForm.giftDesc_label')"
                  :rules="[
                    {
                      required: true,
                      message: $t('page.givingGifts.applyForm.giftDesc_label_validation')
                    }
                  ]"
                >
                  <a-select v-model:value="applyModelRef.giftDescType" @change="handleChange">
                    <a-select-option
                      value="Promotional Supplies Gifts"
                      :title="$t('form.common.option_giftDesc_HCP_Promotional_Supplies')"
                    >
                      {{ $t('form.common.option_giftDesc_HCP_Promotional_Supplies') }}
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
                <a-form-item
                  :label="$t('page.givingGifts.applyForm.giftDesc_label')"
                  name="giftDesc"
                  :rules="[
                    {
                      required: true,
                      message: $t('page.givingGifts.applyForm.giftDesc_label_validation')
                    }
                  ]"
                >
                  <a-input
                    v-model:value="applyModelRef.giftDesc"
                    :placeholder="$t('page.givingGifts.applyForm.giftDesc_label_validation')"
                  ></a-input>
                </a-form-item>
              </a-col>
            </template>
          </a-row>
        </template>
        <a-row :gutter="24">
          <!--1391 2614 只显示 政府官员/非政府官员-->
          <template v-if="userInfo.companyCode === '1391' || userInfo.companyCode === '2614'">
            <a-col span="14">
              <a-form-item
                :label="$t('page.givingGifts.applyForm.giftRecipientCategory')"
                name="isGoSoc"
                :rules="[
                  {
                    required: true,
                    message: $t('form.common.select_validation')
                  }
                ]"
              >
                <a-select v-model:value="applyModelRef.isGoSoc" @change="handleChange">
                  <a-select-option value="Yes">
                    {{ $t('form.common.option_go_sco_Government_Official') }}
                  </a-select-option>
                  <a-select-option value="No">
                    {{ $t('form.common.option_go_sco_Government_Non_Official') }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </template>
          <template v-else>
            <a-col span="14">
              <a-form-item
                :label="$t('page.givingGifts.applyForm.giftRecipientCategory')"
                name="isGoSoc"
                :rules="[
                  {
                    required: true,
                    message: $t('form.common.select_validation')
                  }
                ]"
              >
                <a-select v-model:value="applyModelRef.isGoSoc" @change="handleChange">
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
                  <!--
 <a-select-option value="Others">
                    {{ $t('form.common.option_Other') }}
                  </a-select-option>
-->
                </a-select>
              </a-form-item>
            </a-col>
          </template>
          <a-col span="10">
            <a-form-item
              name="isBayerCustomer"
              :label="$t('page.givingGifts.applyForm.giftIsBayerCustomer')"
              :rules="[
                {
                  required: true,
                  message: $t('form.common.select_validation')
                }
              ]"
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
          <a-col span="7">
            <a-form-item
              name="date"
              :label="$t('page.givingGifts.applyForm.giftGivingDate')"
              v-bind="{
                rules: [
                  {
                    required: true,
                    message: $t('page.givingGifts.applyForm.giftGivingDate_validation')
                  }
                ]
              }"
            >
              <a-date-picker
                v-model:value="applyModelRef.date"
                :disabled-date="disabledAfterCurrentDate"
                value-format="YYYY-MM-DD"
              />
            </a-form-item>
          </a-col>
          <a-col span="5">
            <a-form-item
              name="unitValue"
              :label="$t('form.common.unitPrice')"
              :rules="[{ required: true, message: $t('form.common.unitPrice_validation') }]"
            >
              <a-input-number
                v-model:value="applyModelRef.unitValue"
                :placeholder="$t('form.common.unitPrice_validation')"
                :step="0.01"
              ></a-input-number>
            </a-form-item>
          </a-col>
          <a-col span="5">
            <a-form-item
              name="volume"
              :label="$t('form.common.quantity')"
              :rules="[{ required: true, message: $t('form.common.quantity_validation') }]"
            >
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
                :value="
                  isNaN(applyModelRef.unitValue * applyModelRef.volume)
                    ? undefined
                    : applyModelRef.unitValue * applyModelRef.volume
                "
                addon-before="￥"
                style="width: 195px"
                :step="0.01"
                disabled="true"
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
                :rules="[
                  {
                    required: true,
                    message: $t('page.givingGifts.applyForm.giftGivingCompanyName_validation'),
                    trigger: 'change'
                  }
                ]"
              >
                <a-input v-model:value="company.companyName"></a-input>
              </a-form-item>
            </a-col>
            <a-col span="5">
              <PlusCircleOutlined class="dynamic-add-del-button" @click="addCompany" />
              &nbsp;
              <MinusCircleOutlined
                v-if="applyModelRef.companyList.length > 1"
                class="dynamic-add-del-button"
                @click="removeCompany(company)"
              />
              <a-button
                html-type="button"
                type="dashed"
                :disabled="false"
                style="margin: 0 8px"
                @click="openAddPersonModal(company)"
              >
                {{ $t('form.common.addPerson') }}
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
                :before-upload="beforeUpload"
                @change="handleUploadChange"
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
      </a-form>

      <!--显示历史操作记录-->
      <template v-if="givingGiftFromStatus.disableStatus">
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

      <a-row :gutter="24">
        <a-col :span="24" style="text-align: right">
          <a-space :size="5">
            <template v-if="givingGiftFromStatus.actionStatus === 'Create'">
              <a-button type="primary" html-type="submit" @click.prevent="onSubmitApply('Draft')">
                {{ $t('common.saveDraft') }}
              </a-button>
              <a-button type="primary" html-type="submit" @click.prevent="onSubmitApply('Submit')">
                {{ $t('common.submit') }}
              </a-button>
              <a-button style="margin: 1px" @click="resetApplyFrom">
                {{ $t('common.reset') }}
              </a-button>
            </template>
            <template v-else-if="givingGiftFromStatus.actionStatus === 'Draft'">
              <a-button type="primary" html-type="submit" @click.prevent="onModifyApply('Draft')">
                {{ $t('common.saveDraft') }}
              </a-button>
              <a-button type="primary" html-type="submit" @click.prevent="onModifyApply('Submit')">
                {{ $t('common.submit') }}
              </a-button>
              <a-button type="primary" html-type="submit" @click.prevent="onModifyApply('Delete')">
                {{ $t('common.delete') }}
              </a-button>
              <a-button style="margin: 1px" @click="resetApplyFrom">
                {{ $t('common.reset') }}
              </a-button>
            </template>
            <!---表单只读-->
            <template v-else-if="givingGiftFromStatus.actionStatus === 'Documented'">
              <a-button style="margin: 1px" @click="showCancelModal">
                {{ $t('common.cancel') }}
              </a-button>
            </template>
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
                <a-select
                  v-model:value="searchFormModelRef.status"
                  :placeholder="$t('form.common.select_validation')"
                  @change="typeHandleChange($event)"
                >
                  <a-select-opt-group :label="$t('form.common.option_draft')">
                    <a-select-option value="Draft">Draft</a-select-option>
                  </a-select-opt-group>
                  <a-select-opt-group :label="$t('form.common.option_inProcess')">
                    <a-select-option value="For Line Manager Approval">For Line Manager Approval</a-select-option>
                    <a-select-option value="For Subgroup Compliance Officer Approval">For SCO Approval</a-select-option>
                    <!--1391 2614 department Head approve-->
                    <!--
 <a-select-option
                      v-if="userInfo.companyCode === '1391' || userInfo.companyCode === '2614'"
                      value="For Department Head Approval"
                    >
                      For Department Head Approval
                    </a-select-option>
-->
                  </a-select-opt-group>
                  <a-select-opt-group :label="$t('form.common.option_complete')">
                    <a-select-option value="Documented">Documented</a-select-option>
                    <a-select-option value="Approved">Approved</a-select-option>
                    <a-select-option value="Rejected">Rejected</a-select-option>
                    <a-select-option value="Cancelled">Cancelled</a-select-option>
                  </a-select-opt-group>
                </a-select>
              </a-form-item>
            </a-col>
            <!--
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
-->
            <a-col span="11">
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
        <a-button type="link" @click="showApplyDrawerModal('Create')">{{ $t('common.newApplyCreate') }}</a-button>
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
            <a-button type="link" :loading="record.loading" @click="showApplyDrawerModal('Modify', record)">
              {{ $t('common.viewDetail') }}
            </a-button>
          </template>

          <template v-if="column.key === 'status'">
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

    <a-modal
      v-model:open="openCancelModal"
      width="500px"
      centered
      :title="$t('form.common.cancelReson')"
      @ok="onSubmitCancel"
    >
      <a-form ref="givingCancelFormRef" :model="applyFormCancelModelRef" :rules="applyFormCancelRules">
        <a-row :gutter="24">
          <a-col span="24">
            <a-form-item name="remark">
              <a-textarea
                v-model:value="applyFormCancelModelRef.remark"
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
      <a-form ref="addPersonModalFormRef" :model="currentCompanyState" :disabled="givingGiftFromStatus.disableStatus">
        <a-row v-for="(person, index) in currentCompanyState.personList" :key="person.key" :gutter="24">
          <a-col span="10">
            <a-form-item
              :label="$t('page.receivingGifts.applyForm.giftGiverEmployeeName')"
              :name="['personList', index, 'personName']"
              :rules="{
                required: true,
                message: $t('page.receivingGifts.applyForm.giftGiverEmployeeName_validation'),
                trigger: 'change'
              }"
            >
              <a-input v-model:value="person.personName"></a-input>
            </a-form-item>
          </a-col>

          <a-col span="10">
            <a-form-item
              :label="$t('page.receivingGifts.applyForm.giftGiverTitle')"
              :name="['personList', index, 'positionTitle']"
              :rules="{
                required: true,
                message: $t('page.receivingGifts.applyForm.giftGiverTitle_validation'),
                trigger: 'change'
              }"
            >
              <a-input v-model:value="person.positionTitle"></a-input>
            </a-form-item>
          </a-col>

          <a-col span="4">
            <PlusCircleOutlined class="dynamic-add-del-button" @click="addPerson" />
            &nbsp;
            <MinusCircleOutlined
              v-if="checkFirstPerson()"
              class="dynamic-add-del-button"
              @click="removePerson(person)"
            />
          </a-col>
        </a-row>
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
