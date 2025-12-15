/**
 * Notification Utility
 * Handles user notifications and feedback messages
 */

const NotificationUtil = {
  /**
   * Show success notification
   * @param {string} message - Success message
   * @param {number} duration - Display duration in milliseconds (default: 5000)
   */
  showSuccess(message, duration = 5000) {
    this.showNotification(message, 'success', duration);
  },

  /**
   * Show error notification
   * @param {string} message - Error message
   * @param {number} duration - Display duration in milliseconds (default: 7000)
   */
  showError(message, duration = 7000) {
    this.showNotification(message, 'error', duration);
  },

  /**
   * Show info notification
   * @param {string} message - Info message
   * @param {number} duration - Display duration in milliseconds (default: 5000)
   */
  showInfo(message, duration = 5000) {
    this.showNotification(message, 'info', duration);
  },

  /**
   * Show warning notification
   * @param {string} message - Warning message
   * @param {number} duration - Display duration in milliseconds (default: 6000)
   */
  showWarning(message, duration = 6000) {
    this.showNotification(message, 'warning', duration);
  },

  /**
   * Generic notification function
   * @param {string} message - Notification message
   * @param {string} type - Notification type (success, error, info, warning)
   * @param {number} duration - Display duration in milliseconds
   */
  showNotification(message, type = 'info', duration = 5000) {
    // Create notification container if it doesn't exist
    let container = document.getElementById('notification-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'notification-container';
      container.className = 'notification-container';
      document.body.appendChild(container);
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Add icon based on type
    const icon = this.getNotificationIcon(type);
    
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-${icon} notification-icon"></i>
        <span class="notification-message">${this.escapeHtml(message)}</span>
      </div>
      <button class="notification-close" aria-label="Close notification">
        <i class="fas fa-times"></i>
      </button>
    `;

    // Add to container
    container.appendChild(notification);

    // Trigger animation
    setTimeout(() => {
      notification.classList.add('notification-show');
    }, 10);

    // Setup close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      this.closeNotification(notification);
    });

    // Auto-close after duration
    if (duration > 0) {
      setTimeout(() => {
        this.closeNotification(notification);
      }, duration);
    }

    return notification;
  },

  /**
   * Close notification
   * @param {HTMLElement} notification - Notification element to close
   */
  closeNotification(notification) {
    notification.classList.remove('notification-show');
    notification.classList.add('notification-hide');
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  },

  /**
   * Get icon for notification type
   * @param {string} type - Notification type
   * @returns {string} - Font Awesome icon name
   */
  getNotificationIcon(type) {
    const icons = {
      'success': 'check-circle',
      'error': 'exclamation-circle',
      'info': 'info-circle',
      'warning': 'exclamation-triangle'
    };
    return icons[type] || 'info-circle';
  },

  /**
   * Escape HTML to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string} - Escaped text
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  /**
   * Show loading notification
   * @param {string} message - Loading message
   * @returns {HTMLElement} - Notification element
   */
  showLoading(message = 'Loading...') {
    const notification = this.showNotification(message, 'info', 0);
    notification.classList.add('notification-loading');
    
    // Add spinner
    const icon = notification.querySelector('.notification-icon');
    icon.className = 'fas fa-spinner fa-spin notification-icon';
    
    return notification;
  },

  /**
   * Update loading notification to success
   * @param {HTMLElement} notification - Loading notification element
   * @param {string} message - Success message
   */
  updateToSuccess(notification, message) {
    if (!notification) return;
    
    notification.className = 'notification notification-success notification-show';
    const icon = notification.querySelector('.notification-icon');
    const messageEl = notification.querySelector('.notification-message');
    
    icon.className = 'fas fa-check-circle notification-icon';
    messageEl.textContent = message;
    
    setTimeout(() => {
      this.closeNotification(notification);
    }, 3000);
  },

  /**
   * Update loading notification to error
   * @param {HTMLElement} notification - Loading notification element
   * @param {string} message - Error message
   */
  updateToError(notification, message) {
    if (!notification) return;
    
    notification.className = 'notification notification-error notification-show';
    const icon = notification.querySelector('.notification-icon');
    const messageEl = notification.querySelector('.notification-message');
    
    icon.className = 'fas fa-exclamation-circle notification-icon';
    messageEl.textContent = message;
    
    setTimeout(() => {
      this.closeNotification(notification);
    }, 5000);
  },

  /**
   * Clear all notifications
   */
  clearAll() {
    const container = document.getElementById('notification-container');
    if (container) {
      container.innerHTML = '';
    }
  },

  /**
   * Show confirmation dialog
   * @param {string} message - Confirmation message
   * @param {function} onConfirm - Callback on confirm
   * @param {function} onCancel - Callback on cancel
   */
  showConfirm(message, onConfirm, onCancel) {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'notification-modal-overlay';
    
    const modal = document.createElement('div');
    modal.className = 'notification-modal';
    modal.innerHTML = `
      <div class="notification-modal-content">
        <i class="fas fa-question-circle notification-modal-icon"></i>
        <p class="notification-modal-message">${this.escapeHtml(message)}</p>
        <div class="notification-modal-buttons">
          <button class="btn btn-secondary notification-modal-cancel">Cancel</button>
          <button class="btn btn-primary notification-modal-confirm">Confirm</button>
        </div>
      </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Trigger animation
    setTimeout(() => {
      overlay.classList.add('notification-modal-show');
    }, 10);
    
    // Setup buttons
    const confirmBtn = modal.querySelector('.notification-modal-confirm');
    const cancelBtn = modal.querySelector('.notification-modal-cancel');
    
    const closeModal = () => {
      overlay.classList.remove('notification-modal-show');
      setTimeout(() => {
        document.body.removeChild(overlay);
      }, 300);
    };
    
    confirmBtn.addEventListener('click', () => {
      closeModal();
      if (onConfirm) onConfirm();
    });
    
    cancelBtn.addEventListener('click', () => {
      closeModal();
      if (onCancel) onCancel();
    });
    
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal();
        if (onCancel) onCancel();
      }
    });
  }
};

// Create global shorthand functions
window.showSuccess = (message, duration) => NotificationUtil.showSuccess(message, duration);
window.showError = (message, duration) => NotificationUtil.showError(message, duration);
window.showInfo = (message, duration) => NotificationUtil.showInfo(message, duration);
window.showWarning = (message, duration) => NotificationUtil.showWarning(message, duration);
window.showLoading = (message) => NotificationUtil.showLoading(message);

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NotificationUtil;
}

// Make available globally
if (typeof window !== 'undefined') {
  window.NotificationUtil = NotificationUtil;
}

// Auto-inject styles if not already present
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('notification-styles')) {
      const style = document.createElement('style');
      style.id = 'notification-styles';
      style.textContent = `
        .notification-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 99999;
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-width: 400px;
        }

        .notification {
          background: white;
          padding: 16px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          opacity: 0;
          transform: translateX(400px);
          transition: all 0.3s ease;
          min-width: 300px;
        }

        .notification-show {
          opacity: 1;
          transform: translateX(0);
        }

        .notification-hide {
          opacity: 0;
          transform: translateX(400px);
        }

        .notification-content {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .notification-icon {
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        .notification-message {
          flex: 1;
          font-size: 0.95rem;
          line-height: 1.4;
        }

        .notification-close {
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
          padding: 4px;
          font-size: 1rem;
          transition: color 0.2s;
          flex-shrink: 0;
        }

        .notification-close:hover {
          color: #333;
        }

        .notification-success {
          border-left: 4px solid #28a745;
        }

        .notification-success .notification-icon {
          color: #28a745;
        }

        .notification-error {
          border-left: 4px solid #dc3545;
        }

        .notification-error .notification-icon {
          color: #dc3545;
        }

        .notification-info {
          border-left: 4px solid #17a2b8;
        }

        .notification-info .notification-icon {
          color: #17a2b8;
        }

        .notification-warning {
          border-left: 4px solid #ffc107;
        }

        .notification-warning .notification-icon {
          color: #ffc107;
        }

        .notification-loading {
          border-left: 4px solid #007bff;
        }

        .notification-loading .notification-icon {
          color: #007bff;
        }

        .notification-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999999;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .notification-modal-overlay.notification-modal-show {
          opacity: 1;
        }

        .notification-modal {
          background: white;
          border-radius: 12px;
          padding: 30px;
          max-width: 400px;
          width: 90%;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
          transform: scale(0.9);
          transition: transform 0.3s ease;
        }

        .notification-modal-overlay.notification-modal-show .notification-modal {
          transform: scale(1);
        }

        .notification-modal-content {
          text-align: center;
        }

        .notification-modal-icon {
          font-size: 3rem;
          color: #007bff;
          margin-bottom: 20px;
        }

        .notification-modal-message {
          font-size: 1.1rem;
          margin-bottom: 25px;
          color: #333;
          line-height: 1.5;
        }

        .notification-modal-buttons {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .notification-modal-buttons .btn {
          padding: 10px 24px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.2s;
        }

        .notification-modal-buttons .btn-primary {
          background: #007bff;
          color: white;
        }

        .notification-modal-buttons .btn-primary:hover {
          background: #0056b3;
        }

        .notification-modal-buttons .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .notification-modal-buttons .btn-secondary:hover {
          background: #545b62;
        }

        @media (max-width: 768px) {
          .notification-container {
            top: 10px;
            right: 10px;
            left: 10px;
            max-width: none;
          }

          .notification {
            min-width: auto;
          }
        }
      `;
      document.head.appendChild(style);
    }
  });
}
