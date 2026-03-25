// History manager for tax calculation records
// Uses wx local storage with key 'tax_history'
// Maximum 20 records, FIFO when exceeding limit

const STORAGE_KEY = 'tax_history';
const MAX_RECORDS = 20;

/**
 * Generate a readable title for history record
 * @param {string} type - Record type: 'salary' or 'bonus'
 * @param {string} city - City name
 * @param {object} inputData - Input parameters
 * @param {object} result - Calculation result
 * @returns {string} Generated title
 */
function generateTitle(type, city, inputData, result) {
  if (type === 'bonus') {
    return `${city} 年终奖${inputData.bonus} 税后${result.netBonus}`;
  }
  return `${city} 月薪${inputData.salary} 税后${result.netSalary}`;
}

/**
 * Save a calculation record to history
 * @param {object} record - Record object with type, city, inputData, result
 * @returns {object} The saved record with id and createTime
 */
function saveHistory(record) {
  const { type, city, inputData, result } = record;

  const historyRecord = {
    id: Date.now(),
    title: generateTitle(type, city, inputData, result),
    type: type,
    city: city,
    inputData: inputData,
    result: result,
    createTime: Date.now()
  };

  const list = getHistoryList();

  // Prepend new record (newest first)
  list.unshift(historyRecord);

  // Enforce max limit
  if (list.length > MAX_RECORDS) {
    list.splice(MAX_RECORDS);
  }

  try {
    wx.setStorageSync(STORAGE_KEY, list);
  } catch (e) {
    console.error('Failed to save history:', e);
  }

  return historyRecord;
}

/**
 * Get all history records
 * @returns {Array} List of history records, newest first
 */
function getHistoryList() {
  try {
    return wx.getStorageSync(STORAGE_KEY) || [];
  } catch (e) {
    console.error('Failed to read history:', e);
    return [];
  }
}

/**
 * Get a single history record by id
 * @param {number} id - Record id (timestamp)
 * @returns {object|null} The matching record or null
 */
function getHistoryById(id) {
  const list = getHistoryList();
  return list.find(item => item.id === id) || null;
}

/**
 * Delete a single history record by id
 * @param {number} id - Record id (timestamp)
 * @returns {boolean} Whether deletion was successful
 */
function deleteHistory(id) {
  const list = getHistoryList();
  const index = list.findIndex(item => item.id === id);

  if (index === -1) {
    return false;
  }

  list.splice(index, 1);

  try {
    wx.setStorageSync(STORAGE_KEY, list);
    return true;
  } catch (e) {
    console.error('Failed to delete history:', e);
    return false;
  }
}

/**
 * Clear all history records
 * @returns {boolean} Whether clearing was successful
 */
function clearHistory() {
  try {
    wx.removeStorageSync(STORAGE_KEY);
    return true;
  } catch (e) {
    console.error('Failed to clear history:', e);
    return false;
  }
}

module.exports = {
  saveHistory,
  getHistoryList,
  getHistoryById,
  deleteHistory,
  clearHistory
};
