// Dates accept YYYY or YYYY-MM. Leave unknown dates empty.
// group selects the year heading and order controls placement within it.
// Text is maintained in locales/ko.js and locales/en.js, keyed by entry id.
const categories = {
  "research": "research",
  "project": "project",
  "award": "award",
  "activity": "activity"
};

const timelineGroups = ["2026","2025","2024","2023–2024"];

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
    "startDate": "2026"
  },
  {
    "id": "sk-hynix-phase-1",
    "group": "2025",
    "order": 1,
    "category": "project",
    "startDate": "2025",
    "detail": true
  },
  {
    "id": "sk-siltron",
    "group": "2025",
    "order": 2,
    "category": "project",
    "startDate": "2025",
    "detail": true
  },
  {
    "id": "sk-on",
    "group": "2025",
    "order": 3,
    "category": "project",
    "startDate": "2025",
    "detail": true
  },
  {
    "id": "likelion-leadership",
    "group": "2025",
    "order": 4,
    "category": "activity",
    "startDate": "2025-01",
    "endDate": "2026-01"
  },
  {
    "id": "likelion-hackathon-award",
    "group": "2025",
    "order": 5,
    "category": "award",
    "startDate": "2025-08",
    "detail": true
  },
  {
    "id": "g-star-award",
    "group": "2025",
    "order": 6,
    "category": "award",
    "startDate": "2025-11",
    "detail": true
  },
  {
    "id": "demo-day-award",
    "group": "2025",
    "order": 7,
    "category": "award",
    "startDate": "2025",
    "detail": true
  },
  {
    "id": "rpm-award-2025",
    "group": "2025",
    "order": 8,
    "category": "award",
    "startDate": "2025",
    "detail": true
  },
  {
    "id": "404-edition",
    "group": "2024",
    "order": 1,
    "category": "project",
    "startDate": "2024",
    "detail": true
  },
  {
    "id": "sw-festival",
    "group": "2024",
    "order": 2,
    "category": "project",
    "startDate": "2024",
    "detail": true
  },
  {
    "id": "likelion-12",
    "group": "2024",
    "order": 3,
    "category": "activity",
    "startDate": "2024"
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
    "startDate": "2024",
    "detail": true
  },
  {
    "id": "addiction-psychology",
    "group": "2024",
    "order": 7,
    "category": "activity",
    "startDate": "2024"
  },
  {
    "id": "sabong-band",
    "group": "2024",
    "order": 6,
    "category": "activity",
    "startDate": "2024"
  },
  {
    "id": "music-director",
    "group": "2023–2024",
    "order": 1,
    "category": "activity",
    "startDate": "2023",
    "endDate": "2024"
  }
];

const education = [{ startDate: "2020" }];
