import type { Module } from "@/lib/types";

export const dataStructures: Module = {
  id: "data-structures",
  title: "Estructuras de datos",
  level: 3,
  icon: "Database",
  description:
    "Listas, tuplas, diccionarios, conjuntos y comprensiones de lista. Las herramientas básicas para organizar datos industriales.",
  lessons: [
    {
      id: "listas",
      title: "Listas",
      blocks: [
        {
          kind: "text",
          title: "La estructura más versátil",
          body: "Una **lista** es una secuencia ordenada y mutable de elementos, que pueden ser de cualquier tipo. Se escribe con corchetes `[]`. Métodos clave: `.append(x)` añade al final, `.insert(i,x)` inserta en posición, `.remove(x)` elimina la primera ocurrencia, `.pop()` saca el último, `.sort()` ordena in-place, `.reverse()` invierte. El acceso por índice es `lista[i]` (empieza en 0); el slicing `lista[a:b]` extrae desde a hasta b-1. El índice negativo cuenta desde el final (`lista[-1]` es el último). Las listas son perfectas para colecciones dinámicas que crecen durante el programa (resultados parciales, registros leídos de un archivo).",
        },
        {
          kind: "visualization",
          component: "ListVisualizer",
          props: {
            items: ["Tornillo", "Martillo", "Pintura", "Cable", "Foco"],
            highlightIndex: 2,
          },
        },
        {
          kind: "codecell",
          caption: "Lista de productos con operaciones",
          code: `productos = ["Tornillo", "Martillo", "Pintura"]

# Añadir
productos.append("Cable")
productos.append("Foco")
print("Tras añadir:", productos)

# Insertar en posición
productos.insert(2, "Brocha")
print("Tras insertar:", productos)

# Eliminar por valor
productos.remove("Pintura")
print("Tras remove:", productos)

# Acceso y slicing
print("Primero:", productos[0])
print("Último:", productos[-1])
print("Slice [1:3]:", productos[1:3])

# Ordenar
productos.sort()
print("Ordenado:", productos)`,
        },
        {
          kind: "exercise",
          id: "filtrar-lista",
          prompt:
            "Dada `precios = [0.15, 12.5, 45.0, 8.9, 7.3, 95.0]`, crea una nueva lista `caros` que contenga solo los precios >= 10, usando un bucle for y `.append()`. Imprime `caros` al final.",
          starterCode: `precios = [0.15, 12.5, 45.0, 8.9, 7.3, 95.0]

caros = []

# TODO: recorre precios y añade a caros los >= 10

print(caros)`,
          hints: [
            "Usa `for p in precios:` y dentro `if p >= 10: caros.append(p)`.",
            "El resultado debe ser [12.5, 45.0, 95.0].",
          ],
          solution: `precios = [0.15, 12.5, 45.0, 8.9, 7.3, 95.0]
caros = []
for p in precios:
    if p >= 10:
        caros.append(p)
print(caros)`,
          check: { type: "output_contains", value: "[12.5, 45.0, 95.0]" },
        },
      ],
    },
    {
      id: "tuplas",
      title: "Tuplas",
      blocks: [
        {
          kind: "text",
          title: "Listas inmutables",
          body: "Una **tupla** es como una lista pero **inmutable**: una vez creada no puedes añadir, quitar ni modificar elementos. Se escribe con paréntesis `()`. Su inmutabilidad tiene dos ventajas: **(1)** son más rápidas y ocupan menos memoria que las listas; **(2)** al ser inmutables, pueden usarse como claves de diccionario (las listas no). Son el formato natural para representar **registros fijos** cuyos campos no cambian: una coordenada `(x,y)`, un par `(producto, precio)`, una fecha `(año, mes, día)`. La función `tuple(lista)` convierte una lista en tupla; `list(tupla)` hace lo inverso. El *unpacking* `producto, precio = ('Tornillo', 0.15)` es una forma elegante de extraer campos.",
        },
        {
          kind: "codecell",
          caption: "Tuplas como registros de productos",
          code: `producto = ("Tornillo M6", 0.15, 1500)  # nombre, precio, stock

# Unpacking
nombre, precio, stock = producto
print(f"{nombre}: {precio} USD, {stock} unidades")

# Inmutabilidad: descomenta la siguiente línea para ver el error
# producto[1] = 0.20   # TypeError

# Lista de tuplas
inventario = [
    ("Tornillo", 0.15, 1500),
    ("Martillo", 12.5, 25),
    ("Cemento", 95.0, 60),
]

valor_total = sum(p * s for _, p, s in inventario)
print(f"Valor del inventario: {valor_total:.2f} USD")`,
        },
        {
          kind: "exercise",
          id: "unpacking-tuplas",
          prompt:
            "Dada una lista de tuplas `pedidos = [('A', 100), ('B', 250), ('C', 180)]`, usa un bucle for con unpacking para imprimir cada producto con su cantidad en formato 'A: 100'. Luego calcula el total con `sum(...)` y un generador. Imprime el total.",
          starterCode: `pedidos = [('A', 100), ('B', 250), ('C', 180)]

# TODO: bucle con unpacking

# TODO: total con sum y generador
total = 
print(total)`,
          hints: [
            "Sintaxis: `for producto, cant in pedidos:`.",
            "Para el total: `sum(cant for _, cant in pedidos)`.",
            "El total debe ser 530.",
          ],
          solution: `pedidos = [('A', 100), ('B', 250), ('C', 180)]
for producto, cant in pedidos:
    print(f"{producto}: {cant}")
total = sum(cant for _, cant in pedidos)
print(total)`,
          check: { type: "output_contains", value: "530" },
        },
      ],
    },
    {
      id: "diccionarios",
      title: "Diccionarios",
      blocks: [
        {
          kind: "text",
          title: "Pares clave-valor",
          body: "Un **diccionario** (`dict`) es una colección de pares `clave: valor`, donde la clave es única. Se escribe con llaves `{}`. El acceso es por clave en O(1), mucho más rápido que buscar en una lista. Métodos esenciales: `d[clave]` (lanza `KeyError` si no existe), `d.get(clave, default)` (devuelve default si no existe), `d[clave] = valor` (añade o reemplaza), `del d[clave]` (elimina), `d.keys()`, `d.values()`, `d.items()` para iterar. Los diccionarios son la estructura ideal para **catálogos** (SKU → producto), **parámetros de configuración** (clave → valor) y **conteos** (categoría → número de elementos). En Pandas, un DataFrame es esencialmente una colección de columnas (Series) indexadas por nombre — un dict de listas.",
        },
        {
          kind: "concept",
          problema: "Dado un catálogo de productos con su precio, devolver el precio de un SKU consultado por el usuario.",
          idea: "Usar un diccionario para lookup O(1) en vez de recorrer una lista.",
          codigo: `catalogo = {
    "Tornillo M6": 0.15,
    "Martillo": 12.5,
    "Pintura 4L": 45.0,
    "Cemento 25kg": 95.0
}

sku = "Martillo"
precio = catalogo.get(sku, "Producto no encontrado")
print(f"{sku}: {precio}")`,
          interpretacion:
            "El lookup en un diccionario es instantáneo sin importar el tamaño del catálogo (100 o 100 000 productos). `.get()` evita el KeyError y permite manejar productos inexistentes con elegancia. Este patrón —un dict como tabla de lookup— es ubicuo en código industrial.",
        },
        {
          kind: "codecell",
          caption: "Contar ventas por categoría usando un dict",
          code: `ventas = ["Ferretería", "Pintura", "Ferretería", "Eléctrico", "Pintura", "Ferretería"]

conteo = {}
for categoria in ventas:
    conteo[categoria] = conteo.get(categoria, 0) + 1

for cat, n in conteo.items():
    print(f"{cat}: {n}")`,
        },
        {
          kind: "exercise",
          id: "catalogo-precios",
          prompt:
            "Crea un diccionario `precios` con tres entradas: 'A'=10, 'B'=25, 'C'=7. Luego consulta el precio de 'B' y de 'D' (que no existe, debe devolver 0 usando `.get(..., 0)`). Imprime ambos precios en líneas separadas.",
          starterCode: `precios = {
    
}

precio_b = 
precio_d = 

print(precio_b)
print(precio_d)`,
          hints: [
            "Define el dict: `precios = {'A': 10, 'B': 25, 'C': 7}`.",
            "Para 'D' que no existe: `precios.get('D', 0)`.",
            "Los resultados deben ser 25 y 0.",
          ],
          solution: `precios = {'A': 10, 'B': 25, 'C': 7}
precio_b = precios['B']
precio_d = precios.get('D', 0)
print(precio_b)
print(precio_d)`,
          check: { type: "output_contains", value: "25\n0" },
        },
      ],
    },
    {
      id: "conjuntos",
      title: "Conjuntos (sets)",
      blocks: [
        {
          kind: "text",
          title: "Colecciones sin duplicados",
          body: "Un **conjunto** (`set`) es una colección no ordenada de elementos **únicos**. Se crea con `set()` o con llaves `{1, 2, 3}` (si tiene elementos). La propiedad fundamental es que **elimina duplicados automáticamente**. Sus operaciones son las de la teoría de conjuntos: unión `|`, intersección `&`, diferencia `-`, diferencia simétrica `^`. El test de pertenencia `x in conjunto` es O(1), mucho más rápido que en una lista. Los conjuntos son perfectos para: deduplicar una lista, encontrar elementos comunes entre dos listas, o testear pertenencia rápida.",
        },
        {
          kind: "codecell",
          caption: "Deduplicar y comparar catálogos",
          code: `productos_almacen_a = ["Tornillo", "Martillo", "Cable", "Foco"]
productos_almacen_b = ["Cable", "Foco", "Cemento", "Pintura"]

a = set(productos_almacen_a)
b = set(productos_almacen_b)

comunes = a & b           # intersección
solo_a = a - b             # diferencia
todos = a | b              # unión

print("Comunes:", comunes)
print("Solo en A:", solo_a)
print("Todos:", todos)

# Deduplicación rápida
lista_sucia = [1, 2, 2, 3, 3, 3, 4, 1]
print("Deduplicada:", list(set(lista_sucia)))`,
        },
        {
          kind: "exercise",
          id: "clientes-comunes",
          prompt:
            "Dadas dos listas de clientes: `clientes_q1 = ['C1','C2','C3','C4']` y `clientes_q2 = ['C3','C4','C5','C6']`, encuentra los clientes comunes en ambos trimestres (intersección) y conviértelos a lista ordenada. Imprime el resultado.",
          starterCode: `clientes_q1 = ['C1','C2','C3','C4']
clientes_q2 = ['C3','C4','C5','C6']

comunes = 

print(comunes)`,
          hints: [
            "Convierte cada lista a set y usa `&` para la intersección.",
            "El resultado debe ser ['C3', 'C4'] (tras sorted).",
          ],
          solution: `clientes_q1 = ['C1','C2','C3','C4']
clientes_q2 = ['C3','C4','C5','C6']
comunes = sorted(list(set(clientes_q1) & set(clientes_q2)))
print(comunes)`,
          check: { type: "output_contains", value: "['C3', 'C4']" },
        },
      ],
    },
    {
      id: "comprensiones",
      title: "Comprensiones de lista",
      blocks: [
        {
          kind: "text",
          title: "Construir listas de forma declarativa",
          body: "Las **comprensiones de lista** permiten crear listas en una sola línea de forma declarativa: `[expresión for item in iterable if condición]`. Son equivalentes a un bucle for con un append, pero más concisas y a menudo más rápidas. Ejemplos: `[x**2 for x in range(10)]` → cuadrados del 0 al 81; `[p for p in precios if p > 10]` → filtra los caros. Existen también las comprensiones de diccionario `{k: v for ...}` y de conjunto `{x for ...}`. La regla de oro: si la comprensión no cabe cómodamente en una línea o necesita más de un `for`, usa un bucle explícito — la legibilidad primero.",
        },
        {
          kind: "table",
          caption: "Bucle for vs comprensión",
          headers: ["Patrón", "Bucle for", "Comprensión"],
          rows: [
            ["Cuadrados", "result = []\nfor x in nums:\n  result.append(x**2)", "[x**2 for x in nums]"],
            ["Filtrar", "result = []\nfor x in nums:\n  if x > 10:\n    result.append(x)", "[x for x in nums if x > 10]"],
            ["Transformar", "result = []\nfor s in strs:\n  result.append(s.upper())", "[s.upper() for s in strs]"],
          ],
        },
        {
          kind: "codecell",
          caption: "Comprensiones aplicadas a inventario",
          code: `precios = [0.15, 12.5, 45.0, 8.9, 7.3, 95.0]
stocks = [1500, 25, 60, 120, 200, 40]

# 1. Precios con IVA (16%)
precios_iva = [p * 1.16 for p in precios]
print("Con IVA:", precios_iva)

# 2. Filtrar productos caros
caros = [p for p in precios if p >= 10]
print("Caros (>=10):", caros)

# 3. Valor total por producto (zip)
valores = [p * s for p, s in zip(precios, stocks)]
print("Valores:", valores)

# 4. Comprensión de dict
catalogo = {f"SKU-{i+1}": v for i, v in enumerate(valores)}
print("Catálogo:", catalogo)`,
        },
        {
          kind: "exercise",
          id: "comprension-filtrar",
          prompt:
            "Usa una comprensión de lista para crear `ventas_altas` a partir de `ventas = [120, 80, 250, 90, 180, 60, 300]`, conteniendo solo las ventas >= 150. Imprime `ventas_altas`.",
          starterCode: `ventas = [120, 80, 250, 90, 180, 60, 300]

ventas_altas = 

print(ventas_altas)`,
          hints: [
            "La sintaxis es `[v for v in ventas if v >= 150]`.",
            "El resultado debe ser [250, 180, 300].",
          ],
          solution: `ventas = [120, 80, 250, 90, 180, 60, 300]
ventas_altas = [v for v in ventas if v >= 150]
print(ventas_altas)`,
          check: { type: "output_contains", value: "[250, 180, 300]" },
        },
      ],
    },
    {
      id: "mini-inventario",
      title: "Mini-proyecto: Sistema de inventario",
      blocks: [
        {
          kind: "text",
          title: "Lista de diccionarios",
          body: "Un patrón muy común en Python puro (antes de usar Pandas) es representar una tabla como **lista de diccionarios**, donde cada diccionario es una fila con sus columnas. Esto se parece mucho a un DataFrame. Es útil para prototipos rápidos, para serializar a JSON, o para procesar registros uno a uno. Vamos a construir un mini-inventario con cinco productos y a calcular: el valor total del inventario (suma de costo * stock), el SKU más caro, y la lista de SKUs con stock bajo (< 50 unidades).",
        },
        {
          kind: "codecell",
          caption: "Inventario como lista de dicts — analízalo",
          code: `inventario = [
    {"sku": "SKU-1", "nombre": "Tornillo M6", "categoria": "Ferretería", "stock": 1500, "costo": 0.15},
    {"sku": "SKU-2", "nombre": "Martillo", "categoria": "Ferretería", "stock": 25, "costo": 12.50},
    {"sku": "SKU-3", "nombre": "Cemento 25kg", "categoria": "Construcción", "stock": 60, "costo": 95.00},
    {"sku": "SKU-4", "nombre": "Foco LED 9W", "categoria": "Eléctrico", "stock": 40, "costo": 4.50},
    {"sku": "SKU-5", "nombre": "Pintura 4L", "categoria": "Pintura", "stock": 200, "costo": 45.00},
]

# 1. Valor total del inventario
valor_total = sum(p["stock"] * p["costo"] for p in inventario)
print(f"Valor total: {valor_total:.2f} USD")

# 2. SKU más caro por unidad
mas_caro = max(inventario, key=lambda p: p["costo"])
print(f"Más caro: {mas_caro['nombre']} ({mas_caro['costo']} USD)")

# 3. SKUs con stock bajo
stock_bajo = [p["sku"] for p in inventario if p["stock"] < 50]
print(f"Stock bajo: {stock_bajo}")

# 4. Conteo por categoría
from collections import Counter
conteo = Counter(p["categoria"] for p in inventario)
print(f"Por categoría: {dict(conteo)}")`,
        },
        {
          kind: "challenge",
          id: "clasificacion-abc",
          context:
            "El análisis ABC clasifica los productos por su valor anual: A = los que acumulan el 80% del valor, B = 15%, C = 5%. Es la base de la gestión diferenciada del inventario.",
          objetivo:
            "Calcula el valor anual de cada producto (stock * costo) y ordénalos de mayor a menor. Imprime los productos de clase A (los top 2 en valor).",
          hints: [
            "Calcula `valor = p['stock'] * p['costo']` para cada producto.",
            "Ordena con `sorted(inventario, key=lambda p: p['stock']*p['costo'], reverse=True)`.",
            "Los dos primeros son Cemento y Pintura.",
          ],
          solution: `inventario = [
    {"sku": "SKU-1", "nombre": "Tornillo M6", "categoria": "Ferretería", "stock": 1500, "costo": 0.15},
    {"sku": "SKU-2", "nombre": "Martillo", "categoria": "Ferretería", "stock": 25, "costo": 12.50},
    {"sku": "SKU-3", "nombre": "Cemento 25kg", "categoria": "Construcción", "stock": 60, "costo": 95.00},
    {"sku": "SKU-4", "nombre": "Foco LED 9W", "categoria": "Eléctrico", "stock": 40, "costo": 4.50},
    {"sku": "SKU-5", "nombre": "Pintura 4L", "categoria": "Pintura", "stock": 200, "costo": 45.00},
]
ordenado = sorted(inventario, key=lambda p: p["stock"]*p["costo"], reverse=True)
for p in ordenado[:2]:
    print(p["nombre"], p["stock"]*p["costo"])`,
        },
      ],
    },
  ],
};
