"use client";

import React, { useEffect } from "react";
import type { Module } from "@/lib/types";
import { Lesson } from "./Lesson";
import { useProgressStore } from "@/lib/progress";
import { modules } from "@/content/modules";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Layers } from "lucide-react";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";

interface ModuleViewProps {
  module: Module;
}

export function ModuleView({ module }: ModuleViewProps) {
  const { currentLessonId, openLesson, markLessonComplete } = useProgressStore();

  // Ensure a lesson is selected when the module loads.
  useEffect(() => {
    if (!currentLessonId || !module.lessons.find((l) => l.id === currentLessonId)) {
      openLesson(module.id, module.lessons[0].id);
    }
  }, [module.id, currentLessonId, openLesson, module.lessons]);

  const currentLesson =
    module.lessons.find((l) => l.id === currentLessonId) ?? module.lessons[0];
  const currentIdx = module.lessons.findIndex((l) => l.id === currentLesson.id);
  const hasPrev = currentIdx > 0;
  const hasNext = currentIdx < module.lessons.length - 1;

  const handleNext = () => {
    if (hasNext) {
      const next = module.lessons[currentIdx + 1];
      openLesson(module.id, next.id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      markLessonComplete(module.id, currentLesson.id);
    }
  };
  const handlePrev = () => {
    if (hasPrev) {
      const prev = module.lessons[currentIdx - 1];
      openLesson(module.id, prev.id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-3.5rem)]">
      {/* Lesson rail (desktop only) */}
      <aside className="hidden lg:block w-60 flex-shrink-0 border-r border-border bg-muted/20 sticky top-14 self-start h-[calc(100vh-3.5rem)] overflow-y-auto p-3">
        <ModuleLessonRail
          module={module}
          currentLessonId={currentLesson.id}
          onSelect={(lessonId) => openLesson(module.id, lessonId)}
        />
      </aside>

      {/* Lesson content */}
      <main className="flex-1 min-w-0">
        <Lesson
          lesson={currentLesson}
          moduleId={module.id}
          moduleTitle={module.title}
          onNext={handleNext}
          onPrev={handlePrev}
          hasNext={hasNext}
          hasPrev={hasPrev}
        />
      </main>
    </div>
  );
}

function ModuleLessonRail({
  module,
  currentLessonId,
  onSelect,
}: {
  module: Module;
  currentLessonId: string;
  onSelect: (lessonId: string) => void;
}) {
  const completedLessons = useProgressStore((s) => s.completedLessons);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <DynamicIcon name={module.icon} className="h-3.5 w-3.5" />
        </div>
        <div>
          <div className="text-[10px] text-muted-foreground">Nivel {module.level}</div>
          <div className="text-xs font-semibold text-foreground">{module.title}</div>
        </div>
      </div>
      <div className="space-y-0.5">
        {module.lessons.map((l, i) => {
          const done = completedLessons.includes(`${module.id}/${l.id}`);
          const current = l.id === currentLessonId;
          return (
            <button
              key={l.id}
              onClick={() => onSelect(l.id)}
              className={`w-full text-left flex items-start gap-2 rounded-md px-2 py-1.5 text-xs transition-colors ${
                current
                  ? "bg-primary/15 text-foreground font-medium"
                  : "hover:bg-muted text-muted-foreground"
              }`}
            >
              <span className="mt-0.5 flex h-4 w-4 items-center justify-center text-[9px] tabular-nums rounded-sm border border-border">
                {done ? "✓" : i + 1}
              </span>
              <span className="leading-snug">{l.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function pickIcon(name: string): React.ComponentType<{ className?: string }> {
  const lib = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
  return lib[name] ?? lib.Square ?? BookOpen;
}

function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const IconComp = pickIcon(name);
  return React.createElement(IconComp, { className });
}

// ============================================================
// Welcome screen shown when no module is selected
// ============================================================
export function WelcomeScreen() {
  const openModule = useProgressStore((s) => s.openModule);
  const completedLessons = useProgressStore((s) => s.completedLessons);
  const visitedModules = useProgressStore((s) => s.visitedModules);

  const startModule = modules[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 mb-3 text-[11px] uppercase tracking-wider text-primary font-medium bg-primary/10 px-3 py-1 rounded-full border border-primary/30">
          <Layers className="h-3 w-3" />
          Laboratorio interactivo
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
          Aprende Python y Análisis de Datos<br />experimentando, no memorizando.
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Una plataforma diseñada para Ingenieros Industriales que estudian Matemáticas, Álgebra Lineal y
          Física por su cuenta. Escribe código real, ejecútalo en tu navegador, visualiza variables,
          transforma matrices, analiza datos y simula procesos industriales.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button onClick={() => openModule(startModule.id, startModule.lessons[0].id)} className="gap-1.5">
            Empezar por el principio
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              const npModule = modules.find((m) => m.id === "numpy-linear-algebra");
              if (npModule) openModule(npModule.id, npModule.lessons[0].id);
            }}
            className="gap-1.5"
          >
            Ir a NumPy + Álgebra Lineal
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {modules.map((m) => {
          const visited = visitedModules.includes(m.id);
          const completedCount = m.lessons.filter((l) =>
            completedLessons.includes(`${m.id}/${l.id}`),
          ).length;
          return (
            <button
              key={m.id}
              onClick={() => openModule(m.id, m.lessons[0].id)}
              className="text-left group"
            >
              <Card className="h-full border-border bg-card/40 hover:border-primary/40 hover:bg-card/60 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start gap-2.5 mb-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/15 text-primary">
                      <DynamicIcon name={m.icon} className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-muted-foreground tabular-nums">N{m.level}</span>
                        {visited && (
                          <span className="text-[9px] text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                            Iniciado
                          </span>
                        )}
                      </div>
                      <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {m.title}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-2 line-clamp-2">
                    {m.description}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{m.lessons.length} lecciones</span>
                    <span>{completedCount} completadas</span>
                  </div>
                </CardContent>
              </Card>
            </button>
          );
        })}
      </div>
    </div>
  );
}
