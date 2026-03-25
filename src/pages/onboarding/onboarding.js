// Onboarding page for first-time users
Page({
  data: {
    currentIndex: 0,
    steps: [
      {
        title: '精准算税',
        desc: '支持累计预扣法\n自动计算五险一金'
      },
      {
        title: '年终奖优化',
        desc: '智能检测临界点\n一键优化节税'
      },
      {
        title: '开始使用',
        desc: '轻松掌握个税信息\n做出最优税务规划'
      }
    ]
  },

  // Handle swiper change
  onSwiperChange(e) {
    this.setData({
      currentIndex: e.detail.current
    });
  },

  // Skip onboarding
  onSkip() {
    this.finishOnboarding();
  },

  // Start using the app
  onStart() {
    this.finishOnboarding();
  },

  // Mark onboarding as done and navigate to home
  finishOnboarding() {
    wx.setStorageSync('onboarding_done', true);
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
});
