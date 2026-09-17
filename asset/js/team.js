document.addEventListener('DOMContentLoaded', () => {
    window.SAIDPL?.createHeroSlider({
        track: document.getElementById('teamHeroTrack'),
        slides: document.querySelectorAll('.team-hero .hero-slide'),
        dots: document.querySelectorAll('.team-hero .dot'),
        section: document.querySelector('.team-hero')
    });
});
