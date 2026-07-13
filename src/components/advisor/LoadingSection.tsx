"use client";

import { useEffect, useState } from "react";
import { LOADING_MESSAGES } from "@/constants/awardShows";

const MESSAGE_INTERVAL_MS = 1600;

// 분석 진행 중 스피너와 순환 메시지 표시
export default function LoadingSection() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, MESSAGE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center gap-[22px]">
      <div
        aria-hidden
        className="size-[52px] animate-spin rounded-full border-[3px] border-ink/12 border-t-ink [animation-duration:0.9s]"
      />
      <p className="text-[15px] font-semibold text-ink/70" role="status">
        {LOADING_MESSAGES[messageIndex]}
      </p>
    </section>
  );
}
