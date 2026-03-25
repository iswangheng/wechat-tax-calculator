// 年终奖计算页面
const { calculateBonusTax, optimizeBonusTax } = require('../../utils/tax-calculator');
const { BONUS_CRITICAL_POINTS } = require('../../config/cities-tax-2026');
const { saveHistory } = require('../../utils/history-manager');
const { drawBonusCliffChart, initCanvas } = require('../../utils/chart-utils');

Page({
  data: {
    bonus: '',              // 年终奖金额
    result: null,           // 计算结果
    optimization: null,     // 优化建议
    showCriticalPoints: false  // 显示临界点表格
  },

  // 年终奖输入
  onBonusInput(e) {
    this.setData({
      bonus: e.detail.value,
      result: null,
      optimization: null
    });
  },

  // 开始计算
  onCalculate() {
    const { bonus } = this.data;

    if (!bonus || bonus <= 0) {
      wx.showToast({ title: '请输入年终奖金额', icon: 'none' });
      return;
    }

    try {
      const bonusAmount = parseFloat(bonus);
      const rawResult = calculateBonusTax(bonusAmount);
      const rawOptimization = optimizeBonusTax(bonusAmount);

      // Map fields to match wxml expected structure
      const result = {
        ...rawResult,
        rate: rawResult.bracket ? rawResult.bracket.rate : 0,
        quickDeduction: rawResult.bracket ? rawResult.bracket.deduction : 0,
        netIncome: rawResult.netBonus,
        monthlyAvg: (bonusAmount / 12).toFixed(2)
      };

      // Map optimization fields for wxml
      const optimization = {
        ...rawOptimization,
        difference: rawOptimization.saved > 0
          ? (bonusAmount - rawOptimization.optimized.bonus).toFixed(2)
          : '0.00'
      };

      this.setData({
        result,
        optimization
      });

      // Save to history
      const app = getApp();
      const city = (app.globalData && app.globalData.selectedCity) || '上海';
      saveHistory({
        type: 'bonus',
        city: city,
        inputData: {
          bonus: parseFloat(bonus)
        },
        result: result
      });

      // 如果接近临界点，显示警告
      if (result.isCritical) {
        wx.showModal({
          title: '⚠️ 临界点警告',
          content: result.criticalWarning ? result.criticalWarning.suggestion : '当前金额接近临界点',
          showCancel: false
        });
      }

      wx.showToast({ title: '计算成功', icon: 'success' });

      // Render cliff chart after setData is applied
      var that = this;
      setTimeout(function() {
        that.renderCliffChart();
      }, 400);

    } catch (error) {
      console.error('计算错误:', error);
      wx.showToast({ title: '计算失败，请检查输入', icon: 'none' });
    }
  },

  // 查看临界点表格
  onShowCriticalPoints() {
    this.setData({
      showCriticalPoints: !this.data.showCriticalPoints
    });
  },

  // 使用优化建议
  onUseOptimization() {
    if (this.data.optimization && this.data.optimization.saved > 0) {
      const optimizedBonus = this.data.optimization.optimized.bonus;
      this.setData({
        bonus: optimizedBonus.toString()
      });
      this.onCalculate();
    }
  },

  // 重置
  onReset() {
    this.setData({
      bonus: '',
      result: null,
      optimization: null,
      showCriticalPoints: false
    });
  },

  // Render bonus cliff chart on canvas
  renderCliffChart() {
    var bonusVal = parseFloat(this.data.bonus) || 0;
    initCanvas(this, 'cliffCanvas', function(ctx, w, h) {
      drawBonusCliffChart(ctx, w, h, {
        userBonus: bonusVal
      });
    });
  },

  onLoad() {
    // 预加载临界点数据
    this.setData({
      criticalPoints: BONUS_CRITICAL_POINTS
    });
  }
});
