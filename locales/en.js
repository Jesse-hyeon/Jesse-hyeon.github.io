// English copy for the portfolio. Keep entry IDs aligned with entries.js.
const english = {
  pageTitle: "Hyeonwoo Kim — Portfolio",
  description: "Hyeonwoo Kim's research, projects, awards, and activities portfolio",
  profile: {
    name: "Hyeonwoo Kim",
    bio: "I study AI Convergence & Entrepreneurship and Psychology, with a focus on causal inference and discovery.",
    location: "Ulsan, Korea",
    school: "Handong Global University",
    alt: "Hyeonwoo Kim profile photo",
    label: "Profile",
    detailsLabel: "Location, university, and email",
    socialsLabel: "Social links",
  },
  headings: {
    portfolio: "Hyeonwoo Kim Portfolio",
    experience: "Activities & Achievements",
    education: "Education",
    military: "Military Service",
  },
  ui: {
    navLabel: "Primary navigation",
    about: "About",
    experience: "Experience",
    projects: "Projects",
    journey: "Journey",
    resume: "Resume / 이력서",
    resumeDescription: "A one-page overview of my experience and selected projects.",
    careerLeadership: "Career & Leadership",
    honorsAwards: "Honors & Awards",
    additionalActivities: "Additional Activities",
    featuredProjects: "Featured Projects",
    industryProjects: "Industry Projects",
    otherProjects: "Other Projects",
    relatedProjects: "Related Projects",
    relatedAchievements: "Related Achievements",
    parentActivity: "Parent activity",
    overview: "Overview",
    projectDetails: "Project details",
    downloadKo: "KO PDF",
    downloadEn: "EN PDF",
    back: "Back to list",
    skipLink: "Skip to content",
  },
  journey: {
    admission: "Entered Handong Global University",
    exploration: "AI projects and startup competition activity",
    industry: "Impactive AI Internship, Like Lion 13th Cohort Representative",
    startup: "Founded Causal X, KADS Best Paper Award",
  },
  filters: {
    all: "All",
    research: "Research",
    project: "Projects",
    award: "Awards",
    activity: "Other Activities",
    career: "Career / Internships",
  },
  labels: {
    language: "Language",
    ko: "Korean",
    en: "English",
    filters: "Activities and achievements filters",
    back: "Back to Activities & Achievements",
    empty: "No experiences have been added yet.",
    missing: "Experience not found.",
    pending: "Details will be added later.",
    present: "Present",
    expectedGraduation: "Expected graduation",
    dischargeUnverified: "The discharge date requires verification against official service records.",
    related: "Related experience",
    jsRequired: "Please enable JavaScript to view the experience timeline.",
    count: "{category} · {count} entries",
    children: "{count} items",
    parentDetail: "View activity details",
  },
  entries: {
    "t-lab": {
      title: "T-LAB Technology Entrepreneurship Society",
      summary: "Top Excellence Award at the G-Star Startup Competition and an award at a campus startup competition",
    },
    "impactive-internship": {
      title: "Impactive AI Internship",
      summary: "Participated in SK hynix, SK Siltron, SK ON, and COMMAX PoCs, and in causal analysis solution planning and development",
      sections: [
        { title: "Responsibilities", text: "Participated in SK hynix Phase 1 and 2 and SK Siltron industrial AI PoCs\nParticipated in SK ON battery and COMMAX demand forecasting projects\nParticipated in causal analysis solution planning and development" },
      ],
    },
    "sabong-band": {
      title: "Sabong Band",
      summary: "",
      role: "Performance Planning",
    },
    "choir-competition": {
      title: "College Choir Competition",
      summary: "",
      role: "Music Director",
    },
    "causal-x": {
      title: "Causal X",
      summary: "A time-series causal analysis service that examines the drivers of commodity price fluctuations and the lags in their impact to support corporate procurement and risk management decisions",
      label: "Startup",
      sections: [
        { title: "Responsibilities", text: "A time-series causal analysis service that examines the drivers of commodity price fluctuations and the lags in their impact to support corporate procurement and risk management decisions\nInterviewed manufacturing companies to understand procurement and contract decision processes\nTranslated causal analysis findings into product features and analysis reports" },
      ],
    },
    "causal-discovery": {
      title: "Korean Association of Data Science (KADS) Best Paper Award",
      summary: "Best Paper Award for causal discovery research",
      projectTitle: "Causal Discovery Research",
      projectSummary: "Research and writing on causal discovery",
      sections: [
        { title: "Conference", text: "Korean Association of Data Science (KADS) Summer Conference" },
        { title: "Authorship", text: "First author" },
      ],
    },
    "sk-hynix-phase-2": {
      title: "SK hynix 2nd PoC (Impactive AI Intern)",
      summary: "A second industrial AI PoC completed during the Impactive AI internship",
    },
    "impactive-ai": {
      title: "Impactive-ai Causal Analysis Solution Planning and Development",
      summary: "Participated in planning and developing a causal analysis solution",
    },
    "milan-football": {
      title: "Member of H-Milan Football Team",
      summary: "",
    },
    "sk-hynix-phase-1": {
      title: "SK hynix Phase 1 PoC (Impactive AI Internship)",
      summary: "An initial industrial AI PoC completed during the Impactive AI internship",
    },
    "sk-siltron": {
      title: "SK Siltron Project PoC",
      summary: "Participated in an industrial AI PoC for SK Siltron",
    },
    "sk-on": {
      title: "SK ON Battery Demand Forecasting Project",
      summary: "Participated in a battery demand forecasting project",
    },
    "commax-demand-forecasting": {
      title: "COMMAX Demand Forecasting Project",
      summary: "Participated in a demand forecasting project",
    },
    "likelion-leadership": {
      title: "Like Lion 13th Cohort Representative",
      summary: "Top Excellence Award at the Central Hackathon",
    },
    "likelion-hackathon-award": {
      title: "Like Lion Central Hackathon — Top Excellence Award",
      summary: "",
    },
    "g-star-award": {
      title: "G-star Startup Competition — Top Excellence Award",
      summary: "",
    },
    "demo-day-award": {
      title: "Startup Demo Day — Top Excellence Award",
      summary: "",
    },
    "rpm-award-2025": {
      title: "RPM Startup Competition — Excellence Award",
      summary: "",
    },
    "404-edition": {
      title: "404 Edition",
      summary: "",
    },
    "sw-festival": {
      title: "Smart SW Contest",
      summary: "",
    },
    "likelion-planning-track": {
      title: "Completed the Like Lion Planning Track",
      summary: "",
    },
    "rpm-award-2024": {
      title: "RPM Startup Competition — Encouragement Award",
      summary: "",
    },
    "addiction-psychology": {
      title: "Addiction Psychology Society",
      summary: "",
    },
    "sabong-band-first-performance": {
      title: "Sabong Band 1st Performance",
      summary: "Planning and Performance",
    },
    "sabong-band-second-performance": {
      title: "Sabong Band 2nd Performance",
      summary: "Planning and Performance",
    },
    "choir-director-2024": {
      title: "Second Music Direction",
      summary: "",
    },
    "choir-director-2023": {
      title: "First Music Direction",
      summary: "",
    },
  },
  education: {
    title: "Handong Global University",
    summary: "Majors in AI Convergence & Entrepreneurship and Counseling Psychology",
  },
  militaryService: {
    title: "Republic of Korea Army, V Corps",
    summary: "Driver",
  },
};
