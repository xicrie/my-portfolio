import { X } from "lucide-react";
import { cases, type PortfolioCase } from "@/data/cases";
import AIEngineeringCase from "./AIEngineeringCase";
import MarketingCase from "./MarketingCase";
import "./cases.css";

export default function CaseDocument({ item, content }: { item: PortfolioCase; content: string }) {
  const ordered=[...cases.filter(c=>c.category==='ai'),...cases.filter(c=>c.category==='marketing')];
  const next=ordered[(ordered.findIndex(c=>c.id===item.id)+1)%ordered.length];
  return <div className="px-0 pb-10">
    <header className="mx-auto flex max-w-[1000px] items-center justify-between px-5 pt-5 text-base"><a href="/" className="font-semibold">Алёна Степанова</a><a href={`/?direction=${item.category}#cases`} className="underline underline-offset-4">Все работы</a></header>
    <main className="case-document case-reader" data-direction={item.category}>
      <div className="relative">
        <figure className="case-reader-cover relative w-full overflow-hidden">
          <picture className="absolute inset-0 block h-full w-full"><source media="(max-width:639px)" srcSet={item.caseHeroMobile}/><img src={item.caseHero} width={1440} height={480} alt="" className="h-full w-full object-cover" /></picture>
          <div className="case-hero-copy hidden h-full max-w-[48%] flex-col justify-center px-10 py-8 sm:flex"><p className="text-2xl font-semibold leading-tight">{item.heroLine}</p></div>
        </figure>
        <a href={`/?direction=${item.category}#cases`} className="case-close absolute right-3 top-3 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white/80 text-slate-800 shadow-md backdrop-blur-xl" aria-label="Закрыть кейс и перейти к списку"><X className="h-5 w-5"/></a>
      </div>
      <div className="case-document-main"><h1 className="type-case-title mb-6">{item.title}</h1>
        <h2 className="sr-only">Описание проекта и&nbsp;мой вклад</h2>
        {item.category==='ai'?<AIEngineeringCase id={item.id} content={content}/>:<MarketingCase id={item.id} content={content}/>}
        {item.category==='marketing'&&item.link&&<p className="mt-8"><a href={item.link} target="_blank" rel="noopener noreferrer" className="text-base underline">Читать статью на&nbsp;сайте</a></p>}
        <footer className="mt-10 flex flex-wrap justify-between gap-5 border-t border-border pt-6 text-base"><a href={`/?direction=${item.category}#cases`}>Все работы</a><a href={`/cases/${next.id}/`} className="underline underline-offset-4">Следующий кейс: {next.title}</a></footer>
      </div>
    </main>
  </div>;
}
