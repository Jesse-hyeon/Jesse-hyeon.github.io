const params = new URLSearchParams(location.search);
const requestedFilter = params.get("filter") === "career" ? "activity" : params.get("filter");
const activeFilter = Object.hasOwn(categories, requestedFilter) ? requestedFilter : "all";

const locales = { ko: korean, en: english };
let language = params.get("lang");
if (!Object.hasOwn(locales, language)) {
  try {
    language = localStorage.getItem("portfolio-language");
  } catch {
    language = null;
  }
}
if (!Object.hasOwn(locales, language)) language = "ko";

function text(key) {
  return key.split(".").reduce((value, part) => value[part], locales[language]);
}

function localizedEntry(entry) {
  return { ...entry, ...(locales[language].entries[entry.id] || korean.entries[entry.id]) };
}

function rememberLanguage() {
  try {
    localStorage.setItem("portfolio-language", language);
  } catch {
    // Navigation links also carry the language when browser storage is unavailable.
  }
}

function applyTranslations() {
  document.documentElement.lang = language;
  document.title = text("pageTitle");
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = text("description");
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = text(node.dataset.i18n);
  });
  for (const attribute of ["aria-label", "alt"]) {
    document.querySelectorAll("[data-i18n-" + attribute + "]").forEach((node) => {
      node.setAttribute(attribute, text(node.getAttribute("data-i18n-" + attribute)));
    });
  }
  document.querySelector(".language-switch").dataset.language = language;
  document.querySelectorAll("button[data-language]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.language === language));
  });
}

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function link(className, text, href) {
  const anchor = element("a", className, text);
  anchor.href = href;
  return anchor;
}

function filterQuery(filter) {
  const query = new URLSearchParams({ lang: language });
  if (filter !== "all") query.set("filter", filter);
  return "?" + query;
}

function detailUrl(id, filter) {
  const query = new URLSearchParams({ id, lang: language });
  if (filter !== "all") query.set("filter", filter);
  return "./detail.html?" + query;
}

function entryDate(entry) {
  const range = element("span", "entry-range");
  for (const value of [entry.startDate, entry.endDate].filter(Boolean)) {
    if (range.childElementCount) range.append(" – ");
    const date = element(value.includes("-") ? "time" : "span", "entry-date", value.replace("-", "."));
    if (date.tagName === "TIME") date.dateTime = value;
    range.append(date);
  }
  return range;
}

function badge(entry) {
  return element("span", "badge", entry.label || text("filters." + entry.category));
}

function timelineRow(source, filter) {
  const entry = localizedEntry(source);
  const row = element("li", "timeline-row");
  const content = entry.detail
    ? link("timeline-card", "", detailUrl(entry.id, filter))
    : element("div", "timeline-card");
  const meta = element("div", "card-meta");
  meta.append(badge(entry));
  content.append(element("h4", "", entry.title), meta);
  if (entry.summary) content.append(element("p", "", entry.summary));
  if (entry.detail) {
    const arrow = element("span", "timeline-arrow", "↗");
    arrow.setAttribute("aria-hidden", "true");
    content.append(arrow);
  }
  row.append(entryDate(entry), content);
  return row;
}

function showTimeline(filter) {
  const list = document.querySelector("#timeline-list");
  list.replaceChildren();
  const selected = entries.filter((entry) => filter === "all" || entry.category === filter);

  for (const year of timelineGroups) {
    const grouped = selected
      .filter((entry) => entry.group === year)
      .sort((a, b) => a.order - b.order);
    if (!grouped.length) continue;

    const group = element("section", "year-group");
    group.append(element("h3", "year", year));
    const rows = element("ol", "year-entries");
    for (const entry of grouped) rows.append(timelineRow(entry, filter));
    group.append(rows);
    list.append(group);
  }

  if (!selected.length) list.append(element("p", "empty-message", text("labels.empty")));
  document.querySelector("#filter-status").textContent =
    text("labels.count").replace("{category}", text("filters." + filter)).replace("{count}", selected.length);
}

function showEducation() {
  const list = document.querySelector("#education-list");
  list.replaceChildren();
  for (const source of education) {
    const entry = { ...source, ...text("education") };
    const row = element("li", "education-row");
    const content = element("div");
    content.append(element("h3", "", entry.title), element("p", "", entry.summary));
    row.append(entryDate(entry), content);
    list.append(row);
  }
}

function showDetail() {
  const target = document.querySelector("#entry-detail");
  target.replaceChildren();
  document.querySelector("#timeline-return").href =
    "./index.html" + filterQuery(activeFilter) + "#timeline";
  const source = entries.find(({ id }) => id === params.get("id"));

  if (!source) {
    target.append(element("h1", "missing-title", text("labels.missing")));
    return;
  }

  const entry = localizedEntry(source);
  document.title = entry.title + " | " + text("profile.name");
  const header = element("header", "detail-header");
  const meta = element("div", "card-meta");
  meta.append(badge(entry), entryDate(entry));
  header.append(meta, element("h1", "", entry.title));
  if (entry.summary) header.append(element("p", "", entry.summary));
  target.append(header);

  const body = element("div", "detail-body");
  for (const section of entry.sections || []) {
    const block = element("section", "detail-section");
    block.append(element("h2", "", section.title), element("p", "", section.text));
    body.append(block);
  }
  if (!body.childElementCount) {
    body.append(element("p", "detail-pending", text("labels.pending")));
  }
  target.append(body);

  if (!entry.related?.length) return;
  const related = element("section", "related");
  related.append(element("h2", "", text("labels.related")));
  for (const item of entry.related) {
    const match = entries.find(({ id }) => id === item.id);
    if (!match) continue;
    const card = link("related-card", "", detailUrl(match.id, activeFilter));
    card.append(element("span", "related-label", item.label), element("strong", "", localizedEntry(match).title));
    related.append(card);
  }
  target.append(related);
}

let renderCurrentPage;
rememberLanguage();
applyTranslations();

if (document.body.dataset.page === "timeline") {
  document.querySelectorAll(".contact-icon").forEach((icon) => {
    icon.addEventListener("keydown", (event) => {
      if (event.key === "Escape") icon.dataset.tooltipDismissed = "true";
    });
    for (const event of ["mouseleave", "blur"]) {
      icon.addEventListener(event, () => delete icon.dataset.tooltipDismissed);
    }
  });
  const filters = document.querySelector(".filters");
  const buttons = [...filters.querySelectorAll("[data-filter]")];
  const list = document.querySelector("#timeline-list");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const indicator = element("span", "filter-indicator");
  indicator.setAttribute("aria-hidden", "true");
  filters.append(indicator);
  let selectedFilter = activeFilter;
  let animation;

  function positionIndicator() {
    const selected = buttons.find((button) => button.dataset.filter === selectedFilter);
    indicator.style.width = selected.offsetWidth + "px";
    indicator.style.transform = `translate(${selected.offsetLeft}px, ${selected.offsetTop + selected.offsetHeight - 2}px)`;
  }

  function selectFilter(filter) {
    selectedFilter = filter;
    buttons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.filter === filter));
    });
    positionIndicator();
  }

  function transitionTimeline(filter) {
    animation?.cancel();
    showTimeline(filter);
    if (reducedMotion.matches || !list.animate) return;
    animation = list.animate([{ opacity: 0.65 }, { opacity: 1 }], {
      duration: 120, easing: "ease-out",
    });
  }

  renderCurrentPage = () => {
    animation?.cancel();
    showTimeline(selectedFilter);
    showEducation();
    selectFilter(selectedFilter);
  };
  renderCurrentPage();
  const resizeObserver = new ResizeObserver(positionIndicator);
  resizeObserver.observe(filters);
  buttons.forEach((button) => resizeObserver.observe(button));
  document.fonts.ready.then(() => {
    positionIndicator();
    filters.classList.add("filters-ready");
  });
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) {
      animation?.cancel();
      showTimeline(selectedFilter);
    }
  });
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      if (filter === selectedFilter) return;
      selectFilter(filter);
      if (location.protocol !== "file:") {
        history.replaceState(null, "", location.pathname + filterQuery(filter) + location.hash);
      }
      transitionTimeline(filter);
    });
  });
} else {
  renderCurrentPage = showDetail;
  renderCurrentPage();
}


// Each language button is a native button, supporting Tab, Enter and Space.
let languageAnimations = [];
const languageMotion = matchMedia("(prefers-reduced-motion: reduce)");
languageMotion.addEventListener("change", () => {
  if (languageMotion.matches) languageAnimations.forEach((animation) => animation.cancel());
});
document.querySelectorAll("button[data-language]").forEach((button) => {
  button.addEventListener("click", () => {
    if (language === button.dataset.language) return;
    language = button.dataset.language;
    rememberLanguage();
    if (location.protocol !== "file:") {
      const query = new URLSearchParams(location.search);
      query.set("lang", language);
      history.replaceState(null, "", location.pathname + "?" + query + location.hash);
    }
    languageAnimations.forEach((animation) => animation.cancel());
    languageAnimations = [];
    applyTranslations();
    renderCurrentPage();
    if (!languageMotion.matches) {
      document.querySelectorAll(".profile-copy, .page-main, .detail-main").forEach((node) => {
        if (!node.animate) return;
        languageAnimations.push(node.animate([{ opacity: 0.45 }, { opacity: 1 }], {
          duration: 180, easing: "ease-out",
        }));
      });
    }
  });
});
