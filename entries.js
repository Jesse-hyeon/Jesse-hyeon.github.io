// 날짜는 YYYY-MM 형식으로 입력합니다. related의 id는 연결할 항목의 id입니다.
const categories = {
  career: "커리어",
  award: "수상경험",
  project: "프로젝트",
};

const entries = [
  {
    id: "intro-programming",
    category: "project",
    date: "2020-03",
    title: "기초 프로그래밍 수업",
    summary: "프로그래밍 기초를 배우며 첫 번째 작은 프로그램을 만들었어요.",
    tags: ["수업", "프로그래밍"],
    sections: [
      { title: "수업에서 한 일", text: "기초 문법과 문제 해결 과정을 익히고, 배운 내용을 활용해 간단한 프로그램을 구현했습니다." },
      { title: "배운 점", text: "작은 문제로 나누어 순서대로 해결하는 과정을 경험했습니다." },
    ],
  },
  {
    id: "band-club",
    category: "career",
    date: "2020-03",
    endDate: "2021-12",
    title: "교내 밴드 동아리",
    summary: "키보드 세션으로 정기 공연을 준비하고 합주 일정을 조율했어요.",
    tags: ["동아리", "밴드"],
    sections: [
      { title: "활동", text: "팀원들과 공연 곡을 고르고, 건반 파트를 편곡해 정기 공연 무대에 올랐습니다." },
      { title: "맡은 역할", text: "합주 일정을 정리하고 연습 녹음을 공유해 다음 합주에서 맞춰볼 부분을 기록했습니다." },
    ],
  },
  {
    id: "football-club",
    category: "career",
    date: "2022-09",
    title: "축구동아리 리그 참가",
    summary: "교내 리그에 출전하며 경기 운영과 팀 훈련에 참여했어요.",
    tags: ["동아리", "축구"],
    sections: [
      { title: "활동", text: "미드필더로 교내 리그에 참가했고, 팀원들과 경기 전 역할과 교체 순서를 조율했습니다." },
      { title: "배운 점", text: "경기 후 짧은 회고를 통해 서로 다르게 본 장면을 공유하고 다음 훈련 과제를 정했습니다." },
    ],
  },
  {
    id: "campus-booking",
    category: "project",
    date: "2023-06",
    title: "교내 공간 예약 서비스",
    summary: "빈 강의실을 찾고 한 화면에서 예약하는 웹 프로토타입을 만들었어요.",
    tags: ["수업", "팀 프로젝트"],
    sections: [
      { title: "해결하려던 문제", text: "빈 강의실을 찾으려면 여러 시간표를 비교해야 했습니다. 학생이 원하는 시간에 사용 가능한 공간을 한눈에 찾도록 설계했습니다." },
      { title: "맡은 역할", text: "예약 화면을 설계하고, 공간과 시간으로 목록을 필터링하는 기능을 구현했습니다." },
      { title: "만든 결과물", text: "공간 검색부터 예약 확인까지 이어지는 시연용 웹 프로토타입을 만들고 교내 소프트웨어 경진대회에서 발표했습니다." },
    ],
    related: [{ id: "campus-award", label: "관련 수상 이력 보기" }],
  },
  {
    id: "campus-award",
    category: "award",
    date: "2023-11",
    title: "교내 소프트웨어 경진대회 우수상",
    summary: "수업에서 시작한 교내 공간 예약 서비스를 발전시켜 출품했어요.",
    tags: ["우수상", "교내 대회"],
    sections: [
      { title: "수상 배경", text: "수업에서 만든 초기 프로토타입으로 동료 학생들의 사용 소감을 듣고, 예약 가능한 시간대가 더 잘 보이도록 화면을 개선했습니다." },
      { title: "발표에서 맡은 역할", text: "공간을 찾고 예약을 완료하는 과정을 시연하고, 피드백을 반영해 화면을 바꾼 이유를 설명했습니다." },
    ],
    related: [{ id: "campus-booking", label: "수상작 보기" }],
  },
  {
    id: "frontend-internship",
    category: "career",
    date: "2025-01",
    endDate: "2025-02",
    title: "프론트엔드 개발 인턴",
    summary: "운영팀이 반복 업무에 사용하는 내부 대시보드의 검색·필터 기능을 개선했어요.",
    tags: ["인턴", "프론트엔드"],
    sections: [
      { title: "맡은 역할", text: "운영팀에서 자주 사용하는 검색 조건을 파악하고, 목록 화면에서 조건을 조합해 조회할 수 있도록 개선했습니다." },
      { title: "배운 점", text: "기능을 배포하기 전에 실제 사용자의 업무 순서에 맞춰 검색, 빈 결과, 오류 화면을 함께 확인했습니다." },
    ],
  },
  {
    id: "match-log",
    category: "project",
    date: "2026-05",
    title: "동아리 경기 기록 웹앱",
    summary: "경기 결과와 참가 명단을 휴대폰에서 기록할 수 있는 페이지를 만들었어요.",
    tags: ["개인 프로젝트", "동아리"],
    sections: [
      { title: "해결하려던 문제", text: "경기 결과가 단체 대화방에 흩어져 이전 경기를 찾기 어려웠습니다." },
      { title: "만든 결과물", text: "경기별 점수와 참가자를 기록하고 날짜순으로 조회할 수 있는 모바일 웹 화면을 만들었습니다." },
    ],
    related: [{ id: "football-club", label: "관련 동아리 활동 보기" }],
  },
];
