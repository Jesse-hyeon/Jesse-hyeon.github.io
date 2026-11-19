const params = new URLSearchParams(location.search);
const activeFilter = Object.hasOwn(categories, params.get("filter"))
  ? params.get("filter")
  : "all";

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
  const date = element("time", "entry-date", entry.date.replace("-", "."));
  date.dateTime = entry.date;
  if (!entry.endDate) return date;

  const end = element("time", "entry-date", entry.endDate.replace("-", "."));
  end.dateTime = entry.endDate;
  const range = element("span", "entry-range");
  range.append(date, " – ", end);
  return range;
}

function badge(entry) {
  return element("span", "badge " + entry.category, categories[entry.category]);
}

function timelineCard(entry, filter) {
  const row = element("li", "timeline-row " + entry.category);
  const card = link("timeline-card", "", detailUrl(entry.id, filter));
  const meta = element("div", "card-meta");
  meta.append(badge(entry));
  for (const tag of entry.tags) meta.append(element("span", "tag", tag));

  card.append(element("h4", "", entry.title), element("p", "", entry.summary), meta);
  row.append(entryDate(entry), card);
  return row;
}

function showTimeline(filter) {
  const list = document.querySelector("#timeline-list");
  list.replaceChildren();
  const sorted = entries
    .filter((entry) => filter === "all" || entry.category === filter)
    .sort((a, b) => a.date.localeCompare(b.date));

  let currentYear;
  let rows;
  for (const entry of sorted) {
    const year = entry.date.slice(0, 4);
    if (year !== currentYear) {
      currentYear = year;
      const group = element("section", "year-group");
      rows = element("ol", "year-entries");
      group.append(element("h3", "year", year), rows);
      list.append(group);
    }
    rows.append(timelineCard(entry, filter));
  }

  if (!sorted.length) list.append(element("p", "empty-message", "아직 등록된 경험이 없어요."));
  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.filter === filter));
  });
  document.querySelector("#filter-status").textContent =
    (categories[filter] || "전체") + " 경험 " + sorted.length + "개";
}

function showDetail() {
  const target = document.querySelector("#entry-detail");
  const back = "./index.html" + filterQuery(activeFilter) + "#timeline";
  document.querySelector("#timeline-return").href = back;
  const entry = entries.find(({ id }) => id === params.get("id"));

  if (!entry) {
    target.append(element("h1", "missing-title", "경험을 찾을 수 없어요."));
    return;
  }

  document.title = entry.title + " | 김하늘 포트폴리오";
  const header = element("header", "detail-header " + entry.category);
  const meta = element("div", "card-meta");
  meta.append(badge(entry), entryDate(entry));
  for (const tag of entry.tags) meta.append(element("span", "tag", tag));
  header.append(meta, element("h1", "", entry.title), element("p", "", entry.summary));

  const body = element("div", "detail-body");
  for (const section of entry.sections) {
    const block = element("section", "detail-section");
    block.append(element("h2", "", section.title), element("p", "", section.text));
    body.append(block);
  }
  target.append(header, body);

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
  showTimeline(activeFilter);
  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      if (location.protocol !== "file:") {
        history.replaceState(null, "", location.pathname + filterQuery(filter) + location.hash);
      }
      showTimeline(filter);
    });
  });
} else {
  showDetail();
}
