<script setup lang="ts">
import { $t } from '@/locales';
import { useAuthStore } from '@/store/modules/auth';

defineOptions({
  name: 'PwdLogin'
});
const authStore = useAuthStore();
const href = location.href;
if (href.includes('token')) {
  const token = href.split('token=');
  authStore.login(token[1]);
}

async function handleSubmit() {
  await authStore.login('handle');
}
</script>

<template>
  <AForm>
    <ASpace direction="vertical" size="large" class="w-full">
      <AButton type="primary" block size="large" shape="round" :loading="authStore.loginLoading" @click="handleSubmit">
        {{ $t('common.confirm') }}
      </AButton>
    </ASpace>
  </AForm>
</template>

<style scoped></style>
