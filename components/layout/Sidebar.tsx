"use client";

import React, { useState, useEffect } from "react";
import { modules, totalLessons } from "@/content/modules";
import { useProgressStore } from "@/lib/progress";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, FlaskConical, ChevronRight, CheckCircle2, Circle } from "lucide-react";
import * as LucideIcons from "lucide-react";

interface SidebarProps {
  isMobile?: boolean;
  onNavigate?: () => void;
}

export function Sidebar({ isMobile = false, onNavigate }: SidebarProps) {
  const { currentModuleId, currentLessonId, visitedModules, completedLessons, openLesson } = useProgressStore();

  const handleClick = (moduleId: string, lessonId: string) => {
    openLesson(moduleId, lessonId);
    onNavigate?.();
  };

  const header = (
    <div className="px-4 py-4 border-b border-sidebar-border">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <FlaskConical className="h-5 w-5" />
        </div>
        <div>
          <div className="font-semibold text-sm text-sidebar-foreground">PyLab</div>
          <div className="text-[10px] text-muted-foreground">Laboratorio de Python y Datos</div>
        </div>
      </div>
    </div>
  );

  const list = (
    <div className="flex flex-col gap-0.5 px-2 py-2">
      {modules.map((m) => {
        const isCurrentModule = m.id === currentModuleId;
        const visited = visitedModules.includes(m.id);
        const moduleComplete = m.lessons.every((l) =>
          completedLessons.includes(`${m.id}/${l.id}`),
        );
        const lessonCount = m.lessons.length;
        const completedCount = m.lessons.filter((l) =>
          completedLessons.includes(`${m.id}/${l.id}`),
        ).length;
        return (
          <div key={m.id} className="rounded-md">
            <button
              onClick={() => handleClick(m.id, m.lessons[0].id)}
              className={cn(
                "w-full flex items-center gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors",
                isCurrentModule
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-accent/60 text-sidebar-foreground",
              )}
            >
              <div className={cn(
                "flex h-7 w-7 items-center justify-center rounded-md",
                isCurrentModule ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
              )}>
                <DynamicIcon name={m.icon} className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-muted-foreground">N{m.level}</span>
                  <span className="text-xs font-medium truncate">{m.title}</span>
                </div>
                <div className="mt-0.5 flex items-center gap-1">
                  <Progress
                    value={lessonCount > 0 ? (completedCount / lessonCount) * 100 : 0}
                    className="h-1"
                  />
                  <span className="text-[9px] text-muted-foreground tabular-nums w-8 text-right">
                    {completedCount}/{lessonCount}
                  </span>
                </div>
              </div>
              {moduleComplete && (
                <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" />
              )}
            </button>

            {isCurrentModule && (
              <div className="ml-4 mt-1 mb-1.5 border-l border-sidebar-border pl-2 flex flex-col gap-0.5">
                {m.lessons.map((l) => {
                  const done = completedLessons.includes(`${m.id}/${l.id}`);
                  const current = l.id === currentLessonId;
                  return (
                    <button
                      key={l.id}
                      onClick={() => handleClick(m.id, l.id)}
                      className={cn(
                        "flex items-center gap-1.5 rounded px-2 py-1 text-left text-[11px] transition-colors",
                        current
                          ? "bg-primary/15 text-foreground font-medium"
                          : "hover:bg-sidebar-accent/40 text-muted-foreground",
                      )}
                    >
                      {done ? (
                        <CheckCircle2 className="h-3 w-3 text-primary flex-shrink-0" />
                      ) : (
                        <Circle className="h-3 w-3 flex-shrink-0" />
                      )}
                      <span className="truncate">{l.title}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const footer = (
    <div className="border-t border-sidebar-border px-4 py-3 text-[10px] text-muted-foreground">
      <div className="flex items-center justify-between mb-1">
        <span>Progreso total</span>
        <span className="font-mono">
          {completedLessons.length}/{totalLessons}
        </span>
      </div>
      <Progress
        value={totalLessons > 0 ? (completedLessons.length / totalLessons) * 100 : 0}
        className="h-1.5"
      />
    </div>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0 flex flex-col">
          {header}
          <ScrollArea className="flex-1">{list}</ScrollArea>
          {footer}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside className="hidden md:flex w-64 flex-col h-screen sticky top-0 bg-sidebar border-r border-sidebar-border">
      {header}
      <ScrollArea className="flex-1">{list}</ScrollArea>
      {footer}
    </aside>
  );
}

// Pick a Lucide icon by name, falling back to a default.
function pickIcon(name: string): React.ComponentType<{ className?: string }> {
  const lib = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
  return lib[name] ?? lib.Square ?? FlaskConical;
}

function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const IconComp = pickIcon(name);
  return React.createElement(IconComp, { className });
}
