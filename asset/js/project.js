document.addEventListener('DOMContentLoaded', () => {
    window.SAIDPL?.createHeroSlider({
        track: document.getElementById('teamHeroTrack'),
        slides: document.querySelectorAll('.team-hero .hero-slide'),
        dots: document.querySelectorAll('.team-hero .dot'),
        section: document.querySelector('.team-hero')
    });

    const cards = [...document.querySelectorAll('.project-card')];
    const modal = document.getElementById('lightboxModal');
    const dialog = modal?.querySelector('[role="dialog"]');
    const image = document.getElementById('lightboxImg');
    const title = document.getElementById('lightboxTitle');
    const description = document.getElementById('lightboxDesc');
    const closeButton = document.getElementById('lightboxClose');
    const previousButton = document.getElementById('lightboxPrev');
    const nextButton = document.getElementById('lightboxNext');
    let activeIndex = 0;
    let opener = null;

    if (!modal || !dialog || !image || !cards.length) return;

    const getProject = (index) => {
        const card = cards[index];
        const projectImage = card.querySelector('.project-img-box img');
        return {
            src: projectImage?.currentSrc || projectImage?.src || '',
            title: card.dataset.title || card.querySelector('.project-title')?.textContent.trim() || 'Project',
            description: card.dataset.desc || card.querySelector('.project-desc')?.textContent.trim() || ''
        };
    };

    const update = (index) => {
        activeIndex = (index + cards.length) % cards.length;
        const project = getProject(activeIndex);
        image.src = project.src;
        image.alt = project.title;
        title.textContent = project.title;
        description.textContent = project.description;
        const hideNavigation = cards.length <= 1;
        previousButton?.classList.toggle('is-hidden', hideNavigation);
        nextButton?.classList.toggle('is-hidden', hideNavigation);
    };

    const close = () => {
        modal.classList.remove('is-active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('lightbox-open');
        opener?.focus();
    };

    const open = (index, trigger) => {
        opener = trigger || document.activeElement;
        update(index);
        modal.classList.add('is-active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('lightbox-open');
        closeButton?.focus();
    };

    cards.forEach((card, index) => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Open project: ${getProject(index).title}`);
        card.addEventListener('click', () => open(index, card));
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                open(index, card);
            }
        });
    });

    closeButton?.addEventListener('click', close);
    modal.querySelector('#lightboxOverlay')?.addEventListener('click', close);
    previousButton?.addEventListener('click', () => update(activeIndex - 1));
    nextButton?.addEventListener('click', () => update(activeIndex + 1));

    document.addEventListener('keydown', (event) => {
        if (!modal.classList.contains('is-active')) return;
        if (event.key === 'Escape') close();
        if (event.key === 'ArrowLeft') update(activeIndex - 1);
        if (event.key === 'ArrowRight') update(activeIndex + 1);
        if (event.key !== 'Tab') return;

        const focusable = [...dialog.querySelectorAll('button:not(.is-hidden), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')]
            .filter((element) => !element.hasAttribute('disabled'));
        const first = focusable[0];
        const last = focusable.at(-1);
        if (!first || !last) return;
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    });
});
