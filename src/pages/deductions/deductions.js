// 专项附加扣除编辑页面
const { TAX_CONFIG_2026 } = require('../../services/tax-data-service');

Page({
  data: {
    // 子女教育
    childCount: 0,
    childRatio: 100, // 100 or 50

    // 婴幼儿照护
    infantCount: 0,
    infantRatio: 100,

    // 继续教育
    hasContinuingEducation: false,

    // 住房贷款利息
    hasHousingLoan: false,
    loanRatio: 100,

    // 住房租金
    hasHousingRent: false,
    rentCityIndex: 0,
    rentCities: ['一线城市(1500元)', '人口>100万(1100元)', '其他城市(800元)'],
    rentAmounts: [1500, 1100, 800],

    // 赡养老人
    hasElderCare: false,
    elderType: 'only', // 'only' or 'shared'
    elderShareAmount: 1000,

    // 计算结果
    deductions: {
      childEducation: 0,
      infantCare: 0,
      continuingEducation: 0,
      housingLoanInterest: 0,
      housingRent: 0,
      elderCare: 0
    },
    totalDeduction: 0
  },

  onLoad(options) {
    // Load saved deductions from storage or passed params
    this.loadDeductions();
  },

  // Load deductions from storage
  loadDeductions() {
    try {
      const savedDeductions = wx.getStorageSync('specialDeductions');
      if (savedDeductions) {
        this.setData({
          childCount: savedDeductions.childCount || 0,
          childRatio: savedDeductions.childRatio || 100,
          infantCount: savedDeductions.infantCount || 0,
          infantRatio: savedDeductions.infantRatio || 100,
          hasContinuingEducation: savedDeductions.hasContinuingEducation || false,
          hasHousingLoan: savedDeductions.hasHousingLoan || false,
          loanRatio: savedDeductions.loanRatio || 100,
          hasHousingRent: savedDeductions.hasHousingRent || false,
          rentCityIndex: savedDeductions.rentCityIndex || 0,
          hasElderCare: savedDeductions.hasElderCare || false,
          elderType: savedDeductions.elderType || 'only',
          elderShareAmount: savedDeductions.elderShareAmount || 1000
        }, () => {
          this.calculateDeductions();
        });
      }
    } catch (error) {
      console.error('Failed to load deductions:', error);
    }
  },

  // Calculate total deductions
  calculateDeductions() {
    const {
      childCount, childRatio,
      infantCount, infantRatio,
      hasContinuingEducation,
      hasHousingLoan, loanRatio,
      hasHousingRent, rentCityIndex, rentAmounts,
      hasElderCare, elderType, elderShareAmount
    } = this.data;

    const config = TAX_CONFIG_2026.specialDeductions;

    const deductions = {
      // Child education: 1000 * count * ratio
      childEducation: childCount * config.childEducation * (childRatio / 100),

      // Infant care: 1000 * count * ratio
      infantCare: infantCount * config.infantCare * (infantRatio / 100),

      // Continuing education: 400/month
      continuingEducation: hasContinuingEducation ? config.continuingEducation : 0,

      // Housing loan interest: 1000 * ratio (mutual exclusive with rent)
      housingLoanInterest: hasHousingLoan ? config.housingLoanInterest * (loanRatio / 100) : 0,

      // Housing rent: amount based on city (mutual exclusive with loan)
      housingRent: (hasHousingRent && !hasHousingLoan) ? rentAmounts[rentCityIndex] : 0,

      // Elder care: 2000 for only child, or shared amount
      elderCare: hasElderCare
        ? (elderType === 'only' ? config.elderCare.only : Math.min(elderShareAmount, config.elderCare.shared))
        : 0
    };

    const totalDeduction = Object.values(deductions).reduce((sum, val) => sum + val, 0);

    this.setData({
      deductions,
      totalDeduction
    });
  },

  // Child count increase
  onChildCountIncrease() {
    if (this.data.childCount >= 5) return;
    this.setData({
      childCount: this.data.childCount + 1
    }, () => {
      this.calculateDeductions();
    });
  },

  // Child count decrease
  onChildCountDecrease() {
    if (this.data.childCount <= 0) return;
    this.setData({
      childCount: this.data.childCount - 1
    }, () => {
      this.calculateDeductions();
    });
  },

  // Child ratio change
  onChildRatioChange(e) {
    this.setData({
      childRatio: parseInt(e.detail.value)
    }, () => {
      this.calculateDeductions();
    });
  },

  // Infant count increase
  onInfantCountIncrease() {
    if (this.data.infantCount >= 5) return;
    this.setData({
      infantCount: this.data.infantCount + 1
    }, () => {
      this.calculateDeductions();
    });
  },

  // Infant count decrease
  onInfantCountDecrease() {
    if (this.data.infantCount <= 0) return;
    this.setData({
      infantCount: this.data.infantCount - 1
    }, () => {
      this.calculateDeductions();
    });
  },

  // Infant ratio change
  onInfantRatioChange(e) {
    this.setData({
      infantRatio: parseInt(e.detail.value)
    }, () => {
      this.calculateDeductions();
    });
  },

  // Continuing education change
  onContinuingEducationChange(e) {
    this.setData({
      hasContinuingEducation: e.detail.value.length > 0
    }, () => {
      this.calculateDeductions();
    });
  },

  // Housing loan change
  onHousingLoanChange(e) {
    const hasLoan = e.detail.value.length > 0;
    this.setData({
      hasHousingLoan: hasLoan,
      hasHousingRent: hasLoan ? false : this.data.hasHousingRent
    }, () => {
      this.calculateDeductions();
    });
  },

  // Loan ratio change
  onLoanRatioChange(e) {
    this.setData({
      loanRatio: parseInt(e.detail.value)
    }, () => {
      this.calculateDeductions();
    });
  },

  // Housing rent change
  onHousingRentChange(e) {
    this.setData({
      hasHousingRent: e.detail.value.length > 0
    }, () => {
      this.calculateDeductions();
    });
  },

  // Rent city change
  onRentCityChange(e) {
    this.setData({
      rentCityIndex: parseInt(e.detail.value)
    }, () => {
      this.calculateDeductions();
    });
  },

  // Elder care change
  onElderCareChange(e) {
    this.setData({
      hasElderCare: e.detail.value.length > 0
    }, () => {
      this.calculateDeductions();
    });
  },

  // Elder type change
  onElderTypeChange(e) {
    this.setData({
      elderType: e.detail.value
    }, () => {
      this.calculateDeductions();
    });
  },

  // Elder share amount input
  onElderShareInput(e) {
    const amount = parseInt(e.detail.value) || 0;
    this.setData({
      elderShareAmount: Math.min(amount, 1000)
    }, () => {
      this.calculateDeductions();
    });
  },

  // Save settings
  onSave() {
    const {
      childCount, childRatio,
      infantCount, infantRatio,
      hasContinuingEducation,
      hasHousingLoan, loanRatio,
      hasHousingRent, rentCityIndex,
      hasElderCare, elderType, elderShareAmount,
      totalDeduction
    } = this.data;

    const deductionData = {
      childCount, childRatio,
      infantCount, infantRatio,
      hasContinuingEducation,
      hasHousingLoan, loanRatio,
      hasHousingRent, rentCityIndex,
      hasElderCare, elderType, elderShareAmount,
      totalDeduction,
      updatedAt: new Date().toISOString()
    };

    try {
      wx.setStorageSync('specialDeductions', deductionData);

      // Build deductionItems array for index.wxml / reverse.wxml display
      const { deductions } = this.data;
      const deductionItems = [];
      if (deductions.childEducation > 0) deductionItems.push({ name: '子女教育', amount: deductions.childEducation });
      if (deductions.infantCare > 0) deductionItems.push({ name: '婴幼儿照护', amount: deductions.infantCare });
      if (deductions.continuingEducation > 0) deductionItems.push({ name: '继续教育', amount: deductions.continuingEducation });
      if (deductions.housingLoanInterest > 0) deductionItems.push({ name: '住房贷款利息', amount: deductions.housingLoanInterest });
      if (deductions.housingRent > 0) deductionItems.push({ name: '住房租金', amount: deductions.housingRent });
      if (deductions.elderCare > 0) deductionItems.push({ name: '赡养老人', amount: deductions.elderCare });

      // Store deductionItems in globalData for consuming pages
      const app = getApp();
      app.globalData = app.globalData || {};
      app.globalData.deductionItems = deductionItems;

      wx.showToast({
        title: '保存成功',
        icon: 'success',
        duration: 2000
      });

      // Navigate back after a short delay
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);

    } catch (error) {
      console.error('Failed to save deductions:', error);
      wx.showToast({
        title: '保存失败',
        icon: 'none'
      });
    }
  },

  // Cancel and go back
  onCancel() {
    wx.navigateBack();
  }
});
