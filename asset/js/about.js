document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    /* =========================================================
       1. SCROLL REVEAL
    ========================================================== */

    const slideElements =
        document.querySelectorAll(".slide-on-scroll");


    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(
                (entries, obs) => {

                    entries.forEach((entry) => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        entry.target.classList.add(
                            "is-visible"
                        );

                        obs.unobserve(entry.target);

                    });

                },
                {
                    threshold: 0.12,
                    rootMargin: "0px 0px -40px 0px"
                }
            );


        slideElements.forEach((element) => {

            observer.observe(element);

        });

    } else {

        slideElements.forEach((element) => {

            element.classList.add(
                "is-visible"
            );

        });

    }


    /* =========================================================
       2. STAGGERED CHILD ANIMATION
    ========================================================== */

    const staggerContainers =
        document.querySelectorAll(
            ".staggered-slide.slide-on-scroll"
        );


    staggerContainers.forEach((container) => {

        const children =
            container.children;

        Array.from(children).forEach(
            (child, index) => {

                child.style.setProperty(
                    "--stagger-delay",
                    `${Math.min(index * 80, 640)}ms`
                );

            }
        );

    });


    /* =========================================================
       3. ABOUT HERO SLIDER
    ========================================================== */

    const heroTrack =
        document.getElementById(
            "aboutHeroTrack"
        );

    const hero =
        document.querySelector(
            ".team-style-hero"
        );

    const heroSlides =
        document.querySelectorAll(
            ".team-style-hero .hero-slide"
        );

    const heroDots =
        document.querySelectorAll(
            ".team-style-hero .dot"
        );


    let currentSlide = 0;

    let heroTimer = null;


    function updateHero(index) {

        if (
            !heroTrack ||
            heroSlides.length === 0
        ) {
            return;
        }


        currentSlide =
            (index + heroSlides.length)
            % heroSlides.length;


        heroTrack.style.transform =
            `translate3d(-${currentSlide * 100}%, 0, 0)`;


        heroSlides.forEach(
            (slide, slideIndex) => {

                const active =
                    slideIndex === currentSlide;


                slide.classList.toggle(
                    "is-active",
                    active
                );


                slide.setAttribute(
                    "aria-hidden",
                    active
                        ? "false"
                        : "true"
                );

            }
        );


        heroDots.forEach(
            (dot, dotIndex) => {

                const active =
                    dotIndex === currentSlide;


                dot.classList.toggle(
                    "is-active",
                    active
                );


                dot.setAttribute(
                    "aria-current",
                    active
                        ? "true"
                        : "false"
                );

            }
        );

    }


    function stopHeroSlider() {

        if (heroTimer !== null) {

            clearInterval(heroTimer);

            heroTimer = null;

        }

    }


    function startHeroSlider() {

        stopHeroSlider();


        if (
            heroSlides.length <= 1 ||
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches
        ) {
            return;
        }


        heroTimer = setInterval(() => {

            updateHero(
                currentSlide + 1
            );

        }, 5000);

    }


    heroDots.forEach(
        (dot, index) => {

            dot.addEventListener(
                "click",
                () => {

                    updateHero(index);

                    startHeroSlider();

                }
            );

        }
    );


    if (hero) {

        hero.addEventListener(
            "mouseenter",
            stopHeroSlider
        );


        hero.addEventListener(
            "mouseleave",
            startHeroSlider
        );


        hero.addEventListener(
            "focusin",
            stopHeroSlider
        );


        hero.addEventListener(
            "focusout",
            startHeroSlider
        );

    }


    updateHero(0);

    startHeroSlider();


    /* =========================================================
       4. COUNTER ANIMATION
    ========================================================== */

    const counters =
        document.querySelectorAll(
            ".counter"
        );


    let countersStarted = false;


    function animateCounter(
        counter,
        target,
        duration = 1800
    ) {

        const startTime =
            performance.now();


        function updateCounter(
            currentTime
        ) {

            const elapsed =
                currentTime - startTime;


            const progress =
                Math.min(
                    elapsed / duration,
                    1
                );


            /*
             * Ease-out animation
             */

            const eased =
                1 -
                Math.pow(
                    1 - progress,
                    3
                );


            const value =
                Math.floor(
                    eased * target
                );


            counter.textContent =
                value.toLocaleString(
                    "en-IN"
                );


            if (progress < 1) {

                requestAnimationFrame(
                    updateCounter
                );

            } else {

                counter.textContent =
                    target.toLocaleString(
                        "en-IN"
                    );

            }

        }


        requestAnimationFrame(
            updateCounter
        );

    }


    function startCounters() {

        if (countersStarted) {
            return;
        }


        countersStarted = true;


        counters.forEach(
            (counter) => {

                const target =
                    Number.parseInt(
                        counter.dataset.target,
                        10
                    );


                if (
                    Number.isNaN(target) ||
                    target < 0
                ) {
                    return;
                }


                animateCounter(
                    counter,
                    target
                );

            }
        );

    }


    const counterTrigger =
        document.querySelector(
            ".banner-metrics-section"
        );


    if (
        counterTrigger &&
        counters.length > 0 &&
        "IntersectionObserver" in window
    ) {

        const counterObserver =
            new IntersectionObserver(
                (entries, obs) => {

                    entries.forEach(
                        (entry) => {

                            if (
                                !entry.isIntersecting
                            ) {
                                return;
                            }


                            startCounters();


                            obs.unobserve(
                                entry.target
                            );

                        }
                    );

                },
                {
                    threshold: 0.25
                }
            );


        counterObserver.observe(
            counterTrigger
        );

    } else {

        startCounters();

    }


    /* =========================================================
       9. SCROLL TO TOP
    ========================================================== */

    const scrollUp =
        document.getElementById(
            "scrollUp"
        );


    if (scrollUp) {

        const updateScrollButton =
            () => {

                scrollUp.classList.toggle(
                    "is-visible",
                    window.scrollY > 400
                );

            };


        window.addEventListener(
            "scroll",
            updateScrollButton,
            {
                passive: true
            }
        );


        scrollUp.addEventListener(
            "click",
            () => {

                window.scrollTo({
                    top: 0,
                    behavior:
                        window.matchMedia(
                            "(prefers-reduced-motion: reduce)"
                        ).matches
                            ? "auto"
                            : "smooth"
                });

            }
        );


        updateScrollButton();

    }


    /* =========================================================
       10. WINDOW RESIZE
    ========================================================== */

    let resizeTimer = null;


    window.addEventListener(
        "resize",
        () => {

            clearTimeout(
                resizeTimer
            );


            resizeTimer =
                setTimeout(() => {

                    /*
                     * Keep current hero position.
                     */

                    updateHero(
                        currentSlide
                    );


                    /*
                     * Make sure mobile nav
                     * doesn't remain open after
                     * switching to desktop.
                     */

                    if (
                        window.innerWidth > 768
                    ) {

                        const mainNav =
                            document.getElementById(
                                "mainNav"
                            );


                        const mobileToggle =
                            document.getElementById(
                                "mobileToggle"
                            );


                        if (mainNav) {

                            mainNav.classList.remove(
                                "nav-open"
                            );

                        }


                        if (mobileToggle) {

                            mobileToggle.setAttribute(
                                "aria-expanded",
                                "false"
                            );

                        }

                    }

                }, 150);

        }
    );


    /* =========================================================
       11. PAGE READY
    ========================================================== */

    document.documentElement.classList.add(
        "about-page-ready"
    );

});