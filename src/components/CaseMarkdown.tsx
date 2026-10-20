import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link } from "react-router-dom";
import { editorialTypography } from "@/lib/editorialTypography";

function Artifact({ href, children }: { href: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    setError(false);
    fetch(href, { signal: controller.signal }).then(response => {
      if (!response.ok) throw new Error("HTTP error");
      return response.json();
    }).then(value => setContent(JSON.stringify(value, null, 2))).catch(e => {
      if (e.name !== "AbortError") setError(true);
    });
    return () => controller.abort();
  }, [href, open]);
  return <span className="artifact-preview my-3 block">
    <button type="button" data-artifact={href} aria-expanded={open} onClick={() => setOpen(!open)} className="rounded-xl border border-current/25 bg-white px-3 py-2 text-left text-sm font-medium underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-700">{children} <span className="text-xs">· {open ? "свернуть JSON" : "посмотреть JSON здесь"}</span></button>
    {open && <span className="mt-3 block rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900">
      {error ? <span role="alert">Не удалось загрузить JSON. Закройте и повторите попытку.</span> : content === null ? <span role="status">Загрузка JSON…</span> : <span role="group" aria-label="Технический JSON" tabIndex={0} className="block max-h-80 overflow-auto whitespace-pre font-mono text-xs">{content}</span>}
      <a href={href} download className="mt-3 block text-sm underline">Скачать .json</a>
    </span>}
  </span>;
}

function CaseImage({ src, alt }: { src?: string; alt?: string }) {
  const [expanded, setExpanded] = useState(false);
  return <span className="my-6 block">
    <button type="button" onClick={() => setExpanded(!expanded)} aria-expanded={expanded} className="block w-full rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-700">
      <img src={src} alt={alt} loading="lazy" decoding="async" className="!m-0 h-auto w-full rounded-2xl border border-slate-200 !shadow-none" />
      <span className="mt-2 block text-sm underline">{expanded ? "Свернуть увеличенную схему" : "Увеличить схему в кейсе"}</span>
    </button>
    {expanded && <span role="group" aria-label="Увеличенная схема" tabIndex={0} className="mt-3 block max-h-[65vh] overflow-auto rounded-xl border border-slate-200 bg-white"><img src={src} alt={alt} className="!m-0 h-auto min-w-[56rem] !max-w-none !shadow-none" /></span>}
    <span className="mt-2 block text-xs leading-relaxed text-slate-500">{alt}</span>
  </span>;
}

export default function CaseMarkdown({ content, technical = false }: { content: string; technical?: boolean }) {
  return <ReactMarkdown remarkPlugins={[remarkGfm, editorialTypography]} components={{
    a: ({ href = "", children }) => {
      if (href.startsWith("/projects/") && href.endsWith(".json")) return <Artifact href={href}>{children}</Artifact>;
      if (/^https?:\/\//.test(href)) return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
      if (href.startsWith("?")) return <Link to={href}>{children}</Link>;
      return <a href={href}>{children}</a>;
    },
    table: ({ children }) => <div className="my-5 max-w-full overflow-x-auto rounded-xl border border-slate-200" tabIndex={0} role="group" aria-label="Таблица данных"><table className="!my-0 min-w-[32rem] text-sm [&_td]:p-3 [&_th]:p-3">{children}</table></div>,
    ...(technical ? {
      pre: ({ children }: { children?: React.ReactNode }) => <pre tabIndex={0} aria-label="Пример данных или псевдокод" className="!my-5 max-w-full overflow-x-auto rounded-2xl border border-border !bg-background !p-5 text-sm !text-foreground">{children}</pre>,
    } : {}),
    img: ({ src, alt }) => <CaseImage src={src} alt={alt} />,
  }}>{content}</ReactMarkdown>;
}
