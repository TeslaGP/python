import type { Module } from "@/lib/types";

export const simulationModule: Module = {
  id: "simulation",
  title: "Simulación",
  level: 12,
  icon: "FlaskConical",
  description:
    "Inventario, producción, Monte Carlo. Modelar la incertidumbre para tomar decisiones bajo riesgo.",
  lessons: [
    {
      id: "sim-inventario",
      title: "Simulación de inventario",
      blocks: [
        {
          kind: "text",
          title: "Cuando la demanda no es constante",
          body: "Un modelo de inventario simple asume demanda y lead time constantes. La realidad es distinta: la demanda sigue una distribución (a menudo normal o de Poisson) y el lead time también varía. La **simulación de Monte Carlo** ejecuta miles de escenarios posibles y mide la distribución de resultados: ¿cuál es la probabilidad de quiebre de stock? ¿cuál el costo esperado? Los parámetros clave: demanda media, desviación, lead time, stock inicial y punto de reorden. Ajusta los sliders del componente inferior y observa cómo cambia la curva de stock y el número de quiebres.",
        },
        {
          kind: "visualization",
          component: "InventorySimulator",
          props: {
            demandaMedia: 100,
            desviacion: 20,
            leadTime: 5,
            stockInicial: 500,
            puntoReorden: 250,
            dias: 60,
          },
        },
        {
          kind: "codecell",
          caption: "Simulación de inventario en Python puro",
          code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
dias = 60
demanda_media = 100
demanda_std = 20
lead_time = 5
stock_inicial = 500
punto_reorden = 250
cantidad_pedido = 300

# Simulación día a día
stock = stock_inicial
pedidos_pendientes = []  # [(dia_llegada, cantidad)]
quiebres = 0
historial_stock = []

for dia in range(dias):
    # Llegan pedidos pendientes
    nuevos = [(d, q) for d, q in pedidos_pendientes if d == dia]
    for _, q in nuevos:
        stock += q
    pedidos_pendientes = [(d, q) for d, q in pedidos_pendientes if d > dia]

    # Demanda del día (aleatoria normal)
    demanda = max(0, np.random.normal(demanda_media, demanda_std))
    if stock >= demanda:
        stock -= demanda
    else:
        quiebres += 1
        stock = 0

    # ¿Reordenar?
    if stock <= punto_reorden and not pedidos_pendientes:
        pedidos_pendientes.append((dia + lead_time, cantidad_pedido))

    historial_stock.append(stock)

print(f"Quiebres de stock: {quiebres} de {dias} días")
print(f"Stock final: {stock:.0f}")
print(f"Probabilidad de quiebre: {quiebres/dias*100:.1f}%")

plt.figure(figsize=(10, 4))
plt.plot(historial_stock, color='#10b981', linewidth=2)
plt.axhline(punto_reorden, color='red', linestyle='--', label='Punto reorden')
plt.axhline(0, color='black', alpha=0.3)
plt.title('Nivel de stock a lo largo del tiempo')
plt.xlabel('Día')
plt.ylabel('Stock')
plt.legend()
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()`,
        },
      ],
    },
    {
      id: "sim-produccion",
      title: "Simulación de producción",
      blocks: [
        {
          kind: "text",
          title: "Capacidad vs demanda",
          body: "Una línea de producción tiene una **capacidad máxima** (unidades por hora) y atiende una **demanda** que varía. La **utilización** = producción real / capacidad. La **capacidad ociosa** = capacidad no utilizada. Un cuello de botella (*bottleneck*) es la etapa más lenta del proceso: limita la producción de toda la línea. Simular ayuda a responder: dada una demanda variable, ¿cuántas horas extra necesitaré? ¿Cuándo se satura el sistema? ¿Qué pasa si añado una segunda línea?",
        },
        {
          kind: "codecell",
          caption: "Simular 30 días de producción con capacidad limitada",
          code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(7)
dias = 30
capacidad_diaria = 500   # unidades
demanda_media = 480
demanda_std = 80

produccion = []
demanda_real = []
utilizacion = []

for _ in range(dias):
    d = max(0, np.random.normal(demanda_media, demanda_std))
    p = min(d, capacidad_diaria)   # produce lo que puede, hasta la capacidad
    demanda_real.append(d)
    produccion.append(p)
    utilizacion.append(p / capacidad_diaria * 100)

demanda_real = np.array(demanda_real)
produccion = np.array(produccion)
utilizacion = np.array(utilizacion)

print(f"Demanda media: {demanda_real.mean():.0f} unidades/día")
print(f"Producción media: {produccion.mean():.0f} unidades/día")
print(f"Utilización media: {utilizacion.mean():.1f}%")
print(f"Días con demanda > capacidad: {(demanda_real > capacidad_diaria).sum()}")

# Visualización
plt.figure(figsize=(11, 4))
x = np.arange(dias)
plt.plot(x, demanda_real, label='Demanda', color='#ef4444', marker='o', markersize=3)
plt.plot(x, produccion, label='Producción', color='#10b981', marker='s', markersize=3)
plt.axhline(capacidad_diaria, color='gray', linestyle='--', label='Capacidad máxima')
plt.title('Demanda vs Producción diaria')
plt.xlabel('Día')
plt.ylabel('Unidades')
plt.legend()
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()`,
        },
      ],
    },
    {
      id: "monte-carlo",
      title: "Monte Carlo: el dado de mil caras",
      blocks: [
        {
          kind: "text",
          title: "Tirar el dado miles de veces",
          body: "El **método de Monte Carlo** resuelve problemas estocásticos simulándolos miles de veces y observando la distribución de resultados. La intuición: si tiras un dado una vez, no sabes qué saldrá; si lo tiras 10 000 veces, la distribución de resultados se aproxima a la teórica. Aplicación industrial: estimar la duración de un proyecto cuando cada tarea tiene una distribución de tiempo incieta. Vamos a simular un proyecto con 3 tareas, cada una con distribución triangular (min, modo, max), y sumaremos las duraciones 5000 veces para obtener la distribución del tiempo total del proyecto.",
        },
        {
          kind: "visualization",
          component: "MonteCarloSimulator",
          props: { trials: 5000 },
        },
        {
          kind: "codecell",
          caption: "Monte Carlo: duración de un proyecto de 3 tareas",
          code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(0)
trials = 5000

# 3 tareas con distribución triangular (min, modo, max) en días
tarea1 = np.random.triangular(5, 8, 15, trials)    # diseño
tarea2 = np.random.triangular(10, 14, 22, trials)  # implementación
tarea3 = np.random.triangular(4, 6, 12, trials)    # testing

duracion_total = tarea1 + tarea2 + tarea3

# Estadísticas
media = duracion_total.mean()
mediana = np.median(duracion_total)
p90 = np.percentile(duracion_total, 90)
p95 = np.percentile(duracion_total, 95)

print(f"Duración media del proyecto : {media:.1f} días")
print(f"Mediana                     : {mediana:.1f} días")
print(f"P90 (90% de probabilidad)   : {p90:.1f} días")
print(f"P95 (95% de probabilidad)   : {p95:.1f} días")

plt.figure(figsize=(10, 4))
plt.hist(duracion_total, bins=50, color='#10b981', edgecolor='white', alpha=0.8)
plt.axvline(media, color='red', linestyle='--', label=f'media={media:.1f}')
plt.axvline(p90, color='orange', linestyle='--', label=f'P90={p90:.1f}')
plt.axvline(p95, color='purple', linestyle='--', label=f'P95={p95:.1f}')
plt.title('Distribución de la duración del proyecto (5000 simulaciones)')
plt.xlabel('Días')
plt.ylabel('Frecuencia')
plt.legend()
plt.tight_layout()
plt.show()`,
        },
        {
          kind: "exercise",
          id: "estimar-probabilidad",
          prompt:
            "Usando la simulación anterior (defínela), estima la probabilidad de que el proyecto dure más de 30 días. Imprime el porcentaje con 1 decimal. P = mean(duracion_total > 30) * 100.",
          starterCode: `import numpy as np

np.random.seed(0)
trials = 5000
tarea1 = np.random.triangular(5, 8, 15, trials)
tarea2 = np.random.triangular(10, 14, 22, trials)
tarea3 = np.random.triangular(4, 6, 12, trials)
duracion_total = tarea1 + tarea2 + tarea3

probabilidad = 

print(probabilidad)`,
          hints: [
            "Probabilidad = (duracion_total > 30).mean() * 100.",
            "Debe rondar el 30-35%.",
          ],
          solution: `import numpy as np
np.random.seed(0)
trials = 5000
tarea1 = np.random.triangular(5, 8, 15, trials)
tarea2 = np.random.triangular(10, 14, 22, trials)
tarea3 = np.random.triangular(4, 6, 12, trials)
duracion_total = tarea1 + tarea2 + tarea3
probabilidad = (duracion_total > 30).mean() * 100
print(probabilidad)`,
          check: { type: "no_error" },
        },
      ],
    },
    {
      id: "mini-stockout",
      title: "Mini-proyecto: Probabilidad de quiebre de stock",
      blocks: [
        {
          kind: "text",
          title: "Cuánto stock de seguridad necesito",
          body: "El **stock de seguridad** es el colchón extra que mantienes para cubrir la incertidumbre de la demanda durante el lead time. A mayor stock de seguridad, menor probabilidad de quiebre, pero mayor costo de almacenamiento. Vamos a simular 1000 ciclos de reabastecimiento con distintos niveles de stock de seguridad y a estimar la probabilidad de quiebre para cada uno. El trade-off entre costo y servicio es uno de los problemas clásicos de la gestión de inventarios.",
        },
        {
          kind: "codecell",
          caption: "Probabilidad de quiebre vs stock de seguridad",
          code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
trials = 1000
demanda_media = 200
demanda_std = 30
lead_time = 7

# Demanda durante el lead time ~ Normal(media*lt, std*sqrt(lt))
demanda_lt = np.random.normal(
    demanda_media * lead_time,
    demanda_std * np.sqrt(lead_time),
    trials
)

# Probabilidad de quiebre para distintos niveles de stock de seguridad
ss_niveles = [0, 25, 50, 75, 100, 150]
prob_quiebre = []
for ss in ss_niveles:
    punto_reorden = demanda_media * lead_time + ss
    quiebres = (demanda_lt > punto_reorden).sum()
    prob = quiebres / trials * 100
    prob_quiebre.append(prob)
    print(f"SS={ss:3d} → P(quiebre) = {prob:.1f}%")

# Visualización
plt.figure(figsize=(9, 4))
plt.plot(ss_niveles, prob_quiebre, marker='o', color='#10b981', linewidth=2)
plt.title('Probabilidad de quiebre vs Stock de seguridad')
plt.xlabel('Stock de seguridad (unidades)')
plt.ylabel('Probabilidad de quiebre (%)')
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()`,
        },
        {
          kind: "challenge",
          id: "ss-objetivo-95",
          context:
            "Quieres garantizar un nivel de servicio del 95% (probabilidad de quiebre <= 5%). Con los parámetros anteriores (demanda media 200, std 30, lead time 7), estima qué stock de seguridad necesitas.",
          objetivo:
            "Calcula el stock de seguridad que reduce la probabilidad de quiebre al 5% o menos. Imprímelo.",
          hints: [
            "SS óptimo ≈ z * std_lt donde z = 1.65 para 95% y std_lt = std * sqrt(lead_time).",
            "Aquí std_lt = 30 * sqrt(7) ≈ 79.4. SS = 1.65 * 79.4 ≈ 131.",
            "Verifícalo simulando: con SS=131, ¿cuántos quiebres tienes de 1000?",
          ],
          solution: `import numpy as np
np.random.seed(42)
trials = 1000
demanda_media, demanda_std, lead_time = 200, 30, 7
z = 1.65
ss_optimo = z * demanda_std * np.sqrt(lead_time)
demanda_lt = np.random.normal(demanda_media*lead_time, demanda_std*np.sqrt(lead_time), trials)
punto_reorden = demanda_media * lead_time + ss_optimo
prob = (demanda_lt > punto_reorden).mean() * 100
print(f"SS óptimo: {ss_optimo:.0f}, P(quiebre): {prob:.1f}%")`,
        },
      ],
    },
  ],
};
