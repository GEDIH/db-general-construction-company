/**
 * API Utility - Centralized API communication
 * Handles all HTTP requests to the backend API
 */

// API Configuration
const API_CONFIG = {
    baseURL: 'http://localhost:8080/construction-website/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
};

/**
 * API Service - Main API communication class
 */
class APIService {
    constructor(config = API_CONFIG) {
        this.baseURL = config.baseURL;
        this.timeout = config.timeout;
        this.headers = config.headers;
    }

    /**
     * Generic request handler
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}/${endpoint}`;
        const config = {
            method: options.method || 'GET',
            headers: { ...this.headers, ...options.headers },
            ...options
        };

        // Add body for POST/PUT requests
        if (options.body && typeof options.body === 'object') {
            config.body = JSON.stringify(options.body);
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);

            const response = await fetch(url, {
                ...config,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            // Parse JSON response
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Request timeout');
            }
            console.error(`API Error [${endpoint}]:`, error);
            throw error;
        }
    }

    /**
     * GET request
     */
    async get(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        return this.request(url, { method: 'GET' });
    }

    /**
     * POST request
     */
    async post(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: data
        });
    }

    /**
     * PUT request
     */
    async put(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body: data
        });
    }

    /**
     * DELETE request
     */
    async delete(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        return this.request(url, { method: 'DELETE' });
    }
}

/**
 * Projects API
 */
class ProjectsAPI {
    constructor(apiService) {
        this.api = apiService;
    }

    async getAll() {
        return this.api.get('projects.php');
    }

    async getById(id) {
        return this.api.get('projects.php', { id });
    }

    async create(projectData) {
        return this.api.post('projects.php', projectData);
    }

    async update(projectData) {
        return this.api.put('projects.php', projectData);
    }

    async delete(id) {
        return this.api.delete('projects.php', { id });
    }
}

/**
 * Quotes API
 */
class QuotesAPI {
    constructor(apiService) {
        this.api = apiService;
    }

    async getAll(status = null) {
        const params = status ? { status } : {};
        return this.api.get('quotes.php', params);
    }

    async getById(id) {
        return this.api.get('quotes.php', { id });
    }

    async create(quoteData) {
        return this.api.post('quotes.php', quoteData);
    }

    async update(quoteData) {
        return this.api.put('quotes.php', quoteData);
    }
}

/**
 * Users API
 */
class UsersAPI {
    constructor(apiService) {
        this.api = apiService;
    }

    async getAll(filters = {}) {
        return this.api.get('users.php', filters);
    }

    async getById(id) {
        return this.api.get('users.php', { id });
    }

    async create(userData) {
        return this.api.post('users.php', userData);
    }

    async update(userData) {
        return this.api.put('users.php', userData);
    }

    async delete(id) {
        return this.api.delete('users.php', { id });
    }
}

/**
 * Authentication API
 */
class AuthAPI {
    constructor(apiService) {
        this.api = apiService;
    }

    async login(email, password, isAdmin = false) {
        return this.api.post('auth.php', {
            action: 'login',
            email,
            password,
            is_admin: isAdmin
        });
    }

    async register(userData) {
        return this.api.post('auth.php', {
            action: 'register',
            ...userData
        });
    }

    async logout() {
        return this.api.post('auth.php', {
            action: 'logout'
        });
    }

    async verifyToken(token) {
        return this.api.get('auth.php', {}, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    }
}

/**
 * Newsletter API
 */
class NewsletterAPI {
    constructor(apiService) {
        this.api = apiService;
    }

    async getAll(status = null) {
        const params = status ? { status } : {};
        return this.api.get('newsletter.php', params);
    }

    async subscribe(email, name = null) {
        return this.api.post('newsletter.php', { email, name });
    }

    async confirm(token) {
        return this.api.put('newsletter.php', {
            action: 'confirm',
            token
        });
    }

    async unsubscribe(email) {
        return this.api.delete('newsletter.php', { email });
    }

    async update(subscriberId, data) {
        return this.api.put('newsletter.php', {
            subscriber_id: subscriberId,
            ...data
        });
    }
}

/**
 * Cost Estimates API
 */
class CostEstimatesAPI {
    constructor(apiService) {
        this.api = apiService;
    }

    async getAll(filters = {}) {
        return this.api.get('cost-estimates.php', filters);
    }

    async getById(id) {
        return this.api.get('cost-estimates.php', { id });
    }

    async create(estimateData) {
        return this.api.post('cost-estimates.php', estimateData);
    }

    async update(estimateData) {
        return this.api.put('cost-estimates.php', estimateData);
    }

    async delete(id) {
        return this.api.delete('cost-estimates.php', { id });
    }
}

/**
 * Client Projects API (for client dashboard)
 */
class ClientProjectsAPI {
    constructor(apiService) {
        this.api = apiService;
    }

    async getByClientId(clientId) {
        return this.api.get('client-projects.php', { client_id: clientId });
    }

    async getProjectUpdates(projectId) {
        return this.api.get('client-projects.php', { 
            action: 'updates',
            project_id: projectId 
        });
    }

    async getProjectDocuments(projectId) {
        return this.api.get('client-projects.php', { 
            action: 'documents',
            project_id: projectId 
        });
    }
}

// Create singleton instance
const apiService = new APIService();

// Export API instances
const API = {
    projects: new ProjectsAPI(apiService),
    quotes: new QuotesAPI(apiService),
    users: new UsersAPI(apiService),
    auth: new AuthAPI(apiService),
    newsletter: new NewsletterAPI(apiService),
    costEstimates: new CostEstimatesAPI(apiService),
    clientProjects: new ClientProjectsAPI(apiService),
    
    // Direct access to base service for custom requests
    service: apiService
};

// Make available globally
window.API = API;

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API;
}
