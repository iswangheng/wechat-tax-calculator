// Annual tax settlement simulation page
const { calculateAnnualSettlement, calculateBonusTax } = require('../../utils/tax-calculator');

Page({
  data: {
    // Input fields
    totalSalary: '',       // Total salary for the year
    bonus: '',             // Annual bonus
    otherIncome: '',       // Other income (freelance, royalties, etc.)
    paidTax: '',           // Total tax already paid
    totalSocial: '',       // Total social security paid
    totalDeduction: '',    // Total special deductions

    // Bonus tax method toggle
    bonusMerged: false,    // Whether to merge bonus into comprehensive income

    // Calculation result
    result: null,

    // Optimization suggestion
    optimization: null,

    // Show calculation process
    showProcess: false
  },

  // Input handlers
  onTotalSalaryInput(e) {
    this.setData({ totalSalary: e.detail.value, result: null });
  },

  onBonusInput(e) {
    this.setData({ bonus: e.detail.value, result: null });
  },

  onOtherIncomeInput(e) {
    this.setData({ otherIncome: e.detail.value, result: null });
  },

  onPaidTaxInput(e) {
    this.setData({ paidTax: e.detail.value, result: null });
  },

  onTotalSocialInput(e) {
    this.setData({ totalSocial: e.detail.value, result: null });
  },

  onTotalDeductionInput(e) {
    this.setData({ totalDeduction: e.detail.value, result: null });
  },

  onBonusMergedChange(e) {
    this.setData({
      bonusMerged: e.detail.value.length > 0,
      result: null
    });
  },

  // Toggle calculation process detail
  onToggleProcess() {
    this.setData({ showProcess: !this.data.showProcess });
  },

  // Quick fill from monthly salary
  onQuickFill() {
    wx.showModal({
      title: '快速填写',
      content: '请在下方输入月薪，系统将自动计算全年数据',
      editable: true,
      placeholderText: '请输入税前月薪',
      success: (res) => {
        if (res.confirm && res.content) {
          const monthlySalary = parseFloat(res.content);
          if (monthlySalary > 0) {
            this.setData({
              totalSalary: (monthlySalary * 12).toString(),
              result: null
            });
            wx.showToast({ title: '已自动计算全年工资', icon: 'none' });
          }
        }
      }
    });
  },

  // Start calculation
  onCalculate() {
    const {
      totalSalary, bonus, otherIncome,
      paidTax, totalSocial, totalDeduction,
      bonusMerged
    } = this.data;

    // Validate required fields
    const salaryVal = parseFloat(totalSalary) || 0;
    if (salaryVal <= 0) {
      wx.showToast({ title: '请输入全年工资总收入', icon: 'none' });
      return;
    }

    const paidTaxVal = parseFloat(paidTax) || 0;
    if (paidTaxVal < 0) {
      wx.showToast({ title: '已缴个税不能为负数', icon: 'none' });
      return;
    }

    const totalSocialVal = parseFloat(totalSocial) || 0;
    const totalDeductionVal = parseFloat(totalDeduction) || 0;
    const bonusVal = parseFloat(bonus) || 0;
    const otherIncomeVal = parseFloat(otherIncome) || 0;

    try {
      // Calculate with current bonus method
      const result = calculateAnnualSettlement({
        totalSalary: salaryVal,
        bonus: bonusVal,
        otherIncome: otherIncomeVal,
        paidTax: paidTaxVal,
        totalSocial: totalSocialVal,
        totalDeduction: totalDeductionVal,
        bonusMerged
      });

      // Generate optimization suggestion
      const optimization = this.generateOptimization(
        salaryVal, bonusVal, otherIncomeVal,
        paidTaxVal, totalSocialVal, totalDeductionVal
      );

      this.setData({ result, optimization });

      wx.showToast({ title: '计算完成', icon: 'success' });
    } catch (error) {
      console.error('Annual settlement calculation error:', error);
      wx.showToast({ title: '计算失败，请检查输入', icon: 'none' });
    }
  },

  // Generate optimization suggestion by comparing two bonus methods
  generateOptimization(totalSalary, bonus, otherIncome, paidTax, totalSocial, totalDeduction) {
    if (!bonus || bonus <= 0) {
      return {
        hasSuggestion: false,
        text: '无年终奖，无需比较计税方式'
      };
    }

    // Method 1: Separate taxation for bonus
    const separateResult = calculateAnnualSettlement({
      totalSalary,
      bonus,
      otherIncome,
      paidTax,
      totalSocial,
      totalDeduction,
      bonusMerged: false
    });

    // Method 2: Merge bonus into comprehensive income
    const mergedResult = calculateAnnualSettlement({
      totalSalary,
      bonus,
      otherIncome,
      paidTax,
      totalSocial,
      totalDeduction,
      bonusMerged: true
    });

    const separateTax = separateResult.totalAnnualTax;
    const mergedTax = mergedResult.totalAnnualTax;
    const diff = Math.abs(separateTax - mergedTax);

    if (separateTax < mergedTax) {
      return {
        hasSuggestion: true,
        recommendMerged: false,
        text: `建议选择"年终奖单独计税"，可少缴 ${Math.round(diff * 100) / 100} 元`,
        separateTax: Math.round(separateTax * 100) / 100,
        mergedTax: Math.round(mergedTax * 100) / 100,
        savedAmount: Math.round(diff * 100) / 100
      };
    } else if (mergedTax < separateTax) {
      return {
        hasSuggestion: true,
        recommendMerged: true,
        text: `建议选择"年终奖并入综合所得"，可少缴 ${Math.round(diff * 100) / 100} 元`,
        separateTax: Math.round(separateTax * 100) / 100,
        mergedTax: Math.round(mergedTax * 100) / 100,
        savedAmount: Math.round(diff * 100) / 100
      };
    }

    return {
      hasSuggestion: false,
      text: '两种计税方式税额相同',
      separateTax: Math.round(separateTax * 100) / 100,
      mergedTax: Math.round(mergedTax * 100) / 100,
      savedAmount: 0
    };
  },

  // Reset all fields
  onReset() {
    this.setData({
      totalSalary: '',
      bonus: '',
      otherIncome: '',
      paidTax: '',
      totalSocial: '',
      totalDeduction: '',
      bonusMerged: false,
      result: null,
      optimization: null,
      showProcess: false
    });
  }
});
