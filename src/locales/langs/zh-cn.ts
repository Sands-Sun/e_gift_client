const local: App.I18n.Schema = {
  system: {
    title: 'E-Gift 管理系统'
  },
  common: {
    tip: '提示',
    add: '添加',
    addSuccess: '添加成功',
    list: '列表',
    edit: '修改',
    search: '搜索',
    expand: '展开',
    shrink: '收叠',
    enable: '启用',
    disable: '禁用',
    status: '状态',
    submit: '提交',
    approve: '审批',
    agreeApprove: '审批通过',
    rejectApprove: '审批拒绝',
    confirmApprove: '确认审批？',
    saveDraft: '保存草稿',
    reset: '重置',
    newGroupCreate: '新建用户组',
    newApplyCreate: '新建申请',
    viewDetail: '查看详细信息',
    editSuccess: '修改成功',
    delete: '删除',
    deleteSuccess: '删除成功',
    batchDelete: '批量删除',
    confirm: 'SSO',
    cancel: '取消',
    confirmCancel: '确认取消？',
    createdDate: '创建日期',
    lastModifiedDate: '修改日期',
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
    manageGroup: {
      applyForm: {
        groupRequestTitle: '用户组管理',
        groupName: '组名称',
        groupName_validation: '请输入组名称',
        fullName: '组全称',
        fullName_validation: '请输入组全称',
        groupCode: '组编号',
        groupCode_validation: '请输入组编号',
        bindPerson: '绑定人员',
        bindPerson_validation: '选择绑定人员',
        remark: '备注信息',
        remark_validation: '请输入备注信息'
      }
    },
    manageUser: {
      applyForm: {
        userFirstName: 'FirstName',
        userLastName: 'LastName',
        userChineseName: '中文名',
        userEnglishName: '英文名',
        userEmail: '用户邮箱'
      }
    },
    receivingGifts: {
      applyForm: {
        acceptGiftRequestTitle: '接受礼品申请表',
        receivingGiftInfo: '接受礼品信息',
        remark: '备注（请填写具体礼品名称）',
        remark_validation: '请输入礼品备注信息',
        giftRecipient: '礼品接受人',
        giftGiverCompanyName: '提供者单位名称',
        giftGiverCompanyName_validation: '请输入提供者单位名称',
        giftGiverEmployeeName: '提供者姓名',
        giftGiverEmployeeName_validation: '请输入提供者姓名',
        giftGiverTitle: '提供者职位',
        giftGiverTitle_validation: '请输入提供者职位',
        giftReceivingDate: '接受日期',
        giftReceivingDate_validation: '请选择接受日期',
        giftReason_label: '赠送礼品的原因',
        giftReason_label_validation: '请输入接受礼品原因',
        giftReason_desc_label: '赠送场景',
        giftDesc_label: '赠送礼品的原因',
        giftDesc_label_validation: '请输入赠送礼品的原因',
        giftDesc_type_label: '礼品类别'
      },
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
                  { value: '名义或象征价值（单价 <= 300元人民币）', items: [] },
                  { value: '偶尔接受（每年从同一个第三方接受礼品<=2次）', items: [] },
                  { value: '符合当地文化风俗', items: [] }
                ]
              },
              {
                value:
                  '如果员工收到价值>300元人民币或未知价值的礼品，应委婉谢绝。若由于礼节原因不便拒绝，应遵守以下要求',
                items: [
                  { value: '员工应通知其直接上级和合规团队', items: [] },
                  { value: '员工应将礼品交给合规团队，或在得到合规团队确认后与所在部门或团队分享', items: [] }
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
                  { value: '名义或象征价值（单价 <= 300元人民币）', items: [] },
                  { value: '偶尔接受（每年从同一个第三方接受礼品<=2次）', items: [] },
                  { value: '符合当地文化风俗', items: [] }
                ]
              },
              {
                value:
                  '如果员工收到价值>300元人民币或未知价值的礼品，应委婉谢绝。若由于礼节原因不便拒绝，应遵守以下要求',
                items: [
                  { value: '员工应通知其直接上级和合规团队', items: [] },
                  { value: '员工应将礼品交给合规团队，或在得到合规团队确认后与所在部门或团队分享', items: [] }
                ]
              }
            ]
          }
        ],
        desc_1391: [
          {
            label: '礼品必须符合以下所有情况',
            items: [
              { value: '有形的', items: [] },
              { value: '象征性的', items: [] },
              { value: '偶尔的 (每年最多从每个客户接受2次) ', items: [] },
              { value: '符合惯例的', items: [] }
            ]
          },
          {
            label: '礼品不能包含以下任意一种情况',
            items: [
              { value: '现金', items: [] },
              { value: '现金券或现金等价物', items: [] },
              { value: '通过中间人赠予', items: [] },
              { value: '为了换取好处而赠予', items: [] },
              { value: '影响或意图影响Bayer员工做出决策/给予优待或好处', items: [] }
            ]
          }
        ],
        desc_0813: [
          {
            label: '礼品必须符合以下所有情况',
            items: [
              { value: '有形的', items: [] },
              { value: '象征性的', items: [] },
              { value: '偶尔的 (每年最多从每个客户接受2次) ', items: [] },
              { value: '符合惯例的', items: [] }
            ]
          },
          {
            label: '礼品不能包含以下任意一种情况',
            items: [
              { value: '现金', items: [] },
              { value: '现金券或现金等价物', items: [] },
              { value: '通过中间人赠予', items: [] },
              { value: '为了换取好处而赠予', items: [] },
              { value: '影响或意图影响Bayer员工做出决策/给予优待或好处', items: [] }
            ]
          }
        ],

        desc_0882: [
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
                  { value: '名义或象征价值（单价 <= 300元人民币）', items: [] },
                  { value: '偶尔接受（每年从同一个第三方接受礼品<=2次）', items: [] },
                  { value: '符合当地文化风俗', items: [] }
                ]
              },
              {
                value:
                  '如果员工收到价值>300元人民币或未知价值的礼品，应委婉谢绝。若由于礼节原因不便拒绝，应遵守以下要求',
                items: [
                  { value: '员工应通知其直接上级和合规团队', items: [] },
                  { value: '员工应将礼品交给合规团队，或在得到合规团队确认后与所在部门或团队分享', items: [] }
                ]
              }
            ]
          }
        ]
      }
    },
    givingHospitality: {
      applyForm: {
        givingHospitalityRequestTitle: '给予招待申请表',
        remark: '备注（请填写具体招待）',
        remark_validation: '请输入招待备注信息',
        givingHospitalityInfo: '招待信息',
        giftReason_label: '你为什么要提供招待? ',
        giftReason_label_validation: '请输入提供招待的原因',
        giftGivingDate: '活动日期',
        giftGivingDate_validation: '请选择活动日期',
        giftHospitalityType: '请描述招待活动',
        giftHospitalityType_validation: '请输入描述',
        giftExpensePerHead: '估计的人均费用',
        giftExpensePerHead_validation: '请输入人均费用',
        giftHeadCount: '受邀人人数',
        giftHeadCount_validation: '请输入受邀人人数',
        giftEstimatedTotalExpense: '估计的总费用',
        giftEstimatedTotalExpense_validation: '请输入估计的总费用',
        giftHospPlace: '地点',
        giftHospPlace_validation: '请输入地点'
      },
      policy: {
        title: '政策提示',
        desc_1954: [
          {
            label: '请注意，此处用于登记和记录',
            items: [
              {
                value:
                  '在少数情况下，员工在日常业务往来中提供给医疗卫生专业人士、政府官员及经销商这三类人员的超过人均300人民币的用餐招待（包含酒水饮料服务费）。此类招待需提前得到相关审批人（请在以上“批准人”选择一位）的特别批准。获得批准并完成招待后，申请人须至报销系统选择对应的eGift表单申请报销。',
                items: []
              },
              {
                value:
                  '员工在日常业务往来中提供给除医疗卫生专业人士、政府官员及经销商以外的其他第三方超过人均300人民币的用餐招待（包含酒水饮料服务费）。 此类招待无需特别批准。登记并完成招待后，申请人须至报销系统选择对应的eGift表单申请报销。（员工在日常业务往来中提供给第三方的人均小于等于300元的用餐招待（包含酒水饮料服务费），请直接至报销系统提交报销申请。）',
                items: []
              }
            ]
          },
          {
            label: '原则',
            items: [
              {
                value:
                  '员工提供给第三方的招待，应禁止索取、禁止不当影响、避免利益冲突、禁止现金或现金等价物、禁止私人利益',
                items: []
              },
              { value: '（第三方包括但不限于医疗卫生专业人士、政府官员、经销商及其他业务合作方）', items: [] }
            ]
          },
          {
            label: '申请人应遵循以下合规要求',
            items: [
              {
                value:
                  '提供给医疗卫生专业人士、政府官员及经销商的用餐招待，标准是 ≤300人民币每人每次（包含酒水和服务费）',
                items: []
              },
              {
                value:
                  '极少数合理事由情形下，若提供给医疗卫生专业人士、政府官员及经销商的用餐招待超过人均300人民币，需提前得到拜耳中国合规总监，或处方药/ 健康消费品事业部中国负责人，或处方药区域总经理/ 健康消费品销售负责人的批准',
                items: []
              },
              {
                value:
                  '由医药代表组织的与会议无关的招待医疗卫生专业人士用餐，每次用餐总费用（包括酒水）不应超过2,000元人民币。',
                items: []
              },
              {
                value:
                  '如果此类用餐由销售或市场部其他人员组织（例如，地区或大区经理，或治疗领域市场总监），则每次用餐总费用（包括酒水）不应超过3,000元人民币。',
                items: []
              }
            ]
          }
        ],
        desc_1955: [
          {
            label: '请注意，此处用于登记和记录',
            items: [
              {
                value:
                  '在少数情况下，员工在日常业务往来中提供给医疗卫生专业人士、政府官员及经销商这三类人员的超过人均300人民币的用餐招待（包含酒水饮料服务费）。此类招待需提前得到相关审批人（请在以上“批准人”选择一位）的特别批准。获得批准并完成招待后，申请人须至报销系统选择对应的eGift表单申请报销。',
                items: []
              },
              {
                value:
                  '员工在日常业务往来中提供给除医疗卫生专业人士、政府官员及经销商以外的其他第三方超过人均300人民币的用餐招待（包含酒水饮料服务费）。 此类招待无需特别批准。登记并完成招待后，申请人须至报销系统选择对应的eGift表单申请报销。（员工在日常业务往来中提供给第三方的人均小于等于300元的用餐招待（包含酒水饮料服务费），请直接至报销系统提交报销申请。）',
                items: []
              }
            ]
          },
          {
            label: '原则',
            items: [
              {
                value:
                  '员工提供给第三方的招待，应禁止索取、禁止不当影响、避免利益冲突、禁止现金或现金等价物、禁止私人利益',
                items: []
              },
              { value: '（第三方包括但不限于医疗卫生专业人士、政府官员、经销商及其他业务合作方）', items: [] }
            ]
          },
          {
            label: '申请人应遵循以下合规要求',
            items: [
              {
                value:
                  '提供给医疗卫生专业人士、政府官员及经销商的用餐招待，标准是 ≤300人民币每人每次（包含酒水和服务费）',
                items: []
              },
              {
                value:
                  '极少数合理事由情形下，若提供给医疗卫生专业人士、政府官员及经销商的用餐招待超过人均300人民币，需提前得到拜耳中国合规总监，或处方药/ 健康消费品事业部中国负责人，或处方药区域总经理/ 健康消费品销售负责人的批准',
                items: []
              },
              {
                value:
                  '由医药代表组织的与会议无关的招待医疗卫生专业人士用餐，每次用餐总费用（包括酒水）不应超过2,000元人民币。',
                items: []
              },
              {
                value:
                  '如果此类用餐由销售或市场部其他人员组织（例如，地区或大区经理，或治疗领域市场总监），则每次用餐总费用（包括酒水）不应超过3,000元人民币。',
                items: []
              }
            ]
          }
        ],
        desc_0813: [
          {
            label: '向第三方提供招待须符合以下所有条件',
            items: [
              { value: '基于业务相关的合理原因', items: [] },
              { value: '符合文化风俗和/或商业惯例的合理场合', items: [] },
              {
                value: '不得是浪费、奢侈或不恰当的场所',
                items: []
              },
              {
                value: '不得选择可能给拜耳声誉造成负面影响的地点或形式',
                items: []
              },
              {
                value: '满足对应的审批流程',
                items: [
                  { value: '提供招待人均费用≤人民币300元无需申请E-hospitality系统；', items: [] },
                  { value: '人均费用＞人民币300元同时≤人民币500元必须得到直线经理及部门经理事先审批；', items: [] },
                  {
                    value:
                      '仅在极少数有合理事由的情形下允许人均费用＞人民币500元，但必须得到直线经理、部门经理（CMT成员）及合规部事先审批。',
                    items: []
                  }
                ]
              },
              {
                value:
                  '基于政府官员身份的特殊性，在为政府官员提供用餐时，需谨慎评估是否合理且必要。同时，如果对方单位有更严格的标准，拜耳须尊重并按照更严格的标准执行。用餐话题不得涉及正在进行的政府调查或该政府官员正在审核的拜耳相关资质等内容，如有特殊情况需得到直线经理、部门经理及合规部的事先审批。人均300元以下（含300元），直线经理事先审批，人均300元以上，需要直线经理、部门经理以及合规部事先审批。',
                items: []
              },
              {
                value: '在PH/CH/CS的业务场景下提供招待，需同时遵守相对应事业部的拜耳礼品招待准则。',
                items: []
              }
            ]
          }
        ],
        desc_0882: [
          {
            label: '请注意，此处用于登记和记录',
            items: [
              {
                value:
                  '在少数情况下，员工在日常业务往来中提供给医疗卫生专业人士、政府官员及经销商这三类人员的超过人均300人民币的用餐招待（包含酒水饮料服务费）。此类招待需提前得到相关审批人（请在以上“批准人”选择一位）的特别批准。获得批准并完成招待后，申请人须至报销系统选择对应的eGift表单申请报销。',
                items: []
              },
              {
                value:
                  '员工在日常业务往来中提供给除医疗卫生专业人士、政府官员及经销商以外的其他第三方超过人均300人民币的用餐招待（包含酒水饮料服务费）。 此类招待无需特别批准。登记并完成招待后，申请人须至报销系统选择对应的eGift表单申请报销。（员工在日常业务往来中提供给第三方的人均小于等于300元的用餐招待（包含酒水饮料服务费），请直接至报销系统提交报销申请。）',
                items: []
              }
            ]
          },
          {
            label: '原则',
            items: [
              {
                value:
                  '员工提供给第三方的招待，应禁止索取、禁止不当影响、避免利益冲突、禁止现金或现金等价物、禁止私人利益',
                items: []
              },
              { value: '（第三方包括但不限于医疗卫生专业人士、政府官员、经销商及其他业务合作方）', items: [] }
            ]
          },
          {
            label: '申请人应遵循以下合规要求',
            items: [
              {
                value:
                  '提供给医疗卫生专业人士、政府官员及经销商的用餐招待，标准是 ≤300人民币每人每次（包含酒水和服务费）',
                items: []
              },
              {
                value:
                  '极少数合理事由情形下，若提供给医疗卫生专业人士、政府官员及经销商的用餐招待超过人均300人民币，需提前得到拜耳中国合规总监，或处方药/ 健康消费品事业部中国负责人，或处方药区域总经理/ 健康消费品销售负责人的批准',
                items: []
              },
              {
                value:
                  '由医药代表组织的与会议无关的招待医疗卫生专业人士用餐，每次用餐总费用（包括酒水）不应超过2,000元人民币。',
                items: []
              },
              {
                value:
                  '如果此类用餐由销售或市场部其他人员组织（例如，地区或大区经理，或治疗领域市场总监），则每次用餐总费用（包括酒水）不应超过3,000元人民币。',
                items: []
              }
            ]
          }
        ],
        desc_1391: [
          {
            label: '备注',
            items: [
              { value: '仅非营销性质的礼品或招待须事先在eGift系统中申请。', items: [] },
              { value: '如果单价小于人民币300元，无需审批。', items: [] },
              { value: '如果单价高于人民币300元（含300元），须获得部门总监、国家经理及合规的审批。', items: [] },
              { value: '向国家工作人员提供礼品和招待，均须获得合规的审批。', items: [] }
            ]
          },
          {
            label: '商务就餐/娱乐活动应满足以下所有条件',
            items: [
              { value: '有合法的目的', items: [] },
              { value: '符合预先评估的商业惯例', items: [] },
              { value: '合理适度', items: [] },
              { value: '符合费用守则规定', items: [] }
            ]
          },
          {
            label: '商业就餐/娱乐活动不能为',
            items: [
              { value: '铺张浪费', items: [] },
              { value: '奢华', items: [] },
              { value: '在非法活动地或附近举行', items: [] },
              { value: '附送的礼品不符合“礼品和招待守则或附表”的规定', items: [] },
              { value: '在名声不佳的场所（例如脱衣舞俱乐部或不合时宜的酒吧）或其他类似的地方', items: [] }
            ]
          }
        ],
        desc_2614: [
          {
            label: '备注',
            items: [
              { value: '如人均总费用不超过RMB300元，则无需批准。', items: [] },
              { value: '如果人均总费用在RMB300元到RMB1000元之间，则需要直线经理的事先批准。', items: [] },
              {
                value: '如人均总费用超过RMB1000元,或者总费用超过6000，则需要直线经理和子集团合规负责人的事先批准。',
                items: []
              },
              {
                value: '如果受邀请参加招待者是政府官员或国有企业员工，则需要直线经理和子集团合规负责人的事先批准。',
                items: []
              }
            ]
          },
          {
            label: '商务就餐/娱乐活动应满足以下所有条件',
            items: [
              { value: '有合法的目的', items: [] },
              { value: '符合预先评估的商业惯例', items: [] },
              { value: '合理适度', items: [] },
              { value: '符合费用守则规定', items: [] }
            ]
          },
          {
            label: '商业就餐/娱乐活动不能为',
            items: [
              { value: '铺张浪费', items: [] },
              { value: '奢华', items: [] },
              { value: '在非法活动地或附近举行', items: [] },
              { value: '附送的礼品不符合“礼品和招待守则或附表”的规定', items: [] },
              { value: '在名声不佳的场所（例如脱衣舞俱乐部或不合时宜的酒吧）或其他类似的地方', items: [] }
            ]
          }
        ]
      }
    },
    givingGifts: {
      applyForm: {
        givingGiftRequestTitle: '赠送礼品申请表',
        remark: '备注（请填写具体礼品名称）',
        remark_validation: '请输入礼品备注信息',
        givingGiftInfo: '赠送礼品信息',
        giftReason_label: '赠送礼品的原因',
        giftReason_label_validation: '请输入提供礼品原因',
        giftDesc_label: '接收礼品的原因',
        giftDesc_label_validation: '请输入接收礼品的原因',
        giftDesc_type_label: '礼品类别',
        giftGivingDate: '赠送日期',
        giftGivingDate_validation: '请选则赠送日期',
        giftGivingCompanyName: '接收者单位名称',
        giftGivingCompanyName_validation: '请输入接受者单位名称',
        giftGivingEmployeeName: '接收者姓名',
        giftGivingEmployeeName_validation: '请输入接受者姓名',
        giftGivingTitle: '接收者职位',
        giftGivingTitle_validation: '请输入接收者职位',
        giftRecipientCategory: '礼品接受者的类别',
        giftIsBayerCustomer: '礼品接收者是否是拜耳现有客户'
      },
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
            label: '备注',
            items: [
              { value: '仅与推广活动无关的礼品须事先在EGift系统中申请。', items: [] },
              {
                value: '如果礼品单价超过300元人民币（不含300元人民币），需要事先取得部门总监、国家经理及合规的审批。',
                items: []
              },
              { value: '原则上不应当向政府官员赠送任何单价超过200元的礼品。', items: [] }
            ]
          }
        ],
        desc_2614: [
          {
            label: '备注',
            items: [
              { value: '仅与推广活动无关的礼品须事先在EGift系统中申请。', items: [] },
              {
                value: '如果礼品单价超过300元人民币（不含300元人民币），需要事先取得部门总监、国家经理及合规的审批。',
                items: []
              },
              { value: '原则上不应当向政府官员赠送任何单价超过200元的礼品。', items: [] }
            ]
          }
        ],
        desc_0813: [
          {
            label: '备注',
            items: [
              { value: '礼品赠送需基于合理的业务场景，合法合规，不得为索取不当利益而赠送礼品；', items: [] },
              { value: '礼品需在适当的会议、业务场合提供，且满足最小数量原则；', items: [] },
              {
                value:
                  '不得赠送有强烈个人属性的物品（如：香烟、酒、社交活动或体育赛事门票等娱乐属性的物品）及现金或现金等价物等；',
                items: []
              },
              {
                value:
                  '批量购买的礼品，在每次赠送时均需申请E-gift，直到批量购买的礼品使用完毕（如该礼品已经在活动审批时经过了必要的审批流程，则无需重复申请）；',
                items: []
              },
              {
                value: '合理选择赠送礼品，金额不易太贵重：',
                items: [
                  { value: '品牌提示物仅为微小价值的物品≤人民币300元，直线经理事前审批；' },
                  {
                    value: '社交、风俗礼品一般为非贵重的物品',
                    items: [
                      { value: '≤人民币300元/人，直线经理事前审批；' },
                      {
                        value:
                          '原则上不允许赠送＞人民币300元/人的礼品，特殊情况需要直线经理、部门经理（CMT成员）以及合规部事先审批。'
                      }
                    ]
                  }
                ]
              },
              {
                value: '接受人员为政府官员/HCP',
                items: [
                  { value: '礼品金额≤200元/人，直线经理事前审批；' },
                  {
                    value:
                      '礼品金额＞200元/人的，须谨慎评估其赠送行为的合理性及必要性，确认需要赠送的，需直线经理、部门经理（CMT成员）及合规部提前在E-gift中审批；'
                  }
                ]
              }
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
    common: {
      upload_file: '上传附件',
      upload_person_label: '附件(您能添加一个包含多个名字的文件)',
      upload_template: '模板下载',
      unitPrice: '单价',
      unitPrice_validation: '请输入单价',
      quantity: '数量',
      quantity_validation: '请输入数量',
      totalPrice: '总价',
      reference: '申请编号',
      reference_placeHolder: '请输入申请编号',
      totalPrice_validation: '请输入总价',
      cancelReson: '请填写取消原因',
      approveComment: '请填写审批意见',
      addPerson: '添加人员',
      historyLog: '历史日志',
      operationInfo: '操作记录',
      remarkInfo: '备注信息',
      option_draft: '草稿',
      option_yes: '是',
      option_no: '否',
      option_not_Applicable: '不适用',
      option_inProcess: '处理中',
      option_complete: '完成',
      option_giftReason_Other: '其他（请在输入栏“赠送礼品的原因”内填写详细的赠送礼品原因）',
      option_giftReason_NewYear: '春节',
      option_giftReason_Mid_Autumn: '中秋节',
      option_Other: '其他',
      option_giftDesc_Company_Branded_Gift: '公司品牌宣传',
      option_giftDesc_General_Gift: '一般物品',
      option_giftDesc_Medicine: '药品',
      option_giftDesc_Cash_Equivalents: '现金或现金等价物',
      option_giftDesc_Present: '礼品',
      option_giftDesc_Cultural_Courtesy: '风俗礼品（仅限于春节和中秋节）',
      option_giftDesc_HCP_Promotional_Supplies: '推广OTC产品时面向HCP提供的推广辅助用品（带公司或品牌标识的）',
      option_giftDesc_Promotional_Supplies: '推广辅助用品（带公司或品牌标识的）',
      option_giftDesc_Other: '其他礼品',

      option_go_sco_Government_Official: '政府官员',
      option_go_sco_Government_Non_Official: '非政府官员',
      option_go_sco_Distributor: '经销商',
      option_go_sco_HCP: '医疗卫生专业人士（HCP）',
      select_validation: '请选择'
    },
    searchFrom: {
      applyStatus: '申请状态',
      applyType: '申请类别',
      givingGifts: '赠送礼品',
      givingHospitality: '给予招待'
    },
    applicateInfo: {
      applicateInfoTitle: '申请人信息',
      formFiller: '填表人',
      applyForCwid: 'CWID',
      formFiller_placeHolder: '请输入填表人',
      applyFor: '申请者',
      applyFor_validation: '请选择申请人',
      applyFor_placeHolder: '请输入申请者',
      applyCC: '抄送',
      applyDate: '申请日期',
      employeeNo: '员工号',
      employeeLe: '公司编号',
      employeeLe_placeHolder: '请输入公司编号',
      department: '部门',
      supervisor: '主管',
      costCenter: '成本中心',
      division: 'DIVISION'
    },

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
