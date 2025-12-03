// ============================================
// YAQOOB'S LUXURY FASHION - INTERACTIVE FEATURES
// ============================================

// === SMOOTH SCROLL WITH PARALLAX ===
let lastScrollY = window.scrollY;
let ticking = false;

function updateParallax() {
  const scrollY = window.scrollY;

  // Parallax effect on hero background
  const heroBackground = document.querySelector('.hero-background');
  if (heroBackground) {
    const parallaxSpeed = 0.5;
    heroBackground.style.transform = `translateY(${scrollY * parallaxSpeed}px)`;
  }

  // Update navbar on scroll
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    if (scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  ticking = false;
}

function requestTick() {
  if (!ticking) {
    requestAnimationFrame(updateParallax);
    ticking = true;
  }
}

window.addEventListener('scroll', requestTick);

// === INTERSECTION OBSERVER FOR SCROLL ANIMATIONS ===
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -100px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      // Optional: unobserve after revealing for performance
      // scrollObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all elements with scroll-reveal class
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.scroll-reveal');
  revealElements.forEach(el => scrollObserver.observe(el));
}

// === LUXURY CURSOR TRAIL (OPTIONAL) ===
let cursorTrail = [];
const trailLength = 8;

function createCursorTrail() {
  const trail = document.createElement('div');
  trail.className = 'cursor-trail';
  trail.style.cssText = `
    position: fixed;
    width: 8px;
    height: 8px;
    background: var(--color-gold);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.3s ease;
  `;
  document.body.appendChild(trail);
  return trail;
}

function initCursorTrail() {
  // Only enable on desktop
  if (window.innerWidth < 1024) return;

  for (let i = 0; i < trailLength; i++) {
    cursorTrail.push(createCursorTrail());
  }

  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateTrail() {
    currentX += (mouseX - currentX) * 0.1;
    currentY += (mouseY - currentY) * 0.1;

    cursorTrail.forEach((trail, index) => {
      const delay = index * 0.05;
      const x = currentX - (index * 2);
      const y = currentY - (index * 2);
      const opacity = 1 - (index / trailLength);
      const scale = 1 - (index / trailLength) * 0.5;

      trail.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
      trail.style.opacity = opacity * 0.6;
    });

    requestAnimationFrame(animateTrail);
  }

  animateTrail();
}

// === IMAGE LAZY LOADING WITH FADE ===
function initLazyLoading() {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;

        // Load image
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }

        // Add loaded class for fade-in effect
        img.addEventListener('load', () => {
          img.classList.add('loaded');
        });

        imageObserver.unobserve(img);
      }
    });
  });

  const lazyImages = document.querySelectorAll('img[data-src]');
  lazyImages.forEach(img => imageObserver.observe(img));
}

// === SMOOTH SCROLL FOR ANCHOR LINKS ===
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');

      // Skip if it's just "#"
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);

      if (target) {
        const offsetTop = target.offsetTop - 80; // Account for fixed navbar

        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

// === PRODUCT CARD INTERACTIONS ===
function initProductCards() {
  const productCards = document.querySelectorAll('.product-card');

  productCards.forEach(card => {
    card.addEventListener('mouseenter', function () {
      this.style.zIndex = '10';
    });

    card.addEventListener('mouseleave', function () {
      this.style.zIndex = '1';
    });
  });
}

// === STAGGER ANIMATION FOR GRIDS ===
function staggerAnimation(selector, delay = 100) {
  const elements = document.querySelectorAll(selector);

  elements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add('revealed');
    }, index * delay);
  });
}

// === NAVBAR MOBILE MENU ===
function initMobileMenu() {
  const menuToggle = document.querySelector('.mobile-menu-btn');
  const navbarMenu = document.querySelector('.navbar-menu');
  const navLinks = document.querySelectorAll('.navbar-link');

  if (menuToggle && navbarMenu) {
    // Toggle menu
    menuToggle.addEventListener('click', () => {
      navbarMenu.classList.toggle('active');
      menuToggle.classList.toggle('active');

      // Prevent scrolling when menu is open
      if (navbarMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navbarMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }
}

// === NEWSLETTER FORM ===
function initNewsletter() {
  const form = document.querySelector('.newsletter-form');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = form.querySelector('input[type="email"]').value;

      // Show success message (you can customize this)
      const successMsg = document.createElement('div');
      successMsg.className = 'newsletter-success';
      successMsg.textContent = 'Thank you for subscribing!';
      successMsg.style.cssText = `
        color: var(--color-gold);
        margin-top: var(--space-sm);
        font-weight: var(--font-weight-medium);
        animation: fadeIn 0.5s ease;
      `;

      form.appendChild(successMsg);
      form.querySelector('input[type="email"]').value = '';

      setTimeout(() => {
        successMsg.remove();
      }, 3000);
    });
  }
}

// === INITIALIZE ALL FEATURES ===
document.addEventListener('DOMContentLoaded', () => {
  // Core features
  initScrollAnimations();
  initSmoothScroll();
  initLazyLoading();
  initProductCards();
  initMobileMenu();
  initNewsletter();

  // Optional luxury cursor trail (comment out if too much)
  // initCursorTrail();

  // Add initial animations
  setTimeout(() => {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'translateY(0)';
    }
  }, 100);
});

// === PAGE VISIBILITY CHANGE ===
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause animations when tab is hidden
    document.body.style.animationPlayState = 'paused';
  } else {
    // Resume animations when tab is visible
    document.body.style.animationPlayState = 'running';
  }
});

// === PERFORMANCE OPTIMIZATION ===
// Reduce motion for users who prefer it
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.setProperty('--transition-luxury', '0.1s ease');
  document.documentElement.style.setProperty('--transition-slow', '0.2s ease');
  document.documentElement.style.setProperty('--transition-base', '0.15s ease');
}
