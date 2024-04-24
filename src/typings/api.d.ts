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
    interface GiftGroup {
      id: number;
      groupCode: string;
      groupName: string;
      fullName: string;
      markDeleted: string;
      remark: string;
      userToGroups: unknown[];
    }

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
      sfUserAppliedName: string;
      sfUserAppliedCwid: string;
      sfUserAppliedEmail: string;
      sfUserIdAppliedFor: string;
      copyToUsers: unknown[];
      costCenter: string;
      createdDate: string;
      givingDate: string;
      department: string;
      employeeLe: string;
      estimatedTotalValue: number;
      isExcluded: string;
      isHandedOver: string;
      isInvolved: string;
      markDeleted: string;
      unitValue: number;
      volume: number;
      remark: string;
      reason: string;
      reasonType: string;
      reference: string;
      status: string;
      giftsActivities: ReceivingActivity[];
      giftsRef: ReceivingGiftRef;
    }

    interface ReceivingActivity {
      action: string;
      appActivityDataId: number;
      applicationId: number;
      createdDate: string;
      lastModifiedDate: string;
      userEmail: string;
      userFirstName: string;
      userLastName: string;
      remark: string;
    }

    interface ReceivingGiftRef {
      giftDesc: string;
      giftDescType: string;
      givingCompany: string;
      unitValue: number;
      volume: number;
      givingDate: unknown;
      giftsPersons: unknown[];
      givingPerson: string;
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
      list: unknown[];
      pageSize: number;
      totalCount: number;
      currPage: number;
    }

    interface DataItem {
      applicationId: string;
      apply: string;
      date: string;
      cwid: string;
      dept: string;
      leCode: string;
      type: string;
      status: string;
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
      division: string;
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
