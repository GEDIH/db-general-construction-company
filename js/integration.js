/**
 * Integration Module
 * Common functionality across all feature modules
 */

class Integration {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupLoadingIndicators();
        this.setupNotifications();
        this.setupAccessibility();
        this.setupErrorHandling();
    }

    /**
     * Setup navigation highlighting
     */
    setupNavigation() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('nav a');
        
        navLinks.forEach(link => {
            const linkPath = new URL(link.href).pathname;
            if (currentPath === linkPath || currentPath.endsWith(linkPath)) {
                link.classList.add('active');
            }
        });

        // Add breadcrumb navigation
        this.addBreadcrumbs();
    }

    /**
     * Add breadcrumb navigation
     */
    addBreadcrumbs() {
        const breadcrumbContainer = document.querySelector('.breadcrumb-custom');
        if (!breadcrumbContainer) return;

        const path = window.location.pathname;
        const segments = path.split('/').filter(segment => segment);
        
        let breadcrumbHTML = '<a href="index.html">Home</a>';
        let currentPath = '';

        segments.forEach((segment, index) => {
            currentPath += '/' + segment;
            const isLast = index === segments.length - 1;
            const displayName = this.formatBreadcrumbName(segment);
            
            if (isLast) {
                breadcrumbHTML += ` <span class="separator">/</span> <span class="active">${displayName}</span>`;
            } else {
                breadcrumbHTML += ` <span class="separator">/</span> <a href="${currentPath}">${displayName}</a>`;
            }
        });

        breadcrumbContainer.innerHTML = breadcrumbHTML;
    }

    /**
     * Format breadcrumb names
     */
    formatBreadcrumbName(segment) {
        return segment
            .replace('.html', '')
            .replace(/-/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    /**
     * Setup loading indicators
     */
    setupLoadingIndicators() {
        // Create loading overlay
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.id = 'loadingOverlay';
        loadingOverlay.style.display = 'none';
        loadingOverlay.innerHTML = '<div class="loading-spinner"></div>';
        document.body.appendChild(loadingOverlay);
    }

    /**
     * Show loading indicator
     */
    showLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = 'flex';
        }
    }

    /**
     * Hide loading indicator
     */
    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    /**
     * Setup notification system
     */
    setupNotifications() {
        // Create notification container
        const notificationContainer = document.createElement('div');
        notificationContainer.id = 'notificationContainer';
        notificationContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
        `;
        document.body.appendChild(notificationContainer);
    }

    /**
     * Show notification
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, error, warning, info)
     * @param {number} duration - Duration in milliseconds
     */
    showNotification(message, type = 'info', duration = 5000) {
        const container = document.getElementById('notificationContainer');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `alert-custom alert-${type}`;
        
        const icon = this.getNotificationIcon(type);
        notification.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
            <button class="modal-close" onclick="this.parentElement.remove()" style="margin-left: auto;">×</button>
        `;

        container.appendChild(notification);

        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => {
                notification.style.animation = 'slideOutRight 0.5s ease-out';
                setTimeout(() => notification.remove(), 500);
            }, duration);
        }
    }

    /**
     * Get notification icon based on type
     */
    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    /**
     * Setup accessibility features
     */
    setupAccessibility() {
        // Add skip to content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-to-content';
        skipLink.textContent = 'Skip to main content';
        document.body.insertBefore(skipLink, document.body.firstChild);

        // Add main content ID if not exists
        const mainContent = document.querySelector('main, article, .main-content');
        if (mainContent && !mainContent.id) {
            mainContent.id = 'main-content';
        }

        // Setup keyboard navigation
        this.setupKeyboardNavigation();
    }

    /**
     * Setup keyboard navigation
     */
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // ESC key closes modals
            if (e.key === 'Escape') {
                const modals = document.querySelectorAll('.modal-custom.show');
                modals.forEach(modal => modal.classList.remove('show'));
            }

            // Tab trap for modals
            if (e.key === 'Tab') {
                const activeModal = document.querySelector('.modal-custom.show');
                if (activeModal) {
                    this.trapFocus(e, activeModal);
                }
            }
        });
    }

    /**
     * Trap focus within element
     */
    trapFocus(e, element) {
        const focusableElements = element.querySelectorAll(
            'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }

    /**
     * Setup global error handling
     */
    setupErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
            this.showNotification(
                'An unexpected error occurred. Please try again.',
                'error'
            );
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            this.showNotification(
                'An unexpected error occurred. Please try again.',
                'error'
            );
        });
    }

    /**
     * Validate form
     * @param {HTMLFormElement} form - Form element
     * @returns {boolean} - Validation result
     */
    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');

        inputs.forEach(input => {
            if (!input.value.trim()) {
                this.showFieldError(input, 'This field is required');
                isValid = false;
            } else {
                this.clearFieldError(input);
            }

            // Email validation
            if (input.type === 'email' && input.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    this.showFieldError(input, 'Please enter a valid email address');
                    isValid = false;
                }
            }

            // Phone validation
            if (input.type === 'tel' && input.value) {
                const phoneRegex = /^[\d\s\-\+\(\)]+$/;
                if (!phoneRegex.test(input.value)) {
                    this.showFieldError(input, 'Please enter a valid phone number');
                    isValid = false;
                }
            }
        });

        return isValid;
    }

    /**
     * Show field error
     */
    showFieldError(input, message) {
        input.classList.add('error');
        
        let errorElement = input.nextElementSibling;
        if (!errorElement || !errorElement.classList.contains('form-error-message')) {
            errorElement = document.createElement('div');
            errorElement.className = 'form-error-message';
            input.parentNode.insertBefore(errorElement, input.nextSibling);
        }
        
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    /**
     * Clear field error
     */
    clearFieldError(input) {
        input.classList.remove('error');
        const errorElement = input.nextElementSibling;
        if (errorElement && errorElement.classList.contains('form-error-message')) {
            errorElement.style.display = 'none';
        }
    }

    /**
     * Format date
     */
    formatDate(date, format = 'short') {
        const d = new Date(date);
        
        if (format === 'short') {
            return d.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
            });
        } else if (format === 'long') {
            return d.toLocaleDateString('en-US', { 
                weekday: 'long',
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
            });
        } else if (format === 'time') {
            return d.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        } else if (format === 'datetime') {
            return `${this.formatDate(d, 'short')} ${this.formatDate(d, 'time')}`;
        }
        
        return d.toLocaleDateString();
    }

    /**
     * Format currency
     */
    formatCurrency(amount, currency = 'ETB') {
        return new Intl.NumberFormat('en-ET', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2
        }).format(amount);
    }

    /**
     * Debounce function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function
     */
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Check if element is in viewport
     */
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    /**
     * Smooth scroll to element
     */
    scrollToElement(element, offset = 0) {
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Initialize integration on page load
document.addEventListener('DOMContentLoaded', () => {
    window.integration = new Integration();
});

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Integration;
}


/**
 * Enhanced Error Handler
 */
class ErrorHandler {
    constructor() {
        this.errors = [];
        this.maxErrors = 50;
    }

    /**
     * Log error
     */
    logError(error, context = {}) {
        const errorEntry = {
            message: error.message || error,
            stack: error.stack,
            context,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };

        this.errors.push(errorEntry);
        
        // Keep only last maxErrors
        if (this.errors.length > this.maxErrors) {
            this.errors.shift();
        }

        // Log to console in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.error('Error logged:', errorEntry);
        }

        // In production, send to error tracking service
        this.sendToErrorTracking(errorEntry);
    }

    /**
     * Send error to tracking service (placeholder)
     */
    sendToErrorTracking(errorEntry) {
        // In production, this would send to a service like Sentry, LogRocket, etc.
        // For now, store in localStorage for debugging
        try {
            const storedErrors = JSON.parse(localStorage.getItem('errorLog') || '[]');
            storedErrors.push(errorEntry);
            
            // Keep only last 20 errors in localStorage
            if (storedErrors.length > 20) {
                storedErrors.shift();
            }
            
            localStorage.setItem('errorLog', JSON.stringify(storedErrors));
        } catch (e) {
            console.error('Failed to store error log:', e);
        }
    }

    /**
     * Get all errors
     */
    getErrors() {
        return this.errors;
    }

    /**
     * Clear errors
     */
    clearErrors() {
        this.errors = [];
        localStorage.removeItem('errorLog');
    }

    /**
     * Handle network errors
     */
    handleNetworkError(error, retryCallback = null) {
        const message = 'Network error occurred. Please check your connection.';
        
        if (window.integration) {
            window.integration.showNotification(message, 'error');
        }

        this.logError(error, { type: 'network' });

        // Offer retry if callback provided
        if (retryCallback) {
            setTimeout(() => {
                if (confirm('Would you like to retry?')) {
                    retryCallback();
                }
            }, 2000);
        }
    }

    /**
     * Handle validation errors
     */
    handleValidationError(errors) {
        if (Array.isArray(errors)) {
            errors.forEach(error => {
                if (window.integration) {
                    window.integration.showNotification(error, 'warning', 3000);
                }
            });
        } else {
            if (window.integration) {
                window.integration.showNotification(errors, 'warning');
            }
        }
    }

    /**
     * Handle authentication errors
     */
    handleAuthError() {
        const message = 'Your session has expired. Please log in again.';
        
        if (window.integration) {
            window.integration.showNotification(message, 'error');
        }

        this.logError(new Error('Authentication failed'), { type: 'auth' });

        // Redirect to login after delay
        setTimeout(() => {
            const currentPage = window.location.pathname;
            if (currentPage.includes('admin')) {
                window.location.href = 'admin-login.html';
            } else if (currentPage.includes('client')) {
                window.location.href = 'client-login.html';
            }
        }, 2000);
    }
}

/**
 * User Feedback Manager
 */
class FeedbackManager {
    constructor() {
        this.setupFeedbackWidget();
    }

    /**
     * Setup feedback widget
     */
    setupFeedbackWidget() {
        // Create feedback button
        const feedbackBtn = document.createElement('button');
        feedbackBtn.id = 'feedbackBtn';
        feedbackBtn.className = 'feedback-btn';
        feedbackBtn.innerHTML = '<i class="fas fa-comment-dots"></i>';
        feedbackBtn.title = 'Send Feedback';
        feedbackBtn.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
            z-index: 1044;
            transition: all 0.3s ease;
            font-size: 1.5rem;
        `;

        feedbackBtn.addEventListener('click', () => this.showFeedbackModal());
        feedbackBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        feedbackBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });

        document.body.appendChild(feedbackBtn);
    }

    /**
     * Show feedback modal
     */
    showFeedbackModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-custom show';
        modal.innerHTML = `
            <div class="modal-content-custom">
                <div class="modal-header-custom">
                    <h3>Send Us Feedback</h3>
                    <button class="modal-close" onclick="this.closest('.modal-custom').remove()">×</button>
                </div>
                <form id="feedbackForm">
                    <div class="form-group-custom">
                        <label for="feedbackType">Feedback Type</label>
                        <select id="feedbackType" class="form-control-custom" required>
                            <option value="">Select type...</option>
                            <option value="bug">Bug Report</option>
                            <option value="feature">Feature Request</option>
                            <option value="improvement">Improvement Suggestion</option>
                            <option value="general">General Feedback</option>
                        </select>
                    </div>
                    <div class="form-group-custom">
                        <label for="feedbackMessage">Your Feedback</label>
                        <textarea id="feedbackMessage" class="form-control-custom" rows="5" required 
                            placeholder="Tell us what you think..."></textarea>
                    </div>
                    <div class="form-group-custom">
                        <label for="feedbackEmail">Email (optional)</label>
                        <input type="email" id="feedbackEmail" class="form-control-custom" 
                            placeholder="your@email.com">
                    </div>
                    <button type="submit" class="btn-primary-custom" style="width: 100%;">
                        <i class="fas fa-paper-plane me-2"></i>Send Feedback
                    </button>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Handle form submission
        document.getElementById('feedbackForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitFeedback({
                type: document.getElementById('feedbackType').value,
                message: document.getElementById('feedbackMessage').value,
                email: document.getElementById('feedbackEmail').value,
                page: window.location.pathname,
                timestamp: new Date().toISOString()
            });
            modal.remove();
        });

        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    /**
     * Submit feedback
     */
    submitFeedback(feedback) {
        // Store feedback locally (in production, send to server)
        try {
            const storedFeedback = JSON.parse(localStorage.getItem('userFeedback') || '[]');
            storedFeedback.push(feedback);
            localStorage.setItem('userFeedback', JSON.stringify(storedFeedback));

            if (window.integration) {
                window.integration.showNotification(
                    'Thank you for your feedback! We appreciate your input.',
                    'success'
                );
            }

            console.log('Feedback submitted:', feedback);
        } catch (error) {
            console.error('Failed to store feedback:', error);
            if (window.integration) {
                window.integration.showNotification(
                    'Failed to submit feedback. Please try again.',
                    'error'
                );
            }
        }
    }
}

// Initialize error handler and feedback manager
document.addEventListener('DOMContentLoaded', () => {
    window.errorHandler = new ErrorHandler();
    window.feedbackManager = new FeedbackManager();
});
