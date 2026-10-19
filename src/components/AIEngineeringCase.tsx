import { useRef } from "react";
import { engineeringCases } from "@/data/engineeringCases";
import CaseMarkdown from "./CaseMarkdown";

const technicalSections = new Set(["Инженерный разбор", "Данные и контракты", "Все 35 узлов"]);

export default function AIEngineeringCase({ id, content }: { id: string; content: string }) {
  const root = useRef<HTMLDivElement>(null);
  const project = engineeringCases[id];
  const sections = content.split(/^## /m).filter(Boolean).map((part) => {
    const [title, ...body] = part.split("\n");
    return { title: title.trim(), body: body.join("\n").trim() };
  });
  const goTo = (index: number) => {
    const section = root.current?.querySelector<HTMLElement>(`[data-story-section="${index}"]`);
    const details = section?.querySelector("details");
    if (details) details.open = true;
    section?.scrollIntoView({ behavior: "auto", block: "start" });
    section?.focus({ preventScroll: true });
  };

  return (
    <div ref={root} className="min-w-0 text-foreground">
      <div className="rounded-[28px] border border-primary/25 bg-background p-5 sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-800">Обзор за 30 секунд</p>
        <p className="mt-3 text-base leading-relaxed sm:text-lg">{project.purpose}</p>
        <dl className="mt-5 grid gap-4 text-sm leading-relaxed sm:grid-cols-2">
          <div><dt className="font-semibold">Моя роль</dt><dd className="mt-1 text-muted-foreground">{project.role}</dd></div>
          <div><dt className="font-semibold">Текущий статус</dt><dd className="mt-1 text-muted-foreground">{project.status}</dd></div>
        </dl>
        <ul aria-label={project.stackLabel ?? "Подтверждённый стек"} className="mt-5 flex flex-wrap gap-2">
          {project.stack.map((technology) => <li key={technology} className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium">{technology}</li>)}
        </ul>
      </div>

      <nav aria-label="Содержание AI-кейса" className="my-8 border-y border-border py-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Внутри кейса</p>
        <div className="flex flex-wrap gap-2">
          {sections.map((section, i) => <button key={section.title} type="button" onClick={() => goTo(i)} className="rounded-full border border-border bg-white px-3 py-2 text-sm transition hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700">{section.title}</button>)}
        </div>
      </nav>

      {sections.map((section, i) => {
        const headingId = `${id}-section-${i}`;
        const body = <div className="prose prose-slate max-w-none min-w-0 break-words prose-headings:text-foreground prose-p:leading-[1.85] prose-li:leading-relaxed prose-a:text-amber-800 prose-a:underline prose-strong:text-foreground prose-code:break-words prose-code:text-foreground prose-pre:p-0"><CaseMarkdown content={section.body} technical /></div>;
        return (
          <section key={section.title} data-story-section={i} aria-labelledby={headingId} tabIndex={-1} className="mb-10 scroll-mt-20 outline-none focus-visible:rounded-xl focus-visible:ring-2 focus-visible:ring-amber-700">
            {technicalSections.has(section.title) ? (
              <details className="group rounded-2xl border border-border bg-background/60 p-5 sm:p-6">
                <summary id={headingId} className="cursor-pointer text-xl font-semibold leading-snug marker:text-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700">{section.title}<span className="mt-1 block pl-4 text-sm font-normal text-muted-foreground">Реализация и проверенные решения</span></summary>
                <div className="mt-6">{body}</div>
              </details>
            ) : (
              <>
                <h3 id={headingId} className="mb-5 text-2xl font-semibold leading-snug tracking-tight">{section.title}</h3>
                {section.title === "Как работает система" && project.flow && (
                  <ol aria-label="Последовательность работы системы" className="mb-6 space-y-3">
                    {project.flow.map((step, n) => <li key={step.title} className="relative rounded-2xl border border-border bg-white p-4 pl-14 sm:p-5 sm:pl-16"><span aria-hidden="true" className="absolute left-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold sm:top-5">{String(n + 1).padStart(2, "0")}</span><h4 className="font-semibold leading-snug">{step.title}</h4><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.detail}</p>{step.branch && <p className="mt-3 border-l-2 border-primary pl-3 text-sm leading-relaxed">{step.branch}</p>}</li>)}
                  </ol>
                )}
                {body}
              </>
            )}
          </section>
        );
      })}
      <p className="border-t border-border pt-5 text-sm leading-relaxed text-muted-foreground">{project.evidence}</p>
    </div>
  );
}
