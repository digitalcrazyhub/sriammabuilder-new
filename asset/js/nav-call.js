(() => {
    'use strict';

    /*
    |--------------------------------------------------------------------------
    | Project Base Path
    |--------------------------------------------------------------------------
    |
    | Localhost:
    | /sriammabuilders/
    |
    | Production:
    | /
    |
    */

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

            console.error(
                `Unable to load component ${url}:`,
                error
            );
        }
    }

    function finishSharedComponents() {

        /*
        |--------------------------------------------------------------------------
        | Dynamic Footer Year
        |--------------------------------------------------------------------------
        */

        const year = document.getElementById(
            'saidplCurrentYear'
        );

        if (year) {
            year.textContent = String(
                new Date().getFullYear()
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Lucide Icons
        |--------------------------------------------------------------------------
        */

        if (window.lucide) {
            window.lucide.createIcons();
        }

        /*
        |--------------------------------------------------------------------------
        | Components Ready Event
        |--------------------------------------------------------------------------
        */

        document.dispatchEvent(
            new CustomEvent('saidpl:components-ready')
        );
    }

    document.addEventListener(
        'DOMContentLoaded',
        async () => {

            await Promise.all([

                loadComponent(
                    '#saidplNavHeader',
                    `${window.SAB_CONFIG.componentsPath}navbar.html`
                ),

                loadComponent(
                    '#saidplFooter',
                    `${window.SAB_CONFIG.componentsPath}footer.html`
                ),

                loadComponent(
                    '#saidplFloatingActions',
                    `${window.SAB_CONFIG.componentsPath}floating-actions.html`
                )

            ]);

            finishSharedComponents();

        },
        { once: true }
    );

})();

