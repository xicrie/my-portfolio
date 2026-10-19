import { useRef } from "react";
import { engineeringCases } from "@/data/engineeringCases";
import CaseMarkdown from "./CaseMarkdown";

function InboxExample() {
  return <figure className="inbox-example my-8" aria-label="Пример разбора сообщения">
    <figcaption className="mb-4 text-base font-medium">Придуманный пример, не переписка с работающим ботом</figcaption>
    <blockquote className="inbox-input rounded-2xl border border-border bg-background px-5 py-6 leading-relaxed">
      Написать Дане о презентации. Кажется, короткий гид поможет новым клиентам быстрее разобраться в продукте.
    </blockquote>
    <p className="my-5 text-base font-medium" aria-hidden="true">Одно сообщение превращается в две записи ↓</p>
    <div className="inbox-output space-y-5 border-l-2 border-primary pl-5">
      <div><h4 className="mb-2 text-lg font-semibold">Задача</h4><p>Написать Дане о презентации.</p></div>
      <div><h4 className="mb-2 text-lg font-semibold">Гипотеза</h4><p>Короткий гид может помочь новым клиентам быстрее разобраться в продукте.</p></div>
    </div>
  </figure>;
}

export default function AIEngineeringCase({ id, content }: { id: string; content: string }) {
  const root = useRef<HTMLDivElement>(null);
  const project = engineeringCases[id];
  const sections = content.split(/^## /m).filter(Boolean).map(part => {
    const [title, ...body] = part.split("\n");
    return { title: title.trim(), body: body.join("\n").trim() };
  });
  const technical = sections.find(s => s.title === "Техническая реализация");
  const story = sections.filter(s => s !== technical);
  const goTo = (index: number) => {
    const section = root.current?.querySelector<HTMLElement>(`[data-story-section="${index}"]`);
    section?.scrollIntoView({ behavior: "auto", block: "start" });
    section?.focus({ preventScroll: true });
  };
  const prose = "case-story-prose prose prose-slate max-w-none min-w-0 break-words prose-headings:text-foreground prose-p:leading-[1.85] prose-li:leading-relaxed prose-a:text-amber-800 prose-a:underline prose-strong:text-foreground prose-code:break-words prose-code:text-foreground prose-pre:p-0";
  return <div ref={root} className="min-w-0 text-foreground" data-story-variant={project.variant}>
    <p className="case-lead mb-7 text-xl leading-relaxed sm:text-2xl">{project.purpose}</p>
    <nav aria-label="Содержание кейса" className="mb-9 flex flex-wrap gap-x-5 gap-y-2 border-b border-border pb-5">
      {story.map((section,i) => ["О продукте", "Как это работает", "Моя роль и решения", "Результат"].includes(section.title) && <button key={section.title} type="button" onClick={() => goTo(i)} className="case-story-anchor py-2 text-base underline decoration-current/25 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700">{section.title === "Моя роль и решения" ? "Моя роль" : section.title}</button>)}
    </nav>
    {story.map((section,i) => <section key={section.title} data-story-section={i} aria-labelledby={`${id}-section-${i}`} tabIndex={-1} className="case-story-section mb-10 scroll-mt-6 outline-none focus-visible:rounded-xl focus-visible:ring-2 focus-visible:ring-amber-700">
      <h3 id={`${id}-section-${i}`} className="mb-4 text-2xl font-semibold leading-snug tracking-tight">{section.title}</h3>
      <div className={prose}><CaseMarkdown content={section.body} /></div>
      {section.title === "Как это работает" && (id === "personal-assistant" ? <InboxExample /> : <figure className="case-scenario my-8">
        <ol aria-label="Сценарий пользователя" className="case-scenario-steps">
          {project.flow.map((step,n) => <li key={step.title} className="case-scenario-step">
            <span aria-hidden="true" className="case-step-number">{String(n+1).padStart(2,"0")}</span>
            <div><h4 className="mb-2 text-lg font-semibold leading-snug">{step.title}</h4><p className="leading-relaxed text-muted-foreground">{step.detail}</p></div>
          </li>)}
        </ol><figcaption className="mt-4 leading-relaxed text-muted-foreground">{project.flowCaption}</figcaption>
      </figure>)}
    </section>)}
    <details className="case-technical rounded-2xl border border-border bg-background/50 p-5 sm:p-6">
      <summary className="cursor-pointer text-lg font-semibold marker:text-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700">Техническая реализация<span className="mt-2 block font-normal leading-relaxed text-muted-foreground">Технологии, важные решения и готовность проекта</span></summary>
      <section aria-label="Технологии" className="mb-7 mt-6">
        <h3 className="mb-3 text-xl font-semibold">Технологии</h3>
        <ul className="flex flex-wrap gap-2">{project.stack.map(technology => <li key={technology} className="rounded-full border border-border bg-white px-3 py-2">{technology}</li>)}</ul>
      </section>
      {technical && <div className={prose}><CaseMarkdown content={technical.body} technical /></div>}
    </details>
  </div>;
}
