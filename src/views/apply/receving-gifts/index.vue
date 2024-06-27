<script setup lang="ts">
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

import { $t } from '@/locales';
import {
  cancelReceivingGifts,
  copyReceivingGifts,
  deleteDraftReceivingGifts,
  fetchGetUserInfoById,
  fetchReceivingGiftsList,
  fuzzySearchUserList,
  getReceivingGiftsByApplicationId,
  saveReceivingGifts,
  saveReceivingUseCase,
  updateReceivingGifts,
  uploadFile
} from '@/service/api';
import { useAuthStore } from '@/store/modules/auth';
import { getServiceBaseURL } from '@/utils/service';
import { createVNode, nextTick, onMounted, reactive, ref, toRaw, watch } from 'vue';
let authStore: any;
let userInfo: Api.Auth.UserInfo;
// let supervisorInfo: Api.Auth.UserInfo;
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
const searchFormRef = ref();
// const applyReceivingForm = Form.useForm;
const applyReceivingCancelFormRef = ref();
const openCancelModal = ref<boolean>(false);
const uploadFileList = ref([] as any);
const listTableLoading = ref(true);
const openApplyDrawerModal = ref<boolean>(false);
const showAddPersonModal = ref<boolean>(false);
const showReasonDesc = ref(false);
const expandSearchFields = ref(true);
const receivingGiftFromStatus = reactive({ disableStatus: false, descTypeHistory: false, actionStatus: '' });
const listDataSource = ref([] as any);
const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'N';
const { baseURL } = getServiceBaseURL(import.meta.env, isHttpProxy);
const receivingGiftFormRef = ref<FormInstance>();
const addPersonModalFormRef = ref<FormInstance>();
let currentCompanyState = reactive<{
  companyName: string;
  personList: Api.Gifts.GiftPerson[];
  key: number;
}>({
  companyName: '',
  personList: [],
  key: 0
});
const applySearch = ref<string>('');
const ccApplyOptions = ref<SelectProps['options']>([]);
const applyOptions = ref<SelectProps['options']>([]);
const searchRangeDate = ref<[Dayjs, Dayjs]>();
const userState = reactive({ data: [] as any, ccData: [] as any, fetching: true });
const giftCompanyPersonState = reactive({ data: [] as any, value: [] as any, fetching: true });
const applyFormCancelModelRef = reactive({ remark: undefined, applicationId: '' });
const searchFormModelRef = reactive({
  newVersion: 'Y',
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
    title: 'page.receivingGifts.applyForm.giftReceivingDate',
    sorter: true,
    width: 100,
    dataIndex: 'givingDate',
    key: 'GIVING_DATE'
  },

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
  createDate: string;
  reference: string;
  applyName: string | undefined;
  applyForId: number;
  copyToUserEmails: string[];
  applyCCName: string[];
  reason: string;
  reasonType: string;
  giftDescType: string;
  giftDesc: string;
  date: string;
  companyList: Api.Gifts.GiftCompany[];
  giftsActivities: unknown[];
  unitValue: number | undefined;
  volume: number | undefined;
  estimatedTotalValue: number | undefined;
  remark: string;
  useCase: string;
  disableUseCase: boolean;
  fileId: unknown;
}>({
  actionType: '',
  applicationId: '',
  createDate: dayjs().format('YYYY-MM-DD'),
  reference: '',
  applyName: undefined as any,
  applyForId: undefined as any,
  copyToUserEmails: [] as any,
  applyCCName: undefined as any,
  reason: '',
  reasonType: '',
  giftDescType: undefined as any,
  giftDesc: undefined as any,
  date: dayjs().format('YYYY-MM-DD'),
  companyList: [],
  giftsActivities: [] as any,
  // givingTitle: '',
  unitValue: undefined as any,
  volume: undefined as any,
  estimatedTotalValue: 0,
  // isHandedOver: '',
  remark: '',
  useCase: '',
  disableUseCase: true,
  fileId: undefined
});

const disabledAfterCurrentDate = (current: Dayjs) => {
  // Can not select days after today and today
  return current && current > dayjs().endOf('day');
};

const loadUserData = debounce(async (keyword: string, type: string) => {
  if (!keyword) {
    type === 'apply' ? (userState.data = []) : (userState.ccData = []);
  }
  const queryParam = { keyword, baseOnCompany: false, division: '' };
  const { data: items, error } = await fuzzySearchUserList(queryParam);
  if (!error) {
    console.log('userInfo:', items);
    if (applySearch.value !== keyword) {
      return;
    }
    type === 'apply' ? (userState.data = items) : (userState.ccData = items);
    userState.fetching = false;
    console.log('users: ', userState);
  }
}, 800);

const onApplySearch = (searchValue: string) => {
  applySearch.value = searchValue;
  userState.data = [];
  userState.fetching = true;
  console.log('Search:', searchValue);
  loadUserData(searchValue, 'apply');
};

const onApplyCCSearch = (searchValue: string) => {
  applySearch.value = searchValue;
  userState.ccData = [];
  userState.fetching = true;
  console.log('Search:', searchValue);
  loadUserData(searchValue, 'applyCC');
};

const handleChangeApplyUser = (item: any) => {
  console.log('apply user option: ', item);
  if (item) {
    applyModelRef.applyName = item.value;
    console.log(`applyUser email: ${item.value}  id: ${item.option.sfUserId}`);
  }
};

// 搜索按钮
const getListDataByCondition = async (pag?: { pageSize: number; current: number }) => {
  listTableLoading.value = true;
  // get search date
  if (typeof searchRangeDate.value !== 'undefined') {
    searchFormModelRef.beginDate = searchRangeDate.value[0].format('YYYY-MM-DD');
    searchFormModelRef.endDate = searchRangeDate.value[1].format('YYYY-MM-DD');
  }
  searchFormModelRef.currentPage = pag?.current ? pag?.current : 1;
  searchFormModelRef.pageSize = pag?.pageSize ? pag?.pageSize : 5;
  const { data: queryResult, error } = await fetchReceivingGiftsList(searchFormModelRef);
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

const removeCompany = (item: Api.Gifts.GiftCompany) => {
  if (receivingGiftFromStatus.disableStatus) {
    return;
  }
  const index = applyModelRef.companyList.indexOf(item);
  if (index !== -1) {
    applyModelRef.companyList.splice(index, 1);
  }
};

const addCompany = () => {
  if (receivingGiftFromStatus.disableStatus) {
    return;
  }
  applyModelRef.companyList.push({
    id: -1,
    companyName: '',
    description: '',
    key: Date.now(),
    personList: [
      {
        id: -1,
        isGoSoc: '',
        isBayerCustomer: '',
        personName: '',
        positionTitle: '',
        description: '',
        companyId: -1,
        unitValue: undefined,
        volume: undefined,
        key: Date.now()
      }
    ]
  });
};

const removePerson = (person: Api.Gifts.GiftPerson) => {
  if (receivingGiftFromStatus.disableStatus) {
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
  if (receivingGiftFromStatus.disableStatus) {
    return;
  }
  currentCompanyState.personList.push({
    id: -1,
    isGoSoc: '',
    isBayerCustomer: '',
    personName: '',
    positionTitle: '',
    description: '',
    companyId: -1,
    unitValue: undefined,
    volume: undefined,
    key: Date.now()
  });
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

const openAddPersonModal = (item: Api.Gifts.GiftCompany) => {
  currentCompanyState = item;
  showAddPersonModal.value = true;
};

// 清空记录
const clearApplyModel = () => {
  applyModelRef.actionType = '';
  applyModelRef.applicationId = '';
  applyModelRef.reference = '';
  applyModelRef.applyName = undefined;
  applyModelRef.applyForId = -1;
  applyModelRef.copyToUserEmails = [];
  applyModelRef.applyCCName = [];
  applyModelRef.reason = '';
  applyModelRef.reasonType = '';
  applyModelRef.giftDescType = '';
  applyModelRef.giftDesc = '';
  applyModelRef.date = dayjs().format('YYYY-MM-DD');
  applyModelRef.companyList = [];
  applyModelRef.giftsActivities = [];
  applyModelRef.unitValue = undefined;
  applyModelRef.volume = undefined;
  applyModelRef.estimatedTotalValue = 0;
  applyModelRef.remark = '';
  uploadFileList.value = [];
  receivingGiftFromStatus.disableStatus = false;
  applyModelRef.disableUseCase = false;
};

const resetFromFields = () => {
  receivingGiftFormRef?.value?.resetFields();
  addPersonModalFormRef?.value?.resetFields();
  clearApplyModel();

  if (applyModelRef.companyList.length === 0) {
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
          companyId: -1,
          unitValue: undefined,
          volume: undefined,
          key: Date.now()
        }
      ]
    });
  }
};

// 重置申请列表
function resetApplyFrom() {
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
}

// 选择 Other 移除验证
const handleChangeReasonType = (value: any) => {
  console.log('change reason reason', value);
  if (value === 'Other') {
    // applyModelRef.reason = '';
    showReasonDesc.value = true;
  } else {
    // applyModelRef.reason = 'NA';
    showReasonDesc.value = false;
  }
};
const customUpload = async (option: any) => {
  const { onSuccess, file } = option;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', 'companyPerson');
  formData.append('module', 'Receiving');
  formData.append('companyCode', userInfo.companyCode);
  // debugger;
  const { data, error } = await uploadFile(formData);
  if (!error) {
    console.log('data: ', data);
    data.extData.forEach(c => {
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
    onSuccess({ data });
  }
};

const handleUploadChange = ({ file, fileList }: UploadChangeParam) => {
  if (file.status === 'done') {
    message.success(
      $t('form.common.upload_file_success', {
        fileName: `${file.name}`
      })
    );
    applyModelRef.fileId = fileList[0].response?.data?.id;
    fileList.forEach(f => {
      f.url = `${baseURL}/sys/download/file?fileId=${applyModelRef.fileId}`;
    });
  } else if (file.status === 'error') {
    message.error(`${file.name} file upload failed.`);
  } else if (file.status === 'removed') {
    applyModelRef.fileId = undefined;
  }
};
const beforeUpload: UploadProps['beforeUpload'] = file => {
  const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  if (!isExcel) {
    message.error(`${file.name} is not a xlsx file`);
  }
  return isExcel || Upload.LIST_IGNORE;
};

const showApplyDrawerModal = async (type: string, item?: any) => {
  resetFromFields();
  // debugger;
  console.log('show apply drawer type:', type);
  receivingGiftFromStatus.actionStatus = type;
  if (type === 'Create') {
    console.log('Create...');
    userState.data = [{ ...userInfo }];
    applyModelRef.applyName = userInfo.email;
    setTimeout(() => {
      openApplyDrawerModal.value = true;
    }, 500);
    return;
  }
  if (type === 'Modify' && item && item.applicationId) {
    console.log('Modify...');
    item.loading = true;
    // ccApplyOptions.value.length = 0;
    applyModelRef.companyList = [];
    const { data, error } = await getReceivingGiftsByApplicationId(item.applicationId);
    if (!error) {
      receivingGiftFromStatus.actionStatus = data.status;
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
        // debugger;
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
      if (data.fileAttach) {
        const attach = data.fileAttach;
        uploadFileList.value.push({
          uid: attach.id,
          name: attach.origFileName,
          size: Number.parseInt(attach.fileSize, 2),
          url: `${baseURL}/sys/download/file?fileId=${attach.id}`
        });
      }
      applyModelRef.estimatedTotalValue = data.estimatedTotalValue;
      applyModelRef.unitValue = data.giftsRef.unitValue;
      applyModelRef.volume = data.giftsRef.volume;
      applyModelRef.giftDesc = data.giftsRef.giftDesc;
      applyModelRef.useCase = data.useCase;
      applyModelRef.disableUseCase = data.disableUseCase;
      applyModelRef.date = dayjs(data.giftsRef.givingDate).format('YYYY-MM-DD');
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

      applyModelRef.reasonType = data.reasonType;
      handleChangeReasonType(applyModelRef.reasonType);
      applyModelRef.reason = data.reason;
      applyModelRef.giftDescType = data.giftsRef.giftDescType;
      applyModelRef.remark = data.remark;
      console.log('success:', data);

      if (data.status !== 'Draft') {
        applyModelRef.giftsActivities = data.giftsActivities;
        receivingGiftFromStatus.disableStatus = true;
      }
    }
    setTimeout(() => {
      item.loading = false;
      openApplyDrawerModal.value = true;
    }, 1000);
  }
};

const closeApplyDrawerModal = () => {
  openApplyDrawerModal.value = false;
  receivingGiftFromStatus.disableStatus = false;
  applyOptions.value.length = 0;
  ccApplyOptions.value.length = 0;
  giftCompanyPersonState.data = [];
  userState.data = [];
  applyModelRef.actionType = '';
  applyModelRef.reference = '';
  userState.data = [];
  userState.ccData = [];
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

  getListDataByCondition(pag);
};

const onFinishSearch = (values: any) => {
  console.log('Received values of form: ', values);
  console.log('formState: ', searchFormModelRef);
};

// 根据公司动态移除验证field
// const dynamicRemoveRuleRef = computed(() => {
//   if (userInfo.companyCode === '0813' || userInfo.companyCode === '1391') {
//     delete formApplyRules.givingTitle;
//     delete formApplyRules.estimatedTotalValue;
//     delete formApplyRules.giftOverallReason;
//     delete formApplyRules.reason;
//   } else {
//     delete formApplyRules.unitValue;
//     delete formApplyRules.volume;
//     delete formApplyRules.giftDescType;
//   }
//   return formApplyRules;
// });

const onSubmitCancel = () => {
  applyReceivingCancelFormRef.value
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
          const { error } = await cancelReceivingGifts(requestParam);
          if (!error) {
            console.log('success!');
            applyReceivingCancelFormRef.value?.resetFields();
            closeCancelModal();
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

// 前置验证
// const perVerification = (): Promise<void> => {
//   return new Promise((resolve, reject) => {
//     const personArr = [];
//     applyModelRef.companyList.forEach(c => {
//       c.personList.forEach(p => {
//         if (p.personName && p.positionTitle) {
//           personArr.push(p);
//         }
//       });
//     });
//     if (!applyModelRef.fileId && applyModelRef.volume !== personArr.length) {
//       Modal.warning({
//         title: '人员与数量不符',
//         content: h('div', {}, [h('p', `提供人员：${personArr.length}`), h('p', `数量：${applyModelRef.volume}`)]),
//         onOk() {
//           console.log('ok');
//         }
//       });
//       reject(new Error('人员与数量不符'));
//       return;
//     }
//     resolve();
//   });
// };

// 修改提交
const onModifyApply = (value: string) => {
  // perVerification()
  //   .then(() => {
  receivingGiftFormRef?.value
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
      } else if (value === 'Save Use Case') {
        console.log('save use case...');
        confirmContent = `${$t('common.confirm')} ${$t('common.save')}${$t('page.receivingGifts.applyForm.usageScenairo')} ?`;
      } else if (value === 'Copy') {
        confirmContent = `${$t('common.confirm')} ${$t('common.copy')} ?`;
      }

      Modal.confirm({
        title: $t('common.tip'),
        icon: createVNode(ExclamationCircleOutlined),
        content: confirmContent,
        okText: $t('common.confirm'),
        cancelText: $t('common.cancel'),
        async onOk() {
          // debugger;
          const requestParam = toRaw(applyModelRef);
          requestParam.actionType = value;
          // requestParam.applyForId = requestParam.applyName.userId;
          requestParam.copyToUserEmails = requestParam.applyCCName;
          console.log(requestParam);
          console.log(requestParam.date.toString());
          if (value === 'Draft' || value === 'Submit') {
            console.log('update draft...');
            await updateReceivingGifts(requestParam);
          } else if (value === 'Delete') {
            console.log('modify delete draft...');
            await deleteDraftReceivingGifts(requestParam.applicationId);
          } else if (value === 'Save Use Case') {
            await saveReceivingUseCase(requestParam);
          } else if (value === 'Copy') {
            // debugger;
            const item = await copyReceivingGifts(requestParam.applicationId);
            console.log('copyApplicationId: ', item.data);
            showApplyDrawerModal('Modify', { applicationId: item.data, loading: false });
            getListDataByCondition();
            return;
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
  //   })
  //   .catch(err => {
  //     console.log('error per validation', err);
  //   });
};

// 保存提交
const onSubmitApply = (value: string) => {
  // perVerification()
  //   .then(() => {
  receivingGiftFormRef?.value
    ?.validate()
    .then(() => {
      let confirmContent = '';
      if (value === 'Draft') {
        console.log('update draft...');
        confirmContent = `${$t('common.confirm')} ${$t('common.saveDraft')} ?`;
      } else if (value === 'Submit') {
        console.log('modify submit...');
        confirmContent = `${$t('common.confirm')} ${$t('common.submit')} ?`;
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
          // requestParam.applyForId = requestParam.applyName.userId;
          requestParam.copyToUserEmails = requestParam.applyCCName;
          console.log(requestParam);
          const { error } = await saveReceivingGifts(requestParam);
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
  //   })
  //   .catch(err => {
  //     console.log('error per validation', err);
  //   });
};

onMounted(async () => {
  authStore = useAuthStore();
  userInfo = authStore.userInfo;
  // supervisorInfo = userInfo.supervisor;
  applyUserInfo.userInfo = userInfo;
  applyUserInfo.creatorUserInfo = userInfo;
  applyUserInfo.supervisor = userInfo.supervisor;
  const listData = await fetchReceivingGiftsList({ userId: userInfo.sfUserId, newVersion: 'Y' });
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

const fillInPrice = (newCompanyList: Api.Gifts.GiftCompany[]) => {
  let totalValue = 0;
  let totalVolume = 0;
  let maxUnitValue = 0;
  newCompanyList.forEach(c => {
    let totalValueByComp = 0;
    c.personList.forEach(p => {
      let totalValueByPerson = 0;
      if (p.unitValue && p.volume) {
        if (p.unitValue > maxUnitValue) {
          maxUnitValue = p.unitValue;
        }
        totalValueByPerson += p.unitValue * p.volume;
        totalVolume += p.volume;
        // console.log('person >>> unitVal: %s, volume: %s, total: %s', p.unitValue, p.volume, totalValueByPerson);
      }
      totalValueByComp += totalValueByPerson;
      // console.log('company >>> totalValueByComp: %s', totalValueByComp);
    });

    totalValue += totalValueByComp;
  });
  console.log('totalValue: %s, totalVolume: %s, maxUnitValue: %s', totalValue, totalVolume, maxUnitValue);

  applyModelRef.volume = totalVolume === 0 ? undefined : totalVolume;
  applyModelRef.unitValue = maxUnitValue;
  applyModelRef.estimatedTotalValue = totalValue === 0 ? undefined : Number.parseFloat(totalValue.toFixed(2));
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
  () => [applyModelRef.applyName, userState.data, userState.ccData, applyModelRef.companyList],
  (
    [newApplyName, newUserVal, newUserCCVal, newCompanyList],
    [oldApplyName, oldUserVal, oldUserCCVal, oldCompanyList]
  ) => {
    // debugger;
    console.log('newApplyName:', newApplyName);
    console.log('newUserVal:', newUserVal);
    console.log('newUserCCVal:', newUserCCVal);
    console.log('newCompanyList:', newCompanyList);
    console.log('oldApplyName:', oldApplyName);
    console.log('oldUserVal: ', oldUserVal);
    console.log('oldUserCCVal:', oldUserCCVal);
    console.log('oldCompanyList: ', oldCompanyList);

    ccApplyOptions.value = userState.ccData.map((user: any) => ({
      label: `${user.firstName} ${user.lastName} <${user.email}>`,
      value: user.email
    }));

    applyOptions.value = userState.data.map((user: any) => ({
      label: `${user.firstName} ${user.lastName} <${user.email}>`,
      value: user.email
    }));
    fillInPrice(newCompanyList);
    reloadApplyUserInfo(newApplyName, oldApplyName);
  },
  { deep: true }
);
</script>

<template>
  <div>
    <a-drawer
      :title="$t('page.receivingGifts.applyForm.acceptGiftRequestTitle')"
      width="75%"
      size="large"
      :open="openApplyDrawerModal"
      @close="closeApplyDrawerModal"
    >
      <a-descriptions :title="$t('form.applicateInfo.formFillerInfoTitle')" :column="2">
        <a-descriptions-item :label="$t('form.applicateInfo.formFiller')">
          {{ applyUserInfo?.creatorUserInfo?.firstName }} {{ applyUserInfo?.creatorUserInfo?.lastName }}
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
              <template v-else-if="applyModelRef.actionType === 'Documented'">
                <a-tag color="geekblue">{{ applyModelRef.actionType.toUpperCase() }}</a-tag>
              </template>
              <template v-else>
                <a-tag color="volcano">{{ applyModelRef.actionType.toUpperCase() }}</a-tag>
              </template>
            </span>
          </a-descriptions-item>
        </template>
      </a-descriptions>
      <a-descriptions :title="$t('page.receivingGifts.applyForm.receivingGiftInfo')"></a-descriptions>
      <a-form ref="receivingGiftFormRef" :model="applyModelRef" :disabled="receivingGiftFromStatus.disableStatus">
        <!--政策提示内容-->
        <!--
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
-->

        <a-row :gutter="24">
          <a-col span="10">
            <a-form-item
              a-form-item
              :label="$t('page.receivingGifts.applyForm.giftRecipient')"
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
                @change="handleChangeApplyUser"
                @search="onApplySearch"
              ></a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-descriptions>
          <!--
 <a-descriptions-item :label="$t('page.receivingGifts.applyForm.giftRecipient')">
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
          <a-descriptions-item :label="$t('form.applicateInfo.division')">
            {{ applyUserInfo?.userInfo?.division }}
          </a-descriptions-item>
        </a-descriptions>

        <a-row :gutter="24">
          <a-col span="24">
            <a-form-item :label="$t('form.applicateInfo.applyCC')" name="applyCCName">
              <a-select
                v-model:value="applyModelRef.applyCCName"
                mode="multiple"
                :default-active-first-option="false"
                :allow-clear="true"
                :not-found-content="userState.fetching ? null : undefined"
                :filter-option="false"
                :placeholder="$t('form.common.select_validation')"
                :options="ccApplyOptions"
                @search="onApplyCCSearch"
              ></a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col span="10">
            <a-form-item
              :label="$t('page.receivingGifts.applyForm.giftReason_type_label')"
              name="reasonType"
              :rules="[
                {
                  required: true,
                  message: $t('page.receivingGifts.applyForm.giftReason_type_label_validation')
                }
              ]"
            >
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

          <a-col span="10">
            <a-form-item
              :label="$t('page.receivingGifts.applyForm.giftDesc_type_label')"
              name="giftDescType"
              :rules="[
                {
                  required: true,
                  message: $t('page.receivingGifts.applyForm.giftDesc_type_label_validation')
                }
              ]"
            >
              <a-select v-model:value="applyModelRef.giftDescType">
                <a-select-option value="Cash Equivalents">
                  {{ $t('form.common.option_giftDesc_Cash_Equivalents') }}
                </a-select-option>
                <a-select-option value="Present">
                  {{ $t('form.common.option_giftDesc_Present') }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row v-show="showReasonDesc" :gutter="24">
          <a-col span="24">
            <a-form-item
              :label="$t('page.receivingGifts.applyForm.giftReason_label')"
              name="reason"
              :rules="[
                {
                  required: applyModelRef.reasonType === 'Other' ? true : false,
                  message: $t('page.receivingGifts.applyForm.giftReason_label_validation')
                }
              ]"
            >
              <a-input
                v-model:value="applyModelRef.reason"
                :placeholder="$t('page.receivingGifts.applyForm.giftDesc_label_validation')"
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>

        <!--0813 AND 1391 需要输入单价和总价-->
        <a-row :gutter="24">
          <a-col span="5">
            <a-form-item
              :label="$t('page.receivingGifts.applyForm.giftReceivingDate')"
              name="date"
              v-bind="{
                rules: [
                  {
                    required: true,
                    message: $t('page.receivingGifts.applyForm.giftReceivingDate_validation')
                  }
                ]
              }"
            >
              <a-date-picker
                v-model:value="applyModelRef.date"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                :disabled-date="disabledAfterCurrentDate"
                style="width: 140px"
              />
            </a-form-item>
          </a-col>
          <a-col span="7">
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
          <a-col span="5">
            <a-form-item
              name="volume"
              :label="$t('form.common.quantity')"
              :rules="[{ required: true, message: $t('form.common.quantity_validation') }]"
            >
              <a-input-number v-model:value="applyModelRef.volume" :min="1" disabled="true"></a-input-number>
            </a-form-item>
          </a-col>
          <!--
 <a-col span="7">
            <a-form-item
              :label="$t('form.common.unitPrice')"
              name="unitValue"
              :rules="[{ required: true, message: $t('form.common.unitPrice_validation') }]"
            >
              <a-input-number
                v-model:value="applyModelRef.unitValue"
                addon-before="￥"
                style="width: 195px"
                :placeholder="$t('form.common.unitPrice_validation')"
                :step="0.01"
              ></a-input-number>
            </a-form-item>
          </a-col>
-->
          <!--
 <a-col span="5">
            <a-form-item
              :label="$t('form.common.quantity')"
              name="volume"
              :rules="[{ required: true, message: $t('form.common.quantity_validation') }]"
            >
              <a-input-number
                v-model:value="applyModelRef.volume"
                :placeholder="$t('form.common.quantity_validation')"
                :min="1"
              ></a-input-number>
            </a-form-item>
          </a-col>
-->

          <a-col span="5">
            <a-form-item :label="$t('form.common.totalPrice')">
              <a-input-number
                :value="applyModelRef.estimatedTotalValue"
                :step="0.01"
                addon-before="￥"
                style="width: 195px"
                disabled="true"
              ></a-input-number>
            </a-form-item>
          </a-col>
        </a-row>
        <div v-for="(company, index) in applyModelRef.companyList" :key="company.key">
          <a-row :gutter="24">
            <a-col span="20">
              <a-form-item
                :label="$t('page.receivingGifts.applyForm.giftGiverCompanyName')"
                :name="['companyList', index, 'companyName']"
                :rules="[
                  {
                    required: true,
                    message: $t('page.receivingGifts.applyForm.giftGiverCompanyName_validation'),
                    trigger: 'change'
                  }
                ]"
              >
                <a-input v-model:value="company.companyName"></a-input>
              </a-form-item>
            </a-col>
            <a-col span="4">
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
            <a-form-item :label="$t('page.receivingGifts.applyForm.upload_person_label')">
              <a-upload
                v-model:file-list="uploadFileList"
                :action="`${baseURL}/sys/upload/file?module=receiving&type=CompanyPerson`"
                :max-count="1"
                :before-upload="beforeUpload"
                :custom-request="customUpload"
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
            <a-form-item :label="$t('page.receivingGifts.applyForm.remark')" name="remark">
              <a-textarea v-model:value="applyModelRef.remark" :rows="4" allow-clear />
            </a-form-item>
          </a-col>
        </a-row>

        <template v-if="receivingGiftFromStatus.actionStatus === 'Documented'">
          <a-row :gutter="24">
            <a-col span="24">
              <a-form-item :label="$t('page.receivingGifts.applyForm.usageScenairo')" name="useCase">
                <a-textarea
                  v-model:value="applyModelRef.useCase"
                  :disabled="applyModelRef.disableUseCase"
                  :rows="4"
                  allow-clear
                />
              </a-form-item>
            </a-col>
          </a-row>
        </template>
      </a-form>

      <!--显示历史操作记录-->
      <template v-if="receivingGiftFromStatus.disableStatus">
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
      </template>

      <a-row :gutter="24">
        <a-col :span="24" style="text-align: right">
          <a-space :size="5">
            <template v-if="receivingGiftFromStatus.actionStatus === 'Create'">
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
            <template v-else-if="receivingGiftFromStatus.actionStatus === 'Draft'">
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

            <template
              v-else-if="
                receivingGiftFromStatus.actionStatus === 'Documented' ||
                receivingGiftFromStatus.actionStatus === 'Cancelled'
              "
            >
              <a-button type="primary" html-type="submit" @click.prevent="onModifyApply('Copy')">
                {{ $t('common.copy') }}
              </a-button>

              <!---表单只读-->
              <template v-if="receivingGiftFromStatus.actionStatus === 'Documented'">
                <a-button
                  :disabled="applyModelRef.disableUseCase"
                  type="primary"
                  html-type="submit"
                  @click.prevent="onModifyApply('Save Use Case')"
                >
                  {{ $t('common.save') }}
                </a-button>
                <a-button style="margin: 1px" @click="showCancelModal">
                  {{ $t('common.cancel') }}
                </a-button>
              </template>
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
              <a-form-item :label="$t('form.searchFrom.applyStatus')" name="status">
                <a-select v-model:value="searchFormModelRef.status">
                  <a-select-option value="draft">Draft</a-select-option>
                  <a-select-option value="documented">Documented</a-select-option>
                  <a-select-option value="cancelled">Cancelled</a-select-option>
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
      <template #extra>
        <a-button type="link" @click="showApplyDrawerModal('Create')">{{ $t('common.newApplyCreate') }}</a-button>
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
            <a-button type="link" :loading="record.loading" @click="showApplyDrawerModal('Modify', record)">
              {{ $t('common.viewDetail') }}
            </a-button>
          </template>
          <template v-else-if="column.key === 'ba.CREATED_DATE'">
            {{ dayjs(record.createdDate).format('YYYY-MM-DD') }}
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

    <!--取消 modal-->
    <a-modal
      v-model:open="openCancelModal"
      width="500px"
      centered
      :title="$t('form.common.cancelReson')"
      @ok="onSubmitCancel"
    >
      <a-form ref="applyReceivingCancelFormRef" :rules="applyFormCancelRules" :model="applyFormCancelModelRef">
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
      @cancel="onCancelAddPerson"
      @ok="onSubmitAddPerson"
    >
      <a-form
        ref="addPersonModalFormRef"
        :model="currentCompanyState"
        :disabled="receivingGiftFromStatus.disableStatus"
      >
        <template v-for="(person, index) in currentCompanyState.personList" :key="person.key">
          <a-divider orientation="left" />
          <a-row :gutter="24">
            <a-col span="12">
              <a-form-item
                :label-col="{ span: 10 }"
                :wrapper-col="{ span: 14 }"
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

            <a-col span="12">
              <a-form-item
                :label-col="{ span: 12 }"
                :wrapper-col="{ span: 12 }"
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
          </a-row>
          <a-row :gutter="24">
            <a-col span="10">
              <a-form-item
                :label-col="{ span: 8 }"
                :wrapper-col="{ span: 14 }"
                :label="$t('form.common.unitPrice')"
                :name="['personList', index, 'unitValue']"
                :rules="{
                  required: true,
                  message: $t('form.common.unitPrice_validation'),
                  trigger: 'change'
                }"
              >
                <a-input-number
                  v-model:value="person.unitValue"
                  :style="{ width: '100px' }"
                  :placeholder="$t('form.common.unitPrice_validation')"
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
                :rules="{
                  required: true,
                  message: $t('form.common.quantity_validation'),
                  trigger: 'change'
                }"
              >
                <a-input-number
                  v-model:value="person.volume"
                  :style="{ width: '100px' }"
                  :placeholder="$t('form.common.quantity_validation')"
                  :min="1"
                ></a-input-number>
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
:deep() .ant-form-item-required {
  text-align: left;
  word-break: break-all;
  white-space: pre-wrap;
  height: auto;
  line-height: 20px;
  vertical-align: bottom;
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
