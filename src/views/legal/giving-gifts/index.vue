<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { SelectProps } from '@ant-design/icons-vue';
import type { DrawerProps, FormInstance, TableColumnsType } from 'ant-design-vue';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash-es';
import type { UnwrapRef } from 'vue';
const open = ref<boolean>(false);
const size = ref<DrawerProps['size']>('default');
const showDrawer = (val: DrawerProps['size']) => {
  size.value = val;
  open.value = true;
};

const onClose = () => {
  open.value = false;
};
const expand = ref(true);
const formRef = ref<FormInstance>();
const formState = reactive({});
const value1 = ref();
const value2 = ref();
const dateValue = ref<[Dayjs, Dayjs]>();
const options1 = ref<SelectProps['options']>([
  {
    value: 'draft',
    label: '草稿'
  },
  {
    value: 'in-progress',
    label: '处理中'
  },
  {
    value: 'complete',
    label: '完成'
    // disabled: true
  }
]);

const columns: TableColumnsType = [
  { title: '申请者', width: 100, dataIndex: 'apply', key: 'apply', fixed: 'left' },
  { title: '申请日期', width: 100, dataIndex: 'date', key: 'date', fixed: 'left' },
  { title: 'CWID', dataIndex: 'cwid', key: '1', width: 100 },
  { title: '部门', dataIndex: 'dept', key: '2', width: 150 },
  { title: '公司编号', dataIndex: 'leCode', key: '3', width: 150 },
  { title: '申请类型', dataIndex: 'type', key: '4', width: 150 },
  { title: '状态', dataIndex: 'status', key: '5', width: 150 },
  {
    title: '操作',
    key: 'operation',
    fixed: 'right',
    width: 100
  }
];

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

const apply_cc_options = ref<SelectProps['options']>([
  {
    value: 'zs',
    label: 'Zhuo Chen <chen.zhuo@bayer.com>'
  },
  {
    value: 'sunz',
    label: 'Sun Zhe <sun.zhe@bayer.com>'
  },
  {
    value: 'CHTLL',
    label: 'Taili Lin <taili.lin@bayer.com>'
  },
  {
    value: 'sy',
    label: 'Suqin Yang <suqin.yang@bayer.com>'
  },
  {
    value: 'lz',
    label: 'Li Zhang <LI.ZHANG7@BAYER.COM>'
  },
  {
    value: 'zu',
    label: 'Zhenguo	You <ZHENGUO.YOU@BAYER.COM>'
  },
  {
    value: 'jg',
    label: 'Jingquan Guo <jingquan.guo@bayer.com>'
  }
]);

const apply_options = ref<SelectProps['options']>([
  {
    value: 'zs',
    label: 'Zhuo Chen <chen.zhuo@bayer.com>'
  },
  {
    value: 'sunz',
    label: 'Sun Zhe <sun.zhe@bayer.com>'
  },
  {
    value: 'CHTLL',
    label: 'Taili Lin <taili.lin@bayer.com>'
  },
  {
    value: 'sy',
    label: 'Suqin Yang <suqin.yang@bayer.com>'
  },
  {
    value: 'lz',
    label: 'Li Zhang <LI.ZHANG7@BAYER.COM>'
  },
  {
    value: 'zy',
    label: 'Zhenguo	You <ZHENGUO.YOU@BAYER.COM>'
  },
  {
    value: 'jg',
    label: 'Jingquan Guo <jingquan.guo@bayer.com>'
  }
]);

const options2 = ref<SelectProps['options']>([
  {
    value: 'rejected',
    label: 'Rejected'
  },
  {
    value: 'documented',
    label: 'Documented'
  },
  {
    value: 'cancelled',
    label: 'Cancelled'
    // disabled: true
  },
  {
    value: 'approved',
    label: 'Approved'
    // disabled: true
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

const apply_handleChange: SelectProps['onChange'] = value => {
  console.log(value); // { key: "lucy", label: "Lucy (101)" }
};

const disabledDate = (current: Dayjs) => {
  // Can not select days before today and today
  return current && current < dayjs().endOf('day');
};

const cc_handleChange = (value: string[]) => {
  console.log(`selected ${value}`);
};

// const provide_date = ref<Dayjs>();

const tex_value = ref<string>('');

const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a valid email!',
    number: '${label} is not a valid number!'
  },
  number: {
    range: '${label} must be between ${min} and ${max}'
  }
};

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
  <a-drawer title="给予礼品申请表" :size="size" :open="open" @close="onClose">
    <a-descriptions title="申请人信息">
      <a-descriptions-item label="填表人">Anna Lee</a-descriptions-item>
      <a-descriptions-item label="员工号">06568804</a-descriptions-item>
      <a-descriptions-item label="部门">SCM Compliance & Risk Mgmt</a-descriptions-item>
      <a-descriptions-item label="主管">Zhuo Chen</a-descriptions-item>
      <a-descriptions-item label="成本中心">HL20639010</a-descriptions-item>
      <a-descriptions-item label="DIVISION">PH</a-descriptions-item>
    </a-descriptions>

    <a-form :model="formState_apply" :validate-messages="validateMessages">
      <a-row :gutter="24">
        <a-col span="10">
          <a-form-item :name="['apply', 'name']" label="申请人" :rules="[{ required: true }]">
            <a-select
              v-model:value="formState_apply.apply.name"
              label-in-value
              :options="apply_options"
              @change="apply_handleChange"
            ></a-select>
          </a-form-item>
        </a-col>
        <a-col span="14">
          <a-form-item :name="['apply', 'cc_name']" label="抄送">
            <a-select
              mode="multiple"
              style="width: 100%"
              placeholder="请选择"
              :options="apply_cc_options"
              @change="cc_handleChange"
            ></a-select>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <a-descriptions title="政策提示" layout="vertical">
      <a-descriptions-item label="请注意，此处用于登记和记录：" :span="3">
        - 此处仅登记及记录提供给第三方的礼品
        <br />
        - 此处仅登记及记录除品牌提示物、医用物品和消费者促销礼品以外的其他礼品
        <br />
        -
        此处用于登记和记录向第三方提供公司合规政策明确允许的针对处方药事业部、健康消费品事业部的品牌提示物、医用物品，以及仅针对健康消费品事业部的消费者促销礼品、风俗礼品（少数情形）之外的其他礼品。该类其他礼品可以视个例的具体情形（如出于礼节提供象征性、非贵重的礼品）给予允许，但必须得到拜耳中国合规总监的事先批准。请注意销售、市场团队一般不得提供该类其他礼品。
        <br />
      </a-descriptions-item>
      <a-descriptions-item label="原则： " :span="3">
        员工提供给第三方礼品，应禁止索取、禁止不当影响、避免利益冲突、禁止现金或现金等价物、禁止私人利益
        <br />
        （第三方包括但不限于医疗卫生专业人士、政府官员、经销商及其他业务合作方）
        <br />
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
            <a-input v-model:value="formState_apply.apply.gift_unit_price" placeholder="请输入申请编号..."></a-input>
          </a-form-item>
        </a-col>
        <a-col span="5">
          <a-form-item name="['apply', 'gift_volume']" label="数量" :rules="[{ required: true }]">
            <a-input v-model:value="formState_apply.apply.gift_volume" placeholder="请输入申请编号..."></a-input>
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
              ref="select"
              v-model:value="formState_apply.apply.given_company"
              @focus="focus"
              @change="handleChange"
            >
              <a-select-option value="fs">Dachengxiaoshi Guanggao</a-select-option>
              <a-select-option value="lucy">Beijign Heping Hotel Co.,Ltd</a-select-option>
              <!-- <a-select-option value="disabled" disabled>Disabled</a-select-option> -->
              <!-- <a-select-option value="Yiminghe">yiminghe</a-select-option> -->
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col span="24">
          <a-form-item name="['apply', 'given_person']" label="接收者姓名" :rules="[{ required: true }]">
            <a-select
              mode="multiple"
              style="width: 100%"
              placeholder="请选择"
              :options="given_person_options"
              @change="cc_handleChange"
            ></a-select>
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
              <a-select
                ref="select"
                v-model:value="value1"
                :options="options1"
                @focus="focus"
                @change="handleChange"
              ></a-select>
            </a-form-item>
          </a-col>
          <a-col span="5">
            <a-form-item label="状态">
              <a-select
                ref="select"
                v-model:value="value2"
                :options="options2"
                @focus="focus"
                @change="handleChange"
              ></a-select>
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
      <template #bodyCell="{ column }">
        <template v-if="column.key === 'operation'">
          <a-button type="link">查看详细信息</a-button>
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
</style>
