import type { Module } from "@/lib/types";
import { analistaDatasetCsv } from "@/content/datasets";

const ANA_CSV = `ana_csv = """${analistaDatasetCsv.replace(/"""/g, '\\"\\"\\"')}"""`;

export const edaModule: Module = {
  id: "eda",
  title: "Análisis exploratorio (EDA)",
  level: 8,
  icon: "Search",
  description:
    "Inspeccionar, formular preguntas, resumir y limpiar un dataset nuevo. La primera mirada responsable a los datos.",
  lessons: [
    {
      id: "inspeccion-basica",
      title: "Inspección básica del dataset",
      blocks: [
        {
          kind: "text",
          title: "Las cuatro preguntas iniciales",
          body: "Al recibir un dataset nuevo, un analista responde cuatro preguntas antes de cualquier análisis: **(1)** ¿Qué forma tiene? (`df.shape` → filas × columnas). **(2)** ¿Qué columnas tiene y de qué tipo? (`df.columns`, `df.dtypes`, `df.info()`). **(3)** ¿Cómo se ven las primeras filas? (`df.head()`). **(4)** ¿Hay valores nulos o duplicados? (`df.isnull().sum()`, `df.duplicated().sum()`). Estas cuatro preguntas, en cinco minutos, te dan el 80% del contexto. Saltárselas conduce a errores de suposición (creer que una columna es numérica cuando es texto, o asumir que no hay duplicados).",
        },
        {
          kind: "codecell",
          caption: "Las cuatro preguntas iniciales sobre el dataset del analista",
          code: `import pandas as pd
import io

${ANA_CSV}

df = pd.read_csv(io.StringIO(ana_csv))

print("1. Shape:", df.shape)
print("\\n2. Columnas y tipos:")
print(df.dtypes)
print("\\n3. Primeras filas:")
print(df.head())
print("\\n4. Nulos por columna:")
print(df.isnull().sum())`,
        },
        {
          kind: "exercise",
          id: "info-dataset",
          prompt:
            "Carga el dataset `ana_csv` y muestra `df.info()`. Responde: ¿cuántas filas tiene el dataset? Imprime el número usando `df.shape[0]`.",
          starterCode: `import pandas as pd
import io

${ANA_CSV}

df = pd.read_csv(io.StringIO(ana_csv))

print()
`,
          hints: [
            "`df.info()` muestra el resumen.",
            "`df.shape[0]` devuelve el número de filas; debe ser 500.",
          ],
          solution: `import pandas as pd
import io
${ANA_CSV}
df = pd.read_csv(io.StringIO(ana_csv))
df.info()
print(df.shape[0])`,
          check: { type: "output_contains", value: "500" },
        },
      ],
    },
    {
      id: "describe",
      title: "df.describe: ¿qué pregunta cada estadística?",
      blocks: [
        {
          kind: "text",
          title: "Resumen estadístico",
          body: "`df.describe()` devuelve las estadísticas básicas (count, mean, std, min, cuartiles, max) de cada columna numérica. Cada estadística responde a una pregunta distinta: **mean** → '¿cuál es el valor típico?'; **std** → '¿qué tan variable es?'; **min/max** → '¿entre qué rangos se mueve?'; **cuartiles** → '¿cómo se distribuye la mayoría?'. La regla: si `std` >> `mean`, hay alta variabilidad (puede haber outliers). Si la mediana (50%) difiere mucho de la media, hay asimetría. `describe(include='all')` incluye columnas categóricas (count, unique, top, freq).",
        },
        {
          kind: "codecell",
          caption: "Resumen estadístico del dataset",
          code: `import pandas as pd
import io

${ANA_CSV}

df = pd.read_csv(io.StringIO(ana_csv))

# Resumen numérico
print("Resumen numérico:")
print(df.describe())

# Resumen categórico
print("\\nResumen categórico:")
print(df.describe(include='object'))`,
        },
      ],
    },
    {
      id: "valores-faltantes",
      title: "Valores faltantes: detectar y tratar",
      blocks: [
        {
          kind: "text",
          title: "Los NaN no se ignoran",
          body: "Un `NaN` (Not a Number) es un valor ausente. Pandas lo representa como `np.nan`. Detectarlos es obligatorio antes de cualquier agregación: `df.isnull().sum()` por columna, `df.isnull().sum().sum()` para el total. Las decisiones típicas: **(1)** si son pocos (<5%) → eliminar las filas con `dropna()`. **(2)** Si son muchos en una columna → rellenar con `fillna(media)` o `fillna(mediana)`. **(3)** Si una columna tiene >50% de nulos → considerarla para eliminar la columna entera. La opción elegida depende del contexto: no es lo mismo un NaN en 'edad' que en 'fecha_nacimiento'.",
        },
        {
          kind: "codecell",
          caption: "Análisis de nulos",
          code: `import pandas as pd
import numpy as np
import io

${ANA_CSV}

df = pd.read_csv(io.StringIO(ana_csv))

# Inyectamos algunos nulos artificialmente para demostrar
df.loc[df.sample(20).index, 'costo'] = np.nan
df.loc[df.sample(15).index, 'cantidad'] = np.nan

# Conteo por columna
print("Nulos por columna:")
print(df.isnull().sum())

# % de nulos por columna
print("\\n% de nulos por columna:")
print((df.isnull().sum() / len(df) * 100).round(2))

# Tratamiento: rellenar con la mediana
df['costo'] = df['costo'].fillna(df['costo'].median())
df['cantidad'] = df['cantidad'].fillna(df['cantidad'].median())

print("\\nTras rellenar:")
print(df.isnull().sum())`,
        },
      ],
    },
    {
      id: "duplicados",
      title: "Duplicados",
      blocks: [
        {
          kind: "text",
          title: "Filas repetidas",
          body: "Los duplicados pueden ser **totales** (la fila completa coincide con otra) o **parciales** (una clave lógica como `cliente_id` se repite cuando no debería). `df.duplicated()` marca filas totales duplicadas. `df.duplicated(subset=['col1','col2'])` marca duplicados por clave parcial. Para eliminar: `df.drop_duplicates()`. En datasets de ventas, los duplicados suelen provenir de errores de carga (un CSV importado dos veces) o de bugs del sistema transaccional. Siempre sanea antes de agregar.",
        },
        {
          kind: "codecell",
          caption: "Detectar y eliminar duplicados",
          code: `import pandas as pd
import io

${ANA_CSV}

df = pd.read_csv(io.StringIO(ana_csv))

# Duplicados totales
print("Duplicados totales:", df.duplicated().sum())

# Duplicados por clave única (venta_id debería ser único)
print("Duplicados de venta_id:", df.duplicated(subset=['venta_id']).sum())

# Eliminar si los hubiera
df_sin_dup = df.drop_duplicates()
print("Filas antes/después:", len(df), len(df_sin_dup))`,
        },
      ],
    },
    {
      id: "distribuciones-categoria",
      title: "Distribuciones por categoría",
      blocks: [
        {
          kind: "text",
          title: "¿Qué categorías dominan?",
          body: "`df['col'].value_counts()` cuenta la frecuencia de cada valor en una columna categórica. Es la forma más rápida de responder '¿cuántos productos por categoría?' o '¿cuántas ventas por región?'. Visualizarlo con `value_counts().plot(kind='bar')` da una imagen inmediata de qué categorías dominan. Cuando la categoría tiene muchos valores únicos, conviene mostrar solo el top N con `.head(10)` y agrupar el resto como 'Otros'.",
        },
        {
          kind: "codecell",
          caption: "Distribución por categoría y región",
          code: `import pandas as pd
import matplotlib.pyplot as plt
import io

${ANA_CSV}

df = pd.read_csv(io.StringIO(ana_csv))

# Conteos
print("Ventas por categoría:")
print(df['categoria'].value_counts())

print("\\nVentas por región:")
print(df['region'].value_counts())

# Visualización: barras de categoría
fig, axes = plt.subplots(1, 2, figsize=(10, 4))
df['categoria'].value_counts().plot(kind='bar', ax=axes[0], color='#10b981')
axes[0].set_title('Ventas por categoría')
axes[0].tick_params(axis='x', rotation=20)

df['region'].value_counts().plot(kind='bar', ax=axes[1], color='#0d9488')
axes[1].set_title('Ventas por región')
plt.tight_layout()
plt.show()`,
        },
      ],
    },
    {
      id: "mini-eda",
      title: "Mini-proyecto: EDA sobre 500 ventas",
      blocks: [
        {
          kind: "text",
          title: "EDA en estado puro",
          body: "Vamos a ejecutar el flujo EDA completo sobre el dataset de 500 ventas: inspección → nulos → duplicados → resumen estadístico → agrupaciones clave → visualizaciones. El objetivo no es llegar a una conclusión, sino **familiarizarse con el dataset** y generar hipótesis. Un buen EDA termina con tres o cuatro hallazgos accionables que se pueden llevar a una reunión.",
        },
        {
          kind: "codecell",
          caption: "EDA completo — ejecútalo y responde",
          code: `import pandas as pd
import matplotlib.pyplot as plt
import io

${ANA_CSV}

df = pd.read_csv(io.StringIO(ana_csv))

print("=== SHAPE ===")
print(df.shape)

print("\\n=== INFO ===")
df.info()

print("\\n=== DESCRIBE NUMÉRICO ===")
print(df.describe())

print("\\n=== NULOS ===")
print(df.isnull().sum())

print("\\n=== CATEGORÍAS ===")
for c in ['categoria', 'region', 'canal']:
    print(f"\\n{c}:")
    print(df[c].value_counts())

# Derivar venta total
df['venta_total'] = df['precio'] * df['cantidad']

# Top 5 productos por venta total
print("\\n=== TOP 5 PRODUCTOS POR VENTA ===")
print(df.groupby('producto')['venta_total'].sum().sort_values(ascending=False).head(5))

# Venta total por canal
print("\\n=== VENTA POR CANAL ===")
print(df.groupby('canal')['venta_total'].agg(['sum', 'mean', 'count']))

# Visualización final
fig, axes = plt.subplots(2, 2, figsize=(12, 8))
df['categoria'].value_counts().plot(kind='bar', ax=axes[0, 0], color='#10b981')
axes[0, 0].set_title('Ventas por categoría')

df.groupby('region')['venta_total'].sum().plot(kind='bar', ax=axes[0, 1], color='#0d9488')
axes[0, 1].set_title('Venta total por región')

df['precio'].hist(bins=30, ax=axes[1, 0], color='#f59e0b', edgecolor='white')
axes[1, 0].set_title('Distribución de precios')

df.groupby('canal')['venta_total'].sum().plot(kind='pie', ax=axes[1, 1], autopct='%1.1f%%')
axes[1, 1].set_title('Participación por canal')

plt.tight_layout()
plt.show()`,
        },
      ],
    },
  ],
};
