import { request } from '../request';

/** get user routes */
export function fetchGetUserRoutes() {
  return request<Api.Route.UserRoute>({ url: '/sys/user/getUserRoutes' });
}

/**
 * whether the route is exist
 *
 * @param routeName route name
 */
export function fetchIsRouteExist(routeName: string) {
  return request<boolean>({ url: '/sys/isRouteExist', params: { routeName } });
}

export function fetchAllRoutes() {
  return request<Api.Route.MenuRoute>({ url: '/sys/getRouters' });
}
