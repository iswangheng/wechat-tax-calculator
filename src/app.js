// app.js
App({
  globalData: {
    userInfo: null,
    taxCalculation: null,
    deductionItems: [],
    selectedCity: "上海",
  },

  onLaunch() {
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

    // 加载专项扣除配置（确保是数组格式）
    try {
      const savedDeductions = wx.getStorageSync("specialDeductions");
      if (Array.isArray(savedDeductions)) {
        this.globalData.deductionItems = savedDeductions;
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
