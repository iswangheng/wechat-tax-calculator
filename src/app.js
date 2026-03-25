// app.js
App({
  globalData: {
    userInfo: null,
    taxCalculation: null,
    deductionItems: [],
    selectedCity: '上海'
  },

  onLaunch() {
    // Check if onboarding is done, redirect to onboarding page if first time
    const onboardingDone = wx.getStorageSync('onboarding_done');
    if (!onboardingDone) {
      wx.redirectTo({
        url: '/pages/onboarding/onboarding'
      });
    }

    // 显示本地存储能力
    const logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);

    // 登录
    wx.login({
      success: res => {
        console.log('登录成功', res.code);
      }
    });

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.globalData.userInfo = res.userInfo;

              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res);
              }
            }
          });
        }
      }
    });

    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    this.globalData.systemInfo = systemInfo;
    console.log('系统信息:', systemInfo);

    // 加载上次选择的城市
    const lastCity = wx.getStorageSync('lastSelectedCity');
    if (lastCity) {
      this.globalData.selectedCity = lastCity;
    }

    // 加载专项扣除配置
    const savedDeductions = wx.getStorageSync('specialDeductions');
    if (savedDeductions) {
      this.globalData.deductionItems = savedDeductions;
    }
  },

  onShow() {
    console.log('App Show');
  },

  onHide() {
    console.log('App Hide');
  }
});
