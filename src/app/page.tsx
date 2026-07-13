"use client";

import AdvisorHeader from "@/components/advisor/AdvisorHeader";
import InputSection from "@/components/advisor/InputSection";
import LoadingSection from "@/components/advisor/LoadingSection";
import ResultsSection from "@/components/advisor/ResultsSection";
import { useAdvisorStore } from "@/store/useAdvisorStore";

// 단계(step)에 따라 입력 / 로딩 / 결과 화면을 전환하는 메인 페이지
export default function Home() {
  const step = useAdvisorStore((s) => s.step);

  return (
    <div className="min-h-screen bg-cream px-6 pb-20 text-ink">
      <div className="mx-auto max-w-[1040px]">
        <AdvisorHeader />
        {step === "input" && <InputSection />}
        {step === "loading" && <LoadingSection />}
        {step === "results" && <ResultsSection />}
      </div>
    </div>
  );
}
