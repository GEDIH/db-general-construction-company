/**
 * Authentication Utility Functions
 * Handles login, logout, and session management
 */

const AuthUtil = {
  /**
   * Generate a mock JWT token
   * @param {object} payload - Token payload
   * @param {number} expiry - Token expiry time in milliseconds (optional)
   * @returns {string} - JWT token
   */
  generateToken(payload, expiry = null) {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const body = btoa(JSON.stringify({
      ...payload,
      iat: Date.now(),
      exp: Date.now() + (expiry || CONFIG.SESSION.TIMEOUT)
    }));
    const signature = btoa('mock-signature-' + Date.now());
    
    return `${header}.${body}.${signature}`;
  },

  /**
   * Decode JWT token
   * @param {string} token - JWT token
   * @returns {object|null} - Decoded payload or null
   */
  decodeToken(token) {
    try {
      if (!token || typeof token !== 'string') {
        return null;
      }

      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      const payload = JSON.parse(atob(parts[1]));
      return payload;
    } catch (error) {
      console.error('Token decode error:', error);
      return null;
    }
  },

  /**
   * Verify token validity
   * @param {string} token - JWT token
   * @returns {boolean} - Validity status
   */
  verifyToken(token) {
    const payload = this.decodeToken(token);
    if (!payload) {
      return false;
    }

    // Check expiration
    if (payload.exp && payload.exp < Date.now()) {
      return false;
    }

    return true;
  },

  /**
   * Authenticate admin user
   * @param {string} username - Admin username
   * @param {string} password - Admin password
   * @returns {object} - Authentication result
   */
  authenticateAdmin(username, password) {
    // Default admin credentials
    const ADMIN_USERNAME = 'admin';
    const ADMIN_PASSWORD = 'admin12345';
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const user = {
        id: 'admin-001',
        username: ADMIN_USERNAME,
        email: 'admin@dbconstruction.com',
        name: 'Administrator',
        role: 'admin',
        isActive: true
      };

      const token = this.generateToken({ userId: user.id, role: user.role });
      
      // Store token and user data
      StorageUtil.set(CONFIG.STORAGE_KEYS.AUTH_TOKEN, token);
      StorageUtil.set(CONFIG.STORAGE_KEYS.USER_DATA, user);
      
      // Initialize session tracking
      this.initSession();

      return {
        success: true,
        user,
        token,
        message: 'Admin login successful'
      };
    }

    return {
      success: false,
      message: 'Invalid admin credentials'
    };
  },

  /**
   * Login user (main method - calls API version)
   * @param {string} username - Username or email
   * @param {string} password - Password
   * @param {boolean} rememberMe - Remember user for extended period
   * @returns {Promise<object>} - Login result
   */
  async login(username, password, rememberMe = false) {
    return this.loginWithAPI(username, password, rememberMe);
  },

  /**
   * Login user with backend API
   * @param {string} username - Username or email
   * @param {string} password - Password
   * @param {boolean} rememberMe - Remember user for extended period
   * @returns {Promise<object>} - Login result
   */
  async loginWithAPI(username, password, rememberMe = false) {
    try {
      // Try backend API first
      if (typeof API !== 'undefined' && API.auth) {
        // API expects email, but username could be email or username
        // For now, pass username as email (API will validate)
        const response = await API.auth.login(username, password, false);
        
        if (response.success) {
          // API returns user and token at root level, not in data
          const user = response.user;
          const token = response.token;
          
          // Store token and user data
          StorageUtil.set(CONFIG.STORAGE_KEYS.AUTH_TOKEN, token);
          StorageUtil.set(CONFIG.STORAGE_KEYS.USER_DATA, user);
          
          // Store remember me preference
          if (rememberMe) {
            StorageUtil.set(CONFIG.STORAGE_KEYS.REMEMBER_ME, {
              enabled: true,
              expiry: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
            });
          }
          
          // Initialize session tracking
          this.initSession();
          
          return {
            success: true,
            user,
            token,
            message: 'Login successful'
          };
        } else {
          return {
            success: false,
            message: response.message || 'Invalid username or password'
          };
        }
      }
    } catch (error) {
      console.warn('API login failed, using localStorage fallback:', error);
    }
    
    // Fallback to localStorage authentication
    return this.loginLocalStorage(username, password, rememberMe);
  },

  /**
   * Login user (localStorage fallback)
   * @param {string} username - Username or email
   * @param {string} password - Password
   * @param {boolean} rememberMe - Remember user for extended period
   * @returns {object} - Login result
   */
  loginLocalStorage(username, password, rememberMe = false) {
    // Check admin credentials
    if (username === CONFIG.ADMIN.USERNAME && password === CONFIG.ADMIN.PASSWORD) {
      const user = {
        id: 'admin-001',
        username: CONFIG.ADMIN.USERNAME,
        email: CONFIG.ADMIN.EMAIL,
        name: 'Dale Melaku',
        role: 'admin',
        isActive: true
      };

      const tokenExpiry = rememberMe ? (30 * 24 * 60 * 60 * 1000) : CONFIG.SESSION.TIMEOUT; // 30 days or session timeout
      const token = this.generateToken({ userId: user.id, role: user.role }, tokenExpiry);
      
      // Store token and user data
      StorageUtil.set(CONFIG.STORAGE_KEYS.AUTH_TOKEN, token);
      StorageUtil.set(CONFIG.STORAGE_KEYS.USER_DATA, user);
      
      // Store remember me preference
      if (rememberMe) {
        StorageUtil.set(CONFIG.STORAGE_KEYS.REMEMBER_ME, {
          enabled: true,
          expiry: Date.now() + tokenExpiry
        });
      }
      
      // Initialize session tracking
      this.initSession();

      return {
        success: true,
        user,
        token,
        message: 'Login successful'
      };
    }

    // Check client credentials (mock - would normally check database)
    const users = StorageUtil.get(CONFIG.STORAGE_KEYS.USERS, []);
    const user = users.find(u => 
      (u.username === username || u.email === username) && 
      u.password === password &&
      u.isActive
    );

    if (user) {
      const tokenExpiry = rememberMe ? (30 * 24 * 60 * 60 * 1000) : CONFIG.SESSION.TIMEOUT; // 30 days or session timeout
      const token = this.generateToken({ userId: user.id, role: user.role }, tokenExpiry);
      
      // Store token and user data (without password)
      const { password: _, ...userData } = user;
      StorageUtil.set(CONFIG.STORAGE_KEYS.AUTH_TOKEN, token);
      StorageUtil.set(CONFIG.STORAGE_KEYS.USER_DATA, userData);
      
      // Store remember me preference
      if (rememberMe) {
        StorageUtil.set(CONFIG.STORAGE_KEYS.REMEMBER_ME, {
          enabled: true,
          expiry: Date.now() + tokenExpiry
        });
      }
      
      // Update last login
      user.lastLogin = new Date().toISOString();
      StorageUtil.set(CONFIG.STORAGE_KEYS.USERS, users);
      
      // Initialize session tracking
      this.initSession();

      return {
        success: true,
        user: userData,
        token,
        message: 'Login successful'
      };
    }

    return {
      success: false,
      message: 'Invalid username or password'
    };
  },

  /**
   * Logout user
   * @returns {boolean} - Success status
   */
  logout() {
    try {
      StorageUtil.remove(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
      StorageUtil.remove(CONFIG.STORAGE_KEYS.USER_DATA);
      StorageUtil.remove(CONFIG.STORAGE_KEYS.ADMIN_SESSION);
      StorageUtil.remove(CONFIG.STORAGE_KEYS.REMEMBER_ME);
      
      // Clear session tracking
      this.clearSession();

      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  },

  /**
   * Get current user
   * @returns {object|null} - User data or null
   */
  getCurrentUser() {
    const token = StorageUtil.get(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
    if (!token || !this.verifyToken(token)) {
      return null;
    }

    return StorageUtil.get(CONFIG.STORAGE_KEYS.USER_DATA);
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} - Authentication status
   */
  isAuthenticated() {
    const token = StorageUtil.get(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
    return token && this.verifyToken(token);
  },

  /**
   * Check if user has specific role
   * @param {string} role - Role to check
   * @returns {boolean} - Role check result
   */
  hasRole(role) {
    const user = this.getCurrentUser();
    return user && user.role === role;
  },

  /**
   * Check if user is admin
   * @returns {boolean} - Admin status
   */
  isAdmin() {
    return this.hasRole('admin');
  },

  /**
   * Initialize session tracking for auto-logout
   */
  initSession() {
    const session = {
      startTime: Date.now(),
      lastActivity: Date.now(),
      warningShown: false
    };
    
    StorageUtil.set(CONFIG.STORAGE_KEYS.ADMIN_SESSION, session);
    
    // Set up activity listeners
    this.setupActivityListeners();
    
    // Start session timeout checker
    this.startSessionChecker();
  },

  /**
   * Update last activity time
   */
  updateActivity() {
    const session = StorageUtil.get(CONFIG.STORAGE_KEYS.ADMIN_SESSION);
    if (session) {
      session.lastActivity = Date.now();
      session.warningShown = false;
      StorageUtil.set(CONFIG.STORAGE_KEYS.ADMIN_SESSION, session);
    }
  },

  /**
   * Set up activity listeners
   */
  setupActivityListeners() {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, () => {
        if (this.isAuthenticated()) {
          this.updateActivity();
        }
      }, { passive: true });
    });
  },

  /**
   * Start session timeout checker
   */
  startSessionChecker() {
    // Clear any existing interval
    if (window.sessionCheckInterval) {
      clearInterval(window.sessionCheckInterval);
    }

    // Check every minute
    window.sessionCheckInterval = setInterval(() => {
      if (!this.isAuthenticated()) {
        clearInterval(window.sessionCheckInterval);
        return;
      }

      const session = StorageUtil.get(CONFIG.STORAGE_KEYS.ADMIN_SESSION);
      if (!session) return;

      const inactiveTime = Date.now() - session.lastActivity;
      
      // Show warning 5 minutes before timeout
      if (inactiveTime >= (CONFIG.SESSION.TIMEOUT - CONFIG.SESSION.WARNING_TIME) && !session.warningShown) {
        this.showSessionWarning();
        session.warningShown = true;
        StorageUtil.set(CONFIG.STORAGE_KEYS.ADMIN_SESSION, session);
      }

      // Auto-logout after timeout
      if (inactiveTime >= CONFIG.SESSION.TIMEOUT) {
        this.logout();
        clearInterval(window.sessionCheckInterval);
        
        // Redirect to login with message
        if (window.location.pathname.includes('/admin/')) {
          alert('Your session has expired due to inactivity. Please login again.');
          window.location.href = '/admin/login.html';
        }
      }
    }, 60000); // Check every minute
  },

  /**
   * Show session timeout warning
   */
  showSessionWarning() {
    if (confirm('Your session will expire in 5 minutes due to inactivity. Click OK to stay logged in.')) {
      this.updateActivity();
    }
  },

  /**
   * Clear session tracking
   */
  clearSession() {
    if (window.sessionCheckInterval) {
      clearInterval(window.sessionCheckInterval);
      window.sessionCheckInterval = null;
    }
  },

  /**
   * Require authentication (redirect if not authenticated)
   * @param {string} redirectUrl - URL to redirect to if not authenticated
   */
  requireAuth(redirectUrl = '/admin/login.html') {
    if (!this.isAuthenticated()) {
      window.location.href = redirectUrl;
      return false;
    }
    return true;
  },

  /**
   * Require admin role (redirect if not admin)
   * @param {string} redirectUrl - URL to redirect to if not admin
   */
  requireAdmin(redirectUrl = '/index.html') {
    if (!this.isAdmin()) {
      window.location.href = redirectUrl;
      return false;
    }
    return true;
  },

  /**
   * Hash password (simple implementation - use bcrypt in production)
   * @param {string} password - Password to hash
   * @returns {string} - Hashed password
   */
  hashPassword(password) {
    // This is a simple hash for demonstration
    // In production, use a proper hashing library like bcrypt
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return 'hash_' + Math.abs(hash).toString(16);
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AuthUtil;
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
  window.AuthUtils = AuthUtil;
}


/**
 * Initialize demo users for testing
 * This should be called once to set up demo accounts
 */
AuthUtil.initDemoUsers = function() {
  const existingUsers = StorageUtil.get(CONFIG.STORAGE_KEYS.USERS, []);
  
  // Only initialize if no users exist
  if (existingUsers.length === 0) {
    const demoUsers = [
      {
        id: 'admin-001',
        username: 'admin',
        email: 'admin@dbconstruction.com',
        password: 'admin12345',
        name: 'Administrator',
        role: 'admin',
        projectIds: [],
        createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
        lastLogin: new Date().toISOString(),
        isActive: true
      },
      {
        id: 'staff-001',
        username: 'moti.elias',
        email: 'moti@dbconstruction.com',
        password: 'staff123',
        name: 'Moti Elias',
        role: 'staff',
        projectIds: ['proj-001', 'proj-002', 'proj-003'],
        createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
        lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true
      },
      {
        id: 'staff-002',
        username: 'moti.tola',
        email: 'tola@dbconstruction.com',
        password: 'staff456',
        name: 'Moti Tola',
        role: 'staff',
        projectIds: ['proj-004', 'proj-005'],
        createdAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
        lastLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true
      },
      {
        id: 'client-001',
        username: 'abc.corp',
        email: 'contact@abc.com',
        password: 'client123',
        name: 'ABC Corporation',
        role: 'client',
        projectIds: ['proj-001', 'proj-002'],
        createdAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
        lastLogin: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true
      },
      {
        id: 'client-002',
        username: 'john.doe',
        email: 'john.doe@example.com',
        password: 'client123',
        name: 'John Doe',
        role: 'client',
        projectIds: ['proj-003'],
        createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
        lastLogin: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true
      },
      {
        id: 'client-003',
        username: 'jane.smith',
        email: 'jane.smith@example.com',
        password: 'client456',
        name: 'Jane Smith',
        role: 'client',
        projectIds: ['proj-004', 'proj-005'],
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true
      },
      {
        id: 'client-004',
        username: 'ministry.health',
        email: 'info@moh.gov.et',
        password: 'client789',
        name: 'Ministry of Health',
        role: 'client',
        projectIds: ['proj-006'],
        createdAt: new Date(Date.now() - 250 * 24 * 60 * 60 * 1000).toISOString(),
        lastLogin: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true
      },
      {
        id: 'client-005',
        username: 'real.estate',
        email: 'contact@regroup.com',
        password: 'client321',
        name: 'Real Estate Group',
        role: 'client',
        projectIds: ['proj-007', 'proj-008', 'proj-009'],
        createdAt: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000).toISOString(),
        lastLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true
      },
      {
        id: 'client-006',
        username: 'private.dev',
        email: 'dev@private.com',
        password: 'client654',
        name: 'Private Developer',
        role: 'client',
        projectIds: ['proj-010'],
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        lastLogin: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true
      },
      {
        id: 'client-007',
        username: 'city.admin',
        email: 'admin@city.gov.et',
        password: 'client987',
        name: 'City Administration',
        role: 'client',
        projectIds: ['proj-011', 'proj-012'],
        createdAt: new Date(Date.now() - 280 * 24 * 60 * 60 * 1000).toISOString(),
        lastLogin: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true
      },
      {
        id: 'client-008',
        username: 'demo.client',
        email: 'demo@example.com',
        password: 'demo123',
        name: 'Demo Client',
        role: 'client',
        projectIds: [],
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastLogin: null,
        isActive: false
      },
      {
        id: 'client-009',
        username: 'test.user',
        email: 'test@example.com',
        password: 'test123',
        name: 'Test User',
        role: 'client',
        projectIds: [],
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        lastLogin: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: false
      }
    ];
    
    StorageUtil.set(CONFIG.STORAGE_KEYS.USERS, demoUsers);
    console.log('Demo users initialized:', demoUsers.length);
    return demoUsers;
  }
  
  return existingUsers;
};

// Auto-initialize demo users on load
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    AuthUtil.initDemoUsers();
  });
}
