<script setup lang="ts">
import { $t } from '@/locales';
import {
  cancelGivingGifts,
  copyGivingGifts,
  deleteDraftGivingGifts,
  feachCountryHeadGroupUsers,
  feachDeptHeadGroupUsers,
  fetchGetUserInfoById,
  fetchGivingGiftsList,
  fuzzySearchUserList,
  getGivingGiftsByApplicationId,
  saveGivingGifts,
  updateGivingGifts,
  uploadFile
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
import type { FormInstance, TableColumnsType, UploadChangeParam, UploadFile, UploadProps } from 'ant-design-vue';
import { Modal, Upload, message } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { debounce } from 'lodash-es';
import { computed, createVNode, h, nextTick, onMounted, reactive, ref, toRaw, watch } from 'vue';
const authStore = useAuthStore();
const userInfo = authStore.userInfo;
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

const givingCancelFormRef = ref();
const openCancelModal = ref<boolean>(false);
const uploadFileList = reactive([] as any);
const openApplyDrawerModal = ref<boolean>(false);
const expandSearchFields = ref(true);
const expandPolicyDescription = ref(true);
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
const ccApplyOptions = ref<SelectProps['options']>([]);
const applyOptions = ref<SelectProps['options']>([]);
const userState = reactive({ data: [] as any, ccData: [] as any, fetching: true });
const deptHeadGroupUserState = reactive({ data: [] as any, hidden: true });
const countryHeadGroupUserState = reactive({ data: [] as any, hidden: true });
const applyFormCancelModelRef = reactive({ remark: undefined, applicationId: '' });
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

const applyFormCancelRules: Record<string, Rule[]> = reactive({
  remark: [{ required: true, message: $t('form.common.cancelReson') }]
});

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
  companyList: Api.Gifts.GiftCompany[];
  giftsActivities: unknown[];
  isGoSoc: string;
  isBayerCustomer: string;
  unitValue: number | undefined;
  volume: number | undefined;
  totalValue: number | undefined;
  remark: string;
  fileId: unknown;
  attachFile: UploadFile<any>[];
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
  companyList: [],
  giftsActivities: [] as any,
  isGoSoc: '',
  isBayerCustomer: '',
  // givingTitle: '',
  unitValue: undefined as any,
  volume: undefined as any,
  totalValue: undefined as any,
  remark: '',
  fileId: undefined,
  attachFile: []
});

const getDeptHeadTooltip = () => {
  return $t('form.applicateInfo.deptHead_tooltip', { emails: 'zhe.sun.ext@bayer.com, dengzhuo.wang.ext@bayer.com' });
};

const disabledAfterCurrentDate = (current: Dayjs) => {
  // Can not select days after today and today
  return current && current > dayjs().endOf('day');
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

const loadCountryHeadGroupUserData = debounce(async () => {
  if (!userInfo.companyCode) {
    countryHeadGroupUserState.data = [];
  }
  const { data: items, error } = await feachCountryHeadGroupUsers(userInfo.companyCode);
  if (!error) {
    countryHeadGroupUserState.data = items;
    console.log('country head: ', countryHeadGroupUserState);
    if (countryHeadGroupUserState.data.length > 0) {
      applyModelRef.countryHead = `${countryHeadGroupUserState.data[0].userFirstName} ${countryHeadGroupUserState.data[0].userLastName} <${countryHeadGroupUserState.data[0].userEmail}>`;
    }
  }
}, 800);

const loadDeptHeadGroupUserData = debounce(async () => {
  if (!userInfo.companyCode) {
    deptHeadGroupUserState.data = [];
  }
  const { data: items, error } = await feachDeptHeadGroupUsers(userInfo.companyCode, userInfo.division);
  if (!error) {
    deptHeadGroupUserState.data = items;
    console.log('department head: ', deptHeadGroupUserState);
  }
}, 800);

const loadUserData = debounce(async (keyword: string, type: string, baseOnCompany: boolean) => {
  if (!keyword) {
    type === 'apply' ? (userState.data = []) : (userState.ccData = []);
  }
  const queryParam = { keyword, baseOnCompany, division: '' };
  if (baseOnCompany && userInfo.companyCode === '0882') {
    queryParam.division = userInfo.division;
  }
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
  loadUserData(searchValue, 'apply', true);
};

const onApplyCCSearch = (searchValue: string) => {
  applySearch.value = searchValue;
  userState.ccData = [];
  userState.fetching = true;
  console.log('Search:', searchValue);
  loadUserData(searchValue, 'applyCC', false);
};

const deptHeadGroupUserOptions = computed<SelectProps['options']>(() =>
  deptHeadGroupUserState.data.map((item: any) => ({
    label: `${item.userFirstName} ${item.userLastName} <${item.userEmail}>`,
    value: item.userEmail
  }))
);

const handleChangeApplyUser = async (item: any) => {
  // debugger;
  console.log('apply user option: ', item);
  if (item) {
    applyModelRef.applyName = item.value;
    console.log(`applyUser email: ${item.value}  id: ${item.option.sfUserId}`);
  }
};

const handleChangeDeptHeadUser = (item: any) => {
  console.log('department user option: ', item);
  if (item) {
    applyModelRef.deptHead = item.value;
  }
};

// 选择 Other 移除验证
const handleChangeReasonType = (value: any) => {
  // debugger;
  console.log('change reason', value);
  if (value === 'Other') {
    // applyModelRef.reason = '';
    showReasonDesc.value = true;
  } else {
    givingGiftFormRef?.value?.clearValidate('reason');
    // applyModelRef.reason = 'NA';
    showReasonDesc.value = false;
  }
};
// 选择HCP增加提示内容
const handleIsScoChange = (value: any) => {
  console.log('change sco desc', value);
  if (value === 'HCP') {
    Modal.info({
      title: $t('page.givingGifts.applyForm.giftGiving_HCP_option_noticeTitle'),
      content: h('div', {}, [h('p', $t('page.givingGifts.applyForm.givingGiving_HCP_option_noticeContent'))]),
      onOk() {
        console.log('ok');
      }
    });
  }
};

// 选择药品增加提示内容
const handleChangeGiftDesc = (value: any) => {
  console.log('change gift desc', value);
  if (value === 'Medicine Gift') {
    Modal.info({
      title: $t('page.givingGifts.applyForm.givingDesc_type_option_medicine_noticeTitle'),
      content: h('div', {}, [h('p', $t('page.givingGifts.applyForm.givingDesc_type_option_medicine_noticeContent'))]),
      onOk() {
        console.log('ok');
      }
    });
  }
};

const customUpload = async (option: any) => {
  const { onSuccess, file } = option;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', 'companyPerson');
  formData.append('module', 'Giving');
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
    // applyModelRef.companyList = [];
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
  applyModelRef.companyList = [];
  applyModelRef.giftsActivities = [];
  applyModelRef.unitValue = undefined;
  applyModelRef.volume = undefined;
  applyModelRef.remark = '';
  uploadFileList.value = [];
  applyModelRef.attachFile = [];
  givingGiftFromStatus.disableStatus = false;
  deptHeadGroupUserState.hidden = true;
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
      personList: [
        {
          id: -1,
          personName: '',
          positionType: '',
          positionTitle: '',
          isGoSoc: '',
          isBayerCustomer: '',
          companyId: -1,
          unitValue: undefined,
          volume: undefined,
          description: '',
          key: Date.now()
        }
      ]
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
    userState.data = [{ ...userInfo }];
    applyModelRef.applyName = userInfo.email;
    setTimeout(() => {
      openApplyDrawerModal.value = true;
    }, 500);
    return;
  }
  if (type === 'Modify' && item && item.applicationId) {
    item.loading = true;
    console.log('item: {}', item);
    const { data, error } = await getGivingGiftsByApplicationId(item.applicationId);
    if (!error) {
      // debugger;
      givingGiftFromStatus.actionStatus = data.status;
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
      }

      if (data.fileAttach) {
        // applyModelRef.attachFile = data.fileAttach;
        const attach = data.fileAttach;
        applyModelRef.attachFile = [
          {
            uid: attach.id,
            name: attach.origFileName,
            status: 'done',
            size: Number.parseInt(attach.fileSize, 2),
            url: `${baseURL}/sys/download/file?fileId=${attach.id}`
          }
        ];
        // uploadFileList.value = [
        //   {
        //     uid: attach.id,
        //     name: attach.origFileName,
        //     status: 'done',
        //     size: Number.parseInt(attach.fileSize, 2),
        //     url: `${baseURL}/sys/download/file?fileId=${attach.id}`
        //   }
        // ];
      }

      // applyModelRef.applyCCName = ccApplyOptions.value.map((v: any) => v.value);
      applyModelRef.unitValue = data.giftsRef.unitValue;
      applyModelRef.volume = data.giftsRef.volume;
      applyModelRef.totalValue = data.totalValue;
      applyModelRef.date = dayjs(data.giftsRef.givenDate).format('YYYY-MM-DD');
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
            unitValue: p.unitValue,
            volume: p.volume,
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
      applyModelRef.giftDesc = data.giftsRef.giftDesc;
      applyModelRef.isGoSoc = data.giftsRef.isGoSoc;
      // applyModelRef.isHandedOver = data.isHandedOver;
      applyModelRef.remark = data.remark;

      console.log('success:', data);

      if (data.status !== 'Draft') {
        applyModelRef.giftsActivities = data.giftsActivities;
        givingGiftFromStatus.disableStatus = true;
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
  givingGiftFromStatus.disableStatus = false;
  givingGiftFromStatus.descTypeHistory = false;
  ccApplyOptions.value.length = 0;
  userState.data = [];
  userState.ccData = [];
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
const perVerification = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const is_BHC_DHS_DHG =
      userInfo.companyCode === '0882' || userInfo.companyCode === '1954' || userInfo.companyCode === '1955';

    if (
      is_BHC_DHS_DHG &&
      userInfo.division === 'CH' &&
      applyModelRef.unitValue &&
      ((applyModelRef?.unitValue > 100 && applyModelRef.giftDescType === 'Promotional Supplies Gifts') ||
        (applyModelRef?.unitValue > 200 && applyModelRef.giftDescType === 'Cultural Courtesy Gifts'))
    ) {
      Modal.warning({
        title: $t('form.common.system_prompt'),
        content: h('div', {}, [h('p', $t('page.givingGifts.applyForm.givingDesc_type_CH_division_noticeContent'))]),
        onOk() {
          console.log('ok');
        }
      });
      reject(new Error('礼品描述类别不符'));
      return;
    }
    resolve();
  });
};

// 修改提交
const onModifyApply = (value: string) => {
  perVerification()
    .then(() => {
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
              if (value === 'Draft' || value === 'Submit') {
                console.log('update draft...');
                await updateGivingGifts(requestParam);
              } else if (value === 'Delete') {
                console.log('modify delete draft...');
                await deleteDraftGivingGifts(requestParam.applicationId);
              } else if (value === 'Copy') {
                // debugger;
                const item = await copyGivingGifts(requestParam.applicationId);
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
    })
    .catch(err => {
      console.log('error per validation', err);
    });
};

// 保存提交
const onSubmitApply = (value: string) => {
  perVerification()
    .then(() => {
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
          }
          console.log(`submit type ${value}`);
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
    })
    .catch(err => {
      console.log('error per validation', err);
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
  nextTick(() => {
    searchRangeDate.value = undefined;
    searchFormModelRef.beginDate = '';
    searchFormModelRef.endDate = '';
    searchFormRef?.value?.resetFields();
    getListDataByCondition();
  });
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
    personList: [
      {
        id: -1,
        personName: '',
        positionType: '',
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
    positionType: '',
    positionTitle: '',
    isGoSoc: '',
    isBayerCustomer: '',
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

onMounted(async () => {
  // userInfo = authStore.userInfo;
  // supervisorInfo = userInfo.supervisor;
  applyUserInfo.userInfo = userInfo;
  applyUserInfo.creatorUserInfo = userInfo;
  applyUserInfo.supervisor = userInfo.supervisor;
  console.log(`creator companycode:${userInfo.companyCode}`);
  console.log(`apply user isDeptHead: ${applyUserInfo?.userInfo?.isDeptHead}`);
  console.log(`apply user isCountryHead: ${applyUserInfo?.userInfo?.isCountryHead}`);
  loadDeptHeadGroupUserData();
  loadCountryHeadGroupUserData();
  const listData = await fetchGivingGiftsList({ userId: userInfo.sfUserId, newVersion: 'Y' });
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

// 计算总价，单价
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
  // console.log('totalValue: %s, totalVolume: %s, maxUnitValue: %s', totalValue, totalVolume, maxUnitValue);

  applyModelRef.volume = totalVolume === 0 ? undefined : totalVolume;
  applyModelRef.unitValue = maxUnitValue;
  applyModelRef.totalValue = totalValue === 0 ? undefined : Number.parseFloat(totalValue.toFixed(2));
};

// 隐藏department head, country head 下拉列表
const hideDeptCountryHeadDropDown = (newIsGoSoc: string, newDescType: string) => {
  const companyCode = userInfo.companyCode;
  const maxUnitValue = applyModelRef.unitValue ? applyModelRef.unitValue : 0;
  // 隐藏部门经理下拉列表
  deptHeadGroupUserState.hidden = false;
  countryHeadGroupUserState.hidden = true;
  if (applyUserInfo?.userInfo?.isCountryHead || applyUserInfo?.userInfo?.isDeptHead) {
    deptHeadGroupUserState.hidden = true;
  } else if (companyCode === '0813' && newIsGoSoc === 'No' && maxUnitValue <= 300) {
    deptHeadGroupUserState.hidden = true;
  } else if (companyCode === '1391' || companyCode === '2614') {
    if (newIsGoSoc === 'No' && newDescType === 'Promotional Supplies Gifts' && maxUnitValue <= 300) {
      deptHeadGroupUserState.hidden = true;
    }
    if (maxUnitValue > 300) {
      countryHeadGroupUserState.hidden = false;
    }
  } else if (
    companyCode === '0882' &&
    userInfo.division === 'CH' &&
    newDescType === 'Promotional Supplies Gifts' &&
    maxUnitValue <= 100
  ) {
    deptHeadGroupUserState.hidden = true;
  }
  if (applyModelRef.unitValue === 0 && applyModelRef.isGoSoc === '' && applyModelRef.giftDescType === '') {
    deptHeadGroupUserState.hidden = true;
    countryHeadGroupUserState.hidden = true;
  }
  console.log('deptHeadGroupUser hidden status: ', deptHeadGroupUserState.hidden);
};

watch(
  () => [
    applyModelRef.applyName,
    userState.data,
    userState.ccData,
    applyModelRef.companyList,
    applyModelRef.isGoSoc,
    applyModelRef.giftDescType
  ],
  async (
    [newApplyName, newUserVal, newUserCCVal, newCompanyList, newIsGoSoc, newDescType],
    [oldApplyName, oldUserVal, oldUserCCVal, oldCompanyList, oldIsGoSoc, oldDescType]
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
    console.log('oldIsGoSoc:', oldIsGoSoc);
    console.log('oldDescType:', oldDescType);

    ccApplyOptions.value = userState.ccData.map((user: any) => ({
      label: `${user.firstName} ${user.lastName} <${user.email}>`,
      value: user.email
    }));

    applyOptions.value = userState.data.map((user: any) => ({
      label: `${user.firstName} ${user.lastName} <${user.email}>`,
      value: user.email,
      sfUserId: user.sfUserId
    }));
    fillInPrice(newCompanyList);
    reloadApplyUserInfo(newApplyName, oldApplyName).then(() => {
      hideDeptCountryHeadDropDown(newIsGoSoc, newDescType);
    });
  },
  { deep: true }
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
                @change="handleChangeApplyUser"
                @search="onApplySearch"
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
                @search="onApplyCCSearch"
              ></a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <template v-if="!deptHeadGroupUserState.hidden">
            <a-col span="10">
              <a-form-item
                :label="$t('form.applicateInfo.deptHead')"
                name="deptHead"
                :rules="[
                  {
                    required: true,
                    message: $t('form.applicateInfo.deptHead_validation')
                  }
                ]"
              >
                <a-tooltip placement="rightTop" :title="getDeptHeadTooltip()">
                  <a-select
                    v-model:value="applyModelRef.deptHead"
                    :default-active-first-option="true"
                    :placeholder="$t('form.applicateInfo.deptHead_validation')"
                    show-search
                    label-in-value
                    :allow-clear="true"
                    :not-found-content="userState.fetching ? null : undefined"
                    :options="deptHeadGroupUserOptions"
                    @change="handleChangeDeptHeadUser"
                  ></a-select>
                </a-tooltip>
              </a-form-item>
            </a-col>
          </template>

          <template v-if="!countryHeadGroupUserState.hidden">
            <a-col span="10">
              <a-form-item :label="$t('form.applicateInfo.countryHead')">
                <a-input v-model:value="applyModelRef.countryHead" disabled></a-input>
              </a-form-item>
            </a-col>
          </template>
        </a-row>
        <a-row justify="end">
          <a-col>
            <a-button type="link" :disabled="false" @click="expandPolicyDescription = !expandPolicyDescription">
              <template v-if="expandPolicyDescription">{{ $t('common.shrink') }}</template>
              <template v-else>{{ $t('common.expand') }}</template>
            </a-button>
          </a-col>
        </a-row>
        <div v-show="expandPolicyDescription">
          <a-descriptions :title="$t('page.givingGifts.policy.title')" layout="vertical">
            <a-descriptions-item
              v-for="(item, index) in $tm(`page.givingGifts.policy.desc_${userInfo.companyCode}`)"
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

        <a-descriptions :title="$t('page.givingGifts.applyForm.givingGiftInfo')" />
        <template
          v-if="userInfo.companyCode === '0813' || userInfo.companyCode === '1391' || userInfo.companyCode === '2614'"
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
                      message: $t('page.givingGifts.applyForm.giftDesc_type_label_validation')
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
                    required: applyModelRef.reasonType === 'Other' ? true : false,
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
                <a-form-item
                  name="giftDescType"
                  :label="$t('page.givingGifts.applyForm.giftDesc_type_label')"
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
                  :label="$t('page.givingGifts.applyForm.giftDesc_type_label')"
                  name="giftDescType"
                  :rules="[
                    {
                      required: true,
                      message: $t('page.givingGifts.applyForm.giftDesc_type_label')
                    }
                  ]"
                >
                  <a-input
                    v-model:value="applyModelRef.giftDescType"
                    :placeholder="$t('page.givingGifts.applyForm.giftDesc_type_label_validation')"
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
                <a-select v-model:value="applyModelRef.isGoSoc">
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
                <a-select v-model:value="applyModelRef.isGoSoc" @change="handleIsScoChange">
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
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
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
-->
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

        <div v-for="(company, index) in applyModelRef.companyList" :key="company.key">
          <a-row :gutter="24">
            <a-col span="20">
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
            <a-form-item :label="$t('page.givingGifts.applyForm.upload_person_label')">
              <a-upload
                v-model:file-list="applyModelRef.attachFile"
                :action="`${baseURL}/sys/upload/file?module=giving&type=CompanyPerson`"
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
            <a-form-item :label="$t('page.givingGifts.applyForm.remark')" name="remark">
              <a-textarea v-model:value="applyModelRef.remark" :rows="4" allow-clear />
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
            <!--增加复制按钮-->
            <template
              v-else-if="
                givingGiftFromStatus.actionStatus === 'Cancelled' ||
                givingGiftFromStatus.actionStatus === 'Rejected' ||
                givingGiftFromStatus.actionStatus === 'Approved'
              "
            >
              <a-button type="primary" html-type="submit" @click.prevent="onModifyApply('Copy')">
                {{ $t('common.copy') }}
              </a-button>
            </template>

            <!---表单只读-->
            <template
              v-else-if="
                givingGiftFromStatus.actionStatus !== 'Completed' &&
                givingGiftFromStatus.actionStatus !== 'Rejected' &&
                givingGiftFromStatus.actionStatus !== 'Cancelled'
              "
            >
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
                <a-select v-model:value="searchFormModelRef.status" :placeholder="$t('form.common.select_validation')">
                  <a-select-opt-group :label="$t('form.common.option_draft')">
                    <a-select-option value="Draft">Draft</a-select-option>
                  </a-select-opt-group>

                  <a-select-opt-group :label="$t('form.common.option_inProcess')">
                    <a-select-option value="For Line Manager Approval">For Line Manager Approval</a-select-option>
                    <a-select-option
                      v-if="!userInfo.isDeptHead && !userInfo.isCountryHead"
                      value="For Department Head Approval"
                    >
                      For Department Head Approval
                    </a-select-option>
                    <a-select-option value="For Subgroup Compliance Officer Approval">For SCO Approval</a-select-option>
                    <!--1391 2614 country Head approve-->
                    <a-select-option
                      v-if="
                        !userInfo.isCountryHead && (userInfo.companyCode === '1391' || userInfo.companyCode === '2614')
                      "
                      value="For Country Head Approval"
                    >
                      For Country Head Approval
                    </a-select-option>
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

    <!--取消 modal-->
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
      @cancel="onCancelAddPerson"
      @ok="onSubmitAddPerson"
    >
      <a-form ref="addPersonModalFormRef" :model="currentCompanyState" :disabled="givingGiftFromStatus.disableStatus">
        <template v-for="(person, index) in currentCompanyState.personList" :key="person.key">
          <a-divider orientation="left" />
          <a-row :gutter="24">
            <a-col span="12">
              <a-form-item
                :label-col="{ span: 10 }"
                :wrapper-col="{ span: 14 }"
                :label="$t('page.givingGifts.applyForm.giftGivingEmployeeName')"
                :name="['personList', index, 'personName']"
                :rules="{
                  required: true,
                  message: $t('page.givingGifts.applyForm.giftGivingEmployeeName_validation'),
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
                :label="$t('page.givingGifts.applyForm.giftGivingTitle')"
                :name="['personList', index, 'positionTitle']"
                :rules="{
                  required: true,
                  message: $t('page.givingGifts.applyForm.giftGivingTitle_validation'),
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
