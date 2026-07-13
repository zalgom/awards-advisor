# 캠페인 출품 카테고리 어드바이저

캠페인 설명이나 자료(PDF/PPT/이미지)를 입력하면, 선택한 광고제별로 가장 적합한
출품 카테고리를 추천 순위와 근거와 함께 정리해 주는 Next.js 애플리케이션입니다.

## 주요 기능

- **캠페인 입력**: 텍스트 설명, PDF/PPT 문서(클라이언트에서 텍스트 추출), 이미지 첨부
- **광고제 선택**: Cannes Lions, Clio, D&AD, 대한민국광고대상 등 11개 광고제 다중 선택
- **AI 분석**: Claude API(구조화 출력)로 캠페인을 분석해 추천 카테고리 1~10개를 순위·적합도·근거·태그와 함께 반환
- **보고서 내보내기**: 분석 결과를 와이드(16:9) PPTX 보고서로 다운로드

## 기술 스택

- Next.js 15 (App Router) / React 19 / TypeScript
- Tailwind CSS v4
- Zustand (상태 관리)
- Anthropic TypeScript SDK (`claude-sonnet-5`, 구조화 출력 + 어댑티브 씽킹)
- pdfjs-dist(PDF), jszip(PPTX) — 클라이언트 텍스트 추출
- pptxgenjs — PPTX 보고서 생성
- Zod — API 요청 검증

## 시작하기

1. 의존성 설치

   ```bash
   npm install
   ```

2. 환경 변수 설정 — `.env.local.example`을 복사해 `.env.local`을 만들고 API 키를 입력합니다.

   ```bash
   cp .env.local.example .env.local
   # ANTHROPIC_API_KEY=sk-ant-...
   ```

3. 개발 서버 실행

   ```bash
   npm run dev
   ```

   http://localhost:3000 에서 확인할 수 있습니다.

## 프로젝트 구조

```
src/
├── app/
│   ├── api/analyze/route.ts   # Claude API 호출 (구조화 출력)
│   ├── layout.tsx             # Innodaoom 로컬 폰트 + 메타데이터
│   └── page.tsx               # 단계별 화면 전환 (입력/로딩/결과)
├── components/advisor/        # 화면 컴포넌트
├── constants/                 # 광고제 데이터, 브랜딩 상수
├── lib/
│   ├── extractDocumentText.ts # PDF/PPTX 텍스트 추출
│   └── generateReportPptx.ts  # PPTX 보고서 생성
├── store/useAdvisorStore.ts   # Zustand 전역 상태
└── types/advisor.ts           # 공용 타입
```

## 브랜드 서체 적용 (선택)

디자인 시안은 Innodaoom 서체를 사용합니다. 원본 TTF 3종(LIGHT/MEDIUM/BOLD)을
`public/fonts/`에 넣고 `src/app/layout.tsx` 상단의 주석 처리된 `localFont`
블록을 해제하면 브랜드 서체가 적용됩니다. (디자인 프로젝트 API의 파일 크기
제한으로 폰트 원본을 자동으로 가져올 수 없어 기본은 시스템 폰트 폴백입니다.)

## 참고

- 카테고리 정보는 참고용 시뮬레이션 데이터입니다. 실제 운영 시 각 광고제
  공식 홈페이지의 최신 카테고리로 갱신이 필요합니다.
- 이미지 첨부는 요청당 최대 8개, 문서 텍스트는 12,000자까지 분석에 사용됩니다.
