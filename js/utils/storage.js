/**
 * Storage Utility Functions
 * Handles LocalStorage operations with error handling and data serialization
 */

const StorageUtil = {
  /**
   * Save data to LocalStorage
   * @param {string} key - Storage key
   * @param {*} value - Value to store (will be JSON stringified)
   * @returns {boolean} - Success status
   */
  set(key, value) {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error('Storage set error:', error);
      
      // Handle quota exceeded error
      if (error.name === 'QuotaExceededError') {
        console.warn('LocalStorage quota exceeded. Attempting to clear old data...');
        this.clearOldData();
        
        // Retry once after clearing
        try {
          localStorage.setItem(key, JSON.stringify(value));
          return true;
        } catch (retryError) {
          console.error('Storage set retry failed:', retryError);
          return false;
        }
      }
      return false;
    }
  },

  /**
   * Get data from LocalStorage
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value if key doesn't exist
   * @returns {*} - Parsed value or default
   */
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      return JSON.parse(item);
    } catch (error) {
      console.error('Storage get error:', error);
      return defaultValue;
    }
  },

  /**
   * Remove item from LocalStorage
   * @param {string} key - Storage key
   * @returns {boolean} - Success status
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Storage remove error:', error);
      return false;
    }
  },

  /**
   * Clear all LocalStorage data
   * @returns {boolean} - Success status
   */
  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  },

  /**
   * Check if key exists in LocalStorage
   * @param {string} key - Storage key
   * @returns {boolean} - Existence status
   */
  has(key) {
    return localStorage.getItem(key) !== null;
  },

  /**
   * Get all keys from LocalStorage
   * @returns {string[]} - Array of keys
   */
  keys() {
    return Object.keys(localStorage);
  },

  /**
   * Get storage size in bytes
   * @returns {number} - Size in bytes
   */
  getSize() {
    let size = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        size += localStorage[key].length + key.length;
      }
    }
    return size;
  },

  /**
   * Clear old data to free up space
   * Removes items older than 30 days
   */
  clearOldData() {
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const keysToRemove = [];

    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        try {
          const data = JSON.parse(localStorage[key]);
          if (data && data.timestamp && data.timestamp < thirtyDaysAgo) {
            keysToRemove.push(key);
          }
        } catch (e) {
          // Skip non-JSON items
        }
      }
    }

    keysToRemove.forEach(key => this.remove(key));
    console.log(`Cleared ${keysToRemove.length} old items from storage`);
  },

  /**
   * Save data with timestamp
   * @param {string} key - Storage key
   * @param {*} value - Value to store
   * @returns {boolean} - Success status
   */
  setWithTimestamp(key, value) {
    return this.set(key, {
      data: value,
      timestamp: Date.now()
    });
  },

  /**
   * Get data saved with timestamp
   * @param {string} key - Storage key
   * @param {number} maxAge - Maximum age in milliseconds
   * @returns {*} - Data or null if expired
   */
  getWithTimestamp(key, maxAge = null) {
    const item = this.get(key);
    if (!item || !item.timestamp) {
      return null;
    }

    if (maxAge && (Date.now() - item.timestamp) > maxAge) {
      this.remove(key);
      return null;
    }

    return item.data;
  },

  /**
   * Append to array in storage
   * @param {string} key - Storage key
   * @param {*} value - Value to append
   * @returns {boolean} - Success status
   */
  append(key, value) {
    const existing = this.get(key, []);
    if (!Array.isArray(existing)) {
      console.error('Cannot append to non-array value');
      return false;
    }
    existing.push(value);
    return this.set(key, existing);
  },

  /**
   * Update object in storage
   * @param {string} key - Storage key
   * @param {object} updates - Properties to update
   * @returns {boolean} - Success status
   */
  update(key, updates) {
    const existing = this.get(key, {});
    if (typeof existing !== 'object' || Array.isArray(existing)) {
      console.error('Cannot update non-object value');
      return false;
    }
    const updated = { ...existing, ...updates };
    return this.set(key, updated);
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StorageUtil;
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
  window.StorageUtil = StorageUtil;
}
