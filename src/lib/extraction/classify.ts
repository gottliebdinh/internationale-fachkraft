import type { DocumentType } from "@/types/database";

const RULES: Array<{ test: (lower: string) => boolean; type: DocumentType }> = [
  {
    test: (f) => f.includes("passport") || f.includes("hộ chiếu") || f.includes("ho chieu"),
    type: "passport",
  },
  {
    test: (f) =>
      (f.includes("b1") || f.includes("b2") || f.includes("deutsch")) &&
      (f.includes("zertifikat") || f.includes("certificate") || f.includes("chứng chỉ")),
    type: "b1_certificate",
  },
  {
    test: (f) => f.includes("lebenslauf") || f.includes("cv") || f.includes("sơ yếu lý lịch"),
    type: "cv",
  },
  {
    test: (f) =>
      f.includes("abitur") ||
      f.includes("bằng") ||
      f.includes("thpt") ||
      f.includes("zeugnis") ||
      f.includes("diploma") ||
      f.includes("tốt nghiệp"),
    type: "diploma",
  },
  {
    test: (f) =>
      f.includes("học bạ") ||
      f.includes("hoc ba") ||
      f.includes("schulbuch") ||
      f.includes("school record"),
    type: "school_records",
  },
  {
    test: (f) =>
      (f.includes("anschreiben") || f.includes("bewerbungsschreiben") || f.includes("deckblatt")) &&
      !f.includes("unterlagen"),
    type: "cover_letter",
  },
  {
    test: (f) =>
      f.includes("gesundheitszeugnis") ||
      f.includes("health") ||
      f.includes("khám sức khỏe"),
    type: "health_certificate",
  },
  {
    test: (f) =>
      f.includes("bewerbungsunterlagen") ||
      f.includes("merged") ||
      f.includes("komplett"),
    type: "application_bundle",
  },
];

const PHOTO_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

export function classifyFile(filename: string): DocumentType {
  const lower = filename.toLowerCase().normalize("NFC");

  for (const rule of RULES) {
    if (rule.test(lower)) return rule.type;
  }

  const ext = lower.slice(lower.lastIndexOf("."));
  if (PHOTO_EXTENSIONS.has(ext)) return "photo";

  return "other";
}
