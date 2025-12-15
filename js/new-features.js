/**
 * New Features JavaScript Functions
 * Add these functions to your js/scripts.js or include this file separately
 */

// ============================================
// Service Selector Functions
// ============================================
function selectService(service) {
    document.querySelectorAll('.service-option').forEach(el => {
        el.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    localStorage.setItem('selectedService', service);
}

function proceedWithSelection() {
    const selected = localStorage.setItem('selectedService');
    if (selected) {
        window.location.href = `cost-calculator.html?service=${selected}`;
    } else {
        alert('Please select a service type first');
    }
}

// ============================================
// Live Statistics Counter Animation
// ============================================
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number, .live-counter');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                        counter.classList.add('counted');
                    }
                };
                updateCounter();
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

// ============================================
// Skill Bars Animation
// ============================================
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    skillBars.forEach(bar => observer.observe(bar));
}

// ============================================
// Project Map Info Display
// ============================================
function showProjectInfo(location) {
    const projectInfo = {
        'addis': {
            name: 'Addis Ababa Commercial Tower',
            type: 'Commercial',
            year: '2023',
            size: '15,000 sqm',
            value: '250M ETB'
        },
        'bahir': {
            name: 'Adama Residential Complex',
            type: 'Residential',
            year: '2022',
            size: '8,500 sqm',
            value: '120M ETB'
        },
        'hawassa': {
            name: 'Chaka Mixed-Use Development',
            type: 'Mixed-Use',
            year: '2023',
            size: '12,000 sqm',
            value: '180M ETB'
        },
        'dire': {
            name: 'Dire Dawa Infrastructure Project',
            type: 'Infrastructure',
            year: '2021',
            size: '25,000 sqm',
            value: '350M ETB'
        },
        'mekelle': {
            name: 'Sheger General Hospital',
            type: 'Healthcare',
            year: '2024',
            size: '18,000 sqm',
            value: '420M ETB'
        }
    };
    
    const info = projectInfo[location];
    if (info) {
        document.getElementById('project-info').innerHTML = `
            <div class="animate__animated animate__fadeIn">
                <h5 class="fw-bold text-primary">${info.name}</h5>
                <hr>
                <p class="mb-2"><i class="fas fa-building text-primary me-2"></i><strong>Type:</strong> ${info.type}</p>
                <p class="mb-2"><i class="fas fa-calendar-check text-success me-2"></i><strong>Completed:</strong> ${info.year}</p>
                <p class="mb-2"><i class="fas fa-ruler-combined text-info me-2"></i><strong>Size:</strong> ${info.size}</p>
                <p class="mb-3"><i class="fas fa-money-bill-wave text-warning me-2"></i><strong>Value:</strong> ${info.value}</p>
                <a href="#sec-4" class="btn btn-sm btn-primary w-100">
                    <i class="fas fa-images me-2"></i>View Gallery
                </a>
            </div>
        `;
    }
}

// ============================================
// FAB Menu Toggle
// ============================================
function toggleFAB() {
    const options = document.getElementById('fabOptions');
    const mainButton = document.querySelector('.fab-main i');
    
    if (options.classList.contains('show')) {
        options.classList.remove('show');
        mainButton.style.transform = 'rotate(0deg)';
    } else {
        options.classList.add('show');
        mainButton.style.transform = 'rotate(45deg)';
    }
}

// Close FAB when clicking outside
document.addEventListener('click', (e) => {
    const fabMenu = document.querySelector('.fab-menu');
    if (fabMenu && !fabMenu.contains(e.target)) {
        const options = document.getElementById('fabOptions');
        if (options && options.classList.contains('show')) {
            toggleFAB();
        }
    }
});

// ============================================
// Financing Calculator
// ============================================
function updateDownPayment(value) {
    document.getElementById('downPaymentValue').textContent = value + '%';
}

function calculateFinancing() {
    const cost = parseFloat(document.getElementById('projectCost').value);
    const downPaymentPercent = parseFloat(document.getElementById('downPayment').value);
    const term = parseInt(document.getElementById('loanTerm').value);
    
    if (!cost || cost < 100000) {
        alert('Please enter a valid project cost (minimum 100,000 ETB)');
        return;
    }
    
    const downPayment = cost * (downPaymentPercent / 100);
    const loanAmount = cost - downPayment;
    const annualRate = 0.12; // 12% annual interest rate
    const monthlyRate = annualRate / 12;
    const numPayments = term * 12;
    
    // Calculate monthly payment using amortization formula
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                          (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    const totalPayment = monthlyPayment * numPayments;
    const totalInterest = totalPayment - loanAmount;
    
    // Display results
    document.getElementById('monthlyPayment').textContent = 
        Math.round(monthlyPayment).toLocaleString() + ' ETB';
    document.getElementById('loanAmount').textContent = 
        Math.round(loanAmount).toLocaleString() + ' ETB';
    document.getElementById('totalInterest').textContent = 
        Math.round(totalInterest).toLocaleString() + ' ETB';
    
    document.getElementById('financingResult').style.display = 'block';
    
    // Smooth scroll to result
    document.getElementById('financingResult').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest' 
    });
}

// ============================================
// Scroll Progress Indicator
// ============================================
function updateScrollProgress() {
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / scrollHeight) * 100;
        scrollProgress.style.width = scrolled + '%';
    }
}

window.addEventListener('scroll', updateScrollProgress);

// ============================================
// Dark Mode Toggle
// ============================================
function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        // Check for saved preference
        const darkMode = localStorage.getItem('darkMode');
        if (darkMode === 'enabled') {
            document.body.classList.add('dark-mode');
            darkModeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
        }
        
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const icon = darkModeToggle.querySelector('i');
            
            if (document.body.classList.contains('dark-mode')) {
                icon.classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem('darkMode', 'enabled');
            } else {
                icon.classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem('darkMode', 'disabled');
            }
        });
    }
}

// ============================================
// Social Proof Notifications
// ============================================
function showSocialProof() {
    const notifications = [
        { name: 'Abebe K.', action: 'requested a quote', time: '2 minutes ago', initials: 'AK' },
        { name: 'Sara M.', action: 'started a project', time: '5 minutes ago', initials: 'SM' },
        { name: 'John D.', action: 'downloaded a brochure', time: '8 minutes ago', initials: 'JD' },
        { name: 'Tigist A.', action: 'used cost calculator', time: '12 minutes ago', initials: 'TA' },
        { name: 'Michael B.', action: 'viewed project gallery', time: '15 minutes ago', initials: 'MB' }
    ];
    
    let index = 0;
    
    function displayNotification() {
        const notification = notifications[index];
        const socialProof = document.getElementById('socialProof');
        
        if (socialProof) {
            socialProof.innerHTML = `
                <div class="social-proof-avatar">${notification.initials}</div>
                <div>
                    <strong>${notification.name}</strong> ${notification.action}<br>
                    <small class="text-muted">${notification.time}</small>
                </div>
            `;
            socialProof.classList.add('show');
            
            setTimeout(() => {
                socialProof.classList.remove('show');
            }, 5000);
            
            index = (index + 1) % notifications.length;
        }
    }
    
    // Show first notification after 3 seconds
    setTimeout(displayNotification, 3000);
    
    // Show subsequent notifications every 10 seconds
    setInterval(displayNotification, 10000);
}

// ============================================
// Search Overlay Functions
// ============================================
function openSearch() {
    const searchOverlay = document.getElementById('searchOverlay');
    if (searchOverlay) {
        searchOverlay.classList.add('active');
        document.getElementById('searchInput').focus();
    }
}

function closeSearch() {
    const searchOverlay = document.getElementById('searchOverlay');
    if (searchOverlay) {
        searchOverlay.classList.remove('active');
        document.getElementById('searchInput').value = '';
        document.getElementById('searchResults').innerHTML = '';
    }
}

// Close search on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeSearch();
    }
});

// ============================================
// Timeline Step Details
// ============================================
function showTimelineDetails(step) {
    const steps = document.querySelectorAll('.timeline-step');
    steps.forEach(s => s.classList.remove('active'));
    event.currentTarget.classList.add('active');
    
    // You can add more detailed information display here
    console.log('Timeline step', step, 'selected');
}

// ============================================
// Toast Notifications
// ============================================
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type} show`;
    toast.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} me-2"></i>
            <div>${message}</div>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// ============================================
// Newsletter Popup (Delayed)
// ============================================
function showNewsletterPopup() {
    const popup = document.querySelector('.newsletter-popup');
    if (popup && !localStorage.getItem('newsletterShown')) {
        setTimeout(() => {
            popup.classList.add('show');
            localStorage.setItem('newsletterShown', 'true');
        }, 30000); // Show after 30 seconds
    }
}

function closeNewsletterPopup() {
    const popup = document.querySelector('.newsletter-popup');
    if (popup) {
        popup.classList.remove('show');
    }
}

// ============================================
// Initialize All Features on Page Load
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing new features...');
    
    // Initialize counters
    animateCounters();
    
    // Initialize skill bars
    animateSkillBars();
    
    // Initialize dark mode
    initDarkMode();
    
    // Show social proof notifications
    showSocialProof();
    
    // Show newsletter popup (delayed)
    showNewsletterPopup();
    
    // Initialize scroll progress
    updateScrollProgress();
    
    console.log('All features initialized successfully!');
});

// ============================================
// Smooth Scroll for Anchor Links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '#!') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ============================================
// Lazy Loading Images
// ============================================
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
lazyLoadImages();

console.log('New features script loaded successfully!');
