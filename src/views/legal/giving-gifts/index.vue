<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { usePagination } from 'vue-request';
import type { SelectProps } from '@ant-design/icons-vue';
import type { DrawerProps, FormInstance, TableColumnsType } from 'ant-design-vue';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { cloneDeep, debounce } from 'lodash-es';
import type { UnwrapRef } from 'vue';
import { anyType } from 'ant-design-vue/es/_util/type';
import { $t } from '@/locales';
import {
  fetchGivingGiftsList,
  fuzzySearchGiftCompanyList,
  fuzzySearchGiftPersonList,
  fuzzySearchUserList
} from '@/service/api';
import { useAuthStore } from '@/store/modules/auth';
import type { MentionsProps } from '..';
const authStore = useAuthStore();
const userInfo = authStore.userInfo;
const supervisorInfo = userInfo.supervisor;
const expand = ref(true);
const formRef = ref<FormInstance>();
const formState = reactive({});
const value1 = ref();
const value2 = ref();
const dateValue = ref<[Dayjs, Dayjs]>();
const open = ref<boolean>(false);
const size = ref<DrawerProps['size']>('default');
const showDrawer = (val: DrawerProps['size']) => {
  size.value = val;
  open.value = true;
};
const applySearch = ref<string>('');
const giftCompanySearch = ref<string>('');
const giftPersonSearch = ref<string>('');
const userState = reactive({ data: [] as any, value: [] as any, ccValue: [] as any, fetching: true });
const giftCompanyState = reactive({ data: [] as any, value: -1, fetching: true });
const giftCompanyPersonState = reactive({ data: [] as any, value: [] as any, fetching: true });
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

const onGiftCompanyChange = (value: any, option: any) => {
  debugger;
  console.log(option);
  console.log(`selected ${value}`);
  giftCompanyState.value = value;
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

const onClose = () => {
  open.value = false;
};

const columns: TableColumnsType = [
  { title: '申请者', width: 100, dataIndex: 'apply', key: 'apply', fixed: 'left' },
  { title: '申请日期', width: 100, dataIndex: 'date', key: 'date', fixed: 'left' },
  { title: 'CWID', dataIndex: 'cwid', key: 'cwid', width: 100 },
  { title: '部门', dataIndex: 'dept', key: 'dept', width: 150 },
  { title: '公司编号', dataIndex: 'leCode', key: 'leCode', width: 150 },
  { title: '申请类型', dataIndex: 'type', key: 'type', width: 150 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 150 },
  {
    title: '操作',
    key: 'operation',
    fixed: 'right',
    width: 100
  }
];

// const pagination = computed(() => ({
//   total: 200,
//   current: current.value,
//   pageSize: pageSize.value
// }));

// type queryParam = {
//   currentPage?:number;
// }

// const queryData = (params: queryParam){
//   return await fetchGivingGiftsList(params);
// }

interface DataItem {
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
    apply: 'Wenhui Ma',
    date: '2024-03-12',
    cwid: 'CTMXI',
    dept: `Ag Policy & N China Gov Liaison Lead. ${i}`,
    leCode: '0813',
    type: 'Submit',
    status: 'Rejected'
  });
}

const given_person_options = ref<SelectProps['options']>([
  {
    value: 'lzj',
    label: '李振江 经理'
  },
  {
    value: 'lh',
    label: '李辉 服务经理'
  },
  {
    value: 'zt',
    label: '赵彤 拜耳技术'
  },
  {
    value: 'ddg',
    label: '丁大刚 销售主管'
  }
]);

const onFinish = (values: any) => {
  console.log('Received values of form: ', values);
  console.log('formState: ', formState);
};

const focus = () => {
  console.log('focus');
};

const handleChange = (value: string) => {
  console.log(`selected ${value}`);
};

const disabledDate = (current: Dayjs) => {
  // Can not select days before today and today
  return current && current < dayjs().endOf('day');
};

// const provide_date = ref<Dayjs>();

const tex_value = ref<string>('');

const formState_apply = reactive({
  apply: {
    name: '',
    cc_name: '',
    gift_reson: '',
    gift_desc: '',
    given_date: '',
    given_company: '',
    given_person: '',
    gift_unit_price: '',
    gift_volume: '',
    go_soc: '',
    bayer_coustomer: ''
  }
});
</script>

<template>
  <a-drawer title="给予礼品申请表" :size="size" width="800" :open="open" @close="onClose">
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

    <a-form :model="formState_apply">
      <a-row :gutter="24">
        <a-col span="10">
          <a-form-item :name="['apply', 'name']" label="申请人" :rules="[{ required: true }]">
            <a-select
              placeholder="请选择"
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
          <a-form-item :name="['apply', 'cc_name']" label="抄送">
            <a-select
              mode="multiple"
              :default-active-first-option="false"
              :allow-clear="true"
              :not-found-content="userState.fetching ? null : undefined"
              :filter-option="false"
              placeholder="请选择"
              :options="ccApplyOptions"
              @search="onApplySearch"
            ></a-select>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <a-descriptions :title="$t('page.givingGifts.policy.title')" layout="vertical">
      <a-descriptions-item
        v-for="(item, index) in $tm(`page.givingGifts.policy.desc_${userInfo.companyCode}`)"
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

    <a-descriptions title="提供礼品信息 "></a-descriptions>
    <a-form>
      <a-row :gutter="24">
        <a-col span="14">
          <a-form-item :name="['apply', 'gift_reson']" label="提供礼物原因" :rules="[{ required: true }]">
            <a-input v-model:value="formState_apply.apply.gift_reson" placeholder="提供礼物原因..."></a-input>
          </a-form-item>
        </a-col>
        <a-col span="10">
          <a-form-item :name="['apply', 'gift_desc']" label="礼品描述" :rules="[{ required: true }]">
            <a-select v-model:value="formState_apply.apply.gift_desc" @focus="focus" @change="handleChange">
              <a-select-option value="fs">风俗礼品（只针对于健康消费品经销商）</a-select-option>
              <a-select-option value="lucy">其他礼品</a-select-option>
              <!-- <a-select-option value="disabled" disabled>Disabled</a-select-option> -->
              <!-- <a-select-option value="Yiminghe">yiminghe</a-select-option> -->
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col span="8">
          <a-form-item :name="['apply', 'gift_date']" label="提供日期" :rules="[{ required: true }]">
            <a-date-picker v-model:value="formState_apply.apply.given_date" />
          </a-form-item>
        </a-col>
        <a-col span="5">
          <a-form-item :name="['apply', 'gift_unit_price']" label="单价" :rules="[{ required: true }]">
            <a-input v-model:value="formState_apply.apply.gift_unit_price" placeholder="请输入单价..."></a-input>
          </a-form-item>
        </a-col>
        <a-col span="5">
          <a-form-item name="['apply', 'gift_volume']" label="数量" :rules="[{ required: true }]">
            <a-input v-model:value="formState_apply.apply.gift_volume" placeholder="请输入数量..."></a-input>
          </a-form-item>
        </a-col>
        <a-col span="6">
          <a-form-item label="总金额" :rules="[{ required: true }]">
            <a-input placeholder="请输入申请编号..." disabled="true"></a-input>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col span="24">
          <a-form-item name="['apply', 'given_company']" label="接收单位名称" :rules="[{ required: true }]">
            <a-select
              placeholder="请选择"
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
          <a-form-item name="['apply', 'given_person']" label="接收者姓名" :rules="[{ required: true }]">
            <a-select mode="multiple" style="width: 100%" placeholder="请选择" @search="ongGiftPersonSearch">
              <a-select-option v-for="item in giftCompanyPersonState.data" :key="item.id" :value="item.id">
                {{ item.personName }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col span="14">
          <a-form-item name="['apply', 'go_soc']" label="礼品接受者的类别？" :rules="[{ required: true }]">
            <a-select ref="select" v-model:value="formState_apply.apply.go_soc" @focus="focus" @change="handleChange">
              <a-select-option value="fs">医疗卫生专业人士（HCP）</a-select-option>
              <a-select-option value="lucy">政府官员</a-select-option>
              <a-select-option value="lucy">经销商</a-select-option>
              <a-select-option value="lucy">其他</a-select-option>
              <!-- <a-select-option value="disabled" disabled>Disabled</a-select-option> -->
              <!-- <a-select-option value="Yiminghe">yiminghe</a-select-option> -->
            </a-select>
          </a-form-item>
        </a-col>
        <a-col span="10">
          <a-form-item
            name="['apply', 'bayer_coustomer']"
            label="礼品接收者是否是拜耳现有客户? "
            :rules="[{ required: true }]"
          >
            <a-select
              ref="select"
              v-model:value="formState_apply.apply.bayer_coustomer"
              @focus="focus"
              @change="handleChange"
            >
              <a-select-option value="fs">是</a-select-option>
              <a-select-option value="lucy">否</a-select-option>
              <!-- <a-select-option value="disabled" disabled>Disabled</a-select-option> -->
              <!-- <a-select-option value="Yiminghe">yiminghe</a-select-option> -->
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="24">
        <a-col span="24">
          <a-form-item label="备注（请填写具体礼品名称）  ">
            <a-textarea v-model:value="tex_value" :rows="4" placeholder="请输入礼品备注信息..." allow-clear />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>

    <a-row :gutter="24">
      <a-col :span="24" style="text-align: right">
        <a-space :size="5">
          <a-button type="primary" html-type="submit">提交</a-button>
          <a-button style="margin: 1px">取消</a-button>
        </a-space>
      </a-col>
    </a-row>
  </a-drawer>

  <a-card title="搜索">
    <a-form ref="formRef" name="advanced_search" class="ant-advanced-search-form" :model="formState" @finish="onFinish">
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
              <a-select ref="select" v-model:value="value1" @focus="focus" @change="handleChange">
                <a-select-option value="draft">草稿</a-select-option>
                <a-select-option value="in-progress">处理钟</a-select-option>
                <a-select-option value="complete">完成</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col span="5">
            <a-form-item label="状态">
              <a-select ref="select" v-model:value="value2" @focus="focus" @change="handleChange">
                <a-select-option value="rejected">Rejected</a-select-option>
                <a-select-option value="documented">Documented</a-select-option>
                <a-select-option value="cancelled">Cancelled</a-select-option>
                <a-select-option value="approved">Approved</a-select-option>
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
      <a-row :gutter="24">
        <a-col :span="24" style="text-align: right">
          <a style="font-size: 12px" @click="expand = !expand">
            <template v-if="expand">收叠</template>
            <template v-else>展开</template>
          </a>
        </a-col>
      </a-row>
    </a-form>
  </a-card>

  <a-card title="列表">
    <template #extra><a-button type="link" @click="showDrawer('large')">新建申请</a-button></template>
    <a-table :columns="columns" :data-source="data" :scroll="{ x: 1500 }" class="table-list">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'operation'">
          <a-button type="link">查看详细信息</a-button>
        </template>

        <template v-if="column.key === 'status'">
          <a-tag :color="record.status === 'Rejected' ? 'volcano' : 'Approved' ? 'geekblue' : 'green'">
            {{ record.status }}
          </a-tag>
        </template>
      </template>
    </a-table>
  </a-card>
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
