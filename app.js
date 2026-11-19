const params = new URLSearchParams(location.search);
const requestedFilter = params.get("filter") === "career" ? "activity" : params.get("filter");
const activeFilter = Object.hasOwn(categories, requestedFilter) ? requestedFilter : "all";

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
  return filter === "all" ? "" : "?filter=" + encodeURIComponent(filter);
}

function detailUrl(id, filter) {
  const query = new URLSearchParams({ id });
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
  return element("span", "badge", entry.label || categories[entry.category]);
}

function timelineRow(entry, filter) {
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

  if (!selected.length) list.append(element("p", "empty-message", "등록된 경험이 없습니다."));
  document.querySelector("#filter-status").textContent =
    (categories[filter] || "All") + " · " + selected.length + "개";
}

function showEducation() {
  const list = document.querySelector("#education-list");
  for (const entry of education) {
    const row = element("li", "education-row");
    const content = element("div");
    content.append(element("h3", "", entry.title), element("p", "", entry.summary));
    row.append(entryDate(entry), content);
    list.append(row);
  }
}

function showDetail() {
  const target = document.querySelector("#entry-detail");
  document.querySelector("#timeline-return").href =
    "./index.html" + filterQuery(activeFilter) + "#timeline";
  const entry = entries.find(({ id }) => id === params.get("id"));

  if (!entry) {
    target.append(element("h1", "missing-title", "경험을 찾을 수 없습니다."));
    return;
  }

  document.title = entry.title + " | Hyeonwoo Kim";
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
    body.append(element("p", "detail-pending", "상세 내용은 추후 추가할 예정입니다."));
  }
  target.append(body);

  if (!entry.related?.length) return;
  const related = element("section", "related");
  related.append(element("h2", "", "연결된 경험"));
  for (const item of entry.related) {
    const match = entries.find(({ id }) => id === item.id);
    if (!match) continue;
    const card = link("related-card", "", detailUrl(match.id, activeFilter));
    card.append(element("span", "related-label", item.label), element("strong", "", match.title));
    related.append(card);
  }
  target.append(related);
}

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
  let transitionId = 0;
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

  async function transitionTimeline(filter) {
    const id = ++transitionId;
    animation?.cancel();
    list.style.overflow = "";
    if (reducedMotion.matches || !list.animate) {
      showTimeline(filter);
      list.removeAttribute("aria-busy");
      return;
    }
    list.setAttribute("aria-busy", "true");
    animation = list.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 90, easing: "ease-out", fill: "forwards",
    });
    await animation.finished.catch(() => {});
    if (id !== transitionId) return;
    const previousHeight = list.offsetHeight;
    showTimeline(filter);
    const nextHeight = list.offsetHeight;
    animation.cancel();
    list.style.overflow = "hidden";
    animation = list.animate([
      { opacity: 0, transform: "translateY(6px)", height: previousHeight + "px" },
      { opacity: 1, transform: "translateY(0)", height: nextHeight + "px" },
    ], { duration: 200, easing: "cubic-bezier(0.2, 0, 0, 1)" });
    await animation.finished.catch(() => {});
    if (id !== transitionId) return;
    list.style.overflow = "";
    list.removeAttribute("aria-busy");
  }

  showTimeline(activeFilter);
  selectFilter(activeFilter);
  showEducation();
  const resizeObserver = new ResizeObserver(positionIndicator);
  resizeObserver.observe(filters);
  buttons.forEach((button) => resizeObserver.observe(button));
  document.fonts.ready.then(() => {
    positionIndicator();
    filters.classList.add("filters-ready");
  });
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) {
      ++transitionId;
      animation?.cancel();
      list.style.overflow = "";
      list.removeAttribute("aria-busy");
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
  showDetail();
}
