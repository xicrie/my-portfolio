"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Lightbulb, 
  PenTool, 
  Cpu, 
  Workflow, 
  BarChart3,
  Network
} from "lucide-react";

// --- ТИПЫ И ДАННЫЕ ---
type Tone = "warm" | "cool";

const pipelineStages = [
  {
    id: 1,
    title: "Смыслы\nи позиционирование",
    icon: Lightbulb,
    tone: "warm" as Tone,
    tools: ["Интервью", "Анализ аудитории", "Позиционирование", "Путь клиента"],
    impact: "Разбираюсь, кому нужен продукт и какую задачу он решает. Помогаю объяснить сложную идею через понятную пользу для клиента.",
  },
  {
    id: 2,
    title: "Контент\nи коммуникации",
    icon: PenTool,
    tone: "cool" as Tone,
    tools: ["Кейсы", "SEO", "Рассылки", "Посадочные страницы"],
    impact: "Продумываю, что человек должен узнать о продукте на каждом этапе. Готовлю материалы, которые отвечают на вопросы и помогают перейти к разговору.",
  },
  {
    id: 3,
    title: "AI-разработка",
    icon: Cpu,
    tone: "warm" as Tone,
    tools: ["Codex", "Claude Code"],
    impact: "Создаю решения с помощью AI: от требований и первой версии до запуска. Тестирую сценарии, разбираю ошибки и повторяю проверки после доработок.",
  },
  {
    id: 4,
    title: "Автоматизация\nбизнес-процессов",
    icon: Workflow,
    tone: "cool" as Tone,
    tools: ["n8n", "API", "Вебхуки"],
    impact: "Развиваю автоматизации на n8n и опираюсь на опыт с CRM-процессами. Проектирую передачу данных между сервисами и проверку ошибок.",
  },
  {
    id: 5,
    title: "Аналитика\nи рост",
    icon: BarChart3,
    tone: "warm" as Tone,
    tools: ["Яндекс.Метрика", "Roistat"],
    impact: "Смотрю на данные и сравниваю результат с исходной задачей. Ищу, что сработало, где теряется внимание и что стоит проверить следующим шагом.",
  },
];

// Настройки свечения для эффекта "зажигающейся лампочки"
const themeStyles = {
  warm: {
    baseBg: "bg-amber-50",
    iconColor: "text-amber-500",
    border: "border-amber-300",
    glow: "shadow-[0_0_40px_rgba(245,158,11,0.5)]", 
  },
  cool: {
    baseBg: "bg-violet-50",
    iconColor: "text-violet-500",
    border: "border-violet-300",
    glow: "shadow-[0_0_40px_rgba(139,92,246,0.5)]",
  }
};

export default function AI_RoadmapSection() {
  const [hoveredStage, setHoveredStage] = useState<number | null>(null);

  return (
    <section className="relative w-full overflow-visible py-16 md:py-24 font-sans text-slate-900 z-10">

      <div className="container relative z-20 mx-auto px-6 max-w-[1200px]">
        
        {/* Хедер секции */}
        <div className="mb-14 max-w-3xl md:mb-32">
          <div className="mb-5 flex items-center gap-4">
            {/* Тонкая линия и тонкий шрифт подзаголовка */}
            <span className="h-px w-16 bg-amber-400" />
            <span className="text-xs uppercase tracking-[0.25em] text-slate-500 font-normal">
              Архитектура работы
            </span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-[3.2rem] leading-[1.1] text-slate-900">
            От&nbsp;задачи к&nbsp;результату
          </h2>
          <p className="mt-6 text-[1.1rem] leading-relaxed text-slate-600">
            Изучаю аудиторию и&nbsp;рабочие процессы, продумываю сценарий и&nbsp;объясняю ценность продукта. Использую
            инструменты ИИ там, где они помогают быстрее проверить идею и&nbsp;убрать лишнюю работу.
          </p>
        </div>

        {/* Интерактивная магистраль */}
        <div className="relative flex flex-col md:flex-row items-center justify-between w-full min-h-[300px]">
          
          {/* Базовая линия (Десктоп) */}
          <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 h-[2px] w-full bg-slate-200/80 rounded-full" />
          
          {/* Анимированная заполняющаяся линия */}
          <motion.div
            className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-amber-400 via-orange-400 to-violet-500 rounded-full z-0"
            initial={{ width: "0%" }}
            animate={{ 
              width: hoveredStage 
                ? `${((hoveredStage - 1) / (pipelineStages.length - 1)) * 100}%` 
                : "0%" 
            }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />

          {/* Мобильная линия */}
          <div className="block md:hidden absolute left-[27px] top-0 w-[2px] h-full bg-slate-200/80 rounded-full" />

          {/* Узлы (Лампочки) */}
          {pipelineStages.map((stage, index) => {
            const Icon = stage.icon;
            const isHovered = hoveredStage === stage.id;
            const style = themeStyles[stage.tone];
            const isTop = index % 2 === 0;

            return (
              <div
                key={stage.id}
                className="relative z-30 flex flex-row md:flex-col items-start md:items-center w-full md:w-auto group cursor-pointer mb-14 md:mb-0"
                role="button"
                tabIndex={0}
                aria-label={stage.title.replace("\n", " ")}
                aria-expanded={isHovered}
                aria-controls={isHovered ? `skill-${stage.id}` : undefined}
                onFocus={() => setHoveredStage(stage.id)}
                onBlur={() => setHoveredStage(null)}
                onClick={() => setHoveredStage(stage.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setHoveredStage(stage.id);
                  } else if (event.key === "Escape") {
                    setHoveredStage(null);
                  }
                }}
                onMouseEnter={() => setHoveredStage(stage.id)}
                onMouseLeave={(event) => {
                  if (!event.currentTarget.contains(document.activeElement)) setHoveredStage(null);
                }}
              >
                {/* Лампочка */}
                <motion.div
                  className={cn(
                    "relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 bg-white/90 backdrop-blur-sm z-40",
                    isHovered 
                      ? `${style.border} ${style.glow} scale-110` 
                      : "border-slate-200 shadow-sm hover:scale-105 hover:border-slate-300"
                  )}
                >
                  <Icon className={cn("h-[1.3rem] w-[1.3rem] transition-colors duration-300", isHovered ? style.iconColor : "text-slate-400")} />
                  
                  {/* Имитация включения света внутри узла */}
                  <div className={cn(
                    "absolute inset-0 rounded-full transition-opacity duration-300",
                    isHovered ? style.baseBg : "opacity-0"
                  )} />
                  <Icon className={cn("absolute h-[1.3rem] w-[1.3rem] z-10 transition-colors duration-300", isHovered ? style.iconColor : "text-slate-400")} />
                </motion.div>

                {/* Название под/над узлом */}
                <div className={cn(
                  "ml-6 md:ml-0 md:absolute md:w-44 md:text-center transition-all duration-300",
                  isTop ? "md:top-20" : "md:bottom-20",
                  isHovered ? "opacity-0 md:translate-y-2" : "opacity-100"
                )}>
                  <span className="text-[0.85rem] font-bold tracking-wide uppercase text-slate-500 pt-3 md:pt-0 block whitespace-pre-line leading-snug">
                    {stage.title}
                  </span>
                </div>

                {/* Раскрывающаяся карточка */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      id={`skill-${stage.id}`}
                      style={{ x: "var(--skill-offset, 0%)" }}
                      initial={{ opacity: 0, y: isTop ? 15 : -15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: isTop ? 10 : -10, scale: 0.95 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className={cn(
                        "absolute left-16 md:left-1/2 md:[--skill-offset:-50%] w-[calc(100vw-7rem)] md:w-[360px] rounded-[1.5rem] p-7 text-left z-50",
                        index === 0 && "md:left-0 md:[--skill-offset:0%]",
                        index === pipelineStages.length - 1 && "md:left-auto md:right-0 md:[--skill-offset:0%]",
                        "bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_16px_40px_rgba(31,38,135,0.06)]",
                        isTop ? "md:top-24" : "md:bottom-24"
                      )}
                    >
                      {/* Название внутри карточки */}
                      <h4 className={cn("text-[1.05rem] font-bold mb-4", style.iconColor)}>
                        {stage.title.replace('\n', ' ')}
                      </h4>

                      {/* Плашки навыков */}
                      <div className="mb-5 flex flex-wrap gap-2">
                        {stage.tools.map((tool) => (
                          <span 
                            key={tool} 
                            className="rounded-md border border-white/80 bg-white/60 backdrop-blur-md px-2.5 py-1.5 text-sm font-medium text-slate-700 shadow-sm"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                      
                      <div className="h-px w-full bg-slate-200/60 mb-5" />
                      
                      {/* Бизнес-Импакт */}
                      <p className="text-[0.92rem] font-medium leading-relaxed text-slate-800">
                        {stage.impact}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Облегченный подвал (Кнопка) в единой стилистике */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 md:mt-24 flex flex-col md:flex-row items-start md:items-center justify-between rounded-[1.25rem] border border-white/50 bg-white/30 p-5 md:px-7 md:py-6 backdrop-blur-xl shadow-sm"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-5">
            {/* Иконка теперь легкая, с янтарным акцентом */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/60 border border-white/80 shadow-sm">
              <Network className="h-5 w-5 text-amber-500" />
            </div>
            <p className="text-[0.9rem] font-medium leading-relaxed text-slate-700 max-w-[800px]">
              Выбираю инструменты под&nbsp;задачу, создаю решения с&nbsp;помощью AI,
              настраиваю интеграции и&nbsp;проверяю результат в&nbsp;реальной работе.
            </p>
          </div>
          {/* Лампочка online — теперь фирменного янтарного цвета */}
          <div className="hidden md:flex h-3 w-3 shrink-0 items-center justify-center relative ml-6">
            <span className="absolute h-3 w-3 animate-ping rounded-full bg-amber-400 opacity-60"></span>
            <span className="relative h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]"></span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
