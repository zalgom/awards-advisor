"use client";

import SectionLabel from "@/components/advisor/SectionLabel";
import { AWARD_SHOWS } from "@/constants/awardShows";
import { useAdvisorStore } from "@/store/useAdvisorStore";

// 03 · 출품할 광고제 선택 (다중 선택 + 전체 선택 토글)
export default function AwardShowSelector() {
  const selectedShowIds = useAdvisorStore((s) => s.selectedShowIds);
  const toggleShow = useAdvisorStore((s) => s.toggleShow);
  const toggleSelectAll = useAdvisorStore((s) => s.toggleSelectAll);

  const allSelected = AWARD_SHOWS.every((show) =>
    selectedShowIds.includes(show.id),
  );

  return (
    <div>
      <div className="mt-7 mb-3 flex items-center justify-between">
        <SectionLabel>03 · 출품할 광고제 선택</SectionLabel>
        <button
          type="button"
          onClick={toggleSelectAll}
          className="cursor-pointer p-0.5 text-[12.5px] font-bold text-ink transition-opacity hover:opacity-60"
        >
          {allSelected ? "전체 선택 해제" : "전체 선택"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {AWARD_SHOWS.map((show) => {
          const selected = selectedShowIds.includes(show.id);
          return (
            <button
              key={show.id}
              type="button"
              onClick={() => toggleShow(show.id)}
              aria-pressed={selected}
              className={`flex cursor-pointer items-center gap-2.5 rounded-[10px] border-[1.5px] px-3.5 py-3 text-left text-[13.5px] font-semibold transition-all duration-100 ${
                selected
                  ? "border-ink bg-ink/4 text-ink"
                  : "border-ink/14 bg-white text-ink/70"
              }`}
            >
              <span
                aria-hidden
                className={`size-4 flex-none rounded-[5px] border-[1.5px] text-center text-[11px] leading-[14px] text-white ${
                  selected ? "border-ink bg-ink" : "border-ink/28 bg-white"
                }`}
              >
                {selected ? "✓" : ""}
              </span>
              <span>{show.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
