/** The global namespace for the app */
declare namespace App {
  /** Theme namespace */
  namespace Theme {
    type ColorPaletteNumber = import('@sa/color-palette').ColorPaletteNumber;

    /** Theme token */
    type ThemeToken = {
      colors: ThemeTokenColor;
      boxShadow: {
        header: string;
        sider: string;
        tab: string;
      };
    };

    /** Theme setting */
    interface ThemeSetting {
      /** Theme scheme */
      themeScheme: UnionKey.ThemeScheme;
      /** Theme color */
      themeColor: string;
      /** Other color */
      otherColor: OtherColor;
      /** Whether info color is followed by the primary color */
      isInfoFollowPrimary: boolean;
      /** Layout */
      layout: {
        /** Layout mode */
        mode: UnionKey.ThemeLayoutMode;
        /** Scroll mode */
        scrollMode: UnionKey.ThemeScrollMode;
      };
      /** Page */
      page: {
        /** Whether to show the page transition */
        animate: boolean;
        /** Page animate mode */
        animateMode: UnionKey.ThemePageAnimateMode;
      };
      /** Header */
      header: {
        /** Header height */
        height: number;
        /** Header breadcrumb */
        breadcrumb: {
          /** Whether to show the breadcrumb */
          visible: boolean;
          /** Whether to show the breadcrumb icon */
          showIcon: boolean;
        };
      };
      /** Tab */
      tab: {
        /** Whether to show the tab */
        visible: boolean;
        /**
         * Whether to cache the tab
         *
         * If cache, the tabs will get from the local storage when the page is refreshed
         */
        cache: boolean;
        /** Tab height */
        height: number;
        /** Tab mode */
        mode: UnionKey.ThemeTabMode;
      };
      /** Fixed header and tab */
      fixedHeaderAndTab: boolean;
      /** Sider */
      sider: {
        /** Inverted sider */
        inverted: boolean;
        /** Sider width */
        width: number;
        /** Collapsed sider width */
        collapsedWidth: number;
        /** Sider width when the layout is 'vertical-mix' or 'horizontal-mix' */
        mixWidth: number;
        /** Collapsed sider width when the layout is 'vertical-mix' or 'horizontal-mix' */
        mixCollapsedWidth: number;
        /** Child menu width when the layout is 'vertical-mix' or 'horizontal-mix' */
        mixChildMenuWidth: number;
      };
      /** Footer */
      footer: {
        /** Whether to show the footer */
        visible: boolean;
        /** Whether fixed the footer */
        fixed: boolean;
        /** Footer height */
        height: number;
        /** Whether float the footer to the right when the layout is 'horizontal-mix' */
        right: boolean;
      };
    }

    interface OtherColor {
      info: string;
      success: string;
      warning: string;
      error: string;
    }

    interface ThemeColor extends OtherColor {
      primary: string;
    }

    type ThemeColorKey = keyof ThemeColor;

    type ThemePaletteColor = {
      [key in ThemeColorKey | `${ThemeColorKey}-${ColorPaletteNumber}`]: string;
    };

    type BaseToken = Record<string, Record<string, string>>;

    interface ThemeTokenColor extends ThemePaletteColor {
      nprogress: string;
      container: string;
      layout: string;
      inverted: string;
      base_text: string;
      [key: string]: string;
    }
  }

  /** Global namespace */
  namespace Global {
    type VNode = import('vue').VNode;
    type RouteLocationNormalizedLoaded = import('vue-router').RouteLocationNormalizedLoaded;
    type RouteKey = import('@elegant-router/types').RouteKey;
    type RouteMap = import('@elegant-router/types').RouteMap;
    type RoutePath = import('@elegant-router/types').RoutePath;
    type LastLevelRouteKey = import('@elegant-router/types').LastLevelRouteKey;

    /** The global header props */
    interface HeaderProps {
      /** Whether to show the logo */
      showLogo?: boolean;
      /** Whether to show the menu toggler */
      showMenuToggler?: boolean;
      /** Whether to show the menu */
      showMenu?: boolean;
    }

    /** The global menu */
    interface Menu {
      /**
       * The menu key
       *
       * Equal to the route key
       */
      key: string;
      /** The menu label */
      label: string;
      /** The menu i18n key */
      i18nKey?: I18n.I18nKey;
      /** The route key */
      routeKey: RouteKey;
      /** The route path */
      routePath: RoutePath;
      /** The menu icon */
      icon?: () => VNode;
      /** The tooltip title */
      title?: string;
      /** The menu children */
      children?: Menu[];
    }

    /** Tab route */
    type TabRoute = Pick<RouteLocationNormalizedLoaded, 'name' | 'path' | 'meta'> &
      Partial<Pick<RouteLocationNormalizedLoaded, 'fullPath' | 'query' | 'matched'>>;

    /** The global tab */
    type Tab = {
      /** The tab id */
      id: string;
      /** The tab label */
      label: string;
      /**
       * The new tab label
       *
       * If set, the tab label will be replaced by this value
       */
      newLabel?: string;
      /**
       * The old tab label
       *
       * when reset the tab label, the tab label will be replaced by this value
       */
      oldLabel?: string;
      /** The tab route key */
      routeKey: LastLevelRouteKey;
      /** The tab route path */
      routePath: RouteMap[LastLevelRouteKey];
      /** The tab route full path */
      fullPath: string;
      /** The tab fixed index */
      fixedIndex?: number;
      /**
       * Tab icon
       *
       * Iconify icon
       */
      icon?: string;
      /**
       * Tab local icon
       *
       * Local icon
       */
      localIcon?: string;
      /** I18n key */
      i18nKey?: I18n.I18nKey;
    };

    /** Form rule */
    type FormRule = import('ant-design-vue/es/form/interface.d.ts').Rule;

    /** The global dropdown key */
    type DropdownKey = 'closeCurrent' | 'closeOther' | 'closeLeft' | 'closeRight' | 'closeAll';
  }

  /**
   * I18n namespace
   *
   * Locales type
   */
  namespace I18n {
    type RouteKey = import('@elegant-router/types').RouteKey;

    type LangType = 'en-US' | 'zh-CN';

    type LangOption = {
      label: string;
      key: LangType;
    };

    type I18nRouteKey = Exclude<RouteKey, 'root' | 'not-found'>;

    type FormMsg = {
      required: string;
      invalid: string;
    };

    type PolicyDesc = {
      label: string;
      items: Array<PolicyDescItem>;
    };

    type PolicyDescItem = {
      value: string;
      items: Array<PolicyDescItem> | unknown;
    };

    type Schema = {
      system: {
        title: string;
      };
      common: {
        language: string;
        tip: string;
        add: string;
        addSuccess: string;
        list: string;
        edit: string;
        search: string;
        expand: string;
        shrink: string;
        enable: string;
        disable: string;
        status: string;
        save: string;
        copy: string;
        submit: string;
        approve: string;
        agreeApprove: string;
        rejectApprove: string;
        confirmApprove: string;
        saveDraft: string;
        reset: string;
        newGroupCreate: string;
        newApplyCreate: string;
        viewDetail: string;
        editSuccess: string;
        delete: string;
        deleteSuccess: string;
        batchDelete: string;
        confirm: string;
        cancel: string;
        confirmCancel: string;
        createdDate: string;
        lastModifiedDate: string;
        pleaseCheckValue: string;
        action: string;
        backToHome: string;
        lookForward: string;
        userCenter: string;
        logout: string;
        logoutConfirm: string;
        search: string;
        reset: string;
        operate: string;
        confirmDelete: string;
      };
      theme: {
        themeSchema: { title: string } & Record<UnionKey.ThemeScheme, string>;
        layoutMode: { title: string } & Record<UnionKey.ThemeLayoutMode, string>;
        themeColor: {
          title: string;
          followPrimary: string;
        } & Theme.ThemeColor;
        scrollMode: { title: string } & Record<UnionKey.ThemeScrollMode, string>;
        page: {
          animate: string;
          mode: { title: string } & Record<UnionKey.ThemePageAnimateMode, string>;
        };
        fixedHeaderAndTab: string;
        header: {
          height: string;
          breadcrumb: {
            visible: string;
            showIcon: string;
          };
        };
        tab: {
          visible: string;
          cache: string;
          height: string;
          mode: { title: string } & Record<UnionKey.ThemeTabMode, string>;
        };
        sider: {
          inverted: string;
          width: string;
          collapsedWidth: string;
          mixWidth: string;
          mixCollapsedWidth: string;
          mixChildMenuWidth: string;
        };
        footer: {
          visible: string;
          fixed: string;
          height: string;
          right: string;
        };
        themeDrawerTitle: string;
        pageFunTitle: string;
        configOperation: {
          copyConfig: string;
          copySuccessMsg: string;
          resetConfig: string;
          resetSuccessMsg: string;
        };
      };
      route: Record<I18nRouteKey, string>;
      page: {
        login: {
          common: {
            loginOrRegister: string;
            userNamePlaceholder: string;
            phonePlaceholder: string;
            codePlaceholder: string;
            passwordPlaceholder: string;
            confirmPasswordPlaceholder: string;
            codeLogin: string;
            confirm: string;
            back: string;
            validateSuccess: string;
            loginSuccess: string;
            welcomeBack: string;
          };
          pwdLogin: {
            title: string;
            rememberMe: string;
            forgetPassword: string;
            register: string;
            otherAccountLogin: string;
            otherLoginMode: string;
            superAdmin: string;
            admin: string;
            user: string;
          };
          codeLogin: {
            title: string;
            getCode: string;
            imageCodePlaceholder: string;
          };
          register: {
            title: string;
            agreement: string;
            protocol: string;
            policy: string;
          };
          resetPwd: {
            title: string;
          };
          bindWeChat: {
            title: string;
          };
        };
        about: {
          title: string;
          introduction: string;
          projectInfo: {
            title: string;
            version: string;
            latestBuildTime: string;
            githubLink: string;
            previewLink: string;
          };
          prdDep: string;
          devDep: string;
        };
        home: {
          greeting: string;
          weatherDesc: string;
          projectCount: string;
          todo: string;
          message: string;
          downloadCount: string;
          registerCount: string;
          schedule: string;
          study: string;
          work: string;
          rest: string;
          entertainment: string;
          visitCount: string;
          turnover: string;
          dealCount: string;
          projectNews: {
            title: string;
            moreNews: string;
            desc1: string;
            desc2: string;
            desc3: string;
            desc4: string;
            desc5: string;
          };
          creativity: string;
        };
        manageGroup: {
          applyForm: {
            groupRequestTitle: string;
            groupName: string;
            groupName_validation: string;
            fullName: string;
            fullName_validation: string;
            groupCode: string;
            groupCode_validation: string;
            bindPerson: string;
            bindPerson_validation: string;
            remark: string;
            remark_validation: string;
          };
        };
        manageUser: {
          applyForm: {
            userFirstName: string;
            userLastName: string;
            userChineseName: string;
            userEnglishName: string;
            userEmail: string;
          };
        };
        receivingHospitality: {
          applyForm: {
            receivingHospitalityRequestTitle: string;
            upload_person_label: string;
            remark: string;
            remark_validation: string;
            receivingHospitalityInfo: string;
            giftReason_label: string;
            giftReason_label_validation: string;
            giftReceivingDate: string;
            giftReceivingDate_validation: string;
            giftHospitalityType: string;
            giftHospitalityType_validation: string;
            giftExpensePerHead: string;
            giftExpensePerHead_validation: string;
            giftHeadCount: string;
            giftHeadCount_validation: string;
            giftEstimatedTotalExpense: string;
            giftEstimatedTotalExpense_validation: string;
            giftHospPlace: string;
            giftHospPlace_validation: string;
            giftHospEmployeeName: string;
            giftHospEmployeeName_validation: string;
            gitfHospEmployeeIsGoSoc: string;
            giftHospEmployeeIsBayerCustomer: string;
            giftHospTitle: string;
            giftHospTitle_validation: string;
            giftHospEmployeePop_HeadCount: string;
          };
        };
        givingHospitality: {
          applyForm: {
            givingHospitalityRequestTitle: string;
            upload_person_label: string;
            remark: string;
            remark_validation: string;
            givingHospitalityInfo: string;
            giftReason_label: string;
            giftReason_label_validation: string;
            giftGivingDate: string;
            giftGivingDate_validation: string;
            giftGivingCompanyName: string;
            giftGivingCompanyName_validation: string;
            giftHospitalityType: string;
            giftHospitalityType_validation: string;
            giftExpensePerHead: string;
            giftExpensePerHead_validation: string;
            giftHeadCount: string;
            giftHeadCount_validation: string;
            giftEstimatedTotalExpense: string;
            giftEstimatedTotalExpense_validation: string;
            giftHospPlace: string;
            giftHospPlace_validation: string;
            giftHospEmployeeName: string;
            giftHospEmployeeName_validation: string;
            gitfHospEmployeeIsGoSoc: string;
            giftHospEmployeeIsBayerCustomer: string;
            giftHospTitle: string;
            giftHospTitle_validation: string;
            giftHospEmployeePop_HeadCount: string;
            gitfHospNoGovLessThanNotify_message: string;
          };
          policy: {
            title: string;
            desc_1954: Array<PolicyDesc>;
            desc_1955: Array<PolicyDesc>;
            desc_0813: Array<PolicyDesc>;
            desc_0882: Array<PolicyDesc>;
            desc_1391: Array<PolicyDesc>;
            desc_2614: Array<PolicyDesc>;
          };
        };
        givingGifts: {
          applyForm: {
            givingGiftRequestTitle: string;
            upload_person_label: string;
            remark: string;
            remark_validation: string;
            givingGiftInfo: string;
            giftReason_label: string;
            giftReason_label_validation: string;
            giftReason_type_label: string;
            giftReason_type_label_validation: string;
            giftDesc_label: string;
            giftDesc_label_validation: string;
            giftDesc_type_label: string;
            giftDesc_type_label_validation: string;
            giftGivingDate: string;
            giftGivingDate_validation: string;
            giftGivingCompanyName: string;
            giftGivingCompanyName_validation: string;
            giftGivingEmployeeName: string;
            giftGivingEmployeeName_validation: string;
            giftGivingTitle: string;
            giftGivingTitle_validation: string;
            giftRecipientCategory: string;
            giftIsBayerCustomer: string;
            givingDesc_type_CH_division_noticeContent: string;
            givingDesc_type_option_medicine_noticeTitle: string;
            givingDesc_type_option_medicine_noticeContent: string;
            giftGiving_HCP_option_noticeTitle: string;
            givingGiving_HCP_option_noticeContent: string;
          };
          policy: {
            title: string;
            desc_1954: Array<PolicyDesc>;
            desc_1955: Array<PolicyDesc>;
            desc_0813: Array<PolicyDesc>;
            desc_0882: Array<PolicyDesc>;
            desc_1391: Array<PolicyDesc>;
            desc_2614: Array<PolicyDesc>;
          };
        };
        receivingGifts: {
          applyForm: {
            acceptGiftRequestTitle: string;
            upload_person_label: string;
            receivingGiftInfo: string;
            remark: string;
            remark_validation: string;
            usageScenairo: string;
            giftRecipient: string;
            giftGiverCompanyName: string;
            giftGiverCompanyName_validation: string;
            giftGiverEmployeeName: string;
            giftGiverEmployeeName_validation: string;
            giftGiverTitle: string;
            giftGiverTitle_validation: string;
            giftReceivingDate: string;
            giftReceivingDate_validation: string;
            giftReason_type_label: string;
            giftReason_type_label_validation: string;
            giftReason_label: string;
            giftReason_label_validation: string;
            giftDesc_label: string;
            giftDesc_label_validation: string;
            giftDesc_type_label: string;
            giftDesc_type_label_validation: string;
          };
          policy: {
            title: string;
            desc_1954: Array<PolicyDesc>;
            desc_1955: Array<PolicyDesc>;
            desc_0813: Array<PolicyDesc>;
            desc_0882: Array<PolicyDesc>;
            desc_1391: Array<PolicyDesc>;
          };
        };
        function: {
          tab: {
            tabOperate: {
              title: string;
              addTab: string;
              addTabDesc: string;
              closeTab: string;
              closeCurrentTab: string;
              closeAboutTab: string;
              addMultiTab: string;
              addMultiTabDesc1: string;
              addMultiTabDesc2: string;
            };
            tabTitle: {
              title: string;
              changeTitle: string;
              change: string;
              resetTitle: string;
              reset: string;
            };
          };
          multiTab: {
            routeParam: string;
            backTab: string;
          };
        };
        manage: {
          common: {
            status: {
              enable: string;
              disable: string;
            };
          };
          role: {
            title: string;
            roleName: string;
            roleName_validation: string;
            roleStatus: string;
            roleMenu: string;
            roleDesc: string;
            roleDesc_validation: string;
            bindPerson: string;
            form: {
              roleName: string;
              roleStatus: string;
            };
            common: {
              addTitle: string;
              editTitle: string;
            };
          };
          table: {
            index: string;
            desc: string;
            status: string;
            roleName: string;
          };
        };
      };
      form: {
        common: {
          option_yes: string;
          option_no: string;
          unitPrice: string;
          unitPrice_validation: string;
          quantity: string;
          quantity_validation: string;
          totalPrice: string;
          reference: string;
          reference_placeHolder: string;
          totalPrice_validation: string;
          cancelReson: string;
          approveComment: string;
          addPerson: string;
          viewPerson: string;
          historyLog: string;
          operationInfo: string;
          remarkInfo: string;
          option_draft: string;
          option_inProcess: string;
          option_complete: string;
          option_giftReason_Other: string;
          upload_file: string;
          upload_file_success: string;
          option_not_Applicable: string;
          upload_person_label: string;
          upload_template: string;
          user_manual: string;
          system_prompt: string;
          person_quantity_notMatch: string;
          option_giftReason_NewYear: string;
          option_giftReason_Mid_Autumn: string;
          option_Other: string;
          option_giftDesc_Company_Branded_Gift: string;
          option_giftDesc_General_Gift: string;
          option_giftDesc_Medicine: string;
          option_giftDesc_Cash_Equivalents: string;
          option_giftDesc_Present: string;
          option_giftDesc_Cultural_Courtesy: string;
          option_giftDesc_HCP_Promotional_Supplies: string;
          option_giftDesc_Promotional_Supplies: string;
          option_giftDesc_Other: string;
          option_go_sco_Government_Official: string;
          option_go_sco_Government_Non_Official: string;
          option_go_sco_Distributor: string;
          option_go_sco_HCP: string;
          select_validation: string;
        };
        searchFrom: {
          applyStatus: string;
          applyType: string;
          givingGifts: string;
          givingHospitality: string;
        };
        applicateInfo: {
          applicateInfoTitle: string;
          formFillerInfoTitle: string;
          formFiller: string;
          applyForCwid: string;
          formFiller_placeHolder: string;
          applyFor: string;
          applyFor_validation: string;
          applyFor_placeHolder: string;
          countryHead: string;
          deptHead: string;
          deptHead_validation: string;
          deptHead_tooltip: string;
          applyCC: string;
          applyDate: string;
          employeeNo: string;
          employeeLe: string;
          employeeLe_placeHolder: string;
          department: string;
          supervisor: string;
          costCenter: string;
          division: string;
        };

        userName: FormMsg;
        phone: FormMsg;
        pwd: FormMsg;
        code: FormMsg;
        email: FormMsg;
      };
      dropdown: Record<Global.DropdownKey, string>;
      icon: {
        themeConfig: string;
        themeSchema: string;
        lang: string;
        fullscreen: string;
        fullscreenExit: string;
        reload: string;
        collapse: string;
        expand: string;
        pin: string;
        unpin: string;
      };
    };

    type GetI18nKey<T extends Record<string, unknown>, K extends keyof T = keyof T> = K extends string
      ? T[K] extends Record<string, unknown>
      ? `${K}.${GetI18nKey<T[K]>}`
      : K
      : never;

    type I18nKey = GetI18nKey<Schema>;

    type TranslateOptions<Locales extends string> = import('vue-i18n').TranslateOptions<Locales>;

    interface $T {
      (key: I18nKey): string;
      (key: I18nKey, plural: number, options?: TranslateOptions<LangType>): string;
      (key: I18nKey, defaultMsg: string, options?: TranslateOptions<LangType>): string;
      (key: I18nKey, list: unknown[], options?: TranslateOptions<LangType>): string;
      (key: I18nKey, list: unknown[], plural: number): string;
      (key: I18nKey, list: unknown[], defaultMsg: string): string;
      (key: I18nKey, named: Record<string, unknown>, options?: TranslateOptions<LangType>): string;
      (key: I18nKey, named: Record<string, unknown>, plural: number): string;
      (key: I18nKey, named: Record<string, unknown>, defaultMsg: string): string;
    }
  }

  /** Service namespace */
  namespace Service {
    /** Other baseURL key */
    type OtherBaseURLKey = 'demo';

    interface ServiceConfigItem {
      /** The backend service base url */
      baseURL: string;
      /** The proxy pattern of the backend service base url */
      proxyPattern: string;
    }

    interface OtherServiceConfigItem extends ServiceConfigItem {
      key: OtherBaseURLKey;
    }

    /** The backend service config */
    interface ServiceConfig extends ServiceConfigItem {
      /** Other backend service config */
      other: OtherServiceConfigItem[];
    }

    interface SimpleServiceConfig extends Pick<ServiceConfigItem, 'baseURL'> {
      other: Record<OtherBaseURLKey, string>;
    }

    /** The backend service response data */
    type Response<T = unknown> = {
      /** The backend service response code */
      code: number;
      /** The backend service response message */
      message: string;
      /** The backend service response data */
      data: T;
    };

    /** The demo backend service response data */
    type DemoResponse<T = unknown> = {
      /** The backend service response code */
      status: string;
      /** The backend service response message */
      message: string;
      /** The backend service response data */
      result: T;
    };
  }
}
