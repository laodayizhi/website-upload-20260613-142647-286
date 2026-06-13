(function () {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var menuButton = document.querySelector('[data-menu-button]');
        var mobileNav = document.querySelector('[data-mobile-nav]');

        if (menuButton && mobileNav) {
            menuButton.addEventListener('click', function () {
                var open = mobileNav.classList.toggle('open');
                menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
            });
        }

        setupHero();
        setupSearch();
    });

    function setupHero() {
        var hero = document.querySelector('[data-hero]');
        if (!hero) {
            return;
        }

        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var index = 0;
        var timer = null;

        function setSlide(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === index);
            });
        }

        function start() {
            stop();
            timer = setInterval(function () {
                setSlide(index + 1);
            }, 6200);
        }

        function stop() {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                setSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
                start();
            });
        });

        if (prev) {
            prev.addEventListener('click', function () {
                setSlide(index - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                setSlide(index + 1);
                start();
            });
        }

        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        setSlide(0);
        start();
    }

    function setupSearch() {
        var panels = Array.prototype.slice.call(document.querySelectorAll('.search-panel'));
        panels.forEach(function (panel) {
            var scope = panel.closest('.content-section') || document;
            var input = panel.querySelector('[data-search-input]');
            var buttons = Array.prototype.slice.call(panel.querySelectorAll('[data-filter-field]'));
            var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));
            var filters = {};

            function update() {
                var query = input ? input.value.trim().toLowerCase() : '';
                cards.forEach(function (card) {
                    var haystack = (card.getAttribute('data-search') || '').toLowerCase();
                    var show = !query || haystack.indexOf(query) !== -1;
                    Object.keys(filters).forEach(function (field) {
                        var value = filters[field];
                        if (value && (card.getAttribute('data-' + field) || '') !== value) {
                            show = false;
                        }
                    });
                    card.classList.toggle('is-hidden', !show);
                });
            }

            if (input) {
                input.addEventListener('input', update);
            }

            buttons.forEach(function (button) {
                button.addEventListener('click', function () {
                    var field = button.getAttribute('data-filter-field');
                    var value = button.getAttribute('data-filter-value') || '';
                    buttons.filter(function (item) {
                        return item.getAttribute('data-filter-field') === field;
                    }).forEach(function (item) {
                        item.classList.remove('active');
                    });
                    button.classList.add('active');
                    filters[field] = value;
                    update();
                });
            });
        });
    }
})();
