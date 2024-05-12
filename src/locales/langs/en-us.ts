const local: App.I18n.Schema = {
  system: {
    title: 'E-Gift System'
  },
  common: {
    tip: 'Tip',
    add: 'Add',
    addSuccess: 'Add Success',
    edit: 'Edit',
    editSuccess: 'Edit Success',
    delete: 'Delete',
    deleteSuccess: 'Delete Success',
    batchDelete: 'Batch Delete',
    confirm: 'SSO',
    cancel: 'Cancel',
    pleaseCheckValue: 'Please check whether the value is valid',
    action: 'Action',
    backToHome: 'Back to home',
    lookForward: 'Coming soon',
    userCenter: 'User Center',
    logout: 'Logout',
    logoutConfirm: 'Are you sure you want to log out?',
    search: 'search',
    reset: 'Reset',
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
    legal: 'FA',
    'legal_giving-gifts': 'giving gifts',
    'legal_receving-gifts': 'receving gifts',
    'legal_giving-hospitality': 'giving hospitality',
    'legal_receving-hospitality': 'receving hospitality',
    manage: 'System Manage',
    manage_user: 'User Manage',
    'manage_user-detail': 'User Detail',
    manage_role: 'Role Manage',
    manage_group: 'Group Manage',
    manage_route: 'Route Manage',
    manage_function: 'Function Manage',
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
      greeting: '{userName}, welcome to use e-gifts system !',
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
    givingGifts: {
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
                value: 'Only gifts and hospitality with non-promotion nature shall be pre-applied in eGift system.',
                items: []
              },
              { value: 'If unit price is less than RMB 300, no approval is needed. ', items: [] },
              {
                value:
                  'If unit price is more than RMB 300 (including 300), approvals from Department Head, BCS Country Head and Compliance are needed.',
                items: []
              },
              {
                value:
                  'For gifts or hospitality offered to state personnel, approval from Compliance is always needed.',
                items: []
              }
            ]
          }
        ],
        desc_0813: [
          {
            label: 'Note',
            items: [
              { value: 'If total value is less than RMB 300, no approval is needed.', items: [] },
              { value: "If total value is between RMB 300 and RMB 500, line manager's approval is needed.", items: [] },
              {
                value:
                  'If total value is more than RMB 500 or recipient is government official or employee of state owned company, approval of line manager and subgroup compliance officer is needed. ',
                items: []
              },
              { value: 'Please make one request for each company you are giving gifts to.', items: [] }
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
                  { value: 'Of nominal or symbolic value (<=CNY 300 in value per item)' },
                  { value: 'On an occasional basis (<=2 times per year from one Third Party)' },
                  { value: 'In accordance with local cultural courtesy customs' }
                ]
              },
              {
                value:
                  'If an employee receives a Gift with > CNY 300 value or unknown value, he/she should politely refuse it. When failing to refuse the Gift due to courtesy reasons, the employee should follow the following process',
                items: [
                  { value: 'The employee should directly notify his/her supervisor and Compliance team' },
                  {
                    value:
                      'The employee should hand over the Gift to Compliance team, or alternatively share the Gift among his/her department or group if approved by Compliance team'
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
                  { value: 'Of nominal or symbolic value (<=CNY 300 in value per item)' },
                  { value: 'On an occasional basis (<=2 times per year from one Third Party)' },
                  { value: 'In accordance with local cultural courtesy customs' }
                ]
              },
              {
                value:
                  'If an employee receives a Gift with > CNY 300 value or unknown value, he/she should politely refuse it. When failing to refuse the Gift due to courtesy reasons, the employee should follow the following process',
                items: [
                  { value: 'The employee should directly notify his/her supervisor and Compliance team' },
                  {
                    value:
                      'The employee should hand over the Gift to Compliance team, or alternatively share the Gift among his/her department or group if approved by Compliance team'
                  }
                ]
              }
            ]
          }
        ],
        desc_0882: [
          {
            label: '请注意，此处用于登记和记录',
            items: [{ value: '此处仅登记及记录接受自第三方的礼品', items: [] }]
          }
        ],
        desc_0813: [
          {
            label: '请注意，此处用于登记和记录',
            items: [{ value: '此处仅登记及记录接受自第三方的礼品', items: [] }]
          }
        ],
        desc_1391: [
          {
            label: '请注意，此处用于登记和记录',
            items: [{ value: '此处仅登记及记录接受自第三方的礼品', items: [] }]
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
