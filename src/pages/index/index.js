// 个税计算器主页面
const { getCitySocialConfig, getDataMetadata, checkDataFreshness } = require('../../config/cities-tax-2026');
const {
  calculateSocialSecurity,
  calculateMonthlyTax
} = require('../../utils/tax-calculator');
const { saveHistory } = require('../../utils/history-manager');

Page({
  data: {
    // 数据更新信息
    dataUpdateTime: '',
    dataFreshness: { status: 'fresh', label: '最新' },

    // 城市信息
    cityName: '上海',
    cityLevel: '一线',
    cityInfo: null,

    // 工资信息
    grossSalary: '',        // 税前工资

    // 五险一金
    fundRatio: 6,           // 公积金比例
    socialSecurity: null,   // 社保公积金明细

    // 专项附加扣除
    specialDeductions: 0,   // 专项附加扣除总额
    deductionItems: [],     // 扣除项目明细

    // 计算月份
    monthOptions: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    monthIndex: 0,          // 当前月份索引

    // 计算结果
    result: null
  },

  // Debounce timer
  salaryInputTimer: null,

  onLoad() {
    this.loadDataMetadata();
    this.loadCityConfig();
  },

  // 加载数据元信息
  loadDataMetadata() {
    const metadata = getDataMetadata();
    const freshness = checkDataFreshness();

    this.setData({
      dataUpdateTime: metadata.lastUpdate,
      dataFreshness: freshness
    });

    // 如果数据过时，显示提醒
    if (freshness.status === 'outdated') {
      wx.showModal({
        title: '数据提示',
        content: freshness.warning,
        showCancel: false
      });
    }
  },

  // 显示数据来源
  onShowDataSource() {
    const metadata = getDataMetadata();

    let content = '📊 数据来源\n\n';
    content += `• 税率表: ${metadata.dataSource.taxBrackets}\n`;
    content += `• 社保数据: ${metadata.dataSource.socialSecurity}\n`;
    content += `• 公积金数据: ${metadata.dataSource.fundData}\n`;
    content += `• 专项扣除: ${metadata.dataSource.deductions}\n\n`;
    content += `📅 数据版本: ${metadata.version}\n`;
    content += `📅 最后更新: ${metadata.lastUpdate}\n`;
    content += `📅 下次更新: ${metadata.nextScheduledUpdate}\n\n`;
    content += `📈 覆盖范围:\n`;
    content += `   ${metadata.cityCount}个城市 / ${metadata.coverageProvinces}个省份\n\n`;
    content += `⚠️ 数据质量说明:\n`;
    content += `   • 一线/新一线: 高精度官方数据\n`;
    content += `   • 二线城市: 中等精度\n`;
    content += `   • 三四线城市: 基于省份模板`;

    wx.showModal({
      title: '数据来源',
      content: content,
      showCancel: false,
      confirmText: '我知道了'
    });
  },

  // 加载城市配置
  loadCityConfig() {
    const cityConfig = getCitySocialConfig(this.data.cityName);

    this.setData({
      cityLevel: cityConfig.level,
      cityInfo: {
        socialBase: cityConfig.socialBase,
        totalRate: (cityConfig.totalRate * 100).toFixed(1)
      }
    });
  },

  // 城市选择
  onCitySelect() {
    wx.navigateTo({
      url: '/pages/city-select/city-select'
    });
  },

  // 税前工资输入 (with debounce)
  onGrossSalaryInput(e) {
    const grossSalary = parseFloat(e.detail.value) || 0;
    this.setData({ grossSalary: e.detail.value, result: null });

    // Clear existing timer
    if (this.salaryInputTimer) {
      clearTimeout(this.salaryInputTimer);
    }

    // Debounce: delay calculation for 300ms
    this.salaryInputTimer = setTimeout(() => {
      // 实时计算社保公积金
      if (grossSalary > 0) {
        this.calculateSocial(grossSalary);
      }
    }, 300);
  },

  // 公积金比例改变
  onFundRatioChange(e) {
    const fundRatio = e.detail.value;
    this.setData({ fundRatio, result: null });

    // 重新计算社保公积金
    if (this.data.grossSalary) {
      this.calculateSocial(parseFloat(this.data.grossSalary));
    }
  },

  // 计算社保公积金
  calculateSocial(grossSalary) {
    const cityConfig = getCitySocialConfig(this.data.cityName);
    const socialSecurity = calculateSocialSecurity(
      grossSalary,
      cityConfig.socialBase,
      cityConfig.socialRate,
      this.data.fundRatio
    );

    this.setData({ socialSecurity });
  },

  // 显示社保说明
  onShowSocialInfo() {
    wx.showModal({
      title: '五险一金说明',
      content: '养老保险：个人8%，退休后领养老金\n医疗保险：个人2%，看病报销\n失业保险：个人0.2-0.5%\n公积金：个人5-12%，买房贷款用\n\n💡 这些钱不是白扣，都是为你的未来！',
      showCancel: false
    });
  },

  // 显示专项扣除说明
  onShowDeductionInfo() {
    wx.showModal({
      title: '专项附加扣除',
      content: '可以减免个税的项目：\n\n• 子女教育：1000元/月/人\n• 婴幼儿照护（3岁以下）：1000元/月/人\n• 住房贷款利息：1000元/月\n• 住房租金：800-1500元/月\n• 赡养老人（60岁以上）：独生子女2000元/月\n\n💡 越多扣除项目，交税越少！',
      showCancel: false
    });
  },

  // 编辑专项扣除
  onEditDeductions() {
    // 将当前数据传递到编辑页面
    const app = getApp();
    app.globalData = app.globalData || {};
    app.globalData.deductionItems = this.data.deductionItems;

    wx.navigateTo({
      url: '/pages/deductions/deductions'
    });
  },

  // 显示月份说明
  onShowMonthInfo() {
    wx.showModal({
      title: '累计预扣法说明',
      content: '中国个税采用"累计预扣法"：\n\n• 1月：税少（刚开始累计）\n• 12月：税多（累计全年）\n\n这是正常现象！全年总税额是一样的。',
      showCancel: false
    });
  },

  // 月份选择
  onMonthChange(e) {
    this.setData({
      monthIndex: parseInt(e.detail.value),
      result: null
    });
  },

  // 开始计算
  onCalculate() {
    const { grossSalary, socialSecurity, specialDeductions, monthIndex } = this.data;

    // Constants for validation
    const MAX_SALARY = 1000000; // 最高工资：100万元
    const MIN_SALARY = 1; // 最低工资：1元

    if (!grossSalary || grossSalary <= 0) {
      wx.showToast({ title: '请输入税前工资', icon: 'none' });
      return;
    }

    // Validate salary range
    const salaryValue = parseFloat(grossSalary);
    if (salaryValue < MIN_SALARY || salaryValue > MAX_SALARY) {
      wx.showToast({
        title: `工资必须在${MIN_SALARY}-${MAX_SALARY}元之间`,
        icon: 'none',
        duration: 2000
      });
      return;
    }

    if (!socialSecurity) {
      wx.showToast({ title: '正在计算社保...', icon: 'loading' });
      this.calculateSocial(parseFloat(grossSalary));
      setTimeout(() => this.onCalculate(), 500);
      return;
    }

    try {
      const result = calculateMonthlyTax({
        grossSalary: parseFloat(grossSalary),
        socialSecurity,
        specialDeductions,
        month: monthIndex + 1
      });

      // Pre-calculate total deduction for display (avoid expression in wxml)
      result.totalDeduction = (result.grossSalary - result.netSalary).toFixed(2);

      this.setData({ result });

      // Save monthly salary for annual settlement quick fill
      wx.setStorageSync('last_monthly_salary', parseFloat(grossSalary));

      // Save to history
      saveHistory({
        type: 'salary',
        city: this.data.cityName,
        inputData: {
          salary: parseFloat(grossSalary),
          city: this.data.cityName,
          fundRatio: this.data.fundRatio,
          specialDeductions: specialDeductions,
          deductionItems: this.data.deductionItems,
          month: monthIndex + 1
        },
        result: result
      });

      wx.showToast({ title: '计算成功', icon: 'success' });

    } catch (error) {
      console.error('计算错误:', error);

      // Improved error messages based on error type
      let errorMessage = '计算失败，请检查输入';

      if (error.message) {
        if (error.message.includes('工资') || error.message.includes('收入')) {
          errorMessage = '工资输入有误，请检查数值';
        } else if (error.message.includes('社保') || error.message.includes('公积金')) {
          errorMessage = '社保公积金计算错误，请重试';
        } else if (error.message.includes('扣除')) {
          errorMessage = '专项扣除数据有误';
        } else if (error.message.includes('月份')) {
          errorMessage = '月份选择有误';
        } else if (error.message.includes('Infinity') || error.message.includes('NaN')) {
          errorMessage = '输入数据异常，请检查工资金额';
        } else {
          errorMessage = error.message;
        }
      }

      wx.showToast({
        title: errorMessage,
        icon: 'none',
        duration: 2500
      });
    }
  },

  // 重置
  onReset() {
    this.setData({
      grossSalary: '',
      socialSecurity: null,
      specialDeductions: 0,
      deductionItems: [],
      monthIndex: 0,
      result: null
    });
  },

  // 查看全年12个月明细
  onView12Months() {
    const { grossSalary, socialSecurity, specialDeductions } = this.data;

    if (!grossSalary || !socialSecurity) {
      return;
    }

    // 存储数据到全局
    const app = getApp();
    app.globalData = app.globalData || {};
    app.globalData.taxCalculation = {
      grossSalary: parseFloat(grossSalary),
      socialSecurity,
      specialDeductions,
      cityName: this.data.cityName
    };

    wx.navigateTo({
      url: '/pages/result/result'
    });
  },

  // Navigate to history page
  onGoToHistory() {
    wx.navigateTo({
      url: '/pages/history/history'
    });
  },

  // Navigate to compare page
  onGoToCompare() {
    wx.navigateTo({
      url: '/pages/compare/compare'
    });
  },

  // Navigate to annual settlement page
  onGoToAnnual() {
    wx.navigateTo({
      url: '/pages/annual/annual'
    });
  },

  onShow() {
    // Restore from history record if available
    const app = getApp();
    if (app.globalData && app.globalData.restoreFromHistory) {
      const record = app.globalData.restoreFromHistory;
      delete app.globalData.restoreFromHistory;

      if (record.type === 'salary' && record.inputData) {
        const input = record.inputData;

        // Update city first
        if (input.city && input.city !== this.data.cityName) {
          this.setData({ cityName: input.city });
          this.loadCityConfig();
        }

        // Restore all input fields
        this.setData({
          grossSalary: input.salary.toString(),
          fundRatio: input.fundRatio || 6,
          specialDeductions: input.specialDeductions || 0,
          deductionItems: input.deductionItems || [],
          monthIndex: (input.month || 1) - 1,
          result: null,
          socialSecurity: null
        });

        // Recalculate social security
        if (input.salary > 0) {
          this.calculateSocial(input.salary);
        }

        wx.showToast({ title: '已恢复参数', icon: 'success' });
        return;
      }
    }

    // 从专项扣除页面返回时更新数据
    if (app.globalData && app.globalData.deductionItems) {
      const deductionItems = app.globalData.deductionItems;
      const specialDeductions = deductionItems.reduce((sum, item) => sum + item.amount, 0);

      this.setData({
        deductionItems,
        specialDeductions,
        result: null
      });
    }

    // 从城市选择页面返回时更新城市
    if (app.globalData && app.globalData.selectedCity) {
      const cityName = app.globalData.selectedCity;
      if (cityName !== this.data.cityName) {
        this.setData({
          cityName,
          result: null,
          socialSecurity: null
        });
        this.loadCityConfig();

        // 重新计算社保
        if (this.data.grossSalary) {
          this.calculateSocial(parseFloat(this.data.grossSalary));
        }
      }
    }
  }
});
