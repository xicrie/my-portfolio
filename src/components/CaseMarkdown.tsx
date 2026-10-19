import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function CaseMarkdown({ content, technical = false }: { content: string; technical?: boolean }) {
  return <ReactMarkdown remarkPlugins={[remarkGfm]} components={technical ? {
    table: ({ children }) => <div className="my-5 max-w-full overflow-x-auto rounded-xl border border-border" tabIndex={0} role="group" aria-label="Таблица технических данных"><table className="!my-0 min-w-[32rem] text-sm [&_td]:p-3 [&_th]:p-3">{children}</table></div>,
    pre: ({ children }) => <pre tabIndex={0} aria-label="Пример данных или псевдокод" className="!my-5 max-w-full overflow-x-auto rounded-2xl border border-border !bg-background !p-5 text-sm !text-foreground">{children}</pre>,
    img: ({ src, alt }) => <span className="my-6 block"><a href={src} target="_blank" rel="noopener noreferrer" className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"><img src={src} alt={alt} loading="lazy" className="!m-0 h-auto w-full rounded-2xl border border-border !shadow-none" /></a><span className="mt-2 block text-xs leading-relaxed text-muted-foreground">{alt} · Нажмите на схему, чтобы открыть её отдельно.</span></span>,
  } : undefined}>{content}</ReactMarkdown>;
}
