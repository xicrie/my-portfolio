"use client";

import { lazy, Suspense, useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SectionHeading from "./SectionHeading";
import { ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cases, materialTypes, type MaterialType, type PortfolioCase } from "@/data/cases";
import { cn } from "@/lib/utils";
import "./cases.css";
import { normalizeCaseSearch } from "@/data/caseNavigation";

const caseCountRule = new Intl.PluralRules("ru");
const CaseContent = lazy(() => import("./CaseContent"));

const directions = [
  { value: "ai", label: "AI / Automation" },
  { value: "marketing", label: "Marketing / CRM" },
] as const;

const CasesSection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const active = cases.find((item) => item.id === params.get("case")) ?? null;
  const normalized = normalizeCaseSearch(location.search);
  const normalizedParams = new URLSearchParams(normalized);
  const direction = normalizedParams.get("direction") === "marketing" ? "marketing" : "ai";
  const filterType = normalizedParams.get("type") as MaterialType | null;
  useEffect(() => {
    if (normalized !== location.search.replace(/^\?/, "")) {
      navigate({ search: normalized, hash: location.hash }, { replace: true, state: location.state });
    }
  }, [normalized, location.search, location.hash, location.state, navigate]);
  const caseTriggerRef = useRef<HTMLElement | null>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const listScrollRef = useRef<number | null>(null);
  const wasOpen = useRef(false);
  const lastCaseId = useRef<string>();

  useEffect(() => {
    if (active) {
      lastCaseId.current = active.id;
      if (!wasOpen.current) {
        const listTop = document.getElementById("portfolio")?.getBoundingClientRect().top;
        listScrollRef.current = location.state?.listScrollY ?? (listTop === undefined ? window.scrollY : window.scrollY + listTop);
        caseTriggerRef.current ??= document.querySelector<HTMLButtonElement>(`[data-case-trigger="${active.id}"]`);
      }
      wasOpen.current = true;
    } else if (wasOpen.current) {
      wasOpen.current = false;
      const top = listScrollRef.current;
      const frame = requestAnimationFrame(() => window.scrollTo({ top: top ?? 0, behavior: "instant" }));
      return () => cancelAnimationFrame(frame);
    }
  }, [active, location.state]);

  const directionCases = useMemo(() => cases.filter(c => c.category === direction), [direction]);
  const availableTypes = useMemo(() => Object.keys(materialTypes).filter(type => directionCases.some(c => c.materialType === type)) as MaterialType[], [directionCases]);
  const filteredCases = filterType ? directionCases.filter(c => c.materialType === filterType) : directionCases;
  const selectDirection = (value: typeof directions[number]["value"]) => {
    const params = new URLSearchParams(location.search);
    params.delete("case"); params.delete("type"); params.delete("tag");
    params.set("direction", value);
    navigate({ search: params.toString(), hash: "#cases" });
  };
  const applyFilter = (type: MaterialType | null) => {
    const params = new URLSearchParams(location.search);
    params.delete("case"); params.delete("tag");
    if (type) params.set("type", type); else params.delete("type");
    navigate({ search: params.toString(), hash: "#cases" });
  };

  const openCase = (item: PortfolioCase) => {
    const params = new URLSearchParams(location.search);
    params.set("case", item.id);
    listScrollRef.current = window.scrollY;
    navigate({ search: params.toString(), hash: "#cases" }, {
      state: { portfolioCase: true, listScrollY: window.scrollY },
    });
  };

  const closeCase = () => {
    if (location.state?.portfolioCase) navigate(-1);
    else {
      const params = new URLSearchParams(location.search);
      params.delete("case");
      navigate({ search: params.toString(), hash: "#cases" }, { replace: true });
    }
  };

  return (
    <section className="portfolio-cases relative py-24 md:py-32" id="portfolio" data-direction={direction}>
      <div className="container relative z-10 mx-auto max-w-[1280px] px-6">
        <div className="mb-14">
          <SectionHeading
            title="Кейсы"
            subtitle="Прикладные AI-проекты на базе опыта в B2B-маркетинге и CRM. В каждом кейсе — задача, решение, мой вклад и доступные материалы."
          />
        </div>

        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Направление</p>
        <div className="mb-6 flex flex-wrap items-center gap-2.5" role="group" aria-label="Направление проектов">
          {directions.map((item) => (
            <button
              key={item.value}
              type="button"
              aria-pressed={direction === item.value}
              data-direction={item.value}
              onClick={() => selectDirection(item.value)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2",
                direction === item.value
                  ? "border-amber-300/70 bg-[linear-gradient(180deg,rgba(255,224,138,0.96),rgba(255,202,74,0.9))] text-slate-900 shadow-[0_14px_28px_rgba(251,191,36,0.18)]"
                  : "border-white/80 bg-white/72 text-slate-500 shadow-[0_8px_20px_rgba(15,23,42,0.04)] hover:border-slate-200 hover:bg-white hover:text-slate-700"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Тип материала</p>
        <div ref={filtersRef} className="mb-10 flex flex-wrap items-center gap-2" role="group" aria-label="Тип материала">
          <button type="button" onClick={() => applyFilter(null)} aria-pressed={!filterType} className="case-type-filter rounded-full border px-4 py-2.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-700">Все типы</button>
          {availableTypes.map(type => <button key={type} type="button" onClick={() => applyFilter(type)} aria-pressed={filterType === type} className="case-type-filter rounded-full border px-4 py-2.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-700">{materialTypes[type].label}</button>)}
        </div>
        <p className="mb-5 text-sm text-muted-foreground" role="status">{filteredCases.length} {(direction === "ai" ? { one: "проект", few: "проекта", many: "проектов", other: "проекта" } : { one: "материал", few: "материала", many: "материалов", other: "материала" })[caseCountRule.select(filteredCases.length) as "one" | "few" | "many" | "other"]}</p>

        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {filteredCases.map((c) => {

            return (
              <article
                key={c.id}
                onClick={(event) => {
                  caseTriggerRef.current = event.currentTarget.querySelector("[data-case-trigger]");
                  openCase(c);
                }}
                data-direction={c.category}
                className="group relative flex cursor-pointer flex-col overflow-hidden rounded-[30px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(255,255,255,0.72))] p-3 shadow-[0_18px_42px_rgba(15,23,42,0.07)] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_70px_rgba(15,23,42,0.14)]"
              >
                <div className="case-hover pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <div className="absolute inset-[1px] rounded-[29px] bg-[linear-gradient(180deg,rgba(255,230,160,0.15),rgba(255,255,255,0.03))]" />
                  <div className="absolute inset-[1px] rounded-[29px] shadow-[inset_0_0_60px_rgba(255,221,120,0.12)]" />
                </div>

                <div className="relative aspect-[16/10] overflow-hidden rounded-[22px] bg-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
                  <img
                    src={c.image}
                    alt={c.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.045]"
                  />
                  {c.category === "marketing" && <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,18,28,0.02),rgba(12,18,28,0.12))]" />}
                </div>

                <div className="relative flex flex-1 flex-col px-4 pb-5 pt-6">
                  <span className="case-type-label mb-4 w-fit rounded-full border px-3 py-1.5 text-xs font-medium">{materialTypes[c.materialType].singular}</span>

                  {c.category === "marketing" && <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-amber-500">{c.company}</div>}

                  <h3 className="mb-3 text-[1.85rem] font-semibold leading-[1.08] tracking-tight text-slate-900 transition-colors group-hover:text-amber-700">
                    {c.title}
                  </h3>

                  {c.description && (
                    <p className="mb-6 line-clamp-3 text-pretty text-[0.98rem] leading-relaxed text-slate-600">
                      {c.description}
                    </p>
                  )}

                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100/90 pt-5">
                    <Button
                      type="button"
                      variant="ghost"
                      data-case-trigger={c.id}
                      aria-label={`Прочитать кейс: ${c.title}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        caseTriggerRef.current = e.currentTarget;
                        openCase(c);
                      }}
                      className="h-11 rounded-2xl border border-slate-200 bg-white/74 px-4 text-sm font-medium text-slate-800 shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition outline-none focus-visible:ring-2 focus-visible:ring-amber-400 hover:bg-white hover:text-slate-950"
                    >
                      Прочитать
                    </Button>

                    {c.link && c.category !== "ai" ? (
                      <Button
                        type="button"
                        variant="ghost"
                        asChild
                        className="h-11 rounded-2xl border border-transparent px-4 text-sm font-medium text-slate-500 transition outline-none focus-visible:ring-2 focus-visible:ring-amber-400 hover:bg-slate-100 hover:text-slate-700"
                      >
                        <a
                          href={c.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="flex flex-col text-left leading-tight"><span>{c.linkLabel ?? "Читать на сайте"}</span><span className="mt-1 text-[10px]">новая вкладка</span></span>
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    ) : (
                      <span className="max-w-[9rem] text-right text-xs leading-relaxed text-muted-foreground">{c.category === "ai" ? c.status : ""}</span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <Dialog open={!!active} onOpenChange={(open) => !open && closeCase()}>
        <DialogContent
          data-direction={active?.category}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            const trigger = caseTriggerRef.current;
            if (trigger?.isConnected) trigger.focus();
            else {
              const fallback = document.querySelector<HTMLButtonElement>(`[data-case-trigger="${lastCaseId.current}"]`);
              if (fallback) fallback.focus({ preventScroll: true });
              else filtersRef.current?.querySelector<HTMLButtonElement>('button[aria-pressed="true"]')?.focus({ preventScroll: true });
            }
          }}
          className="case-reader z-[9999] flex max-h-[92vh] w-[min(94vw,72rem)] max-w-5xl flex-col gap-0 overflow-hidden border border-white/50 bg-[rgba(255,255,255,0.98)] p-0 shadow-[0_40px_120px_rgba(0,0,0,0.24)] [&>button:not([data-case-close])]:hidden sm:rounded-[34px]">
          {active && (
            <>
              <div className="flex shrink-0 items-center justify-between border-b border-slate-200/70 bg-white px-4 py-2 sm:px-6" role="group" aria-label="Управление чтением">
                <button type="button" onClick={closeCase} className="case-return rounded-xl px-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-700">← К списку кейсов</button>
              <button
                data-case-close
                type="button"
                onClick={closeCase}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/60 text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-700"
                aria-label="Закрыть"
              >
                <X className="h-5 w-5" />
              </button>
              </div>

              <DialogTitle className="sr-only">{active.title}</DialogTitle>
              <DialogDescription className="sr-only">
                Полный обзор кейса: {active.title}
              </DialogDescription>

              <div className="relative min-h-0 flex-1 overflow-y-auto">
                {/* Обложка теперь часть прокручиваемого контента */}
                <div className="case-reader-cover relative h-[180px] w-full sm:h-[280px] shrink-0 border-b border-slate-200/70">
                  <img
                    src={active.image}
                    alt={active.title}
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="px-6 pb-10 pt-8 sm:px-12 sm:pb-14">
                  <div className="mx-auto max-w-3xl">
                    <span className="case-type-label mb-4 inline-block rounded-full border px-3 py-1.5 text-xs font-medium">{materialTypes[active.materialType].singular}</span>

                    <h2 className={cn("mb-10 text-[2rem] font-semibold leading-[1.05] tracking-tight text-slate-950 sm:text-[2.6rem]", active.category === "ai" && "pr-10 !mb-6")}>
                      {active.title}
                    </h2>

                    <Suspense fallback={<p role="status">Загружаю кейс…</p>}>
                      <CaseContent item={active} />
                    </Suspense>

                    {active.link && active.category !== "ai" && (
                      <div className="mt-12 flex justify-center border-t border-slate-100 pt-10">
                        <Button
                          variant="ghost"
                          size="lg"
                          className="h-12 rounded-2xl border border-slate-200 bg-white px-6 text-base font-medium text-slate-700 transition outline-none focus-visible:ring-2 focus-visible:ring-amber-400 hover:bg-slate-50 hover:text-slate-950"
                          asChild
                        >
                          <a
                            href={active.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="mr-2 h-5 w-5" />
                            {active.linkLabel ?? "Читать на сайте"} · новая вкладка
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default CasesSection;
