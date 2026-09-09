"use client";

import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { ModuleView, WelcomeScreen } from "@/components/modules/ModuleView";
import { PyodideProvider } from "@/components/python/PyodideProvider";
import { useProgressStore } from "@/lib/progress";
import { modulesById } from "@/content/modules";

export default function Home() {
  return (
    <PyodideProvider>
      <AppShell />
    </PyodideProvider>
  );
}

function AppShell() {
  const currentModuleId = useProgressStore((s) => s.currentModuleId);
  const currentLessonId = useProgressStore((s) => s.currentLessonId);

  const currentModule = currentModuleId ? modulesById[currentModuleId] : null;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <div className="flex-1">
          {currentModule ? (
            <ModuleView key={currentModule.id + (currentLessonId ?? "")} module={currentModule} />
          ) : (
            <WelcomeScreen />
          )}
        </div>
      </div>
    </div>
  );
}
