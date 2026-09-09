import type { Module } from "@/lib/types";

export const numpyLinearAlgebra: Module = {
  id: "numpy-linear-algebra",
  title: "NumPy y Álgebra Lineal",
  level: 5,
  icon: "Grid3x3",
  description:
    "Arrays, vectores, matrices, transformaciones lineales y sistemas Ax=b. La base matemática del análisis multivariado.",
  lessons: [
    {
      id: "arrays",
      title: "Arrays de NumPy",
      phase: "ensenar",
      concepts: ["numpy:ndarray", "numpy:shape", "numpy:dtype"],
      blocks: [
        {
          kind: "teach",
          title: "Del mundo de las listas al mundo de los arrays",
          intuition:
            "Una **lista de Python** es flexible: puedes mezclar tipos (`[1, 'a', 3.5]`). Pero esa flexibilidad tiene un costo: cada elemento es un objeto separado en memoria, y operar sobre todos ellos requiere un bucle.\n\nUn **array de NumPy** (`np.ndarray`) es distinto: una tabla n-dimensional donde **todos los elementos son del mismo tipo** (`int`, `float`, `bool`). Eso le permite a NumPy:\n\n- Guardar los datos en memoria contigua (más rápido).\n- Aplicar operaciones a todos los elementos a la vez (vectorización), sin bucle explícito.\n- Usar álgebra lineal optimizada (BLAS/LAPACK) por debajo.\n\n**Atributos clave de un array**:\n- `shape` — tupla con el tamaño en cada eje (filas, columnas, ...).\n- `ndim` — número de ejes (dimensiones).\n- `dtype` — tipo de dato (`int64`, `float64`, `bool`, ...).\n- `size` — número total de elementos.\n\nEn ingeniería:\n- 1D → serie temporal (producción diaria).\n- 2D → tabla (filas=productos, columnas=meses).\n- 3D → series multivariadas (línea × producto × mes).",
          annotations: [
            { marker: "(1)", explanation: "Importas NumPy. La convención es `import numpy as np` — todo el mundo lo hace así." },
            { marker: "(2)", explanation: "Filas = productos, columnas = meses. Cada fila interna es una fila de la matriz." },
            { marker: "(3)", explanation: "`ventas.shape` da `(3, 4)`: 3 filas y 4 columnas. Es una tupla, no una lista." },
            { marker: "(4)", explanation: "`axis=1` colapsa columnas → un total por fila (por producto)." },
            { marker: "(5)", explanation: "`axis=0` colapsa filas → un total por columna (por mes). La regla: `axis=k` *colapsa* el eje k." },
          ],
          code: `import numpy as np  # (1)

# Filas: producto, columnas: mes
ventas = np.array([   # (2)
    [120, 135, 128, 142],   # Producto A
    [80, 95, 110, 105],     # Producto B
    [200, 180, 220, 195],   # Producto C
])

print("Shape:", ventas.shape)                       # (3) -> (3, 4)
print("Total por producto (axis=1):", ventas.sum(axis=1))  # (4)
print("Total por mes (axis=0):", ventas.sum(axis=0))      # (5)
print("Total general:", ventas.sum())`,
          experiments: [
            {
              label: "Cambia axis=1 por axis=0",
              description: "Cambia `ventas.sum(axis=1)` por `ventas.sum(axis=0)`. Predice: ¿cuántos números devolverá ahora? ¿Cuál será el primero? Verifica tu intuición: axis=0 colapsa las filas.",
            },
            {
              label: "Crea un array de ceros 4x5",
              description: "Añade: `ceros = np.zeros((4, 5))` y `print(ceros.shape, ceros.size)`. Predice: ¿qué dará shape? ¿Y size? Recuerda: size = producto de las dimensiones.",
            },
            {
              label: "Array 3D — 2 líneas × 3 productos × 4 meses",
              description: "Crea `ventas3d = np.zeros((2, 3, 4))` e imprime `ventas3d.ndim` y `ventas3d.shape`. Observa: ahora tienes 3 ejes. ¿Cuántos elementos en total? (2*3*4 = 24).",
            },
          ],
        },
        {
          kind: "codecell",
          caption: "Crear arrays desde cero",
          code: `import numpy as np

# Desde una lista
a = np.array([1, 2, 3, 4, 5])
print("a:", a, "| dtype:", a.dtype, "| shape:", a.shape)

# Matriz 2x3
b = np.array([[1, 2, 3], [4, 5, 6]])
print("b shape:", b.shape, "| ndim:", b.ndim)

# Arrays especiales
ceros = np.zeros((2, 4))
unos = np.ones((3, 3))
identidad = np.eye(3)
print("Ceros:\\n", ceros)
print("Identidad:\\n", identidad)

# Rangos
r = np.arange(0, 10, 2)       # 0,2,4,6,8
lin = np.linspace(0, 1, 5)    # 5 valores entre 0 y 1
print("arange:", r)
print("linspace:", lin)`,
        },
        {
          kind: "exercise",
          id: "np-array-shape",
          prompt:
            "Crea un array 2D de shape (3, 4) con valores enteros del 1 al 12 (puedes usar `np.arange(1, 13).reshape(3, 4)`). Llámalo `matriz`. Imprime `matriz.shape` y la suma de todos sus elementos.",
          starterCode: `import numpy as np

matriz = 

print(matriz.shape)
print(matriz.sum())`,
          hints: [
            "`np.arange(1, 13)` genera [1, 2, ..., 12].",
            "`.reshape(3, 4)` lo reorganiza en 3 filas y 4 columnas.",
            "La suma total debe ser 78.",
          ],
          solution: `import numpy as np
matriz = np.arange(1, 13).reshape(3, 4)
print(matriz.shape)
print(matriz.sum())`,
          check: { type: "output_contains", value: "(3, 4)" },
        },
      ],
    },
    {
      id: "indexing",
      title: "Indexado y slicing en arrays",
      blocks: [
        {
          kind: "text",
          title: "Acceder y modificar subconjuntos",
          body: "El indexado de arrays 1D funciona como las listas: `a[0]`, `a[-1]`, `a[1:4]`. En arrays 2D, el primer índice es la fila y el segundo la columna: `m[i, j]`. El slicing admite un tercer argumento (paso): `a[::2]` toma los elementos pares. El **indexado booleano** es la joya de NumPy: `a[a > 5]` devuelve todos los elementos que cumplen la condición, sin bucle. Y el **indexado fancy** permite pasar una lista de índices: `a[[0, 2, 4]]`. Estas operaciones devuelven *vistas* o *copias* según el caso; recuerda que modificar un slice modifica el original a menos que uses `.copy()`.",
        },
        {
          kind: "codecell",
          caption: "Indexado y máscaras booleanas",
          code: `import numpy as np

precios = np.array([0.15, 12.5, 45.0, 8.9, 7.3, 95.0])

# Indexado básico
print("Primer precio:", precios[0])
print("Último precio:", precios[-1])
print("Slice [1:4]:", precios[1:4])

# Matriz 2D
m = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
print("m[1, 2]:", m[1, 2])     # fila 1, columna 2 → 6
print("Segunda fila completa:", m[1, :])
print("Segunda columna completa:", m[:, 1])

# Indexado booleano (máscara)
caros = precios[precios > 10]
print("Precios > 10:", caros)

# Modificar con máscara
precios[precios > 50] = -1   # marca los muy caros
print("Tras marca:", precios)`,
        },
        {
          kind: "exercise",
          id: "indexado-defectos",
          prompt:
            "Crea `defectos = np.array([2, 7, 0, 5, 12, 3, 9, 0, 1])`. Usa indexado booleano para quedarte solo con los defectos > 5. Imprime el resultado.",
          starterCode: `import numpy as np

defectos = np.array([2, 7, 0, 5, 12, 3, 9, 0, 1])

criticos = 

print(criticos)`,
          hints: [
            "La máscara es `defectos > 5`, y aplicas `defectos[defectos > 5]`.",
            "El resultado debe ser [7, 12, 9].",
          ],
          solution: `import numpy as np
defectos = np.array([2, 7, 0, 5, 12, 3, 9, 0, 1])
criticos = defectos[defectos > 5]
print(criticos)`,
          check: { type: "output_contains", value: "[ 7 12  9]" },
        },
      ],
    },
    {
      id: "operaciones-broadcasting",
      title: "Operaciones elemento a elemento y broadcasting",
      blocks: [
        {
          kind: "text",
          title: "Vectorización y broadcasting",
          body: "Las operaciones aritméticas entre arrays se aplican **elemento a elemento** automáticamente: `a + b` suma dos arrays del mismo shape sin bucle. El **broadcasting** es la capacidad de NumPy de operar arrays de shapes distintos rellenando con copias virtuales: `a + 5` suma 5 a cada elemento; `m + [1, 2, 3]` suma ese vector a cada fila de la matriz. Las reglas de broadcasting son: comparar shapes desde la derecha, dimensión compatible si son iguales o una de ellas es 1. El broadcasting permite escribir código compacto y eficiente. Por ejemplo, normalizar cada columna de una matriz restando la media y dividiendo entre la desviación, sin un solo bucle.",
        },
        {
          kind: "codecell",
          caption: "Vectorización y broadcasting en acción",
          code: `import numpy as np

a = np.array([1, 2, 3, 4])
b = np.array([10, 20, 30, 40])

print("a + b:", a + b)         # elemento a elemento
print("a * b:", a * b)         # NO es producto matricial
print("a * 2:", a * 2)         # broadcasting con escalar
print("a ** 2:", a ** 2)       # potencia

# Broadcasting 2D
m = np.array([[1, 2, 3], [4, 5, 6]])     # shape (2, 3)
v = np.array([10, 20, 30])               # shape (3,)

print("m + v:\\n", m + v)   # suma v a cada fila

# Normalización z-score por columna
data = np.array([[120, 1.5], [140, 2.0], [100, 1.0], [160, 2.5]])
media = data.mean(axis=0)
std = data.std(axis=0)
normalizado = (data - media) / std
print("Normalizado:\\n", normalizado)`,
        },
        {
          kind: "exercise",
          id: "broadcasting-iva",
          prompt:
            "Dado `precios = np.array([10, 25, 50, 8, 100])`, usa broadcasting para crear `precios_iva` que sea cada precio multiplicado por 1.21 (IVA 21%). Imprime `precios_iva`.",
          starterCode: `import numpy as np

precios = np.array([10, 25, 50, 8, 100])

precios_iva = 

print(precios_iva)`,
          hints: [
            "Basta con `precios * 1.21` (broadcasting escalar).",
            "El resultado debe ser [12.1, 30.25, 60.5, 9.68, 121.].",
          ],
          solution: `import numpy as np
precios = np.array([10, 25, 50, 8, 100])
precios_iva = precios * 1.21
print(precios_iva)`,
          check: { type: "output_contains", value: "121." },
        },
      ],
    },
    {
      id: "vectores",
      title: "Vectores en 2D",
      phase: "aplicar",
      concepts: ["numpy:vector", "algebra:norma", "algebra:producto_punto", "algebra:angulo"],
      blocks: [
        {
          kind: "mathconnection",
          title: "Norma, producto punto y ángulo entre vectores",
          mathConcept: "Norma y producto punto de vectores",
          mathNotation: "||v|| = √(v₁² + v₂²)        u · v = Σ uᵢvᵢ = ||u||·||v||·cos(θ)",
          intuition:
            "Un vector `[x, y]` tiene **dirección** y **magnitud**. La magnitud (norma) es la longitud de la flecha: se calcula con el Teorema de Pitágoras, `√(x² + y²)`.\n\nEl **producto punto** `u · v` es un solo número (un escalar) que mide cuánto se alinean dos vectores:\n- Si apuntan en la misma dirección → producto positivo grande.\n- Si son perpendiculares → producto = 0 (ortogonalidad).\n- Si apuntan en direcciones opuestas → producto negativo.\n\nLa fórmula `u · v = ||u||·||v||·cos(θ)` conecta el producto punto con el **ángulo θ** entre ellos. De ahí despejas θ = arccos(u·v / (||u||·||v||)).\n\nEn ingeniería: fuerzas, velocidades, flujos. El ángulo entre dos vectores te dice su relación direccional.",
          code: `import numpy as np

u = np.array([3.0, 1.0])
v = np.array([1.0, 2.0])

# Norma (magnitud)
norma_u = np.linalg.norm(u)
norma_v = np.linalg.norm(v)
print(f"||u|| = {norma_u:.4f}")
print(f"||v|| = {norma_v:.4f}")

# Producto punto
dot = np.dot(u, v)
print(f"u · v = {dot:.4f}")

# Ángulo entre u y v: cos(θ) = u·v / (||u||·||v||)
cos_theta = dot / (norma_u * norma_v)
theta_rad = np.arccos(cos_theta)
theta_deg = np.degrees(theta_rad)
print(f"Ángulo θ = {theta_deg:.2f}°")

# Ortogonalidad: si u · v = 0, son perpendiculares
w = np.array([-2.0, 6.0])  # perpendicular a u
print(f"u · w = {np.dot(u, w):.4f}  (≈0 → ortogonales)")`,
          visualization: "VectorVisualizer",
          visualizationProps: {
            vectors: [
              { x: 3, y: 1, color: "#10b981", label: "u" },
              { x: 1, y: 2, color: "#f59e0b", label: "v" },
              { x: -2, y: 6, color: "#ef4444", label: "w (⊥u)" },
            ],
            showDotProduct: true,
          },
          interpretation:
            "**Matemáticamente**: `||u|| = √(9+1) = √10 ≈ 3.162`. `u · v = 3·1 + 1·2 = 5`. `cos(θ) = 5/(3.162 · 2.236) ≈ 0.707`, así que θ ≈ 45°.\n\n**Geométricamente**: los vectores u (apunta a la derecha-abajo) y v (apunta arriba-derecha) forman un ángulo de ~45°. El vector w = [-2, 6] es perpendicular a u porque `u · w = 3·(-2) + 1·6 = -6+6 = 0`. Cuando el producto punto es 0, los vectores son **ortogonales**.\n\n**En ingeniería**: si u y v fueran fuerzas, el producto punto te dice cuánto de u contribuye a la dirección de v. Si modelas flujos de producción, el ángulo entre dos vectores de producción indica qué tan alineadas están dos líneas de trabajo.",
        },
        {
          kind: "exercise",
          id: "norma-vector",
          level: "guiado",
          applies: ["numpy:vector", "algebra:norma"],
          prompt:
            "Calcula la norma (magnitud) del vector `v = np.array([3.0, 4.0])`. Imprime el resultado (debe ser 5.0 — un triángulo 3-4-5 pitagórico).",
          starterCode: `import numpy as np

v = np.array([3.0, 4.0])

norma =

print(norma)`,
          hints: [
            { level: "conceptual", text: "La norma es la longitud del vector. Se calcula como √(x² + y²). Para [3,4]: √(9+16) = √25 = 5." },
            { level: "tecnica", text: "NumPy tiene una función para esto: `np.linalg.norm(v)`. También puedes hacerla a mano: `np.sqrt((v**2).sum())`." },
            { level: "codigo", text: "norma = np.linalg.norm(v)" },
            { level: "solucion_explicada", text: "Resultado: 5.0. La norma de [3, 4] es √(3² + 4²) = √(9+16) = √25 = 5. Es el famoso triángulo pitagórico 3-4-5." },
          ],
          solution: `import numpy as np
v = np.array([3.0, 4.0])
norma = np.linalg.norm(v)
print(norma)`,
          check: { type: "output_contains", value: "5." },
        },
        {
          kind: "exercise",
          id: "ortogonalidad",
          level: "independiente",
          applies: ["numpy:producto_punto", "algebra:ortogonalidad"],
          prompt:
            "Dados los vectores `a = np.array([2, 3])` y `b = np.array([-6, 4])`, calcula su producto punto. Predice: ¿son ortogonales? Imprime el producto punto y verifica tu predicción mirando el resultado.",
          starterCode: `import numpy as np

a = np.array([2, 3])
b = np.array([-6, 4])

# Calcula el producto punto y comprueba si son ortogonales (== 0):

`,
          hints: [
            { level: "conceptual", text: "Dos vectores son ortogonales (perpendiculares) si su producto punto es 0. Calcula a·b y comprueba si da 0." },
            { level: "tecnica", text: "Producto punto: `np.dot(a, b)` o `a @ b`. Si el resultado es 0 (o muy cercano a 0), son ortogonales." },
            { level: "codigo", text: "dot = np.dot(a, b)\nprint('a · b =', dot)\nson_ortogonales = dot == 0\nprint('¿Ortogonales?', son_ortogonales)" },
            { level: "solucion_explicada", text: "Cálculo: a · b = 2·(-6) + 3·4 = -12 + 12 = 0. Sí son ortogonales. Geométricamente: a = [2,3] apunta arriba-derecha; b = [-6,4] apunta arriba-izquierda; el ángulo entre ellos es 90°." },
          ],
          solution: `import numpy as np
a = np.array([2, 3])
b = np.array([-6, 4])
dot = np.dot(a, b)
print("a · b =", dot)
print("¿Ortogonales?", dot == 0)`,
          check: { type: "output_contains", value: "0" },
        },
      ],
    },
    {
      id: "matrices",
      title: "Matrices: transposición y producto",
      blocks: [
        {
          kind: "text",
          title: "Matrices como arrays 2D",
          body: "Una **matriz** es un array 2D. La **transpuesta** `m.T` intercambia filas por columnas (un matriz m×n se vuelve n×m). El **producto matricial** `A @ B` (operador `@`) NO es elemento a elemento: el elemento `(i, j)` del resultado es el producto punto de la fila i de A con la columna j de B. La multiplicación solo es posible si `A.shape[1] == B.shape[0]`. El producto matricial modela composiciones de transformaciones lineales: aplicar A y luego B equivale a aplicar `B @ A`. La matriz identidad `I` cumple `A @ I = A` para toda A.",
        },
        {
          kind: "visualization",
          component: "MatrixVisualizer",
          props: {
            matrix: [
              [1, 2, 3],
              [4, 5, 6],
            ],
            label: "A (2×3)",
            showTranspose: true,
          },
        },
        {
          kind: "codecell",
          caption: "Transpuesta y producto matricial",
          code: `import numpy as np

A = np.array([[1, 2, 3], [4, 5, 6]])   # 2x3
print("A shape:", A.shape)
print("A.T shape:", A.T.shape)          # 3x2
print("A.T =\\n", A.T)

B = np.array([[1, 0], [0, 1], [2, 3]])  # 3x2
C = A @ B   # (2x3) @ (3x2) = 2x2
print("A @ B =\\n", C)

# Identidad
I = np.eye(3)
M = np.array([[5, 1, 2], [0, 7, 3], [1, 0, 4]])
print("M @ I = M?\\n", M @ I)   # == M`,
        },
        {
          kind: "exercise",
          id: "producto-matricial",
          prompt:
            "Crea dos matrices: `A = np.array([[1, 2], [3, 4]])` (2x2) y `B = np.array([[5, 6], [7, 8]])` (2x2). Calcula `C = A @ B`. Imprime C. Debe ser [[19, 22], [43, 50]].",
          starterCode: `import numpy as np

A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

C = 

print(C)`,
          hints: [
            "Usa el operador `@`: `C = A @ B`.",
            "Result: [[1*5+2*7, 1*6+2*8], ...] = [[19, 22], [43, 50]].",
          ],
          solution: `import numpy as np
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])
C = A @ B
print(C)`,
          check: { type: "output_contains", value: "[[19 22]" },
        },
      ],
    },
    {
      id: "transformaciones",
      title: "Transformaciones lineales",
      blocks: [
        {
          kind: "text",
          title: "Deformar el espacio con una matriz",
          body: "Una **transformación lineal** es una función que mueve vectores del plano siguiendo la regla `v' = M @ v`, donde `M` es una matriz 2×2. Geométricamente, transforma el cuadrado unitario (vectores `[1,0]` y `[0,1]`) en un paralelogramo. Dependiendo de la matriz, esta transformación puede **rotar**, **escalar**, **reflejar** o **cizallar** (shear) el espacio. El **determinante** mide el factor por el que se escala el área: |det| < 1 comprime, > 1 expande, = 0 colapsa el plano en una línea (pierde dimensión). Los vectores propios (*eigenvectors*) no cambian de dirección bajo la transformación. Visualizar la matriz como un par de vectores columna ayuda a intuir su efecto: las columnas son a donde van los ejes coordenados.",
        },
        {
          kind: "visualization",
          component: "TransformationVisualizer",
          props: { initialMatrix: [[1, 0], [0, 1]] },
        },
        {
          kind: "concept",
          problema: "¿Cómo se ven rotación, escalado y reflexión como matrices?",
          idea: "Cada transformación tiene una forma matricial canónica. Componer dos transformaciones equivale a multiplicar sus matrices.",
          codigo: `import numpy as np

# Rotación 30°
theta = np.radians(30)
R = np.array([[np.cos(theta), -np.sin(theta)],
              [np.sin(theta),  np.cos(theta)]])
print("Rotación 30°:\\n", np.round(R, 3))

# Escalado 2x en x, 0.5x en y
S = np.array([[2.0, 0], [0, 0.5]])
print("\\nEscalado:\\n", S)

# Reflexión respecto al eje x
F = np.array([[1, 0], [0, -1]])
print("\\nReflexión eje x:\\n", F)

# Cizallamiento (shear)
C = np.array([[1, 1], [0, 1]])
print("\\nCizallamiento:\\n", C)

# Determinante
print(f"\\ndet(R) = {np.linalg.det(R):.3f} (preserva área)")`,
          interpretacion:
            "Una **rotación** tiene columnas `(cos θ, sin θ)` y `(-sin θ, cos θ)` y det = +1. Un **escalado** es diagonal con los factores en la diagonal. Una **reflexión** tiene det = -1 (invierte la orientación). El **cizallamiento** tiene unos en la diagonal y un valor fuera de ella; det = 1 (preserva área). Componer dos transformaciones es multiplicar sus matrices: aplicar R y luego S es `S @ R`.",
        },
        {
          kind: "exercise",
          id: "transformar-punto",
          prompt:
            "Aplica la rotación de 90° al vector `v = np.array([1.0, 0.0])`. La matriz de rotación 90° es `R = np.array([[0, -1], [1, 0]])`. Calcula `v_rotado = R @ v` e imprímelo. Debe ser [0, 1].",
          starterCode: `import numpy as np

v = np.array([1.0, 0.0])
R = np.array([[0, -1], [1, 0]])

v_rotado = 

print(v_rotado)`,
          hints: [
            "Usa `R @ v`.",
            "El resultado debe ser [0. 1.].",
          ],
          solution: `import numpy as np
v = np.array([1.0, 0.0])
R = np.array([[0, -1], [1, 0]])
v_rotado = R @ v
print(v_rotado)`,
          check: { type: "output_contains", value: "[0. 1.]" },
        },
      ],
    },
    {
      id: "sistemas-lineales",
      title: "Sistemas lineales Ax = b",
      phase: "aplicar",
      concepts: ["algebra:Ax=b", "numpy:linalg.solve", "algebra:determinante"],
      blocks: [
        {
          kind: "mathconnection",
          title: "Sistemas de ecuaciones: la forma matricial Ax = b",
          mathConcept: "Sistema de ecuaciones lineales",
          mathNotation: "Ax = b,   A ∈ ℝ^{n×n},   x, b ∈ ℝ^n",
          intuition:
            "Un sistema de n ecuaciones lineales con n incógnitas se escribe de forma compacta como `Ax = b`.\n\nEjemplo con 2 ecuaciones y 2 incógnitas:\n\n```\n2x + 3y = 8     ┐    ┌ 2  3 ┐ ┌ x ┐   ┌ 8 ┐\n x -  y = 1     ┘ => │ 1 -1 │ │ y │ = │ 1 │\n```\n\nEsto es: A es la matriz de coeficientes (2x2), x es el vector de incógnitas, b es el vector de términos independientes. **Resolver el sistema** = encontrar el vector x que satisface simultáneamente todas las ecuaciones.\n\n**Existencia y unicidad**: la solución existe y es única si y solo si `det(A) ≠ 0` (la matriz es **invertible**). Si `det(A) = 0`, las filas son linealmente dependientes: el sistema no tiene solución única (puede no tener ninguna, o tener infinitas).\n\n**En ingeniería industrial** aparece en:\n- Balance de materiales (planta i consume recurso j).\n- Reparto de costos indirectos entre productos.\n- Modelo input-output de Leontief (sectores que se demandan entre sí).\n- Programación lineal (condiciones de optimalidad).",
          code: `import numpy as np

# Sistema 2x2:
#   2x + 3y = 8
#    x -  y = 1
A = np.array([[2.0, 3.0],
              [1.0, -1.0]])
b = np.array([8.0, 1.0])

# Determinante: si es ≠ 0, hay solución única
det = np.linalg.det(A)
print(f"det(A) = {det:.4f}")

# Resolver Ax = b
x = np.linalg.solve(A, b)
print(f"Solución: x = {x[0]:.4f}, y = {x[1]:.4f}")

# Verificación: A @ x debe dar b
print(f"Verificación A @ x = {A @ x}")
print(f"b original       = {b}")`,
          visualization: "MatrixVisualizer",
          visualizationProps: {
            matrix: [[2, 3], [1, -1]],
            label: "Matriz A de coeficientes",
            showTranspose: false,
          },
          interpretation:
            "**Matemáticamente**: det(A) = 2·(-1) - 3·1 = -2 - 3 = -5. Como ≠ 0, hay solución única. La solución es x ≈ 2.2, y ≈ 1.2 (puedes verificar sustituyendo: 2·2.2 + 3·1.2 = 4.4+3.6 = 8 ✓ y 2.2 - 1.2 = 1 ✓).\n\n**Por qué evitar `x = inv(A) @ b`**: NumPy tiene `np.linalg.solve` que es numéricamente más estable y rápido que calcular la inversa y multiplicar. La inversa existe en teoría pero es inestable en práctica; `solve` usa eliminación gaussiana con pivotación.\n\n**En ingeniería**: si A modelara cuánto recurso j consume cada planta i, y b es la demanda total de cada recurso, entonces x es el nivel de actividad por planta que satisface simultáneamente todas las restricciones. Cambiar b te da la nueva solución instantáneamente.",
        },
        {
          kind: "codecell",
          caption: "Resolver un sistema 2x2 clásico",
          code: `import numpy as np

# Sistema:
# 2x + 3y = 8
#  x -  y = 1
A = np.array([[2, 3], [1, -1]])
b = np.array([8, 1])

x = np.linalg.solve(A, b)
print(f"x = {x[0]:.3f}, y = {x[1]:.3f}")

# Comprobación
print("A @ x =", A @ x, " == b =", b)

# Determinante
print(f"det(A) = {np.linalg.det(A):.2f}")`,
        },
        {
          kind: "exercise",
          id: "resolver-3x3",
          level: "independiente",
          applies: ["algebra:Ax=b", "numpy:linalg.solve"],
          prompt:
            "Resuelve el sistema 3x3:\n\nx + y + z = 6\n2x - y + z = 3\nx + 2y - z = 2\n\nDefine `A` y `b`, usa `np.linalg.solve(A, b)`. Imprime el vector solución `x` (debe ser [1, 2, 3]).",
          starterCode: `import numpy as np

A = np.array([

])
b = np.array([])

x =
print(x)`,
          hints: [
            { level: "conceptual", text: "Cada fila de A son los coeficientes de una ecuación. El orden de los coeficientes en cada fila debe coincidir con el orden de las incógnitas (x, y, z)." },
            { level: "tecnica", text: "A = np.array([[1,1,1], [2,-1,1], [1,2,-1]]). b = np.array([6, 3, 2]). x = np.linalg.solve(A, b)." },
            { level: "codigo", text: "A = np.array([[1,1,1], [2,-1,1], [1,2,-1]])\nb = np.array([6, 3, 2])\nx = np.linalg.solve(A, b)\nprint(x)" },
            { level: "solucion_explicada", text: "Resultado: x = [1, 2, 3]. Verificación: 1+2+3=6 ✓, 2-2+3=3 ✓, 1+4-3=2 ✓. La solución existe y es única porque det(A) ≠ 0." },
          ],
          solution: `import numpy as np
A = np.array([[1,1,1], [2,-1,1], [1,2,-1]])
b = np.array([6, 3, 2])
x = np.linalg.solve(A, b)
print(x)`,
          check: { type: "output_contains", value: "1." },
        },
      ],
    },
    {
      id: "determinante-inversa",
      title: "Determinante e inversa",
      blocks: [
        {
          kind: "text",
          title: "Medir el 'colapso' y deshacer una transformación",
          body: "El **determinante** `np.linalg.det(A)` mide cuánto se escala el área (o volumen en 3D) bajo la transformación que representa A. Si `det = 0`, la matriz es singular (no invertible): colapsa el espacio en una dimensión menor. Si `det < 0`, invierte la orientación. La **matriz inversa** `A⁻¹` satisface `A @ A⁻¹ = I`. Se calcula con `np.linalg.inv(A)`, pero solo existe si `det ≠ 0`. En la práctica, casi nunca debes calcular la inversa explícitamente: si necesitas resolver `Ax = b`, usa `np.linalg.solve`; es más rápido y numéricamente estable. La inversa es útil para análisis teórico (sensibilidad, derivadas) o para calcular covarianzas.",
        },
        {
          kind: "codecell",
          caption: "Determinante e inversa",
          code: `import numpy as np

A = np.array([[4, 7], [2, 6]])

det = np.linalg.det(A)
print(f"det(A) = {det:.2f}")

if det != 0:
    A_inv = np.linalg.inv(A)
    print(f"A⁻¹ =\\n{A_inv}")
    # Comprobación
    print(f"A @ A⁻¹ =\\n{np.round(A @ A_inv, 4)}")   # ≈ I
else:
    print("A es singular (no invertible)")

# Singular: columnas proporcionales
S = np.array([[1, 2], [2, 4]])
print(f"\\ndet(S) = {np.linalg.det(S):.4f}  (singular)")`,
        },
        {
          kind: "exercise",
          id: "verificar-inversa",
          prompt:
            "Calcula la inversa de `A = np.array([[2, 1], [5, 3]])` y verifica que `A @ A_inv` da la matriz identidad (redondea con np.round). Imprime el resultado.",
          starterCode: `import numpy as np

A = np.array([[2, 1], [5, 3]])

A_inv = 
producto = 

print(np.round(producto, 4))`,
          hints: [
            "`A_inv = np.linalg.inv(A)`.",
            "`producto = A @ A_inv` y luego redondea a 4 decimales.",
            "Debe imprimir [[1. 0.] [0. 1.]] (identidad).",
          ],
          solution: `import numpy as np
A = np.array([[2, 1], [5, 3]])
A_inv = np.linalg.inv(A)
producto = A @ A_inv
print(np.round(producto, 4))`,
          check: { type: "output_contains", value: "[[1. 0.]" },
        },
      ],
    },
  ],
};
