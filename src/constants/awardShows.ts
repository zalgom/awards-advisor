import type { AwardShow } from "@/types/advisor";

// 광고제별 대표 출품 카테고리 (참고용 시뮬레이션 데이터)
export const AWARD_SHOWS: AwardShow[] = [
  {
    id: "cannes",
    name: "Cannes Lions International Festival of Creativity",
    categories: [
      "Film",
      "Outdoor",
      "Digital Craft",
      "Creative Data",
      "PR",
      "Media",
      "Social & Influencer",
      "Brand Experience & Activation",
      "Sustainable Development Goals",
      "Direct",
    ],
  },
  {
    id: "nyf",
    name: "New York Festivals Advertising Awards",
    categories: [
      "Film",
      "Design",
      "Digital",
      "Integrated Campaigns",
      "Innovation",
      "PR",
    ],
  },
  {
    id: "clio",
    name: "Clio Awards",
    categories: [
      "Film/Video",
      "Integrated",
      "Digital/Mobile",
      "Innovation",
      "Design",
      "Experiential",
    ],
  },
  {
    id: "lia",
    name: "London International Awards (LIA)",
    categories: [
      "Film",
      "Design",
      "Digital",
      "Creative Strategy",
      "Innovation",
      "Radio & Audio",
    ],
  },
  {
    id: "dad",
    name: "D&AD Awards",
    categories: [
      "Film Advertising",
      "Digital Design",
      "Branding",
      "Integrated",
      "Media",
      "Art Direction",
      "Writing for Design",
    ],
  },
  {
    id: "oneshow",
    name: "The One Show",
    categories: [
      "Film",
      "Design",
      "Digital",
      "Innovation",
      "PR",
      "Branded Entertainment",
    ],
  },
  {
    id: "effie",
    name: "Effie Awards",
    categories: [
      "Positioning & Repositioning",
      "Sustained Success",
      "Social Good",
      "Digital Commerce",
      "Media Idea",
      "Small Budget",
    ],
  },
  {
    id: "adfest",
    name: "AdFest (Asia Pacific Advertising Festival)",
    categories: [
      "Film",
      "Digital",
      "Design",
      "Print",
      "Outdoor",
      "Young Lotus (신인)",
    ],
  },
  {
    id: "spikes",
    name: "Spikes Asia",
    categories: [
      "Film",
      "Digital Craft",
      "Media",
      "PR",
      "Brand Experience",
      "Creative Effectiveness",
    ],
  },
  {
    id: "oneasia",
    name: "One Show Asia (ADSTARS)",
    categories: ["Film", "Digital", "Design", "Integrated", "Young Creatives"],
  },
  {
    id: "kaa",
    name: "대한민국광고대상 (Korea Advertising Awards)",
    categories: [
      "TV/영상 부문",
      "디지털 부문",
      "인쇄 부문",
      "옥외 부문",
      "크리에이티브 전략 부문",
      "PR 부문",
      "뉴미디어/기술 부문",
      "통합 캠페인 부문",
    ],
  },
];

// 로딩 화면에 순환 표시되는 메시지
export const LOADING_MESSAGES: string[] = [
  "캠페인 핵심 메시지 파악 중…",
  "실행 채널과 크리에이티브 요소 분석 중…",
  "광고제별 카테고리 특성 매칭 중…",
  "적합도 및 추천 순위 계산 중…",
  "보고서 초안 정리 중…",
];

// 추천 카테고리 수 범위
export const MIN_RANK_COUNT = 1;
export const MAX_RANK_COUNT = 10;
