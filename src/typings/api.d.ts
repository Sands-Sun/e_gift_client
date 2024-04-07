/**
 * Namespace Api
 *
 * All backend api type
 */
declare namespace Api {
  /**
   * Namespace Auth
   *
   * Backend api module: "auth"
   */

  namespace Auth {
    interface LoginToken {
      token: string;
      userId: number;
      state: string;
      createTime: string;
      expireTime: string;
      refreshToken: string;
    }

    interface UserInfo {
      sfUserId: string;
      firstName: string;
      lastName: string;
      roles: string[];
    }
  }

  /**
   * Namespace Route
   *
   * Backend api module: "route"
   */
  namespace Route {
    type ElegantConstRoute = import('@elegant-router/types').ElegantConstRoute;

    interface MenuRoute extends ElegantConstRoute {
      id: string;
    }

    interface UserRoute {
      routes: MenuRoute[];
      home: import('@elegant-router/types').LastLevelRouteKey;
    }
  }
}
