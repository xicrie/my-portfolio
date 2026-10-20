"use client";

import { motion } from "framer-motion";
import { ArrowRight, Send, Lightbulb } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import PremiumBackground from "./PremiumBackground";

const quotes = [
  "Мне мало пользоваться AI. Хочется создавать с его помощью что-то своё.",
  "Обожаю момент, когда идея превращается в работающую программу.",
  "Если что-то можно автоматизировать, мне хочется попробовать.",
  "В нейросетях меня увлекает то, что с ними можно построить.",
  "Могу часами искать ошибку, если знаю, что в итоге всё заработает.",
];

type QuoteInteraction = "pointer" | "keyboard" | "touch" | null;

const HeroSection = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [interaction, setInteraction] = useState<QuoteInteraction>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const quoteOpen = interaction !== null;
  const showQuote = (mode: Exclude<QuoteInteraction, null>) => {
    setQuoteIndex(previous => (previous + 1) % quotes.length);
    setInteraction(mode);
  };

  useEffect(() => {
    if (!interaction) return;
    const close = () => setInteraction(null);
    const onOutsidePress = (event: PointerEvent) => {
      if (!photoRef.current?.contains(event.target as Node)) close();
    };
    const onVisibility = () => { if (document.hidden) close(); };
    // One timer per interaction; touch gets a bounded reading time.
    const timer = interaction === "touch"
      ? window.setTimeout(close, 6000)
      : window.setInterval(() => setQuoteIndex(previous => (previous + 1) % quotes.length), 6000);
    document.addEventListener("pointerdown", onOutsidePress);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", close);
    return () => {
      window.clearTimeout(timer);
      window.clearInterval(timer);
      document.removeEventListener("pointerdown", onOutsidePress);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", close);
    };
  }, [interaction]);

  return (
    <section
      className="relative isolate overflow-hidden pt-24 md:pt-32"
    >
      {/* ВОТ ЗДЕСЬ Я УДАЛИЛ ТОТ САМЫЙ ГРАДИЕНТ, КОТОРЫЙ ДЕЛАЛ ШОВ */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <PremiumBackground />
      </div>

      <div className="container relative z-10">
        <div className="grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
          <motion.div
            initial={{ y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-w-[760px] pb-16 md:pb-24"
          >
            <div className="mb-8 flex items-center gap-4">
              <span className="h-px w-14 bg-accent" />
              <span className="text-[11px] uppercase tracking-[0.34em] text-muted-foreground">
                портфолио
              </span>
            </div>

            <div className="relative">
              <h1 className="type-hero text-foreground">
                <span className="block">Привет,</span>
                <span className="block whitespace-nowrap bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                  я Алёна
                </span>
              </h1>

              <p className="mt-7 text-[1.18rem] font-semibold leading-relaxed text-foreground md:text-[1.34rem]">
                AI-специалист на&nbsp;стыке автоматизации и&nbsp;маркетинга
              </p>
              <p className="type-body mt-6 max-w-[710px] text-muted-foreground">
                Придумываю и&nbsp;запускаю AI-инструменты, ботов и&nbsp;автоматизации.
                Люблю разбираться в&nbsp;сложном, экспериментировать и&nbsp;доводить идеи до&nbsp;работающего продукта.
                За&nbsp;семь лет в&nbsp;маркетинге научилась понимать пользователей и&nbsp;находить решения, упрощающие работу.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#cases"
                  className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-[1.2rem] bg-accent px-6 py-4 text-base font-medium text-accent-foreground shadow-[0_18px_44px_rgba(236,183,11,0.28)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_68px_rgba(236,183,11,0.36)]"
                >
                  <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.0)_42%,rgba(255,255,255,0.12)_100%)] opacity-75" />
                  <span className="relative z-10">Смотреть проекты</span>
                  <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>

                <a
                  href="https://t.me/xicrie"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-[1.2rem] border border-[#dcd3c6] bg-white/50 px-6 py-4 text-base font-medium text-foreground shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-accent/35 hover:bg-white/80"
                >
                  <Send className="h-4 w-4" />
                  Написать в&nbsp;Telegram
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 28, y: 14 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative mx-auto w-full max-w-[580px] pb-16 md:pb-24"
          >
            <div
              ref={photoRef}
              className="group relative"
              data-hero-photo
              data-quote-active={quoteOpen}
              onPointerEnter={(event) => { if (event.pointerType !== "touch") showQuote("pointer"); }}
              onPointerLeave={(event) => { if (event.pointerType !== "touch") setInteraction(null); }}
              onPointerCancel={() => setInteraction(null)}
              onPointerDown={(event) => {
                if (event.pointerType === "touch") {
                  if (interaction === "touch") setInteraction(null);
                  else showQuote("touch");
                }
              }}
              onFocus={(event) => { if (event.currentTarget.matches(":focus-visible")) showQuote("keyboard"); }}
              onBlur={() => setInteraction(null)}
              onKeyDown={(event) => {
                if (event.key === "Escape") setInteraction(null);
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  if (quoteOpen) setInteraction(null);
                  else showQuote("keyboard");
                }
              }}
              tabIndex={0}
              role="button"
              aria-expanded={quoteOpen}
              aria-controls="hero-quote"
              aria-label={quoteOpen ? `Авторские фразы на фотографии: ${quotes[quoteIndex]}` : "Авторские фразы на фотографии"}
            >
              <div className="pointer-events-none absolute inset-[-80px] rounded-[4rem] opacity-0 blur-[80px] transition-opacity duration-500 ease-out group-hover:opacity-100 bg-[radial-gradient(circle_at_50%_50%,rgba(255,214,110,0.35)_0%,transparent_60%)]" />
              <div className="pointer-events-none absolute inset-[-20px] rounded-[3.8rem] opacity-0 blur-[35px] transition-opacity duration-300 ease-out group-hover:opacity-100 bg-[radial-gradient(circle_at_50%_50%,rgba(255,248,225,0.95)_0%,rgba(255,224,140,0.6)_50%,transparent_70%)]" />

              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="relative rounded-[2.65rem] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.8),rgba(255,255,255,0.4))] p-3 shadow-[0_16px_40px_rgba(20,15,10,0.06)] backdrop-blur-2xl transition-all duration-300 group-hover:border-white group-hover:bg-[linear-gradient(180deg,rgba(255,255,255,1),rgba(255,255,255,0.7))] group-hover:shadow-[0_0_100px_rgba(255,224,140,0.4),inset_0_0_20px_rgba(255,255,255,0.8)]"
              >
                <div className="pointer-events-none absolute inset-[7px] z-10 rounded-[2.2rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(255,255,255,0.1)]" />

                <div className="relative overflow-hidden rounded-[2rem]">
                  <img
                    src="/images/alena-hero-960.webp"
                    srcSet="/images/alena-hero-640.webp 640w, /images/alena-hero-960.webp 960w, /images/alena-hero-1024.webp 1024w"
                    sizes="(min-width: 1280px) 580px, (min-width: 1024px) 45vw, (min-width: 640px) 560px, 90vw"
                    width={1024}
                    height={1536}
                    alt="Алёна Степанова"
                    fetchPriority="high"
                    decoding="async"
                    className="h-[520px] w-full object-cover sm:h-[620px]"
                    draggable={false}
                  />

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-[linear-gradient(180deg,transparent_0%,rgba(30,20,10,0.45)_100%)] opacity-80 transition-opacity duration-300 group-hover:opacity-100" />

                  <div id="hero-quote" aria-hidden={!quoteOpen} className="pointer-events-none absolute bottom-6 left-5 right-5 z-20 translate-y-4 opacity-0 transition-all duration-300 ease-out group-data-[quote-active=true]:pointer-events-auto group-data-[quote-active=true]:translate-y-0 group-data-[quote-active=true]:opacity-100 sm:left-6 sm:right-6">
                    <div className="relative rounded-[1.25rem] bg-[#fbf9f6] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.25)]">
                      <svg
                        className="absolute -top-[14px] right-12 h-[15px] w-[20px] text-[#fbf9f6] drop-shadow-[0_-4px_4px_rgba(0,0,0,0.04)]"
                        viewBox="0 0 20 15"
                        fill="currentColor"
                      >
                        <path d="M20 0C20 0 10 15 0 15H20V0Z" />
                      </svg>

                      <div className="flex gap-4">
                        <div className="relative mt-0.5 shrink-0">
                          <Lightbulb
                            className="relative z-10 h-[24px] w-[24px] text-[#b5a08d] transition-colors duration-300 group-data-[quote-active=true]:text-amber-500"
                            strokeWidth={2}
                          />
                        </div>

                        <p aria-live="polite" className="min-h-[6.4em] min-[360px]:min-h-[4.8em] sm:min-h-[3.2em] text-[1.08rem] font-medium leading-[1.6] text-[#4a3528]">
                          {quotes[quoteIndex]}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
