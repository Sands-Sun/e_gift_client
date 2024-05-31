import { SetupStoreId } from '@/enum';
import { useRouterPush } from '@/hooks/common/router';
import { $t } from '@/locales';
import { fetchAdminLogin, fetchGetUserInfo, fetchLogin } from '@/service/api';
import { localStg } from '@/utils/storage';
import { useLoading } from '@sa/hooks';
import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import { useRouteStore } from '../route';
import { clearAuthStorage, getToken, getUserInfo } from './shared';

export const useAuthStore = defineStore(SetupStoreId.Auth, () => {
  const routeStore = useRouteStore();
  const { route, toLogin, redirectFromLogin } = useRouterPush(false);
  const { loading: loginLoading, startLoading, endLoading } = useLoading();

  const token = ref(getToken());

  const userInfo: Api.Auth.UserInfo = reactive(getUserInfo());

  /** Is login */
  const isLogin = computed(() => Boolean(token.value));

  /** Reset auth store */
  async function resetStore() {
    const authStore = useAuthStore();

    clearAuthStorage();

    authStore.$reset();

    if (!route.value.meta.constant) {
      await toLogin();
    }

    routeStore.resetStore();
  }

  /**
   * Login
   *
   * @param userName User name
   * @param password Password
   */
  async function adminLogin(userName: string, password: string) {
    startLoading();
    // debugger;
    const { data: loginToken, error } = await fetchAdminLogin(userName, password);

    if (!error) {
      const pass = await loginByToken(loginToken.token);

      if (pass) {
        await routeStore.initAuthRoute();

        await redirectFromLogin();

        if (routeStore.isInitAuthRoute) {
          window.$notification?.success({
            message: $t('page.login.common.loginSuccess'),
            description: $t('page.login.common.welcomeBack', {
              userName: `${userInfo.firstName}  ${userInfo.lastName}`
            })
          });
        }
      }
    } else {
      resetStore();
    }

    endLoading();
  }

  /** SSO Login */
  async function login(type: string) {
    startLoading();
    // debugger;
    if (type === 'handle') {
      const { data: url, error } = await fetchLogin();
      if (!error) {
        location.href = url;
      } else {
        resetStore();
      }
    } else {
      // 获取用户信息
      localStg.set('token', type);
      const { data: info, error } = await fetchGetUserInfo(type);

      if (!error) {
        // 2. store user info
        localStg.set('userInfo', info);

        // 3. update auth route
        token.value = type;
        Object.assign(userInfo, info);

        await routeStore.initAuthRoute();

        await redirectFromLogin();

        if (routeStore.isInitAuthRoute) {
          window.$notification?.success({
            message: $t('page.login.common.loginSuccess'),
            description: $t('page.login.common.welcomeBack', {
              userName: `${userInfo.firstName}  ${userInfo.lastName}`
            })
          });
        }
      } else {
        resetStore();
      }
    }

    endLoading();
  }

  async function login1() {
    startLoading();
    // debugger;
    const { data: loginToken, error } = await fetchLogin();

    if (!error) {
      const pass = await loginByToken(loginToken);

      if (pass) {
        await routeStore.initAuthRoute();

        await redirectFromLogin();

        if (routeStore.isInitAuthRoute) {
          window.$notification?.success({
            message: $t('page.login.common.loginSuccess'),
            description: $t('page.login.common.welcomeBack', {
              userName: `${userInfo.firstName}  ${userInfo.lastName}`
            })
          });
        }
      }
    } else {
      resetStore();
    }

    endLoading();
  }

  async function loginByToken(loginToken: string) {
    // 1. stored in the localStorage, the later requests need it in headers
    localStg.set('token', loginToken);
    // localStg.set('refreshToken', loginToken.refreshToken);

    const { data: info, error } = await fetchGetUserInfo(loginToken);

    if (!error) {
      // 2. store user info
      localStg.set('userInfo', info);

      // 3. update auth route
      token.value = loginToken;
      Object.assign(userInfo, info);

      return true;
    }

    return false;
  }

  return {
    token,
    userInfo,
    isLogin,
    loginLoading,
    resetStore,
    login,
    adminLogin
  };
});
