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
      isGoSoc: string;
      isBayerCustomer: string;
      personName: string;
      positionTitle: string;
      description: string;
      key: number;
    }

    interface GiftCompany {
      id: number;
      companyName: string;
      description: string;
      personList: GiftPerson[];
      key: number;
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
      fileAttach: FileAttach;
      giftsActivities: ReceivingActivity[];
      giftsRef: ReceivingGiftRef;
      companyList: GiftCompany[];
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
      givingDate: string;
      giftsPersons: unknown[];
      givingPerson: string;
    }

    interface GivingHospitalityRef {
      hospitalityType: string;
      expensePerHead: number;
      headCount: number;
      hospitalityDate: string;
      hospPlace: string;
    }

    interface GivingHospitality {
      applicationId: string;
      sfUserAppliedName: string;
      sfUserAppliedCwid: string;
      sfUserAppliedEmail: string;
      sfUserIdAppliedFor: string;
      copyToUsers: unknown[];
      costCenter: string;
      createdDate: string;
      department: string;
      employeeLe: string;
      reference: string;
      unitValue: number;
      volume: number;
      remark: string;
      reason: string;
      reasonType: string;
      status: string;
      companyList: GiftCompany[];
      fileAttach: FileAttach;
      hospRef: GivingHospitalityRef;
      hospActivities: GivingHospitalityActivity[];
    }

    interface GivingGifts {
      applicationId: string;
      sfUserAppliedName: string;
      sfUserAppliedCwid: string;
      sfUserAppliedEmail: string;
      sfUserIdAppliedFor: string;
      copyToUsers: unknown[];
      costCenter: string;
      createdDate: string;
      department: string;
      employeeLe: string;
      reference: string;
      isExcluded: string;
      markDeleted: string;
      unitValue: number;
      volume: number;
      remark: string;
      reason: string;
      reasonType: string;
      status: string;
      companyList: GiftCompany[];
      fileAttach: FileAttach;
      giftsRef: GivingGiftRef;
      giftsActivities: GivingActivity[];
    }

    interface FileAttach {
      id: string;
      fileName: string;
      filePath: string;
      fileSize: string;
      fileType: string;
      origFileName: string;
    }

    interface GivingGiftRef {
      giftDesc: string;
      giftDescType: string;
      attachmentFile: string;
      attachmentFileName: string;
      unitValue: number;
      volume: number;
      isGoSoc: string;
      isBayerCustomer: string;
      givenDate: string;
      givenCompany: string;
      giftsPersons: GiftPerson[];
      givenPerson: string;
    }

    interface GivingActivity {
      action: string;
      appActivityDataId: number;
      applicationId: number;
      createdDate: string;
      lastModifiedDate: string;
      sfActivityInsId: number;
      sfProcessInsId: number;
      sfUserIdSubmitter: number;
      userEmail: string;
      userFirstName: string;
      userLastName: string;
      remark: string;
    }

    interface GivingHospitalityActivity {
      action: string;
      appActivityDataId: number;
      applicationId: number;
      createdDate: string;
      lastModifiedDate: string;
      sfActivityInsId: number;
      sfProcessInsId: number;
      sfUserIdSubmitter: number;
      userEmail: string;
      userFirstName: string;
      userLastName: string;
      remark: string;
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
      chineseName: string;
      email: string;
      cwid: string;
      companyCode: string;
      costCenter: string;
      employeeId: string;
      orgTxt: string;
      positionTxt: string;
      oUDescription: string;
      division: string;
      markDeleted: string;
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
