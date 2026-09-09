import type { Module } from "@/lib/types";

export const statisticsModule: Module = {
  id: "statistics",
  title: "Estadística descriptiva",
  level: 9,
  icon: "Sigma",
  description:
    "Media, mediana, varianza, percentiles, distribuciones, outliers, correlación. El lenguaje cuantitativo del analista.",
  lessons: [
    {
      id: "media-mediana-moda",
      title: "Media, mediana y moda",
      blocks: [
        {
          kind: "text",
          title: "¿Cuál usar y cuándo?",
          body: "Las tres miden la **tendencia central** (el valor 'típico' de un conjunto), pero cuentan cosas distintas. La **media** es el promedio aritmético; sensible a valores extremos. La **mediana** es el valor central cuando ordenas los datos; robusta a outliers. La **moda** es el valor más frecuente; útil para categóricas. Regla práctica: si los datos son **simétricos**, media ≈ mediana. Si hay **outliers o asimetría**, la mediana es más representativa. El ejemplo clásico: el salario medio de 9 empleados que ganan 3000 y un CEO que gana 300 000 es 32 700 — totalmente engañoso. La mediana (3000) refleja mejor al 'empleado típico'.",
        },
        {
          kind: "visualization",
          component: "DistributionVisualizer",
          props: { initialBins: 12, initialSkew: 0.5 },
        },
        {
          kind: "concept",
          problema: "Comparar la productividad media y mediana de 6 operarios, donde uno es una superestrella.",
          idea: "Cuando hay outliers, la mediana es más representativa que la media.",
          codigo: `import numpy as np

produccion = np.array([180, 175, 190, 185, 170, 950])  # 950 = outlier

media = np.mean(produccion)
mediana = np.median(produccion)

print(f"Media   : {media:.1f}")
print(f"Mediana : {mediana:.1f}")
print(f"Sin outlier, media sería: {np.mean(produccion[:-1]):.1f}")`,
          interpretacion:
            "La media (310) es totalmente engañosa: el 83% de los operarios produce menos de 200. La mediana (182.5) sí representa al operario típico. Cuando un único valor distorsiona tanto la media, sospecha de outliers. Por eso, en reportes de salarios, tiempos de espera o productividad industrial, los analistas prefieren la mediana.",
        },
        {
          kind: "exercise",
          id: "media-vs-mediana",
          prompt:
            "Calcula media y mediana de `salarios = [2500, 2700, 2400, 2600, 3000, 50000]`. Imprime ambos valores con dos decimales. ¿Cuál es más representativa del salario típico?",
          starterCode: `import numpy as np

salarios = [2500, 2700, 2400, 2600, 3000, 50000]

media = 
mediana = 

print(media)
print(mediana)`,
          hints: [
            "Usa `np.mean(salarios)` y `np.median(salarios)`.",
            "Media ≈ 10533 (distorsionada por 50000); mediana = 2600 (más representativa).",
          ],
          solution: `import numpy as np
salarios = [2500, 2700, 2400, 2600, 3000, 50000]
media = np.mean(salarios)
mediana = np.median(salarios)
print(media)
print(mediana)`,
          check: { type: "output_contains", value: "2600" },
        },
      ],
    },
    {
      id: "varianza-desviacion",
      title: "Rango, varianza y desviación estándar",
      blocks: [
        {
          kind: "text",
          title: "Medir la dispersión",
          body: "La tendencia central no basta: dos procesos pueden tener la misma media pero variabilidad muy distinta. Las medidas de **dispersión** son: **rango** (max - min, sensible a outliers), **varianza** (promedio de los cuadrados de las desviaciones), **desviación estándar** (raíz cuadrada de la varianza, en las mismas unidades que los datos, más interpretable) y el **coeficiente de variación** (CV = std/mean × 100, compara dispersión entre procesos de media distinta). En ingeniería industrial, un proceso con CV < 5% se considera estable; > 15% es variable y requiere control. Una desviación estándar de 2.5 min en un tiempo de ciclo de media 6 min indica un proceso bastante variable.",
        },
        {
          kind: "codecell",
          caption: "Comparar dispersión de dos líneas",
          code: `import numpy as np

# Tiempos de ciclo (min) de dos líneas
linea_a = np.array([6.0, 6.1, 5.9, 6.0, 6.2, 5.8, 6.1, 6.0])  # estable
linea_b = np.array([5.5, 7.0, 4.8, 6.5, 5.0, 7.2, 5.3, 6.8])    # variable

print("=== Línea A (estable) ===")
print(f"  Media    : {linea_a.mean():.2f}")
print(f"  Std      : {linea_a.std():.2f}")
print(f"  Rango    : {linea_a.max() - linea_a.min():.2f}")
print(f"  CV (%)   : {linea_a.std()/linea_a.mean()*100:.2f}")

print("\\n=== Línea B (variable) ===")
print(f"  Media    : {linea_b.mean():.2f}")
print(f"  Std      : {linea_b.std():.2f}")
print(f"  Rango    : {linea_b.max() - linea_b.min():.2f}")
print(f"  CV (%)   : {linea_b.std()/linea_b.mean()*100:.2f}")`,
        },
        {
          kind: "exercise",
          id: "calcular-cv",
          prompt:
            "Calcula el coeficiente de variación (CV%) de `produccion = [100, 105, 98, 110, 102, 95, 108]`. CV = std/mean*100. Imprime con 2 decimales.",
          starterCode: `import numpy as np

produccion = [100, 105, 98, 110, 102, 95, 108]

cv = 

print(cv)`,
          hints: [
            "Calcula `cv = np.std(produccion)/np.mean(produccion)*100`.",
            "El resultado debe rondar 5.30%.",
          ],
          solution: `import numpy as np
produccion = [100, 105, 98, 110, 102, 95, 108]
cv = np.std(produccion)/np.mean(produccion)*100
print(cv)`,
          check: { type: "no_error" },
        },
      ],
    },
    {
      id: "percentiles-boxplot",
      title: "Percentiles, cuartiles y boxplot",
      blocks: [
        {
          kind: "text",
          title: "Más allá de la media",
          body: "Los **percentiles** dividen los datos ordenados en 100 partes iguales. El percentil 50 es la mediana. Los **cuartiles** Q1 (25%), Q2 (50%) y Q3 (75%) dividen en cuatro partes. `np.percentile(x, [25, 50, 75])` los calcula. El **rango intercuartílico (IQR)** = Q3 - Q1 mide la dispersión del 50% central, robusto a outliers. El **boxplot** visualiza todo esto de un golpe: la caja es el IQR (Q1-Q3), la línea interior es la mediana, los bigotes llegan a 1.5×IQR, y los puntos por fuera son outliers. Es el gráfico más informativo para comparar distribuciones entre grupos.",
        },
        {
          kind: "codecell",
          caption: "Cuartiles e IQR con boxplot",
          code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(0)
tiempos_a = np.random.normal(6, 0.5, 100)
tiempos_b = np.random.normal(7, 1.5, 100)

print("Cuartiles Línea A:", np.percentile(tiempos_a, [25, 50, 75]))
print("Cuartiles Línea B:", np.percentile(tiempos_b, [25, 50, 75]))

iqr_a = np.percentile(tiempos_a, 75) - np.percentile(tiempos_a, 25)
iqr_b = np.percentile(tiempos_b, 75) - np.percentile(tiempos_b, 25)
print(f"IQR A: {iqr_a:.2f} | IQR B: {iqr_b:.2f}")

plt.figure(figsize=(6, 4))
plt.boxplot([tiempos_a, tiempos_b], labels=['Línea A', 'Línea B'])
plt.title('Distribución de tiempos de ciclo')
plt.ylabel('Minutos')
plt.grid(True, alpha=0.3)
plt.show()`,
        },
      ],
    },
    {
      id: "distribuciones",
      title: "Distribuciones: simetría y asimetría",
      blocks: [
        {
          kind: "text",
          title: "Forma de los datos",
          body: "Una distribución es **simétrica** si los datos se reparten igual a ambos lados de la media (la normal es el ejemplo canónico). Es **asimétrica a la derecha** (positive skew) si tiene cola larga hacia valores altos (típicamente: ingresos, tiempos de espera, demanda). Es **asimétrica a la izquierda** si la cola va hacia valores bajos. La asimetría tiene consecuencias analíticas: en distribuciones muy asimétricas, la media se separa de la mediana y pierde representatividad. Visualmente: `plt.hist` revela la forma de un vistazo.",
        },
        {
          kind: "codecell",
          caption: "Comparar distribuciones simétrica y asimétrica",
          code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(1)
sim = np.random.normal(50, 10, 1000)           # simétrica
asim = np.random.exponential(scale=20, size=1000)  # asimétrica derecha

fig, axes = plt.subplots(1, 2, figsize=(10, 4))

axes[0].hist(sim, bins=30, color='#10b981', edgecolor='white')
axes[0].axvline(np.mean(sim), color='red', linestyle='--', label=f'media={np.mean(sim):.1f}')
axes[0].axvline(np.median(sim), color='blue', linestyle='--', label=f'mediana={np.median(sim):.1f}')
axes[0].set_title('Distribución simétrica')
axes[0].legend()

axes[1].hist(asim, bins=30, color='#f59e0b', edgecolor='white')
axes[1].axvline(np.mean(asim), color='red', linestyle='--', label=f'media={np.mean(asim):.1f}')
axes[1].axvline(np.median(asim), color='blue', linestyle='--', label=f'mediana={np.median(asim):.1f}')
axes[1].set_title('Distribución asimétrica a la derecha')
axes[1].legend()

plt.tight_layout()
plt.show()`,
        },
      ],
    },
    {
      id: "outliers",
      title: "Detección de outliers",
      blocks: [
        {
          kind: "text",
          title: "Método IQR y z-score",
          body: "Un **outlier** es un valor anómalamente alejado del resto. Hay dos métodos estándar para detectarlos: **(1) método IQR**: un valor es outlier si está por debajo de Q1 - 1.5×IQR o por encima de Q3 + 1.5×IQR. Robusto a la propia presencia del outlier. **(2) z-score**: un valor es outlier si su desviación estandarizada `|z| > 3` (donde z = (x - media)/std). Más simple pero sensible a outliers en la propia media/std. En ingeniería, los outliers pueden ser errores de medición (a eliminar) o fenómenos reales a investigar (una venta extraordinaria, una falla del equipo). Distinguir ambos requiere contexto.",
        },
        {
          kind: "codecell",
          caption: "Detección IQR y z-score",
          code: `import numpy as np

tiempos = np.array([6.0, 6.1, 5.9, 6.2, 6.0, 5.8, 6.1, 15.5, 6.2, 5.9, 6.0, 12.0])

# Método IQR
q1, q3 = np.percentile(tiempos, [25, 75])
iqr = q3 - q1
lim_inf = q1 - 1.5 * iqr
lim_sup = q3 + 1.5 * iqr
outliers_iqr = tiempos[(tiempos < lim_inf) | (tiempos > lim_sup)]
print(f"IQR: límites [{lim_inf:.2f}, {lim_sup:.2f}]")
print(f"Outliers IQR: {outliers_iqr}")

# Método z-score
z = (tiempos - tiempos.mean()) / tiempos.std()
outliers_z = tiempos[np.abs(z) > 3]
print(f"Outliers z-score: {outliers_z}")`,
        },
        {
          kind: "exercise",
          id: "outliers-iqr",
          prompt:
            "Detecta outliers por el método IQR en `valores = np.array([10, 12, 11, 13, 12, 100, 11, 14, 13])`. Imprime cuántos outliers hay (debe ser 1, el valor 100).",
          starterCode: `import numpy as np

valores = np.array([10, 12, 11, 13, 12, 100, 11, 14, 13])

q1, q3 = 
iqr = 
outliers = 

print(len(outliers))`,
          hints: [
            "`q1, q3 = np.percentile(valores, [25, 75])` y `iqr = q3 - q1`.",
            "Filtra: `valores[(valores < q1 - 1.5*iqr) | (valores > q3 + 1.5*iqr)]`.",
          ],
          solution: `import numpy as np
valores = np.array([10, 12, 11, 13, 12, 100, 11, 14, 13])
q1, q3 = np.percentile(valores, [25, 75])
iqr = q3 - q1
outliers = valores[(valores < q1 - 1.5*iqr) | (valores > q3 + 1.5*iqr)]
print(len(outliers))`,
          check: { type: "output_equals", value: "1" },
        },
      ],
    },
    {
      id: "correlacion",
      title: "Correlación",
      blocks: [
        {
          kind: "text",
          title: "⚠ Correlación ≠ causalidad",
          body: "La **correlación** mide la relación lineal entre dos variables, con un coeficiente **r** entre -1 (relación negativa perfecta) y +1 (positiva perfecta). `r = 0` indica ausencia de relación lineal (puede haber relación no lineal). Se calcula con `np.corrcoef(x, y)[0, 1]` o `df.corr()` para una matriz. **CRÍTICO**: correlación NO implica causalidad. Que dos variables suban juntas no significa que una cause la otra; puede haber una tercera variable que influya en ambas, o ser coincidencia. Verifica siempre con sentido de negocio antes de interpretar causalidad. El ejemplo clásico: las ventas de helado y los ahogamientos correlacionan positivamente, pero el helado no causa ahogamientos — la temperatura es la causa común.",
        },
        {
          kind: "visualization",
          component: "CorrelationVisualizer",
          props: { initialR: 0.85 },
        },
        {
          kind: "concept",
          problema: "¿Existe relación entre el precio y la cantidad vendida?",
          idea: "Calcular el coeficiente de correlación de Pearson entre precio y cantidad.",
          codigo: `import numpy as np

precio = np.array([5, 8, 12, 15, 20, 25, 30])
cantidad = np.array([400, 320, 250, 180, 150, 90, 60])

r = np.corrcoef(precio, cantidad)[0, 1]
print(f"Correlación precio-cantidad: {r:.3f}")
# r ≈ -0.99 → relación negativa fuerte: a mayor precio, menor cantidad (ley de demanda)`,
          interpretacion:
            "Un r cercano a -1 indica relación lineal negativa fuerte: cuando el precio sube, la cantidad baja siguiendo un patrón casi lineal. **PERO** correlación no implica causalidad: la causalidad (precio causa demanda) requiere un modelo económico, no solo un número. La correlación cuantifica lo que *observas*, no por qué ocurre.",
        },
        {
          kind: "codecell",
          caption: "Matriz de correlación",
          code: `import pandas as pd
import numpy as np

df = pd.DataFrame({
    "precio": [5, 8, 12, 15, 20, 25, 30],
    "cantidad": [400, 320, 250, 180, 150, 90, 60],
    "publicidad": [100, 120, 130, 145, 160, 180, 200],
})

corr = df.corr()
print("Matriz de correlación:")
print(corr.round(2))`,
        },
      ],
    },
    {
      id: "mini-variabilidad",
      title: "Mini-proyecto: Variabilidad de un proceso",
      blocks: [
        {
          kind: "text",
          title: "Analizar la estabilidad de tiempos de ciclo",
          body: "Vas a analizar 100 mediciones de tiempo de ciclo de una línea de producción. Objetivo: calcular media, mediana, desviación, CV, detectar outliers y decidir si el proceso es estable. La estabilidad es clave para la planificación: un proceso variable requiere buffers de seguridad, uno estable se puede programar con precisión. El CV (coeficiente de variación) es el KPI: < 5% muy estable, 5-15% aceptable, > 15% requiere investigación de causas.",
        },
        {
          kind: "codecell",
          caption: "Análisis completo de variabilidad",
          code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
# Tiempos de ciclo (min) — distribución bimodal por mezcla de dos procesos
tiempos = np.concatenate([
    np.random.normal(6.0, 0.4, 80),     # 80% en 6 min
    np.random.normal(8.5, 0.6, 20),     # 20% en 8.5 min (retrabajos)
])

media = np.mean(tiempos)
mediana = np.median(tiempos)
std = np.std(tiempos)
cv = std / media * 100

# Detección IQR
q1, q3 = np.percentile(tiempos, [25, 75])
iqr = q3 - q1
lim_inf, lim_sup = q1 - 1.5 * iqr, q3 + 1.5 * iqr
outliers = tiempos[(tiempos < lim_inf) | (tiempos > lim_sup)]

print(f"Media      : {media:.2f} min")
print(f"Mediana    : {mediana:.2f} min")
print(f"Std        : {std:.2f} min")
print(f"CV         : {cv:.2f}%")
print(f"Outliers   : {len(outliers)} valores")
print(f"IQR        : [{q1:.2f}, {q3:.2f}]")

# Visualización
plt.figure(figsize=(9, 4))
plt.hist(tiempos, bins=25, color='#10b981', edgecolor='white', alpha=0.7)
plt.axvline(media, color='red', linestyle='--', label=f'media={media:.2f}')
plt.axvline(mediana, color='blue', linestyle='--', label=f'mediana={mediana:.2f}')
plt.axvline(media + std, color='orange', linestyle=':', label=f'±1 std')
plt.axvline(media - std, color='orange', linestyle=':')
plt.title('Distribución de tiempos de ciclo')
plt.xlabel('Minutos')
plt.ylabel('Frecuencia')
plt.legend()
plt.tight_layout()
plt.show()

# Conclusión automática
if cv < 5:
    verdict = "Proceso MUY ESTABLE"
elif cv < 15:
    verdict = "Proceso ACEPTABLE"
else:
    verdict = "Proceso VARIABLE — investigar causas"
print(f"\\nVeredicto: {verdict}")`,
        },
      ],
    },
  ],
};
