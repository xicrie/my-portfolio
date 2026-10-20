import { engineeringCases } from "@/data/engineeringCases";
import CaseMarkdown from "./CaseMarkdown";

function InboxExample() {
  return <figure className="inbox-example my-6" aria-label="Пример разбора сообщения">
    <figcaption className="mb-4 text-base font-medium">Придуманный пример, не переписка с работающим ботом</figcaption>
    <blockquote className="inbox-input rounded-2xl border border-border bg-background px-5 py-5 leading-relaxed">
      Написать Дане о презентации. Кажется, короткий гид поможет новым клиентам быстрее разобраться в продукте.
    </blockquote>
    <div className="inbox-output mt-5 space-y-4 border-l-2 border-primary pl-5">
      <p><strong>Задача: </strong>Написать Дане о презентации.</p>
      <p><strong>Гипотеза: </strong>Короткий гид может помочь новым клиентам быстрее разобраться в продукте.</p>
    </div>
  </figure>;
}

export default function AIEngineeringCase({ id, content }: { id: string; content: string }) {
  const project = engineeringCases[id];
  const sections = content.split(/^## /m).filter(Boolean).map(part => {
    const [title, ...body] = part.split("\n");
    return { title: title.trim(), body: body.join("\n").trim() };
  });
  const technical = sections.find(s => s.title === "Техническая реализация");
  const prose = "case-story-prose prose prose-slate max-w-none min-w-0 break-words prose-headings:text-foreground prose-p:leading-[1.8] prose-li:leading-relaxed prose-a:text-amber-800 prose-a:underline prose-strong:text-foreground prose-code:break-words prose-code:text-foreground prose-pre:p-0";
  return <div className="min-w-0 text-foreground" data-story-variant={project.variant}>
    <p className="case-lead mb-8 text-xl leading-relaxed sm:text-2xl">{project.purpose}</p>
    {sections.filter(s => s !== technical).map((section,i) => <section key={section.title} data-story-section={i} aria-labelledby={`${id}-section-${i}`} className="case-story-section mb-8">
      <h3 id={`${id}-section-${i}`} className="mb-3 text-2xl font-semibold leading-snug tracking-tight">{section.title}</h3>
      <div className={prose}><CaseMarkdown content={section.body} /></div>
      {section.title === "Как это работает" && id === "personal-assistant" && <InboxExample />}
    </section>)}
    <details className="case-technical rounded-2xl border border-border bg-background/50 p-5 sm:p-6">
      <summary className="cursor-pointer text-lg font-semibold marker:text-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700">Техническая реализация</summary>
      <section aria-label="Технологии" className="mb-4 mt-5 leading-relaxed text-muted-foreground">
        <p><strong>Инструменты: </strong>{project.stack.join(", ")}.</p>
      </section>
      {technical && <div className={prose}><CaseMarkdown content={technical.body} technical /></div>}
    </details>
  </div>;
}
