import type { Module } from "@/lib/types";
import { ventasDatasetCsv, inventarioDatasetCsv, clientesDatasetCsv } from "@/content/datasets";

const VENTAS_CSV_PY = `ventas_csv = """${ventasDatasetCsv.replace(/"""/g, '\\"\\"\\"')}"""`;

export const pandasModule: Module = {
  id: "pandas",
  title: "Pandas",
  level: 7,
  icon: "Table2",
  description:
    "DataFrames, lectura de CSV, selección, filtrado, groupby y merge. La herramienta central del analista de datos.",
  lessons: [
    {
      id: "series-dataframe",
      title: "Series y DataFrame",
      blocks: [
        {
          kind: "text",
          title: "De diccionarios a tablas",
          body: "Un **DataFrame** es una tabla bidimensional con filas y columnas nombradas. Una **Series** es una sola columna (o fila). Pandas se importa como `import pandas as pd`. La forma más directa de crear un DataFrame es desde un diccionario de listas: `pd.DataFrame({'col1': [...], 'col2': [...]})`. Cada columna de un DataFrame es una Series. Los atributos esenciales: `.columns` (nombres), `.index` (etiquetas de fila), `.shape` (filas, columnas), `.dtypes` (tipos). A diferencia de NumPy, Pandas permite tipos heterogéneos por columna (una columna de texto, otra numérica, otra de fecha).",
        },
        {
          kind: "codecell",
          caption: "Crear un DataFrame desde cero",
          code: `import pandas as pd

df = pd.DataFrame({
    "producto": ["Tornillo", "Martillo", "Cemento"],
    "precio": [0.15, 12.5, 95.0],
    "stock": [1500, 25, 60],
})

print("Tipo:", type(df))
print("Shape:", df.shape)
print("Columnas:", list(df.columns))
print("dtypes:")
print(df.dtypes)
print("\\nDataFrame completo:")
print(df)`,
        },
        {
          kind: "exercise",
          id: "crear-df-ventas",
          prompt:
            "Crea un DataFrame `df` con tres columnas: 'linea' (valores ['L1','L2','L3']), 'unidades' ([100, 150, 120]) y 'defectos' ([2, 5, 1]). Imprime `df.shape` (debe ser (3, 3)).",
          starterCode: `import pandas as pd

df = pd.DataFrame({
    
})

print(df.shape)`,
          hints: [
            "Sintaxis: `pd.DataFrame({'col': [...]})`.",
            "El shape debe ser (3, 3).",
          ],
          solution: `import pandas as pd
df = pd.DataFrame({
    "linea": ["L1", "L2", "L3"],
    "unidades": [100, 150, 120],
    "defectos": [2, 5, 1],
})
print(df.shape)`,
          check: { type: "output_contains", value: "(3, 3)" },
        },
      ],
    },
    {
      id: "lectura-csv",
      title: "Lectura de CSV",
      blocks: [
        {
          kind: "text",
          title: "La fuente principal de datos",
          body: "En la vida real, los datos casi siempre vienen de un CSV (o Excel). Pandas los lee con `pd.read_csv('archivo.csv')`. En este laboratorio no hay sistema de archivos: pasamos los datos como una cadena de texto y usamos `pd.read_csv(io.StringIO(cadena))`. Tras cargar, las tres funciones para 'ver' la tabla: `.head(n)` (primeras n filas, default 5), `.tail(n)` (últimas n), `.sample(n)` (aleatorias). Ver `.head()` es el primer comando que ejecuta un analista al recibir un dataset nuevo — te da una intuición inmediata de la estructura.",
        },
        {
          kind: "codecell",
          caption: "Leer un CSV desde una cadena",
          code: `import pandas as pd
import io

${VENTAS_CSV_PY}

df = pd.read_csv(io.StringIO(ventas_csv))

print("Primeras 5 filas:")
print(df.head())

print("\\nÚltimas 3 filas:")
print(df.tail(3))`,
        },
        {
          kind: "exercise",
          id: "head-shape",
          prompt:
            "Lee el CSV `ventas_csv` (ya definido en la celda superior) y muestra las primeras 3 filas con `.head(3)`. Imprime también `.shape`.",
          starterCode: `import pandas as pd
import io

${VENTAS_CSV_PY}

df = 

print(df.head(3))
print(df.shape)`,
          hints: [
            "`df = pd.read_csv(io.StringIO(ventas_csv))`.",
            "Shape debe ser (10, 6).",
          ],
          solution: `import pandas as pd
import io
${VENTAS_CSV_PY}
df = pd.read_csv(io.StringIO(ventas_csv))
print(df.head(3))
print(df.shape)`,
          check: { type: "output_contains", value: "(10, 6)" },
        },
      ],
    },
    {
      id: "seleccion",
      title: "Selección: columnas, loc, iloc",
      blocks: [
        {
          kind: "text",
          title: "Tres formas de seleccionar",
          body: "Para seleccionar una o varias columnas: `df['col']` (Series) o `df[['col1','col2']]` (DataFrame). Para seleccionar por **etiqueta** (nombres de fila/columna): `df.loc[fila, columna]`. Para seleccionar por **posición** (índices numéricos): `df.iloc[i, j]`. La distinción `loc` vs `iloc` es fuente de confusión al inicio: `loc` usa etiquetas, `iloc` usa enteros. Ambos admiten slicing: `df.loc[2:5, 'col1':'col3']` o `df.iloc[2:5, 0:3]`. Recuerda que `loc` es inclusivo en ambos extremos, mientras que `iloc` excluye el final (como el slicing de Python normal).",
        },
        {
          kind: "codecell",
          caption: "Tres formas de selección",
          code: `import pandas as pd
import io

${VENTAS_CSV_PY}

df = pd.read_csv(io.StringIO(ventas_csv))

# 1. Selección de columnas
print("Columna 'producto':")
print(df['producto'])   # Series
print("\\nDos columnas:")
print(df[['producto', 'precio']])   # DataFrame

# 2. loc (por etiqueta)
print("\\nloc[0:2, 'producto':'precio']:")
print(df.loc[0:2, 'producto':'precio'])

# 3. iloc (por posición)
print("\\niloc[0:3, 0:2]:")
print(df.iloc[0:3, 0:2])`,
        },
        {
          kind: "exercise",
          id: "seleccion-precio",
          prompt:
            "Selecciona solo la columna 'precio' del DataFrame df (definido arriba) e imprímela. Debe ser una Series con 10 valores.",
          starterCode: `import pandas as pd
import io

${VENTAS_CSV_PY}

df = pd.read_csv(io.StringIO(ventas_csv))

precios = 

print(precios)`,
          hints: [
            "Usa `df['precio']` para obtener una Series.",
            "Debes ver 10 valores.",
          ],
          solution: `import pandas as pd
import io
${VENTAS_CSV_PY}
df = pd.read_csv(io.StringIO(ventas_csv))
precios = df['precio']
print(precios)`,
          check: { type: "output_contains", value: "0.15" },
        },
      ],
    },
    {
      id: "filtrado",
      title: "Filtrado con condiciones",
      blocks: [
        {
          kind: "concept",
          problema: "Queremos los productos con precio mayor a 10 USD.",
          idea: "Aplicar una máscara booleana sobre el DataFrame: `df[df['col'] > valor]`.",
          codigo: `import pandas as pd
import io

${VENTAS_CSV_PY}

df = pd.read_csv(io.StringIO(ventas_csv))

caros = df[df['precio'] > 10]
print(caros[['producto', 'precio']])

# Múltiples condiciones con & (and) o | (or)
regiones_norte_o_este = df[(df['region']=='Norte') | (df['region']=='Este')]
print("\\nRegión Norte o Este:")
print(regiones_norte_o_este[['producto', 'region']])`,
          interpretacion:
            "La sintaxis `df[mask]` filtra las filas donde la máscara es True. Las condiciones múltiples se combinan con `&` (and) y `|` (or), **siempre entre paréntesis**. Es el equivalente en Pandas al `WHERE` de SQL. Olvidar los paréntesis provoca errores de precedencia.",
        },
        {
          kind: "codecell",
          caption: "Filtra y agrega en una sola cadena",
          code: `import pandas as pd
import io

${VENTAS_CSV_PY}

df = pd.read_csv(io.StringIO(ventas_csv))

# Productos de la categoría Ferretería con cantidad > 50
ferreteria_popular = df[(df['categoria']=='Ferretería') & (df['cantidad'] > 50)]
print(ferreteria_popular)`,
        },
        {
          kind: "exercise",
          id: "filtro-categoria",
          prompt:
            "Filtra df para obtener solo las filas de la categoría 'Pintura'. Imprime el resultado (debe haber 3 filas: Pintura Blanca, Brocha, Silicona).",
          starterCode: `import pandas as pd
import io

${VENTAS_CSV_PY}

df = pd.read_csv(io.StringIO(ventas_csv))

pintura = 

print(pintura)`,
          hints: [
            "Usa `df[df['categoria'] == 'Pintura']`.",
            "Deben aparecer 3 filas.",
          ],
          solution: `import pandas as pd
import io
${VENTAS_CSV_PY}
df = pd.read_csv(io.StringIO(ventas_csv))
pintura = df[df['categoria'] == 'Pintura']
print(pintura)`,
          check: { type: "output_contains", value: "Pintura" },
        },
      ],
    },
    {
      id: "columnas-calculadas",
      title: "Crear columnas calculadas",
      blocks: [
        {
          kind: "text",
          title: "Derivar nuevas variables",
          body: "Para crear una columna nueva asignas a `df['nueva'] = ...`. La expresión a la derecha suele ser una operación vectorizada sobre columnas existentes: `df['venta_bruta'] = df['precio'] * df['cantidad']`. Esta vectorización es la forma idiomática y eficiente de Pandas: nunca escribas un bucle for para recorrer filas si puedes expresarlo como operación entre columnas. Las operaciones se aplican elemento a elemento automáticamente. Puedes combinar con condicionales usando `np.where(cond, val_true, val_false)` para crear columnas categóricas a partir de reglas.",
        },
        {
          kind: "codecell",
          caption: "Columnas calculadas con vectorización",
          code: `import pandas as pd
import numpy as np
import io

${VENTAS_CSV_PY}

df = pd.read_csv(io.StringIO(ventas_csv))

# 1. Columna numérica derivada
df['venta_bruta'] = df['precio'] * df['cantidad']
df['iva'] = df['venta_bruta'] * 0.16
df['venta_neta'] = df['venta_bruta'] + df['iva']

# 2. Columna categórica con np.where
df['tamano_pedido'] = np.where(df['cantidad'] > 200, 'Grande', 'Pequeño')

# 3. Columna a partir de string
df['producto_mayus'] = df['producto'].str.upper()

print(df[['producto', 'venta_bruta', 'venta_neta', 'tamano_pedido']].head())`,
        },
        {
          kind: "exercise",
          id: "crear-margen",
          prompt:
            "Añade una columna `margen` al df que sea la diferencia entre venta_bruta (precio*cantidad) y un costo fijo de 100 USD por producto. Crea también venta_bruta. Imprime las columnas producto, venta_bruta y margen.",
          starterCode: `import pandas as pd
import io

${VENTAS_CSV_PY}

df = pd.read_csv(io.StringIO(ventas_csv))

df['venta_bruta'] = 
df['margen'] = 

print(df[['producto', 'venta_bruta', 'margen']])`,
          hints: [
            "`df['venta_bruta'] = df['precio'] * df['cantidad']`.",
            "`df['margen'] = df['venta_bruta'] - 100`.",
          ],
          solution: `import pandas as pd
import io
${VENTAS_CSV_PY}
df = pd.read_csv(io.StringIO(ventas_csv))
df['venta_bruta'] = df['precio'] * df['cantidad']
df['margen'] = df['venta_bruta'] - 100
print(df[['producto', 'venta_bruta', 'margen']])`,
          check: { type: "output_contains", value: "venta_bruta" },
        },
      ],
    },
    {
      id: "groupby",
      title: "groupby y agregaciones",
      phase: "ensenar",
      concepts: ["pandas:groupby", "pandas:agg", "split-apply-combine"],
      blocks: [
        {
          kind: "text",
          title: "Primero, pensemos el problema",
          body: "Imagina que tu jefe te entrega un DataFrame con 1000 ventas y te pregunta: **¿cuánto vendió cada región?**\n\nAntes de buscar una función, intenta pensar conceptualmente qué tienes que hacer:\n\n1. **Agrupar** las filas por región (todas las ventas del Norte juntas, todas las del Sur juntas, ...).\n2. **Sumar** las ventas dentro de cada grupo.\n3. Obtener una tabla con una fila por región y su total.\n\nEste patrón —**agrupar por algo, aplicar una operación a cada grupo, combinar los resultados**— se llama *split-apply-combine* y es **la herramienta más importante de Pandas**. Lo mismo en SQL se escribe `GROUP BY`. Aparece en casi cualquier análisis: ventas por categoría, defectos por línea, producción por turno, KPIs por región.\n\nEn Pandas, la función que hace esto se llama `groupby()`. Vamos a aprenderla paso a paso.",
        },
        {
          kind: "teach",
          title: "groupby — split, apply, combine",
          intuition:
            "El patrón **split-apply-combine** tiene tres pasos:\n\n1. **Split** (dividir): Pandas separa el DataFrame en grupos según los valores de una columna. Todas las filas con `region == 'Norte'` forman un grupo, todas con `region == 'Sur'` otro, etc.\n\n2. **Apply** (aplicar): a cada grupo le aplicas una función — `sum()`, `mean()`, `count()`, `max()`, `min()`, o una función personalizada.\n\n3. **Combine** (combinar): Pandas reúne los resultados en un nuevo objeto (una Series o un DataFrame) indexado por el valor de la columna de agrupación.\n\nLa sintaxis en Pandas es:\n```python\ndf.groupby('region')['venta_bruta'].sum()\n```\nSe lee de izquierda a derecha: del DataFrame, agrupa por región; de cada grupo, toma la columna venta_bruta; súmala. El resultado es una Series con una fila por región.\n\n**Equivalencia SQL**: esto es exactamente `SELECT region, SUM(venta_bruta) FROM df GROUP BY region`.",
          annotations: [
            { marker: "(1)", explanation: "Creamos una columna calculada `venta_bruta = precio * cantidad`. Es una operación vectorizada: Pandas aplica la multiplicación fila por fila sin bucle." },
            { marker: "(2)", explanation: "`df.groupby('region')` divide el DataFrame en subgrupos por valor de `region`. No devuelve nada visible todavía — es un objeto 'GroupBy' lazy." },
            { marker: "(3)", explanation: "Seleccionamos solo la columna `venta_bruta` de cada grupo. Esto reduce cada subgrupo a una Series." },
            { marker: "(4)", explanation: "`.sum()` aplica la suma a cada Series de grupo. Pandas combina los resultados en una Series indexada por región." },
            { marker: "(5)", explanation: "`.agg({...})` permite aplicar varias funciones a varias columnas a la vez. Devuelve un DataFrame con índices jerárquicos en columnas." },
          ],
          code: `import pandas as pd
import io

ventas_csv = \"\"\"producto,region,precio,cantidad
Tornillo,Norte,0.15,1500
Martillo,Sur,12.5,80
Pintura,Norte,45.0,40
Cable,Sur,3.2,400
Foco,Este,4.5,300
\"\"\"
df = pd.read_csv(io.StringIO(ventas_csv))

df['venta_bruta'] = df['precio'] * df['cantidad']   # (1)

# (2)(3)(4) — agrupar, seleccionar, sumar
total_por_region = df.groupby('region')['venta_bruta'].sum()
print("Venta bruta por región:")
print(total_por_region)

# (5) — varias agregaciones a la vez
print("\\nVarias agregaciones por región:")
print(df.groupby('region').agg({
    'venta_bruta': ['sum', 'mean', 'count'],
    'cantidad': 'max'
}))`,
          experiments: [
            {
              label: "Agrupa por producto en vez de región",
              description: "Cambia `'region'` por `'producto'` en el groupby. Predice: ¿cuántas filas tendrá el resultado? (Tantas como productos distintos haya.) Ejecuta y comprueba.",
            },
            {
              label: "Cambia sum() por mean()",
              description: "Cambia `.sum()` por `.mean()` para ver el promedio de venta bruta por región. Predice: ¿la región con mayor promedio será la misma que la de mayor suma? Piensa por qué podrían diferir.",
            },
            {
              label: "Aplica count() para contar ventas",
              description: "Cambia `.sum()` por `.count()`. Esto cuenta cuántas ventas (filas) hay por región. Predice el resultado antes de ejecutar.",
            },
          ],
        },
        {
          kind: "exercise",
          id: "groupby-region",
          level: "guiado",
          applies: ["pandas:groupby", "pandas:sum"],
          prompt:
            "Calcula el total de cantidad (suma) por región usando groupby. Imprime el resultado (Series con 4 regiones: Norte, Sur, Este, Oeste).",
          starterCode: `import pandas as pd
import io

ventas_csv = \"\"\"producto,region,precio,cantidad
Tornillo,Norte,0.15,1500
Martillo,Sur,12.5,80
Pintura,Norte,45.0,40
Cable,Sur,3.2,400
Foco,Este,4.5,300
Cemento,Oeste,95.0,60
\"\"\"
df = pd.read_csv(io.StringIO(ventas_csv))

total_cantidad =

print(total_cantidad)`,
          hints: [
            { level: "conceptual", text: "Sigues el patrón split-apply-combine: agrupar por región, seleccionar la columna 'cantidad', sumarla." },
            { level: "tecnica", text: "La estructura es: df.groupby('col_a_agrupar')['col_a_sumar'].sum()" },
            { level: "codigo", text: "total_cantidad = df.groupby('region')['cantidad'].sum()" },
            { level: "solucion_explicada", text: "Solución:\n\ntotal_cantidad = df.groupby('region')['cantidad'].sum()\nprint(total_cantidad)\n\nResultado: Norte=1540, Sur=480, Este=300, Oeste=60. Una Series indexada por región." },
          ],
          solution: `import pandas as pd
import io
ventas_csv = \"\"\"producto,region,precio,cantidad
Tornillo,Norte,0.15,1500
Martillo,Sur,12.5,80
Pintura,Norte,45.0,40
Cable,Sur,3.2,400
Foco,Este,4.5,300
Cemento,Oeste,95.0,60
\"\"\"
df = pd.read_csv(io.StringIO(ventas_csv))
total_cantidad = df.groupby('region')['cantidad'].sum()
print(total_cantidad)`,
          check: { type: "output_contains", value: "region" },
        },
        {
          kind: "exercise",
          id: "groupby-multi-agg",
          level: "independiente",
          applies: ["pandas:groupby", "pandas:agg"],
          prompt:
            "Ahora sin tanto andamiaje. Calcula para cada región: (a) el número de ventas (count de 'producto'), (b) el precio promedio, (c) la cantidad total. Usa `.agg({...})` con un diccionario. Imprime el resultado.",
          starterCode: `import pandas as pd
import io

ventas_csv = \"\"\"producto,region,precio,cantidad
Tornillo,Norte,0.15,1500
Martillo,Sur,12.5,80
Pintura,Norte,45.0,40
Cable,Sur,3.2,400
Foco,Este,4.5,300
Cemento,Oeste,95.0,60
\"\"\"
df = pd.read_csv(io.StringIO(ventas_csv))

# Tu código: groupby + agg con diccionario

`,
          hints: [
            { level: "conceptual", text: "Quieres una fila por región, con tres columnas: conteo, promedio y suma. Cada una es una agregación distinta aplicada a una columna distinta." },
            { level: "tecnica", text: "Sintaxis: df.groupby('region').agg({'producto': 'count', 'precio': 'mean', 'cantidad': 'sum'}). El diccionario mapea columna → función." },
            { level: "codigo", text: "resumen = df.groupby('region').agg({\\n    'producto': 'count',\\n    'precio': 'mean',\\n    'cantidad': 'sum'\\n})\\nprint(resumen)" },
            { level: "solucion_explicada", text: "Resultado: una tabla con 4 filas (regiones) y 3 columnas. La columna 'producto' muestra cuántas ventas hay por región; 'precio' el promedio; 'cantidad' el total. Esta es la forma típica de construir un resumen de KPIs por categoría." },
          ],
          solution: `import pandas as pd
import io
ventas_csv = \"\"\"producto,region,precio,cantidad
Tornillo,Norte,0.15,1500
Martillo,Sur,12.5,80
Pintura,Norte,45.0,40
Cable,Sur,3.2,400
Foco,Este,4.5,300
Cemento,Oeste,95.0,60
\"\"\"
df = pd.read_csv(io.StringIO(ventas_csv))
resumen = df.groupby('region').agg({
    'producto': 'count',
    'precio': 'mean',
    'cantidad': 'sum'
})
print(resumen)`,
          check: { type: "no_error" },
        },
        {
          kind: "challenge",
          id: "top-region-ventas",
          context:
            "Te dan un DataFrame con ventas por producto y región. Tu gerente quiere un reporte de 1 página: ¿cuál es la región con mayor venta total, y qué porcentaje del total representa esa región?",
          data:
            "Columnas: producto, region, precio, cantidad. Las ventas totales se calculan como precio * cantidad.",
          objetivo:
            "Calcula (1) la venta total por región, (2) la región con la mayor venta, (3) qué porcentaje del total representa esa región. Imprime los tres resultados.",
          hints: [
            { level: "conceptual", text: "Descompón el problema: primero necesitas una columna de venta total por fila. Luego agrupar y sumar. Luego encontrar el máximo y calcular un porcentaje." },
            { level: "tecnica", text: "Pasos: (1) df['venta'] = df['precio'] * df['cantidad']. (2) ventas = df.groupby('region')['venta'].sum(). (3) top = ventas.idxmax() y ventas[top] / ventas.sum() * 100." },
            { level: "codigo", text: "df['venta'] = df['precio'] * df['cantidad']\nventas = df.groupby('region')['venta'].sum()\ntop_region = ventas.idxmax()\ntop_valor = ventas[top_region]\npct = top_valor / ventas.sum() * 100\nprint(f'Región top: {top_region}')\nprint(f'Venta: {top_valor:,.2f}')\nprint(f'% del total: {pct:.2f}%')" },
            { level: "solucion_explicada", text: "Este es el patrón clásico de un análisis exploratorio: derivar → agrupar → encontrar el máximo → comparar contra el total. Es lo que harías en un dashboard de ventas." },
          ],
          solution: `df['venta'] = df['precio'] * df['cantidad']
ventas = df.groupby('region')['venta'].sum()
top_region = ventas.idxmax()
top_valor = ventas[top_region]
pct = top_valor / ventas.sum() * 100
print(f"Región top: {top_region}")
print(f"Venta total: {top_valor:,.2f}")
print(f"% del total: {pct:.2f}%")`,
        },
      ],
    },
    {
      id: "sort-values-counts",
      title: "sort_values y value_counts",
      blocks: [
        {
          kind: "text",
          title: "Ordenar y contar",
          body: "`df.sort_values('col', ascending=False)` ordena el DataFrame por una columna (descendente si `ascending=False`). Para varias columnas: `df.sort_values(['c1','c2'], ascending=[True, False])`. El método `.value_counts()` sobre una Series cuenta la frecuencia de cada valor único — perfecto para responder '¿cuántos productos por categoría?' o '¿cuántas ventas por región?'. Ambos métodos devuelven un nuevo objeto (no modifican el original) salvo que pases `inplace=True`.",
        },
        {
          kind: "codecell",
          caption: "Ordenar y contar",
          code: `import pandas as pd
import io

${VENTAS_CSV_PY}

df = pd.read_csv(io.StringIO(ventas_csv))
df['venta_bruta'] = df['precio'] * df['cantidad']

# Top 3 productos por venta bruta
top3 = df.sort_values('venta_bruta', ascending=False).head(3)
print("Top 3 ventas:")
print(top3[['producto', 'venta_bruta']])

# Conteo por categoría y por región
print("\\nProductos por categoría:")
print(df['categoria'].value_counts())

print("\\nProductos por región:")
print(df['region'].value_counts())`,
        },
      ],
    },
    {
      id: "limpieza",
      title: "Valores faltantes y duplicados",
      blocks: [
        {
          kind: "text",
          title: "Limpiar antes de analizar",
          body: "Los datasets reales casi siempre tienen valores faltantes (`NaN`) y duplicados. Pandas detecta nulos con `.isnull()` y `.isna()` (ambos equivalentes); `.isnull().sum()` cuenta nulos por columna. Para tratarlos: `.dropna()` elimina filas con nulos, `.fillna(valor)` los reemplaza (puede ser un escalar, la media de la columna, o el valor anterior con `method='ffill'`). Los duplicados se detectan con `.duplicated()` y se eliminan con `.drop_duplicates()`. La limpieza es un 60-80% del tiempo de un análisis — saltársela conduce a resultados sesgados.",
        },
        {
          kind: "codecell",
          caption: "Detectar y tratar nulos y duplicados",
          code: `import pandas as pd
import numpy as np

# DataFrame con problemas
df = pd.DataFrame({
    "producto": ["A", "B", "C", "A", None, "D"],
    "precio": [10, 20, None, 10, 5, 30],
    "cantidad": [100, 200, 150, 100, 50, None],
})

print("Datos originales:")
print(df)

print("\\nNulos por columna:")
print(df.isnull().sum())

print("\\nDuplicados:")
print(df.duplicated())

# Limpiar
df_limpio = df.drop_duplicates().copy()
df_limpio['precio'] = df_limpio['precio'].fillna(df_limpio['precio'].mean())
df_limpio['cantidad'] = df_limpio['cantidad'].fillna(0)
df_limpio = df_limpio.dropna(subset=['producto'])

print("\\nLimpio:")
print(df_limpio)`,
        },
      ],
    },
    {
      id: "merge",
      title: "Merge de dos tablas",
      blocks: [
        {
          kind: "text",
          title: "Combinar datasets",
          body: "`pd.merge(left, right, on='clave', how='inner')` combina dos DataFrames por una columna común. Es el equivalente al `JOIN` de SQL. El parámetro `how` controla el tipo: `'inner'` (intersección, solo claves en ambos), `'left'` (todas las de la izquierda), `'right'`, y `'outer'` (unión completa). En análisis industrial, el merge es ubicuo: enlazar ventas con productos para obtener nombres y categorías, o ventas con clientes para segmentar. Es vital que la columna clave exista y sea consistente en ambas tablas (sin tildes diferentes, sin espacios sobrantes).",
        },
        {
          kind: "codecell",
          caption: "Merge de productos y ventas",
          code: `import pandas as pd
import io

${VENTAS_CSV_PY}

df_ventas = pd.read_csv(io.StringIO(ventas_csv))

# Tabla auxiliar: categorías con su margen estándar
categorias = pd.DataFrame({
    "categoria": ["Ferretería", "Pintura", "Plomería", "Construcción", "Eléctrico"],
    "margen_pct": [0.20, 0.30, 0.25, 0.15, 0.35],
})

# Merge: enlaza ventas con margen por categoría
df_completo = pd.merge(df_ventas, categorias, on='categoria', how='left')
df_completo['venta_bruta'] = df_completo['precio'] * df_completo['cantidad']
df_completo['utilidad'] = df_completo['venta_bruta'] * df_completo['margen_pct']

print(df_completo[['producto', 'categoria', 'venta_bruta', 'utilidad']])`,
        },
      ],
    },
    {
      id: "mini-analisis-ventas",
      title: "Mini-proyecto: Análisis de ventas completo",
      blocks: [
        {
          kind: "text",
          title: "Pipeline completo",
          body: "Vamos a aplicar todo lo aprendido en un pipeline único: cargar el CSV → crear columna calculada → agrupar por categoría → ordenar por venta total → visualizar con matplotlib. Este es el patrón que repetirás en cada análisis: **cargar → limpiar → derivar → agregar → visualizar → interpretar**. Cada paso responde a una pregunta. El resultado final es una tabla resumen y un gráfico que comunica el hallazgo.",
        },
        {
          kind: "codecell",
          caption: "Pipeline completo de análisis de ventas",
          code: `import pandas as pd
import matplotlib.pyplot as plt
import io

${VENTAS_CSV_PY}

# 1. Cargar
df = pd.read_csv(io.StringIO(ventas_csv))

# 2. Limpiar (en este dataset ya está limpio, pero verifiquemos)
print("Nulos por columna:")
print(df.isnull().sum())

# 3. Derivar
df['venta_bruta'] = df['precio'] * df['cantidad']

# 4. Agregar por categoría
resumen = df.groupby('categoria').agg(
    n_productos=('producto', 'count'),
    venta_total=('venta_bruta', 'sum'),
    precio_medio=('precio', 'mean'),
).reset_index().sort_values('venta_total', ascending=False)

print("\\nResumen por categoría:")
print(resumen)

# 5. Visualizar
plt.figure(figsize=(8, 4))
plt.bar(resumen['categoria'], resumen['venta_total'], color='#10b981')
plt.title('Venta total por categoría (USD)')
plt.xlabel('Categoría')
plt.ylabel('Venta total')
plt.xticks(rotation=20)
plt.tight_layout()
plt.show()`,
        },
        {
          kind: "challenge",
          id: "top-region",
          context:
            "Usa el mismo dataset de ventas y calcula el total de venta_bruta por región. Devuelve la región con mayor venta y su valor.",
          objetivo:
            "Imprime el nombre de la región ganadora y su venta total (con dos decimales).",
          hints: [
            "Calcula `df['venta_bruta'] = df['precio'] * df['cantidad']`.",
            "Agrupa: `g = df.groupby('region')['venta_bruta'].sum()`.",
            "Encuentra el máximo: `g.idxmax()` y `g.max()`.",
          ],
          solution: `import pandas as pd
import io
${VENTAS_CSV_PY}
df = pd.read_csv(io.StringIO(ventas_csv))
df['venta_bruta'] = df['precio'] * df['cantidad']
g = df.groupby('region')['venta_bruta'].sum()
print(g.idxmax(), g.max())`,
        },
      ],
    },
  ],
};

// Helper used by content code cells: returns the CSV as a Python triple-quoted string assignment.
export const PANDAS_VENTAS_HELPER = VENTAS_CSV_PY;
