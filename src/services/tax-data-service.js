// Tax Data Service
// Unified data access layer: Cloud -> Cache -> Built-in fallback
// Ensures the app always works, even offline

const localConfig = require('../config/cities-tax-2026');

const CACHE_KEY = 'cloud_tax_config';
const CACHE_VERSION_KEY = 'cloud_tax_version';
const CACHE_TIME_KEY = 'cloud_tax_cache_time';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

let _cloudData = null; // In-memory cache for current session
let _initPromise = null; // Singleton init promise

/**
 * Initialize data service: try cloud, fall back to cache, then built-in
 * Call this once at app launch. Non-blocking — resolves quickly.
 */
function init() {
  if (_initPromise) return _initPromise;

  _initPromise = new Promise((resolve) => {
    // Step 1: Load local cache first (instant)
    _cloudData = _loadCache();

    // Step 2: Check cloud in background (non-blocking)
    _refreshFromCloud().then(() => {
      resolve();
    }).catch(() => {
      resolve(); // Always resolve, never block the app
    });

    // Don't wait for cloud — resolve after cache is loaded
    // Cloud update will take effect on next getCitySocialConfig call
    setTimeout(resolve, 100);
  });

  return _initPromise;
}

/**
 * Get city social security config
 * Uses cloud data if available, otherwise falls back to built-in
 */
function getCitySocialConfig(cityName) {
  // Try cloud/cached data first
  if (_cloudData && _cloudData.cities && _cloudData.cities[cityName]) {
    return _cloudData.cities[cityName];
  }
  // Fall back to built-in local config
  return localConfig.getCitySocialConfig(cityName);
}

/**
 * Get all city names
 */
function getCityList() {
  if (_cloudData && _cloudData.cities) {
    return Object.keys(_cloudData.cities);
  }
  return localConfig.getCityList();
}

/**
 * Get cities grouped by level
 */
function getCitiesByLevel() {
  if (_cloudData && _cloudData.cities) {
    const groups = {};
    Object.values(_cloudData.cities).forEach((city) => {
      const level = city.level || '其他';
      if (!groups[level]) groups[level] = [];
      groups[level].push(city.name);
    });
    return groups;
  }
  return localConfig.getCitiesByLevel();
}

/**
 * Get data metadata (version, update time, etc.)
 */
function getDataMetadata() {
  if (_cloudData && _cloudData.version) {
    return {
      version: _cloudData.version,
      lastUpdate: _cloudData.lastUpdate || _cloudData.version,
      dataSource: _cloudData.dataSource || localConfig.getDataMetadata().dataSource,
      cityCount: _cloudData.cityCount || Object.keys(_cloudData.cities || {}).length,
      coverageProvinces: _cloudData.coverageProvinces || 26,
      nextScheduledUpdate: _cloudData.nextScheduledUpdate || '',
    };
  }
  return localConfig.getDataMetadata();
}

/**
 * Check data freshness
 */
function checkDataFreshness() {
  if (_cloudData && _cloudData.version) {
    return localConfig.checkDataFreshness();
  }
  return localConfig.checkDataFreshness();
}

/**
 * Get data source type: 'cloud', 'cache', or 'builtin'
 */
function getDataSource() {
  if (_cloudData && _cloudData._source === 'cloud') return 'cloud';
  if (_cloudData && _cloudData._source === 'cache') return 'cache';
  return 'builtin';
}

// ==================== Internal functions ====================

/**
 * Load cached cloud data from local storage
 */
function _loadCache() {
  try {
    const cacheTime = wx.getStorageSync(CACHE_TIME_KEY);
    if (!cacheTime) return null;

    // Check cache freshness
    const age = Date.now() - cacheTime;
    if (age > CACHE_TTL * 7) {
      // Cache older than 7 days — still usable but needs refresh
    }

    const cached = wx.getStorageSync(CACHE_KEY);
    if (cached && cached.cities) {
      cached._source = 'cache';
      return cached;
    }
  } catch (e) {
    console.error('Failed to load tax config cache:', e);
  }
  return null;
}

/**
 * Save data to local cache
 */
function _saveCache(data) {
  try {
    wx.setStorageSync(CACHE_KEY, data);
    wx.setStorageSync(CACHE_VERSION_KEY, data.version);
    wx.setStorageSync(CACHE_TIME_KEY, Date.now());
  } catch (e) {
    console.error('Failed to save tax config cache:', e);
  }
}

/**
 * Check if cache is still fresh (within TTL)
 */
function _isCacheFresh() {
  try {
    const cacheTime = wx.getStorageSync(CACHE_TIME_KEY);
    if (!cacheTime) return false;
    return (Date.now() - cacheTime) < CACHE_TTL;
  } catch (e) {
    return false;
  }
}

/**
 * Refresh data from cloud (background, non-blocking)
 */
function _refreshFromCloud() {
  // Skip if cache is fresh
  if (_isCacheFresh() && _cloudData) {
    return Promise.resolve();
  }

  // Skip if cloud is not available
  if (!wx.cloud) {
    return Promise.resolve();
  }

  const clientVersion = _cloudData ? _cloudData.version : '';

  return wx.cloud.callFunction({
    name: 'getTaxConfig',
    data: { clientVersion },
  }).then((res) => {
    const result = res.result;
    if (!result || result.code !== 0) {
      console.warn('Cloud getTaxConfig returned error:', result);
      return;
    }

    if (!result.needUpdate) {
      // Version unchanged, just refresh cache timestamp
      _saveCache(_cloudData);
      return;
    }

    // Got new data from cloud
    const newData = {
      version: result.version,
      lastUpdate: result.lastUpdate,
      cities: result.data.cities || {},
      taxConfig: result.data.taxConfig,
      bonusBrackets: result.data.bonusBrackets,
      bonusCriticalPoints: result.data.bonusCriticalPoints,
      _source: 'cloud',
    };

    _cloudData = newData;
    _saveCache(newData);
    console.log('Tax config updated from cloud, version:', result.version);
  }).catch((err) => {
    console.warn('Cloud getTaxConfig failed (using fallback):', err.message || err);
  });
}

// Re-export constants that are used directly (tax brackets, etc.)
// These rarely change, so we keep using the built-in values
// Cloud can override them via taxConfig/bonusBrackets fields
const { TAX_CONFIG_2026, BONUS_TAX_BRACKETS, BONUS_CRITICAL_POINTS } = localConfig;

module.exports = {
  init,
  getCitySocialConfig,
  getCityList,
  getCitiesByLevel,
  getDataMetadata,
  checkDataFreshness,
  getDataSource,
  TAX_CONFIG_2026,
  BONUS_TAX_BRACKETS,
  BONUS_CRITICAL_POINTS,
};
