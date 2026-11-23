// Dates accept YYYY or YYYY-MM. Leave unknown dates empty.
// startDate determines grouping and sorting. order breaks ties within a year.
// parentId links a flat record to an expandable parent activity. No deeper nesting is rendered yet.
// Parent dates are editable initial coverage periods. Text is maintained in locales/ko.js and locales/en.js, keyed by entry id.
const categories = {
  "research": "research",
  "project": "project",
  "award": "award",
  "activity": "activity",
  "career": "career"
};

const entries = [
  {
    "id": "impactive-internship",
    "group": "2025",
    "order": 0,
    "category": "career",
    "startDate": "2025-05",
    "endDate": "2026-03"
  },
  {
    "id": "causal-x",
    "group": "2026",
    "order": 1,
    "category": "project",
    "startDate": "2026-06",
    "ongoing": true,
    "detail": true
  },
  {
    "id": "causal-discovery",
    "group": "2026",
    "order": 2,
    "category": "award",
    "startDate": "2026-06",
    "detail": true
  },
  {
    "id": "sk-hynix-phase-2",
    "group": "2025",
    "order": 3,
    "category": "project",
    "startDate": "2025-11",
    "endDate": "2026-01",
    "parentId": "impactive-internship",
    "detail": true
  },
  {
    "id": "impactive-ai",
    "group": "2026",
    "order": 4,
    "category": "project",
    "startDate": "2026-01",
    "endDate": "2026-03",
    "parentId": "impactive-internship",
    "detail": true
  },
  {
    "id": "milan-football",
    "group": "2026",
    "order": 5,
    "category": "activity",
    "startDate": "2026-03",
    "endDate": "2026-12"
  },
  {
    "id": "sk-hynix-phase-1",
    "group": "2025",
    "order": 1,
    "category": "project",
    "startDate": "2025-05",
    "endDate": "2025-06",
    "parentId": "impactive-internship",
    "detail": true
  },
  {
    "id": "sk-siltron",
    "group": "2025",
    "order": 2,
    "category": "project",
    "startDate": "2025-05",
    "parentId": "impactive-internship",
    "detail": true
  },
  {
    "id": "sk-on",
    "group": "2025",
    "order": 3,
    "category": "project",
    "startDate": "2025-08",
    "endDate": "2025-12",
    "parentId": "impactive-internship",
    "detail": true
  },
  {
    "id": "commax-demand-forecasting",
    "group": "2025",
    "order": 4,
    "category": "project",
    "startDate": "2025-11",
    "parentId": "impactive-internship"
  },
  {
    "id": "likelion-leadership",
    "group": "2025",
    "order": 5,
    "category": "activity",
    "startDate": "2025-01",
    "endDate": "2026-01"
  },
  {
    "id": "likelion-hackathon-award",
    "group": "2025",
    "order": 6,
    "category": "award",
    "startDate": "2025-08",
    "parentId": "likelion-leadership",
    "detail": true
  },
  {
    "id": "g-star-award",
    "group": "2025",
    "order": 7,
    "category": "award",
    "startDate": "2025-11",
    "detail": true
  },
  {
    "id": "demo-day-award",
    "group": "2025",
    "order": 8,
    "category": "award",
    "startDate": "2025-05",
    "detail": true
  },
  {
    "id": "rpm-award-2025",
    "group": "2025",
    "order": 9,
    "category": "award",
    "startDate": "2025-11",
    "detail": true
  },
  {
    "id": "404-edition",
    "group": "2024",
    "order": 1,
    "category": "project",
    "startDate": "2024-12",
    "detail": true
  },
  {
    "id": "sw-festival",
    "group": "2024",
    "order": 2,
    "category": "project",
    "startDate": "2024-11",
    "detail": true
  },
  {
    "id": "sabong-band",
    "group": "2024",
    "order": 3,
    "category": "activity",
    "startDate": "2024-04",
    "endDate": "2024-10"
  },
  {
    "id": "choir-competition",
    "group": "2023",
    "order": 8,
    "category": "activity",
    "startDate": "2023-10",
    "endDate": "2024-12"
  },
  {
    "id": "likelion-planning-track",
    "group": "2024",
    "order": 4,
    "category": "activity",
    "startDate": "2024-01",
    "endDate": "2024-12"
  },
  {
    "id": "rpm-award-2024",
    "group": "2024",
    "order": 5,
    "category": "award",
    "startDate": "2024-11",
    "detail": true
  },
  {
    "id": "addiction-psychology",
    "group": "2024",
    "order": 8,
    "category": "activity",
    "startDate": "2024-01",
    "endDate": "2024-12"
  },
  {
    "id": "sabong-band-first-performance",
    "group": "2024",
    "order": 6,
    "category": "activity",
    "startDate": "2024-04",
    "parentId": "sabong-band"
  },
  {
    "id": "sabong-band-second-performance",
    "group": "2024",
    "order": 7,
    "category": "activity",
    "startDate": "2024-10",
    "parentId": "sabong-band"
  },
  {
    "id": "choir-director-2024",
    "group": "2024",
    "order": 9,
    "category": "activity",
    "startDate": "2024-10",
    "endDate": "2024-12",
    "parentId": "choir-competition"
  },
  {
    "id": "choir-director-2023",
    "group": "2023",
    "order": 1,
    "category": "activity",
    "startDate": "2023-10",
    "endDate": "2023-12",
    "parentId": "choir-competition"
  },
];

const education = [{ startDate: "2020-03", endDate: "2027-02" }];
const militaryService = [{ startDate: "2021-08", endDate: "2023-02", endDateUnverified: true }];

// Page composition references the same activity IDs used by detail pages.
const portfolioViews = {
  careerLeadership: ["causal-x", "impactive-internship", "likelion-leadership"],
  featuredProjects: ["causal-x", "causal-discovery"],
  otherProjects: ["404-edition", "sw-festival"],
};
const journey = [
  { year: "2020", key: "admission" },
  { year: "2024", key: "exploration" },
  { year: "2025", key: "industry" },
  { year: "2026", key: "startup" },
];
