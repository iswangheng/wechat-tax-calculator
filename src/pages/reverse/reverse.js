// Reverse calculation page: calculate gross salary from desired net salary
const { getCitySocialConfig } = require("../../config/cities-tax-2026");
const {
  calculateSocialSecurity,
  calculateGrossFromNet,
} = require("../../utils/tax-calculator");

Page({
  data: {
    // City info
    cityName: "上海",
    cityLevel: "一线",
    cityInfo: null,

    // Input
    netSalary: "", // desired net salary

    // Social insurance
    fundRatio: 6, // housing fund ratio
    socialSecurity: null, // social security breakdown

    // Special deductions
    specialDeductions: 0,
    deductionItems: [],

    // Month selector (different months have different tax due to cumulative withholding)
    monthOptions: [
      "1月",
      "2月",
      "3月",
      "4月",
      "5月",
      "6月",
      "7月",
      "8月",
      "9月",
      "10月",
      "11月",
      "12月",
    ],
    monthIndex: 0,

    // Result
    result: null,
  },

  onLoad() {
    this.loadCityConfig();
  },

  onShow() {
    const app = getApp();

    // Update city if changed from city-select page
    if (app.globalData && app.globalData.selectedCity) {
      const cityName = app.globalData.selectedCity;
      if (cityName !== this.data.cityName) {
        this.setData({
          cityName,
          result: null,
          socialSecurity: null,
        });
        this.loadCityConfig();
      }
    }

    // Update deductions if changed
    if (app.globalData && app.globalData.deductionItems) {
      const deductionItems = app.globalData.deductionItems;
      const specialDeductions = deductionItems.reduce(
        (sum, item) => sum + item.amount,
        0,
      );

      this.setData({
        deductionItems,
        specialDeductions,
        result: null,
      });
    }
  },

  // Load city social security config
  loadCityConfig() {
    const cityConfig = getCitySocialConfig(this.data.cityName);

    this.setData({
      cityLevel: cityConfig.level,
      cityInfo: {
        socialBase: cityConfig.socialBase,
        totalRate: (cityConfig.totalRate * 100).toFixed(1),
      },
    });
  },

  // Navigate to city select page
  onCitySelect() {
    wx.navigateTo({
      url: "/pages/city-select/city-select",
    });
  },

  // Net salary input
  onNetSalaryInput(e) {
    this.setData({
      netSalary: e.detail.value,
      result: null,
    });
  },

  // Housing fund ratio change
  onFundRatioChange(e) {
    const fundRatio = e.detail.value;
    this.setData({ fundRatio, result: null });
  },

  // Month change
  onMonthChange(e) {
    this.setData({ monthIndex: parseInt(e.detail.value), result: null });
  },

  // Edit special deductions
  onEditDeductions() {
    const app = getApp();
    app.globalData = app.globalData || {};
    app.globalData.deductionItems = this.data.deductionItems;

    wx.navigateTo({
      url: "/pages/deductions/deductions",
    });
  },

  // Start reverse calculation
  onCalculate() {
    const { netSalary, cityName, fundRatio, specialDeductions, monthIndex } =
      this.data;
    const month = monthIndex + 1;

    const MAX_SALARY = 1000000;
    const MIN_SALARY = 1;

    if (!netSalary || parseFloat(netSalary) <= 0) {
      wx.showToast({ title: "请输入期望税后工资", icon: "none" });
      return;
    }

    const salaryValue = parseFloat(netSalary);
    if (salaryValue < MIN_SALARY || salaryValue > MAX_SALARY) {
      wx.showToast({
        title: `金额必须在${MIN_SALARY}-${MAX_SALARY}元之间`,
        icon: "none",
        duration: 2000,
      });
      return;
    }

    try {
      // Calculate social security based on an estimated gross salary
      const cityConfig = getCitySocialConfig(cityName);
      const estimatedGross = salaryValue * 1.3; // rough estimate for social security calc
      const socialSecurity = calculateSocialSecurity(
        estimatedGross,
        cityConfig.socialBase,
        cityConfig.socialRate,
        fundRatio,
      );

      // Reverse calculate gross from net
      const result = calculateGrossFromNet({
        netSalary: salaryValue,
        socialSecurity,
        specialDeductions,
        month,
      });

      // Recalculate social security with actual gross salary
      const actualSocial = calculateSocialSecurity(
        result.grossSalary,
        cityConfig.socialBase,
        cityConfig.socialRate,
        fundRatio,
      );

      // Run reverse calculation again with corrected social security
      const finalResult = calculateGrossFromNet({
        netSalary: salaryValue,
        socialSecurity: actualSocial,
        specialDeductions,
        month,
      });

      this.setData({
        socialSecurity: actualSocial,
        result: finalResult,
      });

      // Analytics: track reverse calculation
      try {
        wx.reportAnalytics("calculate", { type: "reverse" });
      } catch (e) {
        /* ignore analytics error */
      }

      wx.showToast({ title: "计算成功", icon: "success" });
    } catch (error) {
      console.error("Reverse calculation error:", error);
      wx.showToast({ title: "计算失败，请检查输入", icon: "none" });
    }
  },

  // Reset all inputs
  onReset() {
    this.setData({
      netSalary: "",
      socialSecurity: null,
      specialDeductions: 0,
      deductionItems: [],
      result: null,
    });
  },
});
