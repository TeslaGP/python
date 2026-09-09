# PyLab — Laboratorio de Python y Datos

Plataforma web interactiva para aprender Python, NumPy, Pandas, Matplotlib, SQL, estadística, análisis exploratorio, simulación y proyectos de Ingeniería Industrial. Pensada especialmente para una persona Ingeniera Industrial que estudia por su cuenta Matemáticas, Álgebra Lineal y Física.

> No es un curso de sintaxis. Es un **laboratorio**: escribes código real, lo ejecutas en el navegador, ves variables, transformaciones, gráficos, tablas y datos — y experimentas hasta entender.

---

## Características principales

- **Python real en el navegador** vía Pyodide (WebAssembly). NumPy, Pandas, Matplotlib y SciPy ya vienen precargados.
- **Estado persistente entre celdas**: las variables que defines en una lección se mantienen disponibles en la siguiente, como en un cuaderno Jupyter.
- **Editor CodeMirror** con resaltado de sintaxis Python y atajo `Ctrl/Cmd+Enter` para ejecutar.
- **Inspector de variables** que muestra nombre, valor y tipo. Detecta automáticamente `DataFrame` y `ndarray` y los muestra con visualización especial.
- **Visor de DataFrames** con tabla estilada, encabezados y shape.
- **Visor de gráficos matplotlib** (los PNG se renderizan automáticamente tras `plt.show()` o al final de la ejecución).
- **Errores amigables**: cuando Python lanza una excepción, el sistema no muestra solo el `traceback`. Lo explica en español en seis secciones: *tipo de error*, *dónde ocurrió*, *qué esperaba Python*, *qué recibió*, *por qué ocurrió* y *cómo corregirlo*.
- **Editor SQL** con sql.js (SQLite en WebAssembly), con tres tablas industriales precargadas (empleados, productos, ventas).
- **13 módulos** con 89 lecciones que siguen la secuencia pedagógica: *Problema → Idea → Código → Resultado → Interpretación → Experimentación*.
- **Ejercicios verificables** con sistema de pistas progresivas (Pista 1, Pista 2, …) y solución opcional.
- **Retos "Modo Resuélvelo tú"** donde solo se entrega contexto + datos + objetivo.
- **Mini-proyectos** con checklist al final de cada bloque.
- **Visualizadores pedagógicos**: bucles, condicionales, funciones, listas, vectores 2D, matrices, transformaciones lineales.
- **Progreso persistente** en `localStorage` (módulos visitados, lecciones y ejercicios completados).
- **Modo claro/oscuro** con paleta esmeralda/teal estilo "laboratorio científico".
- **Diseño responsive**: drawer en móvil, sidebar fija en desktop, breakpoints tablet.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router) |
| Lenguaje | TypeScript 5 |
| Estilos | Tailwind CSS 4 + shadcn/ui (New York) |
| Estado | Zustand + persist (localStorage) |
| Tema | next-themes |
| Animaciones | Framer Motion |
| Editor de código | @uiw/react-codemirror + @codemirror/lang-python + theme-one-dark |
| Python | Pyodide v0.26.4 cargado desde CDN |
| SQL | sql.js v1.10.3 (SQLite WebAssembly) |
| Iconos | lucide-react |
| Markdown | react-markdown |

---

## Cómo ejecutar el proyecto localmente

### Requisitos

- Node.js 20+ o Bun 1.x
- Navegador moderno (Chromium, Firefox o Safari recientes)
- Conexión a internet (Pyodide y sql.js se cargan desde CDN en tiempo de ejecución)

### Instalación

```bash
# Instalar dependencias
bun install
# o: npm install
```

### Desarrollo

```bash
bun run dev
# o: npm run dev
```

El servidor de desarrollo se levanta en `http://localhost:3000`. La primera vez que se ejecuta código Python, Pyodide se descarga (~10 MB) — puede tardar entre 10 y 30 segundos según la conexión. Muestra un indicador de progreso ("Cargando Python…", "Cargando NumPy…", etc.).

### Lint

```bash
bun run lint
```

### Producción

```bash
bun run build
bun run start
```

> Nota: Pyodide y sql.js se cargan desde CDN en tiempo de ejecución. La aplicación no los empaqueta. Si necesitas desplegar en un entorno sin acceso a internet, deberás hospedar Pyodide y sql.js en tu propio CDN y cambiar las URLs en `src/lib/pyodide.ts` y `src/lib/sql.ts`.

---

## Estructura de carpetas

```
my-project/
├── src/
│   ├── app/
│   │   ├── layout.tsx           ← Root layout: ThemeProvider, Script Pyodide, Toaster
│   │   ├── page.tsx             ← SPA shell: Sidebar + TopBar + ModuleView/WelcomeScreen
│   │   └── globals.css         ← Variables CSS, paleta esmeralda, estilos de editor y scrollbar
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx     ← Navegación de módulos con progreso
│   │   │   └── TopBar.tsx       ← Toggle tema, progreso total, estado de Pyodide
│   │   ├── python/
│   │   │   ├── PyodideProvider.tsx ← Contexto: carga Pyodide una sola vez
│   │   │   ├── CodeCell.tsx     ← Celda editable+ejecutable con verificar/pistas/solución
│   │   │   ├── CodeEditor.tsx   ← Wrapper CodeMirror con atajo Ctrl+Enter
│   │   │   ├── Console.tsx     ← Renderiza stdout + error card explicado
│   │   │   ├── PlotViewer.tsx  ← Muestra PNGs de matplotlib (base64)
│   │   │   ├── VariableInspector.tsx ← Tabla de variables con tipo y valor
│   │   │   ├── DataFrameViewer.tsx   ← Tabla estilada para pandas DataFrame
│   │   │   ├── RunButton.tsx   ← Botón Ejecutar + Restablecer
│   │   │   └── SqlPlayground.tsx ← Editor SQL con sql.js + resultado en tabla
│   │   ├── modules/
│   │   │   ├── ModuleView.tsx       ← Renderiza módulo + rail de lecciones + welcome screen
│   │   │   ├── Lesson.tsx           ← Renderiza bloques de una lección
│   │   │   ├── ConceptCard.tsx      ← Card Problema→Idea→Código→Interpretación
│   │   │   ├── DataTable.tsx        ← Tabla estática de datos (kind: "table")
│   │   │   ├── MiniProjectCard.tsx  ← Mini-proyecto con checklist
│   │   │   └── VisualizerRenderer.tsx ← Dispatcher de visualizadores por nombre
│   │   ├── visualizations/
│   │   │   ├── LoopVisualizer.tsx
│   │   │   ├── ConditionalVisualizer.tsx
│   │   │   ├── FunctionVisualizer.tsx
│   │   │   ├── ListVisualizer.tsx
│   │   │   ├── VectorVisualizer.tsx
│   │   │   └── MatrixVisualizer.tsx
│   │   └── ui/                   ← Componentes shadcn/ui (no editar manualmente)
│   ├── content/
│   │   ├── modules/
│   │   │   ├── python-basics.ts          ← N1: variables, tipos, operadores, strings, control de flujo
│   │   │   ├── algorithmic-thinking.ts   ← N2: descomposición, depuración
│   │   │   ├── data-structures.ts        ← N3: listas, tuplas, diccionarios, conjuntos, comprehension
│   │   │   ├── functions.ts             ← N4: parámetros, return, refactor
│   │   │   ├── numpy-linear-algebra.ts  ← N5: arrays, vectores, matrices, Ax=b, transformaciones
│   │   │   ├── matplotlib.ts            ← N6: líneas, barras, histogramas, scatter, subplots
│   │   │   ├── pandas.ts                ← N7: Series, DataFrame, CSV, groupby, merge
│   │   │   ├── eda.ts                   ← N8: head, info, describe, missing, duplicates
│   │   │   ├── statistics.ts            ← N9: media, mediana, varianza, percentiles, correlación
│   │   │   ├── sql.ts                   ← N10: SELECT, WHERE, GROUP BY, JOIN con sql.js
│   │   │   ├── data-analysis-project.ts ← N11: proyecto de 12 pasos sobre 500 ventas
│   │   │   ├── simulation.ts            ← N12: inventario, producción, Monte Carlo
│   │   │   ├── industrial-projects.ts   ← N13: 8 proyectos (ventas, ABC, calidad, etc.)
│   │   │   └── index.ts                ← Exporta array ordenado por nivel
│   │   └── datasets.ts          ← Datasets industriales como strings CSV
│   ├── lib/
│   │   ├── pyodide.ts           ← Singleton loader + harness Python que captura todo
│   │   ├── sql.ts               ← Loader de sql.js + createDatabase()
│   │   ├── progress.ts          ← Zustand store persistente
│   │   ├── errorExplainer.ts   ← Map de excepciones Python → explicación en español
│   │   ├── types.ts             ← Tipos TypeScript del modelo de contenido
│   │   ├── db.ts                ← Prisma client (no usado por defecto)
│   │   └── utils.ts             ← Helpers (cn, etc.)
│   └── hooks/
│       ├── use-mobile.ts
│       └── use-toast.ts
├── public/
├── prisma/
├── LEEME.md  ← este archivo
└── package.json
```

---

## Modelo de contenido

Todo el contenido pedagógico está definido en TypeScript en `src/content/modules/*.ts`. Cada módulo sigue la misma estructura:

```typescript
interface Module {
  id: string;          // "python-basics", "pandas", ...
  title: string;       // "Python desde cero"
  level: number;       // 1..13 para orden en el path de aprendizaje
  icon: string;        // Nombre de icono lucide-react
  description: string;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  blocks: LessonBlock[];  // Cada bloque es uno de los tipos siguientes
}

type LessonBlock =
  | { kind: "text"; title?: string; body: string }                                    // Markdown
  | { kind: "codecell"; code: string; readOnly?: boolean; caption?: string }         // Celda ejecutable
  | { kind: "visualization"; component: string; props?: Record<string, unknown> }   // Visualizador
  | { kind: "concept"; problema; idea; codigo; interpretacion }                     // Card pedagógico
  | { kind: "exercise"; id; prompt; starterCode; hints[]; solution; check }         // Ejercicio verificable
  | { kind: "challenge"; id; context; data?; objetivo; hints[]; solution? }           // Reto abierto
  | { kind: "table"; headers[]; rows[][]; caption? }                                 // Tabla estática
  | { kind: "miniproject"; id; title; context; objetivo; checklist[]; ... };          // Mini-proyecto
```

### Tipos de `check` para ejercicios

```typescript
type CheckSpec =
  | { type: "output_contains"; value: string }       // stdout contiene substring
  | { type: "output_equals"; value: string }          // stdout coincide exactamente
  | { type: "variable_equals"; name: string; value: unknown }
  | { type: "variable_type"; name: string; expectedType: string }
  | { type: "last_expr_equals"; value: unknown }
  | { type: "no_error" };
```

---

## Cómo añadir un nuevo módulo

1. Crea un archivo `src/content/modules/<nombre>.ts`:

```typescript
import type { Module } from "@/lib/types";

export const miModulo: Module = {
  id: "mi-modulo",
  title: "Mi módulo",
  level: 14, // siguiente nivel disponible
  icon: "Boxes",
  description: "Descripción corta del módulo.",
  lessons: [
    {
      id: "primera-leccion",
      title: "Primera lección",
      blocks: [
        { kind: "text", body: "Hola mundo. **Markdown** soportado." },
        { kind: "codecell", code: "print('hola')" },
      ],
    },
  ],
};
```

2. Regístralo en `src/content/modules/index.ts`:

```typescript
import { miModulo } from "./mi-modulo";
export const modules: Module[] = [
  // ...
  miModulo,
].sort((a, b) => a.level - b.level);
```

3. Recarga la página. El módulo aparecerá automáticamente en el sidebar y la pantalla de bienvenida.

---

## Cómo añadir un ejercicio

Dentro de cualquier `lessons[].blocks[]`, añade un bloque `exercise`:

```typescript
{
  kind: "exercise",
  id: "mi-ejercicio",
  prompt: "Calcula el doble de 7 y guárdalo en una variable llamada `doble`. Imprímelo.",
  starterCode: "// TODO: define doble\n",
  hints: [
    "El doble de 7 es 7 * 2.",
    "Asigna el resultado a una variable llamada `doble`.",
    "Después imprímela con print(doble).",
  ],
  solution: "doble = 7 * 2\nprint(doble)",
  check: { type: "output_contains", value: "14" },
}
```

El botón "Verificar" ejecutará el código y aplicará la verificación. Si pasa, muestra un check verde y un toast de éxito. Si no, muestra "Inténtalo de nuevo" y permite revelar pistas progresivamente.

---

## Cómo añadir un dataset

Edita `src/content/datasets.ts` y añade un CSV string:

```typescript
export const miDatasetCsv = `producto,precio
A,10
B,20
C,30
`;
```

Luego úsalo en una celda de código:

```python
import io
import pandas as pd

mi_csv = """producto,precio
A,10
B,20
C,30
"""
df = pd.read_csv(io.StringIO(mi_csv))
print(df)
```

> **Importante**: en Pyodide no hay sistema de archivos real. No uses `pd.read_csv('archivo.csv')`. Usa `pd.read_csv(io.StringIO(...))` con cadenas en memoria. El helper `csvToDataFrameLoader(varName, csv)` está disponible para facilitar esto.

---

## Cómo modificar los estilos

### Colores del tema

Edita las variables CSS en `src/app/globals.css`:

```css
:root {
  --primary: oklch(0.62 0.13 165);        /* esmeralda */
  --background: oklch(0.985 0.002 180);   /* crema muy claro */
  /* ... */
}

.dark {
  --primary: oklch(0.7 0.14 165);         /* esmeralda más brillante */
  --background: oklch(0.16 0.012 200);    /* azul oscuro casi negro */
  /* ... */
}
```

La paleta actual es **esmeralda/teal + slate** para dar sensación de "laboratorio científico". Para cambiar a otra paleta, modifica solo estas variables — todos los componentes se actualizan automáticamente.

### Tipografía

El proyecto usa Geist Sans y Geist Mono (cargados por Next.js en `layout.tsx`). Para cambiarlas:

```typescript
// src/app/layout.tsx
import { Inter, JetBrains_Mono } from "next/font/google";
const inter = Inter({ variable: "--font-geist-sans", subsets: ["latin"] });
const jetbrains = JetBrains_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
```

---

## Cómo desplegar

### Vercel (recomendado)

1. Sube el repositorio a GitHub.
2. Conéctalo en Vercel.
3. Build command: `bun run build` (o el default `next build`).
4. Output: Next.js stand-alone.
5. No requiere variables de entorno.

### Otros hosts (Netlify, Cloudflare Pages, etc.)

El proyecto es una SPA servida por Next.js. Sigue la documentación estándar de Next.js App Router para tu plataforma.

### Notas sobre Pyodide en producción

- Pyodide (~10 MB) se carga desde `https://cdn.jsdelivr.net/pyodide/v0.26.4/full/`.
- La primera carga tarda 10-30 segundos. Suele cachearse agresivamente por el navegador.
- Si necesitas servir Pyodide desde tu propio dominio, descarga los archivos y cambia `PYODIDE_INDEX_URL` en `src/lib/pyodide.ts`.
- Lo mismo aplica para sql.js: cambia `SQL_WASM_URL` y `SQL_JS_SCRIPT` en `src/lib/sql.ts`.

---

## Cómo funciona la ejecución de Python

### Arquitectura

1. Al cargar la página, se inyecta el script de Pyodide desde CDN (`<Script strategy="beforeInteractive">` en `layout.tsx`).
2. Cuando cualquier `CodeCell` se monta, llama a `ensureLoaded()` del `PyodideProvider`, que dispara la carga del motor y de los paquetes (numpy, pandas, matplotlib, scipy) — una sola vez por sesión.
3. El `PyodideProvider` expone `stage`, `ready`, `error` y `ensureLoaded` vía React Context.
4. Cuando el usuario pulsa "Ejecutar", se llama a `runPython(code)` desde `src/lib/pyodide.ts`.

### El harness Python

El archivo `src/lib/pyodide.ts` define un *harness* — un programa Python que se ejecuta dentro de Pyodide una sola vez y queda disponible para todas las celdas. El harness:

1. Mantiene un namespace persistente `_user_ns` donde se van acumulando las variables del usuario.
2. Pre-carga `numpy as np`, `pandas as pd`, `matplotlib.pyplot as plt` y `scipy` en el namespace, para que el estudiante no tenga que importarlos cada vez.
3. Redirige `sys.stdout` y `sys.stderr` a un buffer interno para capturar la salida.
4. Detecta si la última línea es una expresión y la evalúa como un REPL (para que `df` solo muestre el DataFrame sin necesidad de `print`).
5. Captura todas las figuras matplotlib activas como PNG base64.
6. Inspecciona las variables y las serializa con tipo y valor. Para `DataFrame` y `ndarray` incluye datos completos para que el visor los renderice.

El resultado se devuelve como JSON:

```json
{
  "stdout": "...",
  "stderr": "",
  "figs": ["base64png..."],
  "vars": { "df": { "type": "DataFrame", "data": [...], "columns": [...], "shape": [3, 3] } },
  "error": null,
  "last_expr": "..."
}
```

### Manejo de errores

El componente `Console` pasa cualquier `error` al `explainError()` de `src/lib/errorExplainer.ts`, que usa un conjunto de patrones regex para identificar el tipo de excepción y generar una explicación en seis secciones:

1. **Tipo de error** (KeyError, TypeError, NameError, etc.)
2. **Dónde ocurrió** (archivo:línea si está disponible)
3. **Qué esperaba Python** (operación intentada)
4. **Qué recibió** (valor actual)
5. **Por qué ocurrió** (explicación en lenguaje natural)
6. **Cómo corregirlo** (sugerencia concreta)

La traza completa queda accesible en un `<details>` plegable.

---

## Módulos disponibles

| Nivel | Módulo | Lecciones | Tema |
|---|---|---|---|
| 1 | Python desde cero | 6 | Variables, tipos, operadores, strings, control de flujo, mini-proyecto |
| 2 | Pensamiento algorítmico | 5 | Descomposición, condicionales, bucles, pseudocódigo, depuración |
| 3 | Estructuras de datos | 6 | Listas, tuplas, diccionarios, conjuntos, comprensiones |
| 4 | Funciones | 5 | Refactor, parámetros, return, abstracción |
| 5 | NumPy y Álgebra Lineal | 8 | Arrays, vectores, matrices, transformaciones, Ax=b, determinante |
| 6 | Matplotlib | 5 | Líneas, barras, histogramas, scatter, subplots |
| 7 | Pandas | 10 | Series, DataFrame, CSV, selección, filtrado, groupby, merge |
| 8 | Análisis exploratorio | 6 | head, info, describe, missing, duplicates, distribuciones |
| 9 | Estadística descriptiva | 7 | Media, mediana, varianza, percentiles, outliers, correlación |
| 10 | SQL | 7 | SELECT, WHERE, ORDER BY, GROUP BY, JOIN, equivalencias Pandas↔SQL |
| 11 | ¿Cómo trabaja un analista? | 12 | Proyecto guiado de 12 pasos sobre 500 ventas |
| 12 | Simulación | 4 | Inventario, producción, Monte Carlo |
| 13 | Proyectos industriales | 8 | Ventas, ABC, tiempos de ciclo, calidad, productividad, pronóstico, optimización, colas |

**Total: 89 lecciones** con ~200 ejercicios, retos y mini-proyectos.

---

## Pruebas y verificación

Para verificar que todo funciona:

1. `bun run lint` debe pasar sin errores.
2. `bun run dev` debe iniciar el servidor en el puerto 3000.
3. Al abrir `http://localhost:3000`, debe verse la pantalla de bienvenida con los 13 módulos.
4. Al hacer clic en cualquier módulo, deben cargarse las lecciones.
5. Al hacer clic en "Ejecutar" en cualquier celda, debe aparecer el badge "Python listo" en la barra superior y mostrarse la salida en la consola.
6. Para SQL: el badge "Cargando SQLite…" debe desaparecer y la consulta inicial debe ejecutarse automáticamente.
7. Toggle de tema: el botón sol/luna en la barra superior debe cambiar entre claro y oscuro.
8. Responsive: en viewport ≤768px, el sidebar debe ocultarse y aparecer un botón de menú hamburguesa.

---

## Próximos pasos sugeridos

La arquitectura está preparada para añadir:

- **Más visualizadores**: crear el componente en `src/components/visualizations/` y registrarlo en `VisualizerRenderer.tsx`.
- **Más datasets**: añadir CSVs en `src/content/datasets.ts`.
- **Persistencia en backend**: actualmente el progreso es solo localStorage. Si quieres sincronizar entre dispositivos, integra Prisma + NextAuth (ya están instalados) y añade endpoints API.
- **Evaluaciones con verificación más rica**: extender `CheckSpec` en `src/lib/types.ts` con verificaciones que usen AST o que comparen DataFrames.
- **Exportar cuadernos**: serializar el estado del namespace y las celdas a un archivo `.ipynb`.
- **Colaboración en tiempo real**: usar el ejemplo de WebSocket en `examples/websocket/` como base.

---

## Licencia y créditos

Plataforma educativa. Pyodide es software libre (Mozilla Public License). sql.js es software libre (MIT). Next.js, React, Tailwind CSS y shadcn/ui son software libre (MIT/Apache).

Construido para una persona Ingeniera Industrial que aprende por su cuenta.
