const params = new URLSearchParams(location.search);
const locales = { ko: korean, en: english };
let language = params.get("lang");
if (!Object.hasOwn(locales, language)) {
  try { language = localStorage.getItem("portfolio-language"); } catch { language = null; }
}
if (!Object.hasOwn(locales, language)) language = "ko";

const currentPage = document.body.dataset.page === "about" ? "experience" : document.body.dataset.page;
const main = document.querySelector("#page-content");

function text(key) {
  return key.split(".").reduce((value, part) => value[part], locales[language]);
}
function localizedEntry(entry) {
  return { ...entry, ...(locales[language].entries[entry.id] || korean.entries[entry.id]) };
}
function rememberLanguage() {
  try { localStorage.setItem("portfolio-language", language); } catch { /* Links also carry the language. */ }
}
function element(tag, className, value) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (value !== undefined) node.textContent = value;
  return node;
}
function link(className, value, href) {
  const node = element("a", className, value);
  node.href = href;
  return node;
}
function pageUrl(page) {
  const filename = page === "about" ? "index" : page;
  return "./" + filename + ".html?lang=" + language;
}
function detailUrl(id) {
  const query = new URLSearchParams({ id, lang: language, from: currentPage === "projects" ? "projects" : "experience" });
  return "./detail.html?" + query;
}
function childrenOf(id) {
  return entries.filter(entry => entry.parentId === id).sort(byStartDate);
}
function byStartDate(a, b) {
  return b.startDate.localeCompare(a.startDate) || a.order - b.order;
}
function hasDetail(source) {
  const entry = localizedEntry(source);
  return Boolean(
    entry.sections?.some(section => section.text?.trim()) ||
    entry.qa?.some(item => item.question?.trim() && item.answer?.trim()) ||
    entry.media?.some(item => item.src) ||
    entry.links?.some(item => item.url) ||
    childrenOf(entry.id).length
  );
}
function entryHref(source) {
  return source.url || (hasDetail(source) ? detailUrl(source.id) : null);
}
function entryDate(entry) {
  const range = element("span", "entry-range");
  const end = entry.endDate || (entry.ongoing ? text("labels.present") : null);
  for (const value of [entry.startDate, end].filter(Boolean)) {
    if (range.childElementCount) range.append(" – ");
    const node = element(value.includes("-") ? "time" : "span", "", value.replace("-", "."));
    if (node.tagName === "TIME") node.dateTime = value;
    range.append(node);
  }
  return range;
}
function addArrow(node) {
  const arrow = element("span", "link-arrow", "↗");
  arrow.setAttribute("aria-hidden", "true");
  node.append(arrow);
}
function entryRow(source, { project = false, compact = false } = {}) {
  const entry = localizedEntry(source);
  const row = element("li", compact ? "cv-row compact-row" : "cv-row");
  const href = entryHref(source);
  const content = href ? link("entry-content entry-link", "", href) : element("div", "entry-content");
  const title = project && entry.projectTitle ? entry.projectTitle : entry.title;
  content.append(element("h3", "", title));
  if (entry.role) content.append(element("p", "entry-role", entry.role));
  const summary = project && entry.projectSummary ? entry.projectSummary : entry.summary;
  if (summary && !compact) content.append(element("p", "entry-summary", summary));
  if (href) addArrow(content);
  row.append(entryDate(entry), content);
  row.id = source.id;
  return row;
}
function entryList(data, options) {
  const list = element("ul", "cv-list");
  for (const entry of [...data].sort(byStartDate)) list.append(entryRow(entry, options));
  return list;
}
function section(title, id) {
  const node = element("section", "content-section");
  if (id) node.id = id;
  node.append(element("h2", "", title));
  return node;
}
function selectedEntries(ids) {
  return ids.map(id => entries.find(entry => entry.id === id)).filter(Boolean);
}
function backgroundSection(key, records) {
  const node = section(text("headings." + (key === "militaryService" ? "military" : key)), key);
  const list = element("ul", "background-list");
  for (const source of records) {
    const item = element("li", "");
    item.append(element("h3", "", text(key + ".title")));
    const period = element("p", "background-period");
    period.append(entryDate(source));
    if (source.expectedGraduation) period.append(" (" + text("labels.expectedGraduation") + ")");
    item.append(period, element("p", "entry-summary", text(key + ".summary")));
    if (source.endDateUnverified) item.append(element("p", "record-note", text("labels.dischargeUnverified")));
    list.append(item);
  }
  node.append(list);
  return node;
}
function showExperience() {
  const heading = element("h1", "page-title", text("ui.experience"));
  heading.id = "timeline";
  main.append(heading);
  const career = section(text("ui.careerLeadership"), "career");
  const careerEntries = selectedEntries(portfolioViews.careerLeadership);
  for (const entry of entries.filter(item => item.category === "research" && !item.parentId)) {
    if (!careerEntries.some(item => item.id === entry.id)) careerEntries.push(entry);
  }
  career.append(entryList(careerEntries));
  const awards = section(text("ui.honorsAwards"), "honors");
  awards.append(entryList(entries.filter(entry => entry.category === "award"), { compact: true }));
  const activities = section(text("ui.additionalActivities"), "activities");
  activities.append(entryList(entries.filter(entry =>
    entry.category === "activity" && !entry.parentId && !portfolioViews.careerLeadership.includes(entry.id)
  ), { compact: true }));
  const columns = element("div", "experience-columns");
  columns.append(awards, activities);
  main.append(career, columns, backgroundSection("education", education), backgroundSection("militaryService", militaryService));
}
function projectCard(source) {
  const entry = localizedEntry(source);
  const row = element("li", "");
  const href = entryHref(source);
  const card = href ? link("project-card entry-link", "", href) : element("div", "project-card");
  card.append(entryDate(entry), element("h3", "", entry.projectTitle || entry.title));
  if (entry.projectSummary || entry.summary) card.append(element("p", "entry-summary", entry.projectSummary || entry.summary));
  if (href) addArrow(card);
  row.append(card);
  return row;
}
function showProjects() {
  main.append(element("h1", "page-title", text("ui.projects")));
  const featured = section(text("ui.featuredProjects"), "featured");
  const cards = element("ul", "project-grid");
  for (const entry of selectedEntries(portfolioViews.featuredProjects)) cards.append(projectCard(entry));
  featured.append(cards);
  const industry = section(text("ui.industryProjects"), "industry");
  industry.append(entryList(childrenOf("impactive-internship"), { project: true }));
  const other = section(text("ui.otherProjects"), "other");
  other.append(entryList(selectedEntries(portfolioViews.otherProjects), { project: true, compact: true }));
  main.append(featured, industry, other);
}
function showDetail() {
  const source = entries.find(entry => entry.id === params.get("id"));
  const from = params.get("from") === "projects" ? "projects" : "experience";
  const back = link("back-link", text("ui.back"), pageUrl(from));
  main.append(back);
  if (!source) {
    main.append(element("h1", "page-title", text("labels.missing")));
    return;
  }
  if (!hasDetail(source)) {
    const target = source.parentId ? detailUrl(source.parentId) : pageUrl("projects");
    location.replace(target);
    return;
  }
  const entry = localizedEntry(source);
  document.title = entry.title + " | " + text("profile.name");
  main.append(element("h1", "page-title", entry.title), entryDate(entry));
  if (entry.role) main.append(element("p", "detail-role", entry.role));
  if (entry.summary) main.append(element("p", "detail-summary", entry.summary));
  for (const block of entry.sections || []) {
    if (!block.text?.trim()) continue;
    const node = section(block.title);
    node.append(element("p", "detail-copy", block.text));
    main.append(node);
  }
  if (entry.qa?.length) {
    const node = section(text("ui.projectDetails"));
    const list = element("dl", "detail-qa");
    for (const item of entry.qa) {
      if (item.question && item.answer) list.append(element("dt", "", item.question), element("dd", "", item.answer));
    }
    if (list.childElementCount) { node.append(list); main.append(node); }
  }
  for (const media of entry.media || []) {
    if (!media.src || !["image", "video"].includes(media.type)) continue;
    const figure = element("figure", "detail-media");
    const asset = element(media.type === "video" ? "video" : "img");
    asset.src = media.src;
    if (media.type === "image") { asset.alt = media.alt || entry.title; asset.loading = "lazy"; }
    else { asset.controls = true; asset.preload = "metadata"; }
    figure.append(asset);
    if (media.caption) figure.append(element("figcaption", "", media.caption));
    main.append(figure);
  }
  if (entry.links?.length) {
    const list = element("ul", "resource-links");
    for (const item of entry.links) {
      if (!item.url) continue;
      const row = element("li");
      row.append(link("", item.label || item.url, item.url));
      list.append(row);
    }
    if (list.childElementCount) main.append(list);
  }
  const children = childrenOf(entry.id);
  if (children.length) {
    const title = children.some(item => item.category === "project") ? text("ui.relatedProjects") : text("ui.relatedAchievements");
    const related = section(title);
    related.append(entryList(children));
    main.append(related);
  }
  if (entry.related?.length) {
    const related = section(text("labels.related"));
    related.append(entryList(selectedEntries(entry.related.map(item => item.id))));
    main.append(related);
  }
  if (entry.parentId) {
    const parent = entries.find(item => item.id === entry.parentId);
    if (parent) {
      const related = section(text("ui.parentActivity"));
      related.append(entryList([parent]));
      main.append(related);
    }
  }
}
function applyTranslations() {
  document.documentElement.lang = language;
  document.title = text("pageTitle");
  document.querySelector('meta[name="description"]').content = text("description");
  document.querySelectorAll("[data-i18n]").forEach(node => { node.textContent = text(node.dataset.i18n); });
  for (const attribute of ["aria-label", "alt"]) {
    document.querySelectorAll("[data-i18n-" + attribute + "]").forEach(node => {
      node.setAttribute(attribute, text(node.getAttribute("data-i18n-" + attribute)));
    });
  }
  document.querySelectorAll("[data-language]").forEach(button => {
    button.setAttribute("aria-pressed", String(button.dataset.language === language));
  });
  document.querySelectorAll("[data-nav]").forEach(node => {
    node.href = pageUrl(node.dataset.nav);
    const selected = currentPage === node.dataset.nav || currentPage === "detail" &&
      node.dataset.nav === (params.get("from") === "projects" ? "projects" : "experience");
    if (selected) node.setAttribute("aria-current", "page");
    else node.removeAttribute("aria-current");
  });
}
function renderPage() {
  applyTranslations();
  main.replaceChildren();
  if (currentPage === "experience") showExperience();
  else if (currentPage === "projects") showProjects();
  else showDetail();
}
rememberLanguage();
renderPage();
document.querySelectorAll("button[data-language]").forEach(button => {
  button.addEventListener("click", () => {
    if (language === button.dataset.language) return;
    language = button.dataset.language;
    rememberLanguage();
    if (location.protocol !== "file:") {
      const query = new URLSearchParams(location.search);
      query.set("lang", language);
      history.replaceState(null, "", location.pathname + "?" + query + location.hash);
    }
    renderPage();
  });
});
document.querySelectorAll(".contact-icon").forEach(icon => {
  icon.addEventListener("keydown", event => {
    if (event.key === "Escape") icon.dataset.tooltipDismissed = "true";
  });
  for (const event of ["mouseleave", "blur"]) icon.addEventListener(event, () => delete icon.dataset.tooltipDismissed);
});
function scrollToFragment() {
  const id = location.hash.slice(1);
  if (id) document.getElementById(id)?.scrollIntoView();
}
requestAnimationFrame(scrollToFragment);
window.addEventListener("hashchange", scrollToFragment);
