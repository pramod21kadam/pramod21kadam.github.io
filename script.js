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
      a.setAttribute("aria-label", fill(text) + " (opens in new tab)");
    }
    return a;
  }

  /** Inline list of profile links, used in the intro strip and the contact section. */
  function linkList(className) {
    const list = el("ul", className);
    list.setAttribute("role", "list");
    (profile.links || []).forEach(function (l) {
      const li = el("li");
      const a = link(l.url, l.display || l.url);
      if (isExternal(l.url)) a.setAttribute("aria-label", l.label + ": " + (l.display || l.url) + " (opens in new tab)");
      li.appendChild(el("span", "link-label", l.label));
      li.appendChild(a);
      list.appendChild(li);
    });
    return list;
  }

  /* ---------------------------------------------------------------------------
   * Intro strip
   * ------------------------------------------------------------------------- */

  function renderIntro(intro) {
    const section = el("section", "intro");
    section.id = "top";
    section.setAttribute("aria-labelledby", "intro-title");

    const inner = el("div", "container intro-inner");
    if (profile.title) {
      inner.appendChild(el("p", "intro-role", profile.title + (profile.employer ? " at " + profile.employer : "")));
    }

    const h1 = el("h1", "intro-name", profile.name);
    h1.id = "intro-title";
    inner.appendChild(h1);

    if (intro.summary) inner.appendChild(el("p", "intro-summary", intro.summary));

    // Short "Email ›  LinkedIn ›  GitHub ›" row; the full addresses are in the contact section.
    const links = el("ul", "intro-links");
    links.setAttribute("role", "list");
    (profile.links || []).forEach(function (l) {
      const li = el("li");
      const a = link(l.url, l.label, "chevron");
      a.setAttribute("aria-label", l.label + ": " + (l.display || l.url) + (isExternal(l.url) ? " (opens in new tab)" : ""));
      li.appendChild(a);
      links.appendChild(li);
    });
    inner.appendChild(links);
    section.appendChild(inner);

    if (intro.flow) section.appendChild(renderFlow(intro.flow));
    if (intro.figures && intro.figures.length) section.appendChild(renderFigures(intro.figures));
    return section;
  }

  /** Canvas for the data-flow animation (drawn by setupFlow) with its stage captions. */
  function renderFlow(flow) {
    const wrap = el("div", "flow container");
    wrap.setAttribute("role", "img");
    wrap.setAttribute("aria-label", "Animation: scattered raw records pass through a transform step and come out as ordered rows.");
    wrap.appendChild(el("canvas", "flow-canvas"));
    const captions = el("div", "flow-stages");
    captions.setAttribute("aria-hidden", "true");
    (flow.stages || []).forEach(function (stage) { captions.appendChild(el("span", "", stage)); });
    wrap.appendChild(captions);
    return wrap;
  }

  /** Key figures: a band of big numbers, each with a one-line label. */
  function renderFigures(figures) {
    const list = el("dl", "figures container");
    figures.forEach(function (figure) {
      const row = el("div", "figure reveal");
      row.appendChild(el("dt", "figure-label", figure.label));
      row.appendChild(el("dd", "figure-value", figure.value));
      list.appendChild(row);
    });
    return list;
  }

  /* ---------------------------------------------------------------------------
   * Section types — add a new renderer here to support a new `type`.
   * ------------------------------------------------------------------------- */

  /** A rounded tile: small eyebrow, title, big figure, then body text. */
  function tile(eyebrow, title, figure, body, className) {
    const node = el("article", "tile reveal" + (className ? " " + className : ""));
    if (eyebrow) node.appendChild(el("p", "tile-eyebrow", eyebrow));
    node.appendChild(el("h4", "tile-title", title));
    if (figure) node.appendChild(el("p", "tile-figure", figure));
    if (body) node.appendChild(el("p", "tile-body", body));
    return node;
  }

  /** One case study: the tools, what the work was, at what scale, and what was done. */
  function renderCaseStudy(study) {
    return tile((study.stack || []).join(" · "), study.title, study.scale, study.body, "case");
  }

  function renderRecognition(r) {
    return tile("Recognition", r.name, r.year, r.note, "award");
  }

  const renderers = {
    text: function (section, body) {
      const prose = el("div", "prose");
      (section.paragraphs || []).forEach(function (p) { prose.appendChild(el("p", "", p)); });
      body.appendChild(prose);
    },

    tags: function (section, body) {
      const grid = el("dl", "skill-grid");
      (section.groups || []).forEach(function (group) {
        const cell = el("div", "skill-group reveal");
        cell.appendChild(el("dt", "", group.name));
        const dd = el("dd");
        const list = el("ul", "skill-items");
        list.setAttribute("role", "list");
        (group.items || []).forEach(function (item) { list.appendChild(el("li", "", item)); });
        dd.appendChild(list);
        cell.appendChild(dd);
        grid.appendChild(cell);
      });
      body.appendChild(grid);
    },

    timeline: function (section, body) {
      const list = el("ol", "timeline");
      (section.items || []).forEach(function (item) {
        const li = el("li", "role");

        const head = el("div", "role-head reveal");
        head.appendChild(el("p", "role-period", item.period));
        head.appendChild(el("h3", "role-org", item.org));
        const title = [item.title, item.level ? item.level + " level" : ""].filter(Boolean).join(" · ");
        head.appendChild(el("p", "role-title", title));
        (item.notes || []).forEach(function (note) { head.appendChild(el("p", "role-note", note)); });
        li.appendChild(head);

        if (item.summary) li.appendChild(el("p", "role-summary", item.summary));

        const tiles = (item.caseStudies || []).map(renderCaseStudy)
          .concat((item.recognition || []).map(renderRecognition));
        if (tiles.length) {
          const grid = el("div", "tile-grid");
          tiles.forEach(function (t) { grid.appendChild(t); });
          li.appendChild(grid);
        }

        list.appendChild(li);
      });
      body.appendChild(list);
    },

    contact: function (section, body) {
      if (section.intro) body.appendChild(el("p", "section-lede", section.intro));
      body.appendChild(linkList("contact-list"));
    },
  };

  function renderSection(section) {
    const render = renderers[section.type];
    if (!render) {
      console.warn('Unknown section type "' + section.type + '" for section "' + section.id + '" — skipped.');
      return null;
    }

    const node = el("section", "section section-" + section.type);
    node.id = section.id;
    node.setAttribute("aria-labelledby", section.id + "-title");

    const inner = el("div", "container");
    const h2 = el("h2", "section-title reveal", section.title);
    h2.id = section.id + "-title";
    inner.appendChild(h2);

    render(section, inner);
    node.appendChild(inner);
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
    mainFrag.appendChild(renderIntro(SITE.intro || {}));

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
    window.matchMedia("(min-width: 720px)").addEventListener("change", function (mq) {
      if (mq.matches) setOpen(false);
    });
  }

  /**
   * Light/dark toggle. With no saved choice the site follows the system setting;
   * pressing the button saves the visitor's choice in localStorage.
   */
  function setupThemeToggle() {
    const button = document.querySelector(".theme-toggle");
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)");
    const metas = document.querySelectorAll('meta[name="theme-color"]');

    function effectiveTheme() {
      const chosen = root.getAttribute("data-theme");
      if (chosen === "light" || chosen === "dark") return chosen;
      return systemDark.matches ? "dark" : "light";
    }

    function sync() {
      const theme = effectiveTheme();
      root.setAttribute("data-theme-active", theme);
      if (button) button.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
      if (root.hasAttribute("data-theme")) {
        const bg = getComputedStyle(root).getPropertyValue("--bg").trim();
        metas.forEach(function (m) { m.setAttribute("content", bg); });
      }
    }

    if (button) {
      button.addEventListener("click", function () {
        const next = effectiveTheme() === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", next);
        try { localStorage.setItem("theme", next); } catch (e) { /* storage unavailable: choice lasts this visit */ }
        sync();
      });
    }
    systemDark.addEventListener("change", sync);
    sync();
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

  /** Fade content up as it scrolls into view (skipped for reduced motion). */
  function setupReveal() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
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

  /**
   * Data-flow animation: dots of mixed size drift in from the left (raw records),
   * pass through the transform stage in the middle, leave as uniform blocks in
   * fixed lanes (rows), and are stored in the warehouse cylinder on the right,
   * which glows as rows arrive. Pauses off-screen and in background tabs; for
   * reduced motion it draws one still frame.
   */
  function setupFlow() {
    const canvas = document.querySelector(".flow-canvas");
    const ctx = canvas && canvas.getContext("2d");
    if (!ctx) return;

    const LANES = 4;
    const ROW_SPEED = 80; // px per second
    const ROW_GAP = 18;   // px between rows in a lane
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let colors = {};
    let records = [];
    let laneTail = [];
    let glow = 0; // warehouse highlight, bumped by each stored row and fading out
    let untilSpawn = 0;
    let running = false;
    let visible = false;
    let last = 0;

    function readColors() {
      const style = getComputedStyle(root);
      ["text", "muted", "accent", "hairline"].forEach(function (name) {
        colors[name] = style.getPropertyValue("--" + name).trim();
      });
    }

    function stage() {
      const w = Math.max(44, Math.min(80, width * 0.1));
      return { x: (width - w) / 2, w: w };
    }

    function warehouse() {
      const w = Math.max(40, Math.min(64, width * 0.07));
      const ry = w * 0.2;
      return { x: width - w, w: w, ry: ry, top: 2 + ry, bottom: height - 2 - ry };
    }

    function laneY(lane) {
      const pad = height * 0.2;
      return pad + lane * (height - 2 * pad) / (LANES - 1);
    }

    function spawn() {
      records.push({
        x: -6,
        y: 6 + Math.random() * (height - 12),
        r: 1.2 + Math.random() * 2.6,
        speed: 34 + Math.random() * 40,
        phase: Math.random() * Math.PI * 2,
        lane: Math.floor(Math.random() * LANES),
        alpha: 0.3 + Math.random() * 0.5,
      });
    }

    function step(dt) {
      const s = stage();
      untilSpawn -= dt;
      while (untilSpawn <= 0) {
        spawn();
        untilSpawn += 0.07 * 900 / Math.max(width, 320);
      }
      records.forEach(function (rec) {
        if (rec.out) {
          rec.x += ROW_SPEED * dt;
        } else if (rec.x < s.x) {
          rec.x += rec.speed * dt;
          rec.phase += dt * 2;
          rec.y += Math.sin(rec.phase) * 10 * dt;
        } else if (rec.x < s.x + s.w) {
          rec.x += 56 * dt;
          rec.y += (laneY(rec.lane) - rec.y) * Math.min(1, 6 * dt);
        } else {
          // Leaving the stage: queue behind the previous row in this lane so rows are evenly spaced.
          rec.out = true;
          rec.y = laneY(rec.lane);
          const tail = laneTail[rec.lane];
          if (tail && tail.x - ROW_GAP < rec.x) rec.x = tail.x - ROW_GAP;
          laneTail[rec.lane] = rec;
        }
      });
      // Rows reaching the warehouse are stored (removed, with a glow); also drop any
      // backlog that would spill back out of the stage.
      const storeAt = warehouse().x + 8;
      glow = Math.max(0, glow - dt * 2.5);
      records = records.filter(function (rec) {
        if (rec.out && rec.x >= storeAt) {
          glow = Math.min(1, glow + 0.3);
          return false;
        }
        return !(rec.out && rec.x < s.x);
      });
    }

    function roundRect(x, y, w, h, r) {
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, y, w, h, r);
      else ctx.rect(x, y, w, h);
    }

    /** Database cylinder: body, front arcs for the disk bands, and a full top cap. */
    function drawWarehouse() {
      const c = warehouse();
      const cx = c.x + c.w / 2;
      const rx = c.w / 2;

      ctx.beginPath();
      ctx.moveTo(c.x, c.top);
      ctx.lineTo(c.x, c.bottom);
      ctx.ellipse(cx, c.bottom, rx, c.ry, 0, Math.PI, 0, true);
      ctx.lineTo(c.x + c.w, c.top);
      ctx.ellipse(cx, c.top, rx, c.ry, 0, 0, Math.PI, false);
      ctx.closePath();
      ctx.fillStyle = colors.accent;
      ctx.globalAlpha = 0.08 + 0.14 * glow;
      ctx.fill();
      ctx.strokeStyle = colors.accent;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.5 + 0.3 * glow;
      ctx.stroke();

      // Disk bands
      ctx.globalAlpha = 0.3 + 0.3 * glow;
      for (let k = 1; k < 3; k++) {
        const y = c.top + (c.bottom - c.top) * k / 3;
        ctx.beginPath();
        ctx.ellipse(cx, y, rx, c.ry, 0, Math.PI, 0, true);
        ctx.stroke();
      }

      // Top cap
      ctx.beginPath();
      ctx.ellipse(cx, c.top, rx, c.ry, 0, 0, Math.PI * 2);
      ctx.globalAlpha = 0.14 + 0.3 * glow;
      ctx.fill();
      ctx.globalAlpha = 0.5 + 0.3 * glow;
      ctx.stroke();
    }

    function draw() {
      const s = stage();
      const store = warehouse();
      ctx.clearRect(0, 0, width, height);

      // Output lanes, from the stage to the warehouse
      ctx.globalAlpha = 1;
      ctx.strokeStyle = colors.hairline;
      ctx.lineWidth = 1;
      for (let i = 0; i < LANES; i++) {
        ctx.beginPath();
        ctx.moveTo(s.x + s.w, Math.round(laneY(i)) + 0.5);
        ctx.lineTo(store.x, Math.round(laneY(i)) + 0.5);
        ctx.stroke();
      }

      // Transform stage
      roundRect(s.x, 2, s.w, height - 4, 16);
      ctx.fillStyle = colors.accent;
      ctx.globalAlpha = 0.08;
      ctx.fill();
      ctx.globalAlpha = 0.45;
      ctx.strokeStyle = colors.accent;
      ctx.stroke();

      records.forEach(function (rec) {
        if (!rec.out && rec.x < s.x + s.w / 2) {
          ctx.globalAlpha = rec.alpha;
          ctx.fillStyle = colors.muted;
          ctx.beginPath();
          ctx.arc(rec.x, rec.y, rec.r, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Fade rows out as they slide into the warehouse.
          const fade = Math.max(0, Math.min(1, (store.x + 8 - rec.x) / 18));
          ctx.globalAlpha = (rec.lane === 0 ? 0.95 : 0.3 + rec.lane * 0.12) * fade;
          ctx.fillStyle = rec.lane === 0 ? colors.accent : colors.text;
          roundRect(rec.x - 6, rec.y - 2.5, 12, 5, 2.5);
          ctx.fill();
        }
      });

      drawWarehouse();
      ctx.globalAlpha = 1;
    }

    /** Put each caption under its part of the drawing. */
    function placeCaptions() {
      const captions = canvas.parentNode.querySelectorAll(".flow-stages span");
      const s = stage();
      const store = warehouse();
      const centres = [null, s.x + s.w / 2, (s.x + s.w + store.x) / 2, null];
      captions.forEach(function (caption, i) {
        if (centres[i] != null) caption.style.left = centres[i] + "px";
      });
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      // Mobile browsers fire resize when the address bar hides; only restart on a real size change.
      if (rect.width === width && rect.height === height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Pre-run so the stream is already flowing on first paint.
      records = [];
      laneTail = [];
      for (let i = 0; i < 900; i++) step(1 / 60);
      draw();
      placeCaptions();
    }

    function frame(now) {
      if (!running) return;
      step(Math.min(0.05, (now - last) / 1000));
      last = now;
      draw();
      window.requestAnimationFrame(frame);
    }

    function update() {
      const shouldRun = !reduced && visible && !document.hidden;
      if (shouldRun && !running) {
        running = true;
        last = performance.now();
        window.requestAnimationFrame(frame);
      } else if (!shouldRun) {
        running = false;
      }
    }

    readColors();
    resize();

    window.addEventListener("resize", resize);
    // Theme changes: setupThemeToggle updates data-theme-active on <html>.
    new MutationObserver(function () { readColors(); draw(); })
      .observe(root, { attributes: true, attributeFilter: ["data-theme-active"] });

    if (reduced) return;
    document.addEventListener("visibilitychange", update);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        update();
      }).observe(canvas);
    } else {
      visible = true;
      update();
    }
  }

  /** Key figures under 1000 count up from zero when they scroll into view. */
  function setupCountUp() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        obs.unobserve(entry.target);
        const shown = entry.target.querySelector("[data-count]");
        const m = shown.dataset.count.match(/^(\D*)(\d+)(.*)$/);
        const target = Number(m[2]);
        const start = performance.now();
        (function tick(now) {
          const t = Math.min(1, (now - start) / 1400);
          const eased = 1 - Math.pow(1 - t, 3);
          shown.textContent = m[1] + Math.round(target * eased) + m[3];
          if (t < 1) window.requestAnimationFrame(tick);
        })(start);
      });
    }, { threshold: 0.6 });

    document.querySelectorAll(".figure-value").forEach(function (node) {
      const value = node.textContent;
      const m = value.match(/^(\D*)(\d+)(.*)$/);
      if (!m || Number(m[2]) >= 1000) return; // leave years as they are
      // Screen readers get the final value; the animated copy is hidden from them.
      node.replaceChildren();
      const shown = el("span");
      shown.dataset.count = value;
      shown.setAttribute("aria-hidden", "true");
      shown.textContent = m[1] + "0" + m[3];
      node.appendChild(shown);
      node.appendChild(el("span", "visually-hidden", value));
      observer.observe(node);
    });
  }

  function setYear() {
    const year = document.getElementById("year");
    if (year) year.textContent = String(new Date().getFullYear());
  }

  renderPage();
  setupNav();
  setupThemeToggle();
  setupActiveSection();
  setupReveal();
  setupFlow();
  setupCountUp();
  setYear();

  // Honour a #hash in the URL now that the target sections exist.
  if (location.hash.length > 1) {
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) target.scrollIntoView();
  }
})();
