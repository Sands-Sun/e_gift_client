const local: App.I18n.Schema = {
  system: {
    title: 'E-Gift 管理系统'
  },
  common: {
    tip: '提示',
    add: '添加',
    addSuccess: '添加成功',
    edit: '修改',
    editSuccess: '修改成功',
    delete: '删除',
    deleteSuccess: '删除成功',
    batchDelete: '批量删除',
    confirm: 'SSO',
    cancel: '取消',
    pleaseCheckValue: '请检查输入的值是否合法',
    action: '操作',
    backToHome: '返回首页',
    lookForward: '敬请期待',
    userCenter: '个人中心',
    logout: '退出登录',
    logoutConfirm: '确认退出登录吗？',
    operate: '操作',
    search: '查询',
    reset: '重置',
    confirmDelete: '确认删除吗？'
  },
  theme: {
    themeSchema: {
      title: '主题模式',
      light: '亮色模式',
      dark: '暗黑模式',
      auto: '跟随系统'
    },
    layoutMode: {
      title: '布局模式',
      vertical: '左侧菜单模式',
      'vertical-mix': '左侧菜单混合模式',
      horizontal: '顶部菜单模式',
      'horizontal-mix': '顶部菜单混合模式'
    },
    themeColor: {
      title: '主题颜色',
      primary: '主色',
      info: '信息色',
      success: '成功色',
      warning: '警告色',
      error: '错误色',
      followPrimary: '跟随主色'
    },
    scrollMode: {
      title: '滚动模式',
      wrapper: '外层滚动',
      content: '主体滚动'
    },
    page: {
      animate: '页面切换动画',
      mode: {
        title: '页面切换动画类型',
        'fade-slide': '滑动',
        fade: '淡入淡出',
        'fade-bottom': '底部消退',
        'fade-scale': '缩放消退',
        'zoom-fade': '渐变',
        'zoom-out': '闪现',
        none: '无'
      }
    },
    fixedHeaderAndTab: '固定头部和标签栏',
    header: {
      height: '头部高度',
      breadcrumb: {
        visible: '显示面包屑',
        showIcon: '显示面包屑图标'
      }
    },
    tab: {
      visible: '显示标签栏',
      cache: '缓存标签页',
      height: '标签栏高度',
      mode: {
        title: '标签栏风格',
        chrome: '谷歌风格',
        button: '按钮风格'
      }
    },
    sider: {
      inverted: '深色侧边栏',
      width: '侧边栏宽度',
      collapsedWidth: '侧边栏折叠宽度',
      mixWidth: '混合布局侧边栏宽度',
      mixCollapsedWidth: '混合布局侧边栏折叠宽度',
      mixChildMenuWidth: '混合布局子菜单宽度'
    },
    footer: {
      visible: '显示底部',
      fixed: '固定底部',
      height: '底部高度',
      right: '底部局右'
    },
    themeDrawerTitle: '主题配置',
    pageFunTitle: '页面功能',
    configOperation: {
      copyConfig: '复制配置',
      copySuccessMsg: '复制成功，请替换 src/theme/settings.ts 中的变量 themeSettings',
      resetConfig: '重置配置',
      resetSuccessMsg: '重置成功'
    }
  },
  route: {
    login: '登录',
    403: '无权限',
    404: '页面不存在',
    500: '服务器错误',
    home: '首页',
    'user-center': '个人中心',
    about: '关于',
    inbox: '代办事项',
    function: '系统功能',
    function_tab: '标签页',
    'function_multi-tab': '多标签页',
    'function_hide-child': '隐藏子菜单',
    'function_hide-child_one': '隐藏子菜单',
    'function_hide-child_two': '菜单二',
    'function_hide-child_three': '菜单三',
    legal: '法务',
    'legal_giving-gifts': '赠送礼品',
    'legal_receving-gifts': '接收礼品',
    'legal_giving-hospitality': '给予招待',
    'legal_receving-hospitality': '接收招待',
    manage: '系统管理',
    manage_user: '用户管理',
    'manage_user-detail': '用户详情',
    manage_group: '用户组管理',
    manage_role: '角色管理',
    manage_route: '路由管理',
    manage_function: '功能管理',
    'multi-menu': '多级菜单',
    'multi-menu_first': '菜单一',
    'multi-menu_first_child': '菜单一子菜单',
    'multi-menu_second': '菜单二',
    'multi-menu_second_child': '菜单二子菜单',
    'multi-menu_second_child_home': '菜单二子菜单首页',
    exception: '异常页',
    exception_403: '403',
    exception_404: '404',
    exception_500: '500'
  },
  page: {
    login: {
      common: {
        loginOrRegister: '登录 / 注册',
        userNamePlaceholder: '请输入用户名',
        phonePlaceholder: '请输入手机号',
        codePlaceholder: '请输入验证码',
        passwordPlaceholder: '请输入密码',
        confirmPasswordPlaceholder: '请再次输入密码',
        codeLogin: '验证码登录',
        confirm: '确定',
        back: '返回',
        validateSuccess: '验证成功',
        loginSuccess: '登录成功',
        welcomeBack: '欢迎回来，{userName} ！'
      },
      pwdLogin: {
        title: '密码登录',
        rememberMe: '记住我',
        forgetPassword: '忘记密码？',
        register: '注册账号',
        otherAccountLogin: '其他账号登录',
        otherLoginMode: '其他登录方式',
        superAdmin: '超级管理员',
        admin: '管理员',
        user: '普通用户'
      },
      codeLogin: {
        title: '验证码登录',
        getCode: '获取验证码',
        imageCodePlaceholder: '请输入图片验证码'
      },
      register: {
        title: '注册账号',
        agreement: '我已经仔细阅读并接受',
        protocol: '《用户协议》',
        policy: '《隐私权政策》'
      },
      resetPwd: {
        title: '重置密码'
      },
      bindWeChat: {
        title: '绑定微信'
      }
    },
    about: {
      title: '关于',
      introduction: `Soybean Admin 是一个优雅且功能强大的后台管理模板，基于最新的前端技术栈，包括 Vue3, Vite5, TypeScript, Pinia 和 UnoCSS。它内置了丰富的主题配置和组件，代码规范严谨，实现了自动化的文件路由系统。此外，它还采用了基于 ApiFox 的在线Mock数据方案。Soybean Admin 为您提供了一站式的后台管理解决方案，无需额外配置，开箱即用。同样是一个快速学习前沿技术的最佳实践。`,
      projectInfo: {
        title: '项目信息',
        version: '版本',
        latestBuildTime: '最新构建时间',
        githubLink: 'Github 地址',
        previewLink: '预览地址'
      },
      prdDep: '生产依赖',
      devDep: '开发依赖'
    },
    home: {
      greeting: '{userName}, 欢迎使用 e-gifts 平台!',
      weatherDesc: '今日多云转晴，20℃ - 25℃!',
      projectCount: '项目数',
      todo: '待办',
      message: '消息',
      downloadCount: '下载量',
      registerCount: '注册量',
      schedule: '作息安排',
      study: '学习',
      work: '工作',
      rest: '休息',
      entertainment: '娱乐',
      visitCount: '访问量',
      turnover: '成交额',
      dealCount: '成交量',
      projectNews: {
        title: '项目动态',
        moreNews: '更多动态',
        desc1: 'Soybean 在2021年5月28日创建了开源项目 soybean-admin!',
        desc2: 'Yanbowe 向 soybean-admin 提交了一个bug，多标签栏不会自适应。',
        desc3: 'Soybean 准备为 soybean-admin 的发布做充分的准备工作!',
        desc4: 'Soybean 正在忙于为soybean-admin写项目说明文档！',
        desc5: 'Soybean 刚才把工作台页面随便写了一些，凑合能看了！'
      },
      creativity: '创意'
    },
    receivingGifts: {
      policy: {
        title: '政策提示',
        desc_1954: [
          {
            label: '请注意，此处用于登记和记录',
            items: [{ value: '此处仅登记及记录接受自第三方的礼品', items: [] }]
          },
          {
            label: '原则',
            items: [
              {
                value:
                  '员工接受来自第三方的礼品，应禁止索取、禁止不当影响、避免利益冲突、禁止现金或现金等价物、禁止私人利益',
                items: []
              },
              { value: '（第三方包括但不限于医疗卫生专业人士、政府官员、经销商及其他业务合作方）', items: [] }
            ]
          },
          {
            label: '要求',
            items: [
              {
                value: '员工接受和保留第三方提供的礼品必须满足以下所有条件：',
                items: [
                  { value: '名义或象征价值（单价 <= 300元人民币）' },
                  { value: '偶尔接受（每年从同一个第三方接受礼品<=2次）' },
                  { value: '符合当地文化风俗' }
                ]
              },
              {
                value:
                  '如果员工收到价值>300元人民币或未知价值的礼品，应委婉谢绝。若由于礼节原因不便拒绝，应遵守以下要求',
                items: [
                  { value: '员工应通知其直接上级和合规团队' },
                  { value: '员工应将礼品交给合规团队，或在得到合规团队确认后与所在部门或团队分享' }
                ]
              }
            ]
          }
        ],
        desc_1955: [
          {
            label: '请注意，此处用于登记和记录',
            items: [{ value: '此处仅登记及记录接受自第三方的礼品', items: [] }]
          },
          {
            label: '原则',
            items: [
              {
                value:
                  '员工接受来自第三方的礼品，应禁止索取、禁止不当影响、避免利益冲突、禁止现金或现金等价物、禁止私人利益',
                items: []
              },
              { value: '（第三方包括但不限于医疗卫生专业人士、政府官员、经销商及其他业务合作方）', items: [] }
            ]
          },
          {
            label: '要求',
            items: [
              {
                value: '员工接受和保留第三方提供的礼品必须满足以下所有条件：',
                items: [
                  { value: '名义或象征价值（单价 <= 300元人民币）' },
                  { value: '偶尔接受（每年从同一个第三方接受礼品<=2次）' },
                  { value: '符合当地文化风俗' }
                ]
              },
              {
                value:
                  '如果员工收到价值>300元人民币或未知价值的礼品，应委婉谢绝。若由于礼节原因不便拒绝，应遵守以下要求',
                items: [
                  { value: '员工应通知其直接上级和合规团队' },
                  { value: '员工应将礼品交给合规团队，或在得到合规团队确认后与所在部门或团队分享' }
                ]
              }
            ]
          }
        ],
        desc_1391: [
          {
            label: 'Note',
            items: [
              { value: '仅非营销性质的礼品或招待须事先在eGift系统中申请。', items: [] },
              { value: '如果单价小于人民币300元，无需审批。', items: [] },
              { value: '如果单价高于人民币300元（含300元），须获得部门总监、国家经理及合规的审批。', items: [] },
              { value: '向国家工作人员提供礼品和招待，均须获得合规的审批。', items: [] }
            ]
          }
        ],
        desc_0813: [
          {
            label: 'Note',
            items: [
              { value: '如果礼品总价<300元，不需要批准', items: [] },
              { value: '如果300元<=礼品总价<=500元之间，需要主管的批准。', items: [] },
              {
                value: '如果礼品总价>500元或者礼品接受者是政府官员或国有企业员工，需要主管和子集团和规官员的批准。',
                items: []
              },
              { value: '如果需要为不同公司的人送礼的话，那么请另外起一个申请。', items: [] }
            ]
          }
        ],

        desc_0882: [
          {
            label: '请注意，此处用于登记和记录',
            items: [
              { value: '此处仅登记及记录提供给第三方的礼品', items: [] },
              { value: '此处仅登记及记录除品牌提示物、医用物品和消费者促销礼品以外的其他礼品', items: [] },
              {
                value:
                  '此处用于登记和记录向第三方提供公司合规政策明确允许的针对处方药事业部、健康消费品事业部的品牌提示物、医用物品，以及仅针对健康消费品事业部的消费者促销礼品、风俗礼品（少数情形）之外的其他礼品。该类其他礼品可以视个例的具体情形（如出于礼节提供象征性、非贵重的礼品）给予允许，但必须得到拜耳中国合规总监的事先批准。请注意销售、市场团队一般不得提供该类其他礼品。',
                items: []
              }
            ]
          },
          {
            label: '原则',
            items: [
              {
                value:
                  '员工提供给第三方礼品，应禁止索取、禁止不当影响、避免利益冲突、禁止现金或现金等价物、禁止私人利益',
                items: []
              },
              { value: '（第三方包括但不限于医疗卫生专业人士、政府官员、经销商及其他业务合作方）', items: [] }
            ]
          }
        ]
      }
    },
    givingGifts: {
      policy: {
        title: '政策提示',
        desc_1954: [
          {
            label: '请注意，此处用于登记和记录',
            items: [
              { value: '此处仅登记及记录提供给第三方的礼品', items: [] },
              { value: '此处仅登记及记录除品牌提示物、医用物品和消费者促销礼品以外的其他礼品', items: [] },
              {
                value:
                  '此处用于登记和记录向第三方提供公司合规政策明确允许的针对处方药事业部、健康消费品事业部的品牌提示物、医用物品，以及仅针对健康消费品事业部的消费者促销礼品、风俗礼品（少数情形）之外的其他礼品。该类其他礼品可以视个例的具体情形（如出于礼节提供象征性、非贵重的礼品）给予允许，但必须得到拜耳中国合规总监的事先批准。请注意销售、市场团队一般不得提供该类其他礼品。',
                items: []
              }
            ]
          },
          {
            label: '原则',
            items: [
              {
                value:
                  '员工提供给第三方礼品，应禁止索取、禁止不当影响、避免利益冲突、禁止现金或现金等价物、禁止私人利益',
                items: []
              },
              { value: '（第三方包括但不限于医疗卫生专业人士、政府官员、经销商及其他业务合作方） ', items: [] }
            ]
          }
        ],
        desc_1955: [
          {
            label: '请注意，此处用于登记和记录',
            items: [
              { value: '此处仅登记及记录提供给第三方的礼品', items: [] },
              { value: '此处仅登记及记录除品牌提示物、医用物品和消费者促销礼品以外的其他礼品', items: [] },
              {
                value:
                  '此处用于登记和记录向第三方提供公司合规政策明确允许的针对处方药事业部、健康消费品事业部的品牌提示物、医用物品，以及仅针对健康消费品事业部的消费者促销礼品、风俗礼品（少数情形）之外的其他礼品。该类其他礼品可以视个例的具体情形（如出于礼节提供象征性、非贵重的礼品）给予允许，但必须得到拜耳中国合规总监的事先批准。请注意销售、市场团队一般不得提供该类其他礼品。',
                items: []
              }
            ]
          },
          {
            label: '原则',
            items: [
              {
                value:
                  '员工提供给第三方礼品，应禁止索取、禁止不当影响、避免利益冲突、禁止现金或现金等价物、禁止私人利益',
                items: []
              },
              { value: '（第三方包括但不限于医疗卫生专业人士、政府官员、经销商及其他业务合作方）', items: [] }
            ]
          }
        ],
        desc_1391: [
          {
            label: 'Note',
            items: [
              { value: '仅非营销性质的礼品或招待须事先在eGift系统中申请。', items: [] },
              { value: '如果单价小于人民币300元，无需审批。', items: [] },
              { value: '如果单价高于人民币300元（含300元），须获得部门总监、国家经理及合规的审批。', items: [] },
              { value: '向国家工作人员提供礼品和招待，均须获得合规的审批。', items: [] }
            ]
          }
        ],
        desc_0813: [
          {
            label: 'Note',
            items: [
              { value: '如果礼品总价<300元，不需要批准', items: [] },
              { value: '如果300元<=礼品总价<=500元之间，需要主管的批准。', items: [] },
              {
                value: '如果礼品总价>500元或者礼品接受者是政府官员或国有企业员工，需要主管和子集团和规官员的批准。',
                items: []
              },
              { value: '如果需要为不同公司的人送礼的话，那么请另外起一个申请。', items: [] }
            ]
          }
        ],

        desc_0882: [
          {
            label: '请注意，此处用于登记和记录',
            items: [
              { value: '此处仅登记及记录提供给第三方的礼品', items: [] },
              { value: '此处仅登记及记录除品牌提示物、医用物品和消费者促销礼品以外的其他礼品', items: [] },
              {
                value:
                  '此处用于登记和记录向第三方提供公司合规政策明确允许的针对处方药事业部、健康消费品事业部的品牌提示物、医用物品，以及仅针对健康消费品事业部的消费者促销礼品、风俗礼品（少数情形）之外的其他礼品。该类其他礼品可以视个例的具体情形（如出于礼节提供象征性、非贵重的礼品）给予允许，但必须得到拜耳中国合规总监的事先批准。请注意销售、市场团队一般不得提供该类其他礼品。',
                items: []
              }
            ]
          },
          {
            label: '原则',
            items: [
              {
                value:
                  '员工提供给第三方礼品，应禁止索取、禁止不当影响、避免利益冲突、禁止现金或现金等价物、禁止私人利益',
                items: []
              },
              { value: '（第三方包括但不限于医疗卫生专业人士、政府官员、经销商及其他业务合作方）', items: [] }
            ]
          }
        ]
      }
    },
    function: {
      tab: {
        tabOperate: {
          title: '标签页操作',
          addTab: '添加标签页',
          addTabDesc: '跳转到关于页面',
          closeTab: '关闭标签页',
          closeCurrentTab: '关闭当前标签页',
          closeAboutTab: '关闭"关于"标签页',
          addMultiTab: '添加多标签页',
          addMultiTabDesc1: '跳转到多标签页页面',
          addMultiTabDesc2: '跳转到多标签页页面(带有查询参数)'
        },
        tabTitle: {
          title: '标签页标题',
          changeTitle: '修改标题',
          change: '修改',
          resetTitle: '重置标题',
          reset: '重置'
        }
      },
      multiTab: {
        routeParam: '路由参数',
        backTab: '返回 function_tab'
      }
    },
    manage: {
      common: {
        status: {
          enable: '开启',
          disable: '禁用'
        }
      },
      role: {
        title: '角色列表',
        roleName: '角色名称',
        roleStatus: '角色状态',
        roleDesc: '角色描述',
        form: {
          roleName: '',
          roleStatus: ''
        },
        common: {
          addTitle: '新增角色',
          editTitle: '修改角色'
        }
      },
      table: {
        index: '序号',
        desc: '描述',
        status: '状态',
        roleName: '角色名称'
      }
    }
  },
  form: {
    userName: {
      required: '请输入用户名',
      invalid: '用户名格式不正确'
    },
    phone: {
      required: '请输入手机号',
      invalid: '手机号格式不正确'
    },
    pwd: {
      required: '请输入密码',
      invalid: '密码格式不正确'
    },
    code: {
      required: '请输入验证码',
      invalid: '验证码格式不正确'
    },
    email: {
      required: '请输入邮箱',
      invalid: '邮箱格式不正确'
    }
  },
  dropdown: {
    closeCurrent: '关闭',
    closeOther: '关闭其它',
    closeLeft: '关闭左侧',
    closeRight: '关闭右侧',
    closeAll: '关闭所有'
  },
  icon: {
    themeConfig: '主题配置',
    themeSchema: '主题模式',
    lang: '切换语言',
    fullscreen: '全屏',
    fullscreenExit: '退出全屏',
    reload: '刷新页面',
    collapse: '折叠菜单',
    expand: '展开菜单',
    pin: '固定',
    unpin: '取消固定'
  }
};

export default local;
