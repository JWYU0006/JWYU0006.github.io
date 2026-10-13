// Renders the portfolio from content/site.js and content/projects.js.
// Content edits never need changes here.

const S = window.SITE || {};
const P = window.PROJECTS || [];

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// Splits text on blank lines into paragraphs.
const paras = (t) =>
  (Array.isArray(t) ? t : String(t ?? "").split(/\n\s*\n/))
    .filter((x) => x.trim())
    .map((x) => `<p>${esc(x)}</p>`)
    .join("");

// Stable placeholder colour per project, so empty thumbnails still look intentional.
const HUES = ["#3b5368,#7a8c6a", "#4a3b5e,#b0623a", "#24434a,#3e7f86", "#55452f,#a38a52", "#2e3550,#5868a8", "#40323a,#8f5d6b"];
const phStyle = (key) => {
  let h = 0;
  for (const c of String(key)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return `background:linear-gradient(135deg,${HUES[h % HUES.length]})`;
};

const projectUrl = (p) => p.link || `project.html?id=${encodeURIComponent(p.id)}`;
const isExternal = (p) => Boolean(p.link);

const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// Silent looping clip. Autoplays unless the viewer prefers reduced motion.
function clip(src, cls = "", poster = "") {
  const auto = reduceMotion ? "controls" : "autoplay";
  return `<video class="${cls}" src="${esc(src)}" ${auto} muted loop playsinline preload="metadata"${poster ? ` poster="${esc(poster)}"` : ""}></video>`;
}

function thumb(p, label = "") {
  if (p.thumbVideo)
    return `<video class="thumb" src="${esc(p.thumbVideo)}" muted loop playsinline preload="metadata"${p.thumb ? ` poster="${esc(p.thumb)}"` : ""} data-hover></video>`;
  if (!p.thumb) return `<div class="thumb ph" style="${phStyle(p.id)}">${esc(label)}</div>`;
  const gif = p.thumbGif ? ` data-gif="${esc(p.thumbGif)}" data-still="${esc(p.thumb)}"` : "";
  return `<img class="thumb" src="${esc(p.thumb)}" alt="" loading="lazy"${gif}>`;
}

function renderChrome(onHome) {
  const base = onHome ? "" : "index.html";
  const sectionLinks = (S.sections || [])
    .filter((s) => P.some((p) => p.featured !== false && p.category === s.id))
    .map((s) => `<a class="link" href="${base}#${esc(s.id)}">${esc(s.nav || s.title)}</a>`)
    .join("");
  const hasMore = P.some((p) => p.featured === false);
  document.getElementById("nav").innerHTML = `<div class="wrap">
    <a class="brand" href="${base || "./"}">${esc(S.name)}</a>
    ${sectionLinks}
    ${hasMore ? `<a class="link" href="${base}#more">More Work</a>` : ""}
    <a class="link" href="${base}#about">About</a>
    ${resumeButton("cv", "Resume")}
    <button class="theme-toggle" type="button" id="theme-toggle"></button>
  </div>`;
  wireTheme();

  if (S.showDraftBanner) {
    document.getElementById("banner").innerHTML =
      `<div class="banner">Work in progress: some projects below are placeholders.</div>`;
  }

  const year = new Date().getFullYear();
  document.getElementById("footer").innerHTML =
    `© ${year} ${esc(S.name)}${S.email ? ` · ${esc(S.email)}` : ""}`;
}

// Light / dark switch. The choice is remembered; otherwise the system setting is used.
function currentTheme() {
  return document.documentElement.dataset.theme ||
    (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
}
function wireTheme() {
  const btn = document.getElementById("theme-toggle");
  const paint = () => {
    const dark = currentTheme() === "dark";
    btn.textContent = dark ? "☀" : "☾";
    btn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    btn.title = btn.getAttribute("aria-label");
  };
  btn.addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
    paint();
  });
  paint();
}

// Left "On this page" sidebar. Items: { id, label } or { group } for a small heading.
function tocNav(items) {
  let inGroup = false;
  return `<nav class="toc" aria-label="On this page"><h3>On this page</h3><ul>${items
    .map((t) => {
      if (t.group) { inGroup = true; return `<li class="toc-group">${esc(t.group)}</li>`; }
      return `<li${inGroup ? ` class="toc-sub"` : ""}><a href="#${t.id}" data-toc="${t.id}">${esc(t.label)}</a></li>`;
    })
    .join("")}</ul></nav>`;
}

// One resume: a direct link. Several: a button that opens a menu, one entry per role.
function resumeButton(cls, text) {
  const list = (S.resumes || []).filter((r) => r && r.file);
  if (!list.length) return "";
  if (list.length === 1)
    return `<a class="${cls}" href="${esc(list[0].file)}" target="_blank" rel="noopener">${esc(text)}</a>`;
  return `<details class="cv-menu"><summary class="${cls}">${esc(text)} <span aria-hidden="true">▾</span></summary>
    <div class="cv-pop"><span class="cv-pop-title">Choose a version</span>${list
      .map((r) => `<a href="${esc(r.file)}" target="_blank" rel="noopener">${esc(r.label)}</a>`)
      .join("")}</div></details>`;
}

function contactButtons() {
  const items = [
    resumeButton("btn primary", "Resume (PDF)"),
    S.linkedin && `<a class="btn" href="${esc(S.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>`,
    S.github && `<a class="btn" href="${esc(S.github)}" target="_blank" rel="noopener">GitHub</a>`,
    S.itch && `<a class="btn" href="${esc(S.itch)}" target="_blank" rel="noopener">itch.io</a>`,
    S.artstation && `<a class="btn" href="${esc(S.artstation)}" target="_blank" rel="noopener">ArtStation</a>`,
    S.email && `<button class="btn" type="button" data-copy="${esc(S.email)}">${esc(S.email)}</button>`,
  ];
  return `<div class="links">${items.filter(Boolean).join("")}</div>`;
}

function card(p) {
  const target = isExternal(p) ? ` target="_blank" rel="noopener"` : "";
  return `<a class="card" href="${esc(projectUrl(p))}"${target}>
    ${thumb(p)}
    <div class="card-body">
      <h3>${esc(p.title)}</h3>
      ${p.summary ? `<p>${esc(p.summary)}</p>` : ""}
      ${p.tags?.length ? `<div class="tags">${p.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>` : ""}
    </div>
  </a>`;
}

function renderHome() {
  renderChrome(true);
  const featured = P.filter((p) => p.featured !== false);
  const more = P.filter((p) => p.featured === false);

  const sections = (S.sections || [])
    .map((s) => {
      const items = featured.filter((p) => p.category === s.id);
      if (!items.length) return "";
      return `<section class="section" id="${esc(s.id)}">
        <div class="section-head"><h2>${esc(s.title)}</h2><span>${items.length} project${items.length > 1 ? "s" : ""}</span></div>
        <div class="grid">${items.map(card).join("")}</div>
      </section>`;
    })
    .join("");

  const moreHtml = more.length
    ? `<section class="section" id="more">
        <div class="section-head"><h2>More Work</h2><span>Game jams, coursework and smaller projects</span></div>
        <div class="more">${more
          .map((p) => {
            const target = isExternal(p) ? ` target="_blank" rel="noopener"` : "";
            return `<a class="mini" href="${esc(projectUrl(p))}"${target}>${thumb(p)}<div><b>${esc(p.title)}</b>${esc(p.summary)}</div></a>`;
          })
          .join("")}</div>
      </section>`
    : "";

  const toc = [{ id: "top", label: "Intro" }];
  (S.sections || []).forEach((s) => {
    if (featured.some((p) => p.category === s.id)) toc.push({ id: s.id, label: s.nav || s.title });
  });
  if (more.length) toc.push({ id: "more", label: "More Work" });
  toc.push({ id: "about", label: "About" });

  const el = document.getElementById("home");
  el.classList.add("has-side");
  el.innerHTML = `
    ${tocNav(toc)}
    <div class="home-main">
    <section class="hero" id="top">
      <div class="eyebrows">
        <span class="eyebrow">${esc(S.role)}</span>
        ${S.status ? `<span class="status">${esc(S.status)}</span>` : ""}
      </div>
      <h1>${esc(S.headline)}</h1>
      <div class="intro">
        ${S.school ? `<p class="school">${esc(S.school)}</p>` : ""}
        <p>${esc(S.intro)}</p>
      </div>
      ${contactButtons()}
    </section>
    ${sections}
    ${moreHtml}
    <section class="section" id="about">
      <div class="section-head"><h2>About</h2></div>
      <div class="about">${paras(S.about)}</div>
      ${(S.skills || []).length ? `<dl class="skills">${S.skills
        .map((g) => `<div><dt>${esc(g.label)}</dt><dd>${(g.items || []).map((i) => `<span class="tag">${esc(i)}</span>`).join("")}</dd></div>`)
        .join("")}</dl>` : ""}
      <div style="margin-top:18px">${contactButtons()}</div>
    </section>
    </div>
    <div class="side-spacer"></div>`;
  wire();
  wireToc();
}

function youtube(id, title) {
  return `<div class="embed"><iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?rel=0"
    title="${esc(title)}" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe></div>`;
}

// Media beside a section: an MP4 loop, an image, or (while drafting) a labelled placeholder.
function sideMedia(s) {
  if (s.clip) return clip(s.clip, "section-clip", s.image);
  if (s.image) return `<img class="section-img" src="${esc(s.image)}" alt="${esc(s.mediaLabel || s.heading || "")}" loading="lazy">`;
  if (S.showDraftBanner && s.mediaLabel) return `<div class="embed ph">Clip: ${esc(s.mediaLabel)}</div>`;
  return "";
}
const withMedia = (s, text) => {
  const media = sideMedia(s);
  return media ? `<div class="split"><div class="split-text">${text}</div><div class="split-media">${media}</div></div>` : text;
};
const bullets = (items) => (items?.length ? `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>` : "");

const SECTION = {
  // Bold takeaway, then bullets, with optional media beside it.
  point: (s) => withMedia(s, `${s.lead ? `<p class="lead">${esc(s.lead)}</p>` : ""}${bullets(s.bullets)}${s.body ? paras(s.body) : ""}`),
  // Problem → solution → result.
  story: (s) =>
    withMedia(
      s,
      `${s.lead ? `<p class="lead">${esc(s.lead)}</p>` : ""}${bullets(s.bullets)}<dl class="story">${[
        ["Problem", s.problem],
        ["Solution", s.solution],
        ["Result", s.result],
      ]
        .filter(([, v]) => v)
        .map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`)
        .join("")}</dl>`,
    ),
  text: (s) => paras(s.body),
  clip: (s) => clip(s.src, "section-clip") + (s.caption ? `<p class="caption">${esc(s.caption)}</p>` : ""),
  list: (s) => `<div class="callout"><ul>${(s.items || []).map((i) => `<li>${esc(i)}</li>`).join("")}</ul></div>`,
  code: (s) =>
    `<pre><code>${esc(s.code)}</code></pre>${s.link ? `<p class="caption"><a href="${esc(s.link)}" target="_blank" rel="noopener">Full source on GitHub →</a></p>` : ""}`,
  video: (s) => (s.youtube ? youtube(s.youtube, s.heading || "Video") : "") + (s.caption ? `<p class="caption">${esc(s.caption)}</p>` : ""),
  images: (s) =>
    `<div class="gallery">${(s.images || [])
      .map((i) => `<figure><img src="${esc(i.src)}" alt="${esc(i.caption || "")}" loading="lazy">${i.caption ? `<figcaption>${esc(i.caption)}</figcaption>` : ""}</figure>`)
      .join("")}</div>`,
  map: (s) => {
    const pins = (s.pins || [])
      .map((p, i) => `<span class="pin" style="left:${+p.x}%;top:${+p.y}%">${i + 1}</span>`)
      .join("");
    const legend = (s.pins || []).map((p, i) => `<li><b>${i + 1}</b>${esc(p.label)}</li>`).join("");
    const img = s.image ? `<img src="${esc(s.image)}" alt="${esc(s.heading || "Level map")}">` : "";
    return `<div class="map${s.image ? "" : " ph"}">${img}${pins}</div><ul class="legend">${legend}</ul>`;
  },
  compare: (s, i) => {
    const layer = (src, label, cls) =>
      src
        ? `<img class="layer ${cls}" src="${esc(src)}" alt="${esc(label)}">`
        : `<div class="layer ph ${cls}" style="${cls === "before" ? "background:repeating-linear-gradient(0deg,#7d838c 0 38px,#8b929b 38px 40px)" : phStyle(label)}"></div>`;
    const b = s.beforeLabel || "Before";
    const a = s.afterLabel || "After";
    return `<div class="compare" data-compare>
      ${layer(s.after, a, "after")}
      ${layer(s.before, b, "before")}
      <span class="label" style="left:10px">${esc(b)}</span>
      <span class="label" style="right:10px">${esc(a)}</span>
      <span class="handle"></span>
      <input type="range" min="0" max="100" value="50" aria-label="Compare ${esc(b)} and ${esc(a)}" id="cmp-${i}">
    </div>`;
  },
};

function renderProject() {
  renderChrome(false);
  const id = new URLSearchParams(location.search).get("id");
  const idx = P.findIndex((p) => p.id === id);
  const el = document.getElementById("project");
  if (idx < 0) {
    el.innerHTML = `<div class="notfound"><h1>Project not found</h1><p><a class="btn primary" href="index.html">Back to portfolio</a></p></div>`;
    return;
  }
  const p = P[idx];
  document.title = `${p.title} · ${S.name}`;
  const sectionTitle = (S.sections || []).find((s) => s.id === p.category)?.title || "";
  const backHref = p.featured === false ? "index.html#more" : `index.html#${p.category}`;

  const meta = Object.entries(p.meta || {})
    .filter(([, v]) => v)
    .map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`)
    .join("");

  const heroMedia = p.youtube
    ? youtube(p.youtube, p.title)
    : p.clip
      ? clip(p.clip, "hero-clip", p.heroImage)
    : p.heroImage
      ? `<img class="thumb" style="border-radius:8px" src="${esc(p.heroImage)}" alt="">`
      : S.showDraftBanner
        ? `<div class="embed ph">Full playthrough video goes here (YouTube ID or MP4)</div>`
        : "";
  const hero = heroMedia
    ? `<section class="hero-video" id="playthrough">${p.heroTitle !== "" ? `<h2>${esc(p.heroTitle || "Full playthrough")}</h2>` : ""}${heroMedia}</section>`
    : "";

  const panels = [];
  if (p.itch)
    panels.push(`<div class="panel" style="grid-column:1/-1"><h3>Play in browser</h3>
      <div class="embed"><iframe src="${esc(p.itch)}" title="${esc(p.title)} playable build" loading="lazy" allowfullscreen></iframe></div></div>`);
  if (p.download?.url)
    panels.push(`<div class="panel"><h3>Download</h3><p>${esc(p.download.label || "Playable build")}</p>
      <a class="btn" style="justify-self:start" href="${esc(p.download.url)}" target="_blank" rel="noopener">Download</a></div>`);
  if (p.github)
    panels.push(`<div class="panel"><h3>Source code</h3><p>Full project on GitHub.</p>
      <a class="btn" style="justify-self:start" href="${esc(p.github)}" target="_blank" rel="noopener">View on GitHub</a></div>`);

  // Other pages about the same project (e.g. its level design or art breakdown).
  const related = (p.related || [])
    .map((r) => ({ ...r, target: P.find((x) => x.id === r.id) }))
    .filter((r) => r.target);
  const relatedHtml = related.length
    ? `<aside class="related"><h3>Also on this project</h3><ul>${related
        .map((r) => `<li><span>${esc(r.role)}</span><a href="${esc(projectUrl(r.target))}">${esc(r.target.title.replace(/^.*?:\s*/, ""))} →</a></li>`)
        .join("")}</ul></aside>`
    : "";
  const highlights = p.highlights?.length
    ? `<section class="highlights" id="highlights"><h2>Highlights</h2>${bullets(p.highlights)}</section>`
    : "";

  const body = (p.sections || [])
    .map((s, i) => {
      if (s.type === "divider")
        return `<div class="divider" role="separator">${s.label ? `<span>${esc(s.label)}</span>` : ""}</div>`;
      const render = SECTION[s.type];
      if (!render) return "";
      return `<section class="block" id="s-${i}">${s.heading ? `<h2>${esc(s.heading)}</h2>` : ""}${render(s, i)}</section>`;
    })
    .join("");

  // Table of contents for the left sidebar. Dividers become group labels.
  const toc = [{ id: "overview", label: "Overview" }];
  if (highlights) toc.push({ id: "highlights", label: "Highlights" });
  if (hero && p.heroTitle !== "") toc.push({ id: "playthrough", label: p.heroTitle || "Full playthrough" });
  (p.sections || []).forEach((s, i) => {
    if (s.type === "divider") { if (s.label) toc.push({ group: s.label }); }
    else if (s.heading && SECTION[s.type]) toc.push({ id: `s-${i}`, label: s.heading });
  });
  const tocHtml = tocNav(toc);

  // Prev / next within featured-or-more group to keep reviewers moving.
  const group = P.filter((x) => (x.featured === false) === (p.featured === false) && !x.link);
  const gi = group.indexOf(p);
  const prev = group[gi - 1];
  const next = group[gi + 1];

  // The sidebar sits in its own column beside the whole page, header included.
  el.classList.add("has-side");
  el.innerHTML = `
    ${tocHtml}
    <div class="proj-main">
      <a class="back" href="${backHref}">← All projects</a>
      <header class="proj-head" id="overview">
        ${sectionTitle ? `<span class="eyebrow">${esc(sectionTitle)}</span>` : ""}
        <h1>${esc(p.title)}</h1>
        ${p.summary ? `<p>${esc(p.summary)}</p>` : ""}
        ${meta ? `<dl class="meta">${meta}</dl>` : ""}
      </header>
      ${highlights}
      ${hero}
      ${panels.length ? `<div class="play">${panels.join("")}</div>` : ""}
      <article class="article">${body}</article>
      <div class="next">
        ${prev ? `<a class="btn" href="${esc(projectUrl(prev))}">← ${esc(prev.title)}</a>` : "<span></span>"}
        ${next ? `<a class="btn" href="${esc(projectUrl(next))}">${esc(next.title)} →</a>` : ""}
      </div>
    </div>
    ${relatedHtml || `<div class="side-spacer"></div>`}`;
  wire();
  wireToc();
}

// Highlight the table-of-contents entry for the section being read.
function wireToc() {
  const links = [...document.querySelectorAll(".toc a[data-toc]")];
  const targets = links.map((a) => document.getElementById(a.dataset.toc)).filter(Boolean);
  if (!targets.length) return;
  let ticking = false;
  const update = () => {
    ticking = false;
    const line = 120;
    let current = targets[0];
    for (const t of targets) if (t.getBoundingClientRect().top <= line) current = t;
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) current = targets[targets.length - 1];
    links.forEach((a) => a.classList.toggle("active", a.dataset.toc === current.id));
  };
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

function wire() {
  // Close an open resume menu when clicking elsewhere or pressing Escape.
  if (!window.__cvWired) {
    window.__cvWired = true;
    const closeAll = (except) =>
      document.querySelectorAll("details.cv-menu[open]").forEach((d) => d !== except && d.removeAttribute("open"));
    document.addEventListener("click", (e) => closeAll(e.target.closest("details.cv-menu")));
    document.addEventListener("keydown", (e) => e.key === "Escape" && closeAll(null));
  }
  // Hover GIF on thumbnails
  document.querySelectorAll("img[data-gif]").forEach((img) => {
    const host = img.closest("a") || img;
    host.addEventListener("mouseenter", () => (img.src = img.dataset.gif));
    host.addEventListener("mouseleave", () => (img.src = img.dataset.still));
  });
  // Hover-to-play video thumbnails
  document.querySelectorAll("video[data-hover]").forEach((v) => {
    const host = v.closest("a") || v;
    host.addEventListener("mouseenter", () => v.play().catch(() => {}));
    host.addEventListener("mouseleave", () => v.pause());
  });
  // Before / after slider
  document.querySelectorAll("[data-compare]").forEach((box) => {
    const range = box.querySelector("input");
    const before = box.querySelector(".before");
    const handle = box.querySelector(".handle");
    const update = () => {
      before.style.clipPath = `inset(0 ${100 - range.value}% 0 0)`;
      handle.style.left = `calc(${range.value}% - 1px)`;
    };
    range.addEventListener("input", update);
    update();
  });
  // Copy email
  document.querySelectorAll("[data-copy]").forEach((b) =>
    b.addEventListener("click", async () => {
      const text = b.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
        b.textContent = "Copied";
        setTimeout(() => (b.textContent = text), 1500);
      } catch {
        /* clipboard unavailable: the address is visible on the button */
      }
    }),
  );
}
