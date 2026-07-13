// 광고제 정보
export interface AwardShow {
  id: string;
  name: string;
  categories: string[];
}

// 업로드된 이미지 (base64 인코딩)
export interface UploadedImage {
  id: string;
  name: string;
  dataUrl: string;
  base64: string;
  mediaType: ImageMediaType;
}

// Claude Vision이 지원하는 이미지 MIME 타입
export type ImageMediaType =
  | "image/jpeg"
  | "image/png"
  | "image/gif"
  | "image/webp";

// 추천 결과 1건
export interface Recommendation {
  rank: number;
  show: string;
  category: string;
  matchScore: number;
  reasoning: string;
  tags: string[];
}

// 분석 API 요청 바디
export interface AnalyzeRequestBody {
  campaignText: string;
  documentText: string;
  images: Array<{
    mediaType: ImageMediaType;
    data: string;
  }>;
  selectedShowIds: string[];
  rankCount: number;
}

// 분석 API 응답
export interface AnalyzeResponseBody {
  summary: string;
  recommendations: Recommendation[];
}

// 화면 단계
export type AdvisorStep = "input" | "loading" | "results";
