import type { Module } from "@/lib/types";
import { analistaDatasetCsv, produccionDatasetCsv, inventarioDatasetCsv } from "@/content/datasets";

const ANA_CSV = `ana_csv = """${analistaDatasetCsv.replace(/"""/g, '\\"\\"\\"')}"""`;
const PROD_CSV = `prod_csv = """${produccionDatasetCsv.replace(/"""/g, '\\"\\"\\"')}"""`;
const INV_CSV = `inv_csv = """${inventarioDatasetCsv.replace(/"""/g, '\\"\\"\\"')}"""`;

export const industrialProjects: Module = {
  id: "industrial-projects",
  title: "Proyectos industriales",
  level: 13,
  icon: "Factory",
  description:
    "Ocho proyectos aplicados: ventas, inventario (ABC), tiempos de ciclo, calidad (Pareto), productividad, pronóstico, optimización y colas.",
  lessons: [
    {
      id: "p1-ventas",
      title: "P1: Análisis de ventas",
      blocks: [
        {
          kind: "miniproject",
          id: "p1-ventas",
          title: "Análisis de ventas por categoría y canal",
          context:
            "Reutilizas el dataset de 500 ventas. El director comercial quiere saber qué categorías y canales son más rentables, y dónde están las oportunidades de crecimiento.",
          objetivo:
            "Generar un dashboard con: (1) ranking de categorías por utilidad, (2) ranking de canales por ticket promedio, (3) evolución mensual.",
          dataset: ANA_CSV,
          checklist: [
            "Cargar el dataset y crear columna utilidad",
            "Calcular ranking de categorías por utilidad total",
            "Calcular ticket promedio por canal",
            "Construir dashboard de 3 gráficos",
            "Escribir 3 conclusiones accionables",
          ],
          starterCode: `import pandas as pd
import matplotlib.pyplot as plt
import io

${ANA_CSV}

df = pd.read_csv(io.StringIO(ana_csv))
df['utilidad'] = (df['precio'] - df['costo']) * df['cantidad']

# TODO: completa el análisis y el dashboard
`,
          hints: [
            "Para ranking: `df.groupby('categoria')['utilidad'].sum().sort_values(ascending=False)`.",
            "Ticket promedio por canal: `df.groupby('canal')['precio'].mean()` o similar.",
            "Para evolución mensual convierte fecha a datetime primero.",
          ],
          solution: `import pandas as pd
import matplotlib.pyplot as plt
import io
${ANA_CSV}
df = pd.read_csv(io.StringIO(ana_csv))
df['utilidad'] = (df['precio'] - df['costo']) * df['cantidad']
df['fecha'] = pd.to_datetime(df['fecha'])

fig, axes = plt.subplots(1, 3, figsize=(15, 4))
df.groupby('categoria')['utilidad'].sum().sort_values().plot(kind='barh', ax=axes[0], color='#10b981')
axes[0].set_title('Utilidad por categoría')
df.groupby('canal')['precio'].mean().plot(kind='bar', ax=axes[1], color='#0d9488')
axes[1].set_title('Ticket promedio por canal')
df.groupby(df['fecha'].dt.to_period('M'))['utilidad'].sum().plot(ax=axes[2], color='#f59e0b')
axes[2].set_title('Evolución mensual')
plt.tight_layout()
plt.show()`,
        },
      ],
    },
    {
      id: "p2-inventario-abc",
      title: "P2: Control de inventario (ABC)",
      blocks: [
        {
          kind: "miniproject",
          id: "p2-abc",
          title: "Análisis ABC del inventario",
          context:
            "El análisis ABC clasifica los productos por su contribución al valor total del inventario: A (top 20% de productos que acumulan ~80% del valor), B (siguientes 30%, ~15% del valor) y C (últimos 50%, ~5% del valor). Permite aplicar gestión diferenciada: control estricto a A, control moderado a B, control ligero a C.",
          objetivo:
            "Clasificar los 50 productos del inventario en A, B y C según su valor anual (costo × demanda_anual). Imprimir el conteo por clase y graficar la curva ABC.",
          dataset: INV_CSV,
          checklist: [
            "Cargar el dataset de inventario (50 SKUs)",
            "Calcular valor anual = costo × demanda_anual",
            "Ordenar de mayor a menor valor y acumular %",
            "Asignar clase A/B/C según umbrales 80%/95%",
            "Graficar la curva ABC",
          ],
          starterCode: `import pandas as pd
import matplotlib.pyplot as plt
import io

${INV_CSV}

df = pd.read_csv(io.StringIO(inv_csv))
df['valor_anual'] = df['costo'] * df['demanda_anual']

# TODO: ordena, acumula % y asigna clase ABC
`,
          hints: [
            "`df = df.sort_values('valor_anual', ascending=False)`.",
            "`df['pct_acum'] = df['valor_anual'].cumsum() / df['valor_anual'].sum() * 100`.",
            "Asigna A si pct_acum <= 80, B si <= 95, C si no.",
          ],
          solution: `import pandas as pd
import matplotlib.pyplot as plt
import io
${INV_CSV}
df = pd.read_csv(io.StringIO(inv_csv))
df['valor_anual'] = df['costo'] * df['demanda_anual']
df = df.sort_values('valor_anual', ascending=False).reset_index(drop=True)
df['pct_acum'] = df['valor_anual'].cumsum() / df['valor_anual'].sum() * 100
df['clase'] = pd.cut(df['pct_acum'], bins=[-1, 80, 95, 101], labels=['A', 'B', 'C'])
print(df['clase'].value_counts())
plt.figure(figsize=(9, 4))
plt.plot(df.index + 1, df['pct_acum'], marker='o', color='#10b981')
plt.axhline(80, color='red', linestyle='--', label='80%')
plt.axhline(95, color='orange', linestyle='--', label='95%')
plt.title('Curva ABC')
plt.xlabel('Productos (ordenados por valor)')
plt.ylabel('% acumulado')
plt.legend()
plt.tight_layout()
plt.show()`,
        },
      ],
    },
    {
      id: "p3-tiempos-ciclo",
      title: "P3: Tiempos de ciclo y takt time",
      blocks: [
        {
          kind: "miniproject",
          id: "p3-takt",
          title: "Análisis de tiempos de ciclo vs takt time",
          context:
            "El **takt time** es el ritmo al que debes producir para satisfacer la demanda: takt = tiempo disponible / demanda. Si tu tiempo de ciclo medio supera el takt, no llegarás a cubrir la demanda. Analizar la variabilidad del tiempo de ciclo te dice qué tan estable es el proceso.",
          objetivo:
            "Con el dataset de producción (100 filas), calcular el takt time (asumiendo 8h disponibles y demanda media), identificar qué líneas superan el takt y graficar la distribución de tiempos.",
          dataset: PROD_CSV,
          checklist: [
            "Cargar el dataset de producción",
            "Calcular takt time = 8h / demanda_media_unidades",
            "Identificar registros donde tiempo_ciclo > takt",
            "Comparar distribución de tiempos por línea",
            "Visualizar histograma + líneas de takt",
          ],
          starterCode: `import pandas as pd
import matplotlib.pyplot as plt
import io

${PROD_CSV}

df = pd.read_csv(io.StringIO(prod_csv))

# TODO: calcular takt y comparar
`,
          hints: [
            "Demanda media ≈ df['unidades'].mean(). Takt = 8*60 / demanda_media (minutos por unidad).",
            "Filtra `df[df['tiempo_ciclo'] > takt]` para ver incumplimientos.",
          ],
          solution: `import pandas as pd
import matplotlib.pyplot as plt
import io
${PROD_CSV}
df = pd.read_csv(io.StringIO(prod_csv))
demanda_media = df['unidades'].mean()
takt = 8 * 60 / demanda_media
print(f"Takt time: {takt:.2f} min/unidad")
incumple = df[df['tiempo_ciclo'] > takt]
print(f"Registros que superan takt: {len(incumple)} de {len(df)}")
plt.figure(figsize=(9, 4))
for linea in df['linea'].unique():
    sub = df[df['linea'] == linea]
    plt.hist(sub['tiempo_ciclo'], bins=15, alpha=0.5, label=linea)
plt.axvline(takt, color='red', linestyle='--', label=f'takt={takt:.2f}')
plt.title('Distribución de tiempos de ciclo por línea')
plt.xlabel('Tiempo de ciclo (min)')
plt.legend()
plt.tight_layout()
plt.show()`,
        },
      ],
    },
    {
      id: "p4-calidad-pareto",
      title: "P4: Calidad — Pareto y defectos",
      blocks: [
        {
          kind: "miniproject",
          id: "p4-pareto",
          title: "Diagrama de Pareto de defectos",
          context:
            "El **diagrama de Pareto** muestra los defectos ordenados por frecuencia. Sigue la regla 80/20: unos pocos tipos de defecto suelen explicar la mayoría de los casos. Concentrar la mejora en esos pocos 'vitales' tiene más impacto que atacar los 'triviales' muchos.",
          objetivo:
            "Construir un diagrama de Pareto con la columna `defectos` del dataset de producción.",
          dataset: PROD_CSV,
          checklist: [
            "Agrupar defectos por línea o por fecha",
            "Ordenar descendente y acumular %",
            "Construir barras + línea de % acumulado",
            "Identificar el '80% vital'",
          ],
          starterCode: `import pandas as pd
import matplotlib.pyplot as plt
import io

${PROD_CSV}

df = pd.read_csv(io.StringIO(prod_csv))

# TODO: agrupa por línea, suma defectos, ordena
`,
          hints: [
            "Agrupa: `g = df.groupby('linea')['defectos'].sum().sort_values(ascending=False)`.",
            "Calcula `pct = g / g.sum() * 100` y `acum = pct.cumsum()`.",
            "Dibuja barras para g y una línea secundaria para acum (eje derecho).",
          ],
          solution: `import pandas as pd
import matplotlib.pyplot as plt
import io
${PROD_CSV}
df = pd.read_csv(io.StringIO(prod_csv))
g = df.groupby('linea')['defectos'].sum().sort_values(ascending=False)
acum = g.cumsum() / g.sum() * 100
fig, ax1 = plt.subplots(figsize=(9, 4))
ax1.bar(g.index, g.values, color='#10b981')
ax1.set_ylabel('Defectos totales')
ax2 = ax1.twinx()
ax2.plot(g.index, acum.values, color='#ef4444', marker='o', label='% acumulado')
ax2.axhline(80, color='gray', linestyle='--', alpha=0.5)
ax2.set_ylabel('% acumulado')
plt.title('Diagrama de Pareto de defectos por línea')
plt.tight_layout()
plt.show()`,
        },
      ],
    },
    {
      id: "p5-productividad",
      title: "P5: Productividad",
      blocks: [
        {
          kind: "miniproject",
          id: "p5-prod",
          title: "Análisis de productividad",
          context:
            "La productividad = output / input. Una medida común: unidades producidas por hora. Analizar su tendencia y variabilidad revela si el proceso mejora o se degrada, y dónde están los huecos.",
          objetivo:
            "Calcular productividad (unidades/hora) por fecha y por línea, e identificar tendencias.",
          dataset: PROD_CSV,
          checklist: [
            "Calcular productividad = unidades / 8 (horas/día)",
            "Calcular media y desviación por línea",
            "Visualizar tendencia temporal",
            "Identificar la línea más y menos productiva",
          ],
          starterCode: `import pandas as pd
import matplotlib.pyplot as plt
import io

${PROD_CSV}

df = pd.read_csv(io.StringIO(prod_csv))

# TODO: calcula productividad = unidades / 8
`,
          hints: [
            "Productividad diaria: `df['productividad'] = df['unidades'] / 8`.",
            "Agrupa por línea y fecha.",
          ],
          solution: `import pandas as pd
import matplotlib.pyplot as plt
import io
${PROD_CSV}
df = pd.read_csv(io.StringIO(prod_csv))
df['productividad'] = df['unidades'] / 8
print(df.groupby('linea')['productividad'].agg(['mean', 'std']))
plt.figure(figsize=(10, 4))
for l in df['linea'].unique():
    sub = df[df['linea'] == l].sort_values('fecha')
    plt.plot(sub['fecha'], sub['productividad'], marker='o', label=l)
plt.title('Productividad (unidades/hora) por línea')
plt.xticks(rotation=45)
plt.legend()
plt.tight_layout()
plt.show()`,
        },
      ],
    },
    {
      id: "p6-pronostico",
      title: "P6: Pronóstico básico de demanda",
      blocks: [
        {
          kind: "miniproject",
          id: "p6-forecast",
          title: "Pronóstico con media móvil y suavizado exponencial",
          context:
            "El **pronóstico de demanda** es esencial para planificar inventario y producción. Métodos simples: **media móvil** (promediar los últimos N periodos) y **suavizado exponencial** (media ponderada que da más peso a datos recientes).",
          objetivo:
            "Aplicar ambos métodos a la serie de ventas del dataset analista (agrupada por mes) y comparar visualmente.",
          dataset: ANA_CSV,
          checklist: [
            "Agrupar ventas por mes",
            "Aplicar media móvil de 3 meses",
            "Aplicar suavizado exponencial (alpha=0.3)",
            "Graficar serie original + ambos pronósticos",
          ],
          starterCode: `import pandas as pd
import matplotlib.pyplot as plt
import io

${ANA_CSV}

df = pd.read_csv(io.StringIO(ana_csv))
df['fecha'] = pd.to_datetime(df['fecha'])
serie = df.groupby(df['fecha'].dt.to_period('M'))['cantidad'].sum()

# TODO: media móvil y suavizado exponencial
`,
          hints: [
            "Media móvil: `serie.rolling(3).mean()`.",
            "Suavizado exponencial: `serie.ewm(alpha=0.3).mean()`.",
          ],
          solution: `import pandas as pd
import matplotlib.pyplot as plt
import io
${ANA_CSV}
df = pd.read_csv(io.StringIO(ana_csv))
df['fecha'] = pd.to_datetime(df['fecha'])
serie = df.groupby(df['fecha'].dt.to_period('M'))['cantidad'].sum()
ma = serie.rolling(3).mean()
exp = serie.ewm(alpha=0.3).mean()
plt.figure(figsize=(10, 4))
serie.plot(label='Real', marker='o', color='#94a3b8')
ma.plot(label='Media móvil (3m)', color='#10b981')
exp.plot(label='Suavizado exp (α=0.3)', color='#f59e0b')
plt.title('Pronóstico de demanda')
plt.legend()
plt.tight_layout()
plt.show()`,
        },
      ],
    },
    {
      id: "p7-optimizacion",
      title: "P7: Optimización con scipy",
      blocks: [
        {
          kind: "miniproject",
          id: "p7-lp",
          title: "Programación lineal con scipy.optimize.linprog",
          context:
            "La **programación lineal** resuelve problemas de optimización con función objetivo lineal y restricciones lineales. Caso: una fábrica produce 2 productos A y B. A requiere 2 h de máquina y 1 h de mano de obra; B requiere 1 h de máquina y 2 h de mano de obra. Dispones de 100 h-máquina y 80 h-mano de obra. A da 30 USD de utilidad, B da 20 USD. ¿Cuántas unidades de cada uno producir para maximizar utilidad?",
          objetivo:
            "Plantear el problema como: maximizar 30·A + 20·B sujeto a 2·A + 1·B ≤ 100, 1·A + 2·B ≤ 80, A,B ≥ 0. Resolver con `scipy.optimize.linprog` (que minimiza, así que invierte el signo).",
          checklist: [
            "Definir vector de costos c (negativo de utilidad)",
            "Definir matriz A_ub y vector b_ub de restricciones",
            "Llamar a scipy.optimize.linprog",
            "Interpretar la solución óptima",
          ],
          starterCode: `import numpy as np
from scipy.optimize import linprog

# Maximizar 30*A + 20*B  ->  minimizar -30*A - 20*B
c = [-30, -20]

# Restricciones: A_ub @ x <= b_ub
A_ub = [
    [2, 1],   # 2A + 1B <= 100 (máquina)
    [1, 2],   # 1A + 2B <= 80 (mano de obra)
]
b_ub = [100, 80]

# TODO: llama a linprog
`,
          hints: [
            "`res = linprog(c, A_ub=A_ub, b_ub=b_ub, bounds=[(0, None), (0, None)])`.",
            "Solución óptima: A=40, B=20 → utilidad 1600.",
          ],
          solution: `import numpy as np
from scipy.optimize import linprog
c = [-30, -20]
A_ub = [[2, 1], [1, 2]]
b_ub = [100, 80]
res = linprog(c, A_ub=A_ub, b_ub=b_ub, bounds=[(0, None), (0, None)])
print(f"A óptimo: {res.x[0]:.1f}, B óptimo: {res.x[1]:.1f}")
print(f"Utilidad máxima: {-res.fun:.1f}")`,
        },
      ],
    },
    {
      id: "p8-colas",
      title: "P8: Simulación de cola M/M/1",
      blocks: [
        {
          kind: "miniproject",
          id: "p8-mm1",
          title: "Simulación de cola M/M/1",
          context:
            "Una cola M/M/1 tiene llegadas Poisson ( tasa λ) y servicio exponencial (tasa μ), un solo servidor. Es el modelo clásico de teoría de colas. Fórmulas teóricas: utilización ρ = λ/μ, longitud media de cola Lq = ρ²/(1-ρ), tiempo medio en sistema W = 1/(μ-λ).",
          objetivo:
            "Simular 1000 llegadas y servicios, calcular la utilización y el tiempo medio en sistema, y comparar con la fórmula teórica.",
          checklist: [
            "Definir λ (llegadas/hora) y μ (servicios/hora)",
            "Generar tiempos entre llegadas y de servicio exponenciales",
            "Simular la cola evento a evento",
            "Calcular métricas y comparar con teoría",
          ],
          starterCode: `import numpy as np

np.random.seed(0)
n = 1000
lambd = 4   # llegadas/hora
mu = 5      # servicios/hora

# TODO: genera tiempos y simula
`,
          hints: [
            "Tiempos entre llegadas: `np.random.exponential(1/lambd, n)`.",
            "Tiempos de servicio: `np.random.exponential(1/mu, n)`.",
            "Recorre: llegada_actual + tiempo_llegada[i]; si servidor libre antes, empieza servicio, suma espera.",
          ],
          solution: `import numpy as np
np.random.seed(0)
n = 1000
lambd, mu = 4, 5
t_entre_llegadas = np.random.exponential(1/lambd, n)
t_servicio = np.random.exponential(1/mu, n)
t_llegada = np.cumsum(t_entre_llegadas)
t_fin_servicio_anterior = 0
t_esperas = []
for i in range(n):
    inicio_servicio = max(t_llegada[i], t_fin_servicio_anterior)
    t_fin_servicio_anterior = inicio_servicio + t_servicio[i]
    t_esperas.append(inicio_servicio - t_llegada[i])
t_esperas = np.array(t_esperas)
rho = lambd/mu
W_teorico = 1/(mu - lambd)
W_sim = (t_esperas.mean() + 1/mu)
print(f"Utilización ρ: {rho:.3f} (teórico)")
print(f"Tiempo medio en sistema W (simulado): {W_sim:.3f}")
print(f"Tiempo medio en sistema W (teórico)  : {W_teorico:.3f}")`,
        },
      ],
    },
  ],
};
