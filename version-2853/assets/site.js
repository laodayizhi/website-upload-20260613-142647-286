(function () {
    function normalize(value) {
        return (value || "").toString().trim().toLowerCase();
    }

    function setSearchInputs(query) {
        var inputs = document.querySelectorAll('input[type="search"][name="q"]');
        inputs.forEach(function (input) {
            input.value = query;
        });
    }

    function filterCards() {
        var params = new URLSearchParams(window.location.search);
        var query = normalize(params.get("q"));
        var activeFilter = "all";
        var activeButton = document.querySelector(".filter-button.active");
        if (activeButton) {
            activeFilter = normalize(activeButton.getAttribute("data-filter"));
        }
        setSearchInputs(query);
        var cards = document.querySelectorAll(".movie-card");
        var visible = 0;
        cards.forEach(function (card) {
            var text = normalize(card.getAttribute("data-search"));
            var filters = normalize(card.getAttribute("data-filter"));
            var matchQuery = !query || text.indexOf(query) !== -1;
            var matchFilter = activeFilter === "all" || filters.indexOf(activeFilter) !== -1;
            var show = matchQuery && matchFilter;
            card.style.display = show ? "" : "none";
            if (show) {
                visible += 1;
            }
        });
        var status = document.querySelector("[data-filter-status]");
        if (status) {
            status.textContent = visible ? "筛选结果已更新" : "没有找到匹配影片";
        }
    }

    function bindFilters() {
        var buttons = document.querySelectorAll(".filter-button");
        buttons.forEach(function (button) {
            button.addEventListener("click", function () {
                buttons.forEach(function (item) {
                    item.classList.remove("active");
                });
                button.classList.add("active");
                filterCards();
            });
        });
    }

    function bindMobileNav() {
        var toggle = document.querySelector(".mobile-toggle");
        var nav = document.querySelector(".mobile-nav");
        if (!toggle || !nav) {
            return;
        }
        toggle.addEventListener("click", function () {
            var open = nav.classList.toggle("open");
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
        });
    }

    function bindSearchForms() {
        var forms = document.querySelectorAll(".catalog-search");
        forms.forEach(function (form) {
            form.addEventListener("submit", function (event) {
                var input = form.querySelector('input[name="q"]');
                if (!input) {
                    return;
                }
                if (form.getAttribute("action") === window.location.pathname.split("/").pop() || form.getAttribute("action") === "") {
                    event.preventDefault();
                    var next = new URL(window.location.href);
                    if (input.value.trim()) {
                        next.searchParams.set("q", input.value.trim());
                    } else {
                        next.searchParams.delete("q");
                    }
                    window.history.replaceState({}, "", next.toString());
                    filterCards();
                }
            });
        });
    }

    function enhanceHero() {
        var panels = document.querySelectorAll(".hero-panel");
        if (!panels.length) {
            return;
        }
        var index = 0;
        setInterval(function () {
            panels.forEach(function (panel) {
                panel.classList.remove("is-current");
            });
            panels[index % panels.length].classList.add("is-current");
            index += 1;
        }, 3600);
    }

    document.addEventListener("DOMContentLoaded", function () {
        bindMobileNav();
        bindFilters();
        bindSearchForms();
        filterCards();
        enhanceHero();
    });
})();
