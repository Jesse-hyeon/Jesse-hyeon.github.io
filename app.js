const params = new URLSearchParams(location.search);
const availableFilters = ["all", ...Object.keys(categories).filter((category) =>
  entries.some((entry) => entry.category === category)
)];
const requestedFilter = params.get("filter");
const activeFilter = availableFilters.includes(requestedFilter) ? requestedFilter : "all";

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
  const endDate = entry.endDate || (entry.ongoing ? text("labels.present") : null);
  for (const value of [entry.startDate, endDate].filter(Boolean)) {
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

function entryHref(entry, filter) {
  const hasContent = entry.sections?.some((section) => section.text?.trim());
  return entry.url || (entry.detail && hasContent ? detailUrl(entry.id, filter) : null);
}

function entryContent(entry, filter, heading = "h4") {
  const href = entryHref(entry, filter);
  const content = href ? link("timeline-card", "", href) : element("div", "timeline-card");
  const meta = element("div", "card-meta");
  meta.append(badge(entry));
  content.append(element(heading, "", entry.title), meta);
  if (entry.role) content.append(element("p", "entry-role", entry.role));
  if (entry.summary) content.append(element("p", "", entry.summary));
  if (href) {
    const arrow = element("span", "timeline-arrow", "↗");
    arrow.setAttribute("aria-hidden", "true");
    content.append(arrow);
  }
  return content;
}

function timelineRow(source, filter, child = false) {
  const entry = localizedEntry(source);
  const row = element("li", child ? "timeline-child" : "timeline-row");
  row.append(entryDate(entry), entryContent(entry, filter, child ? "h5" : "h4"));
  return row;
}

const expandedGroups = new Map();

function timelineGroup(source, children, filter) {
  const entry = localizedEntry(source);
  const row = element("li", "timeline-group");
  const disclosure = element("details", "timeline-accordion");
  const stateKey = filter + ":" + entry.id;
  disclosure.dataset.stateKey = stateKey;
  disclosure.open = expandedGroups.get(stateKey) ?? (filter !== "all" || params.get("open") === entry.id);
  disclosure.addEventListener("toggle", () => {
    expandedGroups.set(stateKey, disclosure.open);
  });
  const summary = element("summary", "timeline-row timeline-parent");
  // The summary toggles the group. A parent's own link is kept inside the panel.
  const content = entryContent({ ...entry, detail: false, url: null }, filter);
  const count = element("span", "group-count", text("labels.children").replace("{count}", children.length));
  const chevron = element("span", "accordion-chevron");
  chevron.setAttribute("aria-hidden", "true");
  content.append(count, chevron);
  summary.append(entryDate(entry), content);
  const panel = element("div", "timeline-children-wrapper");
  const href = entryHref(entry, filter);
  if (href) panel.append(link("parent-detail-link", text("labels.parentDetail"), href));
  const list = element("ol", "timeline-children");
  for (const child of children) list.append(timelineRow(child, filter, true));
  panel.append(list);
  disclosure.append(summary, panel);
  row.append(disclosure);
  return row;
}

function byStartDate(a, b) {
  return b.startDate.localeCompare(a.startDate) || a.order - b.order;
}

function showTimeline(filter) {
  const list = document.querySelector("#timeline-list");
  list.querySelectorAll("details[data-state-key]").forEach((details) => {
    expandedGroups.set(details.dataset.stateKey, details.open);
  });
  list.replaceChildren();

  const visible = [];
  for (const entry of entries.filter((item) => !item.parentId)) {
    const children = entries.filter((item) => item.parentId === entry.id).sort(byStartDate);
    const parentMatches = filter === "all" || entry.category === filter;
    const matchingChildren = children.filter((item) => filter === "all" || item.category === filter);
    if (parentMatches || matchingChildren.length) {
      visible.push({ entry, children: parentMatches ? children : matchingChildren });
    }
  }

  const years = [...new Set(visible.map(({ entry }) => entry.startDate.slice(0, 4)))].sort().reverse();
  for (const year of years) {
    const grouped = visible
      .filter(({ entry }) => entry.startDate.slice(0, 4) === year)
      .sort((a, b) => byStartDate(a.entry, b.entry));
    const group = element("section", "year-group");
    group.append(element("h3", "year", year));
    const rows = element("ol", "year-entries");
    for (const { entry, children } of grouped) {
      rows.append(children.length ? timelineGroup(entry, children, filter) : timelineRow(entry, filter));
    }
    group.append(rows);
    list.append(group);
  }

  if (!visible.length) list.append(element("p", "empty-message", text("labels.empty")));
  const matchedCount = entries.filter((entry) => filter === "all" || entry.category === filter).length;
  document.querySelector("#filter-status").textContent =
    text("labels.count").replace("{category}", text("filters." + filter)).replace("{count}", matchedCount);
}

function showBackgroundSection(selector, data, translationKey) {
  const list = document.querySelector(selector);
  list.replaceChildren();
  for (const source of data) {
    const entry = { ...source, ...text(translationKey) };
    const row = element("li", "background-row");
    row.append(element("h3", "", entry.title));
    const period = element("div", "background-period");
    period.append(entryDate(entry));
    if (entry.expectedGraduation) {
      period.append(element("span", "graduation-status", "(" + text("labels.expectedGraduation") + ")"));
    }
    row.append(period, element("p", "", entry.summary));
    if (entry.endDateUnverified) {
      row.append(element("p", "record-note", text("labels.dischargeUnverified")));
    }
    list.append(row);
  }
}

function showDetail() {
  const target = document.querySelector("#entry-detail");
  target.replaceChildren();
  const source = entries.find(({ id }) => id === params.get("id"));
  const backQuery = new URLSearchParams(filterQuery(activeFilter));
  if (source?.parentId) backQuery.set("open", source.parentId);
  document.querySelector("#timeline-return").href =
    "./index.html?" + backQuery + "#timeline";

  if (!source) {
    target.append(element("h1", "missing-title", text("labels.missing")));
    return;
  }

  const entry = localizedEntry(source);
  if (!entry.detail || !entry.sections?.some((section) => section.text?.trim())) {
    location.replace(document.querySelector("#timeline-return").href);
    return;
  }
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
  target.append(body);

  if (!entry.related?.length) return;
  const related = element("section", "related");
  related.append(element("h2", "", text("labels.related")));
  for (const item of entry.related) {
    const match = entries.find(({ id }) => id === item.id);
    const href = match && entryHref(localizedEntry(match), activeFilter);
    if (!href) continue;
    const card = link("related-card", "", href);
    card.append(element("span", "related-label", item.label), element("strong", "", localizedEntry(match).title));
    related.append(card);
  }
  if (related.childElementCount > 1) target.append(related);
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
  const filterButtons = [...filters.querySelectorAll("[data-filter]")];
  filterButtons.forEach((button) => {
    button.hidden = !availableFilters.includes(button.dataset.filter);
  });
  const buttons = filterButtons.filter((button) => !button.hidden);
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
    showBackgroundSection("#education-list", education, "education");
    showBackgroundSection("#military-list", militaryService, "militaryService");
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
