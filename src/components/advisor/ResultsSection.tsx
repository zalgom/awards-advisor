"use client";

import { useState } from "react";
import ResultCard from "@/components/advisor/ResultCard";
import SectionLabel from "@/components/advisor/SectionLabel";
import { ACCENT_COLOR, COMPANY_NAME } from "@/constants/app";
import { generateReportPptx } from "@/lib/generateReportPptx";
import { useAdvisorStore } from "@/store/useAdvisorStore";

// 결과 단계: 요약 헤더 + PPTX 다운로드 + 추천 카드 목록
export default function ResultsSection() {
  const results = useAdvisorStore((s) => s.results);
  const campaignSummary = useAdvisorStore((s) => s.campaignSummary);
  const rankCount = useAdvisorStore((s) => s.rankCount);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await generateReportPptx({
        companyName: COMPANY_NAME,
        accentColor: ACCENT_COLOR,
        rankCount: results.length,
        campaignSummary,
        results,
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section className="animate-fade-up">
      <div className="flex flex-col items-start justify-between gap-6 pt-8 pb-2 sm:flex-row sm:pt-11">
        <div>
          <SectionLabel className="mb-2.5">추천 결과</SectionLabel>
          <h1 className="mb-2.5 text-[24px] font-bold tracking-[-0.01em] sm:text-[28px]">
            출품 카테고리 추천 {rankCount}선
          </h1>
          <p className="max-w-[600px] text-sm leading-relaxed text-ink/55">
            {campaignSummary}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void handleDownload()}
          disabled={downloading}
          className="flex-none cursor-pointer rounded-[10px] bg-ink px-[22px] py-3.5 text-sm font-bold whitespace-nowrap text-white transition-colors hover:bg-ink/85 disabled:cursor-wait disabled:bg-ink/60"
        >
          {downloading ? "생성 중…" : "보고서 PPTX 다운로드 ↓"}
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {results.map((item) => (
          <ResultCard key={`${item.rank}-${item.category}`} item={item} />
        ))}
      </div>
    </section>
  );
}
