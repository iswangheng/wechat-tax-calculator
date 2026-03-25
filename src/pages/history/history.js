// History page - display and manage tax calculation records
const { getHistoryList, deleteHistory, clearHistory } = require('../../utils/history-manager');

Page({
  data: {
    historyList: [],
    isEmpty: true,
    // Touch tracking for swipe-to-delete
    touchStartX: 0,
    activeSwipeId: null
  },

  onLoad() {
    this.loadHistory();
  },

  onShow() {
    this.loadHistory();
  },

  // Load history records from storage
  loadHistory() {
    const list = getHistoryList();
    this.setData({
      historyList: list.map(item => ({
        ...item,
        // Format createTime for display
        formattedTime: this.formatTime(item.createTime),
        // Track swipe state per item
        swiped: false
      })),
      isEmpty: list.length === 0
    });
  },

  /**
   * Format timestamp to readable string
   * @param {number} timestamp - Unix timestamp in ms
   * @returns {string} Formatted date string
   */
  formatTime(timestamp) {
    const date = new Date(timestamp);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${month}-${day} ${hours}:${minutes}`;
  },

  // Touch start handler for swipe detection
  onTouchStart(e) {
    this.setData({
      touchStartX: e.touches[0].clientX
    });
  },

  // Touch end handler - detect left swipe to show delete button
  onTouchEnd(e) {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = this.data.touchStartX - touchEndX;
    const id = e.currentTarget.dataset.id;

    if (diff > 60) {
      // Left swipe - show delete button
      this.setData({
        activeSwipeId: id
      });
    } else if (diff < -30) {
      // Right swipe - hide delete button
      this.setData({
        activeSwipeId: null
      });
    }
  },

  // Tap on card - navigate to index with restored params
  onTapRecord(e) {
    const id = e.currentTarget.dataset.id;

    // If swiped, ignore tap
    if (this.data.activeSwipeId === id) {
      this.setData({ activeSwipeId: null });
      return;
    }

    const record = this.data.historyList.find(item => item.id === id);
    if (!record) return;

    // Store restored data in globalData
    const app = getApp();
    app.globalData = app.globalData || {};
    app.globalData.restoreFromHistory = record;

    // Navigate back to index (switchTab for tabBar page)
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  // Delete single record
  onDeleteRecord(e) {
    const id = e.currentTarget.dataset.id;

    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条记录吗？',
      success: (res) => {
        if (res.confirm) {
          deleteHistory(id);
          this.setData({ activeSwipeId: null });
          this.loadHistory();
          wx.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  },

  // Long press to delete
  onLongPressRecord(e) {
    const id = e.currentTarget.dataset.id;

    wx.showActionSheet({
      itemList: ['删除此记录'],
      success: (res) => {
        if (res.tapIndex === 0) {
          deleteHistory(id);
          this.loadHistory();
          wx.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  },

  // Clear all history
  onClearAll() {
    if (this.data.isEmpty) return;

    wx.showModal({
      title: '清空历史',
      content: '确定要清空所有计算记录吗？此操作不可撤销。',
      confirmColor: '#059048',
      success: (res) => {
        if (res.confirm) {
          clearHistory();
          this.loadHistory();
          wx.showToast({ title: '已清空', icon: 'success' });
        }
      }
    });
  },

  // Navigate back
  onGoBack() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
});
