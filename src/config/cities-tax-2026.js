// 2026年中国主要城市社保公积金配置
// Data Source: 各地人社局、公积金中心官网（2025年7月起执行数据）
// Last Update: 2026-04-05

const TAX_CONFIG_2026 = {
  // 个税全国统一标准
  taxThreshold: 5000, // 起征点 5000元/月
  taxBrackets: [
    { min: 0, max: 36000, rate: 3, deduction: 0 },
    { min: 36000, max: 144000, rate: 10, deduction: 2520 },
    { min: 144000, max: 300000, rate: 20, deduction: 16920 },
    { min: 300000, max: 420000, rate: 25, deduction: 31920 },
    { min: 420000, max: 660000, rate: 30, deduction: 52920 },
    { min: 660000, max: 960000, rate: 35, deduction: 85920 },
    { min: 960000, max: Infinity, rate: 45, deduction: 181920 },
  ],

  // 专项附加扣除（全国统一）
  specialDeductions: {
    childEducation: 1000, // 子女教育 1000元/月/人
    infantCare: 1000, // 3岁以下婴幼儿照护 1000元/月/人
    continuingEducation: 400, // 继续教育 400元/月（学历）或 3600元/年（职业资格）
    seriousIllness: 0, // 大病医疗 80000元/年（限额,年度汇算）
    housingLoanInterest: 1000, // 住房贷款利息 1000元/月
    housingRent: {
      // 住房租金（与房贷二选一）
      tier1: 1500, // 直辖市、省会、计划单列市 1500元/月
      tier2: 1100, // 市辖区户籍人口>100万 1100元/月
      tier3: 800, // 其他城市 800元/月
    },
    elderCare: {
      // 赡养老人（60岁以上）
      only: 2000, // 独生子女 2000元/月
      shared: 1000, // 非独生子女 最多1000元/月（需分摊）
    },
  },
};

// 城市社保公积金配置
const CITY_SOCIAL_CONFIG_2026 = {
  上海: {
    name: "上海",
    level: "一线",
    socialBase: {
      min: 7460, // 最低基数（2025.7起）
      max: 37302, // 最高基数（2025.7起）
    },
    socialRate: {
      pension: 0.08, // 养老保险 8%
      medical: 0.02, // 医疗保险 2%（上海个人无额外费用）
      unemployment: 0.005, // 失业保险 0.5%
    },
    fundRate: {
      min: 5, // 公积金最低 5%
      max: 7, // 公积金最高 7%（上海仅支持5%/6%/7%）
    },
    totalRate: 0.105 + 0.06, // 社保10.5% + 公积金6%（常见）= 16.5%
    rentDeduction: 1500, // 房租扣除（一线城市）
  },

  北京: {
    name: "北京",
    level: "一线",
    socialBase: {
      min: 7162,
      max: 35811, // 2025.7起
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      medicalExtra: 3,
      unemployment: 0.002, // 北京失业保险更低
    },
    fundRate: {
      min: 5,
      max: 12, // 北京公积金可到12%
    },
    totalRate: 0.102 + 0.12, // 22.2%
    rentDeduction: 1500,
  },

  深圳: {
    name: "深圳",
    level: "一线",
    socialBase: {
      min: 4492, // 养老保险基数（2025.7起）
      max: 27549, // 广东省统一上限
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003, // 0.3%
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.103 + 0.1, // 20.3%
    rentDeduction: 1500,
  },

  广州: {
    name: "广州",
    level: "一线",
    socialBase: {
      min: 5510,
      max: 27549, // 广东省统一上限（2025.7起）
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.002,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.102 + 0.05, // 15.2%（广州社保率最低）
    rentDeduction: 1500,
  },

  杭州: {
    name: "杭州",
    level: "新一线",
    socialBase: {
      min: 4986,
      max: 25299,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.105 + 0.12, // 22.5%
    rentDeduction: 1500,
  },

  成都: {
    name: "成都",
    level: "新一线",
    socialBase: {
      min: 4588,
      max: 22938,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.004,
    },
    fundRate: {
      min: 6,
      max: 12,
    },
    totalRate: 0.104 + 0.12, // 22.4%
    rentDeduction: 1500,
  },

  南京: {
    name: "南京",
    level: "新一线",
    socialBase: {
      min: 4952,
      max: 24762,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 8,
      max: 12,
    },
    totalRate: 0.105 + 0.12, // 22.5%
    rentDeduction: 1500,
  },

  武汉: {
    name: "武汉",
    level: "新一线",
    socialBase: {
      min: 4498,
      max: 22488,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 8,
      max: 12,
    },
    totalRate: 0.103 + 0.12, // 22.3%
    rentDeduction: 1500,
  },

  苏州: {
    name: "苏州",
    level: "新一线",
    socialBase: {
      min: 4952,
      max: 24762,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 8,
      max: 12,
    },
    totalRate: 0.105 + 0.12, // 22.5%
    rentDeduction: 1100,
  },

  西安: {
    name: "西安",
    level: "新一线",
    socialBase: {
      min: 4559,
      max: 22794,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.103 + 0.12, // 22.3%
    rentDeduction: 1500,
  },

  郑州: {
    name: "郑州",
    level: "二线",
    socialBase: {
      min: 3987,
      max: 19935,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.103 + 0.12, // 22.3%
    rentDeduction: 1100,
  },

  长沙: {
    name: "长沙",
    level: "二线",
    socialBase: {
      min: 4072,
      max: 20361,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.103 + 0.12, // 22.3%
    rentDeduction: 1100,
  },

  青岛: {
    name: "青岛",
    level: "二线",
    socialBase: {
      min: 4416,
      max: 22078,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.105 + 0.12, // 22.5%
    rentDeduction: 1100,
  },

  宁波: {
    name: "宁波",
    level: "二线",
    socialBase: {
      min: 4986,
      max: 25299,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.105 + 0.12, // 22.5%
    rentDeduction: 1100,
  },

  天津: {
    name: "天津",
    level: "直辖市",
    socialBase: {
      min: 5124,
      max: 25620,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 8,
      max: 12,
    },
    totalRate: 0.105 + 0.12, // 22.5%
    rentDeduction: 1500,
  },

  重庆: {
    name: "重庆",
    level: "直辖市",
    socialBase: {
      min: 4403,
      max: 22017,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.105 + 0.12, // 22.5%
    rentDeduction: 1500,
  },

  厦门: {
    name: "厦门",
    level: "二线",
    socialBase: {
      min: 4378,
      max: 24762,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.105 + 0.12, // 22.5%
    rentDeduction: 1100,
  },

  合肥: {
    name: "合肥",
    level: "二线",
    socialBase: {
      min: 4311,
      max: 21556,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.105 + 0.12, // 22.5%
    rentDeduction: 1100,
  },

  沈阳: {
    name: "沈阳",
    level: "二线",
    socialBase: {
      min: 4304,
      max: 21522,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.105 + 0.12, // 22.5%
    rentDeduction: 1100,
  },

  大连: {
    name: "大连",
    level: "二线",
    socialBase: {
      min: 4304,
      max: 21522,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.105 + 0.12, // 22.5%
    rentDeduction: 1100,
  },

  济南: {
    name: "济南",
    level: "二线",
    socialBase: {
      min: 4416,
      max: 22078,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.105 + 0.12, // 22.5%
    rentDeduction: 1100,
  },

  福州: {
    name: "福州",
    level: "二线",
    socialBase: {
      min: 4378,
      max: 24762,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.105 + 0.12, // 22.5%
    rentDeduction: 1100,
  },

  石家庄: {
    name: "石家庄",
    level: "二线",
    socialBase: {
      min: 4007,
      max: 20034,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.103 + 0.12, // 22.3%
    rentDeduction: 1100,
  },

  昆明: {
    name: "昆明",
    level: "二线",
    socialBase: {
      min: 4199,
      max: 20994,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.103 + 0.12, // 22.3%
    rentDeduction: 1100,
  },

  南昌: {
    name: "南昌",
    level: "二线",
    socialBase: {
      min: 4015,
      max: 20076,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.105 + 0.12, // 22.5%
    rentDeduction: 1100,
  },

  太原: {
    name: "太原",
    level: "二线",
    socialBase: {
      min: 4198,
      max: 20991,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.103 + 0.12, // 22.3%
    rentDeduction: 1100,
  },

  贵阳: {
    name: "贵阳",
    level: "二线",
    socialBase: {
      min: 4281,
      max: 21405,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.103 + 0.12, // 22.3%
    rentDeduction: 1100,
  },

  南宁: {
    name: "南宁",
    level: "二线",
    socialBase: {
      min: 3900,
      max: 19500,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.103 + 0.12, // 22.3%
    rentDeduction: 1100,
  },

  哈尔滨: {
    name: "哈尔滨",
    level: "二线",
    socialBase: {
      min: 3938,
      max: 19689,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.105 + 0.12, // 22.5%
    rentDeduction: 1100,
  },

  兰州: {
    name: "兰州",
    level: "二线",
    socialBase: {
      min: 4240,
      max: 21198,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.103 + 0.12, // 22.3%
    rentDeduction: 1100,
  },

  乌鲁木齐: {
    name: "乌鲁木齐",
    level: "二线",
    socialBase: {
      min: 4500,
      max: 22500,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.105 + 0.12, // 22.5%
    rentDeduction: 1100,
  },

  海口: {
    name: "海口",
    level: "二线",
    socialBase: {
      min: 4152,
      max: 20760,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.105 + 0.12, // 22.5%
    rentDeduction: 1100,
  },

  东莞: {
    name: "东莞",
    level: "三线",
    socialBase: {
      min: 4775,
      max: 27549,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.002,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.102 + 0.08, // 18.2%
    rentDeduction: 1100,
  },

  佛山: {
    name: "佛山",
    level: "三线",
    socialBase: {
      min: 4775,
      max: 27549,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.002,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.102 + 0.08, // 18.2%
    rentDeduction: 1100,
  },

  // 江苏省
  镇江: {
    name: "镇江",
    level: "三线",
    socialBase: {
      min: 4952,
      max: 24762,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  扬州: {
    name: "扬州",
    level: "三线",
    socialBase: {
      min: 4952,
      max: 24762,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  泰州: {
    name: "泰州",
    level: "三线",
    socialBase: {
      min: 4952,
      max: 24762,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  盐城: {
    name: "盐城",
    level: "三线",
    socialBase: {
      min: 4952,
      max: 24762,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  淮安: {
    name: "淮安",
    level: "三线",
    socialBase: {
      min: 4952,
      max: 24762,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  宿迁: {
    name: "宿迁",
    level: "三线",
    socialBase: {
      min: 4952,
      max: 24762,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  连云港: {
    name: "连云港",
    level: "三线",
    socialBase: {
      min: 2280,
      max: 25800,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  // 浙江省
  温州: {
    name: "温州",
    level: "三线",
    socialBase: {
      min: 3957,
      max: 23766,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.20500000000000002, // 20.5%
    rentDeduction: 1100,
  },

  湖州: {
    name: "湖州",
    level: "三线",
    socialBase: {
      min: 3957,
      max: 23766,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.20500000000000002, // 20.5%
    rentDeduction: 1100,
  },

  金华: {
    name: "金华",
    level: "三线",
    socialBase: {
      min: 3957,
      max: 23766,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.20500000000000002, // 20.5%
    rentDeduction: 1100,
  },

  衢州: {
    name: "衢州",
    level: "三线",
    socialBase: {
      min: 3957,
      max: 23766,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.20500000000000002, // 20.5%
    rentDeduction: 1100,
  },

  舟山: {
    name: "舟山",
    level: "三线",
    socialBase: {
      min: 3957,
      max: 23766,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.20500000000000002, // 20.5%
    rentDeduction: 1100,
  },

  台州: {
    name: "台州",
    level: "三线",
    socialBase: {
      min: 3957,
      max: 23766,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.20500000000000002, // 20.5%
    rentDeduction: 1100,
  },

  丽水: {
    name: "丽水",
    level: "三线",
    socialBase: {
      min: 3957,
      max: 23766,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.20500000000000002, // 20.5%
    rentDeduction: 1100,
  },

  // 山东省
  淄博: {
    name: "淄博",
    level: "三线",
    socialBase: {
      min: 3980,
      max: 21900,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  枣庄: {
    name: "枣庄",
    level: "三线",
    socialBase: {
      min: 3980,
      max: 21900,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  东营: {
    name: "东营",
    level: "三线",
    socialBase: {
      min: 3980,
      max: 21900,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  烟台: {
    name: "烟台",
    level: "三线",
    socialBase: {
      min: 3980,
      max: 21900,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  潍坊: {
    name: "潍坊",
    level: "三线",
    socialBase: {
      min: 3980,
      max: 21900,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  威海: {
    name: "威海",
    level: "三线",
    socialBase: {
      min: 3980,
      max: 21900,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  泰安: {
    name: "泰安",
    level: "三线",
    socialBase: {
      min: 3980,
      max: 21900,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  临沂: {
    name: "临沂",
    level: "三线",
    socialBase: {
      min: 3980,
      max: 21900,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  德州: {
    name: "德州",
    level: "三线",
    socialBase: {
      min: 3980,
      max: 21900,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  聊城: {
    name: "聊城",
    level: "三线",
    socialBase: {
      min: 3980,
      max: 21900,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  滨州: {
    name: "滨州",
    level: "三线",
    socialBase: {
      min: 3980,
      max: 21900,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  菏泽: {
    name: "菏泽",
    level: "三线",
    socialBase: {
      min: 3980,
      max: 21900,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  // 安徽省
  淮北: {
    name: "淮北",
    level: "三线",
    socialBase: {
      min: 3429,
      max: 18930,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  铜陵: {
    name: "铜陵",
    level: "三线",
    socialBase: {
      min: 3429,
      max: 18930,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  安庆: {
    name: "安庆",
    level: "三线",
    socialBase: {
      min: 3429,
      max: 18930,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  黄山: {
    name: "黄山",
    level: "三线",
    socialBase: {
      min: 3429,
      max: 18930,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  滁州: {
    name: "滁州",
    level: "三线",
    socialBase: {
      min: 3429,
      max: 18930,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  阜阳: {
    name: "阜阳",
    level: "三线",
    socialBase: {
      min: 3429,
      max: 18930,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  宿州: {
    name: "宿州",
    level: "三线",
    socialBase: {
      min: 3429,
      max: 18930,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  六安: {
    name: "六安",
    level: "三线",
    socialBase: {
      min: 3429,
      max: 18930,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  亳州: {
    name: "亳州",
    level: "三线",
    socialBase: {
      min: 3429,
      max: 18930,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  池州: {
    name: "池州",
    level: "三线",
    socialBase: {
      min: 3429,
      max: 18930,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  宣城: {
    name: "宣城",
    level: "三线",
    socialBase: {
      min: 3429,
      max: 18930,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  // 福建省
  三明: {
    name: "三明",
    level: "三线",
    socialBase: {
      min: 1720,
      max: 22311,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  莆田: {
    name: "莆田",
    level: "三线",
    socialBase: {
      min: 1720,
      max: 22311,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  泉州: {
    name: "泉州",
    level: "三线",
    socialBase: {
      min: 1720,
      max: 22311,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  漳州: {
    name: "漳州",
    level: "三线",
    socialBase: {
      min: 1720,
      max: 22311,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  南平: {
    name: "南平",
    level: "三线",
    socialBase: {
      min: 1720,
      max: 22311,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  龙岩: {
    name: "龙岩",
    level: "三线",
    socialBase: {
      min: 1720,
      max: 22311,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  宁德: {
    name: "宁德",
    level: "三线",
    socialBase: {
      min: 1720,
      max: 22311,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  // 江西省
  景德镇: {
    name: "景德镇",
    level: "三线",
    socialBase: {
      min: 3224,
      max: 16119,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  萍乡: {
    name: "萍乡",
    level: "三线",
    socialBase: {
      min: 3224,
      max: 16119,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  九江: {
    name: "九江",
    level: "三线",
    socialBase: {
      min: 3224,
      max: 16119,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  新余: {
    name: "新余",
    level: "三线",
    socialBase: {
      min: 3224,
      max: 16119,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  鹰潭: {
    name: "鹰潭",
    level: "三线",
    socialBase: {
      min: 3224,
      max: 16119,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  赣州: {
    name: "赣州",
    level: "三线",
    socialBase: {
      min: 3224,
      max: 16119,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  吉安: {
    name: "吉安",
    level: "三线",
    socialBase: {
      min: 3224,
      max: 16119,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  宜春: {
    name: "宜春",
    level: "三线",
    socialBase: {
      min: 3224,
      max: 16119,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  抚州: {
    name: "抚州",
    level: "三线",
    socialBase: {
      min: 3224,
      max: 16119,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  上饶: {
    name: "上饶",
    level: "三线",
    socialBase: {
      min: 3224,
      max: 16119,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  // 河北省
  唐山: {
    name: "唐山",
    level: "三线",
    socialBase: {
      min: 3368,
      max: 19849,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  秦皇岛: {
    name: "秦皇岛",
    level: "三线",
    socialBase: {
      min: 3368,
      max: 19849,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  邯郸: {
    name: "邯郸",
    level: "三线",
    socialBase: {
      min: 3368,
      max: 19849,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  邢台: {
    name: "邢台",
    level: "三线",
    socialBase: {
      min: 3368,
      max: 19849,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  保定: {
    name: "保定",
    level: "三线",
    socialBase: {
      min: 3368,
      max: 19849,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  张家口: {
    name: "张家口",
    level: "三线",
    socialBase: {
      min: 3368,
      max: 19849,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  承德: {
    name: "承德",
    level: "三线",
    socialBase: {
      min: 3368,
      max: 19849,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  沧州: {
    name: "沧州",
    level: "三线",
    socialBase: {
      min: 3368,
      max: 19849,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  廊坊: {
    name: "廊坊",
    level: "三线",
    socialBase: {
      min: 3368,
      max: 19849,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  衡水: {
    name: "衡水",
    level: "三线",
    socialBase: {
      min: 3368,
      max: 19849,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  // 河南省
  洛阳: {
    name: "洛阳",
    level: "三线",
    socialBase: {
      min: 3179,
      max: 17455,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.183, // 18.3%
    rentDeduction: 1100,
  },

  开封: {
    name: "开封",
    level: "三线",
    socialBase: {
      min: 3179,
      max: 17455,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.183, // 18.3%
    rentDeduction: 1100,
  },

  平顶山: {
    name: "平顶山",
    level: "三线",
    socialBase: {
      min: 3179,
      max: 17455,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.183, // 18.3%
    rentDeduction: 1100,
  },

  安阳: {
    name: "安阳",
    level: "三线",
    socialBase: {
      min: 3179,
      max: 17455,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.183, // 18.3%
    rentDeduction: 1100,
  },

  鹤壁: {
    name: "鹤壁",
    level: "三线",
    socialBase: {
      min: 3179,
      max: 17455,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.183, // 18.3%
    rentDeduction: 1100,
  },

  新乡: {
    name: "新乡",
    level: "三线",
    socialBase: {
      min: 3179,
      max: 17455,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.183, // 18.3%
    rentDeduction: 1100,
  },

  焦作: {
    name: "焦作",
    level: "三线",
    socialBase: {
      min: 3179,
      max: 17455,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.183, // 18.3%
    rentDeduction: 1100,
  },

  濮阳: {
    name: "濮阳",
    level: "三线",
    socialBase: {
      min: 3179,
      max: 17455,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.183, // 18.3%
    rentDeduction: 1100,
  },

  许昌: {
    name: "许昌",
    level: "三线",
    socialBase: {
      min: 3179,
      max: 17455,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.183, // 18.3%
    rentDeduction: 1100,
  },

  漯河: {
    name: "漯河",
    level: "三线",
    socialBase: {
      min: 3179,
      max: 17455,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.183, // 18.3%
    rentDeduction: 1100,
  },

  三门峡: {
    name: "三门峡",
    level: "三线",
    socialBase: {
      min: 3179,
      max: 17455,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.183, // 18.3%
    rentDeduction: 1100,
  },

  南阳: {
    name: "南阳",
    level: "三线",
    socialBase: {
      min: 3179,
      max: 17455,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.183, // 18.3%
    rentDeduction: 1100,
  },

  商丘: {
    name: "商丘",
    level: "三线",
    socialBase: {
      min: 3179,
      max: 17455,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.183, // 18.3%
    rentDeduction: 1100,
  },

  信阳: {
    name: "信阳",
    level: "三线",
    socialBase: {
      min: 3179,
      max: 17455,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.183, // 18.3%
    rentDeduction: 1100,
  },

  周口: {
    name: "周口",
    level: "三线",
    socialBase: {
      min: 3179,
      max: 17455,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.183, // 18.3%
    rentDeduction: 1100,
  },

  驻马店: {
    name: "驻马店",
    level: "三线",
    socialBase: {
      min: 3179,
      max: 17455,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.183, // 18.3%
    rentDeduction: 1100,
  },

  // 山西省
  大同: {
    name: "大同",
    level: "三线",
    socialBase: {
      min: 3235,
      max: 16173,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  阳泉: {
    name: "阳泉",
    level: "三线",
    socialBase: {
      min: 3235,
      max: 16173,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  长治: {
    name: "长治",
    level: "三线",
    socialBase: {
      min: 3235,
      max: 16173,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  晋城: {
    name: "晋城",
    level: "三线",
    socialBase: {
      min: 3235,
      max: 16173,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  朔州: {
    name: "朔州",
    level: "三线",
    socialBase: {
      min: 3235,
      max: 16173,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  晋中: {
    name: "晋中",
    level: "三线",
    socialBase: {
      min: 3235,
      max: 16173,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  运城: {
    name: "运城",
    level: "三线",
    socialBase: {
      min: 3235,
      max: 16173,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  忻州: {
    name: "忻州",
    level: "三线",
    socialBase: {
      min: 3235,
      max: 16173,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  临汾: {
    name: "临汾",
    level: "三线",
    socialBase: {
      min: 3235,
      max: 16173,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  吕梁: {
    name: "吕梁",
    level: "三线",
    socialBase: {
      min: 3235,
      max: 16173,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  // 内蒙古省
  包头: {
    name: "包头",
    level: "三线",
    socialBase: {
      min: 3462,
      max: 19008,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  乌海: {
    name: "乌海",
    level: "三线",
    socialBase: {
      min: 3462,
      max: 19008,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  赤峰: {
    name: "赤峰",
    level: "三线",
    socialBase: {
      min: 3462,
      max: 19008,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  通辽: {
    name: "通辽",
    level: "三线",
    socialBase: {
      min: 3462,
      max: 19008,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  鄂尔多斯: {
    name: "鄂尔多斯",
    level: "三线",
    socialBase: {
      min: 3462,
      max: 19008,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  呼伦贝尔: {
    name: "呼伦贝尔",
    level: "三线",
    socialBase: {
      min: 3462,
      max: 19008,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  巴彦淖尔: {
    name: "巴彦淖尔",
    level: "三线",
    socialBase: {
      min: 3462,
      max: 19008,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  乌兰察布: {
    name: "乌兰察布",
    level: "三线",
    socialBase: {
      min: 3462,
      max: 19008,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  // 广东省
  珠海: {
    name: "珠海",
    level: "三线",
    socialBase: {
      min: 2300,
      max: 36072,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.002,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.202, // 20.2%
    rentDeduction: 1100,
  },

  汕头: {
    name: "汕头",
    level: "三线",
    socialBase: {
      min: 2300,
      max: 36072,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.002,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.202, // 20.2%
    rentDeduction: 1100,
  },

  韶关: {
    name: "韶关",
    level: "三线",
    socialBase: {
      min: 2300,
      max: 36072,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.002,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.202, // 20.2%
    rentDeduction: 1100,
  },

  湛江: {
    name: "湛江",
    level: "三线",
    socialBase: {
      min: 2300,
      max: 36072,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.002,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.202, // 20.2%
    rentDeduction: 1100,
  },

  肇庆: {
    name: "肇庆",
    level: "三线",
    socialBase: {
      min: 2300,
      max: 36072,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.002,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.202, // 20.2%
    rentDeduction: 1100,
  },

  江门: {
    name: "江门",
    level: "三线",
    socialBase: {
      min: 2300,
      max: 36072,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.002,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.202, // 20.2%
    rentDeduction: 1100,
  },

  茂名: {
    name: "茂名",
    level: "三线",
    socialBase: {
      min: 2300,
      max: 36072,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.002,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.202, // 20.2%
    rentDeduction: 1100,
  },

  惠州: {
    name: "惠州",
    level: "三线",
    socialBase: {
      min: 2300,
      max: 36072,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.002,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.202, // 20.2%
    rentDeduction: 1100,
  },

  梅州: {
    name: "梅州",
    level: "三线",
    socialBase: {
      min: 2300,
      max: 36072,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.002,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.202, // 20.2%
    rentDeduction: 1100,
  },

  汕尾: {
    name: "汕尾",
    level: "三线",
    socialBase: {
      min: 2300,
      max: 36072,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.002,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.202, // 20.2%
    rentDeduction: 1100,
  },

  河源: {
    name: "河源",
    level: "三线",
    socialBase: {
      min: 2300,
      max: 36072,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.002,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.202, // 20.2%
    rentDeduction: 1100,
  },

  阳江: {
    name: "阳江",
    level: "三线",
    socialBase: {
      min: 2300,
      max: 36072,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.002,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.202, // 20.2%
    rentDeduction: 1100,
  },

  清远: {
    name: "清远",
    level: "三线",
    socialBase: {
      min: 2300,
      max: 36072,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.002,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.202, // 20.2%
    rentDeduction: 1100,
  },

  潮州: {
    name: "潮州",
    level: "三线",
    socialBase: {
      min: 2300,
      max: 36072,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.002,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.202, // 20.2%
    rentDeduction: 1100,
  },

  揭阳: {
    name: "揭阳",
    level: "三线",
    socialBase: {
      min: 2300,
      max: 36072,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.002,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.202, // 20.2%
    rentDeduction: 1100,
  },

  云浮: {
    name: "云浮",
    level: "三线",
    socialBase: {
      min: 2300,
      max: 36072,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.002,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.202, // 20.2%
    rentDeduction: 1100,
  },

  // 广西省
  柳州: {
    name: "柳州",
    level: "三线",
    socialBase: {
      min: 3323,
      max: 19938,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  桂林: {
    name: "桂林",
    level: "三线",
    socialBase: {
      min: 3323,
      max: 19938,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  梧州: {
    name: "梧州",
    level: "三线",
    socialBase: {
      min: 3323,
      max: 19938,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  北海: {
    name: "北海",
    level: "三线",
    socialBase: {
      min: 3323,
      max: 19938,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  防城港: {
    name: "防城港",
    level: "三线",
    socialBase: {
      min: 3323,
      max: 19938,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  钦州: {
    name: "钦州",
    level: "三线",
    socialBase: {
      min: 3323,
      max: 19938,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  贵港: {
    name: "贵港",
    level: "三线",
    socialBase: {
      min: 3323,
      max: 19938,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  玉林: {
    name: "玉林",
    level: "三线",
    socialBase: {
      min: 3323,
      max: 19938,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  百色: {
    name: "百色",
    level: "三线",
    socialBase: {
      min: 3323,
      max: 19938,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  贺州: {
    name: "贺州",
    level: "三线",
    socialBase: {
      min: 3323,
      max: 19938,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  河池: {
    name: "河池",
    level: "三线",
    socialBase: {
      min: 3323,
      max: 19938,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  来宾: {
    name: "来宾",
    level: "三线",
    socialBase: {
      min: 3323,
      max: 19938,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  崇左: {
    name: "崇左",
    level: "三线",
    socialBase: {
      min: 3323,
      max: 19938,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  // 海南省
  三亚: {
    name: "三亚",
    level: "三线",
    socialBase: {
      min: 1830,
      max: 21843,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  三沙: {
    name: "三沙",
    level: "三线",
    socialBase: {
      min: 1830,
      max: 21843,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  儋州: {
    name: "儋州",
    level: "三线",
    socialBase: {
      min: 1830,
      max: 21843,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  五指山: {
    name: "五指山",
    level: "三线",
    socialBase: {
      min: 1830,
      max: 21843,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  琼海: {
    name: "琼海",
    level: "三线",
    socialBase: {
      min: 1830,
      max: 21843,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  文昌: {
    name: "文昌",
    level: "三线",
    socialBase: {
      min: 1830,
      max: 21843,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  万宁: {
    name: "万宁",
    level: "三线",
    socialBase: {
      min: 1830,
      max: 21843,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  东方: {
    name: "东方",
    level: "三线",
    socialBase: {
      min: 1830,
      max: 21843,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  // 湖北省
  黄石: {
    name: "黄石",
    level: "三线",
    socialBase: {
      min: 3739.8,
      max: 18699,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.183, // 18.3%
    rentDeduction: 1100,
  },

  十堰: {
    name: "十堰",
    level: "三线",
    socialBase: {
      min: 3739.8,
      max: 18699,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.183, // 18.3%
    rentDeduction: 1100,
  },

  宜昌: {
    name: "宜昌",
    level: "三线",
    socialBase: {
      min: 3739.8,
      max: 18699,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.183, // 18.3%
    rentDeduction: 1100,
  },

  襄阳: {
    name: "襄阳",
    level: "三线",
    socialBase: {
      min: 3739.8,
      max: 18699,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.183, // 18.3%
    rentDeduction: 1100,
  },

  鄂州: {
    name: "鄂州",
    level: "三线",
    socialBase: {
      min: 3739.8,
      max: 18699,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.183, // 18.3%
    rentDeduction: 1100,
  },

  荆门: {
    name: "荆门",
    level: "三线",
    socialBase: {
      min: 3739.8,
      max: 18699,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.183, // 18.3%
    rentDeduction: 1100,
  },

  孝感: {
    name: "孝感",
    level: "三线",
    socialBase: {
      min: 3739.8,
      max: 18699,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.183, // 18.3%
    rentDeduction: 1100,
  },

  荆州: {
    name: "荆州",
    level: "三线",
    socialBase: {
      min: 3739.8,
      max: 18699,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.183, // 18.3%
    rentDeduction: 1100,
  },

  黄冈: {
    name: "黄冈",
    level: "三线",
    socialBase: {
      min: 3739.8,
      max: 18699,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.183, // 18.3%
    rentDeduction: 1100,
  },

  咸宁: {
    name: "咸宁",
    level: "三线",
    socialBase: {
      min: 3739.8,
      max: 18699,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.183, // 18.3%
    rentDeduction: 1100,
  },

  随州: {
    name: "随州",
    level: "三线",
    socialBase: {
      min: 3739.8,
      max: 18699,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.183, // 18.3%
    rentDeduction: 1100,
  },

  // 湖南省
  株洲: {
    name: "株洲",
    level: "三线",
    socialBase: {
      min: 3263,
      max: 16314,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.183, // 18.3%
    rentDeduction: 1100,
  },

  湘潭: {
    name: "湘潭",
    level: "三线",
    socialBase: {
      min: 3263,
      max: 16314,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.183, // 18.3%
    rentDeduction: 1100,
  },

  衡阳: {
    name: "衡阳",
    level: "三线",
    socialBase: {
      min: 3263,
      max: 16314,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.183, // 18.3%
    rentDeduction: 1100,
  },

  邵阳: {
    name: "邵阳",
    level: "三线",
    socialBase: {
      min: 3263,
      max: 16314,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.183, // 18.3%
    rentDeduction: 1100,
  },

  岳阳: {
    name: "岳阳",
    level: "三线",
    socialBase: {
      min: 3263,
      max: 16314,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.183, // 18.3%
    rentDeduction: 1100,
  },

  常德: {
    name: "常德",
    level: "三线",
    socialBase: {
      min: 3263,
      max: 16314,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.183, // 18.3%
    rentDeduction: 1100,
  },

  张家界: {
    name: "张家界",
    level: "三线",
    socialBase: {
      min: 3263,
      max: 16314,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.183, // 18.3%
    rentDeduction: 1100,
  },

  益阳: {
    name: "益阳",
    level: "三线",
    socialBase: {
      min: 3263,
      max: 16314,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.183, // 18.3%
    rentDeduction: 1100,
  },

  郴州: {
    name: "郴州",
    level: "三线",
    socialBase: {
      min: 3263,
      max: 16314,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.183, // 18.3%
    rentDeduction: 1100,
  },

  永州: {
    name: "永州",
    level: "三线",
    socialBase: {
      min: 3263,
      max: 16314,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.183, // 18.3%
    rentDeduction: 1100,
  },

  怀化: {
    name: "怀化",
    level: "三线",
    socialBase: {
      min: 3263,
      max: 16314,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.183, // 18.3%
    rentDeduction: 1100,
  },

  娄底: {
    name: "娄底",
    level: "三线",
    socialBase: {
      min: 3263,
      max: 16314,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.183, // 18.3%
    rentDeduction: 1100,
  },

  // 四川省
  自贡: {
    name: "自贡",
    level: "三线",
    socialBase: {
      min: 3726,
      max: 18630,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.004,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.184, // 18.4%
    rentDeduction: 1100,
  },

  攀枝花: {
    name: "攀枝花",
    level: "三线",
    socialBase: {
      min: 3726,
      max: 18630,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.004,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.184, // 18.4%
    rentDeduction: 1100,
  },

  泸州: {
    name: "泸州",
    level: "三线",
    socialBase: {
      min: 3726,
      max: 18630,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.004,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.184, // 18.4%
    rentDeduction: 1100,
  },

  德阳: {
    name: "德阳",
    level: "三线",
    socialBase: {
      min: 3726,
      max: 18630,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.004,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.184, // 18.4%
    rentDeduction: 1100,
  },

  绵阳: {
    name: "绵阳",
    level: "三线",
    socialBase: {
      min: 3726,
      max: 18630,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.004,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.184, // 18.4%
    rentDeduction: 1100,
  },

  广元: {
    name: "广元",
    level: "三线",
    socialBase: {
      min: 3726,
      max: 18630,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.004,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.184, // 18.4%
    rentDeduction: 1100,
  },

  遂宁: {
    name: "遂宁",
    level: "三线",
    socialBase: {
      min: 3726,
      max: 18630,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.004,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.184, // 18.4%
    rentDeduction: 1100,
  },

  内江: {
    name: "内江",
    level: "三线",
    socialBase: {
      min: 3726,
      max: 18630,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.004,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.184, // 18.4%
    rentDeduction: 1100,
  },

  乐山: {
    name: "乐山",
    level: "三线",
    socialBase: {
      min: 3726,
      max: 18630,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.004,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.184, // 18.4%
    rentDeduction: 1100,
  },

  南充: {
    name: "南充",
    level: "三线",
    socialBase: {
      min: 3726,
      max: 18630,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.004,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.184, // 18.4%
    rentDeduction: 1100,
  },

  眉山: {
    name: "眉山",
    level: "三线",
    socialBase: {
      min: 3726,
      max: 18630,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.004,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.184, // 18.4%
    rentDeduction: 1100,
  },

  宜宾: {
    name: "宜宾",
    level: "三线",
    socialBase: {
      min: 3726,
      max: 18630,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.004,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.184, // 18.4%
    rentDeduction: 1100,
  },

  广安: {
    name: "广安",
    level: "三线",
    socialBase: {
      min: 3726,
      max: 18630,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.004,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.184, // 18.4%
    rentDeduction: 1100,
  },

  达州: {
    name: "达州",
    level: "三线",
    socialBase: {
      min: 3726,
      max: 18630,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.004,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.184, // 18.4%
    rentDeduction: 1100,
  },

  雅安: {
    name: "雅安",
    level: "三线",
    socialBase: {
      min: 3726,
      max: 18630,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.004,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.184, // 18.4%
    rentDeduction: 1100,
  },

  巴中: {
    name: "巴中",
    level: "三线",
    socialBase: {
      min: 3726,
      max: 18630,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.004,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.184, // 18.4%
    rentDeduction: 1100,
  },

  资阳: {
    name: "资阳",
    level: "三线",
    socialBase: {
      min: 3726,
      max: 18630,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.004,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.184, // 18.4%
    rentDeduction: 1100,
  },

  // 贵州省
  六盘水: {
    name: "六盘水",
    level: "三线",
    socialBase: {
      min: 3712.8,
      max: 18564,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  遵义: {
    name: "遵义",
    level: "三线",
    socialBase: {
      min: 3712.8,
      max: 18564,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  安顺: {
    name: "安顺",
    level: "三线",
    socialBase: {
      min: 3712.8,
      max: 18564,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  毕节: {
    name: "毕节",
    level: "三线",
    socialBase: {
      min: 3712.8,
      max: 18564,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  铜仁: {
    name: "铜仁",
    level: "三线",
    socialBase: {
      min: 3712.8,
      max: 18564,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  // 云南省
  曲靖: {
    name: "曲靖",
    level: "三线",
    socialBase: {
      min: 3770,
      max: 18849,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  玉溪: {
    name: "玉溪",
    level: "三线",
    socialBase: {
      min: 3770,
      max: 18849,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  保山: {
    name: "保山",
    level: "三线",
    socialBase: {
      min: 3770,
      max: 18849,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  昭通: {
    name: "昭通",
    level: "三线",
    socialBase: {
      min: 3770,
      max: 18849,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  丽江: {
    name: "丽江",
    level: "三线",
    socialBase: {
      min: 3770,
      max: 18849,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  普洱: {
    name: "普洱",
    level: "三线",
    socialBase: {
      min: 3770,
      max: 18849,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  临沧: {
    name: "临沧",
    level: "三线",
    socialBase: {
      min: 3770,
      max: 18849,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  // 陕西省
  铜川: {
    name: "铜川",
    level: "三线",
    socialBase: {
      min: 4172,
      max: 20862,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.183, // 18.3%
    rentDeduction: 1100,
  },

  宝鸡: {
    name: "宝鸡",
    level: "三线",
    socialBase: {
      min: 4172,
      max: 20862,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.183, // 18.3%
    rentDeduction: 1100,
  },

  咸阳: {
    name: "咸阳",
    level: "三线",
    socialBase: {
      min: 4172,
      max: 20862,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.183, // 18.3%
    rentDeduction: 1100,
  },

  渭南: {
    name: "渭南",
    level: "三线",
    socialBase: {
      min: 4172,
      max: 20862,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.183, // 18.3%
    rentDeduction: 1100,
  },

  延安: {
    name: "延安",
    level: "三线",
    socialBase: {
      min: 4172,
      max: 20862,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.183, // 18.3%
    rentDeduction: 1100,
  },

  汉中: {
    name: "汉中",
    level: "三线",
    socialBase: {
      min: 4172,
      max: 20862,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.183, // 18.3%
    rentDeduction: 1100,
  },

  榆林: {
    name: "榆林",
    level: "三线",
    socialBase: {
      min: 4172,
      max: 20862,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.183, // 18.3%
    rentDeduction: 1100,
  },

  安康: {
    name: "安康",
    level: "三线",
    socialBase: {
      min: 4172,
      max: 20862,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.183, // 18.3%
    rentDeduction: 1100,
  },

  商洛: {
    name: "商洛",
    level: "三线",
    socialBase: {
      min: 4172,
      max: 20862,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.183, // 18.3%
    rentDeduction: 1100,
  },

  // 甘肃省
  嘉峪关: {
    name: "嘉峪关",
    level: "三线",
    socialBase: {
      min: 3678,
      max: 18390,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  金昌: {
    name: "金昌",
    level: "三线",
    socialBase: {
      min: 3678,
      max: 18390,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  白银: {
    name: "白银",
    level: "三线",
    socialBase: {
      min: 3678,
      max: 18390,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  天水: {
    name: "天水",
    level: "三线",
    socialBase: {
      min: 3678,
      max: 18390,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  武威: {
    name: "武威",
    level: "三线",
    socialBase: {
      min: 3678,
      max: 18390,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  张掖: {
    name: "张掖",
    level: "三线",
    socialBase: {
      min: 3678,
      max: 18390,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  平凉: {
    name: "平凉",
    level: "三线",
    socialBase: {
      min: 3678,
      max: 18390,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  酒泉: {
    name: "酒泉",
    level: "三线",
    socialBase: {
      min: 3678,
      max: 18390,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  庆阳: {
    name: "庆阳",
    level: "三线",
    socialBase: {
      min: 3678,
      max: 18390,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  定西: {
    name: "定西",
    level: "三线",
    socialBase: {
      min: 3678,
      max: 18390,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  陇南: {
    name: "陇南",
    level: "三线",
    socialBase: {
      min: 3678,
      max: 18390,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  // 青海省
  西宁: {
    name: "西宁",
    level: "三线",
    socialBase: {
      min: 3800,
      max: 19000,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  海东: {
    name: "海东",
    level: "三线",
    socialBase: {
      min: 3800,
      max: 19000,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  // 宁夏省
  银川: {
    name: "银川",
    level: "三线",
    socialBase: {
      min: 3523,
      max: 17615,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  石嘴山: {
    name: "石嘴山",
    level: "三线",
    socialBase: {
      min: 3523,
      max: 17615,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  吴忠: {
    name: "吴忠",
    level: "三线",
    socialBase: {
      min: 3523,
      max: 17615,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  固原: {
    name: "固原",
    level: "三线",
    socialBase: {
      min: 3523,
      max: 17615,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  中卫: {
    name: "中卫",
    level: "三线",
    socialBase: {
      min: 3523,
      max: 17615,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  // 新疆省
  克拉玛依: {
    name: "克拉玛依",
    level: "三线",
    socialBase: {
      min: 3682,
      max: 18409,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  吐鲁番: {
    name: "吐鲁番",
    level: "三线",
    socialBase: {
      min: 3682,
      max: 18409,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  哈密: {
    name: "哈密",
    level: "三线",
    socialBase: {
      min: 3682,
      max: 18409,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  昌吉: {
    name: "昌吉",
    level: "三线",
    socialBase: {
      min: 3682,
      max: 18409,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  博尔塔拉: {
    name: "博尔塔拉",
    level: "三线",
    socialBase: {
      min: 3682,
      max: 18409,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  巴音郭楞: {
    name: "巴音郭楞",
    level: "三线",
    socialBase: {
      min: 3682,
      max: 18409,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  阿克苏: {
    name: "阿克苏",
    level: "三线",
    socialBase: {
      min: 3682,
      max: 18409,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  喀什: {
    name: "喀什",
    level: "三线",
    socialBase: {
      min: 3682,
      max: 18409,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  和田: {
    name: "和田",
    level: "三线",
    socialBase: {
      min: 3682,
      max: 18409,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  // 辽宁省
  鞍山: {
    name: "鞍山",
    level: "三线",
    socialBase: {
      min: 3500,
      max: 19557,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  抚顺: {
    name: "抚顺",
    level: "三线",
    socialBase: {
      min: 3500,
      max: 19557,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  本溪: {
    name: "本溪",
    level: "三线",
    socialBase: {
      min: 3500,
      max: 19557,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  丹东: {
    name: "丹东",
    level: "三线",
    socialBase: {
      min: 3500,
      max: 19557,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  锦州: {
    name: "锦州",
    level: "三线",
    socialBase: {
      min: 3500,
      max: 19557,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  营口: {
    name: "营口",
    level: "三线",
    socialBase: {
      min: 3500,
      max: 19557,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  阜新: {
    name: "阜新",
    level: "三线",
    socialBase: {
      min: 3500,
      max: 19557,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  辽阳: {
    name: "辽阳",
    level: "三线",
    socialBase: {
      min: 3500,
      max: 19557,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  盘锦: {
    name: "盘锦",
    level: "三线",
    socialBase: {
      min: 3500,
      max: 19557,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  铁岭: {
    name: "铁岭",
    level: "三线",
    socialBase: {
      min: 3500,
      max: 19557,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  朝阳: {
    name: "朝阳",
    level: "三线",
    socialBase: {
      min: 3500,
      max: 19557,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  葫芦岛: {
    name: "葫芦岛",
    level: "三线",
    socialBase: {
      min: 3500,
      max: 19557,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 1100,
  },

  // 吉林省
  吉林: {
    name: "吉林",
    level: "三线",
    socialBase: {
      min: 3250,
      max: 18239,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  四平: {
    name: "四平",
    level: "三线",
    socialBase: {
      min: 3250,
      max: 18239,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  辽源: {
    name: "辽源",
    level: "三线",
    socialBase: {
      min: 3250,
      max: 18239,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  通化: {
    name: "通化",
    level: "三线",
    socialBase: {
      min: 3250,
      max: 18239,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  白山: {
    name: "白山",
    level: "三线",
    socialBase: {
      min: 3250,
      max: 18239,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  松原: {
    name: "松原",
    level: "三线",
    socialBase: {
      min: 3250,
      max: 18239,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  白城: {
    name: "白城",
    level: "三线",
    socialBase: {
      min: 3250,
      max: 18239,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  // 黑龙江省
  齐齐哈尔: {
    name: "齐齐哈尔",
    level: "三线",
    socialBase: {
      min: 3184,
      max: 17919,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  鸡西: {
    name: "鸡西",
    level: "三线",
    socialBase: {
      min: 3184,
      max: 17919,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  鹤岗: {
    name: "鹤岗",
    level: "三线",
    socialBase: {
      min: 3184,
      max: 17919,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  双鸭山: {
    name: "双鸭山",
    level: "三线",
    socialBase: {
      min: 3184,
      max: 17919,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  大庆: {
    name: "大庆",
    level: "三线",
    socialBase: {
      min: 3184,
      max: 17919,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  伊春: {
    name: "伊春",
    level: "三线",
    socialBase: {
      min: 3184,
      max: 17919,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  佳木斯: {
    name: "佳木斯",
    level: "三线",
    socialBase: {
      min: 3184,
      max: 17919,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  七台河: {
    name: "七台河",
    level: "三线",
    socialBase: {
      min: 3184,
      max: 17919,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  牡丹江: {
    name: "牡丹江",
    level: "三线",
    socialBase: {
      min: 3184,
      max: 17919,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  黑河: {
    name: "黑河",
    level: "三线",
    socialBase: {
      min: 3184,
      max: 17919,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  绥化: {
    name: "绥化",
    level: "三线",
    socialBase: {
      min: 3184,
      max: 17919,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.185, // 18.5%
    rentDeduction: 800,
  },

  // 默认配置（其他城市）
  其他城市: {
    name: "其他城市",
    level: "三四线",
    socialBase: {
      min: 3000,
      max: 18000,
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
    },
    fundRate: {
      min: 5,
      max: 12,
    },
    totalRate: 0.103 + 0.08, // 18.3%
    rentDeduction: 800,
  },
};

// 年终奖临界点（重要！）
// Bonus tax monthly brackets (年终奖单独计税月度税率表)
// bonus/12 maps to these monthly brackets, tax = bonus * rate - deduction
const BONUS_TAX_BRACKETS = [
  { min: 0, max: 3000, rate: 3, deduction: 0 },
  { min: 3000, max: 12000, rate: 10, deduction: 210 },
  { min: 12000, max: 25000, rate: 20, deduction: 1410 },
  { min: 25000, max: 35000, rate: 25, deduction: 2660 },
  { min: 35000, max: 55000, rate: 30, deduction: 4410 },
  { min: 55000, max: 80000, rate: 35, deduction: 7160 },
  { min: 80000, max: Infinity, rate: 45, deduction: 15160 },
];

// Bonus critical points (年终奖临界点)
// At these points, earning 1 more yuan causes a tax bracket jump
const BONUS_CRITICAL_POINTS = [
  { point: 36000, tax: 1080, nextTax: 3390.1, diff: 2310.1 },
  { point: 144000, tax: 14190, nextTax: 27390.2, diff: 13200.2 },
  { point: 300000, tax: 58590, nextTax: 72340.25, diff: 13750.25 },
  { point: 420000, tax: 102340, nextTax: 121590.3, diff: 19250.3 },
  { point: 660000, tax: 193590, nextTax: 223840.35, diff: 30250.35 },
  { point: 960000, tax: 328840, nextTax: 416840.45, diff: 88000.45 },
];

// 数据元信息（Metadata）
const DATA_METADATA = {
  version: "2026.04.05",
  lastUpdate: "2026-04-05",
  dataSource: {
    taxBrackets: "国家税务总局官网 (www.chinatax.gov.cn)",
    specialDeductions: "国务院关于个人所得税专项附加扣除暂行办法",
    socialSecurity: "各地人力资源和社会保障局官网",
    fundRates: "各地住房公积金管理中心官网",
    socialBase: "各地人社局年度社保基数公告",
  },
  cityCount: 287,
  coverageProvinces: 26,
  nextScheduledUpdate: "2026-07-15", // 下一次社保年度调整预计7月
  policyEffectiveDate: "2026-01-01",
  updateLog: [
    {
      date: "2026-04-05",
      changes: "全量更新38个城市社保基数至2025年7月最新官方数据，修正上海医保额外费用",
      affectedCities: 38,
      type: "data",
    },
    {
      date: "2026-03-24",
      changes: "新增253个地级市社保配置",
      affectedCities: 253,
      type: "expansion",
    },
    {
      date: "2026-01-01",
      changes: "专项附加扣除标准保持不变",
      affectedCities: "all",
      type: "policy",
    },
    {
      date: "2025-07-01",
      changes: "上海市社保基数调整至7460-37302元",
      affectedCities: ["上海"],
      type: "data",
    },
  ],
  dataQuality: {
    tier1Cities: { accuracy: "high", verifiedDate: "2026-01-20" },
    tier2Cities: { accuracy: "medium", verifiedDate: "2026-01-15" },
    tier3Cities: { accuracy: "estimated", note: "基于省份模板" },
  },
};

// 获取城市社保配置
function getCitySocialConfig(cityName) {
  return (
    CITY_SOCIAL_CONFIG_2026[cityName] || CITY_SOCIAL_CONFIG_2026["其他城市"]
  );
}

// 获取城市列表
function getCityList() {
  return Object.keys(CITY_SOCIAL_CONFIG_2026).filter(
    (city) => city !== "其他城市",
  );
}

// 按城市等级分组
function getCitiesByLevel() {
  const result = {
    直辖市: [],
    一线: [],
    新一线: [],
    二线: [],
    其他: [],
  };

  Object.keys(CITY_SOCIAL_CONFIG_2026).forEach((cityName) => {
    const city = CITY_SOCIAL_CONFIG_2026[cityName];
    if (city.level === "直辖市") {
      result["直辖市"].push(cityName);
    } else if (city.level === "一线") {
      result["一线"].push(cityName);
    } else if (city.level === "新一线") {
      result["新一线"].push(cityName);
    } else if (city.level === "二线") {
      result["二线"].push(cityName);
    } else if (cityName !== "其他城市") {
      result["其他"].push(cityName);
    }
  });

  return result;
}

// 获取数据元信息
function getDataMetadata() {
  return DATA_METADATA;
}

// 检查数据是否需要更新
function checkDataFreshness() {
  const now = new Date();
  const lastUpdate = new Date(DATA_METADATA.lastUpdate);
  const daysSinceUpdate = Math.floor(
    (now - lastUpdate) / (1000 * 60 * 60 * 24),
  );

  // 社保基数通常每年7月1日调整
  const nextUpdate = new Date(DATA_METADATA.nextScheduledUpdate);
  const daysUntilUpdate = Math.floor(
    (nextUpdate - now) / (1000 * 60 * 60 * 24),
  );

  let status = "fresh";
  let label = "最新";
  let warning = null;

  if (daysSinceUpdate > 60 && daysSinceUpdate <= 90) {
    status = "warning";
    label = "待更新";
    warning = `数据已${daysSinceUpdate}天未更新,建议关注最新社保基数`;
  } else if (daysSinceUpdate > 90) {
    status = "outdated";
    label = "过期";
    warning = `数据已${daysSinceUpdate}天未更新,可能不是最新社保基数,请谨慎使用`;
  } else if (daysUntilUpdate >= 0 && daysUntilUpdate < 30) {
    status = "warning";
    label = "即将更新";
    warning = `距离下次社保基数调整还有${daysUntilUpdate}天(7月1日)`;
  }

  return {
    status,
    label,
    warning,
    daysSinceUpdate,
    daysUntilUpdate,
    lastUpdate: DATA_METADATA.lastUpdate,
    nextScheduledUpdate: DATA_METADATA.nextScheduledUpdate,
  };
}

module.exports = {
  TAX_CONFIG_2026,
  CITY_SOCIAL_CONFIG_2026,
  BONUS_TAX_BRACKETS,
  BONUS_CRITICAL_POINTS,
  DATA_METADATA,
  getCitySocialConfig,
  getCityList,
  getCitiesByLevel,
  getDataMetadata,
  checkDataFreshness,
};
