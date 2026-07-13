import type { Metadata } from "next";
import "./globals.css";

// NOTE: 브랜드 서체(Innodaoom) 적용 방법
// 1. public/fonts/ 에 INNODAOOM-LIGHT.ttf, INNODAOOM-MEDIUM.ttf, INNODAOOM-BOLD.ttf 를 넣고
// 2. 아래 주석을 해제하면 됩니다.
//
// import localFont from "next/font/local";
// const innodaoom = localFont({
//   src: [
//     { path: "../../public/fonts/INNODAOOM-LIGHT.ttf", weight: "300" },
//     { path: "../../public/fonts/INNODAOOM-MEDIUM.ttf", weight: "500" },
//     { path: "../../public/fonts/INNODAOOM-BOLD.ttf", weight: "700" },
//   ],
//   variable: "--font-innodaoom",
//   display: "swap",
//   adjustFontFallback: false,
// });
// ...그리고 <body className={`${innodaoom.variable} antialiased`}>로 변경하세요.

export const metadata: Metadata = {
  title: "캠페인 출품 카테고리 어드바이저 | INNOCEAN",
  description:
    "캠페인 설명이나 자료를 넣으면, 선택한 광고제별로 가장 적합한 출품 카테고리를 추천 순위와 근거와 함께 정리해 드립니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
