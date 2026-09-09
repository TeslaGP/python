import type { Module } from "@/lib/types";

export const functionsModule: Module = {
  id: "functions",
  title: "Funciones",
  level: 4,
  icon: "FunctionSquare",
  description:
    "Refactorizar, parametrizar y reutilizar. Convierte código repetitivo en funciones claras y testeables.",
  lessons: [
    {
      id: "por-que-funciones",
      title: "¿Por qué existen las funciones?",
      blocks: [
        {
          kind: "text",
          title: "DRY: Don't Repeat Yourself",
          body: "Una **función** agrupa código bajo un nombre, lo parametriza con entradas y devuelve una salida. Sus tres beneficios: **(1)** *reutilización* — escribes la lógica una vez y la llamas N veces; **(2)** *abstracción* — el resto del código no necesita saber *cómo* se calcula algo, solo *qué* devuelve; **(3)** *testabilidad* — una función aislada se puede probar con diferentes entradas. La regla de oro: si ves el mismo bloque de código tres veces, conviértelo en función. La sintaxis es `def nombre(parámetros): ... return valor`. Si una función no tiene `return`, devuelve `None` implícitamente. Nombres de función en minúsculas y con guiones bajos (`calcular_utilidad`, no `CalcularUtilidad`).",
        },
        {
          kind: "table",
          caption: "Antes vs después: 5 llamadas idénticas",
          headers: ["Antes (código repetido)", "Después (una función)"],
          rows: [
            [
              "venta1 = 100 - 30\nventa2 = 200 - 50\nventa3 = 150 - 60\nventa4 = 80 - 25\nventa5 = 120 - 40",
              "def utilidad(precio, costo):\n    return precio - costo\n\nventa1 = utilidad(100, 30)\nventa2 = utilidad(200, 50)\n...",
            ],
          ],
        },
        {
          kind: "codecell",
          caption: "Definir y llamar una función",
          code: `def calcular_utilidad(precio, costo):
    """Devuelve la utilidad unitaria."""
    return precio - costo

def calcular_margen_pct(precio, costo):
    """Devuelve el margen porcentual (0-100)."""
    utilidad = calcular_utilidad(precio, costo)
    return utilidad / precio * 100

# Reutilizamos para varios productos
productos = [
    ("Tornillo", 0.20, 0.15),
    ("Martillo", 18.0, 12.5),
    ("Cemento", 110.0, 95.0),
]

for nombre, precio, costo in productos:
    u = calcular_utilidad(precio, costo)
    m = calcular_margen_pct(precio, costo)
    print(f"{nombre:12s} | utilidad {u:6.2f} | margen {m:5.2f}%")`,
        },
      ],
    },
    {
      id: "parametros-return",
      title: "Parámetros y return",
      blocks: [
        {
          kind: "text",
          title: "Entradas y salidas",
          body: "Los **parámetros** son las entradas de la función. Puedes tener cero, uno o varios. Python soporta **argumentos posicionales** (se pasan en orden), **argumentos keyword** (se pasan por nombre, en cualquier orden) y **valores por defecto** (`def f(x, y=10):`). Una función puede devolver un valor con `return`, varios valores como tupla (`return a, b, c`), o nada (devuelve `None`). Cuando una función devuelve varios valores, el *unpacking* los separa: `utilidad, margen = calcular(precio, costo)`. Pensar en *qué* debe recibir y *qué* debe devolver la función antes de escribirla aclara su diseño.",
        },
        {
          kind: "visualization",
          component: "FunctionVisualizer",
          props: {
            inputs: ["precio (float)", "costo (float)"],
            process: "utilidad = precio - costo\\nmargen = utilidad / precio * 100",
            output: "(utilidad, margen) — tupla",
          },
        },
        {
          kind: "codecell",
          caption: "Función con múltiples returns y unpacking",
          code: `def analizar_producto(precio, costo, cantidad):
    utilidad_unitaria = precio - costo
    margen_pct = utilidad_unitaria / precio * 100
    utilidad_total = utilidad_unitaria * cantidad
    return utilidad_unitaria, margen_pct, utilidad_total

# Unpacking
u, m, total = analizar_producto(precio=12.5, costo=8.0, cantidad=80)
print(f"Utilidad unitaria: {u:.2f}")
print(f"Margen: {m:.2f}%")
print(f"Utilidad total: {total:.2f}")`,
        },
        {
          kind: "exercise",
          id: "funcion-calcular-utilidad",
          prompt:
            "Define una función `calcular_utilidad(ventas, costos)` que reciba dos listas y devuelva una tupla (utilidad_total, margen_pct). La utilidad_total es sum(ventas) - sum(costos); el margen porcentual es utilidad_total / sum(ventas) * 100. Llámala con `ventas=[120, 130, 110]` y `costos=[80, 90, 70]` e imprime ambos resultados.",
          starterCode: `def calcular_utilidad(ventas, costos):
    # TODO
    
    return 

ventas = [120, 130, 110]
costos = [80, 90, 70]
u, m = calcular_utilidad(ventas, costos)
print(u)
print(m)`,
          hints: [
            "Dentro de la función: `total_v = sum(ventas); total_c = sum(costos)`.",
            "`utilidad_total = total_v - total_c` y `margen = utilidad_total / total_v * 100`.",
            "Resultados: utilidad_total=120, margen=34.2857...",
          ],
          solution: `def calcular_utilidad(ventas, costos):
    total_v = sum(ventas)
    total_c = sum(costos)
    utilidad_total = total_v - total_c
    margen = utilidad_total / total_v * 100
    return utilidad_total, margen

ventas = [120, 130, 110]
costos = [80, 90, 70]
u, m = calcular_utilidad(ventas, costos)
print(u)
print(m)`,
          check: { type: "output_contains", value: "120" },
        },
      ],
    },
    {
      id: "argumentos-default",
      title: "Argumentos por defecto y keyword args",
      blocks: [
        {
          kind: "text",
          title: "Flexibilidad en la llamada",
          body: "Los **argumentos por defecto** permiten llamar a la función sin proporcionar todos los parámetros: `def f(x, y=10):` permite llamarla como `f(5)` (usa y=10) o `f(5, 20)` (usa y=20). Los **argumentos keyword** permiten pasar parámetros por nombre en cualquier orden: `f(y=20, x=5)`. Combinados, hacen el código más legible: `analizar(producto='Martillo', margen=25.0)` se entiende sin mirar la firma. **Precaución**: nunca uses objetos mutables (listas, dicts) como valor por defecto — se comparten entre llamadas. Usa `None` y crea el objeto dentro: `def f(items=None): if items is None: items = []`.",
        },
        {
          kind: "codecell",
          caption: "Función con defaults y keyword args",
          code: `def clasificar_eficiencia(valor, min_aceptable=70, min_excelente=90):
    """Clasifica con umbrales configurables."""
    if valor >= min_excelente:
        return "Excelente"
    elif valor >= min_aceptable:
        return "Aceptable"
    else:
        return "Deficiente"

# Llamadas con defaults
print(clasificar_eficiencia(85))    # Aceptable
print(clasificar_eficiencia(95))    # Excelente
print(clasificar_eficiencia(60))    # Deficiente

# Sobrescribir un solo default por nombre
print(clasificar_eficiencia(85, min_aceptable=80))  # Deficiente (cambió umbral)

# Sobrescribir ambos
print(clasificar_eficiencia(85, min_aceptable=60, min_excelente=80))  # Excelente`,
        },
        {
          kind: "exercise",
          id: "funcion-default-iva",
          prompt:
            "Define `aplicar_iva(precio, iva=0.16)` que devuelve `precio * (1 + iva)`. Llámala tres veces: (1) con solo precio=100 (usa iva default 16%), (2) con precio=100 y iva=0.21, (3) con precio=50. Imprime los tres resultados en líneas separadas.",
          starterCode: `def aplicar_iva(precio, iva=0.16):
    # TODO
    
    return 

# TODO: tres llamadas
print()
print()
print()`,
          hints: [
            "La función: `def aplicar_iva(precio, iva=0.16): return precio * (1 + iva)`.",
            "Resultados esperados: 116.0, 121.0, 58.0.",
          ],
          solution: `def aplicar_iva(precio, iva=0.16):
    return precio * (1 + iva)
print(aplicar_iva(100))
print(aplicar_iva(100, 0.21))
print(aplicar_iva(50))`,
          check: { type: "output_contains", value: "116.0" },
        },
      ],
    },
    {
      id: "funciones-condicionales-bucles",
      title: "Funciones con condicionales y bucles",
      blocks: [
        {
          kind: "text",
          title: "Lógica de negocio encapsulada",
          body: "Las funciones de verdad combinan condicionales, bucles y operaciones. El patrón típico de un KPI: recibir datos, iterar, aplicar condiciones, acumular y devolver. Encapsular esa lógica en una función tiene dos ventajas enormes: **(1)** puedes llamarla con diferentes datasets sin reescribir el bucle; **(2)** puedes testearla con casos extremos (lista vacía, un solo elemento, valores negativos) de forma aislada. Una buena función tiene una *responsabilidad única*: si hace dos cosas distintas (calcular utilidad y enviar email), divídela en dos funciones. Y documenta con *docstrings* (`\"\"\"...\"\"\"`) qué hace, qué recibe y qué devuelve.",
        },
        {
          kind: "codecell",
          caption: "KPI: tasa de cumplimiento de pedidos",
          code: `def tasa_cumplimiento(pedidos):
    """
    Calcula el % de pedidos entregados a tiempo.
    
    Args:
        pedidos: lista de dicts con clave 'entregado_a_tiempo' (bool).
    Returns:
        float entre 0 y 100.
    """
    if not pedidos:
        return 0.0
    a_tiempo = sum(1 for p in pedidos if p["entregado_a_tiempo"])
    return a_tiempo / len(pedidos) * 100

pedidos = [
    {"id": 1, "entregado_a_tiempo": True},
    {"id": 2, "entregado_a_tiempo": False},
    {"id": 3, "entregado_a_tiempo": True},
    {"id": 4, "entregado_a_tiempo": True},
    {"id": 5, "entregado_a_tiempo": False},
]

tasa = tasa_cumplimiento(pedidos)
print(f"Tasa de cumplimiento: {tasa:.1f}%")`,
        },
        {
          kind: "exercise",
          id: "funcion-filtrar-caros",
          prompt:
            "Define una función `productos_caros(productos, umbral=10)` que reciba una lista de tuplas `(nombre, precio)` y devuelva los nombres de los productos con precio >= umbral. Pruébala con `productos = [('A', 5), ('B', 12), ('C', 25), ('D', 8)]` y umbral por defecto. Imprime la lista resultante.",
          starterCode: `def productos_caros(productos, umbral=10):
    # TODO: devuelve lista de nombres donde precio >= umbral
    return 

productos = [('A', 5), ('B', 12), ('C', 25), ('D', 8)]
resultado = productos_caros(productos)
print(resultado)`,
          hints: [
            "Usa una comprensión: `[nombre for nombre, precio in productos if precio >= umbral]`.",
            "El resultado debe ser ['B', 'C'].",
          ],
          solution: `def productos_caros(productos, umbral=10):
    return [nombre for nombre, precio in productos if precio >= umbral]

productos = [('A', 5), ('B', 12), ('C', 25), ('D', 8)]
resultado = productos_caros(productos)
print(resultado)`,
          check: { type: "output_contains", value: "['B', 'C']" },
        },
      ],
    },
    {
      id: "mini-kpis",
      title: "Mini-proyecto: Sistema de KPIs",
      blocks: [
        {
          kind: "text",
          title: "Indicadores a partir de funciones",
          body: "Un sistema de indicadores (KPIs) resume el desempeño en pocas métricas accionables. En ingeniería industrial, los KPIs típicos son: venta media, venta máxima, venta mínima, número de transacciones, ticket promedio, y variabilidad (desviación estándar). Vamos a construir un pequeño módulo con tres funciones reutilizables: `media`, `maximo` y `minimo`, todas con implementación manual (sin usar las funciones built-in) para afianzar el patrón acumulador.",
        },
        {
          kind: "codecell",
          caption: "Sistema de KPIs manual",
          code: `def media(valores):
    if not valores:
        return 0
    total = 0
    n = 0
    for v in valores:
        total += v
        n += 1
    return total / n

def maximo(valores):
    if not valores:
        return None
    m = valores[0]
    for v in valores[1:]:
        if v > m:
            m = v
    return m

def minimo(valores):
    if not valores:
        return None
    m = valores[0]
    for v in valores[1:]:
        if v < m:
            m = v
    return m

# Aplicación: reporte de ventas mensuales
ventas = [12500, 14200, 11800, 15600, 13900, 17100, 16200]
print(f"Media mensual : {media(ventas):,.2f}")
print(f"Mejor mes     : {maximo(ventas):,.2f}")
print(f"Peor mes      : {minimo(ventas):,.2f}")
print(f"Número de meses: {len(ventas)}")`,
        },
        {
          kind: "challenge",
          id: "kpi-varios-datasets",
          context:
            "Tienes dos regiones con sus ventas mensuales: `ventas_norte = [120, 135, 128, 142]` y `ventas_sur = [95, 110, 105, 130]`. Tienes las tres funciones KPI definidas arriba.",
          objetivo:
            "Calcula la media de cada región y determina cuál tuvo mejor desempeño promedio en el semestre. Imprime la región ganadora y su media.",
          hints: [
            "Calcula `media_norte = media(ventas_norte)` y `media_sur = media(ventas_sur)`.",
            "Compara con un if y devuelve el nombre de la región ganadora.",
            "Media Norte ≈ 131.25, Media Sur = 110.0 → gana Norte.",
          ],
          solution: `def media(valores):
    if not valores:
        return 0
    return sum(valores) / len(valores)

ventas_norte = [120, 135, 128, 142]
ventas_sur = [95, 110, 105, 130]
mn = media(ventas_norte)
ms = media(ventas_sur)
ganadora = "Norte" if mn > ms else "Sur"
print(ganadora, mn)`,
        },
      ],
    },
  ],
};
