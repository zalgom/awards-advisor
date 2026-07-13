"use client";

import AwardShowSelector from "@/components/advisor/AwardShowSelector";
import FileUploadSection from "@/components/advisor/FileUploadSection";
import RankCountSlider from "@/components/advisor/RankCountSlider";
import SectionLabel from "@/components/advisor/SectionLabel";
import {
  selectAnalyzeDisabled,
  useAdvisorStore,
} from "@/store/useAdvisorStore";

// 입력 단계 전체: 인트로 + 입력 카드(01~04) + 분석 버튼
export default function InputSection() {
  const campaignText = useAdvisorStore((s) => s.campaignText);
  const setCampaignText = useAdvisorStore((s) => s.setCampaignText);
  const error = useAdvisorStore((s) => s.error);
  const analyze = useAdvisorStore((s) => s.analyze);
  const analyzeDisabled = useAdvisorStore(selectAnalyzeDisabled);

  return (
    <section className="animate-fade-up">
      <div className="pt-10 pb-2 sm:pt-14">
        <h1 className="mb-3.5 text-[28px] leading-[1.15] font-bold tracking-[-0.02em] sm:text-[38px]">
          캠페인을 분석해
          <br />
          출품할 카테고리를 추천합니다.
        </h1>
        <p className="max-w-[560px] text-[15px] leading-relaxed text-ink/55">
          캠페인 설명이나 자료를 넣으면, 선택한 광고제별로 가장 적합한 출품
          카테고리를 추천 순위와 근거와 함께 정리해 드립니다.
        </p>
      </div>

      <div className="mt-7 rounded-[14px] border border-ink/9 bg-white p-5 sm:p-8">
        <SectionLabel className="mb-3">
          01 · 캠페인 설명{" "}
          <span className="font-normal normal-case text-ink/40">
            (자료를 업로드하면 생략 가능)
          </span>
        </SectionLabel>
        <textarea
          value={campaignText}
          onChange={(e) => setCampaignText(e.target.value)}
          placeholder="캠페인 목표, 핵심 메시지, 실행 채널, 성과 등을 자유롭게 입력하세요. 예) 20대 여성 대상 뷰티 브랜드의 숏폼 인플루언서 캠페인, 참여형 챌린지로 UGC 3만건 유도, 매출 22% 증가…"
          className="min-h-[130px] w-full resize-y rounded-[10px] border border-ink/14 p-4 text-[14.5px] leading-relaxed text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-ink"
        />

        <FileUploadSection />
        <AwardShowSelector />
        <RankCountSlider />

        <div className="mt-[26px] border-t border-ink/8 pt-[26px]" />

        <button
          type="button"
          onClick={() => void analyze()}
          disabled={analyzeDisabled}
          className={`w-full rounded-[10px] px-[30px] py-[18px] text-[15.5px] font-bold tracking-[-0.01em] text-white transition-colors ${
            analyzeDisabled
              ? "cursor-not-allowed bg-ink/25"
              : "cursor-pointer bg-ink hover:bg-ink/85"
          }`}
        >
          카테고리 분석하기 →
        </button>

        {error && (
          <div className="mt-[18px] rounded-[10px] bg-[#fdecea] px-4 py-3.5 text-[13.5px] leading-normal text-[#a3372a]">
            {error}
          </div>
        )}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-ink/40">
        * 카테고리 정보는 참고용 시뮬레이션 데이터입니다. 실제 배포 환경에서는
        각 광고제 홈페이지를 실시간으로 확인해 최신 카테고리로 업데이트합니다.
      </p>
    </section>
  );
}
