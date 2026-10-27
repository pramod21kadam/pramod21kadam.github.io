/*
 * Portfolio renderer — no dependencies.
 * Builds the page from the SITE object in content.js, using the artwork in the
 * <template id="art"> in index.html. Edit content.js, not this file.
 */

(function () {
  "use strict";

  if (typeof SITE === "undefined") {
    console.error("content.js did not load — keeping the static fallback content.");
    return;
  }

  const root = document.documentElement;
  const profile = SITE.profile || {};
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
    email: profile.email || "",
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

  /** An element whose text may contain **bold** runs. */
  function rich(tag, className, text) {
    const node = el(tag, className);
    fill(text).split("**").forEach(function (part, i) {
      if (!part) return;
      node.appendChild(i % 2 ? el("strong", "", part) : document.createTextNode(part));
    });
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
      a.setAttribute("aria-label", fill(text) + " (opens in new tab)");
    }
    return a;
  }

  /** A copy of a drawing from <template id="art">, hidden from assistive tech. */
  function art(name, className) {
    const template = document.getElementById("art");
    const source = template && template.content.querySelector('[data-art="' + name + '"]');
    if (!source) return el("span", className);
    const node = document.importNode(source, true);
    node.setAttribute("aria-hidden", "true");
    node.setAttribute("focusable", "false");
    if (className) node.setAttribute("class", className);
    return node;
  }

  function chips(items, className) {
    const list = el("ul", className || "chips");
    list.setAttribute("role", "list");
    (items || []).forEach(function (item) { list.appendChild(el("li", "chip", item)); });
    return list;
  }

  /* ---------------------------------------------------------------------------
   * Intro strip: the full-screen scene
   * ------------------------------------------------------------------------- */

  function renderStage(intro) {
    const section = el("section", "stage");
    section.id = "top";
    section.setAttribute("aria-labelledby", "intro-title");
    const pin = el("div", "stage-pin");

    // Print only: the résumé header.
    const head = el("div", "print-head");
    head.appendChild(el("p", "print-name", profile.name));
    head.appendChild(el("p", "print-role", profile.title + (profile.employer ? ", " + profile.employer : "")));
    const contacts = el("p", "print-links");
    contacts.textContent = (profile.links || []).map(function (l) { return l.display || l.url; }).join("  ·  ");
    head.appendChild(contacts);
    pin.appendChild(head);

    const copy = el("div", "stage-copy");
    const h1 = el("h1", "stage-title", intro.headline || profile.name);
    h1.id = "intro-title";
    copy.appendChild(h1);
    if (intro.summary) copy.appendChild(rich("p", "stage-summary", intro.summary));
    pin.appendChild(copy);

    const scene = el("div", "stage-scene");
    scene.setAttribute("role", "img");
    scene.setAttribute("aria-label", fill(intro.sceneLabel));
    scene.appendChild(art("hero"));
    pin.appendChild(scene);

    const hint = el("p", "stage-hint pill");
    const mouse = el("span", "hint-mouse");
    mouse.setAttribute("aria-hidden", "true");
    hint.appendChild(mouse);
    hint.appendChild(el("span", "hint-text", intro.hint));
    const jump = link("#work", intro.jump, "hint-jump");
    jump.appendChild(el("span", "", " →"));
    hint.appendChild(jump);
    pin.appendChild(hint);

    section.appendChild(pin);
    return section;
  }

  /* ---------------------------------------------------------------------------
   * Section types — add a new renderer here to support a new `type`.
   * Each one receives the section data, the <section> node and the heading id.
   * ------------------------------------------------------------------------- */

  /** Title, lede and optional extras in one header row. */
  function sectionHead(section, headingId, extra) {
    const head = el("div", "section-head container");
    const text = el("div", "section-head-text");
    const h2 = el("h2", "section-title reveal", section.title);
    h2.id = headingId;
    text.appendChild(h2);
    if (section.lede) text.appendChild(el("p", "section-lede reveal", section.lede));
    head.appendChild(text);
    if (extra) head.appendChild(extra);
    return head;
  }

  /** The full case: shown in the dialog on screen and inline in print. */
  function caseFull(study) {
    const full = el("div", "case-full");
    full.appendChild(el("p", "case-meta", [study.org, study.period, study.scale].filter(Boolean).join("  ·  ")));
    full.appendChild(el("p", "case-body", study.body));
    full.appendChild(chips(study.stack));
    return full;
  }

  function renderCard(study, index) {
    const li = el("li", "card reveal");
    const card = el("article", "card-inner");
    card.setAttribute("aria-labelledby", "case-" + index);

    const frame = el("div", "card-art");
    frame.appendChild(art(study.art));
    if (study.year) frame.appendChild(el("span", "card-year", study.year));
    card.appendChild(frame);

    const body = el("div", "card-body");
    body.appendChild(el("p", "card-org", study.org + (study.period ? ", " + study.period : "")));
    const title = el("h3", "card-title", study.title);
    title.id = "case-" + index;
    body.appendChild(title);
    body.appendChild(el("p", "card-line", study.line));

    if (study.metric) {
      const metric = el("p", "card-metric");
      metric.appendChild(el("span", "metric-value", study.metric.value));
      metric.appendChild(el("span", "metric-label", study.metric.label));
      body.appendChild(metric);
    }
    if (study.second) {
      const second = el("p", "card-second");
      second.appendChild(el("strong", "", study.second.value));
      second.appendChild(document.createTextNode(" " + fill(study.second.label)));
      body.appendChild(second);
    }

    const open = el("button", "card-open");
    open.type = "button";
    open.appendChild(el("span", "", "Read the case"));
    const arrow = el("span", "card-arrow", "→");
    arrow.setAttribute("aria-hidden", "true");
    open.appendChild(arrow);
    open.setAttribute("aria-label", "Read the case: " + fill(study.title));
    body.appendChild(open);
    body.appendChild(caseFull(study));

    card.appendChild(body);
    li.appendChild(card);
    return li;
  }

  const renderers = {
    work: function (section, node, headingId) {
      const controls = el("div", "carousel-controls");
      [["prev", "←", "Previous"], ["next", "→", "Next"]].forEach(function (b) {
        const button = el("button", "round-btn carousel-" + b[0], b[1]);
        button.type = "button";
        button.setAttribute("aria-label", b[2] + " case study");
        controls.appendChild(button);
      });
      node.appendChild(sectionHead(section, headingId, controls));

      const track = el("ul", "work-track");
      track.setAttribute("role", "list");
      track.setAttribute("aria-label", fill(section.title));
      (section.items || []).forEach(function (study, i) { track.appendChild(renderCard(study, i)); });

      if (section.closing) {
        const li = el("li", "card card-closing reveal");
        const inner = el("div", "card-inner");
        const frame = el("div", "card-art");
        frame.appendChild(art(section.closing.art));
        inner.appendChild(frame);
        const body = el("div", "card-body");
        body.appendChild(el("p", "card-org", "Recognition"));
        body.appendChild(el("h3", "card-title", section.closing.title));
        body.appendChild(el("p", "card-line", section.closing.text));
        inner.appendChild(body);
        li.appendChild(inner);
        track.appendChild(li);
      }
      node.appendChild(track);
    },

    path: function (section, node, headingId) {
      node.appendChild(sectionHead(section, headingId));
      const grid = el("div", "path-grid container");

      const frame = el("div", "path-art");
      frame.setAttribute("aria-hidden", "true");
      (section.items || []).forEach(function (item, i) {
        frame.appendChild(art(item.art, "path-art-item" + (i === 0 ? " is-active" : "")));
      });
      grid.appendChild(frame);

      const list = el("ol", "path-list");
      (section.items || []).forEach(function (item, i) {
        const li = el("li", "path-item reveal" + (i === 0 ? " is-active" : ""));
        li.dataset.index = String(i);
        const mark = el("p", "path-mark", item.mark);
        mark.setAttribute("aria-hidden", "true");
        li.appendChild(mark);
        li.appendChild(el("p", "badge", item.years));
        li.appendChild(el("h3", "path-title", item.title));
        li.appendChild(el("p", "path-org", item.org));
        if (item.text) li.appendChild(el("p", "path-text", item.text));
        if (item.chips && item.chips.length) li.appendChild(chips(item.chips));
        list.appendChild(li);
      });
      grid.appendChild(list);
      node.appendChild(grid);
    },

    about: function (section, node, headingId) {
      const grid = el("div", "about-grid container");

      const figure = el("div", "about-figure reveal");
      figure.appendChild(art(section.art, "about-art"));
      (section.traits || []).forEach(function (trait) { figure.appendChild(el("span", "trait", trait)); });
      grid.appendChild(figure);

      const text = el("div", "about-text");
      const h2 = el("h2", "about-eyebrow", section.title);
      h2.id = headingId;
      text.appendChild(h2);
      if (section.headline) text.appendChild(el("p", "about-headline reveal", section.headline));
      (section.paragraphs || []).forEach(function (p) { text.appendChild(rich("p", "about-para reveal", p)); });

      if (section.stats && section.stats.length) {
        const stats = el("dl", "stats reveal");
        section.stats.forEach(function (s) {
          const cell = el("div", "stat");
          cell.appendChild(el("dt", "stat-label", s.label));
          cell.appendChild(el("dd", "stat-value", s.value));
          stats.appendChild(cell);
        });
        text.appendChild(stats);
      }

      if (section.skills && section.skills.length) {
        const skills = el("dl", "skills reveal");
        section.skills.forEach(function (group) {
          const row = el("div", "skill-row");
          row.appendChild(el("dt", "skill-name", group.name));
          const dd = el("dd");
          dd.appendChild(chips(group.items));
          row.appendChild(dd);
          skills.appendChild(row);
        });
        text.appendChild(skills);
      }
      grid.appendChild(text);
      node.appendChild(grid);
    },

    contact: function (section, node, headingId) {
      const inner = el("div", "container");
      const h2 = el("h2", "contact-title reveal", section.title);
      h2.id = headingId;
      inner.appendChild(h2);
      if (section.text) inner.appendChild(rich("p", "contact-text reveal", section.text));

      inner.appendChild(art("contact", "contact-art"));

      const row = el("div", "send-row");
      const send = el("button", "send-btn", "Send the packet");
      send.type = "button";
      row.appendChild(send);
      const status = el("p", "send-status");
      status.setAttribute("aria-live", "polite");
      row.appendChild(status);
      inner.appendChild(row);

      const links = el("ul", "contact-links");
      links.setAttribute("role", "list");
      (profile.links || []).forEach(function (l) {
        const li = el("li");
        const a = link(l.url, l.label);
        a.setAttribute("aria-label", l.label + ": " + (l.display || l.url) + (isExternal(l.url) ? " (opens in new tab)" : ""));
        if (isExternal(l.url)) {
          const ext = el("span", "ext", "↗");
          ext.setAttribute("aria-hidden", "true");
          a.appendChild(ext);
        }
        li.appendChild(a);
        links.appendChild(li);
      });
      inner.appendChild(links);

      const foot = el("footer", "site-foot");
      foot.appendChild(el("p", "", "© " + new Date().getFullYear() + " " + profile.name + ", " + String(profile.title || "").toLowerCase() + ". Plain HTML, CSS and JavaScript, no frameworks."));
      inner.appendChild(foot);
      node.appendChild(inner);
    },
  };

  function renderSection(section) {
    const render = renderers[section.type];
    if (!render) {
      console.warn('Unknown section type "' + section.type + '" for section "' + section.id + '" — skipped.');
      return null;
    }
    const node = el("section", "section " + section.type);
    node.id = section.id;
    node.setAttribute("aria-labelledby", section.id + "-title");
    render(section, node, section.id + "-title");
    return node;
  }

  /* ---------------------------------------------------------------------------
   * Page assembly
   * ------------------------------------------------------------------------- */

  function renderPage() {
    const main = document.getElementById("main");
    const menu = document.getElementById("nav-menu");
    const sections = (SITE.sections || []).filter(function (s) { return s && !s.hidden; });

    const mainFrag = document.createDocumentFragment();
    mainFrag.appendChild(renderStage(SITE.intro || {}));

    const navFrag = document.createDocumentFragment();
    sections.forEach(function (section) {
      const node = renderSection(section);
      if (!node) return;
      mainFrag.appendChild(node);
      if (section.nav !== false) {
        const li = el("li");
        li.appendChild(link("#" + section.id, section.nav || section.title));
        navFrag.appendChild(li);
      }
    });

    // The résumé is this page, printed; see the @media print block in style.css.
    const resume = el("li");
    const print = el("button", "nav-print", "Résumé");
    print.type = "button";
    print.setAttribute("aria-label", "Print or save the résumé as PDF");
    print.addEventListener("click", function () { window.print(); });
    resume.appendChild(print);
    navFrag.appendChild(resume);

    main.replaceChildren(mainFrag);
    menu.replaceChildren(navFrag);
    document.body.appendChild(el("dialog", "case-dialog"));

    document.querySelectorAll("[data-profile-name]").forEach(function (node) { node.textContent = profile.name; });
    document.querySelectorAll("[data-profile-title]").forEach(function (node) { node.textContent = profile.title; });
    document.querySelectorAll("[data-profile-initials]").forEach(function (node) { node.textContent = profile.initials; });
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
      if (event.target.closest("a, button")) setOpen(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });

    // Close the mobile menu if the viewport grows to desktop width.
    window.matchMedia("(min-width: 820px)").addEventListener("change", function (mq) {
      if (mq.matches) setOpen(false);
    });
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

    // Observe every section (including the intro) so scrolling back to the top clears the highlight.
    document.querySelectorAll("main section[id]").forEach(function (section) { observer.observe(section); });
  }

  /**
   * Scroll into the scene: while the intro is pinned, scrolling sets --p from
   * 0 to 1, which style.css uses to zoom towards the building in the clouds
   * and fade the headline. Off for reduced motion.
   */
  function setupStage() {
    const stage = document.querySelector(".stage");
    if (!stage || reduced) return;
    root.classList.add("js-scrolly");
    let queued = false;

    function update() {
      queued = false;
      const range = stage.offsetHeight - window.innerHeight;
      const p = range > 0 ? Math.min(1, Math.max(0, (window.scrollY - stage.offsetTop) / range)) : 0;
      stage.style.setProperty("--p", p.toFixed(4));
    }
    function queue() {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(update);
    }
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    update();
  }

  /**
   * Parcels of data riding the pipe from the island to the cloud. They fade in
   * at the warehouse and out at the cloud building. Pauses off-screen and in
   * background tabs; for reduced motion they sit still along the pipe.
   */
  function setupParcels() {
    const pipe = document.querySelector(".stage-scene .hero-pipe");
    const layer = document.querySelector(".stage-scene .hero-parcels");
    if (!pipe || !layer || !pipe.getTotalLength) return;

    const NS = "http://www.w3.org/2000/svg";
    const COLORS = ["#c8643b", "#f3a76b", "#9db3a0", "#7fa6d6"];
    const COUNT = 6;
    const DURATION = 9000; // ms for one parcel to travel the whole pipe
    const length = pipe.getTotalLength();
    const parcels = [];

    for (let i = 0; i < COUNT; i++) {
      const g = document.createElementNS(NS, "g");
      const box = document.createElementNS(NS, "rect");
      box.setAttribute("x", "-11");
      box.setAttribute("y", "-17");
      box.setAttribute("width", "22");
      box.setAttribute("height", "16");
      box.setAttribute("rx", "3");
      box.setAttribute("fill", COLORS[i % COLORS.length]);
      const tape = document.createElementNS(NS, "path");
      tape.setAttribute("d", "M-11 -10 H11");
      tape.setAttribute("stroke", "#fbf1e6");
      tape.setAttribute("stroke-width", "2");
      g.appendChild(box);
      g.appendChild(tape);
      layer.appendChild(g);
      parcels.push(g);
    }

    function place(t) {
      parcels.forEach(function (g, i) {
        const f = (t / DURATION + i / COUNT) % 1;
        const point = pipe.getPointAtLength(f * length);
        const fade = Math.min(1, f / 0.08, (1 - f) / 0.08);
        g.setAttribute("transform", "translate(" + point.x.toFixed(1) + " " + point.y.toFixed(1) + ")");
        g.setAttribute("opacity", fade.toFixed(2));
      });
    }

    place(0);
    if (reduced) return;

    let running = false;
    let visible = true;
    const start = performance.now();

    function frame(now) {
      if (!running) return;
      place(now - start);
      window.requestAnimationFrame(frame);
    }
    function update() {
      const shouldRun = visible && !document.hidden;
      if (shouldRun && !running) {
        running = true;
        window.requestAnimationFrame(frame);
      } else if (!shouldRun) {
        running = false;
      }
    }
    document.addEventListener("visibilitychange", update);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        update();
      }).observe(pipe.ownerSVGElement);
    }
    update();
  }

  /** Previous / next buttons for the work carousel, disabled at either end. */
  function setupCarousel() {
    const track = document.querySelector(".work-track");
    const prev = document.querySelector(".carousel-prev");
    const next = document.querySelector(".carousel-next");
    if (!track || !prev || !next) return;

    function step() {
      const card = track.querySelector(".card");
      const gap = parseFloat(getComputedStyle(track).columnGap) || 24;
      return card ? card.getBoundingClientRect().width + gap : 400;
    }
    function sync() {
      const max = track.scrollWidth - track.clientWidth - 2;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max;
    }
    prev.addEventListener("click", function () { track.scrollBy({ left: -step(), behavior: reduced ? "auto" : "smooth" }); });
    next.addEventListener("click", function () { track.scrollBy({ left: step(), behavior: reduced ? "auto" : "smooth" }); });
    track.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    sync();
  }

  /** "Read the case" opens the full case study in a modal dialog. */
  function setupCaseDialog() {
    const dialog = document.querySelector(".case-dialog");
    if (!dialog || typeof dialog.showModal !== "function") {
      // No <dialog> support: show the full case inline instead.
      document.querySelectorAll(".card-open").forEach(function (button) {
        button.addEventListener("click", function () {
          button.parentNode.querySelector(".case-full").classList.toggle("is-open");
        });
      });
      return;
    }

    dialog.setAttribute("aria-labelledby", "case-dialog-title");
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) dialog.close(); // click on the backdrop
    });

    document.querySelectorAll(".card-open").forEach(function (button) {
      button.addEventListener("click", function () {
        const card = button.closest(".card-inner");
        const inner = el("div", "case-dialog-inner");

        const close = el("button", "round-btn case-close", "×");
        close.type = "button";
        close.setAttribute("aria-label", "Close");
        close.addEventListener("click", function () { dialog.close(); });
        inner.appendChild(close);

        inner.appendChild(el("p", "card-org", card.querySelector(".card-org").textContent));
        const title = el("h3", "case-dialog-title", card.querySelector(".card-title").textContent);
        title.id = "case-dialog-title";
        inner.appendChild(title);
        inner.appendChild(card.querySelector(".case-full").cloneNode(true));

        dialog.replaceChildren(inner);
        dialog.showModal();
        close.focus();
      });
    });
  }

  /** The path's illustration follows whichever entry is in the middle of the screen. */
  function setupPath() {
    const items = document.querySelectorAll(".path-item");
    const arts = document.querySelectorAll(".path-art-item");
    if (!items.length || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const index = Number(entry.target.dataset.index);
        items.forEach(function (item, i) { item.classList.toggle("is-active", i === index); });
        arts.forEach(function (a, i) { a.classList.toggle("is-active", i === index); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    items.forEach(function (item) { observer.observe(item); });
  }

  /**
   * "Send the packet": a parcel travels down the pipe to the mailbox, the flag
   * goes up, and the email address is copied to the clipboard.
   */
  function setupContact() {
    const button = document.querySelector(".send-btn");
    const status = document.querySelector(".send-status");
    const scene = document.querySelector(".contact-art");
    const pipe = scene && scene.querySelector(".contact-pipe");
    const packet = scene && scene.querySelector(".contact-packet");
    if (!button || !status || !pipe || !packet) return;
    const length = pipe.getTotalLength();

    function delivered() {
      scene.classList.add("is-delivered");
      packet.setAttribute("opacity", "0");
      button.disabled = false;
      button.textContent = "Send another";

      function report(copied) {
        status.replaceChildren(document.createTextNode(copied ? "Delivered. My email is on your clipboard: " : "Delivered. My email is "));
        status.appendChild(link("mailto:" + tokens.email, tokens.email));
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(tokens.email).then(function () { report(true); }, function () { report(false); });
      } else {
        report(false);
      }
    }

    button.addEventListener("click", function () {
      scene.classList.remove("is-delivered");
      status.textContent = "On its way…";
      button.disabled = true;
      if (reduced) {
        delivered();
        return;
      }
      const start = performance.now();
      const DURATION = 1800;
      packet.setAttribute("opacity", "1");
      (function tick(now) {
        const t = Math.min(1, (now - start) / DURATION);
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const point = pipe.getPointAtLength(eased * length);
        packet.setAttribute("transform", "translate(" + point.x.toFixed(1) + " " + point.y.toFixed(1) + ")");
        if (t < 1) window.requestAnimationFrame(tick);
        else delivered();
      })(start);
    });
  }

  /** Fade content up as it scrolls into view (skipped for reduced motion). */
  function setupReveal() {
    if (reduced || !("IntersectionObserver" in window)) return;
    root.classList.add("js-reveal");

    const observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    document.querySelectorAll(".reveal").forEach(function (node) { observer.observe(node); });
  }

  renderPage();
  setupNav();
  setupActiveSection();
  setupStage();
  setupParcels();
  setupCarousel();
  setupCaseDialog();
  setupPath();
  setupContact();
  setupReveal();

  // Honour a #hash in the URL now that the target sections exist.
  if (location.hash.length > 1) {
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) target.scrollIntoView();
  }
})();
