/*
 * Portfolio renderer — no dependencies.
 * Builds the page from the SITE object in content.js. Edit content.js, not this file.
 */

(function () {
  "use strict";

  if (typeof SITE === "undefined") {
    console.error("content.js did not load — keeping the static fallback content.");
    return;
  }

  const root = document.documentElement;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const profile = SITE.profile || {};

  /* ---------------------------------------------------------------------------
   * Helpers
   * ------------------------------------------------------------------------- */

  /** Completed whole years between two dates (end defaults to today). */
  function completedYears(startISO, endISO) {
    const start = new Date(startISO + "T00:00:00");
    const end = endISO ? new Date(endISO + "T00:00:00") : new Date();
    if (isNaN(start)) return 0;
    let years = end.getFullYear() - start.getFullYear();
    const beforeAnniversary =
      end.getMonth() < start.getMonth() ||
      (end.getMonth() === start.getMonth() && end.getDate() < start.getDate());
    if (beforeAnniversary) years -= 1;
    return Math.max(0, years);
  }

  const tokens = {
    years: String(completedYears(profile.careerStart, profile.careerEnd)),
    name: profile.name || "",
  };

  /** Replace {token} placeholders in content strings. */
  function fill(text) {
    return String(text == null ? "" : text).replace(/\{(\w+)\}/g, function (match, key) {
      return Object.prototype.hasOwnProperty.call(tokens, key) ? tokens[key] : match;
    });
  }

  /** Create an element with optional class and (placeholder-filled) text. */
  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null && text !== "") node.textContent = fill(text);
    return node;
  }

  function isExternal(url) {
    return /^https?:\/\//i.test(url);
  }

  function link(url, text, className) {
    const a = el("a", className, text);
    a.href = url;
    if (isExternal(url)) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
    return a;
  }

  function tagList(items, ariaLabel) {
    const list = el("ul", "tag-list");
    if (ariaLabel) list.setAttribute("aria-label", ariaLabel);
    items.forEach(function (item) { list.appendChild(el("li", "", item)); });
    return list;
  }

  function linkRow(item, className) {
    const links = (item.links || []).filter(function (l) { return l && l.url; });
    if (!links.length) return null;
    const row = el("div", className);
    links.forEach(function (l) {
      const a = link(l.url, l.label + (isExternal(l.url) ? " ↗" : ""));
      a.setAttribute("aria-label", item.title + " — " + l.label + (isExternal(l.url) ? " (opens in new tab)" : ""));
      row.appendChild(a);
    });
    return row;
  }

  /* ---------------------------------------------------------------------------
   * Hero
   * ------------------------------------------------------------------------- */

  function renderPipeline(stages) {
    const wrap = el("div", "pipeline");
    wrap.setAttribute("role", "img");
    wrap.setAttribute("aria-label", "Data pipeline: " + stages.join(" to "));
    stages.forEach(function (stage, i) {
      if (i > 0) {
        const pipe = el("span", "pipeline-link");
        pipe.setAttribute("aria-hidden", "true");
        pipe.style.setProperty("--i", String(i - 1));
        wrap.appendChild(pipe);
      }
      const node = el("span", "pipeline-node", stage);
      node.setAttribute("aria-hidden", "true");
      wrap.appendChild(node);
    });
    return wrap;
  }

  function renderFacts(facts) {
    const list = el("dl", "facts");
    facts.forEach(function (fact) {
      const row = el("div", "fact");
      row.appendChild(el("dt", "", fact.label));
      row.appendChild(el("dd", "", fact.value));
      list.appendChild(row);
    });
    return list;
  }

  function renderHero(hero) {
    const section = el("section", "hero container");
    section.id = "top";
    section.setAttribute("aria-labelledby", "hero-title");

    const text = el("div", "hero-text");
    if (hero.eyebrow) text.appendChild(el("p", "eyebrow", hero.eyebrow));

    const h1 = el("h1", "hero-title");
    h1.id = "hero-title";
    h1.append(fill(profile.name) + ".");
    if (hero.headline) {
      h1.append(" ");
      h1.appendChild(el("span", "hero-sub", hero.headline));
    }
    text.appendChild(h1);

    if (hero.lede) text.appendChild(el("p", "hero-lede", hero.lede));

    if (hero.actions && hero.actions.length) {
      const actions = el("div", "hero-actions");
      hero.actions.forEach(function (action) {
        actions.appendChild(link(action.href, action.label, "btn " + (action.primary ? "btn-primary" : "btn-ghost")));
      });
      text.appendChild(actions);
    }
    section.appendChild(text);

    const hasPipeline = hero.pipeline && hero.pipeline.length;
    const hasFacts = hero.facts && hero.facts.length;
    if (hasPipeline || hasFacts) {
      const panel = el("div", "hero-panel glass");
      if (hero.panelLabel) panel.appendChild(el("p", "panel-label", hero.panelLabel));
      if (hasPipeline) panel.appendChild(renderPipeline(hero.pipeline));
      if (hasFacts) panel.appendChild(renderFacts(hero.facts));
      section.appendChild(panel);
    }

    return section;
  }

  /* ---------------------------------------------------------------------------
   * Section types — add a new renderer here to support a new `type`.
   * ------------------------------------------------------------------------- */

  const renderers = {
    text: function (section, body) {
      const prose = el("div", "prose");
      (section.paragraphs || []).forEach(function (p) { prose.appendChild(el("p", "", p)); });
      body.appendChild(prose);
    },

    tags: function (section, body) {
      const list = el("dl", "skill-list");
      (section.groups || []).forEach(function (group) {
        const row = el("div", "skill-row");
        row.appendChild(el("dt", "", group.name));
        const dd = el("dd");
        dd.appendChild(tagList(group.items || []));
        row.appendChild(dd);
        list.appendChild(row);
      });
      body.appendChild(list);
    },

    cards: function (section, body) {
      const items = section.items || [];
      const featured = items.filter(function (item) { return item.featured; });
      const rest = items.filter(function (item) { return !item.featured; });

      if (featured.length) {
        const grid = el("ul", "card-grid");
        grid.setAttribute("role", "list");
        featured.forEach(function (item) {
          const li = el("li");
          const card = el("article", "card glass");
          if (item.label) card.appendChild(el("p", "card-label", item.label));
          card.appendChild(el("h3", "card-title", item.title));
          if (item.summary) card.appendChild(el("p", "card-summary", item.summary));
          if (item.tags && item.tags.length) card.appendChild(tagList(item.tags, "Tech stack"));
          const links = linkRow(item, "card-links");
          if (links) card.appendChild(links);
          li.appendChild(card);
          grid.appendChild(li);
        });
        body.appendChild(grid);
      }

      if (rest.length) {
        if (featured.length && section.moreTitle) body.appendChild(el("h3", "subhead", section.moreTitle));
        const list = el("ul", "compact-list");
        list.setAttribute("role", "list");
        rest.forEach(function (item) {
          const li = el("li", "compact-item");
          const head = el("div", "compact-head");
          head.appendChild(el("h4", "compact-title", item.title));
          if (item.label && !featured.length) head.appendChild(el("p", "card-label", item.label));
          li.appendChild(head);
          const detail = el("div", "compact-body");
          if (item.summary) detail.appendChild(el("p", "", item.summary));
          if (item.tags && item.tags.length) detail.appendChild(el("p", "compact-tags", item.tags.join(" · ")));
          const links = linkRow(item, "card-links");
          if (links) detail.appendChild(links);
          li.appendChild(detail);
          list.appendChild(li);
        });
        body.appendChild(list);
      }
    },

    timeline: function (section, body) {
      const list = el("ol", "timeline");
      (section.items || []).forEach(function (item) {
        const li = el("li", "timeline-item");
        li.appendChild(el("p", "timeline-period", item.period));
        const detail = el("div", "timeline-body");
        detail.appendChild(el("h3", "timeline-role", item.title));
        if (item.org) detail.appendChild(el("p", "timeline-org", item.org));
        if (item.points && item.points.length) {
          const points = el("ul", "timeline-points");
          item.points.forEach(function (p) { points.appendChild(el("li", "", p)); });
          detail.appendChild(points);
        }
        li.appendChild(detail);
        list.appendChild(li);
      });
      body.appendChild(list);
    },

    contact: function (section, body) {
      if (section.intro) body.appendChild(el("p", "prose", section.intro));
      const list = el("ul", "contact-list");
      list.setAttribute("role", "list");
      (profile.links || []).forEach(function (l) {
        const li = el("li");
        const a = link(l.url, "", "contact-link glass");
        a.appendChild(el("span", "contact-label", l.label));
        a.appendChild(el("span", "contact-value", l.display || l.url));
        li.appendChild(a);
        list.appendChild(li);
      });
      body.appendChild(list);
    },
  };

  function renderSection(section) {
    const render = renderers[section.type];
    if (!render) {
      console.warn('Unknown section type "' + section.type + '" for section "' + section.id + '" — skipped.');
      return null;
    }

    const node = el("section", "section container reveal");
    node.id = section.id;
    node.setAttribute("aria-labelledby", section.id + "-title");

    const h2 = el("h2", "section-title", section.title);
    h2.id = section.id + "-title";
    node.appendChild(h2);

    render(section, node);
    return node;
  }

  /* ---------------------------------------------------------------------------
   * Page assembly
   * ------------------------------------------------------------------------- */

  function renderFooterLinks() {
    const list = document.getElementById("footer-links");
    if (!list) return;
    const frag = document.createDocumentFragment();
    (profile.links || []).forEach(function (l) {
      const li = el("li");
      li.appendChild(link(l.url, l.label));
      frag.appendChild(li);
    });
    list.replaceChildren(frag);
  }

  function renderPage() {
    const main = document.getElementById("main");
    const menu = document.getElementById("nav-menu");
    const sections = (SITE.sections || []).filter(function (s) { return s && !s.hidden; });

    const mainFrag = document.createDocumentFragment();
    if (SITE.hero) mainFrag.appendChild(renderHero(SITE.hero));

    const navFrag = document.createDocumentFragment();
    sections.forEach(function (section) {
      const node = renderSection(section);
      if (!node) return;
      mainFrag.appendChild(node);
      if (section.nav !== false) {
        const li = el("li");
        li.appendChild(link("#" + section.id, section.title));
        navFrag.appendChild(li);
      }
    });

    main.replaceChildren(mainFrag);
    menu.replaceChildren(navFrag);
    renderFooterLinks();

    document.querySelectorAll("[data-profile-name]").forEach(function (node) { node.textContent = profile.name; });
    const brand = document.querySelector(".brand");
    if (brand) brand.setAttribute("aria-label", profile.name + ", back to top");
  }

  /* ---------------------------------------------------------------------------
   * Behaviour
   * ------------------------------------------------------------------------- */

  function setupNav() {
    const toggle = document.querySelector(".nav-toggle");
    const menu = document.getElementById("nav-menu");
    if (!toggle || !menu) return;

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", String(open));
      menu.setAttribute("data-open", String(open));
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });

    // Close the mobile menu if the viewport grows to desktop width.
    window.matchMedia("(min-width: 860px)").addEventListener("change", function (mq) {
      if (mq.matches) setOpen(false);
    });
  }

  /** Make the floating nav a little more opaque once the page scrolls. */
  function setupHeaderScroll() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    let ticking = false;
    function update() {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }, { passive: true });
    update();
  }

  function setupActiveSection() {
    if (!("IntersectionObserver" in window)) return;
    const links = document.querySelectorAll('.nav-menu a[href^="#"]');
    const byId = {};
    links.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) { a.removeAttribute("aria-current"); });
        const active = byId[entry.target.id];
        if (active) active.setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    // Observe every section (including the hero) so scrolling back to the top clears the highlight.
    document.querySelectorAll("main section[id]").forEach(function (section) { observer.observe(section); });
  }

  function setupReveal() {
    if (prefersReducedMotion || !("IntersectionObserver" in window)) return;
    root.classList.add("js-reveal");

    const observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll(".reveal").forEach(function (node) { observer.observe(node); });
  }

  function setYear() {
    const year = document.getElementById("year");
    if (year) year.textContent = String(new Date().getFullYear());
  }

  renderPage();
  setupNav();
  setupHeaderScroll();
  setupActiveSection();
  setupReveal();
  setYear();

  // Honour a #hash in the URL now that the target sections exist.
  if (location.hash.length > 1) {
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) target.scrollIntoView();
  }
})();
