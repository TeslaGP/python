import type { Module } from "@/lib/types";

export const algorithmicThinking: Module = {
  id: "algorithmic-thinking",
  title: "Pensamiento algorítmico",
  level: 2,
  icon: "Brain",
  description:
    "Descomponer problemas, depurar código y razonar sobre pasos antes de programar. El puente entre el problema industrial y el código.",
  lessons: [
    {
      id: "que-es-algoritmo",
      title: "¿Qué es un algoritmo?",
      blocks: [
        {
          kind: "text",
          title: "De problema a código",
          body: "Un **algoritmo** es una secuencia finita y no ambigua de pasos que resuelve un problema. Antes de programar, debes ser capaz de describir la solución en lenguaje natural. El proceso recomendado es: **(1)** entender el problema y sus entradas/salidas, **(2)** descomponerlo en subproblemas, **(3)** enumerar los pasos en orden, **(4)** traducir cada paso a código. Saltarse los pasos 1-3 y empezar a escribir código directamente produce programas confusos y con bugs. Un buen algoritmo es **correcto** (resuelve el problema para todas las entradas válidas), **termina** (no se cuelga en un bucle infinito) y es **eficiente** (no hace trabajo innecesario). Como analista industrial, tu día a día se parece a esto: 'dado un dataset de ventas, ¿cuál es la región más rentable?' — descomponer esto en pasos concretos es el 80% del trabajo.",
        },
        {
          kind: "visualization",
          component: "FunctionVisualizer",
          props: {
            inputs: ["ventas (lista)", "costos (lista)"],
            process: "Para cada mes: restar costo de venta. Sumar todas las diferencias.",
            output: "utilidad_total (float)",
          },
        },
        {
          kind: "codecell",
          caption: "Algoritmo explícito: utilidad total mensual",
          code: `# Entradas
ventas = [120, 135, 128, 142, 150, 138]
costos = [110, 120, 130, 125, 140, 132]

# Paso 1: iniciar acumulador
utilidad_total = 0

# Paso 2: recorrer meses, restar, sumar
for i in range(len(ventas)):
    utilidad_mes = ventas[i] - costos[i]
    utilidad_total += utilidad_mes

# Paso 3: devolver resultado
print(f"Utilidad total semestral: {utilidad_total}")`,
        },
        {
          kind: "exercise",
          id: "algoritmo-promedio",
          prompt:
            "Calcula el promedio de la lista `notas = [7, 8, 9, 6, 10, 8]` SIN usar `sum()` ni `len()`: implementa el algoritmo con un bucle y dos contadores (`total` y `cantidad`). Imprime el promedio.",
          starterCode: `notas = [7, 8, 9, 6, 10, 8]

total = 0
cantidad = 0

# TODO: algoritmo manual

promedio = total / cantidad
print(promedio)`,
          hints: [
            "Usa `for n in notas:` para recorrer.",
            "Dentro del bucle: `total += n` y `cantidad += 1`.",
            "El promedio debe ser 8.0.",
          ],
          solution: `notas = [7, 8, 9, 6, 10, 8]
total = 0
cantidad = 0
for n in notas:
    total += n
    cantidad += 1
promedio = total / cantidad
print(promedio)`,
          check: { type: "output_equals", value: "8.0" },
        },
      ],
    },
    {
      id: "condicionales-anidados",
      title: "Condicionales anidados",
      blocks: [
        {
          kind: "text",
          title: "Decisiones dentro de decisiones",
          body: "Los `if` pueden anidarse: dentro de la rama verdadera puedes tener otra condición, y así sucesivamente. El anidamiento permite modelar reglas de negocio complejas (por ejemplo: si el cliente es VIP, entonces si el pedido > 1000 envío gratis, si no, envío con descuento). El riesgo del anidamiento profundo es la **complejidad ciclomática**: a partir de 3-4 niveles se hace difícil de leer y de probar. Cuando veas demasiados `if` anidados, considera reorganizar: extraer una función, usar `elif`, o trabajar con un diccionario de reglas. La regla de oro: si tienes que indentar más de 3 niveles, para y replantea.",
        },
        {
          kind: "visualization",
          component: "ConditionalVisualizer",
          props: {
            condition: "cliente_vip and pedido > 1000",
            branches: {
              "Verdadero": "Envío gratis",
              "Falso (cliente_vip)": "Envío 50% descuento",
              "Falso (no vip)": "Envío tarifa normal",
            },
          },
        },
        {
          kind: "codecell",
          caption: "Asignar tarifa de envío con reglas anidadas",
          code: `cliente_vip = True
pedido = 1200

if cliente_vip:
    if pedido > 1000:
        tarifa = 0.0
    else:
        tarifa = 5.0
else:
    if pedido > 1000:
        tarifa = 10.0
    else:
        tarifa = 20.0

print(f"Tarifa de envío: {tarifa:.2f} USD")`,
        },
        {
          kind: "exercise",
          id: "asignar-bonus",
          prompt:
            "Asigna el bono anual de un operario. Dadas `cumplio_meta = True` y `cero_accidentes = False`, define `bonus` como: 5000 si cumplió meta Y no hubo accidentes, 2000 si solo cumplió meta, 0 en caso contrario. Imprime `bonus`.",
          starterCode: `cumplio_meta = True
cero_accidentes = False

bonus = 

print(bonus)`,
          hints: [
            "Empieza con `if cumplio_meta:` y dentro de ese bloque maneja el caso de accidentes.",
            "Dentro: `if cero_accidentes: bonus = 5000` else `bonus = 2000`.",
            "El bonus debe ser 2000.",
          ],
          solution: `cumplio_meta = True
cero_accidentes = False
if cumplio_meta:
    if cero_accidentes:
        bonus = 5000
    else:
        bonus = 2000
else:
    bonus = 0
print(bonus)`,
          check: { type: "output_equals", value: "2000" },
        },
      ],
    },
    {
      id: "bucles-acumulador",
      title: "Bucles con acumulador",
      blocks: [
        {
          kind: "text",
          title: "Patrones de acumulación",
          body: "El patrón **acumulador** es el más común en análisis de datos: inicializas una variable (sumador, contador, lista, máximo, mínimo) y la actualizas en cada iteración del bucle. Variantes: **suma** (`total += x`), **conteo** (`n += 1` cuando se cumple una condición), **filtro** (`resultados.append(x)` si pasa el filtro), **máximo/mínimo** (`if x > max: max = x`), **promedio** (combina suma + conteo). El error típico es olvidar inicializar el acumulador o ponerlo dentro del bucle por error. Otro patrón común: el **acumulador de listas** donde vas construyendo una lista resultado a partir de otra entrada.",
        },
        {
          kind: "codecell",
          caption: "Sumar ventas y contar productos rentables",
          code: `ventas = [120, 80, 250, 90, 180, 60]

total_ventas = 0
rentables = 0
umbral = 100

for v in ventas:
    total_ventas += v
    if v >= umbral:
        rentables += 1

print(f"Total de ventas: {total_ventas}")
print(f"Productos rentables (>= {umbral}): {rentables}")
print(f"Promedio: {total_ventas / len(ventas):.2f}")`,
        },
        {
          kind: "exercise",
          id: "contador-defectos",
          prompt:
            "Dada `defectos = [3, 0, 5, 8, 1, 0, 2, 7]`, cuenta cuántos valores son cero (sin defectos) y cuántos superan 5 (críticos). Imprime `sin_defectos` y `criticos` en líneas separadas.",
          starterCode: `defectos = [3, 0, 5, 8, 1, 0, 2, 7]

sin_defectos = 0
criticos = 0

# TODO: recorre y cuenta

print(sin_defectos)
print(criticos)`,
          hints: [
            "Recorre con `for d in defectos:`.",
            "Si `d == 0`: incrementa sin_defectos. Si `d > 5`: incrementa criticos.",
            "Resultados esperados: sin_defectos=2, criticos=2.",
          ],
          solution: `defectos = [3, 0, 5, 8, 1, 0, 2, 7]
sin_defectos = 0
criticos = 0
for d in defectos:
    if d == 0:
        sin_defectos += 1
    if d > 5:
        criticos += 1
print(sin_defectos)
print(criticos)`,
          check: { type: "output_contains", value: "2\n2" },
        },
      ],
    },
    {
      id: "pseudocodigo",
      title: "Pensar antes de programar: pseudocódigo",
      blocks: [
        {
          kind: "text",
          title: "Pseudocódigo primero",
          body: "El **pseudocódigo** es una descripción informal de los pasos del algoritmo, en lenguaje natural o mezcla de natural y código, sin preocuparte por la sintaxis exacta. Escribir pseudocódigo antes del código real tiene tres ventajas: **(1)** aclara tu razonamiento y destapa casos límite antes de invertir tiempo en programar; **(2)** es más fácil de revisar con un colega o de explicar a alguien que no programa; **(3)** el código final tiende a ser más limpio porque ya sabes qué vas a escribir. Una buena práctica es escribir el pseudocódigo como comentarios encima del código Python: cada paso del pseudocódigo se traduce a una o dos líneas.",
        },
        {
          kind: "concept",
          problema: "Encontrar el producto con mayor venta en una lista de tuplas (producto, venta).",
          idea: "Recorrer la lista, mantener una referencia al producto líder y actualizarla cuando encontremos una venta mayor.",
          codigo: `# pseudocódigo:
# 1. Si la lista está vacía, devolver None
# 2. Inicializar lider = primer elemento
# 3. Para cada (producto, venta) en la lista:
# 4.     si venta > lider.venta:
# 5.         lider = (producto, venta)
# 6. Devolver lider

ventas = [("A", 120), ("B", 250), ("C", 180), ("D", 95)]

if not ventas:
    lider = None
else:
    lider = ventas[0]
    for producto, venta in ventas:
        if venta > lider[1]:
            lider = (producto, venta)

print("Producto líder:", lider)`,
          interpretacion:
            "El pseudocódigo guía la implementación línea por línea. El algoritmo es **O(n)**: una sola pasada por la lista, lo cual es óptimo — no se puede encontrar el máximo sin mirar todos los elementos. La guarda inicial (`if not ventas`) maneja el caso límite de lista vacía, que de otro modo lanzaría un IndexError.",
        },
        {
          kind: "exercise",
          id: "pseudocodigo-a-codigo",
          prompt:
            "Convierte este pseudocódigo en Python:\n\n1. Inicializar `mayor = 0`\n2. Para cada `t` en `tiempos = [4.5, 5.1, 3.9, 6.2, 4.8]`\n3. Si `t > mayor`, asignar `mayor = t`\n4. Imprimir `mayor`\n\nImprime el resultado (debe ser 6.2).",
          starterCode: `tiempos = [4.5, 5.1, 3.9, 6.2, 4.8]

mayor = 0

# TODO: traduce el pseudocódigo

print(mayor)`,
          hints: [
            "Usa `for t in tiempos:` y dentro `if t > mayor: mayor = t`.",
            "El resultado debe ser 6.2.",
          ],
          solution: `tiempos = [4.5, 5.1, 3.9, 6.2, 4.8]
mayor = 0
for t in tiempos:
    if t > mayor:
        mayor = t
print(mayor)`,
          check: { type: "output_contains", value: "6.2" },
        },
      ],
    },
    {
      id: "depuracion",
      title: "Laboratorio de depuración (Debugging Lab)",
      phase: "experimentar",
      concepts: ["debugging:leer-traceback", "debugging:hipotesis", "errores:KeyError", "errores:TypeError"],
      blocks: [
        {
          kind: "teach",
          title: "Cómo se depura: leer → localizar → hipótesis → corregir → comprobar",
          intuition:
            "Depurar no es 'arreglar rápido'. Es un método en cinco pasos:\n\n1. **Leer** el error completo (no solo el mensaje). El traceback te dice qué pasó y en qué línea.\n2. **Localizar** dónde ocurrió. La línea `File \"...\", line N` del traceback te lo dice.\n3. **Formular una hipótesis**: ¿por qué pasó? Piensa qué valor tenía la variable problemática.\n4. **Corregir** el código según tu hipótesis.\n5. **Comprobar** volviendo a ejecutar. Si sigue fallando, vuelves al paso 1 con información nueva.\n\n**Errores frecuentes en Python para principiantes**:\n- `NameError` — usaste un nombre que no existe (lo olvidaste definir o lo escribiste mal).\n- `KeyError` — en DataFrames, pediste una columna que no existe (cuidado con mayúsculas y espacios).\n- `IndexError` — pediste una posición fuera de rango en una lista.\n- `TypeError` — mezclaste tipos incompatibles (texto + número).\n- `AttributeError` — llamaste a un método que no existe para ese tipo.\n- `SyntaxError` / `IndentationError` — error de sintaxis o indentación.\n\nEn este laboratorio, cada error viene con una **explicación detallada** en español y un botón **Pedir pista** que te guía conceptualmente → técnicamente → con código. Aprovéchalos: la tarjeta de error no solo te dice qué pasó, te enseña a depurar.",
          annotations: [
            { marker: "(1)", explanation: "Definimos un diccionario con claves en mayúscula inicial." },
            { marker: "(2)", explanation: "Aquí está el bug: pedimos 'tornillo' (minúscula) pero la clave real es 'Tornillo'. Python lanzará KeyError." },
          ],
          code: `productos = {                    # (1)
    "Tornillo": 0.15,
    "Martillo": 12.50,
    "Cemento": 95.0
}

precio = productos["tornillo"]    # (2) BUG: KeyError
print(precio)`,
          experiments: [
            {
              label: "Ejecuta y lee la tarjeta de error",
              description: "Antes de corregir, ejecuta este código tal cual. Verás una tarjeta roja explicando el KeyError. Lee las 6 secciones (tipo, dónde, qué esperaba, qué recibió, por qué, cómo corregirlo). Es la forma en que un ingeniero lee un error.",
            },
            {
              label: "Pulsa 'Pedir pista' en la tarjeta de error",
              description: "Cuando aparezca la tarjeta de error, pulsa 'Pedir pista (conceptual)' y luego 'Pista técnica' y luego 'Ayuda de código'. Verás cómo las pistas progresan desde lo conceptual hasta la solución concreta sin regalarte la respuesta de inmediato.",
            },
            {
              label: "Corrige y vuelve a ejecutar",
              description: "Cambia `productos[\"tornillo\"]` por `productos[\"Tornillo\"]` (con T mayúscula). Vuelve a ejecutar. Comprueba que ahora imprime 0.15. La hipótesis era correcta: el problema era la mayúscula.",
            },
          ],
        },
        {
          kind: "exercise",
          id: "corregir-keyerror",
          level: "guiado",
          applies: ["debugging:hipotesis", "errores:KeyError"],
          prompt:
            "El código de abajo falla con KeyError. Aplica el método de depuración: lee el error, formula una hipótesis (¿por qué falló?), corrige y comprueba. Usa la clave correcta ('Tornillo' con T mayúscula). Imprime el precio.",
          starterCode: `productos = {
    "Tornillo": 0.15,
    "Martillo": 12.50,
    "Cemento": 95.0
}

precio = productos["tornillo"]
print(precio)`,
          hints: [
            { level: "conceptual", text: "Python distingue mayúsculas de minúsculas. 'tornillo' y 'Tornillo' son dos claves distintas. El diccionario tiene 'Tornillo' (T mayúscula)." },
            { level: "tecnica", text: "Cambia `productos[\"tornillo\"]` por `productos[\"Tornillo\"]`. Si quieres hacerlo más robusto, usa `productos.get(\"tornillo\", productos.get(\"Tornillo\"))` que primero busca minúscula y luego mayúscula." },
            { level: "codigo", text: "precio = productos[\"Tornillo\"]" },
            { level: "solucion_explicada", text: "Solución:\n\nprecio = productos[\"Tornillo\"]\nprint(precio)\n\nImprime 0.15. Si quisieras evitar este tipo de errores al recibir datos del usuario, normaliza las claves: `productos = {k.lower(): v for k, v in productos.items()}` y luego accede siempre con minúsculas." },
          ],
          solution: `productos = {
    "Tornillo": 0.15,
    "Martillo": 12.50,
    "Cemento": 95.0
}
precio = productos["Tornillo"]
print(precio)`,
          check: { type: "output_equals", value: "0.15" },
        },
        {
          kind: "exercise",
          id: "corregir-typerror",
          level: "independiente",
          applies: ["debugging:hipotesis", "errores:TypeError"],
          prompt:
            "Otro bug común: el código de abajo intenta dividir un texto (str) entre un número. Falla con TypeError. Depura: lee el error, formula una hipótesis (¿qué tipo tiene `total`?), corrige convirtiendo el texto a número con `float()`, y comprueba.",
          starterCode: `total = "500"
cantidad = 10

# Queremos el promedio, pero total es texto y cantidad es número.
promedio = total / cantidad
print(promedio)`,
          hints: [
            { level: "conceptual", text: "El error es TypeError porque no puedes dividir un `str` (texto) entre un `int` (número). Aunque '500' parezca un número para ti, para Python es texto hasta que lo conviertas explícitamente." },
            { level: "tecnica", text: "Convierte el texto a número antes de operar: `float(total)` o `int(total)`." },
            { level: "codigo", text: "promedio = float(total) / cantidad" },
            { level: "solucion_explicada", text: "Solución:\n\npromedio = float(total) / cantidad\nprint(promedio)\n\nImprime 50.0. Lección: cuando los datos vienen de un CSV o de un input de usuario, suelen ser texto. Conviértelos a número con `int()`, `float()` o con `pd.to_numeric()` si es una columna de DataFrame." },
          ],
          solution: `total = "500"
cantidad = 10
promedio = float(total) / cantidad
print(promedio)`,
          check: { type: "output_contains", value: "50" },
        },
      ],
    },
  ],
};
