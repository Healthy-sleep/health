// ========================================
// SOMNICARE - HIGH CONVERSION JAVASCRIPT
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initCountdown();
    initFAQ();
    initSmoothScroll();
    initNavbarScroll();
    initAnimations();
});

// ========================================
// COUNTDOWN TIMER
// ========================================
function initCountdown() {
    const countdownElement = document.getElementById('countdown');
    if (!countdownElement) return;

    // Set countdown to 4 hours, 23 minutes, 17 seconds from now
    let hours = 4;
    let minutes = 23;
    let seconds = 17;

    function updateCountdown() {
        seconds--;
        if (seconds < 0) {
            seconds = 59;
            minutes--;
        }
        if (minutes < 0) {
            minutes = 59;
            hours--;
        }
        if (hours < 0) {
            hours = 4;
            minutes = 23;
            seconds = 17;
        }

        const formatted =
            String(hours).padStart(2, '0') + ':' +
            String(minutes).padStart(2, '0') + ':' +
            String(seconds).padStart(2, '0');

        countdownElement.textContent = formatted;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ========================================
// FAQ ACCORDION
// ========================================
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all items
            faqItems.forEach(i => i.classList.remove('active'));

            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// ========================================
// SMOOTH SCROLL
// ========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// NAVBAR SCROLL EFFECT
// ========================================
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
        } else {
            navbar.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
        }

        lastScroll = currentScroll;
    });
}

// ========================================
// SCROLL ANIMATIONS
// ========================================
function initAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.pain-card, .result-card, .testimonial-card-conversion, .hiw-step').forEach(el => {
        observer.observe(el);
    });
}

// ========================================
// ADD TO CART / CHECKOUT
// ========================================
document.querySelector('.btn-checkout')?.addEventListener('click', function() {
    // Get selected package
    const selectedPackage = document.querySelector('input[name="package"]:checked');
    let packageName = '1-Monats-Packung';
    let price = '41,93€';

    if (selectedPackage) {
        const optionContent = selectedPackage.closest('.package-option').querySelector('.option-content');
        packageName = optionContent.querySelector('strong').textContent;
        price = optionContent.querySelector('.option-price').textContent;
    }

    // Show notification
    showNotification(`${packageName} (${price}) wurde zum Warenkorb hinzugefügt!`);
});

// ========================================
// NOTIFICATION SYSTEM
// ========================================
function showNotification(message) {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;

    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #059669;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 1rem;
        z-index: 9999;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
    `;

    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ========================================
// EXIT INTENT POPUP
// ========================================
let exitIntentShown = false;

document.addEventListener('mouseleave', function(e) {
    if (e.clientY < 10 && !exitIntentShown) {
        exitIntentShown = true;
        // Could show exit popup here
        console.log('Exit intent detected');
    }
});
