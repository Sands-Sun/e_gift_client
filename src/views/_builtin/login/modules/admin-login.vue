<script setup lang="ts">
import { useAntdForm, useFormRules } from '@/hooks/common/form';
import { useRouterPush } from '@/hooks/common/router';
import { $t } from '@/locales';
import { useAuthStore } from '@/store/modules/auth';
import { reactive } from 'vue';

defineOptions({
  name: 'AdminLogin'
});

const authStore = useAuthStore();
const { toggleLoginModule } = useRouterPush();
const { formRef, validate } = useAntdForm();
const { constantRules } = useFormRules();

interface FormModel {
  userName: string;
  password: string;
}

const model: FormModel = reactive({
  userName: '',
  password: ''
});

const rules: Record<keyof FormModel, App.Global.FormRule[]> = {
  userName: constantRules.userName,
  password: constantRules.pwd
};

async function handleSubmit() {
  await validate();
  await authStore.adminLogin(model.userName, model.password);
}
</script>

<template>
  <AForm ref="formRef" :model="model">
    <AFormItem name="userName">
      <AInput v-model:value="model.userName" size="large" :placeholder="$t('page.login.common.userNamePlaceholder')" />
    </AFormItem>
    <AFormItem name="password">
      <AInputPassword
        v-model:value="model.password"
        size="large"
        :placeholder="$t('page.login.common.passwordPlaceholder')"
      />
    </AFormItem>
    <ASpace direction="vertical" size="large" class="w-full">
      <AButton type="primary" block size="large" shape="round" :loading="authStore.loginLoading" @click="handleSubmit">
        {{ $t('route.login') }}
      </AButton>
    </ASpace>
  </AForm>
</template>

<style scoped></style>
