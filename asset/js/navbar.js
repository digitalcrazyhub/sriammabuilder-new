(() => {
    'use strict';

    function normalizePath(pathname) {
        return pathname.replace(/\/index\.html$/, '/').replace(/\/$/, '') || '/';
    }

    function initializeNavbar() {
        const header = document.getElementById('saidplNavHeaderElement');
        const menuToggle = document.getElementById('saidplNavHamburger');
        const navMenu = document.getElementById('saidplNavMenu');
        const backdrop = document.getElementById('saidplNavBackdrop');
        if (!header || !menuToggle || !navMenu || !backdrop || header.dataset.initialized === 'true') return;

        header.dataset.initialized = 'true';
        const dropdownItems = [...header.querySelectorAll('.saidpl-nav-item--has-dropdown')];
        const currentPath = normalizePath(window.location.pathname);

        const setExpanded = (item, expanded) => {
            item.classList.toggle('saidpl-nav-item--open', expanded);
            const toggle = item.querySelector('.saidpl-nav-dropdown-toggle');
            if (toggle) toggle.setAttribute('aria-expanded', String(expanded));
        };

        const closeDropdowns = () => dropdownItems.forEach((item) => setExpanded(item, false));
        const setMenuOpen = (open) => {
            navMenu.classList.toggle('saidpl-nav-menu--open', open);
            menuToggle.classList.toggle('saidpl-nav-hamburger--active', open);
            backdrop.classList.toggle('saidpl-nav-backdrop--visible', open);
            menuToggle.setAttribute('aria-expanded', String(open));
            document.body.classList.toggle('saidpl-nav-open', open);
            if (!open) closeDropdowns();
        };

        header.querySelectorAll('a[href]').forEach((link) => {
            const linkPath = normalizePath(new URL(link.href, window.location.origin).pathname);
            if (linkPath === currentPath) {
                link.classList.add('saidpl-nav-link--active');
                link.setAttribute('aria-current', 'page');
                const parentDropdown = link.closest('.saidpl-nav-item--has-dropdown');
                if (parentDropdown) parentDropdown.classList.add('saidpl-nav-item--current-section');
            } else {
                link.classList.remove('saidpl-nav-link--active');
                link.removeAttribute('aria-current');
            }
        });

        const updateHeader = () => header.classList.toggle('saidpl-nav-header--scrolled', window.scrollY > 30);
        window.addEventListener('scroll', updateHeader, { passive: true });
        updateHeader();

        menuToggle.addEventListener('click', () => setMenuOpen(!navMenu.classList.contains('saidpl-nav-menu--open')));
        backdrop.addEventListener('click', () => setMenuOpen(false));

        dropdownItems.forEach((item) => {
            const toggle = item.querySelector('.saidpl-nav-dropdown-toggle');
            if (!toggle) return;
            toggle.addEventListener('click', () => {
                const willOpen = !item.classList.contains('saidpl-nav-item--open');
                closeDropdowns();
                setExpanded(item, willOpen);
            });
        });

        document.addEventListener('click', (event) => {
            if (!header.contains(event.target)) closeDropdowns();
        });

        document.addEventListener('keydown', (event) => {
            if (event.key !== 'Escape') return;
            const menuWasOpen = navMenu.classList.contains('saidpl-nav-menu--open');
            setMenuOpen(false);
            closeDropdowns();
            if (menuWasOpen) menuToggle.focus();
        });

        navMenu.addEventListener('click', (event) => {
            if (event.target.closest('a') && window.innerWidth <= 1024) setMenuOpen(false);
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 1024) setMenuOpen(false);
        }, { passive: true });
    }

    document.addEventListener('saidpl:components-ready', initializeNavbar);
})();


