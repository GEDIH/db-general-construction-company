/**
 * Validation Utility Functions
 * Handles form validation for email, phone, and other inputs
 */

const ValidationUtil = {
  /**
   * Validate email format according to RFC 5322
   * @param {string} email - Email address to validate
   * @returns {boolean} - Validation result
   */
  validateEmail(email) {
    if (!email || typeof email !== 'string') {
      return false;
    }

    // RFC 5322 compliant email regex (simplified)
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    return emailRegex.test(email.trim());
  },

  /**
   * Validate Ethiopian phone number
   * @param {string} phone - Phone number to validate
   * @returns {boolean} - Validation result
   */
  validatePhone(phone) {
    if (!phone || typeof phone !== 'string') {
      return false;
    }

    // Ethiopian phone format: +251-XXX-XXXX or 09XX-XXX-XXX
    const phoneRegex = /^(\+251|0)[79]\d{8}$/;
    const cleaned = phone.replace(/[\s-]/g, '');
    
    return phoneRegex.test(cleaned);
  },

  /**
   * Validate required field
   * @param {*} value - Value to validate
   * @returns {boolean} - Validation result
   */
  required(value) {
    if (value === null || value === undefined) {
      return false;
    }
    
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    
    return true;
  },

  /**
   * Validate minimum length
   * @param {string} value - Value to validate
   * @param {number} min - Minimum length
   * @returns {boolean} - Validation result
   */
  minLength(value, min) {
    if (!value || typeof value !== 'string') {
      return false;
    }
    return value.trim().length >= min;
  },

  /**
   * Validate maximum length
   * @param {string} value - Value to validate
   * @param {number} max - Maximum length
   * @returns {boolean} - Validation result
   */
  maxLength(value, max) {
    if (!value || typeof value !== 'string') {
      return true; // Empty is valid for max length
    }
    return value.trim().length <= max;
  },

  /**
   * Validate number range
   * @param {number} value - Value to validate
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {boolean} - Validation result
   */
  numberRange(value, min, max) {
    const num = Number(value);
    if (isNaN(num)) {
      return false;
    }
    return num >= min && num <= max;
  },

  /**
   * Validate positive number
   * @param {number} value - Value to validate
   * @returns {boolean} - Validation result
   */
  positiveNumber(value) {
    const num = Number(value);
    return !isNaN(num) && num > 0;
  },

  /**
   * Validate non-negative number
   * @param {number} value - Value to validate
   * @returns {boolean} - Validation result
   */
  nonNegativeNumber(value) {
    const num = Number(value);
    return !isNaN(num) && num >= 0;
  },

  /**
   * Validate URL format
   * @param {string} url - URL to validate
   * @returns {boolean} - Validation result
   */
  validateUrl(url) {
    if (!url || typeof url !== 'string') {
      return false;
    }

    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  },

  /**
   * Validate file type
   * @param {File} file - File to validate
   * @param {string[]} allowedTypes - Array of allowed MIME types
   * @returns {boolean} - Validation result
   */
  validateFileType(file, allowedTypes) {
    if (!file || !file.type) {
      return false;
    }
    return allowedTypes.includes(file.type);
  },

  /**
   * Validate file size
   * @param {File} file - File to validate
   * @param {number} maxSize - Maximum size in bytes
   * @returns {boolean} - Validation result
   */
  validateFileSize(file, maxSize) {
    if (!file || !file.size) {
      return false;
    }
    return file.size <= maxSize;
  },

  /**
   * Sanitize HTML to prevent XSS
   * @param {string} html - HTML string to sanitize
   * @returns {string} - Sanitized HTML
   */
  sanitizeHtml(html) {
    if (!html || typeof html !== 'string') {
      return '';
    }

    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  },

  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {object} - Validation result with strength level
   */
  validatePassword(password) {
    if (!password || typeof password !== 'string') {
      return { valid: false, strength: 'none', message: 'Password is required' };
    }

    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return { valid: false, strength: 'weak', message: `Password must be at least ${minLength} characters` };
    }

    let strength = 0;
    if (hasUpperCase) strength++;
    if (hasLowerCase) strength++;
    if (hasNumbers) strength++;
    if (hasSpecialChar) strength++;

    if (strength < 2) {
      return { valid: false, strength: 'weak', message: 'Password is too weak' };
    } else if (strength === 2) {
      return { valid: true, strength: 'medium', message: 'Password strength is medium' };
    } else {
      return { valid: true, strength: 'strong', message: 'Password is strong' };
    }
  },

  /**
   * Get validation error message
   * @param {string} field - Field name
   * @param {string} rule - Validation rule
   * @param {*} params - Rule parameters
   * @returns {string} - Error message
   */
  getErrorMessage(field, rule, params = {}) {
    const messages = {
      required: `${field} is required`,
      email: `Please enter a valid email address`,
      phone: `Please enter a valid phone number`,
      minLength: `${field} must be at least ${params.min} characters`,
      maxLength: `${field} must not exceed ${params.max} characters`,
      numberRange: `${field} must be between ${params.min} and ${params.max}`,
      positiveNumber: `${field} must be a positive number`,
      url: `Please enter a valid URL`,
      fileType: `Invalid file type. Allowed types: ${params.types}`,
      fileSize: `File size must not exceed ${this.formatFileSize(params.maxSize)}`
    };

    return messages[rule] || `${field} is invalid`;
  },

  /**
   * Format file size for display
   * @param {number} bytes - Size in bytes
   * @returns {string} - Formatted size
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  },

  /**
   * Validate form data
   * @param {object} data - Form data to validate
   * @param {object} rules - Validation rules
   * @returns {object} - Validation result with errors
   */
  validateForm(data, rules) {
    const errors = {};
    let isValid = true;

    for (const field in rules) {
      const fieldRules = rules[field];
      const value = data[field];

      for (const rule of fieldRules) {
        const { type, params, message } = rule;

        let valid = true;
        switch (type) {
          case 'required':
            valid = this.required(value);
            break;
          case 'email':
            valid = this.validateEmail(value);
            break;
          case 'phone':
            valid = this.validatePhone(value);
            break;
          case 'minLength':
            valid = this.minLength(value, params.min);
            break;
          case 'maxLength':
            valid = this.maxLength(value, params.max);
            break;
          case 'numberRange':
            valid = this.numberRange(value, params.min, params.max);
            break;
          case 'positiveNumber':
            valid = this.positiveNumber(value);
            break;
          default:
            console.warn(`Unknown validation rule: ${type}`);
        }

        if (!valid) {
          errors[field] = message || this.getErrorMessage(field, type, params);
          isValid = false;
          break; // Stop at first error for this field
        }
      }
    }

    return { isValid, errors };
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ValidationUtil;
}
