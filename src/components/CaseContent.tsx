import { useEffect, useState } from "react";
import type { PortfolioCase } from "@/data/cases";
import AIEngineeringCase from "./AIEngineeringCase";
import MarketingCase from "./MarketingCase";

export default function CaseContent({ item }: { item: PortfolioCase }) {
  const [result, setResult] = useState<{ id: string; content?: string; error?: boolean }>({ id: "" });
  useEffect(() => {
    let current = true;
    item.loadContent().then(content => { if (current) setResult({ id: item.id, content }); })
      .catch(() => { if (current) setResult({ id: item.id, error: true }); });
    return () => { current = false; };
  }, [item]);
  if (result.id !== item.id) return <p role="status">Загружаю материал…</p>;
  if (result.error) return <p role="alert">Не удалось загрузить материал. Закройте кейс и&nbsp;попробуйте открыть его ещё раз.</p>;
  return item.category === "ai" ? <AIEngineeringCase id={item.id} content={result.content ?? ""} /> : <MarketingCase id={item.id} content={result.content ?? ""} />;
}
