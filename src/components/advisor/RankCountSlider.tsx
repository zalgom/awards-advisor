"use client";

import SectionLabel from "@/components/advisor/SectionLabel";
import { MAX_RANK_COUNT, MIN_RANK_COUNT } from "@/constants/awardShows";
import { useAdvisorStore } from "@/store/useAdvisorStore";

// 04 · 추천 카테고리 수 슬라이더
export default function RankCountSlider() {
  const rankCount = useAdvisorStore((s) => s.rankCount);
  const setRankCount = useAdvisorStore((s) => s.setRankCount);

  return (
    <div className="mt-[30px]">
      <SectionLabel className="mb-3.5">
        04 · 추천 카테고리 수{" "}
        <span className="ml-1 font-bold normal-case text-ink">
          {rankCount}개
        </span>
      </SectionLabel>
      <input
        type="range"
        min={MIN_RANK_COUNT}
        max={MAX_RANK_COUNT}
        step={1}
        value={rankCount}
        onChange={(e) => setRankCount(parseInt(e.target.value, 10))}
        aria-label="추천 카테고리 수"
        className="w-full"
      />
      <div className="mt-1 flex justify-between text-[11.5px] text-ink/40">
        <span>최소 {MIN_RANK_COUNT}개</span>
        <span>최대 {MAX_RANK_COUNT}개</span>
      </div>
    </div>
  );
}
