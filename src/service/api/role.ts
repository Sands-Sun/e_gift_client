import { request } from '../request';

export function fetchRole(params: any) {
  return request<any>({
    url: '/sys/getRoles',
    method: 'post',
    data: params
  });
}

export function saveRole(params: any) {
  return request<any>({
    url: '/sys/saveRole',
    method: 'post',
    data: params
  });
}

export function deleteRole(params: any) {
  return request<any>({
    url: '/sys/deleteRole',
    method: 'post',
    data: params
  });
}
