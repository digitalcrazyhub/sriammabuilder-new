/* ============================================================
   SAIDPL FLOATING ACTION BUTTONS
   ============================================================ */

(() => {
    'use strict';

    function initializeFloatingActions() {
        const toTopButton = document.getElementById('saidplToTop');
        if (!toTopButton || toTopButton.dataset.initialized === 'true') return;

        toTopButton.dataset.initialized = 'true';
        const updateVisibility = () => {
            toTopButton.classList.toggle('saidpl-show', window.scrollY > 400);
        };

        window.addEventListener('scroll', updateVisibility, { passive: true });
        toTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
            });
        });
        updateVisibility();
    }

    document.addEventListener('saidpl:components-ready', initializeFloatingActions);
})();
