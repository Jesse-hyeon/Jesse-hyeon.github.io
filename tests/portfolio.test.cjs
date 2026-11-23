const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");

const root = path.resolve(__dirname, "..");
const read = name => fs.readFileSync(path.join(root, name), "utf8");

class Element {
  constructor(tag, attributes = {}) {
    this.tagName = tag.toUpperCase();
    this.attributes = attributes;
    this.className = attributes.class || "";
    this.id = attributes.id || "";
    this.href = attributes.href;
    this.dataset = {};
    this.children = [];
    this.events = {};
    for (const [key, value] of Object.entries(attributes)) {
      if (key.startsWith("data-")) {
        this.dataset[key.slice(5).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())] = value;
      }
    }
  }
  append(...children) { this.children.push(...children); }
  replaceChildren() { this.children = []; this.value = ""; }
  setAttribute(key, value) { this.attributes[key] = value; }
  getAttribute(key) { return this.attributes[key]; }
  removeAttribute(key) { delete this.attributes[key]; }
  addEventListener(event, callback) { this.events[event] = callback; }
  scrollIntoView() { this.scrolled = true; }
  get childElementCount() { return this.children.filter(child => child instanceof Element).length; }
  set textContent(value) { this.value = value; }
  get textContent() {
    return (this.value || "") + this.children.map(child =>
      child instanceof Element ? child.textContent : child
    ).join("");
  }
}

function descendants(node) {
  return node.children.filter(child => child instanceof Element)
    .flatMap(child => [child, ...descendants(child)]);
}

function matches(node, selector) {
  if (selector.startsWith("#")) return node.id === selector.slice(1);
  if (selector.startsWith(".")) return node.className.split(" ").includes(selector.slice(1));
  const match = selector.match(/^([a-z]+)?\[([^=\]]+)(?:="([^"]*)")?\]$/);
  return Boolean(match && (!match[1] || node.tagName === match[1].toUpperCase()) &&
    Object.hasOwn(node.attributes, match[2]) &&
    (match[3] === undefined || node.attributes[match[2]] === match[3]));
}

function render(url, storage = new Map()) {
  const location = new URL(url, "https://example.com/");
  location.replace = target => { location.redirect = target; };
  const filename = location.pathname.split("/").at(-1) || "index.html";
  const markup = read(filename);
  const nodes = [...markup.matchAll(/<([a-z][a-z0-9-]*)\b([^>]*?)>/g)].map(match => {
    const attributes = Object.fromEntries(
      [...match[2].matchAll(/([a-z0-9-]+)="([^"]*)"/g)].map(attribute => [attribute[1], attribute[2]])
    );
    return new Element(match[1], attributes);
  });
  const main = nodes.find(node => node.id === "page-content");
  const allNodes = () => [...nodes, ...descendants(main)];
  const document = {
    documentElement: new Element("html"),
    body: nodes.find(node => node.tagName === "BODY"),
    createElement: tag => new Element(tag),
    querySelector: selector => allNodes().find(node => matches(node, selector)),
    querySelectorAll: selector => allNodes().filter(node => matches(node, selector)),
    getElementById: id => allNodes().find(node => node.id === id),
  };
  const windowEvents = {};
  const context = vm.createContext({
    document, location, URLSearchParams,
    localStorage: {
      getItem: key => storage.get(key) || null,
      setItem: (key, value) => storage.set(key, value),
    },
    history: { replaceState(_, __, target) { location.href = new URL(target, location).href; } },
    requestAnimationFrame: callback => callback(),
    window: { addEventListener(event, callback) { windowEvents[event] = callback; } },
  });
  for (const file of ["locales/ko.js", "locales/en.js", "entries.js", "app.js"]) {
    vm.runInContext(read(file), context);
  }
  return { context, document, main, location, storage, windowEvents };
}

function changeLanguage(page, language) {
  page.document.querySelectorAll("button[data-language]")
    .find(button => button.dataset.language === language).events.click();
}

test("All independent routes render in both languages without accordion controls", () => {
  for (const route of ["index", "about", "experience", "projects"]) {
    for (const language of ["ko", "en"]) {
      const page = render("/" + route + ".html?lang=" + language);
      assert.equal(page.document.documentElement.lang, language);
      assert.equal(descendants(page.main).filter(node => node.tagName === "H1").length, 1);
      assert(!descendants(page.main).some(node => ["DETAILS", "SUMMARY", "BUTTON"].includes(node.tagName)));
      const active = page.document.querySelectorAll("[data-nav]")
        .filter(node => node.attributes["aria-current"] === "page");
      assert.equal(active.length, 1);
      assert.equal(active[0].dataset.nav, ["index", "about"].includes(route) ? "experience" : route);
    }
  }
});

test("All 27 records and parent relationships remain available from one source", () => {
  const page = render("/index.html");
  const records = vm.runInContext("entries", page.context);
  assert.equal(records.length, 27);
  assert.equal(new Set(records.map(entry => entry.id)).size, 27);
  for (const record of records) {
    if (record.parentId) assert(records.some(parent => parent.id === record.parentId));
    for (const language of ["ko", "en"]) {
      assert(vm.runInContext("locales." + language + ".entries", page.context)[record.id].title);
    }
  }
});

test("Experience is the landing page with education, military service and PDF downloads", () => {
  const page = render("/index.html?lang=ko");
  assert.equal(page.document.querySelectorAll("[data-nav]").length, 2);
  assert(!page.document.getElementById("journey"));
  assert(page.document.getElementById("career"));
  assert(page.document.querySelector(".profile-description").textContent.includes("심리학을 전공했으며"));
  assert(!page.document.querySelector(".profile-description").textContent.includes("상담심리학을 전공했으며"));
  assert(page.main.textContent.includes("2027.02"));
  assert(page.main.textContent.includes("전역일"));
  for (const language of ["KO", "EN"]) {
    const filename = "assets/resumes/Hyeonwoo_Kim_Resume_" + language + ".pdf";
    assert(fs.readFileSync(path.join(root, filename)).subarray(0, 5).equals(Buffer.from("%PDF-")));
    assert(read("index.html").includes('href="./' + filename + '" download'));
  }
});

test("Experience separates career, all six awards and additional activities", () => {
  const page = render("/experience.html?lang=en");
  assert.equal(page.document.getElementById("career").children[1].children.length, 4);
  assert.equal(page.document.getElementById("honors").children[1].children.length, 6);
  const activities = page.document.getElementById("activities");
  assert(activities.textContent.includes("Sabong Band"));
  assert(activities.textContent.includes("College Choir Competition"));
  assert(!activities.textContent.includes("T-LAB"));
  const tlab = page.document.getElementById("t-lab");
  assert(tlab.textContent.includes("2023.12 – 2026.06"));
  assert(tlab.textContent.includes("T-LAB Technology Entrepreneurship Society"));
});

test("Projects references shared records and uses cards only for featured entries", () => {
  const page = render("/projects.html?lang=en");
  assert.equal(page.document.getElementById("featured").children[1].children.length, 2);
  assert.equal(page.document.getElementById("industry").children[1].children.length, 6);
  assert.equal(page.document.getElementById("other").children[1].children.length, 2);
  assert.equal(descendants(page.main).filter(node => node.className.includes("project-card")).length, 2);
});

test("Career details show related projects and achievements as static lists", () => {
  const internship = render("/detail.html?id=impactive-internship&lang=en");
  assert.equal(descendants(internship.main).filter(node => node.className === "cv-row").length, 6);
  const leader = render("/detail.html?id=likelion-leadership&lang=ko");
  assert(leader.main.textContent.includes("중앙해커톤"));
  assert(!leader.main.textContent.includes("추후 추가"));
  const band = render("/detail.html?id=sabong-band&lang=ko");
  assert(band.main.textContent.includes("1차 공연"));
  assert(band.main.textContent.includes("2차 공연"));
});

test("Every activity opens its own factual detail page in both languages", () => {
  for (const language of ["ko", "en"]) {
    const page = render("/projects.html?lang=" + language);
    const records = vm.runInContext("entries", page.context);
    for (const record of records) {
      const detail = render("/detail.html?id=" + record.id + "&lang=" + language);
      assert(!detail.location.redirect, record.id + " must open its own page");
      assert(detail.document.querySelector(".detail-facts"));
      const expected = vm.runInContext("locales." + language + ".entries", detail.context)[record.id].title;
      assert(detail.main.textContent.includes(expected));
      assert(detail.main.textContent.includes(record.startDate.replace("-", ".")));
      assert(!detail.main.textContent.includes("추후 추가"));
    }
    for (const route of ["experience", "projects"]) {
      const listPage = render("/" + route + ".html?lang=" + language);
      for (const row of descendants(listPage.main).filter(node => node.className.includes("cv-row"))) {
        const anchor = descendants(row).find(node => node.tagName === "A");
        assert(anchor, row.id + " must be clickable");
        assert(new URL(anchor.href, "https://example.com").searchParams.get("id") === row.id);
      }
    }
  }
});

test("Band and choir titles contain roles without duplicate secondary role lines", () => {
  const page = render("/experience.html?lang=ko");
  for (const [id, title] of [
    ["sabong-band", "사봉밴드 공연 기획 및 건반 연주"],
    ["choir-competition", "학부합창대회 음악 디렉터"],
  ]) {
    const row = page.document.getElementById(id);
    assert(row.textContent.includes(title));
    assert(!descendants(row).some(node => node.className === "entry-role"));
  }
});

test("Legacy index timeline URLs still render Experience", () => {
  for (const url of ["/index.html?lang=ko#timeline", "/index.html?lang=en&filter=award", "/index.html?open=impactive-internship"]) {
    const page = render(url);
    assert(page.document.getElementById("honors"));
  }
});

test("Language switches preserve the route, nav state, dates and detail context", () => {
  const page = render("/experience.html?lang=ko");
  changeLanguage(page, "en");
  assert(page.location.pathname.endsWith("experience.html"));
  assert.equal(page.document.querySelector('[data-nav="experience"]').attributes["aria-current"], "page");
  assert(page.main.textContent.includes("2025.05"));
  changeLanguage(page, "ko");
  assert.equal(page.document.documentElement.lang, "ko");
  const detail = render("/detail.html?id=causal-discovery&lang=en&from=projects");
  assert(detail.document.querySelector(".back-link").href.includes("projects.html?lang=en"));
  changeLanguage(detail, "ko");
  assert(detail.main.textContent.includes("제1저자"));
  assert(detail.document.querySelector(".back-link").href.includes("lang=ko"));
});

test("Every award opens its own detail page in both languages without arrow icons", () => {
  for (const language of ["ko", "en"]) {
    const page = render("/experience.html?lang=" + language);
    const honors = page.document.getElementById("honors");
    const rows = honors.children[1].children;
    assert.equal(rows.length, 6);
    for (const row of rows) {
      const anchor = descendants(row).find(node => node.tagName === "A");
      assert(anchor, row.id + " must be clickable");
      const url = new URL(anchor.href, "https://example.com/");
      assert.equal(url.searchParams.get("id"), row.id);
      assert.equal(url.searchParams.get("lang"), language);
      const detail = render(url.href);
      assert(!detail.location.redirect, row.id + " must show its own detail");
      assert(detail.main.textContent.includes(anchor.textContent));
    }
    assert(!descendants(page.main).some(node => node.className === "link-arrow"));
    const projects = render("/projects.html?lang=" + language);
    assert(!descendants(projects.main).some(node => node.className === "link-arrow"));
  }
});
