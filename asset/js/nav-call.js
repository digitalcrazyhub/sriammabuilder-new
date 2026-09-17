(() => {
    'use strict';

    async function loadComponent(selector, url) {
        const host = document.querySelector(selector);

        if (!host) return;

        try {
            host.setAttribute('aria-busy', 'true');

            const response = await fetch(url, {
                credentials: 'same-origin',
                cache: 'no-cache'
            });

            if (!response.ok) {
                throw new Error(`${url} returned HTTP ${response.status}`);
            }

            host.innerHTML = await response.text();
            host.removeAttribute('aria-busy');

        } catch (error) {
            host.removeAttribute('aria-busy');
            console.error(`Unable to load component ${url}:`, error);
        }
    }

    function finishSharedComponents() {
        const year = document.getElementById('saidplCurrentYear');

        if (year) {
            year.textContent = String(new Date().getFullYear());
        }

        if (window.lucide) {
            window.lucide.createIcons();
        }

        document.dispatchEvent(
            new CustomEvent('saidpl:components-ready')
        );
    }

    document.addEventListener('DOMContentLoaded', async () => {

        await Promise.all([
            loadComponent(
                '#saidplNavHeader',
                './asset/includes/navbar.html'
            ),

            loadComponent(
                '#saidplFooter',
                './asset/includes/footer.html'
            ),

            loadComponent(
                '#saidplFloatingActions',
                './asset/includes/floating-actions.html'
            )
        ]);

        finishSharedComponents();

    }, { once: true });

})();