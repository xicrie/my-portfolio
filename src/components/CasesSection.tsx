"use client";

import { lazy, Suspense, useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SectionHeading from "./SectionHeading";
import {
  ExternalLink,
  FileText,
  Layers3,
  Mail,
  MonitorSmartphone,
  Package,
  PenSquare,
  Sparkles,
  Tags,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cases, type PortfolioCase } from "@/data/cases";
import { cn } from "@/lib/utils";
import "./cases.css";

const CaseContent = lazy(() => import("./CaseContent"));

const directions = [
  { value: "ai", label: "AI / Automation" },
  { value: "marketing", label: "Marketing / CRM" },
  { value: "all", label: "Все направления" },
] as const;

const notionProseClass =
  "prose prose-slate max-w-none " +
  "prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-slate-950 " +
  "prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-2xl " +
  "prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-xl " +
  "prose-p:text-slate-600 prose-p:leading-[1.9] prose-p:mb-5 " +
  "prose-li:text-slate-600 prose-li:leading-[1.8] " +
  "prose-ul:my-5 prose-ul:space-y-2 " +
  "prose-strong:text-slate-900 prose-strong:font-semibold " +
  "prose-img:rounded-2xl prose-img:shadow-[0_20px_50px_rgba(15,23,42,0.12)] " +
  "prose-a:text-amber-700 prose-a:no-underline hover:prose-a:underline " +
  "prose-blockquote:border-l-amber-400 prose-blockquote:bg-amber-50/60 prose-blockquote:py-3 prose-blockquote:px-5 prose-blockquote:rounded-r-2xl " +
  "prose-code:text-[0.92em] prose-code:text-slate-800 " +
  "prose-pre:rounded-2xl prose-pre:border prose-pre:border-slate-200 prose-pre:bg-slate-950";

const filterPriority = [
  "Примеры текстов",
  "Статьи",
  "Тексты рассылок",
  "Упаковка кейсов",
  "Кейсы",
  "Сайты",
  "Лендинги",
  "Email",
  "AI",
  "IT",
  "PropTech",
];

const cardTagPriority = [
  "Email",
  "Тексты рассылок",
  "Статьи",
  "Упаковка кейсов",
  "Примеры текстов",
  "Кейсы",
  "Сайты",
  "Лендинги",
  "AI",
  "IT",
  "PropTech",
];

const getPriorityIndex = (value: string, order: string[]) => {
  const index = order.findIndex(
    (item) => item.toLowerCase() === value.toLowerCase()
  );
  return index === -1 ? 999 : index;
};

const sortTagsForFilters = (tags: string[]) => {
  return [...tags].sort((a, b) => {
    const pa = getPriorityIndex(a, filterPriority);
    const pb = getPriorityIndex(b, filterPriority);
    if (pa !== pb) return pa - pb;
    return a.localeCompare(b, "ru");
  });
};

const sortTagsForCard = (tags: string[]) => {
  return [...tags].sort((a, b) => {
    const pa = getPriorityIndex(a, cardTagPriority);
    const pb = getPriorityIndex(b, cardTagPriority);
    if (pa !== pb) return pa - pb;
    return a.localeCompare(b, "ru");
  });
};

const getTagMeta = (tag: string) => {
  const t = tag.toLowerCase();

  if (t.includes("email")) {
    return {
      icon: Mail,
      className:
        "border-[rgba(173,155,255,0.24)] bg-[rgba(236,232,255,0.92)] text-[#6f60b8]",
    };
  }
  if (t.includes("стат")) {
    return {
      icon: FileText,
      className:
        "border-[rgba(255,205,86,0.24)] bg-[rgba(255,231,163,0.34)] text-[#8a5a00]",
    };
  }
  if (t.includes("рассыл")) {
    return {
      icon: Mail,
      className:
        "border-[rgba(239,173,72,0.24)] bg-[rgba(255,223,181,0.32)] text-[#935b11]",
    };
  }
  if (t.includes("упаков") || t.includes("позиционир") || t.includes("бренд")) {
    return {
      icon: Package,
      className:
        "border-[rgba(162,192,224,0.24)] bg-[rgba(211,232,250,0.34)] text-[#4e6d8a]",
    };
  }
  if (t.includes("кейс")) {
    return {
      icon: Layers3,
      className:
        "border-[rgba(170,205,183,0.24)] bg-[rgba(214,239,221,0.34)] text-[#567260]",
    };
  }
  if (t.includes("сайт") || t.includes("лендинг")) {
    return {
      icon: MonitorSmartphone,
      className:
        "border-[rgba(190,184,236,0.24)] bg-[rgba(232,228,251,0.34)] text-[#675d96]",
    };
  }
  if (t.includes("текст")) {
    return {
      icon: PenSquare,
      className:
        "border-[rgba(230,192,146,0.24)] bg-[rgba(247,229,206,0.38)] text-[#8b6640]",
    };
  }
  if (t.includes("ai")) {
    return {
      icon: Sparkles,
      className:
        "border-primary/25 bg-primary/10 text-amber-900",
    };
  }

  return {
    icon: Tags,
    className:
      "border-slate-200/80 bg-[rgba(241,242,244,0.92)] text-slate-600",
  };
};

const hasUsableDescription = (item: PortfolioCase) => {
  const text = (item.description ?? "").trim();
  return text.length > 20;
};

const CasesSection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const requestedDirection = new URLSearchParams(location.search).get("direction");
  const direction = requestedDirection === "all" || requestedDirection === "marketing"
    ? requestedDirection : "ai";
  const params = new URLSearchParams(location.search);
  const active = cases.find((item) => item.id === params.get("case")) ?? null;
  const filterTag = params.get("tag");
  const caseTriggerRef = useRef<HTMLElement | null>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const listScrollRef = useRef<number | null>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (active) {
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

  const directionCases = useMemo(
    () => cases.filter((c) => direction === "all" || c.category === direction)
      .sort((a, b) => Number(b.category === "ai") - Number(a.category === "ai")),
    [direction]
  );

  const allTags = useMemo(() => {
    const set = new Set<string>();
    directionCases.forEach((c) => c.tags.forEach((t) => set.add(t.trim())));
    return sortTagsForFilters(Array.from(set));
  }, [directionCases]);

  const filteredCases = useMemo(() => {
    if (filterTag == null) return directionCases;
    return directionCases.filter((c) => c.tags.includes(filterTag));
  }, [filterTag, directionCases]);

  const selectDirection = (value: typeof directions[number]["value"]) => {
    const params = new URLSearchParams(location.search);
    params.delete("case");
    params.delete("tag");
    if (value === "ai") params.delete("direction");
    else params.set("direction", value);
    navigate({ search: params.toString(), hash: "#cases" });
  };

  const applyFilter = (tag: string | null) => {
    const params = new URLSearchParams(location.search);
    params.delete("case");
    if (tag) params.set("tag", tag);
    else params.delete("tag");
    navigate({ search: params.toString(), hash: "#cases" }, { replace: !!active });
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

        <div ref={filtersRef} className="mb-12 flex flex-wrap items-center gap-2.5" role="group" aria-label="Темы проектов">
          <button
            type="button"
            onClick={() => applyFilter(null)}
            aria-pressed={filterTag === null}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-300",
              "outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2",
              filterTag === null
                ? "border-amber-300/70 bg-[linear-gradient(180deg,rgba(255,224,138,0.96),rgba(255,202,74,0.9))] text-slate-900 shadow-[0_14px_28px_rgba(251,191,36,0.18)]"
                : "border-white/80 bg-white/72 text-slate-500 shadow-[0_8px_20px_rgba(15,23,42,0.04)] hover:border-slate-200 hover:bg-white hover:text-slate-700"
            )}
          >
            <Sparkles className="h-4 w-4" />
            <span>Все</span>
          </button>

          {allTags.map((tag) => {
            const meta = getTagMeta(tag);
            const Icon = meta.icon;

            return (
              <button
                key={tag}
                type="button"
                onClick={() => applyFilter(tag)}
                aria-pressed={filterTag === tag}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-300",
                  "outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2",
                  filterTag === tag
                    ? cn(
                        "shadow-[0_12px_28px_rgba(15,23,42,0.08)]",
                        meta.className
                      )
                    : "border-white/80 bg-white/72 text-slate-500 shadow-[0_8px_20px_rgba(15,23,42,0.04)] hover:border-slate-200 hover:bg-white hover:text-slate-700"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{tag}</span>
              </button>
            );
          })}
        </div>

        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {filteredCases.map((c) => {
            const sortedCardTags = sortTagsForCard(c.tags).slice(0, 3);

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
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {sortedCardTags.map((tag) => {
                      const meta = getTagMeta(tag);
                      const Icon = meta.icon;

                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            applyFilter(tag);
                          }}
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]",
                            "transition-colors outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 active:scale-100",
                            "shadow-none ring-0 hover:shadow-none before:hidden after:hidden",
                            c.category === "ai" ? "border-border bg-background text-foreground" : meta.className
                          )}
                          style={{
                            WebkitTapHighlightColor: "transparent",
                            boxShadow: "none",
                          }}
                        >
                          <Icon className="h-3 w-3" />
                          {tag}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-amber-500">
                    {c.company}
                  </div>

                  <h3 className="mb-3 text-[1.85rem] font-semibold leading-[1.08] tracking-tight text-slate-900 transition-colors group-hover:text-amber-700">
                    {c.title}
                  </h3>

                  {c.category === "ai" && (
                    <p className="mb-3 text-sm font-medium text-amber-700">{c.status}</p>
                  )}

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
                      <div className="h-11" />
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
              const fallback = document.querySelector<HTMLButtonElement>(`[data-case-trigger="${active?.id}"]`);
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
                {active.category === "marketing" && <div className="relative h-[240px] w-full sm:h-[320px] shrink-0 border-b border-slate-200/70 bg-slate-100">
                  <img
                    src={active.image}
                    alt={active.title}
                    className="h-full w-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,18,28,0.05),rgba(12,18,28,0.16))]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-90" />
                </div>}

                <div className="px-6 pb-10 pt-8 sm:px-12 sm:pb-14">
                  <div className="mx-auto max-w-3xl">
                    <div className="mb-4 flex flex-wrap gap-2">
                      {sortTagsForCard(active.tags).map((tag) => {
                        const meta = getTagMeta(tag);
                        const Icon = meta.icon;

                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => applyFilter(tag)}
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em]",
                              "transition-colors outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 shadow-none hover:scale-105",
                              active.category === "ai" ? "border-border bg-background text-foreground" : meta.className
                            )}
                            style={{ boxShadow: "none" }}
                          >
                            <Icon className="h-3.5 w-3.5" />
                            {tag}
                          </button>
                        );
                      })}
                    </div>

                    <h2 className={cn("mb-10 text-[2rem] font-semibold leading-[1.05] tracking-tight text-slate-950 sm:text-[2.6rem]", active.category === "ai" && "pr-10 !mb-6")}>
                      {active.title}
                    </h2>

                    {/* Блок информации строго сверху перед текстом */}
                    {active.category === "marketing" && (hasUsableDescription(active) || active.companyDescription) && (
                      <div className="mb-10 grid gap-4 md:grid-cols-[1.18fr_0.82fr]">
                        {hasUsableDescription(active) && (
                          <div className="rounded-[28px] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(247,242,253,0.94),rgba(255,255,255,0.98))] p-6 shadow-[0_12px_34px_rgba(15,23,42,0.05)]">
                            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-amber-500">
                              О проекте
                            </div>
                            <div className="mt-3 text-[1rem] leading-relaxed text-slate-600">
                              {active.description}
                            </div>
                          </div>
                        )}

                        {active.companyDescription && (
                          <div className="rounded-[28px] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(247,250,252,0.96),rgba(255,255,255,0.99))] p-6 shadow-[0_12px_34px_rgba(15,23,42,0.05)]">
                            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
                              Компания
                            </div>
                            <div className="mt-3 text-[1.08rem] font-semibold text-slate-900">
                              {active.company}
                            </div>
                            <div className="mt-3 text-[0.96rem] leading-relaxed text-slate-600">
                              {active.companyDescription}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className={active.category === "ai" ? undefined : notionProseClass}>
                      <Suspense fallback={<p role="status">Загружаю кейс…</p>}>
                        <CaseContent item={active} />
                      </Suspense>
                    </div>

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
