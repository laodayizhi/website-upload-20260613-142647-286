(function () {
  const mobileToggle = document.querySelector('[data-mobile-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  const hero = document.querySelector('[data-hero]');

  if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    let current = 0;
    let timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function start() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.dataset.heroDot || 0));
        start();
      });
    });

    if (slides.length > 1) {
      start();
    }
  }

  const filterPanels = Array.from(document.querySelectorAll('[data-filter-panel]'));

  filterPanels.forEach(function (panel) {
    const root = panel.closest('section') || document;
    const list = root.querySelector('[data-filter-list]');
    const empty = root.querySelector('[data-empty-state]');

    if (!list) {
      return;
    }

    const items = Array.from(list.children);
    const controls = Array.from(panel.querySelectorAll('[data-filter]'));
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get('q') || '';
    const keywordInput = panel.querySelector('[data-filter="keyword"]');

    if (keywordInput && initialQuery) {
      keywordInput.value = initialQuery;
    }

    function normalize(value) {
      return String(value || '').trim().toLowerCase();
    }

    function matchItem(item, filters) {
      const keyword = normalize(filters.keyword);
      const searchable = normalize([
        item.dataset.title,
        item.dataset.keywords,
        item.dataset.year,
        item.dataset.region,
        item.dataset.type,
        item.dataset.genre,
        item.dataset.category
      ].join(' '));

      if (keyword && searchable.indexOf(keyword) === -1) {
        return false;
      }

      if (filters.year && item.dataset.year !== filters.year) {
        return false;
      }

      if (filters.category && item.dataset.category !== filters.category) {
        return false;
      }

      if (filters.region && normalize(item.dataset.region).indexOf(normalize(filters.region)) === -1) {
        return false;
      }

      if (filters.type && normalize(item.dataset.type).indexOf(normalize(filters.type)) === -1) {
        return false;
      }

      return true;
    }

    function apply() {
      const filters = {};

      controls.forEach(function (control) {
        filters[control.dataset.filter] = control.value;
      });

      let visible = 0;

      items.forEach(function (item) {
        const ok = matchItem(item, filters);
        item.hidden = !ok;
        if (ok) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }

    controls.forEach(function (control) {
      control.addEventListener('input', apply);
      control.addEventListener('change', apply);
    });

    apply();
  });

  const backToTop = document.querySelector('[data-back-to-top]');

  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.classList.toggle('is-visible', window.scrollY > 480);
    }, { passive: true });

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}());
