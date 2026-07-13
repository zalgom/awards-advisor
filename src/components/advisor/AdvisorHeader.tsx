"use client";

import { APP_SUBTITLE, COMPANY_NAME } from "@/constants/app";
import { useAdvisorStore } from "@/store/useAdvisorStore";

// 상단 헤더: 브랜드명 + 서비스명, 결과 화면에서는 새로 분석하기 버튼 노출
export default function AdvisorHeader() {
  const step = useAdvisorStore((s) => s.step);
  const resetToInput = useAdvisorStore((s) => s.resetToInput);

  return (
    <header className="flex items-center justify-between gap-4 border-b border-ink/10 pt-9 pb-7">
      <div className="flex items-baseline gap-3.5">
        <span className="text-[15px] font-bold tracking-[0.06em]">
          {COMPANY_NAME}
        </span>
        <span className="hidden h-3.5 w-px bg-ink/20 sm:block" aria-hidden />
        <span className="hidden text-[13px] font-medium text-ink/50 sm:block">
          {APP_SUBTITLE}
        </span>
      </div>
      {step === "results" && (
        <button
          type="button"
          onClick={resetToInput}
          className="cursor-pointer px-1 py-2 text-[13px] font-semibold text-ink/55 transition-colors hover:text-ink"
        >
          ＋ 새로 분석하기
        </button>
      )}
    </header>
  );
}
