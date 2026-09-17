 document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. INTERSECTION OBSERVER FOR CONTAINER & SECTION SLIDING
       ========================================================================== */
    const slideElements = document.querySelectorAll('.slide-on-scroll');

    const slideObserverOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.15
    };

    if ('IntersectionObserver' in window) {
        const slideObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, slideObserverOptions);

        slideElements.forEach(el => slideObserver.observe(el));
    } else {
        slideElements.forEach(el => el.classList.add('is-visible'));
    }

    /* ==========================================================================
       2. HERO CAROUSEL ANIMATION ENGINE
       ========================================================================== */
    const track = document.getElementById('heroTrack');
    const slides = Array.from(document.querySelectorAll('.hero-slide'));
    const dots = Array.from(document.querySelectorAll('.dot'));
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const progressFill = document.getElementById('progressFill');
    const heroSection = document.querySelector('.hero-slider-section');

    let currentIndex = 0;
    const totalSlides = slides.length;
    const slideDuration = 6000;
    let slideTimer = null;
    let progressTimer = null;
    let startTime = 0;

    function goToSlide(index) {
        if (!track || totalSlides === 0) return;

        if (index < 0) {
            index = totalSlides - 1;
        } else if (index >= totalSlides) {
            index = 0;
        }

        currentIndex = index;
        track.style.transform = `translate3d(-${currentIndex * 100}%, 0, 0)`;

        slides.forEach((slide, i) => {
            slide.classList.toggle('is-active', i === currentIndex);
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('is-active', i === currentIndex);
        });

        startSlideTimer();
    }

    function startSlideTimer() {
        stopSlideTimer();
        startTime = Date.now();

        progressTimer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const percentage = Math.min((elapsed / slideDuration) * 100, 100);
            if (progressFill) progressFill.style.width = `${percentage}%`;
        }, 25);

        slideTimer = setTimeout(() => {
            goToSlide(currentIndex + 1);
        }, slideDuration);
    }

    function stopSlideTimer() {
        if (slideTimer) clearTimeout(slideTimer);
        if (progressTimer) clearInterval(progressTimer);
        if (progressFill) progressFill.style.width = '0%';
    }

    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => goToSlide(i));
    });

    if (heroSection) {
        heroSection.addEventListener('mouseenter', stopSlideTimer);
        heroSection.addEventListener('mouseleave', startSlideTimer);
    }

    // Touch Swipe Support for Hero
    let touchStartX = 0;
    let isTouching = false;

    if (track) {
        track.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            isTouching = true;
            stopSlideTimer();
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            if (!isTouching) return;
            const diffX = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diffX) > 45) {
                if (diffX > 0) {
                    goToSlide(currentIndex + 1);
                } else {
                    goToSlide(currentIndex - 1);
                }
            } else {
                startSlideTimer();
            }
            isTouching = false;
        }, { passive: true });
    }

    goToSlide(0);

    /* ==========================================================================
       3. SERVICES INTERACTIVE TAB SLIDING
       ========================================================================== */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;

            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const activePanel = document.getElementById(target);
            if (!activePanel) return;
            activePanel.classList.add('active');

            // Reset and trigger slide animations on active elements
            const leftEl = activePanel.querySelector('.tab-img-box');
            const rightEl = activePanel.querySelector('.tab-info-box');
            if (!leftEl || !rightEl) return;

            leftEl.style.animation = 'none';
            rightEl.style.animation = 'none';
            void leftEl.offsetWidth; // Trigger reflow
            leftEl.style.animation = '';
            rightEl.style.animation = '';
        });
    });
});

//Number counting animation
document.addEventListener('DOMContentLoaded', () => {
    const statsBanner = document.querySelector('.stats-banner');
    const counters = document.querySelectorAll('.stat-counter');
    let animationFrames = [];

    // Deceleration easing calculation
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    function cancelActiveAnimations() {
        animationFrames.forEach(id => cancelAnimationFrame(id));
        animationFrames = [];
    }

    function resetCounters() {
        cancelActiveAnimations();
        counters.forEach(counter => {
            counter.textContent = '0';
        });
    }

    function startCounting() {
        cancelActiveAnimations();

        counters.forEach((counter, index) => {
            const target = parseInt(counter.dataset.target, 10);
            const isComma = counter.dataset.format === 'comma';
            const duration = 1800; // 1.8 seconds duration
            const startTime = performance.now();

            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = easeOutCubic(progress);
                const currentVal = Math.floor(easedProgress * target);

                counter.textContent = isComma ? currentVal.toLocaleString('en-US') : currentVal;

                if (progress < 1) {
                    animationFrames[index] = requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = isComma ? target.toLocaleString('en-US') : target;
                }
            };

            animationFrames[index] = requestAnimationFrame(updateCounter);
        });
    }

    // IntersectionObserver triggers every time the section enters or leaves view
    if (statsBanner) {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        statsBanner.classList.add('is-visible');
                        startCounting();
                    } else {
                        statsBanner.classList.remove('is-visible');
                        resetCounters();
                    }
                });
            }, {
                threshold: 0.25,
                rootMargin: '0px 0px -40px 0px'
            });

            observer.observe(statsBanner);
        } else {
            statsBanner.classList.add('is-visible');
            startCounting();
        }
    }
});

/* ============================================================
   SAIDPL TESTIMONIAL CAROUSEL
   Scoped JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    const track =
        document.getElementById(
            'saidplTestimonialTrack'
        );

    const items =
        document.querySelectorAll(
            '.saidpl-testimonial-item'
        );

    const prevButton =
        document.getElementById(
            'saidplTestimonialPrev'
        );

    const nextButton =
        document.getElementById(
            'saidplTestimonialNext'
        );

    const currentCounter =
        document.getElementById(
            'saidplTestimonialCurrent'
        );

    const progress =
        document.getElementById(
            'saidplTestimonialProgress'
        );


    /* ========================================================
       SAFETY CHECK
       ======================================================== */

    if (
        !track ||
        !items.length ||
        !prevButton ||
        !nextButton
    ) {
        return;
    }


    /* ========================================================
       VARIABLES
       ======================================================== */

    let currentIndex = 0;

    const totalItems = items.length;

    let autoplayTimer = null;

    let touchStartX = 0;

    let touchEndX = 0;


    /* ========================================================
       UPDATE CAROUSEL
       ======================================================== */

    function updateCarousel() {

        const offset =
            currentIndex * 100;

        track.style.transform =
            `translate3d(-${offset}%, 0, 0)`;


        /* Counter */

        if (currentCounter) {

            currentCounter.textContent =
                String(currentIndex + 1)
                    .padStart(2, '0');

        }


        /* Progress */

        if (progress) {

            const progressPosition =
                currentIndex * 100;

            progress.style.transform =
                `translateX(${progressPosition}%)`;

        }


        /* Accessibility */

        items.forEach((item, index) => {

            item.setAttribute(
                'aria-hidden',
                index !== currentIndex
            );

        });

    }


    /* ========================================================
       NEXT
       ======================================================== */

    function nextTestimonial() {

        currentIndex++;

        if (currentIndex >= totalItems) {
            currentIndex = 0;
        }

        updateCarousel();

    }


    /* ========================================================
       PREVIOUS
       ======================================================== */

    function previousTestimonial() {

        currentIndex--;

        if (currentIndex < 0) {
            currentIndex = totalItems - 1;
        }

        updateCarousel();

    }


    /* ========================================================
       BUTTON EVENTS
       ======================================================== */

    nextButton.addEventListener(
        'click',
        () => {

            nextTestimonial();

            restartAutoplay();

        }
    );


    prevButton.addEventListener(
        'click',
        () => {

            previousTestimonial();

            restartAutoplay();

        }
    );


    /* ========================================================
       AUTOPLAY
       ======================================================== */

    function startAutoplay() {

        if (totalItems <= 1) {
            return;
        }

        autoplayTimer =
            setInterval(() => {

                nextTestimonial();

            }, 6000);

    }


    function stopAutoplay() {

        if (autoplayTimer) {

            clearInterval(
                autoplayTimer
            );

            autoplayTimer = null;

        }

    }


    function restartAutoplay() {

        stopAutoplay();

        startAutoplay();

    }


    /* ========================================================
       PAUSE ON HOVER
       ======================================================== */

    const carousel =
        document.querySelector(
            '.saidpl-testimonial-card'
        );


    if (carousel) {

        carousel.addEventListener(
            'mouseenter',
            stopAutoplay
        );


        carousel.addEventListener(
            'mouseleave',
            startAutoplay
        );

    }


    /* ========================================================
       TOUCH / SWIPE SUPPORT
       ======================================================== */

    track.addEventListener(
        'touchstart',
        event => {

            touchStartX =
                event.changedTouches[0].screenX;

            stopAutoplay();

        },
        {
            passive: true
        }
    );


    track.addEventListener(
        'touchend',
        event => {

            touchEndX =
                event.changedTouches[0].screenX;

            handleSwipe();

            startAutoplay();

        },
        {
            passive: true
        }
    );


    function handleSwipe() {

        const swipeDistance =
            touchEndX - touchStartX;


        /* Swipe left */

        if (swipeDistance < -50) {

            nextTestimonial();

        }


        /* Swipe right */

        if (swipeDistance > 50) {

            previousTestimonial();

        }

    }


    /* ========================================================
       KEYBOARD NAVIGATION
       ======================================================== */

    document.addEventListener(
        'keydown',
        event => {

            const section =
                document.querySelector(
                    '.saidpl-testimonial-section'
                );

            if (!section) {
                return;
            }


            const rect =
                section.getBoundingClientRect();


            const isVisible =
                rect.top < window.innerHeight &&
                rect.bottom > 0;


            if (!isVisible) {
                return;
            }


            if (event.key === 'ArrowRight') {

                nextTestimonial();

                restartAutoplay();

            }


            if (event.key === 'ArrowLeft') {

                previousTestimonial();

                restartAutoplay();

            }

        }
    );


    /* ========================================================
       INITIALIZE
       ======================================================== */

    updateCarousel();

    startAutoplay();

});

