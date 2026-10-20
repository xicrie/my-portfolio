import { marketingStories } from "@/data/marketingStories";
import EmailCase from "./EmailCase";
import CaseMarkdown from "./CaseMarkdown";
export default function MarketingCase({ id, content }: { id: string; content: string }) {
  if(id === "email-marketing-kts") return <EmailCase content={content} />;
  const story = marketingStories[id];
  return <div className="marketing-story" data-marketing-story={id}>
    <p className="case-lead text-xl leading-relaxed sm:text-2xl">{story.lead}</p>
    <div className="case-context my-7 space-y-4 border-y border-border py-6">
      <p><strong>Для&nbsp;кого: </strong>{story.audience}</p>
      <p><strong>Моя роль: </strong>{story.role}</p>
    </div>
    <section className="mb-9"><h3 className="mb-4 text-2xl font-semibold">Задача материала</h3><p className="leading-[1.85] text-muted-foreground">{story.challenge}</p></section>
    <section className="mb-9"><h3 className="mb-5 text-2xl font-semibold">Как&nbsp;построена коммуникация</h3>
      <div className="marketing-decisions space-y-5">
        {story.decisions.map((decision) => <div key={decision.title} className="border-l-2 border-violet-200 pl-5"><h4 className="mb-2 text-lg font-semibold">{decision.title}</h4><p className="leading-[1.85] text-muted-foreground">{decision.text}</p></div>)}
      </div>
    </section>
    <section className="mb-12 border-l-2 border-violet-300 pl-5"><h3 className="mb-3 text-2xl font-semibold">Результаты работы</h3><p className="leading-[1.85] text-muted-foreground">{story.proof}</p></section>
    <details className="case-source rounded-2xl border border-border bg-background/40 p-5 sm:p-6">
      <summary className="cursor-pointer text-lg font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-700">{story.originalLabel}</summary>
      <section aria-label="Оригинальный материал" className="pt-6">
        <div className="case-original prose prose-slate max-w-none min-w-0 break-words prose-p:leading-[1.9] prose-li:leading-[1.8] prose-headings:tracking-tight prose-img:rounded-2xl prose-a:underline"><CaseMarkdown content={content.replace(/^\*\*Агентский кабинет LEGENDA:.*\n?/m, "").replace(/^\*Гиф:.*\n?/gm, "")} /></div>
      </section>
    </details>
  </div>;
}
