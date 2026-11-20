// Dates accept YYYY or YYYY-MM. Leave unknown dates empty.
// group selects the timeline heading and order controls placement within it.
// Text is maintained in locales/ko.js and locales/en.js, keyed by entry id.
const categories = {
  "research": "research",
  "project": "project",
  "award": "award",
  "activity": "activity"
};

const timelineGroups = ["2026","2025","2024","2023","2021–2023"];

const entries = [
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
    "category": "research",
    "startDate": "2026-06",
    "detail": true
  },
  {
    "id": "sk-hynix-phase-2",
    "group": "2026",
    "order": 3,
    "category": "project",
    "startDate": "2026",
    "detail": true
  },
  {
    "id": "impactive-ai",
    "group": "2026",
    "order": 4,
    "category": "project",
    "startDate": "2026",
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
    "detail": true
  },
  {
    "id": "sk-siltron",
    "group": "2025",
    "order": 2,
    "category": "project",
    "startDate": "2025-05",
    "detail": true
  },
  {
    "id": "sk-on",
    "group": "2025",
    "order": 3,
    "category": "project",
    "startDate": "2025-08",
    "endDate": "2025-12",
    "detail": true
  },
  {
    "id": "commax-demand-forecasting",
    "group": "2025",
    "order": 4,
    "category": "project",
    "startDate": "2025-11"
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
    "startDate": "2024-04"
  },
  {
    "id": "sabong-band-second-performance",
    "group": "2024",
    "order": 7,
    "category": "activity",
    "startDate": "2024-10"
  },
  {
    "id": "choir-director-2024",
    "group": "2024",
    "order": 9,
    "category": "activity",
    "startDate": "2024-10",
    "endDate": "2024-12"
  },
  {
    "id": "choir-director-2023",
    "group": "2023",
    "order": 1,
    "category": "activity",
    "startDate": "2023-10",
    "endDate": "2023-12"
  },
  {
    "id": "military-service",
    "group": "2021–2023",
    "order": 1,
    "category": "activity",
    "startDate": "2021-08",
    "endDate": "2023-02"
  }
];

const education = [{ startDate: "2020-03", endDate: "2026-08" }];
