// User Agreement Page Logic
Page({
  data: {},

  /**
   * Handle user agree action
   */
  handleAgree() {
    // Save user agreement status to local storage
    try {
      wx.setStorageSync('agreement_agreed', true);
      wx.setStorageSync('agreement_agreed_time', new Date().getTime());

      wx.showToast({
        title: '已确认',
        icon: 'success',
        duration: 1500
      });

      // Navigate back after 1.5 seconds
      setTimeout(() => {
        wx.navigateBack({
          delta: 1
        });
      }, 1500);
    } catch (error) {
      console.error('Save agreement failed:', error);
      wx.showToast({
        title: '操作失败',
        icon: 'none',
        duration: 2000
      });
    }
  },

  /**
   * Lifecycle - Page loaded
   */
  onLoad(options) {
    // Set navigation bar title
    wx.setNavigationBarTitle({
      title: '用户协议'
    });
  },

  /**
   * Share to friends
   */
  onShareAppMessage() {
    return {
      title: '个税计算器 2026 - 用户协议',
      path: '/pages/agreement/agreement'
    };
  }
});
