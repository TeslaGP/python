import type { Module } from "@/lib/types";

export const pythonBasics: Module = {
  id: "python-basics",
  title: "Python desde cero",
  level: 1,
  icon: "TerminalSquare",
  description:
    "Variables, tipos, operadores, strings y control de flujo con ejemplos de costos, ventas y márgenes industriales.",
  lessons: [
    {
      id: "variables-y-tipos",
      title: "Variables y tipos de datos",
      phase: "ensenar",
      concepts: ["variables", "tipos:int", "tipos:float", "tipos:str", "tipos:bool"],
      blocks: [
        {
          kind: "teach",
          title: "Tu primera variable — guardar un valor con un nombre",
          intuition:
            "Imagina que estás analizando las ventas de un producto. Tienes un precio (12.5) y necesitas recordarlo para usarlo más adelante en varios cálculos.\n\n**Una variable es una etiqueta con un nombre que apunta a un valor guardado en memoria.** En Python escribes `precio = 12.5` y a partir de ahí, cada vez que escribas `precio`, Python buscará ese valor.\n\nA diferencia de otros lenguajes, no tienes que declarar el tipo (`int`, `float`, etc.) antes: Python lo deduce del valor que asignas. Esto se llama **tipado dinámico**. Los cuatro tipos que más usarás como analista son:\n\n- `int` — enteros: cantidades, conteos (80, 1500)\n- `float` — decimales: precios, márgenes, proporciones (12.5, 0.25)\n- `str` — texto: nombres de producto, categorías (`'Tornillo'`, `'Norte'`)\n- `bool` — verdadero/falso: filtros y banderas (`True`, `False`)\n\nLa función `type(x)` te dice qué tipo tiene una variable. `print(x)` muestra su valor en la consola.",
          annotations: [
            { marker: "(1)", explanation: "Asignas 12.5 al nombre `precio`. Python decide que es `float` porque tiene decimales." },
            { marker: "(2)", explanation: "Asignas 80 al nombre `cantidad`. Python decide que es `int` porque es entero." },
            { marker: "(3)", explanation: "Multiplicas dos variables y guardas el resultado en `ingreso`. Como uno era float, el resultado también es float." },
            { marker: "(4)", explanation: "Comparas con `>`: devuelve un `bool` (True o False), no un número." },
            { marker: "(5)", explanation: "`print()` muestra valores en la consola. Separa varios argumentos con comas." },
          ],
          code: `precio = 12.5          # (1) float
cantidad = 80          # (2) int
ingreso = precio * cantidad   # (3) float, vale 1000.0
supera_minimo = ingreso > 500  # (4) bool, vale True

print("Ingreso:", ingreso)                   # (5)
print("¿Supera 500?:", supera_minimo)
print("Tipos:", type(precio), type(cantidad), type(supera_minimo))`,
          experiments: [
            {
              label: "Cambia el precio a 0.15",
              description:
                "Cambia `precio = 12.5` por `precio = 0.15`. Antes de ejecutar, predice: ¿qué tipo tendrá `ingreso` ahora? ¿Y `supera_minimo` seguirá siendo True? Ejecuta y comprueba tu predicción mirando la consola y el panel de Variables.",
            },
            {
              label: "Pon cantidad como texto '80'",
              description:
                "Cambia `cantidad = 80` por `cantidad = '80'` (con comillas). Predice: ¿qué crees que pasará al multiplicar un float por un str? Ejecuta. Verás un error. Léelo con calma: la tarjeta de error te explicará exactamente qué ocurrió y por qué.",
            },
            {
              label: "Imprime el nombre del producto",
              description:
                "Añade una variable `producto = 'Tornillo M6'` y luego `print(producto, type(producto))`. Observa: una `str` (cadena) se reconoce porque se escribe entre comillas simples o dobles.",
            },
          ],
        },
        {
          kind: "exercise",
          id: "calc-margen",
          level: "guiado",
          applies: ["variables", "operadores:aritmeticos"],
          prompt:
            "Ahora tú. Dado `precio = 80` y `costo = 60`, define una variable `margen_pct` que sea el **porcentaje de utilidad sobre el precio**: `(precio - costo) / precio * 100`. Imprime el resultado (debe ser 25.0).",
          starterCode: `precio = 80
costo = 60

# TODO: calcula margen_pct como porcentaje (0-100)
margen_pct =

print(margen_pct)`,
          hints: [
            { level: "conceptual", text: "El margen en porcentaje mide qué fracción del precio es utilidad. Si el producto cuesta 60 y se vende en 80, ganaste 20 sobre un precio de 80. ¿Cuánto es eso en porcentaje?" },
            { level: "tecnica", text: "La fórmula es (precio - costo) / precio * 100. El paréntesis importa: si escribes `precio - costo / precio * 100`, Python aplicará la precedencia de operadores (primero división y multiplicación) y obtendrás un resultado distinto y erróneo." },
            { level: "codigo", text: "Línea correcta: `margen_pct = (precio - costo) / precio * 100`" },
            { level: "solucion_explicada", text: "Solución completa:\n\nprecio = 80\ncosto = 60\nmargen_pct = (precio - costo) / precio * 100\nprint(margen_pct)\n\nResultado: 25.0. La utilidad es 20, que es el 25% del precio (80)." },
          ],
          solution: `precio = 80
costo = 60
margen_pct = (precio - costo) / precio * 100
print(margen_pct)`,
          check: { type: "output_contains", value: "25.0" },
        },
        {
          kind: "exercise",
          id: "independiente-costo-total",
          level: "independiente",
          applies: ["variables", "operadores:aritmeticos"],
          prompt:
            "Ahora sin tanto andamiaje. Una fábrica produce 1500 unidades. Cada unidad cuesta 4.50 producir. El precio de venta es 6.0. Calcula y imprime: (a) el `costo_total`, (b) el `ingreso_total`, (c) la `utilidad` y (d) el `margen_pct` (utilidad sobre ingreso, en porcentaje). Define las 4 variables y muéstralas con `print`.",
          starterCode: `unidades = 1500
costo_unitario = 4.50
precio_venta = 6.0

# Tu código aquí:

`,
          hints: [
            { level: "conceptual", text: "Tienes que descomponer el problema en 4 cálculos encadenados. Cada uno usa los anteriores. Pregúntate: ¿qué necesito primero?" },
            { level: "tecnica", text: "costo_total = unidades * costo_unitario. ingreso_total = unidades * precio_venta. utilidad = ingreso_total - costo_total. margen_pct = utilidad / ingreso_total * 100." },
            { level: "codigo", text: "costo_total = unidades * costo_unitario\ningreso_total = unidades * precio_venta\nutilidad = ingreso_total - costo_total\nmargen_pct = utilidad / ingreso_total * 100\nprint(costo_total, ingreso_total, utilidad, margen_pct)" },
            { level: "solucion_explicada", text: "Solución completa:\n\ncosto_total = unidades * costo_unitario  # 6750\ningreso_total = unidades * precio_venta  # 9000\nutilidad = ingreso_total - costo_total  # 2250\nmargen_pct = utilidad / ingreso_total * 100  # 25.0\n\nprint('Costo total:', costo_total)\nprint('Ingreso total:', ingreso_total)\nprint('Utilidad:', utilidad)\nprint(f'Margen: {margen_pct:.2f}%')" },
          ],
          solution: `costo_total = unidades * costo_unitario
ingreso_total = unidades * precio_venta
utilidad = ingreso_total - costo_total
margen_pct = utilidad / ingreso_total * 100

print("Costo total:", costo_total)
print("Ingreso total:", ingreso_total)
print("Utilidad:", utilidad)
print(f"Margen: {margen_pct:.2f}%")`,
          check: { type: "output_contains", value: "25" },
        },
        {
          kind: "exercise",
          id: "aplicado-tipo-de-cambio",
          level: "aplicado",
          applies: ["variables", "tipos", "operadores"],
          prompt:
            "Problema aplicado: tienes el costo de un producto importado en dólares (USD 2500) y el precio de venta en pesos (COP 9'800.000). La tasa de cambio actual es 1 USD = 4100 COP. Calcula la utilidad en pesos colombianos y el margen porcentual. Cuidado: las variables deben tener unidades en su nombre para no confundirte.",
          starterCode: `costo_usd = 2500
precio_venta_cop = 9_800_000
tasa_usd_cop = 4100

# Calcula el costo en COP, la utilidad en COP y el margen %:

`,
          hints: [
            { level: "conceptual", text: "Primero convierte el costo a la misma moneda del precio. Luego compara. Siempre trabaja con unidades comparables." },
            { level: "tecnica", text: "costo_cop = costo_usd * tasa_usd_cop. utilidad_cop = precio_venta_cop - costo_cop. margen_pct = utilidad_cop / precio_venta_cop * 100." },
            { level: "codigo", text: "costo_cop = costo_usd * tasa_usd_cop\nutilidad_cop = precio_venta_cop - costo_cop\nmargen_pct = utilidad_cop / precio_venta_cop * 100\nprint(f'Utilidad: {utilidad_cop:,.0f} COP')\nprint(f'Margen: {margen_pct:.2f}%')" },
            { level: "solucion_explicada", text: "Resultado esperado:\n- costo_cop = 2500 * 4100 = 10'250.000 COP\n- utilidad_cop = 9'800.000 - 10'250.000 = -450.000 COP (¡pérdida!)\n- margen_pct = -450000 / 9800000 * 100 ≈ -4.59%\n\nObservación: el margen negativo significa que estás vendiendo por debajo del costo. En análisis industrial, detectar un margen negativo a tiempo es crítico." },
          ],
          solution: `costo_usd = 2500
precio_venta_cop = 9_800_000
tasa_usd_cop = 4100

costo_cop = costo_usd * tasa_usd_cop
utilidad_cop = precio_venta_cop - costo_cop
margen_pct = utilidad_cop / precio_venta_cop * 100

print(f"Costo en COP: {costo_cop:,.0f}")
print(f"Utilidad en COP: {utilidad_cop:,.0f}")
print(f"Margen: {margen_pct:.2f}%")`,
          check: { type: "output_contains", value: "-" },
        },
      ],
    },
    {
      id: "operadores",
      title: "Operadores y comparaciones",
      phase: "mostrar",
      concepts: ["operadores:aritmeticos", "operadores:comparacion"],
      blocks: [
        {
          kind: "teach",
          title: "Operadores aritméticos y de comparación",
          intuition:
            "Python tiene los operadores aritméticos esperados: `+ - * /`. Pero también tres que usamos mucho en ingeniería:\n\n- `//` — **división entera**: descarta el decimal. `1500 // 12` da 125, no 125.0.\n- `%` — **módulo o resto**: lo que sobra de una división. `1500 % 12` da 0 (cabe justo).\n- `**` — **potencia**: `2 ** 10` da 1024.\n\nLos comparadores devuelven `bool` (`True`/`False`): `== != < > <= >=`. Atención: `=` **asigna**, `==` **compara**. Confundirlos es el error #1 del principiante.\n\nCasos típicos en ingeniería:\n- `unidades // caja` — ¿cuántas cajas completas armo?\n- `unidades % caja` — ¿cuántas unidades sueltas sobran?\n- `venta >= meta` — ¿cumplimos la meta?",
          annotations: [
            { marker: "(1)", explanation: "`//` divide y descarta el decimal: 1500 // 12 = 125. Cajas completas." },
            { marker: "(2)", explanation: "`%` da el resto de la división: 1500 % 12 = 0. Sin sobrantes." },
            { marker: "(3)", explanation: "`==` compara igualdad y devuelve `bool`. NO es `=`, que asigna." },
          ],
          code: `# Empaquetado industrial: ¿cuántas cajas de 12 salen de 1500 unidades?
unidades = 1500
capacidad_caja = 12

cajas_completas = unidades // capacidad_caja  # (1) entero
sobrantes = unidades % capacidad_caja          # (2) entero

print(f"Cajas completas: {cajas_completas}")
print(f"Sobrantes: {sobrantes}")
print(f"¿Cabe en cajas exactas?: {sobrantes == 0}")  # (3) bool`,
          experiments: [
            {
              label: "Cambia capacidad_caja a 7",
              description: "Cambia `capacidad_caja = 12` por `7`. Predice: ¿cuántas cajas completas saldrán? ¿Y cuántos sobrantes? Ejecuta y comprueba. Si tu predicción falló, revisa la fórmula.",
            },
            {
              label: "Cambia unidades a 1501",
              description: "Cambia `unidades = 1500` por `1501`. Antes de ejecutar, predice: ¿cuál será el valor de `sobrantes` ahora? Recuerda: `1501 % 12` es el resto de dividir 1501 entre 12.",
            },
            {
              label: "Compara precios",
              description: "Añade `precio_actual = 85` y `precio_competencia = 90`. Calcula `mas_barato = precio_actual < precio_competencia`. Imprime el resultado. Debería ser True.",
            },
          ],
        },
        {
          kind: "exercise",
          id: "comparacion-rentable",
          level: "guiado",
          applies: ["operadores:comparacion", "operadores:aritmeticos"],
          prompt:
            "Define dos variables `ventas_q1 = 12000` y `meta_q1 = 10000`. Crea `cumplio_meta` (bool) que sea True si ventas_q1 >= meta_q1. Calcula también `cumplimiento_pct = ventas_q1 / meta_q1 * 100`. Imprime ambos.",
          starterCode: `ventas_q1 = 12000
meta_q1 = 10000

cumplio_meta =
cumplimiento_pct =

print(cumplio_meta)
print(cumplimiento_pct)`,
          hints: [
            { level: "conceptual", text: "Una comparación (`>=`, `<=`, `==`) produce un `bool` (True/False). El cumplimiento porcentual mide qué tan grande es una cantidad respecto a otra, en porcentaje." },
            { level: "tecnica", text: "Para 'mayor o igual' usa `>=`. Para el porcentaje: ventas / meta * 100." },
            { level: "codigo", text: "cumplio_meta = ventas_q1 >= meta_q1\ncumplimiento_pct = ventas_q1 / meta_q1 * 100" },
            { level: "solucion_explicada", text: "Resultado: cumplio_meta = True (porque 12000 >= 10000). cumplimiento_pct = 120.0 (vende 20% más que la meta)." },
          ],
          solution: `ventas_q1 = 12000
meta_q1 = 10000
cumplio_meta = ventas_q1 >= meta_q1
cumplimiento_pct = ventas_q1 / meta_q1 * 100
print(cumplio_meta)
print(cumplimiento_pct)`,
          check: { type: "output_contains", value: "120.0" },
        },
      ],
    },
    {
      id: "strings",
      title: "Cadenas (strings) y f-strings",
      blocks: [
        {
          kind: "text",
          title: "Texto y formato",
          body: "Las cadenas (`str`) son secuencias inmutables de caracteres. Python las maneja con comillas simples o dobles indistintamente; usa triples comillas `\"\"\"` para textos multilínea. Las **f-strings** (`f\"...{variable}...\"`) son la forma moderna y recomendada de interpolar variables dentro de texto: puedes aplicar formato con `:.2f` (dos decimales), `:,.0f` (separador de miles, sin decimales), `:>10` (alinear a la derecha en 10 caracteres). Las cadenas tienen métodos útiles: `.upper()`, `.lower()`, `.strip()`, `.replace(a,b)`, `.split(sep)`. El **slicing** `cadena[inicio:fin]` extrae subcadenas. En reporting industrial, las f-strings reemplazan a la concatenación manual: son más legibles y menos propensas a errores de tipo.",
        },
        {
          kind: "codecell",
          caption: "Reporte formateado de un producto",
          code: `producto = "Tornillo M6"
precio = 0.15
cantidad = 1500
ingreso = precio * cantidad

# f-string con formato numérico
reporte = f"""
=== Reporte de ventas ===
Producto : {producto}
Precio   : {precio:.4f} USD
Cantidad : {cantidad:,}
Ingreso  : {ingreso:.2f} USD
"""
print(reporte)

# Métodos útiles
print(producto.upper())
print(producto.lower())
print(producto.replace("M6", "M8"))
print(producto[0:8])   # slicing`,
        },
        {
          kind: "concept",
          problema: "Generar un SKU a partir de la categoría y un número de lote.",
          idea: "Concatenar o usar f-strings para construir identificadores normalizados.",
          codigo: `categoria = "Ferretería"
lote = 42
sku = f"{categoria[:3].upper()}-{lote:04d}"
print(sku)`,
          interpretacion:
            "`categoria[:3]` toma los 3 primeros caracteres. `.upper()` los pasa a mayúsculas. `{lote:04d}` rellena con ceros a la izquierda hasta 4 dígitos. Resultado: `FER-0042`. Construir identificadores consistentes es clave para unir tablas más adelante en pandas.",
        },
        {
          kind: "exercise",
          id: "formato-reporte",
          prompt:
            "Construye un reporte en una sola línea usando una f-string. Dadas `linea = 'L1'`, `unidades = 245` y `defectos = 3`, imprime: `L1 produjo 245 unidades con 1.22% de defectos`. El porcentaje se calcula como defectos / unidades * 100 con 2 decimales.",
          starterCode: `linea = "L1"
unidades = 245
defectos = 3

pct_defectos = 
reporte = f""

print(reporte)`,
          hints: [
            "El porcentaje es `defectos / unidades * 100`.",
            "En la f-string usa `{pct_defectos:.2f}` para mostrar 2 decimales.",
            "La frase exacta esperada es: `L1 produjo 245 unidades con 1.22% de defectos`.",
          ],
          solution: `linea = "L1"
unidades = 245
defectos = 3
pct_defectos = defectos / unidades * 100
reporte = f"{linea} produjo {unidades} unidades con {pct_defectos:.2f}% de defectos"
print(reporte)`,
          check: { type: "output_contains", value: "1.22% de defectos" },
        },
      ],
    },
    {
      id: "control-flow",
      title: "Control de flujo: if / elif / else",
      blocks: [
        {
          kind: "text",
          title: "Tomar decisiones en el código",
          body: "El `if` ejecuta un bloque solo si la condición es verdadera. `elif` (else if) añade ramas alternativas, y `else` captura el caso residual. La sintaxis exige dos puntos `:` al final y **indentación** de 4 espacios para el cuerpo del bloque. Las condiciones pueden combinarse con `and`, `or`, `not`. En ingeniería industrial, los `if` se usan para clasificar (eficiencia ≥ 90% → excelente, 70-89% → aceptable, < 70% → deficiente), para decidir (¿reordenar si stock < punto_reorden?) y para validar datos (si una celda está vacía, usar un valor por defecto). Pensar la estructura de ramas antes de escribir el código evita casos olvidados.",
        },
        {
          kind: "visualization",
          component: "ConditionalVisualizer",
          props: { condition: "eficiencia >= 90", branches: { "Verdadero": "Excelente", "Falso → elif 70-89": "Aceptable", "Falso → else": "Deficiente" } },
        },
        {
          kind: "codecell",
          caption: "Clasificar la eficiencia de una línea",
          code: `eficiencia = 86  # %

if eficiencia >= 90:
    categoria = "Excelente"
elif eficiencia >= 70:
    categoria = "Aceptable"
else:
    categoria = "Deficiente"

print(f"Eficiencia {eficiencia}% → {categoria}")`,
        },
        {
          kind: "exercise",
          id: "clasificar-stock",
          prompt:
            "Clasifica el estado del inventario. Dado `stock = 35` y `punto_reorden = 50`, define `estado` como 'Crítico' si stock < punto_reorden * 0.5, 'Bajo' si stock < punto_reorden, y 'OK' en caso contrario. Imprime el estado.",
          starterCode: `stock = 35
punto_reorden = 50

estado = 

print(estado)`,
          hints: [
            "Empieza por el caso más estricto: stock < punto_reorden * 0.5 → Crítico.",
            "Luego elif stock < punto_reorden → Bajo.",
            "El resultado debe ser 'Bajo' porque 35 < 50 pero 35 >= 25.",
          ],
          solution: `stock = 35
punto_reorden = 50
if stock < punto_reorden * 0.5:
    estado = "Crítico"
elif stock < punto_reorden:
    estado = "Bajo"
else:
    estado = "OK"
print(estado)`,
          check: { type: "output_equals", value: "Bajo" },
        },
      ],
    },
    {
      id: "bucles",
      title: "Bucles for y while",
      blocks: [
        {
          kind: "text",
          title: "Repetir acciones",
          body: "El bucle `for` recorre los elementos de una secuencia (lista, tupla, rango, cadena). `range(n)` genera 0,1,...,n-1; `range(a,b)` va de a hasta b-1; `range(a,b,step)` permite saltos. El bucle `while` repite mientras la condición sea verdadera; cuidado con los bucles infinitos si olvidas actualizar la condición. En análisis industrial, los bucles se usan para simular periodos (12 meses), acumular totales (sumar ventas de cada región), y procesar listas de productos. El patrón **acumulador** (`total = 0; for x in datos: total += x`) es ubicuo. Cuando puedas, evita el bucle explícito y usa operaciones vectorizadas de NumPy/Pandas: son más limpias y mucho más rápidas.",
        },
        {
          kind: "visualization",
          component: "LoopVisualizer",
          props: { items: [100, 105, 110.25, 115.76, 121.55, 127.63], label: "mes" },
        },
        {
          kind: "codecell",
          caption: "Simular 12 meses de ventas con crecimiento del 5%",
          code: `ventas_mes_0 = 10000
tasa = 0.05  # 5% mensual

ventas = []
for mes in range(12):
    v = ventas_mes_0 * (1 + tasa) ** mes
    ventas.append(v)
    print(f"Mes {mes+1:2d}: {v:,.2f}")

print(f"\\nTotal anual: {sum(ventas):,.2f}")`,
        },
        {
          kind: "exercise",
          id: "bucle-defectos",
          prompt:
            "Cuenta cuántos valores en la lista `defectos` son mayores que 5. Define `criticos = 0` y usa un bucle for para incrementarlo cuando un defecto > 5. Imprime `criticos` al final.",
          starterCode: `defectos = [2, 7, 4, 9, 1, 6, 3, 11, 0, 5]

criticos = 0

# TODO: recorre la lista y cuenta los > 5

print(criticos)`,
          hints: [
            "Usa `for d in defectos:` para recorrer la lista.",
            "Dentro del bucle, usa `if d > 5: criticos += 1`.",
            "El resultado debe ser 4.",
          ],
          solution: `defectos = [2, 7, 4, 9, 1, 6, 3, 11, 0, 5]
criticos = 0
for d in defectos:
    if d > 5:
        criticos += 1
print(criticos)`,
          check: { type: "output_equals", value: "4" },
        },
      ],
    },
    {
      id: "mini-calculadora-costos",
      title: "Mini-proyecto: Calculadora de costos industriales",
      blocks: [
        {
          kind: "text",
          title: "De materia prima a margen",
          body: "Vas a integrar todo lo aprendido (variables, operadores, if, bucles) en un calculador realista. El **costo unitario** de un producto manufacturado tiene tres componentes: materia prima (MP), mano de obra directa (MOD) y gastos indirectos de fabricación (GIF). Conociendo la cantidad producida, los costos totales de cada componente y el precio de venta, puedes calcular el costo unitario, el margen bruto y decidir si el producto es rentable. Esta es exactamente la clase de cálculo que un analista industrial repite cientos de veces al mes — automatizarlo en Python ahorra horas y elimina errores de planilla.",
        },
        {
          kind: "codecell",
          caption: "Calculadora completa — modifica los valores y ejecuta",
          code: `# Datos de producción de un lote
materia_prima = 4500      # USD
mano_obra = 3200          # USD
gastos_indirectos = 1800  # USD
unidades_producidas = 1000
precio_venta = 12.5       # USD/unidad

# Costos
costo_total = materia_prima + mano_obra + gastos_indirectos
costo_unitario = costo_total / unidades_producidas

# Resultados
utilidad_unitaria = precio_venta - costo_unitario
margen_bruto_pct = utilidad_unitaria / precio_venta * 100
rentable = utilidad_unitaria > 0

# Veredicto
if margen_bruto_pct >= 30:
    veredicto = "Alta rentabilidad"
elif margen_bruto_pct >= 15:
    veredicto = "Rentabilidad media"
else:
    veredicto = "Revisar precios o costos"

print(f"Costo unitario     : {costo_unitario:.2f} USD")
print(f"Utilidad unitaria  : {utilidad_unitaria:.2f} USD")
print(f"Margen bruto      : {margen_bruto_pct:.2f}%")
print(f"¿Rentable?         : {rentable}")
print(f"Veredicto          : {veredicto}")`,
        },
        {
          kind: "challenge",
          id: "lote-variante",
          context:
            "Ahora amplía el calculador: el GIF se reparte entre dos productos A y B en proporción 60/40 según las unidades. Tienes un solo lote con 600 unidades de A y 400 de B, materia prima 5000, mano de obra 3500 y GIF 2000. El precio de venta es 14 USD para A y 16 USD para B.",
          objetivo:
            "Calcula el costo unitario de cada producto y determina cuál es más rentable en términos de margen porcentual.",
          hints: [
            "Reparte el GIF: A recibe 60% de 2000 = 1200; B recibe 800. Materia prima y mano de obra también puedes repartirlas proporcionalmente (60/40) para simplificar.",
            "Costo unitario de A = (MP_A + MOD_A + GIF_A) / 600. Igual para B con 400.",
            "Margen % = (precio - costo_unitario) / precio * 100. Compara ambos.",
          ],
          solution: `mp_a, mp_b = 5000 * 0.6, 5000 * 0.4
mod_a, mod_b = 3500 * 0.6, 3500 * 0.4
gif_a, gif_b = 2000 * 0.6, 2000 * 0.4
costo_unit_a = (mp_a + mod_a + gif_a) / 600
costo_unit_b = (mp_b + mod_b + gif_b) / 400
margen_a = (14 - costo_unit_a) / 14 * 100
margen_b = (16 - costo_unit_b) / 16 * 100
print(margen_a, margen_b)`,
        },
      ],
    },
  ],
};
