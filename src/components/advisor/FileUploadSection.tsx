"use client";

import Image from "next/image";
import { useRef } from "react";
import SectionLabel from "@/components/advisor/SectionLabel";
import { extractDocumentText, isPptxFile } from "@/lib/extractDocumentText";
import { useAdvisorStore } from "@/store/useAdvisorStore";
import type { ImageMediaType, UploadedImage } from "@/types/advisor";

const SUPPORTED_IMAGE_TYPES: ImageMediaType[] = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

// 02 · 자료 업로드: PDF/PPT 문서와 이미지 첨부
export default function FileUploadSection() {
  const documentName = useAdvisorStore((s) => s.documentName);
  const documentExtracting = useAdvisorStore((s) => s.documentExtracting);
  const images = useAdvisorStore((s) => s.images);
  const setDocument = useAdvisorStore((s) => s.setDocument);
  const setDocumentExtracting = useAdvisorStore((s) => s.setDocumentExtracting);
  const addImage = useAdvisorStore((s) => s.addImage);
  const removeImage = useAdvisorStore((s) => s.removeImage);
  const setError = useAdvisorStore((s) => s.setError);

  const documentInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleDocumentSelected = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setDocument(file.name, "");
    setDocumentExtracting(true);
    setError(null);

    try {
      const text = await extractDocumentText(file);
      setDocument(file.name, text);
    } catch {
      const kind = isPptxFile(file) ? "PPT" : "PDF";
      setDocument(null, "");
      setError(
        `${kind} 텍스트 추출에 실패했습니다. 캠페인 설명을 직접 입력해주세요.`,
      );
    } finally {
      setDocumentExtracting(false);
      event.target.value = "";
    }
  };

  const handleImagesSelected = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files ?? []);
    for (const file of files) {
      const mediaType = file.type as ImageMediaType;
      if (!SUPPORTED_IMAGE_TYPES.includes(mediaType)) continue;

      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = String(reader.result);
        const base64 = dataUrl.split(",")[1] ?? "";
        const image: UploadedImage = {
          id: `${Date.now()}-${Math.random()}`,
          name: file.name,
          dataUrl,
          base64,
          mediaType,
        };
        addImage(image);
      };
      reader.readAsDataURL(file);
    }
    event.target.value = "";
  };

  const documentLabel = documentExtracting
    ? "추출 중…"
    : (documentName ?? "클릭하여 업로드");
  const imageLabel =
    images.length > 0 ? `${images.length}개 첨부됨` : "클릭하여 업로드";

  return (
    <div>
      <SectionLabel className="mt-7 mb-3">
        02 · 자료 업로드{" "}
        <span className="font-normal normal-case text-ink/40">(선택)</span>
      </SectionLabel>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <UploadCard
          icon="📄"
          title="PDF / PPT 캠페인 문서"
          subtitle={documentLabel}
          onClick={() => documentInputRef.current?.click()}
        >
          <input
            ref={documentInputRef}
            type="file"
            accept="application/pdf,.ppt,.pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation"
            onChange={handleDocumentSelected}
            className="hidden"
          />
        </UploadCard>

        <UploadCard
          icon="🖼️"
          title="이미지 / 스크린샷"
          subtitle={imageLabel}
          onClick={() => imageInputRef.current?.click()}
        >
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImagesSelected}
            className="hidden"
          />
        </UploadCard>
      </div>

      {images.length > 0 && (
        <div className="mt-3.5 flex flex-wrap gap-2.5">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative size-16 overflow-hidden rounded-lg border border-ink/12 bg-ink/4"
            >
              <Image
                src={img.dataUrl}
                alt={img.name}
                fill
                unoptimized
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(img.id)}
                aria-label={`${img.name} 삭제`}
                className="absolute top-0.5 right-0.5 size-[18px] cursor-pointer rounded-full bg-black/60 text-[11px] leading-[18px] text-white"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 점선 테두리 업로드 카드 (문서/이미지 공용)
interface UploadCardProps {
  icon: string;
  title: string;
  subtitle: string;
  onClick: () => void;
  children: React.ReactNode;
}

function UploadCard({ icon, title, subtitle, onClick, children }: UploadCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer rounded-[10px] border-[1.5px] border-dashed border-ink/22 p-[22px] text-center transition-colors hover:border-ink hover:bg-ink/2"
    >
      {children}
      <div className="mb-1.5 text-2xl">{icon}</div>
      <div className="text-[13.5px] font-semibold">{title}</div>
      <div className="mt-[3px] truncate text-xs text-ink/45">{subtitle}</div>
    </button>
  );
}
