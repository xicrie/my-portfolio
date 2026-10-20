import { russianTypography } from "@/lib/editorialTypography";
import CaseMarkdown from "./CaseMarkdown";
export default function EmailCase({ content }: { content: string }) {
  const examples=content.split(/^## Пример /m).slice(1);
  return <div className="marketing-story">
    <p className="case-lead type-body mb-7">Два письма для&nbsp;тёплой B2B-аудитории KTS. Задача: дать полезный повод вернуться к&nbsp;разговору о&nbsp;цифровизации.</p>
    <section className="mb-7"><h3 className="mb-3 text-2xl font-semibold">Мой подход</h3><p className="type-body text-muted-foreground">Я подготовила тексты и&nbsp;логику коммуникации. Первое письмо помогает выбрать приоритет автоматизации, второе отвечает на&nbsp;опасение долгого внедрения. В&nbsp;обоих случаях следующий шаг предлагается через&nbsp;полезный материал и&nbsp;примеры компании.</p></section>
    <p className="mb-5 text-base text-muted-foreground">Цифры внутри писем относятся к&nbsp;описанным проектам KTS.</p>
    <div className="space-y-4" aria-label="Примеры писем">
      {examples.map((example,index)=>{const [title,...body]=example.split('\n');return <details key={title} {...{name:'kts-emails'}} open={index===0} className="rounded-2xl border border-violet-200 bg-white/70 p-5 sm:p-6">
        <summary className="cursor-pointer text-lg font-semibold">{index===0?russianTypography('Письмо 1. С чего начать автоматизацию'):russianTypography('Письмо 2. Как избежать долгого внедрения')}</summary>
        <section aria-label={`Письмо ${index+1}`} className="case-original prose prose-slate mt-6 max-w-none break-words"><h4 className="mb-5 text-xl font-semibold">{russianTypography(title.replace(/^\d+\.\s*/,''))}</h4><CaseMarkdown content={body.join('\n').replace(/\n---\s*$/,'')} /></section>
      </details>})}
    </div>
  </div>;
}
