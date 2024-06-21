<script setup lang="ts">
import { $t } from '@/locales';
import { getServiceBaseURL } from '@/utils/service';
const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'N';
const { baseURL } = getServiceBaseURL(import.meta.env, isHttpProxy);

defineOptions({
  name: 'UserManual'
});
</script>

<template>
  <a-button
    type="link"
    :href="`${baseURL}/sys/download/template?module=UserManual&fileName=E-Gift-Hospitality-UserManual-V1.1.pdf`"
  >
    {{ $t('form.common.user_manual') }}
  </a-button>
</template>
