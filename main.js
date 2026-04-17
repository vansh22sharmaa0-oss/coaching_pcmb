// ===== PRELOADER =====
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hide');
            setTimeout(() => preloader.remove(), 500);
        }, 800);
    }
    // Trigger AOS animations
    initAOS();
    // Counter animation
    animateCounters();
});

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');

function handleNavScroll() {
    if (!navbar) return;
    if (navbar.classList.contains('scrolled') && !window.location.pathname.includes('index')) return;
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        // Only remove scrolled on index/home page
        const isHomePage = window.location.pathname === '/' ||
                          window.location.pathname.endsWith('index.html') ||
                          window.location.pathname.endsWith('/');
        if (isHomePage) {
            navbar.classList.remove('scrolled');
        }
    }
}

window.addEventListener('scroll', handleNavScroll);
handleNavScroll();

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        if (navOverlay) navOverlay.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            if (navOverlay) navOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu on overlay click
    if (navOverlay) {
        navOverlay.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
}

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===== BACK TO TOP =====
const backToTop = document.getElementById('backToTop');

if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== COUNTER ANIMATION =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;

                const updateCounter = () => {
                    current += step;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };

                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

// ===== AOS (Animate On Scroll) - Custom Implementation =====
function initAOS() {
    const elements = document.querySelectorAll('[data-aos]');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-aos-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, parseInt(delay));
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

// ===== TESTIMONIAL SLIDER =====
const testimonialTrack = document.getElementById('testimonialTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('testimonialDots');

if (testimonialTrack && prevBtn && nextBtn && dotsContainer) {
    const cards = testimonialTrack.querySelectorAll('.testimonial-card');
    let currentSlide = 0;
    const totalSlides = cards.length;

    // Create dots
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }

    function goToSlide(index) {
        currentSlide = index;
        testimonialTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        updateDots();
    }

    function updateDots() {
        dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        goToSlide(currentSlide);
    });

    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        goToSlide(currentSlide);
    });

    // Auto-slide every 5 seconds
    let autoSlide = setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        goToSlide(currentSlide);
    }, 5000);

    // Pause on hover
    testimonialTrack.addEventListener('mouseenter', () => clearInterval(autoSlide));
    testimonialTrack.addEventListener('mouseleave', () => {
        autoSlide = setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            goToSlide(currentSlide);
        }, 5000);
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    testimonialTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    testimonialTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                currentSlide = (currentSlide + 1) % totalSlides;
            } else {
                currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            }
            goToSlide(currentSlide);
        }
    }, { passive: true });
}

// ===== GALLERY FILTER =====
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = '';
                    item.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Fade in animation for gallery
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
    }
`;
document.head.appendChild(style);

// ===== ACTIVE NAV LINK HIGHLIGHT =====
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}` ||
                    link.getAttribute('href') === `index.html#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNav);
