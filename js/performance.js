/**
 * Performance Optimization Module
 * Handles lazy loading, caching, and performance monitoring
 */

class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.setupImageOptimization();
        this.setupCaching();
        this.monitorPerformance();
        this.optimizeScripts();
    }

    /**
     * Setup lazy loading for images
     */
    setupLazyLoading() {
        // Use Intersection Observer for lazy loading
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        // Load image
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.add('loaded');
                            img.removeAttribute('data-src');
                        }
                        
                        // Load background image
                        if (img.dataset.bg) {
                            img.style.backgroundImage = `url(${img.dataset.bg})`;
                            img.removeAttribute('data-bg');
                        }
                        
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            // Observe all images with data-src or data-bg
            document.querySelectorAll('img[data-src], [data-bg]').forEach(img => {
                imageObserver.observe(img);
            });

            // Store observer for later use
            this.imageObserver = imageObserver;
        } else {
            // Fallback for browsers without Intersection Observer
            this.loadAllImages();
        }
    }

    /**
     * Load all images (fallback)
     */
    loadAllImages() {
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });

        document.querySelectorAll('[data-bg]').forEach(el => {
            el.style.backgroundImage = `url(${el.dataset.bg})`;
            el.removeAttribute('data-bg');
        });
    }

    /**
     * Setup image optimization
     */
    setupImageOptimization() {
        // Add loading="lazy" to images that don't have it
        document.querySelectorAll('img:not([loading])').forEach(img => {
            img.loading = 'lazy';
        });

        // Optimize image quality based on connection
        if ('connection' in navigator) {
            const connection = navigator.connection;
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                this.loadLowQualityImages();
            }
        }
    }

    /**
     * Load low quality images for slow connections
     */
    loadLowQualityImages() {
        document.querySelectorAll('img[data-src-low]').forEach(img => {
            if (img.dataset.srcLow) {
                img.dataset.src = img.dataset.srcLow;
            }
        });
    }

    /**
     * Setup caching strategy
     */
    setupCaching() {
        // Cache API responses
        this.cache = new Map();
        this.cacheExpiry = new Map();
        this.defaultCacheDuration = 5 * 60 * 1000; // 5 minutes
    }

    /**
     * Get from cache
     */
    getFromCache(key) {
        const expiry = this.cacheExpiry.get(key);
        
        if (expiry && Date.now() > expiry) {
            // Cache expired
            this.cache.delete(key);
            this.cacheExpiry.delete(key);
            return null;
        }
        
        return this.cache.get(key);
    }

    /**
     * Set in cache
     */
    setInCache(key, value, duration = this.defaultCacheDuration) {
        this.cache.set(key, value);
        this.cacheExpiry.set(key, Date.now() + duration);
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
        this.cacheExpiry.clear();
    }

    /**
     * Monitor performance
     */
    monitorPerformance() {
        if ('PerformanceObserver' in window) {
            // Monitor Largest Contentful Paint (LCP)
            try {
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                console.warn('LCP monitoring not supported');
            }

            // Monitor First Input Delay (FID)
            try {
                const fidObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach(entry => {
                        console.log('FID:', entry.processingStart - entry.startTime);
                    });
                });
                fidObserver.observe({ entryTypes: ['first-input'] });
            } catch (e) {
                console.warn('FID monitoring not supported');
            }

            // Monitor Cumulative Layout Shift (CLS)
            try {
                let clsScore = 0;
                const clsObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (!entry.hadRecentInput) {
                            clsScore += entry.value;
                        }
                    }
                    console.log('CLS:', clsScore);
                });
                clsObserver.observe({ entryTypes: ['layout-shift'] });
            } catch (e) {
                console.warn('CLS monitoring not supported');
            }
        }

        // Log page load time
        window.addEventListener('load', () => {
            const perfData = performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log('Page Load Time:', pageLoadTime + 'ms');

            // Store performance metrics
            this.storePerformanceMetrics({
                pageLoadTime,
                domContentLoaded: perfData.domContentLoadedEventEnd - perfData.navigationStart,
                firstPaint: this.getFirstPaint(),
                url: window.location.pathname,
                timestamp: new Date().toISOString()
            });
        });
    }

    /**
     * Get First Paint time
     */
    getFirstPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
        return firstPaint ? firstPaint.startTime : null;
    }

    /**
     * Store performance metrics
     */
    storePerformanceMetrics(metrics) {
        try {
            const storedMetrics = JSON.parse(localStorage.getItem('performanceMetrics') || '[]');
            storedMetrics.push(metrics);
            
            // Keep only last 50 metrics
            if (storedMetrics.length > 50) {
                storedMetrics.shift();
            }
            
            localStorage.setItem('performanceMetrics', JSON.stringify(storedMetrics));
        } catch (e) {
            console.error('Failed to store performance metrics:', e);
        }
    }

    /**
     * Optimize script loading
     */
    optimizeScripts() {
        // Defer non-critical scripts
        document.querySelectorAll('script[data-defer]').forEach(script => {
            script.defer = true;
        });

        // Preload critical resources
        this.preloadCriticalResources();
    }

    /**
     * Preload critical resources
     */
    preloadCriticalResources() {
        const criticalResources = [
            { href: 'css/bootstrap.min.css', as: 'style' },
            { href: 'css/styles.css', as: 'style' },
            { href: 'js/bootstrap.bundle.min.js', as: 'script' }
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            document.head.appendChild(link);
        });
    }

    /**
     * Prefetch next page
     */
    prefetchPage(url) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        document.head.appendChild(link);
    }

    /**
     * Debounce function for performance
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
     * Throttle function for performance
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
     * Request Idle Callback wrapper
     */
    requestIdleCallback(callback) {
        if ('requestIdleCallback' in window) {
            return window.requestIdleCallback(callback);
        } else {
            return setTimeout(callback, 1);
        }
    }

    /**
     * Optimize animations
     */
    optimizeAnimations() {
        // Reduce motion for users who prefer it
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--animation-duration', '0.01ms');
            
            // Disable animations
            document.querySelectorAll('[class*="animate"]').forEach(el => {
                el.style.animation = 'none';
            });
        }
    }

    /**
     * Get performance report
     */
    getPerformanceReport() {
        const metrics = JSON.parse(localStorage.getItem('performanceMetrics') || '[]');
        
        if (metrics.length === 0) {
            return { message: 'No performance data available' };
        }

        const avgLoadTime = metrics.reduce((sum, m) => sum + m.pageLoadTime, 0) / metrics.length;
        const avgDomContentLoaded = metrics.reduce((sum, m) => sum + m.domContentLoaded, 0) / metrics.length;

        return {
            totalPageViews: metrics.length,
            averageLoadTime: Math.round(avgLoadTime),
            averageDomContentLoaded: Math.round(avgDomContentLoaded),
            recentMetrics: metrics.slice(-10)
        };
    }
}

// Initialize performance optimizer
document.addEventListener('DOMContentLoaded', () => {
    window.performanceOptimizer = new PerformanceOptimizer();
});

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceOptimizer;
}
