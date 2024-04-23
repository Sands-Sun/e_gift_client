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

  namespace Gifts {
    interface GiftPerson {
      id: number;
      companyId: number;
      personName: string;
      description: string;
    }

    interface GiftCompany {
      id: number;
      companyName: string;
      description: string;
    }

    interface ReceivingGifts {
      applicationId: string;
      costCenter: string;
      createdDate: string;
      department: string;
      employeeLe: string;
      estimatedTotalValue: number;
      isExcluded: string;
      isHandedOver: string;
      isInvolved: string;
      markDeleted: string;
    }

    interface GivingGifts {
      applicationId: string;
      costCenter: string;
      createdDate: string;
      department: string;
      employeeLe: string;
      reference: string;
      isExcluded: string;
      markDeleted: string;
    }
    interface TableListResponse {
      list: Array<Object>;
      pageSize: number;
      total: number;
      currentPage: number;
    }
  }

  namespace Auth {
    interface SSO {
      url: string;
    }
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
      email: string;
      cwid: string;
      companyCode: string;
      costCenter: string;
      employeeId: string;
      orgTxt: string;
      positionTxt: string;
      supervisor: UserInfo;
      roles: string[];
      token: string;
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
