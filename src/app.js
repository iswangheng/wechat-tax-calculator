// app.js
const taxDataService = require('./services/tax-data-service');

App({
  globalData: {
    userInfo: null,
    taxCalculation: null,
    deductionItems: [],
    selectedCity: "上海",
  },

  onLaunch() {
    // Initialize cloud environment
    if (wx.cloud) {
      wx.cloud.init({
        traceUser: true,
      });
    }

    // Start background data refresh from cloud (non-blocking)
    taxDataService.init();

    // 显示本地存储能力
    const logs = wx.getStorageSync("logs") || [];
    logs.unshift(Date.now());
    if (logs.length > 50) logs.splice(50);
    wx.setStorageSync("logs", logs);

    // Analytics: track app launch
    try {
      wx.reportAnalytics("app_launch", { timestamp: Date.now() });
    } catch (e) {
      /* ignore analytics error */
    }

    // 获取系统信息
    try {
      const systemInfo = wx.getSystemInfoSync();
      this.globalData.systemInfo = systemInfo;
    } catch (e) {
      console.error("获取系统信息失败:", e);
    }

    // 加载上次选择的城市
    try {
      const lastCity = wx.getStorageSync("lastSelectedCity");
      if (lastCity) {
        this.globalData.selectedCity = lastCity;
      }
    } catch (e) {
      console.error("读取城市缓存失败:", e);
    }

    // 加载专项扣除配置（从 deductions 页面保存的对象格式还原为数组）
    try {
      const saved = wx.getStorageSync("specialDeductions");
      if (saved && typeof saved === "object" && !Array.isArray(saved)) {
        // Rebuild deductionItems array from saved object
        const items = [];
        if (saved.childCount > 0) {
          items.push({
            name: "子女教育",
            amount: saved.childCount * 1000 * ((saved.childRatio || 100) / 100),
          });
        }
        if (saved.infantCount > 0) {
          items.push({
            name: "婴幼儿照护",
            amount: saved.infantCount * 1000 * ((saved.infantRatio || 100) / 100),
          });
        }
        if (saved.hasContinuingEducation) {
          items.push({ name: "继续教育", amount: 400 });
        }
        if (saved.hasHousingLoan) {
          items.push({
            name: "住房贷款利息",
            amount: 1000 * ((saved.loanRatio || 100) / 100),
          });
        }
        if (saved.hasHousingRent && !saved.hasHousingLoan) {
          const rentAmounts = [1500, 1100, 800];
          items.push({
            name: "住房租金",
            amount: rentAmounts[saved.rentCityIndex || 0],
          });
        }
        if (saved.hasElderCare) {
          items.push({
            name: "赡养老人",
            amount:
              saved.elderType === "only"
                ? 2000
                : Math.min(saved.elderShareAmount || 1000, 1000),
          });
        }
        this.globalData.deductionItems = items;
      } else if (Array.isArray(saved)) {
        this.globalData.deductionItems = saved;
      }
    } catch (e) {
      console.error("读取扣除配置失败:", e);
    }
  },

  onShow() {},

  onHide() {},

  onError(msg) {
    console.error("App Error:", msg);
  },
});
