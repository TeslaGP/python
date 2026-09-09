import type { Module } from "@/lib/types";
import { analistaDatasetCsv } from "@/content/datasets";

const ANA_CSV = `ana_csv = """${analistaDatasetCsv.replace(/"""/g, '\\"\\"\\"')}"""`;

export const dataAnalysisProject: Module = {
  id: "data-analysis-project",
  title: "¿Cómo trabaja un analista?",
  level: 11,
  icon: "Workflow",
  description:
    "Un proyecto guiado de 12 pasos sobre 500 ventas: comprender, cargar, limpiar, derivar, analizar, comunicar. De datos a decisión.",
  lessons: [
    {
      id: "paso-1-comprender",
      title: "1. Comprender el problema",
      blocks: [
        {
          kind: "text",
          title: "Antes del código, la pregunta",
          body: "El error más caro del analista novato es abrir el CSV y empezar a graficar sin entender qué pregunta de negocio debe responder. Imagina este caso: el director comercial pide '¿qué productos y regiones están creciendo más?'. Antes de tocar el teclado, descompón la pregunta: **(1)** ¿Qué significa 'creciendo'? ¿Comparar este año vs el anterior? ¿Mes a mes? **(2)** ¿Crecer en qué — cantidad, venta bruta, margen? **(3)** ¿Qué granularidad — por producto, por categoría, por región? Esta clarificación toma 10 minutos y ahorra horas de análisis inútil. La pregunta bien formulada es el 50% del trabajo.",
        },
        {
          kind: "codecell",
          caption: "Pregunta de negocio del proyecto",
          code: `# Pregunta: ¿Qué categoría y región generaron más utilidad en 2023-2024?
# 
# Descomposición:
#   - Métrica: utilidad = (precio - costo) * cantidad
#   - Dimensión 1: categoría
#   - Dimensión 2: región
#   - Periodo: 2023-2024 (todo el dataset)
#
# Subpreguntas derivadas:
#   - ¿Qué categoría tiene mejor margen?
#   - ¿Qué canal vende más por categoría?
#   - ¿Hay regiones donde una categoría específica no vende?

print("Pregunta registrada. Próximo paso: cargar los datos.")`,
        },
      ],
    },
    {
      id: "paso-2-cargar",
      title: "2. Cargar los datos",
      blocks: [
        {
          kind: "text",
          title: "Del archivo al DataFrame",
          body: "El dataset del analista vive como CSV. En un entorno real lo leerías con `pd.read_csv('ruta/archivo.csv')`. Aquí, como no hay sistema de archivos, usamos una cadena CSV en memoria con `pd.read_csv(io.StringIO(cadena))`. Tras cargar, **siempre** verifica con `.shape` y `.head()` que la carga fue correcta: número esperado de filas, tipos correctos, columnas presentes.",
        },
        {
          kind: "codecell",
          caption: "Cargar el dataset de 500 ventas",
          code: `import pandas as pd
import io

${ANA_CSV}

df = pd.read_csv(io.StringIO(ana_csv))

print("Shape:", df.shape)
print("Columnas:", list(df.columns))
print("\\nPrimeras filas:")
print(df.head())`,
        },
      ],
    },
    {
      id: "paso-3-inspeccionar",
      title: "3. Inspeccionar",
      blocks: [
        {
          kind: "text",
          title: "La primera mirada honesta",
          body: "Inspeccionar es responder cuatro preguntas antes de cualquier análisis: **(1)** ¿Qué forma tiene? (`df.shape`). **(2)** ¿Qué tipos tiene cada columna? (`df.dtypes`, `df.info()`). **(3)** ¿Cómo se ven las filas? (`df.head`, `df.sample`). **(4)** ¿Hay nulos o duplicados? (`df.isnull().sum()`, `df.duplicated().sum()`). En proyectos reales, los tipos suelen ser sorpresa: una columna que debería ser número es texto porque viene con comas o símbolos de moneda. La inspección los detecta antes de que rompan el análisis.",
        },
        {
          kind: "codecell",
          code: `import pandas as pd
import io

${ANA_CSV}

df = pd.read_csv(io.StringIO(ana_csv))

print("=== SHAPE ===")
print(df.shape)

print("\\n=== DTYPES ===")
print(df.dtypes)

print("\\n=== INFO ===")
df.info()

print("\\n=== NULOS ===")
print(df.isnull().sum())

print("\\n=== DUPLICADOS ===")
print(df.duplicated().sum())`,
        },
      ],
    },
    {
      id: "paso-4-limpiar",
      title: "4. Limpiar",
      blocks: [
        {
          kind: "text",
          title: "Datos confiables, análisis confiable",
          body: "La limpieza tiene tres frentes: **(1)** nulos — eliminarlos o rellenarlos según el contexto. **(2)** duplicados — quitar las filas repetidas por clave única. **(3)** tipos — convertir columnas que llegaron como texto a su tipo correcto (fechas a `datetime`, números a `float`). En este dataset ya está relativamente limpio, pero comprobaremos los tipos de fecha y nos aseguraremos de que la columna `fecha` sea `datetime` para permitir operaciones temporales.",
        },
        {
          kind: "codecell",
          code: `import pandas as pd
import io

${ANA_CSV}

df = pd.read_csv(io.StringIO(ana_csv))

# Convertir fecha a datetime
df['fecha'] = pd.to_datetime(df['fecha'])

# Eliminar duplicados por venta_id (clave única)
n_antes = len(df)
df = df.drop_duplicates(subset=['venta_id'])
n_despues = len(df)
print(f"Filas antes/después de drop_duplicates: {n_antes}/{n_despues}")

# Verificar nulos tras limpieza
print("\\nNulos tras limpieza:")
print(df.isnull().sum())

# Nuevos dtypes
print("\\nDtypes tras limpieza:")
print(df.dtypes)`,
        },
      ],
    },
    {
      id: "paso-5-crear-variables",
      title: "5. Crear variables derivadas",
      blocks: [
        {
          kind: "text",
          title: "Calcular para responder",
          body: "Para responder la pregunta de negocio (¿qué categoría/región genera más utilidad?) necesitamos una columna `utilidad`. Esta se deriva como `(precio - costo) * cantidad`. También crearemos `venta_bruta`, `margen_pct` y variables temporales (`mes`, `año`) para futuras agregaciones. Crear variables derivadas es el paso donde el analista demuestra que entiende el negocio: no es solo manipular columnas, es modelar los KPIs correctos.",
        },
        {
          kind: "codecell",
          code: `import pandas as pd
import io

${ANA_CSV}

df = pd.read_csv(io.StringIO(ana_csv))
df['fecha'] = pd.to_datetime(df['fecha'])

# KPIs por venta
df['venta_bruta'] = df['precio'] * df['cantidad']
df['costo_total'] = df['costo'] * df['cantidad']
df['utilidad'] = df['venta_bruta'] - df['costo_total']
df['margen_pct'] = df['utilidad'] / df['venta_bruta'] * 100

# Variables temporales
df['mes'] = df['fecha'].dt.month
df['año'] = df['fecha'].dt.year
df['trimestre'] = df['fecha'].dt.quarter

print(df[['producto', 'cantidad', 'precio', 'costo', 'venta_bruta', 'utilidad', 'margen_pct']].head())
print("\\nNuevas columnas:", ['venta_bruta','costo_total','utilidad','margen_pct','mes','año','trimestre'])`,
        },
      ],
    },
    {
      id: "paso-6-explorar",
      title: "6. Explorar",
      blocks: [
        {
          kind: "text",
          title: "Generar hipótesis",
          body: "Explorar es hacerse preguntas rápidas y responderlas con agregaciones: ¿cuántas categorías hay? ¿Cuántas regiones? ¿Cómo se distribuyen las ventas por canal? El objetivo no es concluir, sino **formular hipótesis** que se verificarán más adelante. La exploración debe ser rápida: 5-10 minutos, no más. Si te atascaste, vuelve a la pregunta inicial.",
        },
        {
          kind: "codecell",
          code: `import pandas as pd
import io

${ANA_CSV}

df = pd.read_csv(io.StringIO(ana_csv))
df['venta_bruta'] = df['precio'] * df['cantidad']
df['utilidad'] = (df['precio'] - df['costo']) * df['cantidad']

print("Categorías:", df['categoria'].nunique(), df['categoria'].unique())
print("\\nRegiones:", df['region'].unique())
print("\\nCanales:", df['canal'].unique())

print("\\nVenta total por canal:")
print(df.groupby('canal')['venta_bruta'].agg(['sum', 'mean', 'count']))

print("\\nUtilidad total por categoría:")
print(df.groupby('categoria')['utilidad'].sum().sort_values(ascending=False))`,
        },
      ],
    },
    {
      id: "paso-7-analizar",
      title: "7. Analizar (responder la pregunta)",
      blocks: [
        {
          kind: "text",
          title: "Llegar a la respuesta",
          body: "Aquí respondemos la pregunta de negocio: ¿qué categoría y región generaron más utilidad? Usamos groupby por dos dimensiones (categoría × región), agregamos utilidad, ordenamos y nos quedamos con el top. La respuesta es una **tabla**, no un número suelto: el analista entrega resultados accionables, no summaries vagos.",
        },
        {
          kind: "codecell",
          code: `import pandas as pd
import io

${ANA_CSV}

df = pd.read_csv(io.StringIO(ana_csv))
df['utilidad'] = (df['precio'] - df['costo']) * df['cantidad']

# Top 5 combinaciones categoría × región por utilidad
resumen = df.groupby(['categoria', 'region'])['utilidad'].sum().reset_index()
resumen = resumen.sort_values('utilidad', ascending=False)
print("Top 5 categoría × región por utilidad:")
print(resumen.head())

# Por categoría: ranking de utilidad
print("\\nRanking de categorías por utilidad:")
print(df.groupby('categoria')['utilidad'].sum().sort_values(ascending=False))

# Por región: ranking
print("\\nRanking de regiones por utilidad:")
print(df.groupby('region')['utilidad'].sum().sort_values(ascending=False))`,
        },
      ],
    },
    {
      id: "paso-8-visualizar",
      title: "8. Visualizar",
      blocks: [
        {
          kind: "text",
          title: "Una imagen para comunicar",
          body: "El cerebro humano procesa imágenes más rápido que tablas. Vamos a construir un dashboard de 4 gráficos: (1) barras de utilidad por categoría, (2) barras por región, (3) evolución temporal de la utilidad mensual, (4) scatter de precio vs cantidad. Cada gráfico responde una pregunta distinta. Evita los gráficos de tarta (pie) salvo para 2-3 categorías: con más, son ilegibles.",
        },
        {
          kind: "codecell",
          code: `import pandas as pd
import matplotlib.pyplot as plt
import io

${ANA_CSV}

df = pd.read_csv(io.StringIO(ana_csv))
df['fecha'] = pd.to_datetime(df['fecha'])
df['utilidad'] = (df['precio'] - df['costo']) * df['cantidad']
df['venta_bruta'] = df['precio'] * df['cantidad']

fig, axes = plt.subplots(2, 2, figsize=(13, 8))

# (1) Utilidad por categoría
df.groupby('categoria')['utilidad'].sum().sort_values().plot(
    kind='barh', ax=axes[0, 0], color='#10b981')
axes[0, 0].set_title('Utilidad total por categoría')
axes[0, 0].set_xlabel('USD')

# (2) Utilidad por región
df.groupby('region')['utilidad'].sum().sort_values().plot(
    kind='barh', ax=axes[0, 1], color='#0d9488')
axes[0, 1].set_title('Utilidad total por región')
axes[0, 1].set_xlabel('USD')

# (3) Evolución mensual
mensual = df.groupby(df['fecha'].dt.to_period('M'))['utilidad'].sum()
mensual.plot(ax=axes[1, 0], color='#f59e0b', marker='o')
axes[1, 0].set_title('Evolución mensual de utilidad')
axes[1, 0].set_xlabel('Mes')
axes[1, 0].tick_params(axis='x', rotation=45)
axes[1, 0].grid(True, alpha=0.3)

# (4) Precio vs cantidad
axes[1, 1].scatter(df['precio'], df['cantidad'], alpha=0.4, color='#ef4444')
axes[1, 1].set_title('Precio vs Cantidad vendida')
axes[1, 1].set_xlabel('Precio')
axes[1, 1].set_ylabel('Cantidad')

plt.tight_layout()
plt.show()`,
        },
      ],
    },
    {
      id: "paso-9-patrones",
      title: "9. Buscar patrones",
      blocks: [
        {
          kind: "text",
          title: "¿Qué se repite? ¿Qué se rompe?",
          body: "Tras responder la pregunta principal, busca patrones secundarios: ¿hay estacionalidad (meses pico)? ¿Algún producto es sistemáticamente deficitario? ¿El canal online crece mientras el retail cae? Los patrones son a menudo más valiosos que la respuesta principal: revelan oportunidades y riesgos. Usa `value_counts`, agrupaciones temporales y tablas cruzadas (`pd.crosstab`).",
        },
        {
          kind: "codecell",
          code: `import pandas as pd
import io

${ANA_CSV}

df = pd.read_csv(io.StringIO(ana_csv))
df['fecha'] = pd.to_datetime(df['fecha'])
df['utilidad'] = (df['precio'] - df['costo']) * df['cantidad']

# Estacionalidad: ventas por mes
print("Ventas por mes:")
print(df.groupby(df['fecha'].dt.month)['venta_id'].count())

# Tabla cruzada: categoría × canal
print("\\nTabla cruzada categoría × canal:")
print(pd.crosstab(df['categoria'], df['canal']))

# Margen por canal
print("\\nMargen medio por canal:")
df['margen_pct'] = df['utilidad'] / (df['precio'] * df['cantidad']) * 100
print(df.groupby('canal')['margen_pct'].mean().round(2))`,
        },
      ],
    },
    {
      id: "paso-10-conclusiones",
      title: "10. Conclusiones",
      blocks: [
        {
          kind: "text",
          title: "Sintetizar el hallazgo",
          body: "Las conclusiones se redactan en texto plano, no en gráficos. Cada conclusión debe ser **específica** (no 'las ventas subieron', sino 'las ventas de Construcción en la región Norte crecieron 23% en Q2'), **atribuible** (cuando sea posible, a una causa) y **accionable** (sugerir una acción). Un buen informe tiene 3-5 conclusiones, no 20. Demasiadas conclusiones diluyen el mensaje.",
        },
        {
          kind: "codecell",
          caption: "Imprimir conclusiones numéricas que sustenten el informe",
          code: `import pandas as pd
import io

${ANA_CSV}

df = pd.read_csv(io.StringIO(ana_csv))
df['utilidad'] = (df['precio'] - df['costo']) * df['cantidad']
df['venta_bruta'] = df['precio'] * df['cantidad']

# Hallazgos numéricos
top_cat = df.groupby('categoria')['utilidad'].sum().idxmax()
top_cat_val = df.groupby('categoria')['utilidad'].sum().max()
top_reg = df.groupby('region')['utilidad'].sum().idxmax()
top_reg_val = df.groupby('region')['utilidad'].sum().max()
margen_global = df['utilidad'].sum() / df['venta_bruta'].sum() * 100

print("=== CONCLUSIONES ===")
print(f"1. La categoría más rentable es {top_cat} con {top_cat_val:,.0f} USD de utilidad.")
print(f"2. La región más rentable es {top_reg} con {top_reg_val:,.0f} USD.")
print(f"3. El margen global promedio es {margen_global:.1f}%.")
print(f"4. Total de ventas analizadas: {len(df)} transacciones.")
print(f"5. Venta bruta total: {df['venta_bruta'].sum():,.0f} USD.")`,
        },
      ],
    },
    {
      id: "paso-11-recomendar",
      title: "11. Recomendar",
      blocks: [
        {
          kind: "text",
          title: "De hallazgo a acción",
          body: "Una conclusión dice 'esto es lo que vi'. Una recomendación dice 'esto es lo que yo haría al respecto'. Las recomendaciones deben ser **concretas** (no 'mejorar la operación', sino 'reducir el lead time del producto X en un 15%'), **priorizadas** (top 3, no top 30) y **factibles** (dentro del alcance del negocio). El analista no decide — propone. La gerencia decide con los datos y las recomendaciones sobre la mesa.",
        },
        {
          kind: "codecell",
          code: `# Recomendaciones basadas en el análisis anterior (no se ejecutan, son texto)
recomendaciones = [
    "1. Concentrar presupuesto de marketing en la categoría top (mayor margen).",
    "2. Revisar mix de productos en la región menos rentable — posible saturación o falta de demanda.",
    "3. Replicar prácticas del canal más rentable en los otros canales.",
    "4. Para el próximo trimestre, monitorear los productos con margen < 10% — candidatos a reprice.",
    "5. Establecer un KPI mensual: seguimiento de utilidad por categoría × región.",
]

for r in recomendaciones:
    print(r)`,
        },
      ],
    },
    {
      id: "paso-12-comunicar",
      title: "12. Comunicar",
      blocks: [
        {
          kind: "text",
          title: "El informe final",
          body: "El análisis termina cuando alguien lo entiende y actúa. El formato ideal de un informe ejecutivo (1 página): **(1)** Pregunta de negocio (1 frase). **(2)** Resumen ejecutivo (3-5 bullets con los hallazgos clave). **(3)** Un dashboard visual (1 figura con 4 subplots). **(4)** Recomendaciones accionables (3, priorizadas). **(5)** Anexo técnico (metodología, datos usados, limitaciones). Si el informe cabe en una página y se entiende sin conocimientos técnicos, está bien. Si necesitas 10 páginas para que el gerente entienda, vuelve a empezar.",
        },
        {
          kind: "codecell",
          caption: "Dashboard final del proyecto",
          code: `import pandas as pd
import matplotlib.pyplot as plt
import io

${ANA_CSV}

df = pd.read_csv(io.StringIO(ana_csv))
df['fecha'] = pd.to_datetime(df['fecha'])
df['utilidad'] = (df['precio'] - df['costo']) * df['cantidad']
df['venta_bruta'] = df['precio'] * df['cantidad']

fig, axes = plt.subplots(2, 2, figsize=(13, 8))

# Resumen ejecutivo en texto
resumen = (
    f"Total analizado: {len(df):,} ventas\\n"
    f"Utilidad total: {df['utilidad'].sum():,.0f} USD\\n"
    f"Margen global: {df['utilidad'].sum()/df['venta_bruta'].sum()*100:.1f}%\\n"
    f"Mejor categoría: {df.groupby('categoria')['utilidad'].sum().idxmax()}\\n"
    f"Mejor región: {df.groupby('region')['utilidad'].sum().idxmax()}"
)
axes[0, 0].axis('off')
axes[0, 0].text(0.05, 0.9, 'Resumen ejecutivo', fontsize=14, fontweight='bold',
                transform=axes[0, 0].transAxes)
axes[0, 0].text(0.05, 0.5, resumen, fontsize=11, family='monospace',
                transform=axes[0, 0].transAxes, verticalalignment='center')

# Top categorías
df.groupby('categoria')['utilidad'].sum().sort_values().plot(
    kind='barh', ax=axes[0, 1], color='#10b981')
axes[0, 1].set_title('Utilidad por categoría')

# Evolución mensual
mensual = df.groupby(df['fecha'].dt.to_period('M'))['utilidad'].sum()
mensual.plot(ax=axes[1, 0], color='#f59e0b', marker='o')
axes[1, 0].set_title('Evolución mensual')
axes[1, 0].tick_params(axis='x', rotation=45)

# Por canal
df.groupby('canal')['utilidad'].sum().plot(
    kind='pie', ax=axes[1, 1], autopct='%1.1f%%', colors=['#10b981','#0d9488','#14b8a6'])
axes[1, 1].set_title('Utilidad por canal')

plt.suptitle('Informe ejecutivo — Ventas 2023-2024', fontsize=14, fontweight='bold', y=1.005)
plt.tight_layout()
plt.show()`,
        },
        {
          kind: "challenge",
          id: "proyecto-pregunta-libre",
          context:
            "Has completado el proyecto guiado. Ahora formula tú mismo una pregunta nueva sobre este dataset y responde con código.",
          objetivo:
            "Elige una pregunta (por ejemplo: '¿qué canal tiene el ticket promedio más alto?' o '¿cuál es el producto con mayor rotación?') y respóndela en código.",
          hints: [
            "Define la pregunta en un comentario, luego implementa.",
            "Ejemplo: ticket promedio por canal = df.groupby('canal')['venta_bruta'].mean().",
          ],
          solution: `import pandas as pd
import io
${ANA_CSV}
df = pd.read_csv(io.StringIO(ana_csv))
df['venta_bruta'] = df['precio'] * df['cantidad']
ticket = df.groupby('canal')['venta_bruta'].mean()
print(ticket)`,
        },
      ],
    },
  ],
};
