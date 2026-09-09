import type { Module } from "@/lib/types";

export const matplotlibModule: Module = {
  id: "matplotlib",
  title: "Matplotlib",
  level: 6,
  icon: "LineChart",
  description:
    "Visualización con matplotlib: líneas, barras, histogramas, scatter, subplots. Cada gráfico responde a una pregunta diferente.",
  lessons: [
    {
      id: "plt-plot",
      title: "Gráfico de líneas con plt.plot",
      blocks: [
        {
          kind: "text",
          title: "El gráfico más simple",
          body: "`plt.plot(x, y)` dibuja una línea que conecta los puntos (x[i], y[i]). Es la elección natural para **series temporales**: producción diaria, ventas mensuales, stock a lo largo del tiempo. La convención es importar como `import matplotlib.pyplot as plt`. Personalización básica: `plt.title(...)`, `plt.xlabel(...)`, `plt.ylabel(...)`, `plt.grid(True)`, `plt.legend()`. Para mostrar el gráfico en un script se usa `plt.show()`; en este laboratorio, al final de la celda el gráfico se captura y muestra automáticamente. Los estilos (`plt.style.use('ggplot')`) cambian la estética global. La regla: un gráfico de líneas solo tiene sentido si el eje X es una variable **ordenada** (tiempo, posición).",
        },
        {
          kind: "codecell",
          caption: "Ventas mensuales — el gráfico más simple",
          code: `import matplotlib.pyplot as plt

meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun']
ventas = [12500, 14200, 11800, 15600, 13900, 17100]

plt.figure(figsize=(8, 4))
plt.plot(meses, ventas, marker='o', color='#10b981', linewidth=2)
plt.title('Ventas mensuales (semestre)')
plt.xlabel('Mes')
plt.ylabel('Ventas (USD)')
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()`,
        },
        {
          kind: "exercise",
          id: "plot-produccion",
          prompt:
            "Grafica la producción de unidades por día. `dias = ['L','M','X','J','V','S','D']` y `unidades = [220, 245, 210, 260, 280, 190, 100]`. Usa `plt.plot` con `marker='o'`. Añade título 'Producción semanal'. Muestra con `plt.show()`.",
          starterCode: `import matplotlib.pyplot as plt

dias = ['L','M','X','J','V','S','D']
unidades = [220, 245, 210, 260, 280, 190, 100]

# TODO: plt.plot + título
`,
          hints: [
            "plt.plot(dias, unidades, marker='o').",
            "plt.title('Producción semanal') y plt.show().",
          ],
          solution: `import matplotlib.pyplot as plt
dias = ['L','M','X','J','V','S','D']
unidades = [220, 245, 210, 260, 280, 190, 100]
plt.plot(dias, unidades, marker='o')
plt.title('Producción semanal')
plt.show()`,
          check: { type: "no_error" },
        },
      ],
    },
    {
      id: "barras-hist-scatter",
      title: "Barras, histogramas y scatter",
      blocks: [
        {
          kind: "text",
          title: "Cada gráfico, una pregunta",
          body: "Los **gráficos de barras** (`plt.bar`) comparan categorías discretas: ventas por región, defectos por línea. Los **histogramas** (`plt.hist`) muestran la **distribución** de una variable continua: tiempo de ciclo, edad de clientes. El número de `bins` controla el nivel de detalle: pocos bins agrupan demasiado, muchos crean ruido. Los **scatter plots** (`plt.scatter`) revelan relaciones entre dos variables continuas: precio vs cantidad vendida, horas trabajadas vs producción. Elegir mal el tipo de gráfico es uno de los errores más comunes del análisis: un gráfico de líneas para categorías no ordenadas confunde, un histograma para una variable categórica no tiene sentido.",
        },
        {
          kind: "table",
          caption: "¿Qué gráfico para qué pregunta?",
          headers: ["Pregunta", "Tipo de gráfico", "Función"],
          rows: [
            ["¿Cómo evoluciona una variable en el tiempo?", "Líneas", "plt.plot"],
            ["¿Qué categoría tiene más/menos?", "Barras", "plt.bar"],
            ["¿Cómo se distribuye una variable?", "Histograma", "plt.hist"],
            ["¿Hay relación entre dos variables?", "Scatter", "plt.scatter"],
            ["¿Qué proporción representa cada parte?", "Pie / barras apiladas", "plt.pie / plt.bar(stacked)"],
          ],
        },
        {
          kind: "codecell",
          caption: "Los tres gráficos esenciales",
          code: `import matplotlib.pyplot as plt
import numpy as np

# 1. Barras: ventas por región
regiones = ['Norte', 'Sur', 'Este', 'Oeste']
ventas = [45000, 32000, 38000, 29000]

plt.figure(figsize=(8, 3))
plt.bar(regiones, ventas, color='#10b981')
plt.title('Ventas por región')
plt.ylabel('USD')
plt.show()

# 2. Histograma: distribución de tiempos de ciclo
np.random.seed(0)
tiempos = np.random.normal(loc=6.5, scale=1.2, size=200)

plt.figure(figsize=(8, 3))
plt.hist(tiempos, bins=20, color='#0d9488', edgecolor='white')
plt.title('Distribución de tiempos de ciclo (min)')
plt.xlabel('Tiempo')
plt.ylabel('Frecuencia')
plt.show()

# 3. Scatter: precio vs cantidad
precio = np.array([5, 8, 12, 15, 20, 25, 30])
cantidad = np.array([400, 320, 250, 180, 150, 90, 60])

plt.figure(figsize=(8, 3))
plt.scatter(precio, cantidad, s=80, color='#f59e0b')
plt.title('Precio vs cantidad vendida')
plt.xlabel('Precio (USD)')
plt.ylabel('Cantidad')
plt.grid(True, alpha=0.3)
plt.show()`,
        },
      ],
    },
    {
      id: "ejes-titulos-leyendas",
      title: "Ejes, títulos, etiquetas y leyendas",
      blocks: [
        {
          kind: "text",
          title: "Comunicar, no solo dibujar",
          body: "Un gráfico sin etiquetas es inútil: el lector no sabe qué representan los ejes. Las reglas básicas: **(1)** cada gráfico tiene título; **(2)** cada eje tiene su etiqueta con unidades; **(3)** si hay varias series, una leyenda las identifica; **(4)** usa `plt.xticks(rotation=45)` si las etiquetas se solapan; **(5)** ajusta límites con `plt.xlim()` y `plt.ylim()` para no distorsionar. Para múltiples series, llama a `plt.plot` varias veces y `plt.legend(['serie A', 'serie B'])` añade la leyenda. Las escalas logarítmicas (`plt.xscale('log')`) son útiles para datos que abarcan varios órdenes de magnitud.",
        },
        {
          kind: "codecell",
          caption: "Comparativa de dos años con leyenda",
          code: `import matplotlib.pyplot as plt
import numpy as np

meses = ['Ene','Feb','Mar','Abr','May','Jun']
ventas_2023 = [120, 135, 128, 142, 150, 138]
ventas_2024 = [145, 158, 162, 175, 168, 190]

plt.figure(figsize=(9, 4))
plt.plot(meses, ventas_2023, marker='o', label='2023', color='#94a3b8')
plt.plot(meses, ventas_2024, marker='s', label='2024', color='#10b981', linewidth=2)
plt.title('Comparativa de ventas: 2023 vs 2024 (miles USD)')
plt.xlabel('Mes')
plt.ylabel('Ventas (k USD)')
plt.xticks(rotation=15)
plt.legend(loc='lower right')
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()`,
        },
      ],
    },
    {
      id: "subplots",
      title: "Subplots: múltiples gráficos en una figura",
      blocks: [
        {
          kind: "text",
          title: "Paneles para comparar",
          body: "Los subplots permiten colocar varios gráficos en una sola figura, organizados en una cuadrícula. La forma más directa es `fig, axes = plt.subplots(nrows, ncols, figsize=(w, h))`, que devuelve la figura y un array de ejes. Accedes a cada eje con `axes[i]` (1D) o `axes[i, j]` (2D). Los subplots son útiles para comparar variables lado a lado, mostrar una vista general + un detalle, o construir un dashboard. `plt.tight_layout()` ajusta automáticamente los espacios para que no se solapen títulos y etiquetas.",
        },
        {
          kind: "codecell",
          caption: "Subplot 2x2 con 4 tipos de gráfico",
          code: `import matplotlib.pyplot as plt
import numpy as np

np.random.seed(7)
x = np.linspace(0, 10, 50)
y = np.sin(x) * 50 + 100
cat = ['A','B','C','D']
vals = [25, 40, 15, 20]

fig, axes = plt.subplots(2, 2, figsize=(10, 6))

# (0,0) línea
axes[0, 0].plot(x, y, color='#10b981')
axes[0, 0].set_title('Producción diaria')
axes[0, 0].set_xlabel('Día')
axes[0, 0].grid(True, alpha=0.3)

# (0,1) barras
axes[0, 1].bar(cat, vals, color='#0d9488')
axes[0, 1].set_title('Ventas por categoría')

# (1,0) histograma
data = np.random.normal(50, 10, 200)
axes[1, 0].hist(data, bins=15, color='#f59e0b', edgecolor='white')
axes[1, 0].set_title('Distribución de tiempos')

# (1,1) scatter
xs = np.random.uniform(0, 100, 50)
ys = xs + np.random.normal(0, 8, 50)
axes[1, 1].scatter(xs, ys, color='#ef4444', alpha=0.6)
axes[1, 1].set_title('Relación precio-cantidad')

plt.tight_layout()
plt.show()`,
        },
      ],
    },
    {
      id: "mini-dashboard",
      title: "Mini-proyecto: Dashboard visual de producción",
      blocks: [
        {
          kind: "text",
          title: "Un dashboard responde 3 preguntas a la vez",
          body: "Un dashboard combina varios gráficos coordinados para que el gerente entienda el estado del proceso de un vistazo. Para producción mensual, tres preguntas típicas: **(1)** ¿Cómo evolucionó la producción total? (línea temporal). **(2)** ¿Qué línea produce más? (barras por línea). **(3)** ¿Cuánto varían los tiempos de ciclo? (histograma). Usaremos subplots para colocar los tres en una figura, con títulos claros y unidades.",
        },
        {
          kind: "codecell",
          caption: "Dashboard de producción mensual",
          code: `import matplotlib.pyplot as plt
import numpy as np

np.random.seed(42)
meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
linea1 = np.random.normal(1000, 100, 12)
linea2 = np.random.normal(1200, 120, 12)
linea3 = np.random.normal(800, 80, 12)

tiempos_ciclo = np.concatenate([np.random.normal(6, 1, 200), np.random.normal(8, 1.5, 100)])

fig, axes = plt.subplots(2, 2, figsize=(12, 7))

# (1) Evolución temporal — total
total = linea1 + linea2 + linea3
axes[0, 0].plot(meses, total, marker='o', color='#10b981', linewidth=2)
axes[0, 0].set_title('Producción total mensual')
axes[0, 0].set_ylabel('Unidades')
axes[0, 0].tick_params(axis='x', rotation=45)
axes[0, 0].grid(True, alpha=0.3)

# (2) Producción por línea (barras)
axes[0, 1].bar(['L1','L2','L3'], [linea1.mean(), linea2.mean(), linea3.mean()],
               color=['#10b981','#0d9488','#14b8a6'])
axes[0, 1].set_title('Producción media por línea')
axes[0, 1].set_ylabel('Unidades medias')

# (3) Histograma de tiempos de ciclo
axes[1, 0].hist(tiempos_ciclo, bins=25, color='#f59e0b', edgecolor='white')
axes[1, 0].axvline(np.mean(tiempos_ciclo), color='red', linestyle='--', label=f'media={np.mean(tiempos_ciclo):.2f}')
axes[1, 0].set_title('Distribución de tiempos de ciclo (min)')
axes[1, 0].set_xlabel('Minutos')
axes[1, 0].legend()

# (4) Comparativa líneas
axes[1, 1].plot(meses, linea1, label='L1', marker='.')
axes[1, 1].plot(meses, linea2, label='L2', marker='.')
axes[1, 1].plot(meses, linea3, label='L3', marker='.')
axes[1, 1].set_title('Producción por línea y mes')
axes[1, 1].tick_params(axis='x', rotation=45)
axes[1, 1].legend()
axes[1, 1].grid(True, alpha=0.3)

plt.tight_layout()
plt.show()`,
        },
        {
          kind: "challenge",
          id: "dashboard-variante",
          context:
            "Tienes la siguiente data: defectos por día para 30 días (`np.random.poisson(5, 30)`).",
          objetivo:
            "Construye una figura con dos subplots: (1) barras con los defectos por día, (2) una línea horizontal roja mostrando la media. Título general 'Defectos diarios (30 días)'.",
          hints: [
            "Genera los datos: `defectos = np.random.poisson(5, 30)`.",
            "Usa `fig, axes = plt.subplots(1, 2, figsize=(10, 4))`.",
            "Para la media: `axes[1].axhline(defectos.mean(), color='red', linestyle='--')`.",
          ],
          solution: `import matplotlib.pyplot as plt
import numpy as np
np.random.seed(1)
defectos = np.random.poisson(5, 30)
fig, axes = plt.subplots(1, 2, figsize=(10, 4))
axes[0].bar(range(1, 31), defectos, color='#10b981')
axes[0].set_title('Defectos por día')
axes[0].axhline(defectos.mean(), color='red', linestyle='--', label=f'media={defectos.mean():.2f}')
axes[0].legend()
axes[1].hist(defectos, bins=10, color='#0d9488', edgecolor='white')
axes[1].set_title('Distribución de defectos')
plt.tight_layout()
plt.show()`,
        },
      ],
    },
  ],
};
