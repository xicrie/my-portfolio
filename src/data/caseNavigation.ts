import { cases, materialTypes, type MaterialType } from "./cases";

// Retain old inbound links while replacing topic/technology tags with material types.
const legacyTypes: Record<string, MaterialType> = {
  "Статьи": "articles", "Email": "newsletters", "Тексты рассылок": "newsletters",
  "Упаковка кейсов": "cases", "Кейсы": "cases",
};
export function normalizeCaseSearch(search: string): string {
  const params = new URLSearchParams(search);
  const active = cases.find(c => c.id === params.get("case"));
  const requested = params.get("direction");
  const direction = active?.category ?? (requested === "marketing" ? "marketing" : "ai");
  if (requested && requested !== direction || active && requested !== direction) params.set("direction", direction);
  const legacy = params.get("tag");
  if (!params.has("type") && legacy && legacyTypes[legacy]) params.set("type", legacyTypes[legacy]);
  params.delete("tag");
  const type = params.get("type") as MaterialType | null;
  if (type && (!(type in materialTypes) || !cases.some(c => c.category === direction && c.materialType === type) || active && active.materialType !== type)) params.delete("type");
  return params.toString();
}
