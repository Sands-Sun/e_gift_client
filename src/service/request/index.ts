// import { useRouterPush } from '@/hooks/common/router';
import { useAuthStore } from '@/store/modules/auth';
import { getServiceBaseURL } from '@/utils/service';
import { localStg } from '@/utils/storage';
import { BACKEND_ERROR_CODE, createFlatRequest, createRequest } from '@sa/axios';
const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'N';
const { baseURL, otherBaseURL } = getServiceBaseURL(import.meta.env, isHttpProxy);
export const request = createFlatRequest<App.Service.Response>(
  {
    baseURL,
    headers: {
      apifoxToken: 'XL299LiMEDZ0H5h3A29PxwQXdMJqWyY2'
    }
  },
  {
    async onRequest(config) {
      const { headers } = config;

      // set token
      const token = localStg.get('token');
      // const Authorization = token ? `Bearer ${token}` : null;
      // Object.assign(headers, { Authorization });
      Object.assign(headers, { token });

      return config;
    },
    isBackendSuccess(response) {
      // when the backend response code is "0000", it means the request is success
      // you can change this logic by yourself
      return response.data.code === 0;
    },
    async onBackendFail(_response) {
      // when the backend response code is not "0000", it means the request is fail
      // for example: the token is expired, refresh token and retry request
    },
    transformBackendResponse(response) {
      return response.data.data;
    },
    onError(error) {
      // debugger;
      // when the request is fail, you can show error message
      let message = error.message;

      // show backend error message
      if (error.code === BACKEND_ERROR_CODE || error.response?.status === 401) {
        message = error.response?.data?.message || message;
      }
      window.$message?.error(message);

      if (error.response?.status === 401) {
        console.log('no access', error);
        const authStore = useAuthStore();
        authStore.resetStore();
      }
    }
  }
);

export const demoRequest = createRequest<App.Service.DemoResponse>(
  {
    baseURL: otherBaseURL.demo
  },
  {
    async onRequest(config) {
      const { headers } = config;

      // set token
      const token = localStg.get('token');
      const Authorization = token ? `Bearer ${token}` : null;
      Object.assign(headers, { Authorization });

      return config;
    },
    isBackendSuccess(response) {
      // when the backend response code is "200", it means the request is success
      // you can change this logic by yourself
      return response.data.status === '200';
    },
    async onBackendFail(_response) {
      // when the backend response code is not "200", it means the request is fail
      // for example: the token is expired, refresh token and retry request
    },
    transformBackendResponse(response) {
      return response.data.result;
    },
    onError(error) {
      // when the request is fail, you can show error message

      let message = error.message;

      // show backend error message
      if (error.code === BACKEND_ERROR_CODE) {
        message = error.response?.data?.message || message;
      }

      window.$message?.error(message);
    }
  }
);
