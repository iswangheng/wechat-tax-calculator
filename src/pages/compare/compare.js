// Multi-plan comparison page
const {
  getCitySocialConfig,
  getCityList,
} = require("../../config/cities-tax-2026");
const {
  calculateSocialSecurity,
  calculateMonthlyTax,
  calculateBonusTax,
  calculate12MonthsTax,
} = require("../../utils/tax-calculator");

// Cost of living index (relative to national average = 1.0)
const CITY_COST_INDEX = {
  北京: 1.45,
  上海: 1.4,
  深圳: 1.38,
  广州: 1.2,
  杭州: 1.18,
  南京: 1.12,
  苏州: 1.1,
  成都: 1.0,
  武汉: 0.98,
  重庆: 0.95,
  长沙: 0.92,
  西安: 0.9,
  郑州: 0.88,
  天津: 1.05,
  青岛: 0.95,
  宁波: 1.05,
  东莞: 1.08,
  佛山: 1.02,
  合肥: 0.9,
  厦门: 1.15,
};

const MAX_PLANS = 5;

Page({
  data: {
    // Plan list
    plans: [],
    planCount: 0,

    // City list for picker
    cityList: [],

    // Fund ratio options
    fundRatioOptions: ["5%", "6%", "7%", "8%", "9%", "10%", "11%", "12%"],

    // Comparison result
    comparisonResult: null,
    bestPlanIndex: -1,

    // UI state
    showAddForm: false,
    editingIndex: -1,

    // Form data for adding/editing
    formData: {
      name: "",
      cityIndex: 0,
      grossSalary: "",
      bonus: "",
      fundRatioIndex: 1,
    },
  },

  onLoad() {
    const cityList = getCityList();
    this.setData({ cityList });
  },

  // Show add plan form
  onAddPlan() {
    if (this.data.planCount >= MAX_PLANS) {
      wx.showToast({ title: "最多添加5个方案", icon: "none" });
      return;
    }

    this.setData({
      showAddForm: true,
      editingIndex: -1,
      formData: {
        name: `方案 ${this.data.planCount + 1}`,
        cityIndex: 0,
        grossSalary: "",
        bonus: "",
        fundRatioIndex: 1,
      },
    });
  },

  // Edit existing plan
  onEditPlan(e) {
    const index = e.currentTarget.dataset.index;
    const plan = this.data.plans[index];
    const cityIndex = this.data.cityList.indexOf(plan.city);

    this.setData({
      showAddForm: true,
      editingIndex: index,
      formData: {
        name: plan.name,
        cityIndex: cityIndex >= 0 ? cityIndex : 0,
        grossSalary: plan.grossSalary.toString(),
        bonus: plan.bonus ? plan.bonus.toString() : "",
        fundRatioIndex: plan.fundRatio - 5,
      },
    });
  },

  // Delete plan
  onDeletePlan(e) {
    const index = e.currentTarget.dataset.index;
    const plans = [...this.data.plans];
    plans.splice(index, 1);

    this.setData({
      plans,
      planCount: plans.length,
      comparisonResult: null,
      bestPlanIndex: -1,
    });
  },

  // Form input handlers
  onNameInput(e) {
    this.setData({ "formData.name": e.detail.value });
  },

  onCityChange(e) {
    this.setData({ "formData.cityIndex": parseInt(e.detail.value) });
  },

  onSalaryInput(e) {
    this.setData({ "formData.grossSalary": e.detail.value });
  },

  onBonusInput(e) {
    this.setData({ "formData.bonus": e.detail.value });
  },

  onFundRatioChange(e) {
    this.setData({ "formData.fundRatioIndex": parseInt(e.detail.value) });
  },

  // Prevent tap event propagation on modal
  onStopPropagation() {},

  // Cancel form
  onCancelForm() {
    this.setData({ showAddForm: false, editingIndex: -1 });
  },

  // Save plan from form
  onSavePlan() {
    const { formData, cityList, editingIndex } = this.data;

    // Validate
    if (!formData.name.trim()) {
      wx.showToast({ title: "请输入方案名称", icon: "none" });
      return;
    }

    const salary = parseFloat(formData.grossSalary);
    if (!salary || salary <= 0) {
      wx.showToast({ title: "请输入有效月薪", icon: "none" });
      return;
    }

    const bonus = parseFloat(formData.bonus) || 0;
    const fundRatio = formData.fundRatioIndex + 5;
    const city = cityList[formData.cityIndex];

    const plan = {
      name: formData.name.trim(),
      city,
      grossSalary: salary,
      bonus,
      fundRatio,
    };

    const plans = [...this.data.plans];

    if (editingIndex >= 0) {
      plans[editingIndex] = plan;
    } else {
      plans.push(plan);
    }

    this.setData({
      plans,
      planCount: plans.length,
      showAddForm: false,
      editingIndex: -1,
      comparisonResult: null,
      bestPlanIndex: -1,
    });

    wx.showToast({ title: "方案已保存", icon: "success" });
  },

  // Run comparison calculation
  onCompare() {
    const { plans } = this.data;

    if (plans.length < 2) {
      wx.showToast({ title: "请至少添加2个方案", icon: "none" });
      return;
    }

    try {
      const results = plans.map((plan) => this.calculatePlanResult(plan));

      // Find best plan (highest annual net income)
      let bestIndex = 0;
      let maxIncome = -Infinity;
      results.forEach((r, i) => {
        if (r.annualNetIncome > maxIncome) {
          maxIncome = r.annualNetIncome;
          bestIndex = i;
        }
      });

      // Calculate difference from best
      results.forEach((r, i) => {
        r.diffFromBest =
          Math.round((maxIncome - r.annualNetIncome) * 100) / 100;
        r.isBest = i === bestIndex;
      });

      this.setData({
        comparisonResult: results,
        bestPlanIndex: bestIndex,
      });

      // Analytics: track comparison
      try {
        wx.reportAnalytics("compare", { plan_count: plans.length });
      } catch (e) {
        /* ignore analytics error */
      }

      wx.showToast({ title: "对比完成", icon: "success" });
    } catch (error) {
      console.error("Comparison calculation error:", error);
      wx.showToast({ title: "计算失败，请检查输入", icon: "none" });
    }
  },

  // Calculate single plan result
  calculatePlanResult(plan) {
    const cityConfig = getCitySocialConfig(plan.city);

    // Calculate social security
    const socialSecurity = calculateSocialSecurity(
      plan.grossSalary,
      cityConfig.socialBase,
      cityConfig.socialRate,
      plan.fundRatio,
    );

    // Calculate 12 months tax schedule (use global deductions if available)
    const app = getApp();
    const globalDeductions =
      (app.globalData && app.globalData.deductionItems) || [];
    const specialDeductions = globalDeductions.reduce(
      (sum, item) => sum + (item.amount || 0),
      0,
    );

    const schedule = calculate12MonthsTax({
      monthlyGrossSalary: plan.grossSalary,
      socialSecurity,
      specialDeductions,
    });

    // Monthly averages from schedule
    if (!schedule || schedule.length < 12) return null;
    const totalAnnualTax = schedule[11].cumulativeTax;
    const avgMonthlyTax = Math.round((totalAnnualTax / 12) * 100) / 100;

    // First month result for display
    const monthlyTax = schedule[0].tax;
    const monthlyNet = plan.grossSalary - socialSecurity.total - monthlyTax;

    // Bonus tax
    let bonusNet = 0;
    let bonusTax = 0;
    if (plan.bonus > 0) {
      const bonusResult = calculateBonusTax(plan.bonus);
      bonusNet = bonusResult.netBonus;
      bonusTax = bonusResult.tax;
    }

    // Annual totals
    const annualGross = plan.grossSalary * 12 + (plan.bonus || 0);
    const annualSocial = socialSecurity.total * 12;
    const annualNetIncome =
      plan.grossSalary * 12 - annualSocial - totalAnnualTax + bonusNet;

    // Cost of living hint
    const costIndex = CITY_COST_INDEX[plan.city] || 1.0;
    const costHint = costIndex > 1.1 ? "高" : costIndex < 0.95 ? "低" : "中等";

    return {
      name: plan.name,
      city: plan.city,
      grossSalary: plan.grossSalary,
      socialTotal: Math.round(socialSecurity.total * 100) / 100,
      monthlyTax: Math.round(monthlyTax * 100) / 100,
      monthlyNet: Math.round(monthlyNet * 100) / 100,
      avgMonthlyTax: avgMonthlyTax,
      bonusAmount: plan.bonus || 0,
      bonusTax: Math.round(bonusTax * 100) / 100,
      bonusNet: Math.round(bonusNet * 100) / 100,
      annualGross: Math.round(annualGross * 100) / 100,
      annualSocial: Math.round(annualSocial * 100) / 100,
      annualTax: Math.round((totalAnnualTax + bonusTax) * 100) / 100,
      annualNetIncome: Math.round(annualNetIncome * 100) / 100,
      fundRatio: plan.fundRatio,
      costIndex,
      costHint,
      diffFromBest: 0,
      isBest: false,
    };
  },

  // Reset all
  onReset() {
    this.setData({
      plans: [],
      planCount: 0,
      comparisonResult: null,
      bestPlanIndex: -1,
    });
  },
});
