(function () {
  function rootPrefix() {
    return window.location.pathname.indexOf('/movie/') !== -1 ? '../' : './';
  }

  function textOf(value) {
    return String(value || '').toLowerCase();
  }

  function resultUrl(item) {
    return rootPrefix() + 'movie/' + item.file;
  }

  function imageUrl(item) {
    return rootPrefix() + item.image;
  }

  function closePanels() {
    document.querySelectorAll('.search-results.open').forEach(function (panel) {
      panel.classList.remove('open');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.querySelector('.menu-toggle');
    var panel = document.querySelector('.mobile-panel');
    if (toggle && panel) {
      toggle.addEventListener('click', function () {
        var open = panel.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
    if (slides.length > 1) {
      var current = 0;
      var show = function (index) {
        current = index;
        slides.forEach(function (slide, i) {
          slide.classList.toggle('active', i === index);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle('active', i === index);
        });
      };
      dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
          show(i);
        });
      });
      window.setInterval(function () {
        show((current + 1) % slides.length);
      }, 5600);
    }

    document.querySelectorAll('.filter-bar').forEach(function (bar) {
      var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
      bar.addEventListener('click', function (event) {
        var button = event.target.closest('button[data-filter]');
        if (!button) {
          return;
        }
        var term = button.getAttribute('data-filter');
        bar.querySelectorAll('button').forEach(function (item) {
          item.classList.toggle('active', item === button);
        });
        cards.forEach(function (card) {
          var text = [
            card.getAttribute('data-title'),
            card.getAttribute('data-year'),
            card.getAttribute('data-region'),
            card.getAttribute('data-type'),
            card.getAttribute('data-genre')
          ].join(' ');
          card.style.display = term === 'all' || text.indexOf(term) !== -1 ? '' : 'none';
        });
      });
    });

    document.querySelectorAll('.site-search').forEach(function (form) {
      var input = form.querySelector('input[type="search"]');
      var box = form.querySelector('.search-results');
      if (!input || !box || typeof movieSearchIndex === 'undefined') {
        return;
      }
      var render = function () {
        var query = textOf(input.value).trim();
        if (!query) {
          box.classList.remove('open');
          box.innerHTML = '';
          return;
        }
        var terms = query.split(/\s+/).filter(Boolean);
        var list = movieSearchIndex.filter(function (item) {
          var hay = textOf(item.title + ' ' + item.year + ' ' + item.region + ' ' + item.type + ' ' + item.genre + ' ' + item.tags);
          return terms.every(function (term) {
            return hay.indexOf(term) !== -1;
          });
        }).slice(0, 12);
        if (!list.length) {
          box.innerHTML = '<div class="empty-state">没有找到匹配影片</div>';
          box.classList.add('open');
          return;
        }
        box.innerHTML = list.map(function (item) {
          return '<a class="search-result-item" href="' + resultUrl(item) + '">' +
            '<img src="' + imageUrl(item) + '" alt="' + item.title.replace(/"/g, '&quot;') + '">' +
            '<span><strong>' + item.title + '</strong><span>' + item.year + ' · ' + item.region + ' · ' + item.genre + '</span></span>' +
            '</a>';
        }).join('');
        box.classList.add('open');
      };
      input.addEventListener('input', render);
      input.addEventListener('focus', render);
      form.addEventListener('submit', function (event) {
        var first = box.querySelector('a');
        if (first && input.value.trim()) {
          event.preventDefault();
          window.location.href = first.href;
        }
      });
    });

    var searchPage = document.querySelector('[data-search-page]');
    if (searchPage && typeof movieSearchIndex !== 'undefined') {
      var params = new URLSearchParams(window.location.search);
      var q = params.get('q') || '';
      var input = document.querySelector('.search-page-input');
      var results = document.querySelector('.search-page-results');
      if (input) {
        input.value = q;
      }
      var draw = function (query) {
        var terms = textOf(query).trim().split(/\s+/).filter(Boolean);
        var list = terms.length ? movieSearchIndex.filter(function (item) {
          var hay = textOf(item.title + ' ' + item.year + ' ' + item.region + ' ' + item.type + ' ' + item.genre + ' ' + item.tags + ' ' + item.oneLine);
          return terms.every(function (term) {
            return hay.indexOf(term) !== -1;
          });
        }).slice(0, 80) : movieSearchIndex.slice(0, 36);
        if (!results) {
          return;
        }
        if (!list.length) {
          results.innerHTML = '<div class="empty-state">没有找到匹配影片</div>';
          return;
        }
        results.innerHTML = list.map(function (item) {
          return '<a class="search-page-card" href="' + resultUrl(item) + '">' +
            '<img src="' + imageUrl(item) + '" alt="' + item.title.replace(/"/g, '&quot;') + '">' +
            '<span><h3>' + item.title + '</h3><p>' + item.year + ' · ' + item.region + ' · ' + item.type + ' · ' + item.genre + '</p><p>' + item.oneLine + '</p></span>' +
            '</a>';
        }).join('');
      };
      draw(q);
      if (input) {
        input.addEventListener('input', function () {
          draw(input.value);
        });
      }
    }

    document.addEventListener('click', function (event) {
      if (!event.target.closest('.site-search')) {
        closePanels();
      }
    });
  });
})();
