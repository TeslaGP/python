import type { Module } from "@/lib/types";
import { pythonBasics } from "./python-basics";
import { algorithmicThinking } from "./algorithmic-thinking";
import { dataStructures } from "./data-structures";
import { functionsModule } from "./functions";
import { numpyLinearAlgebra } from "./numpy-linear-algebra";
import { matplotlibModule } from "./matplotlib";
import { pandasModule } from "./pandas";
import { edaModule } from "./eda";
import { statisticsModule } from "./statistics";
import { sqlModule } from "./sql";
import { dataAnalysisProject } from "./data-analysis-project";
import { simulationModule } from "./simulation";
import { industrialProjects } from "./industrial-projects";

export const modules: Module[] = [
  pythonBasics,
  algorithmicThinking,
  dataStructures,
  functionsModule,
  numpyLinearAlgebra,
  matplotlibModule,
  pandasModule,
  edaModule,
  statisticsModule,
  sqlModule,
  dataAnalysisProject,
  simulationModule,
  industrialProjects,
].sort((a, b) => a.level - b.level);

export const modulesById: Record<string, Module> = Object.fromEntries(
  modules.map((m) => [m.id, m]),
);

export const totalLessons = modules.reduce((s, m) => s + m.lessons.length, 0);

export function getModule(id: string): Module | undefined {
  return modulesById[id];
}
