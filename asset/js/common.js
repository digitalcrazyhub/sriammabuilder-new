(() => {
    'use strict';

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function createHeroSlider({ track, slides, dots, section, interval = 5000 }) {
        const slideItems = [...slides];
        const dotItems = [...dots];
        if (!track || !slideItems.length) return null;

        let currentIndex = 0;
        let timer = null;

        const stop = () => {
            if (timer) window.clearInterval(timer);
            timer = null;
        };

        const goTo = (index) => {
            currentIndex = (index + slideItems.length) % slideItems.length;
            track.style.transform = `translate3d(-${currentIndex * 100}%, 0, 0)`;

            slideItems.forEach((slide, slideIndex) => {
                const isActive = slideIndex === currentIndex;
                slide.classList.toggle('is-active', isActive);
                slide.setAttribute('aria-hidden', String(!isActive));
            });
            dotItems.forEach((dot, dotIndex) => {
                const isActive = dotIndex === currentIndex;
                dot.classList.toggle('is-active', isActive);
                dot.setAttribute('aria-current', String(isActive));
            });
        };

        const start = () => {
            stop();
            if (slideItems.length > 1 && !reducedMotion.matches) {
                timer = window.setInterval(() => goTo(currentIndex + 1), interval);
            }
        };

        dotItems.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goTo(index);
                start();
            });
        });

        if (section) {
            section.addEventListener('mouseenter', stop);
            section.addEventListener('mouseleave', start);
            section.addEventListener('focusin', stop);
            section.addEventListener('focusout', start);
        }

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) stop();
            else start();
        });

        goTo(0);
        start();
        return { goTo, next: () => goTo(currentIndex + 1), previous: () => goTo(currentIndex - 1), start, stop };
    }

    function revealOnScroll() {
        const elements = document.querySelectorAll('.slide-on-scroll:not(.is-visible)');
        if (!elements.length) return;

        if (reducedMotion.matches || !('IntersectionObserver' in window)) {
            elements.forEach((element) => element.classList.add('is-visible'));
            return;
        }

        const observer = new IntersectionObserver((entries, currentObserver) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                currentObserver.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        elements.forEach((element) => observer.observe(element));
    }

    document.addEventListener('DOMContentLoaded', revealOnScroll, { once: true });
    window.SAIDPL = Object.freeze({ createHeroSlider });
})();
