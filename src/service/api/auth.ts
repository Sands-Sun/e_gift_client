import { request } from '../request';

/**
 * Login
 *
 * @param CWID User CWID
 * @param password Password
 */
export function fetchLogin(CWID: string, password: string) {
  return request<Api.Auth.LoginToken>({
    url: '/sys/login',
    method: 'post',
    data: {
      CWID,
      password
    }
  });
}

/** Get user info */
export function fetchGetUserInfo() {
  return request<Api.Auth.UserInfo>({ url: '/sys/user/getUserInfo' });
}

/** Get user info by id */
export function fetchGetUserInfoById(userId: string) {
  return request<Api.Auth.UserInfo>({ url: `/sys/user/get/${userId}` });
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
