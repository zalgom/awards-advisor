// PDF / PPTX 파일에서 텍스트를 추출하는 클라이언트 전용 유틸
// - PDF: pdfjs-dist 사용 (최대 20페이지)
// - PPTX: jszip으로 슬라이드 XML을 파싱 (최대 40슬라이드)

const MAX_PDF_PAGES = 20;
const MAX_PPTX_SLIDES = 40;
const MAX_TEXT_LENGTH = 12_000;

export function isPptxFile(file: File): boolean {
  return /\.pptx?$/i.test(file.name) || file.type.includes("presentation");
}

export async function extractDocumentText(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const text = isPptxFile(file)
    ? await extractPptxText(buffer)
    : await extractPdfText(buffer);
  return text.slice(0, MAX_TEXT_LENGTH);
}

async function extractPdfText(buffer: ArrayBuffer): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();

  const doc = await pdfjs.getDocument({ data: buffer }).promise;
  const maxPages = Math.min(doc.numPages, MAX_PDF_PAGES);
  let text = "";

  for (let pageNumber = 1; pageNumber <= maxPages; pageNumber += 1) {
    const page = await doc.getPage(pageNumber);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
    text += `${pageText}\n`;
  }

  return text;
}

async function extractPptxText(buffer: ArrayBuffer): Promise<string> {
  const JSZip = (await import("jszip")).default;
  const zip = await JSZip.loadAsync(buffer);

  const slideFiles = Object.keys(zip.files)
    .filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name))
    .sort((a, b) => extractSlideNumber(a) - extractSlideNumber(b))
    .slice(0, MAX_PPTX_SLIDES);

  let text = "";
  for (const name of slideFiles) {
    const xml = await zip.files[name].async("text");
    const matches = xml.match(/<a:t>([^<]*)<\/a:t>/g) ?? [];
    const slideText = matches
      .map((m) => m.replace(/<a:t>|<\/a:t>/g, ""))
      .join(" ");
    text += `${slideText}\n`;
  }

  return text;
}

function extractSlideNumber(path: string): number {
  const match = path.match(/slide(\d+)\.xml/);
  return match ? parseInt(match[1], 10) : 0;
}
