import { useRef } from "react";
import { engineeringCases } from "@/data/engineeringCases";
import CaseMarkdown from "./CaseMarkdown";

export default function AIEngineeringCase({ id, content }: { id: string; content: string }) {
  const root = useRef<HTMLDivElement>(null);
  const project = engineeringCases[id];
  const sections = content.split(/^## /m).filter(Boolean).map(part => {
    const [title, ...body] = part.split("\n");
    return { title: title.trim(), body: body.join("\n").trim() };
  });
  const technical = sections.find(s => s.title === "Технические детали");
  const story = sections.filter(s => s !== technical);
  const goTo = (index: number) => {
    const section = root.current?.querySelector<HTMLElement>(`[data-story-section="${index}"]`);
    section?.scrollIntoView({ behavior: "auto", block: "start" });
    section?.focus({ preventScroll: true });
  };
  const prose = "case-story-prose prose prose-slate max-w-none min-w-0 break-words prose-headings:text-foreground prose-p:leading-[1.85] prose-li:leading-relaxed prose-a:text-amber-800 prose-a:underline prose-strong:text-foreground prose-code:break-words prose-code:text-foreground prose-pre:p-0";
  return <div ref={root} className="min-w-0 text-foreground" data-story-variant={project.variant}>
    <p className="case-lead text-xl leading-relaxed sm:text-2xl">{project.purpose}</p>
    <dl aria-label="О проекте" className="case-facts my-7 grid gap-5 border-y border-border py-6 sm:grid-cols-3">
      <div><dt className="case-eyebrow">Что создано</dt><dd className="mt-2 text-sm leading-relaxed">{project.built}</dd></div>
      <div><dt className="case-eyebrow">Моя роль</dt><dd className="mt-2 text-sm leading-relaxed">{project.role}</dd></div>
      <div><dt className="case-eyebrow">Сейчас</dt><dd className="mt-2 text-sm leading-relaxed">{project.result}</dd></div>
    </dl>
    {technical && <nav aria-label="Содержание AI-кейса" className="mb-10 flex flex-wrap gap-x-5 gap-y-2">
      {story.map((section,i) => ["Задача", "Мой вклад", "Сценарий", "Результат"].includes(section.title) && <button key={section.title} type="button" onClick={() => goTo(i)} className="case-story-anchor py-2 text-sm underline decoration-current/25 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700">{section.title}</button>)}
    </nav>}
    {story.map((section,i) => <section key={section.title} data-story-section={i} aria-labelledby={`${id}-section-${i}`} tabIndex={-1} className="case-story-section mb-10 scroll-mt-6 outline-none focus-visible:rounded-xl focus-visible:ring-2 focus-visible:ring-amber-700">
      <h3 id={`${id}-section-${i}`} className="mb-4 text-2xl font-semibold leading-snug tracking-tight">{section.title}</h3>
      <div className={prose}><CaseMarkdown content={section.body} /></div>
      {(section.title === "Сценарий" || !technical && section === story[0]) && <figure className="case-scenario my-7">
        <ol aria-label="Сценарий пользователя" className="case-scenario-steps grid gap-3 sm:grid-cols-3">
          {project.flow.map((step,n) => <li key={step.title} className="case-scenario-step relative rounded-2xl border border-border bg-background/60 p-5">
            <span aria-hidden="true" className="case-step-number mb-4 block text-sm font-semibold">{String(n+1).padStart(2,"0")}</span>
            <h4 className="font-semibold leading-snug">{step.title}</h4><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.detail}</p>
          </li>)}
        </ol><figcaption className="mt-3 text-xs leading-relaxed text-muted-foreground">{project.flowCaption}</figcaption>
      </figure>}
    </section>)}
    <details className="case-technical rounded-2xl border border-border bg-background/50 p-5 sm:p-6">
      <summary className="cursor-pointer text-lg font-semibold marker:text-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700">{technical ? "Технические детали и материалы" : "Материалы и технологии"}<span className="mt-1 block text-sm font-normal leading-relaxed text-muted-foreground">{technical ? "Архитектура, границы проверки и дополнительные данные" : "Что известно о реализации и что ещё нужно уточнить"}</span></summary>
      <section aria-label="Технологии" className="mb-7 mt-6">
        <h3 className="mb-3 text-xl font-semibold">Технологии</h3>
        <ul className="flex flex-wrap gap-2">{project.stack.map(technology => <li key={technology} className="rounded-full border border-border bg-white px-3 py-1.5 text-xs">{technology}</li>)}</ul>
        {project.stackNote && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{project.stackNote}</p>}
      </section>
      {technical ? <div className={prose}><CaseMarkdown content={technical.body} technical /></div> : <p className="text-sm leading-relaxed text-muted-foreground">Описание основано на материалах автора. Список недостающих файлов указан в разделе «Следующий материал»; технические возможности не перенесены из других версий ботов.</p>}
    </details>
  </div>;
}
