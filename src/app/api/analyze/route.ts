import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { z } from "zod";
import { AWARD_SHOWS, MAX_RANK_COUNT, MIN_RANK_COUNT } from "@/constants/awardShows";
import type { AnalyzeResponseBody } from "@/types/advisor";

// Claude 응답 시간이 길 수 있어 최대 실행 시간을 넉넉히 설정
export const maxDuration = 120;

const MAX_IMAGES = 8;

// 요청 바디 검증 스키마
const analyzeRequestSchema = z.object({
  campaignText: z.string().max(20_000),
  documentText: z.string().max(20_000),
  images: z
    .array(
      z.object({
        mediaType: z.enum([
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
        ]),
        data: z.string().min(1),
      }),
    )
    .max(MAX_IMAGES),
  selectedShowIds: z.array(z.string()).min(1),
  rankCount: z.number().int().min(MIN_RANK_COUNT).max(MAX_RANK_COUNT),
});

// Claude 구조화 출력(JSON Schema): 응답이 항상 이 형태로 보장됨
function buildOutputSchema(rankCount: number) {
  return {
    type: "object",
    properties: {
      summary: {
        type: "string",
        description: "캠페인에 대한 1~2문장 요약 (한국어)",
      },
      recommendations: {
        type: "array",
        items: {
          type: "object",
          properties: {
            rank: {
              type: "integer",
              description: `추천 순위 (1~${rankCount}, 1이 가장 적합)`,
            },
            show: { type: "string", description: "광고제명" },
            category: { type: "string", description: "카테고리명" },
            matchScore: {
              type: "integer",
              description: "적합도 점수 (0~100)",
            },
            reasoning: {
              type: "string",
              description: "이 카테고리를 추천하는 구체적 근거 2~3문장 (한국어)",
            },
            tags: {
              type: "array",
              items: { type: "string" },
              description: "캠페인 특성 키워드 3개 내외",
            },
          },
          required: [
            "rank",
            "show",
            "category",
            "matchScore",
            "reasoning",
            "tags",
          ],
          additionalProperties: false,
        },
      },
    },
    required: ["summary", "recommendations"],
    additionalProperties: false,
  };
}

export async function POST(request: Request) {
  const parsed = analyzeRequestSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "요청 형식이 올바르지 않습니다." },
      { status: 400 },
    );
  }

  const { campaignText, documentText, images, selectedShowIds, rankCount } =
    parsed.data;

  const selectedShows = AWARD_SHOWS.filter((show) =>
    selectedShowIds.includes(show.id),
  );
  if (selectedShows.length === 0) {
    return NextResponse.json(
      { error: "유효한 광고제를 선택해주세요." },
      { status: 400 },
    );
  }

  const referenceData = selectedShows.map((show) => ({
    show: show.name,
    categories: show.categories,
  }));

  const systemPrompt = `당신은 글로벌 광고제 출품 전략을 전문으로 하는 크리에이티브 컨설턴트입니다.
아래 "참고 카테고리 데이터"는 각 광고제의 대표 출품 카테고리 목록입니다(참고용 시뮬레이션 데이터).
사용자가 제공한 캠페인 정보를 분석해, 참고 카테고리 데이터 안에서 가장 적합한 카테고리를 정확히 ${rankCount}개 선정하고 추천 순위(1이 가장 적합)를 매기세요.
같은 광고제에서 여러 카테고리를 추천해도 되고, 여러 광고제에 걸쳐 섞어서 추천해도 됩니다. 적합도가 높은 순서대로 순위를 매기세요.
recommendations 배열은 반드시 ${rankCount}개, rank는 1부터 ${rankCount}까지 중복 없이 오름차순이어야 합니다.
summary와 reasoning은 한국어로 작성하세요.

참고 카테고리 데이터:
${JSON.stringify(referenceData, null, 2)}`;

  // 텍스트 + 이미지 멀티모달 콘텐츠 블록 구성
  const contentBlocks: Anthropic.ContentBlockParam[] = [];
  let textPart = `캠페인 설명:\n${campaignText || "(텍스트 설명 없음, 첨부 자료 참고)"}`;
  if (documentText) {
    textPart += `\n\n첨부 문서 내용 (일부):\n${documentText}`;
  }
  contentBlocks.push({ type: "text", text: textPart });
  for (const image of images) {
    contentBlocks.push({
      type: "image",
      source: {
        type: "base64",
        media_type: image.mediaType,
        data: image.data,
      },
    });
  }

  // API 키 미설정을 사전에 감지해 명확한 안내 제공
  if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) {
    return NextResponse.json(
      {
        error:
          "ANTHROPIC_API_KEY가 설정되지 않았습니다. .env.local 파일에 키를 추가한 뒤 서버를 재시작해주세요.",
      },
      { status: 500 },
    );
  }

  try {
    const client = new Anthropic();
    const response = await client.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 16000,
      thinking: { type: "adaptive" },
      system: systemPrompt,
      output_config: {
        format: {
          type: "json_schema",
          schema: buildOutputSchema(rankCount),
        },
      },
      messages: [{ role: "user", content: contentBlocks }],
    });

    if (response.stop_reason === "refusal") {
      return NextResponse.json(
        { error: "요청이 정책상 처리되지 않았습니다. 내용을 수정해 다시 시도해주세요." },
        { status: 422 },
      );
    }

    const textBlock = response.content.find(
      (block): block is Anthropic.TextBlock => block.type === "text",
    );
    if (!textBlock) {
      return NextResponse.json(
        { error: "분석 결과를 생성하지 못했습니다. 다시 시도해주세요." },
        { status: 502 },
      );
    }

    const result = JSON.parse(textBlock.text) as AnalyzeResponseBody;
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY가 설정되지 않았거나 유효하지 않습니다." },
        { status: 500 },
      );
    }
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: "요청이 많아 잠시 제한되었습니다. 잠시 후 다시 시도해주세요." },
        { status: 429 },
      );
    }
    if (
      error instanceof Anthropic.BadRequestError &&
      error.message.includes("credit balance")
    ) {
      return NextResponse.json(
        {
          error:
            "Anthropic 계정의 크레딧 잔액이 부족합니다. platform.claude.com의 Plans & Billing에서 크레딧을 충전해주세요.",
        },
        { status: 402 },
      );
    }
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `AI 분석 요청에 실패했습니다. (${error.status ?? "network"})` },
        { status: 502 },
      );
    }
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
