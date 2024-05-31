<script setup lang="ts">
defineOptions({
  name: 'GlobalLogo'
});

interface Props {
  /** Whether to show the title */
  showTitle?: boolean;
}

withDefaults(defineProps<Props>(), {
  showTitle: true
});
</script>

<template>
  <RouterLink to="/" class="w-full flex-center nowrap-hidden">
    <!-- <SystemLogo class="text-32px text-primary" /> -->
    <img src="@/assets/svg-icon/logo.svg" height="40px" width="40px" />
    <h2 v-show="showTitle" class="pl-8px text-16px text-primary font-bold transition duration-300 ease-in-out">
      E-Gift/Hospitality
    </h2>
  </RouterLink>
</template>

<style scoped></style>
