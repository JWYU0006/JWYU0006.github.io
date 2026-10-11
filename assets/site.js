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
    ${S.resume ? `<a class="cv" href="${esc(S.resume)}" target="_blank" rel="noopener">Resume</a>` : ""}
  </div>`;

  if (S.showDraftBanner) {
    document.getElementById("banner").innerHTML =
      `<div class="banner">Work in progress: some projects below are placeholders.</div>`;
  }

  const year = new Date().getFullYear();
  document.getElementById("footer").innerHTML =
    `© ${year} ${esc(S.name)}${S.email ? ` · ${esc(S.email)}` : ""}`;
}

function contactButtons() {
  const items = [
    S.resume && `<a class="btn primary" href="${esc(S.resume)}" target="_blank" rel="noopener">Resume (PDF)</a>`,
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

  document.getElementById("home").innerHTML = `
    <section class="hero">
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
    </section>`;
  wire();
}

function youtube(id, title) {
  return `<div class="embed"><iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?rel=0"
    title="${esc(title)}" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe></div>`;
}

const SECTION = {
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

  const hero = p.youtube
    ? youtube(p.youtube, p.title)
    : p.clip
      ? clip(p.clip, "hero-clip", p.heroImage)
    : p.heroImage
      ? `<img class="thumb" style="border-radius:8px" src="${esc(p.heroImage)}" alt="">`
      : S.showDraftBanner
        ? `<div class="embed ph">Gameplay video goes here (YouTube ID or MP4 clip)</div>`
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
        .map((r) => `<li><span>${esc(r.role)}</span><a href="${esc(projectUrl(r.target))}">${esc(r.target.title)} →</a></li>`)
        .join("")}</ul></aside>`
    : "";

  const body = (p.sections || [])
    .map((s, i) => {
      const render = SECTION[s.type];
      if (!render) return "";
      return `${s.heading ? `<h2>${esc(s.heading)}</h2>` : ""}${render(s, i)}`;
    })
    .join("");

  // Prev / next within featured-or-more group to keep reviewers moving.
  const group = P.filter((x) => (x.featured === false) === (p.featured === false) && !x.link);
  const gi = group.indexOf(p);
  const prev = group[gi - 1];
  const next = group[gi + 1];

  el.innerHTML = `
    <a class="back" href="${backHref}">← All projects</a>
    <header class="proj-head">
      ${sectionTitle ? `<span class="eyebrow">${esc(sectionTitle)}</span>` : ""}
      <h1>${esc(p.title)}</h1>
      ${p.summary ? `<p>${esc(p.summary)}</p>` : ""}
      ${meta ? `<dl class="meta">${meta}</dl>` : ""}
      ${relatedHtml}
    </header>
    ${hero}
    ${panels.length ? `<div class="play">${panels.join("")}</div>` : ""}
    <article class="article">${body}</article>
    <div class="next">
      ${prev ? `<a class="btn" href="${esc(projectUrl(prev))}">← ${esc(prev.title)}</a>` : "<span></span>"}
      ${next ? `<a class="btn" href="${esc(projectUrl(next))}">${esc(next.title)} →</a>` : ""}
    </div>`;
  wire();
}

function wire() {
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
