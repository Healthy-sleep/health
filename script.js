// ========================================
// SomniCare - Main JavaScript
// Testimonials Carousel & Interactions
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initTestimonialsCarousel();
    initSmoothScroll();
    initNavbarScroll();
    initAnimations();
});

// ========================================
// Testimonials Carousel
// ========================================
function initTestimonialsCarousel() {
    const track = document.getElementById('testimonialsTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (!track) return;

    // Clone cards for infinite scroll effect
    const cards = track.querySelectorAll('.testimonial-card');
    cards.forEach(card => {
        const clone = card.cloneNode(true);
        track.appendChild(clone);
    });

    let isScrolling = false;
    let scrollSpeed = 0.5;
    let animationId = null;
    let currentPosition = 0;
    const cardWidth = 380 + 24; // card width + gap
    const totalWidth = cardWidth * cards.length;

    // Manual scroll with buttons
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            scrollToPosition(currentPosition - cardWidth);
        });

        nextBtn.addEventListener('click', () => {
            scrollToPosition(currentPosition + cardWidth);
        });
    }

    function scrollToPosition(targetPosition) {
        currentPosition = targetPosition;

        // Reset for infinite loop effect
        if (currentPosition >= totalWidth) {
            currentPosition = 0;
        } else if (currentPosition < 0) {
            currentPosition = totalWidth - cardWidth;
        }

        track.style.transform = `translateX(-${currentPosition}px)`;
        track.style.transition = 'transform 0.5s ease';
    }

    // Pause on hover
    const testimonialsSection = document.querySelector('.testimonials');
    if (testimonialsSection) {
        testimonialsSection.addEventListener('mouseenter', () => {
            track.style.animationPlayState = 'paused';
        });

        testimonialsSection.addEventListener('mouseleave', () => {
            track.style.animationPlayState = 'running';
        });
    }

    // Touch/Swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        track.style.animationPlayState = 'paused';
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        track.style.animationPlayState = 'running';
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - scroll right
                scrollToPosition(currentPosition + cardWidth);
            } else {
                // Swipe right - scroll left
                scrollToPosition(currentPosition - cardWidth);
            }
        }
    }
}

// ========================================
// Smooth Scroll for Navigation Links
// ========================================
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                e.preventDefault();

                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// Navbar Scroll Effect
// ========================================
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add/remove scrolled class
        if (currentScroll > 50) {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }

        // Hide/show on scroll direction
        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });

    // Smooth transition for navbar
    navbar.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
}

// ========================================
// Scroll Animations
// ========================================
function initAnimations() {
    const animatedElements = document.querySelectorAll('.benefit-card, .ingredient-card, .policy-card, .safety-item');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.5s ease ${index * 0.05}s, transform 0.5s ease ${index * 0.05}s`;
        observer.observe(el);
    });
}

// ========================================
// CTA Button Click Handler
// ========================================
document.querySelectorAll('.btn-primary, .nav-cta').forEach(btn => {
    btn.addEventListener('click', function(e) {
        // Check if it's a navigation link
        if (!this.closest('a')) {
            e.preventDefault();
            showNotification('Vielen Dank für Ihr Interesse! Der Shop ist bald verfügbar.');
        }
    });
});

// ========================================
// Notification System
// ========================================
function showNotification(message) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create new notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--color-gray-900);
        color: var(--color-white);
        padding: 1rem 1.5rem;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 1rem;
        z-index: 9999;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        animation: slideIn 0.3s ease;
    `;

    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Close button styles
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: var(--color-gray-400);
        font-size: 1.5rem;
        cursor: pointer;
        line-height: 1;
    `;

    // Close button functionality
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    });

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ========================================
// Statistics Counter Animation
// ========================================
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');

    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        const suffix = counter.textContent.replace(/[0-9]/g, '');
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + suffix;
            }
        };

        updateCounter();
    });
}

// Trigger counter animation when hero is visible
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            heroObserver.disconnect();
        }
    });
}, { threshold: 0.5 });

const hero = document.querySelector('.hero');
if (hero) {
    heroObserver.observe(hero);
}