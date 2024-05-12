import { request } from '../request';

/**
 * Login
 *
 * @param CWID User CWID
 * @param password Password
 */
export function fetchLogin() {
  return request<Api.Auth.SSO>({
    url: '/sys/azureLogin',
    method: 'get'
  });
}

/** Get user info */
export function fetchGetUserInfo(token: string) {
  return request<Api.Auth.UserInfo>({ url: '/sys/user/getUserInfo', method: 'get', params: { token } });
}

/**
 * Refresh token
 *
 * @param refreshToken Refresh token
 */
export function fetchRefreshToken(refreshToken: string) {
  return request<Api.Auth.LoginToken>({
    url: '/auth/refreshToken',
    method: 'post',
    data: {
      refreshToken
    }
  });
}

export function fetchDebug() {
  return request<string>({
    url: '/debug-post',
    method: 'post',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: {
      a: '1'
    }
  });
}
