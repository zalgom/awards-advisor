import type { Recommendation } from "@/types/advisor";

// 결과 데이터를 와이드(16:9) PPTX 보고서로 내보내는 클라이언트 유틸
interface ReportPptxOptions {
  companyName: string;
  accentColor: string;
  rankCount: number;
  campaignSummary: string;
  results: Recommendation[];
}

const DARK = "1C1A17";
const CREAM = "F6F4F0";
const MUTED = "8A8378";
const FONT_FACE = "Innodaoom";

export async function generateReportPptx({
  companyName,
  accentColor,
  rankCount,
  campaignSummary,
  results,
}: ReportPptxOptions): Promise<void> {
  const PptxGenJS = (await import("pptxgenjs")).default;
  const pptx = new PptxGenJS();
  const accentHex = accentColor.replace("#", "");

  pptx.defineLayout({ name: "WIDE", width: 13.33, height: 7.5 });
  pptx.layout = "WIDE";

  // 1. 표지
  const cover = pptx.addSlide();
  cover.background = { color: DARK };
  cover.addText(companyName.toUpperCase(), {
    x: 0.6,
    y: 0.5,
    fontSize: 14,
    bold: true,
    color: "FFFFFF",
    charSpacing: 2,
    fontFace: FONT_FACE,
  });
  cover.addText("캠페인 출품 카테고리\n추천 보고서", {
    x: 0.6,
    y: 2.6,
    w: 11,
    h: 2.2,
    fontSize: 40,
    bold: true,
    color: "FFFFFF",
    fontFace: FONT_FACE,
  });
  cover.addText(
    `추천 카테고리 ${rankCount}건 · ${new Date().toLocaleDateString("ko-KR")}`,
    { x: 0.6, y: 5.1, fontSize: 14, color: "CFC8BE", fontFace: FONT_FACE },
  );

  // 2. 캠페인 요약
  const summarySlide = pptx.addSlide();
  summarySlide.background = { color: CREAM };
  summarySlide.addText("캠페인 요약", {
    x: 0.6,
    y: 0.5,
    fontSize: 22,
    bold: true,
    color: DARK,
    fontFace: FONT_FACE,
  });
  summarySlide.addText(campaignSummary || "-", {
    x: 0.6,
    y: 1.4,
    w: 11.5,
    h: 3,
    fontSize: 16,
    color: DARK,
    lineSpacing: 26,
    fontFace: FONT_FACE,
  });

  // 3. 추천 순위 요약 테이블
  const tableSlide = pptx.addSlide();
  tableSlide.background = { color: CREAM };
  tableSlide.addText("추천 순위 요약", {
    x: 0.6,
    y: 0.4,
    fontSize: 22,
    bold: true,
    color: DARK,
    fontFace: FONT_FACE,
  });

  const headerCell = (text: string) => ({
    text,
    options: { bold: true, color: "FFFFFF", fill: { color: DARK } },
  });
  const rows = [
    [
      headerCell("순위"),
      headerCell("광고제"),
      headerCell("카테고리"),
      headerCell("적합도"),
    ],
    ...results.map((r) => [
      { text: String(r.rank) },
      { text: r.show },
      { text: r.category },
      { text: `${r.matchScore}%` },
    ]),
  ];
  tableSlide.addTable(rows, {
    x: 0.6,
    y: 1.1,
    w: 12.1,
    fontSize: 13,
    color: DARK,
    fontFace: FONT_FACE,
    border: { type: "solid", color: "DDD6CB", pt: 0.5 },
    autoPage: true,
  });

  // 4. 추천별 상세 슬라이드
  for (const r of results) {
    const slide = pptx.addSlide();
    slide.background = { color: "FFFFFF" };
    slide.addShape("roundRect", {
      x: 0.6,
      y: 0.6,
      w: 0.9,
      h: 0.9,
      rectRadius: 0.15,
      fill: { color: accentHex },
      line: { color: accentHex },
    });
    slide.addText(String(r.rank), {
      x: 0.6,
      y: 0.6,
      w: 0.9,
      h: 0.9,
      fontSize: 28,
      bold: true,
      color: "FFFFFF",
      align: "center",
      valign: "middle",
      fontFace: FONT_FACE,
    });
    slide.addText(r.show, {
      x: 1.8,
      y: 0.65,
      fontSize: 13,
      bold: true,
      color: MUTED,
      fontFace: FONT_FACE,
    });
    slide.addText(r.category, {
      x: 1.8,
      y: 1.0,
      w: 10.5,
      fontSize: 26,
      bold: true,
      color: DARK,
      fontFace: FONT_FACE,
    });
    slide.addText(`적합도 ${r.matchScore}%`, {
      x: 1.8,
      y: 1.65,
      fontSize: 14,
      color: accentHex,
      bold: true,
      fontFace: FONT_FACE,
    });
    slide.addText(r.reasoning, {
      x: 0.6,
      y: 2.6,
      w: 12.1,
      h: 2.6,
      fontSize: 16,
      color: DARK,
      lineSpacing: 26,
      fontFace: FONT_FACE,
    });
    slide.addText(r.tags.join("   ·   "), {
      x: 0.6,
      y: 6.5,
      w: 12.1,
      fontSize: 12,
      color: MUTED,
      fontFace: FONT_FACE,
    });
  }

  await pptx.writeFile({ fileName: "캠페인_출품_카테고리_추천_보고서.pptx" });
}
