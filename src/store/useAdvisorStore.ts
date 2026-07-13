import { create } from "zustand";
import { AWARD_SHOWS } from "@/constants/awardShows";
import type {
  AdvisorStep,
  AnalyzeRequestBody,
  AnalyzeResponseBody,
  Recommendation,
  UploadedImage,
} from "@/types/advisor";

interface AdvisorState {
  step: AdvisorStep;
  campaignText: string;
  documentName: string | null;
  documentText: string;
  documentExtracting: boolean;
  images: UploadedImage[];
  selectedShowIds: string[];
  rankCount: number;
  results: Recommendation[];
  campaignSummary: string;
  error: string | null;

  setCampaignText: (text: string) => void;
  setDocument: (name: string | null, text: string) => void;
  setDocumentExtracting: (extracting: boolean) => void;
  addImage: (image: UploadedImage) => void;
  removeImage: (id: string) => void;
  toggleShow: (id: string) => void;
  toggleSelectAll: () => void;
  setRankCount: (count: number) => void;
  setError: (error: string | null) => void;
  resetToInput: () => void;
  analyze: () => Promise<void>;
}

export const useAdvisorStore = create<AdvisorState>((set, get) => ({
  step: "input",
  campaignText: "",
  documentName: null,
  documentText: "",
  documentExtracting: false,
  images: [],
  selectedShowIds: [],
  rankCount: 3,
  results: [],
  campaignSummary: "",
  error: null,

  setCampaignText: (campaignText) => set({ campaignText }),

  setDocument: (documentName, documentText) =>
    set({ documentName, documentText }),

  setDocumentExtracting: (documentExtracting) => set({ documentExtracting }),

  addImage: (image) => set((s) => ({ images: [...s.images, image] })),

  removeImage: (id) =>
    set((s) => ({ images: s.images.filter((img) => img.id !== id) })),

  toggleShow: (id) =>
    set((s) => ({
      selectedShowIds: s.selectedShowIds.includes(id)
        ? s.selectedShowIds.filter((x) => x !== id)
        : [...s.selectedShowIds, id],
    })),

  toggleSelectAll: () =>
    set((s) => {
      const allSelected = AWARD_SHOWS.every((show) =>
        s.selectedShowIds.includes(show.id),
      );
      return {
        selectedShowIds: allSelected ? [] : AWARD_SHOWS.map((show) => show.id),
      };
    }),

  setRankCount: (rankCount) => set({ rankCount }),

  setError: (error) => set({ error }),

  resetToInput: () => set({ step: "input", results: [], error: null }),

  // 분석 API 호출 후 결과 화면으로 전환
  analyze: async () => {
    const {
      campaignText,
      documentText,
      images,
      selectedShowIds,
      rankCount,
    } = get();

    const hasContent =
      campaignText.trim().length > 0 ||
      documentText.trim().length > 0 ||
      images.length > 0;
    if (!hasContent || selectedShowIds.length === 0) return;

    set({ step: "loading", error: null });

    try {
      const body: AnalyzeRequestBody = {
        campaignText: campaignText.trim(),
        documentText: documentText.trim(),
        images: images.map((img) => ({
          mediaType: img.mediaType,
          data: img.base64,
        })),
        selectedShowIds,
        rankCount,
      };

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorBody = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(errorBody?.error ?? `요청 실패 (${response.status})`);
      }

      const data = (await response.json()) as AnalyzeResponseBody;
      const recommendations = [...data.recommendations]
        .slice(0, rankCount)
        .sort((a, b) => a.rank - b.rank);

      set({
        step: "results",
        results: recommendations,
        campaignSummary: data.summary,
        error: null,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      set({ step: "input", error: `분석 중 오류가 발생했습니다: ${message}` });
    }
  },
}));

// 분석 버튼 활성화 여부 (파생 상태)
export function selectAnalyzeDisabled(state: AdvisorState): boolean {
  const hasContent =
    state.campaignText.trim().length > 0 ||
    state.documentText.trim().length > 0 ||
    state.images.length > 0;
  return !hasContent || state.selectedShowIds.length === 0;
}
