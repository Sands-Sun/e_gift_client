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

  namespace Common {
    type EnableStatus = '0' | '1';
    interface PaginatingCommonParams {
      /** current page number */
      current: number;
      /** page size */
      size: number;
      /** total count */
      total: number;
    }

    /** common record */
    type CommonRecord<T = any> = {
      /** record id */
      id: number;
      /** record creator */
      createBy: string;
      /** record create time */
      createTime: string;
      /** record updater */
      updateBy: string;
      /** record update time */
      updateTime: string;
      /** record status */
      status: EnableStatus;
    } & T;
  }

  namespace SystemManage {
    type CommonSearchParams = Pick<Common.PaginatingCommonParams, 'current' | 'size'>;
    /** role */
    type Role = Common.CommonRecord<{
      /** role name */
      roleName: string;
      /** role code */
      roleCode: string;
      /** role description */
      roleDesc: string;
    }>;
    /** role search params */
    type RoleSearchParams = Partial<
      Pick<Api.SystemManage.Role, 'roleName' | 'roleCode' | 'status'> & CommonSearchParams
    >;
  }
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
