// 입력 카드 내 섹션 제목 라벨 (01 · 캠페인 설명 형태)
interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionLabel({
  children,
  className = "",
}: SectionLabelProps) {
  return (
    <div
      className={`text-[13px] font-bold uppercase tracking-[0.03em] text-ink/45 ${className}`}
    >
      {children}
    </div>
  );
}
