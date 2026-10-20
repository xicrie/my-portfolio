import { engineeringCases } from "@/data/engineeringCases";
import { russianTypography } from "@/lib/editorialTypography";
import CaseMarkdown from "./CaseMarkdown";

export default function AIEngineeringCase({ id, content }: { id: string; content: string }) {
  const project = engineeringCases[id];
  const sections = content.split(/^## /m).filter(Boolean).map(part => {
    const [title, ...body] = part.split("\n");
    return { title: title.trim(), body: body.join("\n").trim() };
  });
  const technical = sections.find(s => s.title === "Технические детали");
  const prose = "case-story-prose prose prose-slate max-w-none min-w-0 break-words prose-headings:text-foreground prose-p:leading-[1.8] prose-li:leading-relaxed prose-a:text-amber-800 prose-a:underline prose-strong:text-foreground prose-code:break-words prose-code:text-foreground prose-pre:p-0";
  return <div className="min-w-0 text-foreground" data-story-variant={project.variant}>
    {sections.filter(s => s !== technical).map((section,i) => <section key={section.title} data-story-section={i} aria-labelledby={`${id}-section-${i}`} className="case-story-section mb-8">
      <h3 id={`${id}-section-${i}`} className="mb-3 text-2xl font-semibold leading-snug tracking-tight">{russianTypography(section.title)}</h3>
      <div className={`${prose}${i === 0 ? " case-lead" : ""}`}><CaseMarkdown content={section.body} /></div>
    </section>)}
    <details className="case-technical rounded-2xl border border-border bg-background/50 p-5 sm:p-6">
      <summary className="cursor-pointer text-lg font-semibold marker:text-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700">Технические детали</summary>
      <section aria-label="Технологии" className="mb-4 mt-5 leading-relaxed text-muted-foreground">
        <p><strong>Инструменты: </strong>{project.stack.join(", ")}.</p>
      </section>
      {technical && <div className={prose}><CaseMarkdown content={technical.body} technical /></div>}
    </details>
  </div>;
}
