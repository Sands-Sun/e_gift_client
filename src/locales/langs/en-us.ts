const local: App.I18n.Schema = {
  system: {
    title: 'E-Gift/Hospitality System'
  },
  common: {
    tip: 'Tip',
    add: 'Add',
    addSuccess: 'Add Success',
    list: 'List',
    edit: 'Edit',
    search: 'Search',
    expand: 'Expand',
    shrink: 'Shrink',
    enable: 'Enable',
    disable: 'Disable',
    status: 'Status',
    save: 'Save',
    copy: 'Copy',
    submit: 'Submit',
    approve: 'Approve',
    agreeApprove: 'Argee',
    rejectApprove: 'Reject',
    confirmApprove: 'Confirm Approve?',
    saveDraft: 'Save Draft',
    reset: 'Reset',
    newGroupCreate: 'New User Group',
    newApplyCreate: 'New Application',
    viewDetail: 'View Detail',
    editSuccess: 'Edit Success',
    delete: 'Delete',
    deleteSuccess: 'Delete Success',
    batchDelete: 'Batch Delete',
    confirm: 'Confirm',
    cancel: 'Cancel',
    confirmCancel: 'Confirm Cancel ?',
    createdDate: 'Created Date',
    lastModifiedDate: 'Last Modified Date',
    pleaseCheckValue: 'Please check whether the value is valid',
    action: 'Action',
    backToHome: 'Back to home',
    lookForward: 'Coming soon',
    userCenter: 'User Center',
    logout: 'Logout',
    logoutConfirm: 'Are you sure you want to log out?',
    operate: 'operate',
    confirmDelete: 'Are you sure you want delete this record?'
  },
  theme: {
    themeSchema: {
      title: 'Theme Schema',
      light: 'Light',
      dark: 'Dark',
      auto: 'Follow System'
    },
    layoutMode: {
      title: 'Layout Mode',
      vertical: 'Vertical Menu Mode',
      horizontal: 'Horizontal Menu Mode',
      'vertical-mix': 'Vertical Mix Menu Mode',
      'horizontal-mix': 'Horizontal Mix menu Mode'
    },
    themeColor: {
      title: 'Theme Color',
      primary: 'Primary',
      info: 'Info',
      success: 'Success',
      warning: 'Warning',
      error: 'Error',
      followPrimary: 'Follow Primary'
    },
    scrollMode: {
      title: 'Scroll Mode',
      wrapper: 'Wrapper',
      content: 'Content'
    },
    page: {
      animate: 'Page Animate',
      mode: {
        title: 'Page Animate Mode',
        fade: 'Fade',
        'fade-slide': 'Slide',
        'fade-bottom': 'Fade Zoom',
        'fade-scale': 'Fade Scale',
        'zoom-fade': 'Zoom Fade',
        'zoom-out': 'Zoom Out',
        none: 'None'
      }
    },
    fixedHeaderAndTab: 'Fixed Header And Tab',
    header: {
      height: 'Header Height',
      breadcrumb: {
        visible: 'Breadcrumb Visible',
        showIcon: 'Breadcrumb Icon Visible'
      }
    },
    tab: {
      visible: 'Tab Visible',
      cache: 'Tab Cache',
      height: 'Tab Height',
      mode: {
        title: 'Tab Mode',
        chrome: 'Chrome',
        button: 'Button'
      }
    },
    sider: {
      inverted: 'Dark Sider',
      width: 'Sider Width',
      collapsedWidth: 'Sider Collapsed Width',
      mixWidth: 'Mix Sider Width',
      mixCollapsedWidth: 'Mix Sider Collapse Width',
      mixChildMenuWidth: 'Mix Child Menu Width'
    },
    footer: {
      visible: 'Footer Visible',
      fixed: 'Fixed Footer',
      height: 'Footer Height',
      right: 'Right Footer'
    },
    themeDrawerTitle: 'Theme Configuration',
    pageFunTitle: 'Page Function',
    configOperation: {
      copyConfig: 'Copy Config',
      copySuccessMsg: 'Copy Success, Please replace the variable "themeSettings" in "src/theme/settings.ts"',
      resetConfig: 'Reset Config',
      resetSuccessMsg: 'Reset Success'
    }
  },
  route: {
    login: 'Login',
    403: 'No Permission',
    404: 'Page Not Found',
    500: 'Server Error',
    home: 'Home',
    'user-center': 'User Center',
    about: 'About',
    inbox: 'inbox',
    function: 'System Function',
    function_tab: 'Tab',
    'function_multi-tab': 'Multi Tab',
    'function_hide-child': 'Hide Child',
    'function_hide-child_one': 'Hide Child',
    'function_hide-child_two': 'Two',
    'function_hide-child_three': 'Three',
    apply: 'Apply for',
    'apply_giving-gifts': 'Giving Gifts',
    'apply_receving-gifts': 'Receving Gifts',
    'apply_giving-hospitality': 'Giving Hospitality',
    'apply_receving-hospitality': 'Receving Hospitality',
    manage: 'System MGT',
    manage_user: 'User MGT',
    'manage_user-detail': 'User Detail',
    manage_role: 'Role MGT',
    manage_group: 'Group MGT',
    manage_route: 'Route MGT',
    manage_function: 'Function MGT',
    'multi-menu': 'Multi Menu',
    'multi-menu_first': 'Menu One',
    'multi-menu_first_child': 'Menu One Child',
    'multi-menu_second': 'Menu Two',
    'multi-menu_second_child': 'Menu Two Child',
    'multi-menu_second_child_home': 'Menu Two Child Home',
    exception: 'Exception',
    exception_403: '403',
    exception_404: '404',
    exception_500: '500'
  },
  page: {
    login: {
      common: {
        loginOrRegister: 'Login / Register',
        userNamePlaceholder: 'Please enter user name',
        phonePlaceholder: 'Please enter phone number',
        codePlaceholder: 'Please enter verification code',
        passwordPlaceholder: 'Please enter password',
        confirmPasswordPlaceholder: 'Please enter password again',
        codeLogin: 'Verification code login',
        confirm: 'Confirm',
        back: 'Back',
        validateSuccess: 'Verification passed',
        loginSuccess: 'Login successfully',
        welcomeBack: 'Welcome back, {userName} !'
      },
      pwdLogin: {
        title: 'Password Login',
        rememberMe: 'Remember me',
        forgetPassword: 'Forget password?',
        register: 'Register',
        otherAccountLogin: 'Other Account Login',
        otherLoginMode: 'Other Login Mode',
        superAdmin: 'Super Administrator',
        admin: 'Administrator',
        user: 'Ordinary User'
      },
      codeLogin: {
        title: 'Verification Code Login',
        getCode: 'Get verification code',
        imageCodePlaceholder: 'Please enter image verification code'
      },
      register: {
        title: 'Register',
        agreement: 'I have read and agree to',
        protocol: '《User Agreement》',
        policy: '《Privacy Policy》'
      },
      resetPwd: {
        title: 'Reset Password'
      },
      bindWeChat: {
        title: 'Bind WeChat'
      }
    },
    about: {
      title: 'About',
      introduction: `Soybean Admin is an elegant and powerful admin template, based on the latest front-end technology stack, including Vue3, Vite5, TypeScript, Pinia and UnoCSS. It has built-in rich theme configuration and components, strict code specifications, and an automated file routing system. In addition, it also uses the online mock data solution based on ApiFox. Soybean Admin provides you with a one-stop admin solution, no additional configuration, and out of the box. It is also a best practice for learning cutting-edge technologies quickly.`,
      projectInfo: {
        title: 'Project Info',
        version: 'Version',
        latestBuildTime: 'Latest Build Time',
        githubLink: 'Github Link',
        previewLink: 'Preview Link'
      },
      prdDep: 'Production Dependency',
      devDep: 'Development Dependency'
    },
    home: {
      greeting: '{userName}, welcome to use e-Gift/Hospitality system !',
      weatherDesc: 'Today is cloudy to clear, 20℃ - 25℃!',
      projectCount: 'Project Count',
      todo: 'Todo',
      message: 'Message',
      downloadCount: 'Download Count',
      registerCount: 'Register Count',
      schedule: 'Work and rest Schedule',
      study: 'Study',
      work: 'Work',
      rest: 'Rest',
      entertainment: 'Entertainment',
      visitCount: 'Visit Count',
      turnover: 'Turnover',
      dealCount: 'Deal Count',
      projectNews: {
        title: 'Project News',
        moreNews: 'More News',
        desc1: 'Soybean created the open source project soybean-admin on May 28, 2021!',
        desc2: 'Yanbowe submitted a bug to soybean-admin, the multi-tab bar will not adapt.',
        desc3: 'Soybean is ready to do sufficient preparation for the release of soybean-admin!',
        desc4: 'Soybean is busy writing project documentation for soybean-admin!',
        desc5: 'Soybean just wrote some of the workbench pages casually, and it was enough to see!'
      },
      creativity: 'Creativity'
    },
    manageGroup: {
      applyForm: {
        groupRequestTitle: 'User Group Management',
        groupName: 'Group Name',
        groupName_validation: 'Please input group name',
        fullName: 'Full Name',
        fullName_validation: 'Please input full name',
        groupCode: 'Group Code',
        groupCode_validation: 'Please input group code',
        bindPerson: 'Bind Person',
        bindPerson_validation: 'Please select bind person',
        remark: 'Remark',
        remark_validation: 'Please input remark'
      }
    },
    manageUser: {
      applyForm: {
        userFirstName: 'first name',
        userLastName: 'last name',
        userChineseName: 'chinese name',
        userEnglishName: 'english name',
        userEmail: 'email'
      }
    },
    givingHospitality: {
      applyForm: {
        givingHospitalityRequestTitle: 'New Giving Hospitality Request Form',
        remark: 'Remarks',
        remark_validation: 'Please fill in hospitality remarks',
        givingHospitalityInfo: 'Giving Hospitality Information',
        giftReason_label: 'Why are you going to provide this hospitable activity',
        giftReason_label_validation: 'Please input provide this hopitable reson',
        giftGivingDate: 'Date of Activity',
        giftGivingDate_validation: 'Please select date of activity',
        giftHospitalityType: 'Please describe the hospitable activity',
        giftHospitalityType_validation: 'Such as: meals, tea breaks, etc',
        giftExpensePerHead: 'Estimated expense per head',
        giftExpensePerHead_validation: 'Please input estimated expense per head',
        giftHeadCount: 'Number of invitees',
        giftHeadCount_validation: 'Please input number of invitees',
        giftEstimatedTotalExpense: 'Estimated total expense',
        giftEstimatedTotalExpense_validation: 'Please input estimated total expense',
        giftHospPlace: 'Name of the place',
        giftHospPlace_validation: 'Please input take place',
        giftHospEmployeeName: 'Name of recipient',
        giftHospEmployeeName_validation: 'Please input recipient name',
        gitfHospEmployeeIsGoSoc: 'Categories of recipients',
        giftHospEmployeeIsBayerCustomer: 'Is the recipient a current Bayer customer?',
        giftHospTitle: 'person title',
        giftHospTitle_validation: 'Please input person title',
        giftHospEmployeePop_HeadCount: 'invitees',
        gitfHospNoGovLessThanNotify_message:
          'For non-government officials, if the per capita cost of hospitality is less than RMB 300, they do not need to apply for the E-Gift/Hospitality system. You can reimburse directly in Concur.'
      },
      policy: {
        title: 'Policy Reminder',
        desc_1954: [
          {
            label: 'Please note that this function is to register and record',
            items: [
              {
                value:
                  'In exceptional cases during daily business, employees to provide Hospitality of meal to HCP, Government Officials and Distributors which exceeds CNY 300 per person per time (incl. beverages and service charge). Such kind of Hospitality requires special approval in advance by the authorized Approvers (Please select one in above "Approver"). When the approval is acquired and the Hospitality is completed, the Requester should claim reimbursement linking to the corresponding e-Gift/Hospitality application in the reimbursement system.',
                items: []
              },
              {
                value:
                  'During daily business, employees to provide Hospitality of meal to any Third Party other than HCP, Government Officials and Distributors which exceeds CNY 300 per person per time (incl. beverages and service charge). Such kind of Hospitality does not require special approval. When the record is input and the Hospitality is completed, the Requester should apply for reimbursement linking to the corresponding e-Gift/Hospitality record in the reimbursement system. (For Hospitality provided to Third Party during daily business that is below or equal to CNY 300 per person per time (incl. beverages and service charge), employees can directly apply for reimbursement in the reimbursement system.)',
                items: []
              }
            ]
          },
          {
            label: 'Principle',
            items: [
              {
                value:
                  'Employees giving Hospitality to a Third Party, it required no Solicitation, no Inappropriate Influence Avoid Conflicts of Interest, no Cash or Cash Equivalents and no Private Benefit',
                items: []
              },
              {
                value:
                  '(Third Party/Parties include, but are not limited to HCPs, government officials, distributors and other business partners)',
                items: []
              }
            ]
          },
          {
            label: 'Requester should comply with below compliance regulations',
            items: [
              {
                value:
                  'Giving Hospitality to HCPs, Government Officials and Distributors, the Criteria is <= CNY 300 per person per time (including drinks and service charge)',
                items: []
              },
              {
                value:
                  'Only on very rare occasions with appropriate reasons, the Hospitality provided to HCPs, Government Officials and Distributors may exceed CNY 300 per person, and requires upfront approval by the Head of Compliance China, or the China Head of Pharmaceuticals / Consumer Health, or the Regional Managing Directors for Pharmaceuticals or the Head of Field Sales for Consumer Health.',
                items: []
              },
              {
                value:
                  'For meals with HCPs that are unconnected to an event and that are arranged by medical representatives, the total cost for one meal (incl. beverages) should not exceed CNY 2,000. If the meal is arranged by other Sales or Marketing employees (for example, by District or Regional Managers or Franchise Heads), the total cost for one meal (incl. beverages) should not exceed CNY 3,000.',
                items: []
              },
              {
                value:
                  'If the meal is arranged by other Sales or Marketing employees (for example, by District or Regional Managers or Franchise Heads), the total cost for one meal (incl. beverages) should not exceed CNY 3,000.',
                items: []
              }
            ]
          }
        ],
        desc_1955: [
          {
            label: 'Please note that this function is to register and record',
            items: [
              {
                value:
                  'In exceptional cases during daily business, employees to provide Hospitality of meal to HCP, Government Officials and Distributors which exceeds CNY 300 per person per time (incl. beverages and service charge). Such kind of Hospitality requires special approval in advance by the authorized Approvers (Please select one in above "Approver"). When the approval is acquired and the Hospitality is completed, the Requester should claim reimbursement linking to the corresponding e-Gift/Hospitality application in the reimbursement system.',
                items: []
              },
              {
                value:
                  'During daily business, employees to provide Hospitality of meal to any Third Party other than HCP, Government Officials and Distributors which exceeds CNY 300 per person per time (incl. beverages and service charge). Such kind of Hospitality does not require special approval. When the record is input and the Hospitality is completed, the Requester should apply for reimbursement linking to the corresponding e-Gift/Hospitality record in the reimbursement system. (For Hospitality provided to Third Party during daily business that is below or equal to CNY 300 per person per time (incl. beverages and service charge), employees can directly apply for reimbursement in the reimbursement system.)',
                items: []
              }
            ]
          },
          {
            label: 'Principle',
            items: [
              {
                value:
                  'Employees giving Hospitality to a Third Party, it required no Solicitation, no Inappropriate Influence Avoid Conflicts of Interest, no Cash or Cash Equivalents and no Private Benefit',
                items: []
              },
              {
                value:
                  '(Third Party/Parties include, but are not limited to HCPs, government officials, distributors and other business partners)',
                items: []
              }
            ]
          },
          {
            label: 'Requester should comply with below compliance regulations',
            items: [
              {
                value:
                  'Giving Hospitality to HCPs, Government Officials and Distributors, the Criteria is <= CNY 300 per person per time (including drinks and service charge)',
                items: []
              },
              {
                value:
                  'Only on very rare occasions with appropriate reasons, the Hospitality provided to HCPs, Government Officials and Distributors may exceed CNY 300 per person, and requires upfront approval by the Head of Compliance China, or the China Head of Pharmaceuticals / Consumer Health, or the Regional Managing Directors for Pharmaceuticals or the Head of Field Sales for Consumer Health.',
                items: []
              },
              {
                value:
                  'For meals with HCPs that are unconnected to an event and that are arranged by medical representatives, the total cost for one meal (incl. beverages) should not exceed CNY 2,000. If the meal is arranged by other Sales or Marketing employees (for example, by District or Regional Managers or Franchise Heads), the total cost for one meal (incl. beverages) should not exceed CNY 3,000.',
                items: []
              },
              {
                value:
                  'If the meal is arranged by other Sales or Marketing employees (for example, by District or Regional Managers or Franchise Heads), the total cost for one meal (incl. beverages) should not exceed CNY 3,000.',
                items: []
              }
            ]
          }
        ],
        desc_0813: [
          {
            label: 'The provision of hospitality to 3rd parties is subject to all of following conditions',
            items: [
              {
                value: 'Based on reasonable causes which are business related,',
                items: []
              },
              {
                value: 'On proper occasions consistent with cultural customs and/or business practices,',
                items: []
              },
              {
                value: 'Not in a wasteful, extravagant or inappropriate place, ',
                items: []
              },
              {
                value: 'Not to choose a location or format that could negatively affect Bayer’s reputation,',
                items: []
              },
              {
                value: 'Approval flow:',
                items: [
                  { value: 'For hospitality ≤CNY 300 Yuan per capita, no need to apply in E-hospitality,' },
                  {
                    value:
                      'For hospitality between CNY 300 Yuan and 500 Yuan(included) per capita, the line manager and department head (CMT member or other equivalent management team members)’s pre-approval is needed,'
                  },
                  {
                    value:
                      'Providing hospitality ＞CNY 500 Yuan per capita is allowed only in rare cases with appropriate reasons. It must be approved in advance by line manager, department head and Compliance Department.'
                  }
                ]
              },
              {
                value:
                  'Given the special status of government officials, careful assessment of the reasonableness and necessity is required when providing meals for them. Additionally, if the counterpart unit has stricter standards, Bayer must respect and adhere to those stricter standards. Discussions during meals must not involve ongoing government investigations or Bayer-related qualifications under review by the government official. In cases of special circumstance, prior approval from the line manager, department head, and Compliance Department, is required. For expenses ≤ CNY 300 Yuan per capita, approval from the line manager is necessary, while for expenses ＞ 300 RMB per capita, pre-approval from the line manager, department head and the Compliance Department is required.',
                items: []
              },
              {
                value:
                  'In PH/CH/CS business scenarios, hospitality giving must adhere to the respective Business Unit’s Bayer Gift and Hospitality Guidelines.',
                items: []
              }
            ]
          }
        ],
        desc_0882: [
          {
            label: 'Please note that this function is to register and record',
            items: [
              {
                value:
                  'In exceptional cases during daily business, employees to provide Hospitality of meal to HCP, Government Officials and Distributors which exceeds CNY 300 per person per time (incl. beverages and service charge). Such kind of Hospitality requires special approval in advance by the authorized Approvers (Please select one in above "Approver"). When the approval is acquired and the Hospitality is completed, the Requester should claim reimbursement linking to the corresponding e-Gift/Hospitality application in the reimbursement system.',
                items: []
              },
              {
                value:
                  'During daily business, employees to provide Hospitality of meal to any Third Party other than HCP, Government Officials and Distributors which exceeds CNY 300 per person per time (incl. beverages and service charge). Such kind of Hospitality does not require special approval. When the record is input and the Hospitality is completed, the Requester should apply for reimbursement linking to the corresponding e-Gift/Hospitality record in the reimbursement system. (For Hospitality provided to Third Party during daily business that is below or equal to CNY 300 per person per time (incl. beverages and service charge), employees can directly apply for reimbursement in the reimbursement system.)',
                items: []
              }
            ]
          },
          {
            label: 'Principle',
            items: [
              {
                value:
                  'Employees giving Hospitality to a Third Party, it required no Solicitation, no Inappropriate Influence Avoid Conflicts of Interest, no Cash or Cash Equivalents and no Private Benefit',
                items: []
              },
              {
                value:
                  '(Third Party/Parties include, but are not limited to HCPs, government officials, distributors and other business partners)',
                items: []
              }
            ]
          },
          {
            label: 'Requester should comply with below compliance regulations',
            items: [
              {
                value:
                  'Giving Hospitality to HCPs, Government Officials and Distributors, the Criteria is <= CNY 300 per person per time (including drinks and service charge)',
                items: []
              },
              {
                value:
                  'Only on very rare occasions with appropriate reasons, the Hospitality provided to HCPs, Government Officials and Distributors may exceed CNY 300 per person, and requires upfront approval by the Head of Compliance China, or the China Head of Pharmaceuticals / Consumer Health, or the Regional Managing Directors for Pharmaceuticals or the Head of Field Sales for Consumer Health.',
                items: []
              },
              {
                value:
                  'For meals with HCPs that are unconnected to an event and that are arranged by medical representatives, the total cost for one meal (incl. beverages) should not exceed CNY 2,000. If the meal is arranged by other Sales or Marketing employees (for example, by District or Regional Managers or Franchise Heads), the total cost for one meal (incl. beverages) should not exceed CNY 3,000.',
                items: []
              },
              {
                value:
                  'If the meal is arranged by other Sales or Marketing employees (for example, by District or Regional Managers or Franchise Heads), the total cost for one meal (incl. beverages) should not exceed CNY 3,000.',
                items: []
              }
            ]
          }
        ],
        desc_1391: [
          {
            label: 'Note',
            items: [
              {
                value:
                  'Only external hospitality provided out of any promotional event shall be pre-applied in eHospitality system. Hospitalities provided in promotional events shall be applied in Opera system.',
                items: []
              },
              {
                value:
                  'If per person cost does not exceed RMB 300 (no government official involved), no approval is needed under eHospitality system for reimbursement purpose.',
                items: []
              },
              {
                value:
                  'If per person cost is more than RMB 300 but not more than RMB 500 (including RMB 500), pre-approvals from line manager and Department Head are needed. If per person cost is more than RMB 500, pre-approval from compliance BP is also needed.',
                items: []
              },
              {
                value:
                  'For hospitality provided to government officials within RMB 300 per person (including RMB 300), pre-approval from line manager is needed. If above RMB 300, pre-approval from Department Head and Compliance BP are also needed.',
                items: []
              }
            ]
          },
          {
            label: 'The hospitality shall fulfill all of the following criteria',
            items: [
              { value: 'Serving a legitimate purpose', items: [] },
              { value: 'Consistent with common business practice pre-evaluated by applicant', items: [] },
              { value: 'Reasonable and appropriate', items: [] }
            ]
          },
          {
            label: 'The hospitality must NOT be',
            items: [
              { value: 'Lavish', items: [] },
              { value: 'Extravagant', items: [] },
              { value: 'Located in or near illegal place', items: [] },
              { value: 'Breach any compliance policy on providing hospitalities', items: [] },
              {
                value: 'Provided in an infamous place (e.g. strip club or inappropriate bar) or of a similar nature',
                items: []
              }
            ]
          }
        ],
        desc_2614: [
          {
            label: 'Note',
            items: [
              {
                value: 'If total expense per head is less than RMB 300 no approval is required.',
                items: []
              },
              {
                value:
                  "If total expense per head is between RMB 300 and RMB 1000, line manager's prior approval is needed.",
                items: []
              },
              {
                value:
                  'If total expense per head is more than RMB 1000 or the total expense for the group is more than RMB 6000, prior approval of line manager and subgroup compliance officer is needed.',
                items: []
              },
              {
                value:
                  'If invitee is government official or employee of state owned company, prior approval of line manager and subgroup compliance officer is needed.',
                items: []
              }
            ]
          },
          {
            label: 'The hospitable activity shall fulfill all of the following criteria:',
            items: [
              { value: 'Serving a Legitimate Purpose', items: [] },
              { value: 'Consistent with Pre-Valuing Business Practice', items: [] },
              { value: 'Reasonable and Appropriate', items: [] },
              { value: 'Within the Expense Guidelines Stipulated', items: [] }
            ]
          },
          {
            label: ' The hospitable activity must NOT be',
            items: [
              { value: 'Lavish', items: [] },
              { value: 'Extravagant', items: [] },
              { value: 'Located in or near illegal activity', items: [] },
              { value: 'Attached to the giving of gifts not in accordance with this Guideline or Table', items: [] },
              {
                value:
                  'Provided in a place of ill-repute (eg strip club or in an inappropriate Bar) or of a similar nature',
                items: []
              }
            ]
          }
        ]
      }
    },
    givingGifts: {
      applyForm: {
        givingGiftRequestTitle: 'Giving Gift Request Form',
        remark: 'Remark',
        remark_validation: 'Please input remark',
        givingGiftInfo: 'Giving Gift Information',
        giftReason_type_label: 'The scene of giving gifts',
        giftReason_type_label_validation: 'Please input the scene of giving gifts',
        giftReason_label: 'Reasons for giving gifts',
        giftReason_label_validation: 'Please input the reson',
        giftDesc_label: 'Gift Description',
        giftDesc_label_validation: 'Please input gift description',
        giftDesc_type_label: 'Gift description type',
        giftDesc_type_label_validation: 'Please select gift description type',
        giftGivingDate: 'Giving Date',
        giftGivingDate_validation: 'Please select giving date',
        giftGivingCompanyName: "Recipient's Company/Entity Name",
        giftGivingCompanyName_validation: "Please input recipient's Company/Entity Name",
        giftGivingEmployeeName: 'Name of recipient',
        giftGivingEmployeeName_validation: 'Please input Name of recipient',
        giftGivingTitle: 'Title of recipient',
        giftGivingTitle_validation: 'Please input title of recipient',
        giftRecipientCategory: 'Recipient Category',
        giftIsBayerCustomer: 'Is the recipient a current Bayer customer',
        givingDesc_type_option_medicine_noticeTitle: 'Gift Medicine Notice',
        givingDesc_type_option_medicine_noticeContent:
          'It is prohibited to give prescription drugs and Class A over-the-counter drugs as gifts. Other drugs are not allowed in principle. In very special cases, the line manager, the department manager (CMT member) and the compliance department should be donated after prior evaluation and approval. Please specify the reason for your gift in Remark.',
        giftGiving_HCP_option_noticeTitle: 'Recipient Category Notice',
        givingGiving_HCP_option_noticeContent:
          'Gifts to healthcare professionals (HCP) must also meet the BHC Gift Hospitality guidelines, Please refer to the BHC Gift Hospitality Guidelines. If the organizer of the event includes a business department, the business department should apply directly.'
      },
      policy: {
        title: 'Policy Reminder',
        desc_1954: [
          {
            label: 'Please note that this function is to register and record',
            items: [
              {
                value:
                  'Pharmaceuticals to provide any gifts allowed by Compliance policy other than Promotional Aids and Medical Utility Items to a Third Party. Such gifts can be permissible depending on the circumstances of the particular case (e.g. a symbolic, inexpensive Gift that is provided out of politeness) but requires the prior approval by the Head of Compliance China. Sales and Marketing team should not provide such gifts in general.',
                items: []
              },
              {
                value:
                  'Consumer Health to provide any gifts allowed by Compliance policy other than Promotional Aids, Medical Utility Items, Consumer Gifts and Cultural Courtesy Gifts for distributors. Such gifts can be permissible depending on the circumstances of the particular case (e.g. a symbolic, inexpensive Gift that is provided out of politeness) but requires the prior approval by the Head of Compliance China. Sales and Marketing team should not provide such gifts in general. ',
                items: []
              },
              {
                value:
                  'Consumer Health to provide Cultural Courtesy Gifts allowed by Compliance policy to its distributors under exceptional situations. (In the case of providing Cultural Courtesy Gifts to several distributors at one time, the Requester should make records in the eGift system by each distributor.)',
                items: []
              }
            ]
          },
          {
            label: 'Principle',
            items: [
              {
                value:
                  'Employees giving Gift(s) to a Third Party, it required no Solicitation, no Inappropriate Influence Avoid Conflicts of Interest, no Cash or Cash Equivalents and no Private Benefit',
                items: []
              },
              {
                value:
                  '(Third Party/Parties include, but are not limited to HCPs, government officials, distributors and other business partners)',
                items: []
              }
            ]
          }
        ],
        desc_1955: [
          {
            label: 'Please note that this function is to register and record',
            items: [
              {
                value:
                  'Pharmaceuticals to provide any gifts allowed by Compliance policy other than Promotional Aids and Medical Utility Items to a Third Party. Such gifts can be permissible depending on the circumstances of the particular case (e.g. a symbolic, inexpensive Gift that is provided out of politeness) but requires the prior approval by the Head of Compliance China. Sales and Marketing team should not provide such gifts in general.',
                items: []
              },
              {
                value:
                  'Consumer Health to provide any gifts allowed by Compliance policy other than Promotional Aids, Medical Utility Items, Consumer Gifts and Cultural Courtesy Gifts for distributors. Such gifts can be permissible depending on the circumstances of the particular case (e.g. a symbolic, inexpensive Gift that is provided out of politeness) but requires the prior approval by the Head of Compliance China. Sales and Marketing team should not provide such gifts in general. ',
                items: []
              },
              {
                value:
                  'Consumer Health to provide Cultural Courtesy Gifts allowed by Compliance policy to its distributors under exceptional situations. (In the case of providing Cultural Courtesy Gifts to several distributors at one time, the Requester should make records in the eGift system by each distributor.)',
                items: []
              }
            ]
          },
          {
            label: 'Principle',
            items: [
              {
                value:
                  'Employees giving Gift(s) to a Third Party, it required no Solicitation, no Inappropriate Influence Avoid Conflicts of Interest, no Cash or Cash Equivalents and no Private Benefit',
                items: []
              },
              {
                value:
                  '(Third Party/Parties include, but are not limited to HCPs, government officials, distributors and other business partners)',
                items: []
              }
            ]
          }
        ],
        desc_1391: [
          {
            label: 'Note',
            items: [
              {
                value:
                  'Sending out any gift to external personnel out of promotional events shall be pre-applied in EGift system. Sending out any gift in promotional events shall be applied in Opera system.',
                items: []
              },
              {
                value:
                  'If unit price of the gift is more than RMB 300 (excluding RMB 300), pre-approvals from line manager, Department Head, BCS Country Head and Compliance BP in EGift system are needed.',
                items: []
              },
              {
                value:
                  'Sending out any promotional gift to external personnel shall be pre-approved by line manager. Sending out any custom gift (limited to Spring Festival and Mid-Autumn Festival) to external personnel shall be pre-approved by line manager and Department Head.',
                items: []
              },
              {
                value:
                  'Sending out gift below RMB 200/ unit to any government official shall be pre-approved by line manager and Department Head. Gifts over RMB 200/ unit are not allowed to be given to any government official in principle.Employees are not allowed to send or receive any cash or cash equivalent as gifts. Employees should notify compliance BP to register and manage the gifts in case any cash, cash equivalent or gifts over RMB 300 are received.',
                items: []
              }
            ]
          }
        ],
        desc_2614: [
          {
            label: 'Note',
            items: [
              {
                value:
                  'Sending out any gift to external personnel out of promotional events shall be pre-applied in EGift system. Sending out any gift in promotional events shall be applied in Opera system.',
                items: []
              },
              {
                value:
                  'If unit price of the gift is more than RMB 300 (excluding RMB 300), pre-approvals from line manager, Department Head, BCS Country Head and Compliance BP in EGift system are needed.',
                items: []
              },
              {
                value:
                  'Sending out any promotional gift to external personnel shall be pre-approved by line manager. Sending out any custom gift (limited to Spring Festival and Mid-Autumn Festival) to external personnel shall be pre-approved by line manager and Department Head.',
                items: []
              },
              {
                value:
                  'Sending out gift below RMB 200/ unit to any government official shall be pre-approved by line manager and Department Head. Gifts over RMB 200/ unit are not allowed to be given to any government official in principle.Employees are not allowed to send or receive any cash or cash equivalent as gifts. Employees should notify compliance BP to register and manage the gifts in case any cash, cash equivalent or gifts over RMB 300 are received.',
                items: []
              }
            ]
          }
        ],
        desc_0813: [
          {
            label: 'Note',
            items: [
              {
                value:
                  'Gifts should be given based on reasonable business scenarios. It should be legal and compliant. Gifts shall not be given for the purpose of obtaining improper benefits.',
                items: []
              },
              {
                value:
                  'Gifts should be provided at appropriated meetings, events or other business occasions. It should meet the minimum quantity principle.',
                items: []
              },
              {
                value:
                  'Sending out any promotional gift to external personnel shall be pre-approved by line manager. Sending out any custom gift (limited to Spring Festival and Mid-Autumn Festival) to external personnel shall be pre-approved by line manager and Department Head.',
                items: []
              },
              {
                value:
                  'Do not give items with strong personal attributs (like cigarettes, alcohol, entertainment events, sports tickets ets.) or cash or cash equivalents.',
                items: []
              },
              {
                value: 'Choose proper gifts without high price:',
                items: [
                  { value: 'Promotional aids: ≤ RMB 300 Yuan + line managers’ approval in advance.' },
                  {
                    value:
                      'In principle, gifts ＞RMB 300 Yuan are not allowed. For special cases, department head (CMT member or other equivalent management team member) and Compliance Department’s in-advance approval is a must.'
                  }
                ]
              },
              {
                value: 'Gift to government official/HCP:',
                items: [
                  { value: 'Gifts with unit price ≤ RMB 200 Yuan/person requires line manager’s in-advance approval.' },
                  {
                    value:
                      'Please carefully evaluate the rationality and necessity of gifts with unit price ＞ RMB 200 Yuan/person, and obtain line manager, department head and Compliance Department’s approval in advance.'
                  }
                ]
              }
            ]
          }
        ],
        desc_0882: [
          {
            label: 'Please note that this function is to register and record',
            items: [
              {
                value:
                  'Pharmaceuticals to provide any gifts allowed by Compliance policy other than Promotional Aids and Medical Utility Items to a Third Party. Such gifts can be permissible depending on the circumstances of the particular case (e.g. a symbolic, inexpensive Gift that is provided out of politeness) but requires the prior approval by the Head of Compliance China. Sales and Marketing team should not provide such gifts in general.',
                items: []
              },
              {
                value:
                  'Consumer Health to provide any gifts allowed by Compliance policy other than Promotional Aids, Medical Utility Items, Consumer Gifts and Cultural Courtesy Gifts for distributors. Such gifts can be permissible depending on the circumstances of the particular case (e.g. a symbolic, inexpensive Gift that is provided out of politeness) but requires the prior approval by the Head of Compliance China. Sales and Marketing team should not provide such gifts in general.',
                items: []
              },
              {
                value:
                  'Consumer Health to provide Cultural Courtesy Gifts allowed by Compliance policy to its distributors under exceptional situations. (In the case of providing Cultural Courtesy Gifts to several distributors at one time, the Requester should make records in the eGift system by each distributor.) ',
                items: []
              }
            ]
          },
          {
            label: 'Principle',
            items: [
              {
                value:
                  'Employees giving Gift(s) to a Third Party, it required no Solicitation, no Inappropriate Influence Avoid Conflicts of Interest, no Cash or Cash Equivalents and no Private Benefit',
                items: []
              },
              {
                value:
                  '(Third Party/Parties include, but are not limited to HCPs, government officials, distributors and other business partners) ',
                items: []
              }
            ]
          }
        ]
      }
    },
    receivingGifts: {
      applyForm: {
        acceptGiftRequestTitle: 'Accpect Gift Request Form',
        receivingGiftInfo: 'Receiving Gift Information',
        // remark: 'Remark (Please fill in with the detailed Gift name)',
        remark: 'Remark',
        remark_validation: 'Please input remark',
        usageScenairo: 'Usage Scenario',
        giftRecipient: 'Gift Recipient',
        giftGiverCompanyName: "Provider's company name",
        giftGiverCompanyName_validation: 'Please input name of giver company',
        giftGiverEmployeeName: 'Name of giver',
        giftGiverEmployeeName_validation: 'Please input giver name',
        giftGiverTitle: 'Title of giver',
        giftGiverTitle_validation: 'Please input title of giver',
        giftReceivingDate: 'Receiving Date',
        giftReceivingDate_validation: 'Please select receiving date',
        giftReason_type_label: 'The scene of receiving gifts',
        giftReason_type_label_validation: 'Please input the scene of receiving gifts',
        giftReason_label: 'Reasons for receiving gifts',
        giftReason_label_validation: 'Please input the reson',
        giftDesc_label: 'Gift Description',
        giftDesc_label_validation: 'Please input gift description',
        giftDesc_type_label: 'Gift description type',
        giftDesc_type_label_validation: 'Please input gift description type'
      },
      policy: {
        title: 'Policy Reminder',
        desc_1954: [
          {
            label: 'Please note that this function is to register and record',
            items: [
              {
                value:
                  'Please noted, only Gift(s) received from a Third Party are registered and recorded in eGift system ',
                items: []
              }
            ]
          },
          {
            label: 'Principle',
            items: [
              {
                value:
                  'Employees receiving Gift(s) from a Third Party, it required no Solicitation, no Inappropriate Influence Avoid Conflicts of Interest, no Cash or Cash Equivalents and no Private Benefit',
                items: []
              },
              {
                value:
                  '(Third Party/Parties include, but are not limited to HCPs, government officials, distributors and other business partners)',
                items: []
              }
            ]
          },
          {
            label: 'Regulation',
            items: [
              {
                value:
                  'Employees may accept and keep Gifts offered or granted by a Third Party when all the following conditions are met',
                items: [
                  { value: 'Of nominal or symbolic value (<=CNY 300 in value per item)', items: [] },
                  { value: 'On an occasional basis (<=2 times per year from one Third Party)', items: [] },
                  { value: 'In accordance with local cultural courtesy customs', items: [] }
                ]
              },
              {
                value:
                  'If an employee receives a Gift with > CNY 300 value or unknown value, he/she should politely refuse it. When failing to refuse the Gift due to courtesy reasons, the employee should follow the following process',
                items: [
                  { value: 'The employee should directly notify his/her supervisor and Compliance team', items: [] },
                  {
                    value:
                      'The employee should hand over the Gift to Compliance team, or alternatively share the Gift among his/her department or group if approved by Compliance team',
                    items: []
                  }
                ]
              }
            ]
          }
        ],
        desc_1955: [
          {
            label: 'Please note that this function is to register and record',
            items: [
              {
                value:
                  'Please noted, only Gift(s) received from a Third Party are registered and recorded in eGift system ',
                items: []
              }
            ]
          },
          {
            label: 'Principle',
            items: [
              {
                value:
                  'Employees receiving Gift(s) from a Third Party, it required no Solicitation, no Inappropriate Influence Avoid Conflicts of Interest, no Cash or Cash Equivalents and no Private Benefit',
                items: []
              },
              {
                value:
                  '(Third Party/Parties include, but are not limited to HCPs, government officials, distributors and other business partners)',
                items: []
              }
            ]
          },
          {
            label: 'Regulation',
            items: [
              {
                value:
                  'Employees may accept and keep Gifts offered or granted by a Third Party when all the following conditions are met',
                items: [
                  { value: 'Of nominal or symbolic value (<=CNY 300 in value per item)', items: [] },
                  { value: 'On an occasional basis (<=2 times per year from one Third Party)', items: [] },
                  { value: 'In accordance with local cultural courtesy customs', items: [] }
                ]
              },
              {
                value:
                  'If an employee receives a Gift with > CNY 300 value or unknown value, he/she should politely refuse it. When failing to refuse the Gift due to courtesy reasons, the employee should follow the following process',
                items: [
                  { value: 'The employee should directly notify his/her supervisor and Compliance team', items: [] },
                  {
                    value:
                      'The employee should hand over the Gift to Compliance team, or alternatively share the Gift among his/her department or group if approved by Compliance team',
                    items: []
                  }
                ]
              }
            ]
          }
        ],
        desc_0882: [
          {
            label: 'Please note that this function is to register and record',
            items: [
              {
                value:
                  'Please noted, only Gift(s) received from a Third Party are registered and recorded in eGift system ',
                items: []
              }
            ]
          },
          {
            label: 'Principle',
            items: [
              {
                value:
                  'Employees receiving Gift(s) from a Third Party, it required no Solicitation, no Inappropriate Influence Avoid Conflicts of Interest, no Cash or Cash Equivalents and no Private Benefit',
                items: []
              },
              {
                value:
                  '(Third Party/Parties include, but are not limited to HCPs, government officials, distributors and other business partners)',
                items: []
              }
            ]
          },
          {
            label: 'Regulation',
            items: [
              {
                value:
                  'Employees may accept and keep Gifts offered or granted by a Third Party when all the following conditions are met',
                items: [
                  { value: 'Of nominal or symbolic value (<=CNY 300 in value per item)', items: [] },
                  { value: 'On an occasional basis (<=2 times per year from one Third Party)', items: [] },
                  { value: 'In accordance with local cultural courtesy customs', items: [] }
                ]
              },
              {
                value:
                  'If an employee receives a Gift with > CNY 300 value or unknown value, he/she should politely refuse it. When failing to refuse the Gift due to courtesy reasons, the employee should follow the following process',
                items: [
                  { value: 'The employee should directly notify his/her supervisor and Compliance team', items: [] },
                  {
                    value:
                      'The employee should hand over the Gift to Compliance team, or alternatively share the Gift among his/her department or group if approved by Compliance team',
                    items: []
                  }
                ]
              }
            ]
          }
        ],
        desc_0813: [
          {
            label: 'The gift shall fulfill all of the following criteria',
            items: [
              { value: 'Tangible', items: [] },
              { value: 'Symbolic', items: [] },
              { value: 'Occasional (MAX 2 per year from each client)', items: [] },
              { value: 'Customary', items: [] }
            ]
          },
          {
            label: 'The Gift Must NOT be',
            items: [
              { value: 'Cash', items: [] },
              { value: 'Cash Coupons or Cash Equivalents ', items: [] },
              { value: 'Given by an Intermediary', items: [] },
              { value: 'Given in return for a favor', items: [] },
              {
                value:
                  'Influencing or designed to influence Bayer employee to make a decision/ grant an advantage or favour ',
                items: []
              }
            ]
          }
        ],
        desc_1391: [
          {
            label: 'The gift shall fulfill all of the following criteria',
            items: [
              { value: 'Tangible', items: [] },
              { value: 'Symbolic', items: [] },
              { value: 'Occasional (MAX 2 per year from each client)', items: [] },
              { value: 'Customary', items: [] }
            ]
          },
          {
            label: 'The Gift Must NOT be',
            items: [
              { value: 'Cash', items: [] },
              { value: 'Cash Coupons or Cash Equivalents ', items: [] },
              { value: 'Given by an Intermediary', items: [] },
              { value: 'Given in return for a favor', items: [] },
              {
                value:
                  'Influencing or designed to influence Bayer employee to make a decision/ grant an advantage or favour ',
                items: []
              }
            ]
          }
        ]
      }
    },
    function: {
      tab: {
        tabOperate: {
          title: 'Tab Operation',
          addTab: 'Add Tab',
          addTabDesc: 'To about page',
          closeTab: 'Close Tab',
          closeCurrentTab: 'Close Current Tab',
          closeAboutTab: 'Close "About" Tab',
          addMultiTab: 'Add Multi Tab',
          addMultiTabDesc1: 'To MultiTab page',
          addMultiTabDesc2: 'To MultiTab page(with query params)'
        },
        tabTitle: {
          title: 'Tab Title',
          changeTitle: 'Change Title',
          change: 'Change',
          resetTitle: 'Reset Title',
          reset: 'Reset'
        }
      },
      multiTab: {
        routeParam: 'Route Param',
        backTab: 'Back function_tab'
      }
    },
    manage: {
      common: {
        status: {
          enable: 'Enable',
          disable: 'Disable'
        }
      },
      role: {
        title: 'Role List',
        roleName: 'Name',
        roleStatus: 'Status',
        roleDesc: 'Role desc',
        form: {
          roleName: '',
          roleStatus: ''
        },
        common: {
          addTitle: 'Add Role',
          editTitle: 'Edit Role'
        }
      },
      table: {
        index: 'Index',
        desc: 'Desc',
        status: 'Status',
        roleName: 'Role Name'
      }
    }
  },
  form: {
    common: {
      upload_file: 'Upload Attachment',
      upload_file_success: 'File: {fileName} uploaded successfully !',
      option_yes: 'Yes',
      option_no: 'No',
      unitPrice: 'Unit Price',
      unitPrice_validation: 'Please input unit price',
      quantity: 'Quantity',
      quantity_validation: 'Please input quantity',
      totalPrice: 'Total Value',
      reference: 'Reference No',
      reference_placeHolder: 'Please input reference no',
      totalPrice_validation: 'Please input total value',
      cancelReson: 'Fill In Cancel Reson',
      approveComment: 'Fill In Approve Comment',
      addPerson: 'Add person',
      viewPerson: 'view person',
      historyLog: 'History Log',
      operationInfo: 'Operation Information',
      remarkInfo: 'Remark Information',
      option_draft: 'Draft',
      option_inProcess: 'In-Process',
      option_complete: 'Complete',
      option_not_Applicable: 'Not Applicable',
      upload_person_label: 'Attachment (you can add a file with multiple names)',
      upload_template: 'Template download',
      system_prompt: 'System prompt',
      person_quantity_notMatch: 'The personnel do not match the quantity',
      option_giftReason_Other:
        'Other(Please fill in the detailed reason for gift in the input field "Reason for gift")',
      option_giftReason_NewYear: 'Chinese New Year',
      option_giftReason_Mid_Autumn: 'Mid-Autumn Festival',
      option_Other: 'Other',
      option_giftDesc_Company_Branded_Gift: 'Company Branded Gift',
      option_giftDesc_Cultural_Courtesy: 'Cultural Courtesy Gifts',
      option_giftDesc_HCP_Promotional_Supplies:
        'Promotional AIDS for HCP when promoting OTC products (with company or brand logo)',
      option_giftDesc_Promotional_Supplies: 'Promotional AIDS products (with company or brand logo)',
      option_giftDesc_Other: 'Other Gifts',
      option_giftDesc_General_Gift: 'General Gift',
      option_giftDesc_Medicine: 'Medicine',
      option_giftDesc_Cash_Equivalents: 'Cash or Cash Equivalents',
      option_giftDesc_Present: 'Present',
      option_go_sco_Government_Official: 'Government Official',
      option_go_sco_Government_Non_Official: 'Non Government Official',
      option_go_sco_Distributor: 'Distributor',
      option_go_sco_HCP: 'HCP',
      select_validation: 'Please select'
    },
    applicateInfo: {
      applicateInfoTitle: 'Applicant Information',
      formFillerInfoTitle: 'Creator Information',
      formFiller: 'Creator',
      applyForCwid: 'CWID',
      formFiller_placeHolder: 'Please input creator',
      applyFor: 'Apply For',
      applyFor_validation: 'Please select applicant',
      applyFor_placeHolder: 'Please input applicant',
      countryHead: 'Country Head',
      deptHead: 'Department Head',
      deptHead_validation: 'Please select the department manager of your department',
      deptHead_tooltip:
        'A department manager is usually the highest-ranking employee in a department and is usually a member of the management team. Your department manager is not shown in the drop-down list below, Please email: {emails} to add (and copy your compliance BP).',
      applyCC: 'Copy to',
      applyDate: 'Apply Date',
      employeeNo: 'Employee No.',
      employeeLe: 'Employee Le',
      employeeLe_placeHolder: 'Please input employee Le',
      department: 'Dept.',
      supervisor: 'Line Manager',
      costCenter: 'Cost Center',
      division: 'DIVISION'
    },
    searchFrom: {
      applyStatus: 'Apply Status',
      applyType: 'Apply Type',
      givingGifts: 'Giving Gifts',
      givingHospitality: 'Giving Hospitality'
    },
    userName: {
      required: 'Please enter user name',
      invalid: 'User name format is incorrect'
    },
    phone: {
      required: 'Please enter phone number',
      invalid: 'Phone number format is incorrect'
    },
    pwd: {
      required: 'Please enter password',
      invalid: 'Password format is incorrect'
    },
    code: {
      required: 'Please enter verification code',
      invalid: 'Verification code format is incorrect'
    },
    email: {
      required: 'Please enter email',
      invalid: 'Email format is incorrect'
    }
  },
  dropdown: {
    closeCurrent: 'Close Current',
    closeOther: 'Close Other',
    closeLeft: 'Close Left',
    closeRight: 'Close Right',
    closeAll: 'Close All'
  },
  icon: {
    themeConfig: 'Theme Configuration',
    themeSchema: 'Theme Schema',
    lang: 'Switch Language',
    fullscreen: 'Fullscreen',
    fullscreenExit: 'Exit Fullscreen',
    reload: 'Reload Page',
    collapse: 'Collapse Menu',
    expand: 'Expand Menu',
    pin: 'Pin',
    unpin: 'Unpin'
  }
};

export default local;
