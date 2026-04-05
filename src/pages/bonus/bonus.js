// 年终奖计算页面
const {
  calculateBonusTax,
  optimizeBonusTax,
} = require("../../utils/tax-calculator");
const { BONUS_CRITICAL_POINTS } = require("../../config/cities-tax-2026");
const { saveHistory } = require("../../utils/history-manager");
const { drawBonusCliffChart, initCanvas } = require("../../utils/chart-utils");

Page({
  data: {
    bonus: "", // 年终奖金额
    result: null, // 计算结果
    optimization: null, // 优化建议
    showCriticalPoints: false, // 显示临界点表格
  },

  // 年终奖输入
  onBonusInput(e) {
    this.setData({
      bonus: e.detail.value,
      result: null,
      optimization: null,
    });
  },

  // 开始计算
  onCalculate() {
    const { bonus } = this.data;

    if (!bonus || parseFloat(bonus) <= 0) {
      wx.showToast({ title: "请输入年终奖金额", icon: "none" });
      return;
    }

    const bonusAmount = parseFloat(bonus);
    if (bonusAmount > 10000000) {
      wx.showToast({ title: "年终奖金额不能超过1000万元", icon: "none" });
      return;
    }

    try {
      const rawResult = calculateBonusTax(bonusAmount);
      const rawOptimization = optimizeBonusTax(bonusAmount);

      // Map fields to match wxml expected structure
      const result = {
        ...rawResult,
        rate: rawResult.bracket ? rawResult.bracket.rate : 0,
        quickDeduction: rawResult.bracket ? rawResult.bracket.deduction : 0,
        netIncome: rawResult.netBonus,
        monthlyAvg: (bonusAmount / 12).toFixed(2),
      };

      // Map optimization fields for wxml
      const optimization = {
        ...rawOptimization,
        difference:
          rawOptimization.saved > 0
            ? (bonusAmount - rawOptimization.optimized.bonus).toFixed(2)
            : "0.00",
      };

      this.setData({
        result,
        optimization,
      });

      // Save to history
      const app = getApp();
      const city = (app.globalData && app.globalData.selectedCity) || "上海";
      saveHistory({
        type: "bonus",
        city: city,
        inputData: {
          bonus: parseFloat(bonus),
        },
        result: result,
      });

      // 如果接近临界点，显示警告
      if (result.isCritical) {
        wx.showModal({
          title: "⚠️ 临界点警告",
          content: result.criticalWarning
            ? result.criticalWarning.suggestion
            : "当前金额接近临界点",
          showCancel: false,
        });
      }

      // Analytics: track bonus calculation
      try {
        wx.reportAnalytics("calculate", { type: "bonus" });
      } catch (e) {
        /* ignore analytics error */
      }

      wx.showToast({ title: "计算成功", icon: "success" });

      // Render cliff chart after setData is applied
      var that = this;
      setTimeout(function () {
        that.renderCliffChart();
      }, 400);
    } catch (error) {
      console.error("计算错误:", error);
      wx.showToast({ title: "计算失败，请检查输入", icon: "none" });
    }
  },

  // 查看临界点表格
  onShowCriticalPoints() {
    this.setData({
      showCriticalPoints: !this.data.showCriticalPoints,
    });
  },

  // 使用优化建议
  onUseOptimization() {
    if (this.data.optimization && this.data.optimization.saved > 0) {
      const optimizedBonus = this.data.optimization.optimized.bonus;
      this.setData({
        bonus: optimizedBonus.toString(),
      });
      this.onCalculate();
    }
  },

  // 重置
  onReset() {
    this.setData({
      bonus: "",
      result: null,
      optimization: null,
      showCriticalPoints: false,
    });
  },

  // Render bonus cliff chart on canvas
  renderCliffChart() {
    var bonusVal = parseFloat(this.data.bonus) || 0;
    initCanvas(this, "cliffCanvas", function (ctx, w, h) {
      drawBonusCliffChart(ctx, w, h, {
        userBonus: bonusVal,
      });
    });
  },

  // Show tip explaining bonus tax calculation method
  onShowTip() {
    wx.showModal({
      title: "年终奖计税说明",
      content:
        '年终奖可选择单独计税或并入综合所得计税。单独计税：将年终奖除以12个月，按月度税率表确定适用税率和速算扣除数，单独计算纳税。注意临界点附近可能出现"多发1元，多扣千元"的情况。',
      showCancel: false,
      confirmText: "知道了",
    });
  },

  onLoad() {
    // Pre-process critical points data for display
    const criticalPoints = BONUS_CRITICAL_POINTS.map((cp) => ({
      point: cp.point.toLocaleString() + "元",
      avoid:
        cp.point.toLocaleString() +
        " ~ " +
        (cp.point + cp.diff).toLocaleString() +
        "元",
      rateJump: "多缴" + cp.diff.toLocaleString() + "元",
    }));

    this.setData({
      criticalPoints,
    });
  },

  onShow() {
    // Restore from history record if available
    const app = getApp();
    if (app.globalData && app.globalData.restoreFromHistory) {
      const record = app.globalData.restoreFromHistory;
      delete app.globalData.restoreFromHistory;

      if (record.type === "bonus" && record.inputData) {
        this.setData({
          bonus: record.inputData.bonus.toString(),
          result: null,
          optimization: null,
        });

        wx.showToast({ title: "已恢复参数", icon: "success" });
      }
    }
  },
});
