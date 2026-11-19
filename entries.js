// group selects the year heading. order controls placement within that group.
// Dates accept YYYY or YYYY-MM. Leave unknown dates empty. Never invent months.
// summary, sections and related can be filled in as more details become available.
const categories = {
  research: "Research",
  project: "Projects",
  award: "Awards",
  activity: "Activities",
};

const timelineGroups = ["2026", "2025", "2024", "2023–2024"];

const entries = [
  {
    id: "causal-x", group: "2026", order: 1,
    category: "project", label: "Startup / Project",
    startDate: "2025", endDate: "2026",
    title: "Causal X", summary: "2025–2026년에 진행한 창업 프로젝트.",
    detail: true,
  },
  {
    id: "causal-discovery", group: "2026", order: 2,
    category: "research", startDate: "2026",
    title: "인과발견 연구 및 논문", summary: "인과발견을 주제로 한 연구 및 논문 작업.",
    detail: true,
  },
  {
    id: "sk-hynix-phase-2", group: "2026", order: 3,
    category: "project", startDate: "2026",
    title: "SK 하이닉스 2차 프로젝트 (AX팀)", summary: "",
    detail: true,
  },
  {
    id: "impactive-ai", group: "2026", order: 4,
    category: "project", startDate: "2026",
    title: "Impactive-ai 서비스 기획", summary: "",
    detail: true,
  },
  {
    id: "milan-football", group: "2026", order: 5,
    category: "activity", startDate: "2026",
    title: "밀란 축구동아리", summary: "",
  },
  {
    id: "sk-hynix-phase-1", group: "2025", order: 1,
    category: "project", startDate: "2025",
    title: "SK 하이닉스 1차 프로젝트 (AX팀)", summary: "",
    detail: true,
  },
  {
    id: "sk-siltron", group: "2025", order: 2,
    category: "project", startDate: "2025",
    title: "SK 실트론 프로젝트 PoC", summary: "",
    detail: true,
  },
  {
    id: "sk-on", group: "2025", order: 3,
    category: "project", startDate: "2025",
    title: "SK ON 프로젝트", summary: "",
    detail: true,
  },
  {
    id: "likelion-leadership", group: "2025", order: 4,
    category: "activity", startDate: "2025",
    title: "멋쟁이사자처럼 13기 대표", summary: "",
  },
  {
    id: "likelion-hackathon-award", group: "2025", order: 5,
    category: "award", startDate: "2025",
    title: "멋쟁이사자처럼 중앙해커톤 최우수상", summary: "",
    detail: true,
  },
  {
    id: "g-star-award", group: "2025", order: 6,
    category: "award", startDate: "2025",
    title: "G-star 창업경진대회 최우수상", summary: "",
    detail: true,
  },
  {
    id: "demo-day-award", group: "2025", order: 7,
    category: "award", startDate: "2025",
    title: "스타트업 데모데이 최우수상", summary: "",
    detail: true,
  },
  {
    id: "rpm-award-2025", group: "2025", order: 8,
    category: "award", startDate: "2025",
    title: "RPM 창업경진대회 우수상", summary: "",
    detail: true,
  },
  {
    id: "404-edition", group: "2024", order: 1,
    category: "project", startDate: "2024",
    title: "404 Edition", summary: "이미지 생성 AI를 활용한 프로젝트.",
    detail: true,
  },
  {
    id: "sw-festival", group: "2024", order: 2,
    category: "project", startDate: "2024",
    title: "SW 페스티벌", summary: "",
    detail: true,
  },
  {
    id: "likelion-12", group: "2024", order: 3,
    category: "activity", startDate: "2024",
    title: "멋쟁이사자처럼 12기 아기사자", summary: "",
  },
  {
    id: "rpm-award-2024", group: "2024", order: 4,
    category: "award", startDate: "2024",
    title: "RPM 창업경진대회 장려상", summary: "",
    detail: true,
  },
  {
    id: "addiction-psychology", group: "2024", order: 5,
    category: "activity", startDate: "2024",
    title: "중독심리학회", summary: "",
  },
  {
    id: "sabong-band", group: "2024", order: 6,
    category: "activity", startDate: "2024",
    title: "사봉밴드 1차·2차", summary: "",
  },
  {
    id: "music-director", group: "2023–2024", order: 1,
    category: "activity", startDate: "2023", endDate: "2024",
    title: "학합 음악 디렉터", summary: "",
  },
];

const education = [
  {
    startDate: "2020",
    title: "Handong Global University",
    summary: "한동대학교 입학 · AI 융합 및 창업, 심리학 전공",
  },
];
