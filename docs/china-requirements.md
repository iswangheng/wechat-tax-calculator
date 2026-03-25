# 个税计算器 - 中国实际情况需求

**最后更新**: 2026-03-24
**重要性**: ⭐⭐⭐⭐⭐

## 一、2026年中国个税政策（必须准确）

### 1.1 个人所得税法

#### 起征点
- **月度起征点**: **5,000元/月**（60,000元/年）
- 低于5000元不征税

#### 税率表（综合所得，年度计税）
| 级数 | 全年应纳税所得额 | 税率 | 速算扣除数 |
|------|----------------|------|-----------|
| 1 | 不超过36,000元 | 3% | 0 |
| 2 | 36,000-144,000元 | 10% | 2,520 |
| 3 | 144,000-300,000元 | 20% | 16,920 |
| 4 | 300,000-420,000元 | 25% | 31,920 |
| 5 | 420,000-660,000元 | 30% | 52,920 |
| 6 | 660,000-960,000元 | 35% | 85,920 |
| 7 | 超过960,000元 | 45% | 181,920 |

**重要**：中国个税是按**年度**计算，但按**月度**预扣预缴。

### 1.2 专项附加扣除（2026年标准）

#### 子女教育
- **标准**: 1,000元/月/个子女
- **条件**: 3岁-博士毕业
- **分配**: 可父母各扣50%，或一方扣100%

#### 继续教育
- **学历教育**: 400元/月（最长48个月）
- **职业资格**: 3,600元/年（取得证书当年）

#### 大病医疗
- **标准**: 最高80,000元/年
- **条件**: 自费医疗超过15,000元部分
- **扣除**: 年度汇算时扣除

#### 住房贷款利息
- **标准**: 1,000元/月
- **条件**: 首套房贷款
- **期限**: 最长240个月（20年）
- **注意**: **与住房租金二选一**

#### 住房租金
- **直辖市/省会/计划单列市**: **1,500元/月**（如上海、北京）
- **人口超100万的城市**: 1,100元/月
- **其他城市**: 800元/月
- **注意**: **与房贷利息二选一**

#### 赡养老人
- **标准**:
  - 独生子女: **2,000元/月**
  - 非独生子女: 分摊2,000元/月（每人最高1,000元）
- **条件**: 父母年满60岁

#### 3岁以下婴幼儿照护（2022年新增）
- **标准**: 1,000元/月/个子女
- **条件**: 3岁以下婴幼儿

### 1.3 五险一金（上海标准 2026）

#### 社保缴费基数
- **上限**: 37,310元/月（2026年7月调整）
- **下限**: 7,310元/月
- **说明**: 工资超过上限，按上限缴；低于下限，按下限缴

#### 个人缴费比例
- **养老保险**: **8%**
- **医疗保险**: **2%**
- **失业保险**: **0.5%**
- **工伤保险**: 0%（公司承担）
- **生育保险**: 0%（公司承担）
- **总计**: **10.5%**

#### 公积金
- **缴费比例**: **5%-7%**（单位和个人各缴相同比例）
- **常见比例**: 7%（大部分公司）
- **缴费基数**: 同社保基数
- **上海上限**: 37,310 × 7% = 2,612元/月

#### 公司缴费比例（参考）
- 养老: 16%
- 医疗: 10%
- 失业: 0.5%
- 工伤: 0.16%-1.52%
- 生育: 1%
- 公积金: 7%
- **总计**: 约 **34.66%**

---

## 二、用户真实使用场景

### 场景1：普通上班族算工资（占80%）
**典型用户**：
- 月薪: 8,000-30,000元
- 需求: 知道到手工资多少

**示例**：
```
输入: 税前月薪 15,000元
专项扣除:
  - 子女教育: 1个孩子（1,000元）
  - 住房租金: 上海（1,500元）
  - 赡养老人: 独生子女（2,000元）
社保公积金: 开启（7%公积金）

计算:
1. 五险一金: 15,000 × 10.5% = 1,575元（社保）
                 × 7% = 1,050元（公积金）
   合计: 2,625元

2. 应纳税所得额（月度）:
   15,000 - 5,000（起征点）- 2,625（五险一金）
   - 4,500（专项扣除）= 2,875元

3. 年度应纳税所得额: 2,875 × 12 = 34,500元
   年度个税: 34,500 × 3% = 1,035元
   月均个税: 1,035 ÷ 12 = 86.25元

4. 税后到手: 15,000 - 2,625 - 86.25 = 12,288.75元
```

### 场景2：年终奖计算（占15%）
**典型用户**：
- 年终奖: 5万-50万
- 需求: 知道发多少、扣多少税

**2026年政策**：
- **单独计税**（旧政策，2023年底已结束，但可能延续）:
  - 年终奖 ÷ 12，按月度税率表计税
  - 全年只能用一次

- **并入综合所得**（现行政策）:
  - 年终奖并入年度总收入
  - 按年度税率表计税

**用户痛点**：
- 不知道哪种计税方式更省钱
- 需要自动对比两种方案

**示例**：
```
用户: 月薪1.5万，年终奖10万

方案1（单独计税，如果政策允许）:
  年终奖税: 100,000 ÷ 12 = 8,333元/月
  适用税率: 3%
  年终奖税: 100,000 × 3% = 3,000元
  到手: 97,000元

方案2（并入综合所得）:
  年度总收入: 15,000×12 + 100,000 = 280,000元
  扣除后: 假设200,000元
  年度个税: 200,000×20% - 16,920 = 23,080元
  月薪个税: （工资部分的税）
  年终奖实际税: （总税 - 工资税）
  到手: 约 95,000元

结论: 单独计税更划算（如果政策允许）
```

### 场景3：跳槽算薪资（占3%）
**典型用户**：
- 拿到 offer，对比新旧薪资
- 需求: 税前XX万，实际到手多少

**示例**：
```
旧公司: 税前15k → 到手12.3k
新公司offer: 税前20k → 到手?

快速计算: 20k - 五险一金3.5k - 个税0.5k ≈ 到手16k
涨幅: (16-12.3) / 12.3 ≈ 30%
```

### 场景4：税后反推税前（占2%）
**典型用户**：
- HR、财务人员
- 需求: 知道要发多少税前才能让员工拿到期望的税后

**示例**：
```
员工期望: 税后到手 10,000元
需要税前: ?

倒推计算（需迭代）:
  假设税前 13,000元
  → 五险一金 2,275元
  → 应纳税所得额 5,725元
  → 月个税 约 172元
  → 税后 10,553元

  继续调整...最终得出税前约 12,500元
```

---

## 三、必须实现的本地化功能

### 3.1 月度累计预扣法（重要！）

**中国个税的特殊计算方式**：
- 不是每月独立计税
- 而是按**年度累计**，按月**预扣预缴**

**公式**：
```javascript
// 本月应预扣预缴税额 =
//   (累计收入 - 累计五险一金 - 累计专项扣除 - 累计减除费用) × 税率 - 速算扣除数
//   - 累计已预扣预缴税额

function calculateMonthlyTax(monthlySalary, deductions, currentMonth) {
  const basicDeduction = 5000; // 起征点

  // 累计数据
  const cumulativeIncome = monthlySalary * currentMonth;
  const cumulativeBasic = basicDeduction * currentMonth;
  const cumulativeDeductions = deductions * currentMonth;

  // 应纳税所得额
  const taxableIncome = cumulativeIncome - cumulativeBasic - cumulativeDeductions;

  // 查税率表
  const { rate, quickDeduction } = getTaxRate(taxableIncome);

  // 本年度累计应纳税额
  const cumulativeTax = taxableIncome * rate - quickDeduction;

  // 本月应纳税额 = 累计税额 - 前几个月已缴税额
  const previousTax = calculatePreviousTax(monthlySalary, deductions, currentMonth - 1);
  const currentMonthTax = cumulativeTax - previousTax;

  return currentMonthTax;
}
```

**为什么重要**：
- 年初和年底，同样工资扣税不一样！
- 1月扣税少，12月扣税多
- 跳槽后，新公司从0开始累计，可能导致年底补税

**必须在计算器中说明**：
> "💡 温馨提示：个税按年度累计计税，所以1月的税通常比12月少。这里计算的是平均每月个税。"

### 3.2 城市差异化

#### 2026年主要城市社保公积金政策对比表

| 城市 | 社保基数上限 | 养老 | 医疗 | 失业 | 公积金比例 | 个人总计 | 住房租金扣除 |
|------|------------|------|------|------|----------|---------|------------|
| **直辖市** |
| 上海 | 37,310元 | 8% | 2% | 0.5% | 5-7% | 15.5-17.5% | 1,500元/月 |
| 北京 | 36,549元 | 8% | 2%+3元 | 0.2% | 12% | 22.2% | 1,500元/月 |
| 天津 | 23,235元 | 8% | 2% | 0.5% | 11% | 21.5% | 1,500元/月 |
| 重庆 | 22,000元 | 8% | 2% | 0.5% | 5-12% | 15.5-22.5% | 1,500元/月 |
| **省会城市** |
| 广州 | 38,082元 | 8% | 2% | 0.2% | 5-12% | 15.2-22.2% | 1,500元/月 |
| 深圳 | 36,549元 | 8% | 2% | 0.3% | 5-12% | 15.3-22.3% | 1,500元/月 |
| 杭州 | 32,883元 | 8% | 2% | 0.5% | 12% | 22.5% | 1,500元/月 |
| 成都 | 22,842元 | 8% | 2% | 0.4% | 6-12% | 16.4-22.4% | 1,500元/月 |
| 南京 | 28,800元 | 8% | 2% | 0.5% | 8-12% | 18.5-22.5% | 1,500元/月 |
| 武汉 | 23,604元 | 8% | 2% | 0.3% | 8-12% | 18.3-22.3% | 1,500元/月 |
| 郑州 | 20,599元 | 8% | 2% | 0.3% | 5-12% | 15.3-22.3% | 1,500元/月 |
| 西安 | 22,800元 | 8% | 2% | 0.5% | 5-12% | 15.5-22.5% | 1,500元/月 |
| **其他重点城市** |
| 苏州 | 28,800元 | 8% | 2% | 0.5% | 5-12% | 15.5-22.5% | 1,100元/月 |
| 青岛 | 21,855元 | 8% | 2% | 0.5% | 5-12% | 15.5-22.5% | 1,100元/月 |
| 长沙 | 22,200元 | 8% | 2% | 0.3% | 5-12% | 15.3-22.3% | 1,500元/月 |
| 宁波 | 25,200元 | 8% | 2% | 0.5% | 5-12% | 15.5-22.5% | 1,100元/月 |

#### 完整城市配置（代码实现）

```javascript
const CITY_CONFIG_2026 = {
  // === 直辖市 ===
  '上海': {
    level: '直辖市',
    socialBase: {
      max: 37310,        // 社保缴费基数上限
      min: 7310          // 社保缴费基数下限
    },
    socialRate: {
      pension: 0.08,     // 养老保险 8%
      medical: 0.02,     // 医疗保险 2%
      unemployment: 0.005 // 失业保险 0.5%
    },
    fundRate: {
      min: 5,            // 公积金最低比例 5%
      max: 7,            // 公积金最高比例 7%
      common: 7          // 常见比例 7%
    },
    rentDeduction: 1500, // 住房租金专项扣除
    specialNote: '上海社保基数每年7月调整'
  },

  '北京': {
    level: '直辖市',
    socialBase: {
      max: 36549,
      min: 6821
    },
    socialRate: {
      pension: 0.08,
      medical: 0.02,      // 医疗保险 2% + 3元大病统筹
      medicalExtra: 3,    // 每月固定3元
      unemployment: 0.002 // 失业保险 0.2%
    },
    fundRate: {
      min: 5,
      max: 12,
      common: 12          // 北京公积金常见12%
    },
    rentDeduction: 1500,
    specialNote: '北京医疗保险每月额外扣3元大病统筹'
  },

  '天津': {
    level: '直辖市',
    socialBase: { max: 23235, min: 4647 },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005
    },
    fundRate: { min: 5, max: 12, common: 11 },
    rentDeduction: 1500,
    specialNote: ''
  },

  '重庆': {
    level: '直辖市',
    socialBase: { max: 22000, min: 4400 },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005
    },
    fundRate: { min: 5, max: 12, common: 12 },
    rentDeduction: 1500,
    specialNote: ''
  },

  // === 省会城市 ===
  '广州': {
    level: '省会',
    socialBase: { max: 38082, min: 2300 },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.002
    },
    fundRate: { min: 5, max: 12, common: 5 },
    rentDeduction: 1500,
    specialNote: '广州公积金常见比例较低，多为5%'
  },

  '深圳': {
    level: '计划单列市',
    socialBase: { max: 36549, min: 2360 },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003  // 深圳失业保险 0.3%
    },
    fundRate: { min: 5, max: 12, common: 5 },
    rentDeduction: 1500,
    specialNote: '深圳户籍和非户籍医疗保险比例不同'
  },

  '杭州': {
    level: '省会',
    socialBase: { max: 32883, min: 4053 },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005
    },
    fundRate: { min: 5, max: 12, common: 12 },
    rentDeduction: 1500,
    specialNote: '杭州公积金缴存比例较高'
  },

  '成都': {
    level: '省会',
    socialBase: { max: 22842, min: 4568 },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.004
    },
    fundRate: { min: 6, max: 12, common: 12 },
    rentDeduction: 1500,
    specialNote: ''
  },

  '南京': {
    level: '省会',
    socialBase: { max: 28800, min: 2490 },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005
    },
    fundRate: { min: 8, max: 12, common: 12 },
    rentDeduction: 1500,
    specialNote: '南京公积金最低比例8%'
  },

  '武汉': {
    level: '省会',
    socialBase: { max: 23604, min: 4134 },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003
    },
    fundRate: { min: 8, max: 12, common: 12 },
    rentDeduction: 1500,
    specialNote: ''
  },

  '郑州': {
    level: '省会',
    socialBase: { max: 20599, min: 3660 },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003
    },
    fundRate: { min: 5, max: 12, common: 10 },
    rentDeduction: 1500,
    specialNote: ''
  },

  '西安': {
    level: '省会',
    socialBase: { max: 22800, min: 4560 },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005
    },
    fundRate: { min: 5, max: 12, common: 12 },
    rentDeduction: 1500,
    specialNote: ''
  },

  '长沙': {
    level: '省会',
    socialBase: { max: 22200, min: 3465 },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003
    },
    fundRate: { min: 5, max: 12, common: 12 },
    rentDeduction: 1500,
    specialNote: ''
  },

  // === 其他重点城市 ===
  '苏州': {
    level: '地级市',
    socialBase: { max: 28800, min: 2490 },
    socialRate: { pension: 0.08, medical: 0.02, unemployment: 0.005 },
    fundRate: { min: 5, max: 12, common: 10 },
    rentDeduction: 1100,  // 非省会，但人口>100万
    specialNote: '苏州执行江苏省标准'
  },

  '青岛': {
    level: '计划单列市',
    socialBase: { max: 21855, min: 4371 },
    socialRate: { pension: 0.08, medical: 0.02, unemployment: 0.005 },
    fundRate: { min: 5, max: 12, common: 10 },
    rentDeduction: 1100,
    specialNote: ''
  },

  '宁波': {
    level: '计划单列市',
    socialBase: { max: 25200, min: 3957 },
    socialRate: { pension: 0.08, medical: 0.02, unemployment: 0.005 },
    fundRate: { min: 5, max: 12, common: 12 },
    rentDeduction: 1100,
    specialNote: ''
  },

  // === 默认配置（其他城市） ===
  'default': {
    level: '其他',
    socialBase: { max: 20000, min: 3500 },
    socialRate: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005
    },
    fundRate: { min: 5, max: 12, common: 8 },
    rentDeduction: 800,  // 其他城市默认800元
    specialNote: '执行当地标准'
  }
};

// 获取城市配置
function getCityConfig(cityName) {
  return CITY_CONFIG_2026[cityName] || CITY_CONFIG_2026['default'];
}

// 计算五险一金（根据城市）
function calculateSocialSecurity(salary, cityName, fundRatio) {
  const config = getCityConfig(cityName);

  // 社保缴费基数（有上下限）
  const socialBase = Math.max(
    config.socialBase.min,
    Math.min(salary, config.socialBase.max)
  );

  // 计算各项保险
  const pension = socialBase * config.socialRate.pension;
  const medical = socialBase * config.socialRate.medical +
                  (config.socialRate.medicalExtra || 0);
  const unemployment = socialBase * config.socialRate.unemployment;

  // 公积金缴费基数（同社保基数）
  const fundBase = socialBase;
  const fund = fundBase * (fundRatio / 100);

  return {
    socialBase: socialBase,
    pension: pension,
    medical: medical,
    unemployment: unemployment,
    totalSocial: pension + medical + unemployment,
    fund: fund,
    total: pension + medical + unemployment + fund
  };
}
```

#### 城市选择界面设计

```javascript
// 城市分组（按重要性）
const CITY_GROUPS = [
  {
    title: '直辖市',
    cities: ['上海', '北京', '天津', '重庆']
  },
  {
    title: '省会 & 计划单列市',
    cities: ['广州', '深圳', '杭州', '成都', '南京', '武汉', '郑州', '西安', '长沙']
  },
  {
    title: '其他重点城市',
    cities: ['苏州', '青岛', '宁波', '东莞', '佛山']
  },
  {
    title: '其他城市',
    cities: ['其他']
  }
];

// 用户选择城市后的提示
function showCityInfo(cityName) {
  const config = getCityConfig(cityName);

  return `
    📍 ${cityName} 社保公积金政策:

    💰 社保缴费基数:
       上限: ${config.socialBase.max.toLocaleString()}元/月
       下限: ${config.socialBase.min.toLocaleString()}元/月

    📊 个人缴费比例:
       养老保险: ${config.socialRate.pension * 100}%
       医疗保险: ${config.socialRate.medical * 100}%${config.socialRate.medicalExtra ? '+' + config.socialRate.medicalExtra + '元' : ''}
       失业保险: ${config.socialRate.unemployment * 100}%
       公积金: ${config.fundRate.min}-${config.fundRate.max}% (常见${config.fundRate.common}%)

    🏠 住房租金扣除: ${config.rentDeduction}元/月

    ${config.specialNote ? '💡 特别说明: ' + config.specialNote : ''}
  `;
}
```

#### 重要差异提醒

**必须在计算结果页提示用户**：
```javascript
// 示例：北京用户
⚠️ 北京特别提示:
您的医疗保险每月额外扣除 3元 大病统筹，这是正常的！

// 示例：深圳用户
⚠️ 深圳特别提示:
深圳户籍和非户籍医疗保险比例不同，本计算器按统一标准计算。

// 示例：上海用户
💡 上海提示:
社保缴费基数每年7月调整，请留意最新标准。
```

**必须实现城市选择功能，这直接影响计算准确性！**

### 3.3 年终奖优化（智能推荐）

**临界点效应**（非常重要！）：
```
年终奖 36,000元：税 1,080元（36000×3%）
年终奖 36,001元：税 3,590元（36001×10%-2520）

多发 1元，多扣 2,510元税！
```

**六大临界点**（2026年）：
- 36,000元（税率从3%跳到10%）
- 144,000元（10%跳到20%）
- 300,000元（20%跳到25%）
- 420,000元（25%跳到30%）
- 660,000元（30%跳到35%）
- 960,000元（35%跳到45%）

**必须在年终奖计算时提示**：
> "⚠️ 您的年终奖刚好超过临界点 36,000元，建议老板发 36,000元年终奖 + 1元工资，可节税 2,510元！"

---

## 四、必须避免的错误

### ❌ 错误1: 用国外个税模式
- ❌ 不是按月独立计税（美国模式）
- ✅ 必须用累计预扣法（中国特有）

### ❌ 错误2: 忽略专项扣除
- ❌ 只算起征点5000元
- ✅ 必须加上子女教育、房租、赡养老人等

### ❌ 错误3: 五险一金比例错误
- ❌ 用全国统一标准
- ✅ 必须区分城市（上海、北京、深圳不同）

### ❌ 错误4: 年终奖计算错误
- ❌ 简单按月度税率计算
- ✅ 必须对比单独计税和并入综合所得两种方案

### ❌ 错误5: 缴费基数不准确
- ❌ 直接用工资作为社保基数
- ✅ 必须考虑上限（上海37,310元）和下限（7,310元）

---

## 五、计算公式（必须精确）

### 5.1 月度个税计算（完整版）

```javascript
/**
 * Calculate monthly income tax (China 2026)
 * @param {number} monthlySalary - 税前月薪
 * @param {Object} deductions - 专项附加扣除
 * @param {string} city - 城市
 * @param {number} fundRatio - 公积金比例（5-12%）
 * @param {number} currentMonth - 当前月份（1-12）
 * @returns {Object} 计算结果
 */
function calculateIncomeTax(monthlySalary, deductions, city, fundRatio, currentMonth) {
  // 1. 计算五险一金
  const socialBase = Math.min(monthlySalary, CITY_CONFIG[city].socialMax);
  const socialRate = CITY_CONFIG[city].socialRate; // 养老8% + 医疗2% + 失业0.5%
  const fundRate = fundRatio / 100;

  const socialSecurity = socialBase * socialRate;
  const housingFund = socialBase * fundRate;
  const totalInsurance = socialSecurity + housingFund;

  // 2. 计算专项附加扣除总额
  const specialDeduction =
    (deductions.childEducation || 0) +
    (deductions.continuingEducation || 0) +
    (deductions.housingLoanInterest || deductions.housingRent || 0) + // 二选一
    (deductions.elderCare || 0) +
    (deductions.infantCare || 0);

  // 3. 累计计算（关键！）
  const basicDeduction = 5000; // 起征点
  const cumulativeIncome = monthlySalary * currentMonth;
  const cumulativeBasic = basicDeduction * currentMonth;
  const cumulativeInsurance = totalInsurance * currentMonth;
  const cumulativeSpecial = specialDeduction * currentMonth;

  // 4. 应纳税所得额
  const taxableIncome =
    cumulativeIncome -
    cumulativeBasic -
    cumulativeInsurance -
    cumulativeSpecial;

  // 5. 查税率表
  const { rate, quickDeduction } = getAnnualTaxRate(taxableIncome);

  // 6. 累计应纳税额
  const cumulativeTax = taxableIncome * rate - quickDeduction;

  // 7. 本月应纳税额
  const previousTax = (currentMonth > 1) ?
    calculatePreviousTax(..., currentMonth - 1) : 0;
  const currentMonthTax = Math.max(0, cumulativeTax - previousTax);

  // 8. 税后工资
  const netSalary = monthlySalary - totalInsurance - currentMonthTax;

  return {
    grossSalary: monthlySalary,
    socialSecurity: socialSecurity,
    housingFund: housingFund,
    specialDeduction: specialDeduction,
    taxableIncome: taxableIncome / currentMonth, // 月均应纳税所得额
    tax: currentMonthTax,
    netSalary: netSalary,
    annualEstimate: {
      grossIncome: monthlySalary * 12,
      totalTax: cumulativeTax,
      netIncome: netSalary * 12
    }
  };
}

// 年度税率表
function getAnnualTaxRate(annualTaxableIncome) {
  if (annualTaxableIncome <= 36000) {
    return { rate: 0.03, quickDeduction: 0 };
  } else if (annualTaxableIncome <= 144000) {
    return { rate: 0.10, quickDeduction: 2520 };
  } else if (annualTaxableIncome <= 300000) {
    return { rate: 0.20, quickDeduction: 16920 };
  } else if (annualTaxableIncome <= 420000) {
    return { rate: 0.25, quickDeduction: 31920 };
  } else if (annualTaxableIncome <= 660000) {
    return { rate: 0.30, quickDeduction: 52920 };
  } else if (annualTaxableIncome <= 960000) {
    return { rate: 0.35, quickDeduction: 85920 };
  } else {
    return { rate: 0.45, quickDeduction: 181920 };
  }
}
```

### 5.2 年终奖计算（两种方案对比）

```javascript
/**
 * Calculate annual bonus tax (China 2026)
 * 对比单独计税 vs 并入综合所得
 */
function calculateBonusTax(monthlySalary, bonus, deductions) {
  // 方案1: 单独计税（如果政策允许）
  const separateTax = calculateSeparateBonus(bonus);

  // 方案2: 并入综合所得
  const mergedTax = calculateMergedBonus(monthlySalary, bonus, deductions);

  // 对比
  const recommendation = separateTax.netBonus > mergedTax.netBonus ?
    'separate' : 'merged';

  return {
    separate: separateTax,
    merged: mergedTax,
    recommendation: recommendation,
    difference: Math.abs(separateTax.netBonus - mergedTax.netBonus)
  };
}

// 单独计税
function calculateSeparateBonus(bonus) {
  const monthlyBonus = bonus / 12;
  const { rate, quickDeduction } = getMonthlyTaxRate(monthlyBonus);
  const tax = bonus * rate - quickDeduction;

  return {
    tax: tax,
    netBonus: bonus - tax,
    rate: rate * 100 + '%'
  };
}

// 并入综合所得
function calculateMergedBonus(monthlySalary, bonus, deductions) {
  const annualSalary = monthlySalary * 12;
  const totalIncome = annualSalary + bonus;

  // 按年度计算总税额
  const totalTax = calculateAnnualTax(totalIncome, deductions);

  // 扣除工资部分的税
  const salaryTax = calculateAnnualTax(annualSalary, deductions);

  // 年终奖实际税额
  const bonusTax = totalTax - salaryTax;

  return {
    tax: bonusTax,
    netBonus: bonus - bonusTax,
    rate: (bonusTax / bonus * 100).toFixed(2) + '%'
  };
}
```

### 5.3 税后反推税前

```javascript
/**
 * Reverse calculate gross salary from net salary
 * 从税后工资反推税前工资
 */
function reverseCalculate(netSalary, deductions, city, fundRatio) {
  // 使用二分法迭代
  let low = netSalary;
  let high = netSalary * 2;
  let grossSalary = (low + high) / 2;

  let iterations = 0;
  const maxIterations = 100;
  const tolerance = 1; // 误差容忍度 1元

  while (iterations < maxIterations) {
    const result = calculateIncomeTax(grossSalary, deductions, city, fundRatio, 12);
    const diff = result.netSalary - netSalary;

    if (Math.abs(diff) < tolerance) {
      return {
        grossSalary: Math.round(grossSalary),
        ...result
      };
    }

    if (diff > 0) {
      high = grossSalary;
    } else {
      low = grossSalary;
    }

    grossSalary = (low + high) / 2;
    iterations++;
  }

  return null; // 未找到解
}
```

---

## 六、测试用例（必须通过）

### 用例1: 普通上班族
```javascript
输入:
{
  monthlySalary: 15000,
  deductions: {
    childEducation: 1000,     // 1个孩子
    housingRent: 1500,        // 上海租房
    elderCare: 2000           // 独生子女
  },
  city: '上海',
  fundRatio: 7,
  currentMonth: 12
}

预期输出:
{
  grossSalary: 15000,
  socialSecurity: 1575,       // 15000 × 10.5%
  housingFund: 1050,          // 15000 × 7%
  specialDeduction: 4500,     // 1000+1500+2000
  tax: 86.25,                 // 年度34500 × 3% ÷ 12
  netSalary: 12288.75,        // 15000-1575-1050-86.25
  annualEstimate: {
    grossIncome: 180000,
    totalTax: 1035,
    netIncome: 147465
  }
}
```

### 用例2: 高收入人群
```javascript
输入:
{
  monthlySalary: 50000,
  deductions: {
    housingLoanInterest: 1000,
    elderCare: 2000
  },
  city: '上海',
  fundRatio: 7,
  currentMonth: 12
}

预期输出:
{
  grossSalary: 50000,
  socialSecurity: 3918,       // 社保基数上限37310 × 10.5%
  housingFund: 2612,          // 37310 × 7%
  specialDeduction: 3000,
  tax: 约6500元/月,
  netSalary: 约37000元/月
}
```

### 用例3: 年终奖
```javascript
输入:
{
  monthlySalary: 15000,
  bonus: 100000
}

预期输出:
方案1（单独计税）:
  年终奖税: 100000×10% - 2520 = 7480元
  到手: 92520元

方案2（并入综合所得）:
  年度总收入: 280000元
  总税: 约10000元（假设有专项扣除）
  年终奖实际税: 约8000元
  到手: 92000元

推荐: 方案1（单独计税）
节税: 520元
```

---

## 七、用户体验要求

### 7.1 友好的提示语

**✅ 正确示例**:
```
💰 您的税后到手: 12,289元
   比税前少了 2,711元

   扣除明细:
   - 五险一金: 2,625元（为未来投资💰）
   - 个人所得税: 86元（贡献国家建设🏛️）

   💡 小贴士: 您的月供安全线是 3,687元（税后30%）
```

**❌ 错误示例**（太专业）:
```
应纳税所得额: 2875元
适用税率: 3%
速算扣除数: 0
应纳税额: 86.25元
```

### 7.2 必须回答的常见问题

在计算器底部提供 FAQ:

1. **五险一金是什么？扣了有什么用？**
   - 养老保险: 退休后领养老金
   - 医疗保险: 看病报销
   - 失业保险: 失业了有补助
   - 公积金: 买房贷款利率低，可提取

2. **为什么1月税少，12月税多？**
   - 个税按年度累计计算
   - 1月只累计1个月收入，税率低
   - 12月累计全年收入，税率可能跳档

3. **专项扣除怎么申报？**
   - 下载"个人所得税"APP
   - 填写专项附加扣除信息
   - 公司会自动扣除

4. **年终奖怎么扣税最划算？**
   - 用我们的年终奖计算器
   - 对比单独计税和并入综合所得
   - 避开临界点（36000、144000等）

---

## 八、上线前检查清单

### 计算准确性
- [ ] 累计预扣法正确实现
- [ ] 税率表准确（2026年标准）
- [ ] 五险一金比例正确（各城市）
- [ ] 专项附加扣除标准正确
- [ ] 年终奖两种方案对比准确
- [ ] 浮点数精度处理

### 政策合规性
- [ ] 起征点5000元
- [ ] 专项扣除标准正确（子女1000、房租1500等）
- [ ] 社保缴费基数上下限正确
- [ ] 公积金比例范围正确（5-12%）

### 用户体验
- [ ] 所有专业术语有通俗解释
- [ ] 计算结果清晰易懂
- [ ] 常见问题有解答
- [ ] 错误提示友好
- [ ] 年终奖临界点提醒

### 本地化
- [ ] 支持上海、北京、深圳等主要城市
- [ ] 住房租金扣除按城市区分
- [ ] 语言表达符合中国习惯

---

**这份文档是开发的金标准，必须严格遵守！**
