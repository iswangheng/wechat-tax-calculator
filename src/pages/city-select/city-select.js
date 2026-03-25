// City selection page
const {
  getCityList,
  getCitiesByLevel,
  getCitySocialConfig
} = require('../../config/cities-tax-2026');

Page({
  data: {
    // Search
    searchKeyword: '',

    // Current selected city
    currentCity: '',

    // Hot cities (top tier)
    hotCities: [],

    // Cities grouped by level
    cityGroups: [],

    // Search results
    searchResults: [],
    isSearching: false
  },

  onLoad() {
    this.loadCurrentCity();
    this.loadHotCities();
    this.loadCityGroups();
  },

  // Load current selected city from global data
  loadCurrentCity() {
    const app = getApp();
    const currentCity = (app.globalData && app.globalData.selectedCity) || '上海';
    this.setData({ currentCity });
  },

  // Load hot cities (tier 1 and major cities)
  loadHotCities() {
    const hotCityNames = ['上海', '北京', '深圳', '广州', '杭州', '成都', '南京', '武汉', '苏州'];
    const hotCities = hotCityNames.map(name => {
      const config = getCitySocialConfig(name);
      return {
        name,
        level: config.level
      };
    });

    this.setData({ hotCities });
  },

  // Load all cities grouped by level
  loadCityGroups() {
    const citiesByLevel = getCitiesByLevel();
    const levelOrder = ['一线', '新一线', '二线', '其他'];
    const levelBadgeMap = {
      '一线': 'badge-tier1',
      '新一线': 'badge-tier2',
      '二线': 'badge-tier3',
      '其他': 'badge-tier3'
    };

    const cityGroups = levelOrder
      .filter(level => citiesByLevel[level] && citiesByLevel[level].length > 0)
      .map(level => ({
        level,
        badgeClass: levelBadgeMap[level] || 'badge-tier3',
        cities: citiesByLevel[level]
      }));

    this.setData({ cityGroups });
  },

  // Search input handler
  onSearchInput(e) {
    const keyword = e.detail.value.trim();
    this.setData({ searchKeyword: keyword });

    if (!keyword) {
      this.setData({
        isSearching: false,
        searchResults: []
      });
      return;
    }

    this.setData({ isSearching: true });
    this.searchCities(keyword);
  },

  // Search cities by keyword
  searchCities(keyword) {
    const allCities = getCityList();
    const results = allCities
      .filter(name => name.includes(keyword))
      .map(name => {
        const config = getCitySocialConfig(name);
        return {
          name,
          level: config.level,
          socialBase: `${config.socialBase.min}-${config.socialBase.max}`
        };
      });

    this.setData({ searchResults: results });
  },

  // Clear search
  onClearSearch() {
    this.setData({
      searchKeyword: '',
      isSearching: false,
      searchResults: []
    });
  },

  // Select a city (from hot cities grid)
  onSelectHotCity(e) {
    const cityName = e.currentTarget.dataset.city;
    this.confirmCity(cityName);
  },

  // Select a city (from grouped list)
  onSelectCity(e) {
    const cityName = e.currentTarget.dataset.city;
    this.confirmCity(cityName);
  },

  // Select a city (from search results)
  onSelectSearchResult(e) {
    const cityName = e.currentTarget.dataset.city;
    this.confirmCity(cityName);
  },

  // Confirm city selection and navigate back
  confirmCity(cityName) {
    const app = getApp();
    app.globalData = app.globalData || {};
    app.globalData.selectedCity = cityName;

    // Save to local storage
    wx.setStorageSync('lastSelectedCity', cityName);

    this.setData({ currentCity: cityName });

    wx.showToast({
      title: `已选择${cityName}`,
      icon: 'success',
      duration: 1000
    });

    // Navigate back after short delay
    setTimeout(() => {
      wx.navigateBack();
    }, 800);
  }
});
