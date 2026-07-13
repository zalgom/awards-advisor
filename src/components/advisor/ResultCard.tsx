import type { Recommendation } from "@/types/advisor";

// 추천 결과 카드 1건: 순위 배지 + 광고제/적합도 + 카테고리 + 근거 + 태그
interface ResultCardProps {
  item: Recommendation;
}

export default function ResultCard({ item }: ResultCardProps) {
  const isTopRank = item.rank <= 3;

  return (
    <article className="flex flex-col gap-4 rounded-[14px] border border-ink/9 bg-white px-5 py-[22px] sm:flex-row sm:gap-5 sm:px-6">
      <div
        className={`flex size-11 flex-none items-center justify-center rounded-[10px] text-[17px] font-bold ${
          isTopRank ? "bg-ink text-white" : "bg-ink/6 text-ink"
        }`}
      >
        {item.rank}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex flex-wrap items-center gap-2.5">
          <span className="rounded-md border border-ink/18 px-2 py-[3px] text-xs font-bold tracking-[0.02em] text-ink/50">
            {item.show}
          </span>
          <span className="text-xs text-ink/40">
            적합도 {item.matchScore}%
          </span>
        </div>

        <h3 className="mb-2 text-[17px] font-bold tracking-[-0.01em]">
          {item.category}
        </h3>

        <div className="mb-2.5 h-[5px] max-w-[280px] overflow-hidden rounded-[3px] bg-ink/8">
          <div
            className="h-full rounded-[3px] bg-accent"
            style={{ width: `${Math.min(Math.max(item.matchScore, 0), 100)}%` }}
          />
        </div>

        <p className="mb-2.5 text-[13.5px] leading-relaxed text-ink/68">
          {item.reasoning}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-[5px] bg-ink/5 px-2 py-[3px] text-[11.5px] text-ink/50"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
