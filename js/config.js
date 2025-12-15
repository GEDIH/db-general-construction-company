/**
 * Configuration file for DB General Construction website enhancements
 * Contains API endpoints, constants, and default settings
 */

const CONFIG = {
  // API Configuration
  API: {
    // Production API URL (Your Domain)
    BASE_URL: 'https://dbgeneralconstruction.com.et/api',
    
    // Development fallback (mock endpoints)
    // BASE_URL: '/api',
    
    ENDPOINTS: {
      PROJECTS: '/projects',
      USERS: '/users',
      AUTH: '/auth',
      QUOTES: '/quotes',
      NEWSLETTER: '/newsletter',
      RESOURCES: '/resources',
      CHAT: '/chat',
      ANALYTICS: '/analytics'
    }
  },

  // Storage Keys
  STORAGE_KEYS: {
    AUTH_TOKEN: 'db_auth_token',
    USER_DATA: 'db_user_data',
    USERS: 'db_users',
    ESTIMATES: 'db_cost_estimates',
    CHAT_HISTORY: 'db_chat_history',
    NEWSLETTER_SUBS: 'db_newsletter_subscribers',
    PROJECTS: 'db_projects',
    ADMIN_SESSION: 'db_admin_session',
    AUDIT_LOG: 'db_audit_log',
    REMEMBER_ME: 'db_remember_me',
    QUOTE_REQUESTS: 'db_quote_requests',
    RESOURCES: 'db_resources'
  },

  // Default Admin Credentials
  ADMIN: {
    USERNAME: 'admin',
    PASSWORD: 'admin12345',
    EMAIL: 'admin@dbgeneralconstruction.com.et'
  },

  // Session Configuration
  SESSION: {
    TIMEOUT: 30 * 60 * 1000, // 30 minutes in milliseconds
    WARNING_TIME: 5 * 60 * 1000 // 5 minutes before timeout
  },

  // File Upload Configuration
  UPLOAD: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: {
      IMAGES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
      DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    }
  },

  // Cost Calculator Configuration
  COST_CALCULATOR: {
    PROJECT_TYPES: {
      RESIDENTIAL: 'residential',
      COMMERCIAL: 'commercial',
      INDUSTRIAL: 'industrial',
      RENOVATION: 'renovation'
    },
    BASE_RATES: {
      residential: { min: 5000, max: 8000 }, // per square meter
      commercial: { min: 7000, max: 12000 },
      industrial: { min: 6000, max: 10000 },
      renovation: { min: 3000, max: 6000 }
    },
    CONTINGENCY_RATE: 0.15 // 15% contingency
  },

  // Email Configuration (mock)
  EMAIL: {
    FROM: 'noreply@dbgeneralconstruction.com.et',
    SUPPORT: 'support@dbgeneralconstruction.com.et'
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 12,
    MAX_PAGE_SIZE: 50
  },

  // Map Configuration
  MAP: {
    CENTER: { lat: 9.145, lng: 40.489673 }, // Ethiopia center
    DEFAULT_ZOOM: 6,
    MARKER_CLUSTER_DISTANCE: 50
  },

  // Performance
  PERFORMANCE: {
    DEBOUNCE_DELAY: 300, // milliseconds
    THROTTLE_DELAY: 200,
    IMAGE_LAZY_LOAD_THRESHOLD: 200
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
}
