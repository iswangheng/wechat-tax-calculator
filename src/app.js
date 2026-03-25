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
    const systemInfo = wx.getSystemInfoSync();
    this.globalData.systemInfo = systemInfo;
    console.log("系统信息:", systemInfo);

    // 加载上次选择的城市
    const lastCity = wx.getStorageSync("lastSelectedCity");
    if (lastCity) {
      this.globalData.selectedCity = lastCity;
    }

    // 加载专项扣除配置
    const savedDeductions = wx.getStorageSync("specialDeductions");
    if (savedDeductions) {
      this.globalData.deductionItems = savedDeductions;
    }
  },

  onShow() {
    console.log("App Show");
  },

  onHide() {
    console.log("App Hide");
  },
});
