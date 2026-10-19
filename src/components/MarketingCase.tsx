import { marketingStories } from "@/data/marketingStories";
import CaseMarkdown from "./CaseMarkdown";
export default function MarketingCase({ id, content }: { id: string; content: string }) {
  const story = marketingStories[id];
  return <div className="marketing-story" data-marketing-story={id}>
    <p className="case-lead text-xl leading-relaxed sm:text-2xl">{story.lead}</p>
    <div className="case-context my-7 space-y-4 border-y border-border py-6">
      <p><strong>Для кого: </strong>{story.audience}</p>
      <p><strong>Моя роль: </strong>{story.role}</p>
    </div>
    <section className="mb-9"><h3 className="mb-4 text-2xl font-semibold">Задача материала</h3><p className="leading-[1.85] text-muted-foreground">{story.challenge}</p></section>
    <section className="mb-9"><h3 className="mb-5 text-2xl font-semibold">Как построена коммуникация</h3>
      <div className={`marketing-decisions grid gap-4 ${id === "email-marketing-kts" ? "sm:grid-cols-2" : ""}`}>
        {story.decisions.map((decision,i) => <div key={decision.title} className="rounded-2xl border border-border bg-background/40 p-5"><p className="case-eyebrow mb-3" aria-hidden="true">{String(i+1).padStart(2,"0")}</p><h4 className="mb-2 text-lg font-semibold">{decision.title}</h4><p className="leading-[1.85] text-muted-foreground">{decision.text}</p></div>)}
      </div>
    </section>
    <section className="mb-12 border-l-2 border-violet-300 pl-5"><h3 className="mb-3 text-xl font-semibold">Результат работы</h3><p className="leading-[1.85] text-muted-foreground">{story.proof}</p></section>
    <section aria-label="Оригинальный материал" className="border-t border-border pt-8">
      <p className="case-eyebrow mb-3">Материал целиком</p><h3 className="mb-7 text-2xl font-semibold">{story.originalLabel}</h3>
      <div className="case-original prose prose-slate max-w-none min-w-0 break-words prose-p:leading-[1.9] prose-li:leading-[1.8] prose-headings:tracking-tight prose-img:rounded-2xl prose-a:underline"><CaseMarkdown content={content} /></div>
    </section>
  </div>;
}
