import type { Module } from "@/lib/types";

export const sqlModule: Module = {
  id: "sql",
  title: "SQL",
  level: 10,
  icon: "DatabaseZap",
  description:
    "SELECT, WHERE, GROUP BY, JOIN. SQL ejecutándose de verdad en tu navegador con sql.js (SQLite en WebAssembly).",
  lessons: [
    {
      id: "select-from-where",
      title: "SELECT, FROM, WHERE",
      blocks: [
        {
          kind: "text",
          title: "La consulta más básica",
          body: "La estructura de toda consulta SQL es: `SELECT columnas FROM tabla WHERE condición`. `SELECT` elige qué columnas devolver, `FROM` indica la tabla, `WHERE` filtra filas. En este laboratorio, las consultas se ejecutan sobre una base SQLite en memoria con tres tablas precargadas: `empleados` (30 filas), `productos` (40 filas) y `ventas` (200 filas). Modifica la consulta del componente inferior y pulsa 'Ejecutar SQL'. La barra lateral muestra el esquema disponible. SQL es el lenguaje universal de los datos: aprenderlo te permite hablar con cualquier base de datos relacional.",
        },
        {
          kind: "visualization",
          component: "SqlQueryVisualizer",
          props: { initialQuery: "SELECT * FROM productos LIMIT 10;" },
        },
        {
          kind: "concept",
          problema: "Queremos ver todos los productos cuyo precio supera 50 USD.",
          idea: "SELECT + WHERE filtra por una condición simple.",
          codigo: `-- Esta consulta se ejecuta en el visor SQL inferior.
-- Pruébala ahí abajo cambiando el cuadro de texto.

SELECT producto_id, nombre, categoria, precio
FROM productos
WHERE precio > 50;`,
          interpretacion:
            "La cláusula WHERE filtra antes de devolver resultados, lo que es eficiente: la base de datos no transfiere filas innecesarias. Los operadores típicos: `=`, `<>` (distinto), `<`, `>`, `<=`, `>=`, `BETWEEN x AND y`, `IN (a, b, c)`, `LIKE '%texto%'`.",
        },
      ],
    },
    {
      id: "order-limit",
      title: "ORDER BY y LIMIT",
      blocks: [
        {
          kind: "text",
          title: "Ordenar y limitar",
          body: "`ORDER BY columna` ordena los resultados ascendentemente (por defecto) o descendentemente con `DESC`. `LIMIT n` restringe el número de filas devueltas. Juntos permiten responder '¿cuáles son los 5 productos más caros?' o '¿cuáles las 3 ventas más recientes?'. El orden por defecto es ascendente (ASC), no necesitas escribirlo. Para varias columnas: `ORDER BY categoria, precio DESC` (primero por categoría asc, luego por precio desc dentro de cada categoría).",
        },
        {
          kind: "visualization",
          component: "SqlQueryVisualizer",
          props: {
            initialQuery:
              "SELECT nombre, precio FROM productos ORDER BY precio DESC LIMIT 5;",
          },
        },
        {
          kind: "exercise",
          id: "top-3-mas-vendidos",
          prompt:
            "En el visor SQL inferior, escribe una consulta que devuelva las 3 ventas con mayor cantidad. Usarás: `SELECT venta_id, cantidad FROM ventas ORDER BY cantidad DESC LIMIT 3;`",
          starterCode: `-- Escribe la consulta en el visor inferior y pulsa Ejecutar SQL
SELECT venta_id, cantidad FROM ventas ORDER BY cantidad DESC LIMIT 3;`,
          hints: [
            "ORDER BY cantidad DESC ordena de mayor a menor.",
            "LIMIT 3 toma solo los primeros 3.",
          ],
          solution: `SELECT venta_id, cantidad FROM ventas ORDER BY cantidad DESC LIMIT 3;`,
          check: { type: "no_error" },
        },
      ],
    },
    {
      id: "agregaciones",
      title: "Funciones agregadas: COUNT, SUM, AVG",
      blocks: [
        {
          kind: "text",
          title: "Resumir, no listar",
          body: "Las funciones agregadas comprimen muchas filas en una sola: `COUNT(*)` (cuántas filas), `SUM(col)` (suma total), `AVG(col)` (promedio), `MIN(col)`, `MAX(col)`. Sin GROUP BY, una agregación devuelve una sola fila resumen. Por ejemplo: `SELECT COUNT(*) FROM ventas` cuenta todas las ventas. `SELECT AVG(precio) FROM productos` da el precio medio. Estas funciones ignoran los NULL salvo COUNT(*).",
        },
        {
          kind: "visualization",
          component: "SqlQueryVisualizer",
          props: {
            initialQuery:
              "SELECT COUNT(*) AS n_ventas, SUM(cantidad) AS unidades, AVG(cantidad) AS ticket_medio FROM ventas;",
          },
        },
        {
          kind: "concept",
          problema: "Calcular el valor total del inventario y el precio medio del catálogo.",
          idea: "Combinar SUM y AVG en una sola consulta.",
          codigo: `SELECT SUM(stock * precio) AS valor_inventario,
       AVG(precio) AS precio_medio,
       MIN(precio) AS precio_min,
       MAX(precio) AS precio_max
FROM productos;`,
          interpretacion:
            "Una sola consulta devuelve 4 KPIs a la vez. Esto es eficiente: una pasada sobre los datos, una ronda de ida y vuelta con el servidor. En Pandas, esto equivale a `df['stock'].mul(df['precio']).sum()` y `df['precio'].mean()` por separado.",
        },
      ],
    },
    {
      id: "groupby-having",
      title: "GROUP BY y HAVING",
      blocks: [
        {
          kind: "text",
          title: "Agregaciones por grupo",
          body: "`GROUP BY columna` agrupa filas por el valor de una columna y aplica agregaciones a cada grupo por separado. Es el equivalente exacto a `df.groupby()` en Pandas. Por ejemplo: `SELECT region, SUM(cantidad) FROM ventas GROUP BY region` da el total vendido por región. `HAVING condición` filtra **grupos** (no filas), a diferencia de WHERE que filtra filas individuales antes de agrupar. Regla: WHERE filtra antes de agrupar, HAVING filtra después. Esto es sutil pero importante.",
        },
        {
          kind: "visualization",
          component: "SqlQueryVisualizer",
          props: {
            initialQuery:
              "SELECT region, COUNT(*) AS n_ventas, SUM(cantidad) AS unidades_totales FROM ventas GROUP BY region;",
          },
        },
        {
          kind: "exercise",
          id: "empleados-depto",
          prompt:
            "En el visor SQL inferior, escribe una consulta que devuelva, por cada departamento: el departamento, el número de empleados y el salario medio. Ordena por salario medio descendente.",
          starterCode: `-- Tu consulta SQL en el visor inferior:
SELECT departamento, COUNT(*), AVG(salario) FROM empleados GROUP BY departamento ORDER BY AVG(salario) DESC;`,
          hints: [
            "GROUP BY departamento, COUNT(*) para contar, AVG(salario) para la media.",
            "ORDER BY AVG(salario) DESC ordena por salario medio descendente.",
          ],
          solution: `SELECT departamento, COUNT(*) AS n_empleados, AVG(salario) AS salario_medio
FROM empleados
GROUP BY departamento
ORDER BY salario_medio DESC;`,
          check: { type: "no_error" },
        },
      ],
    },
    {
      id: "join",
      title: "JOIN: combinar tablas",
      blocks: [
        {
          kind: "text",
          title: "INNER JOIN",
          body: "El `JOIN` combina filas de dos tablas usando una columna común. El más usado es `INNER JOIN`, que devuelve solo las filas que tienen correspondencia en ambas tablas. Sintaxis: `SELECT ... FROM a JOIN b ON a.clave = b.clave`. En nuestro caso, `ventas JOIN productos ON ventas.producto_id = productos.producto_id` enlaza cada venta con el detalle del producto vendido. Esto permite responder preguntas como '¿cuál es la categoría que más revenue generó?' — imposible sin JOIN porque la categoría vive en otra tabla.",
        },
        {
          kind: "visualization",
          component: "SqlQueryVisualizer",
          props: {
            initialQuery:
              "SELECT p.categoria, SUM(v.cantidad * p.precio) AS revenue_total FROM ventas v JOIN productos p ON v.producto_id = p.producto_id GROUP BY p.categoria ORDER BY revenue_total DESC;",
          },
        },
        {
          kind: "exercise",
          id: "join-empleado-venta",
          prompt:
            "En el visor SQL, escribe un JOIN que devuelva para cada empleado: nombre y número de ventas que registró. Une ventas con empleados por empleado_id, agrupa por nombre, cuenta.",
          starterCode: `-- Tu JOIN en el visor inferior:
SELECT e.nombre, COUNT(*) AS n_ventas FROM ventas v JOIN empleados e ON v.empleado_id = e.empleado_id GROUP BY e.nombre ORDER BY n_ventas DESC LIMIT 5;`,
          hints: [
            "FROM ventas v JOIN empleados e ON v.empleado_id = e.empleado_id",
            "GROUP BY e.nombre, COUNT(*) AS n_ventas",
          ],
          solution: `SELECT e.nombre, COUNT(*) AS n_ventas
FROM ventas v
JOIN empleados e ON v.empleado_id = e.empleado_id
GROUP BY e.nombre
ORDER BY n_ventas DESC;`,
          check: { type: "no_error" },
        },
      ],
    },
    {
      id: "pandas-vs-sql",
      title: "Pandas ↔ SQL: equivalencias",
      blocks: [
        {
          kind: "table",
          caption: "Equivalencias directas",
          headers: ["Operación", "SQL", "Pandas"],
          rows: [
            ["Seleccionar columnas", "SELECT a, b FROM t", "df[['a','b']]"],
            ["Filtrar filas", "WHERE x > 5", "df[df['x'] > 5]"],
            ["Ordenar", "ORDER BY x DESC", "df.sort_values('x', ascending=False)"],
            ["Top N", "LIMIT 10", "df.head(10)"],
            ["Contar filas", "COUNT(*)", "len(df) o df.shape[0]"],
            ["Suma de columna", "SUM(x)", "df['x'].sum()"],
            ["Promedio", "AVG(x)", "df['x'].mean()"],
            ["Agrupar", "GROUP BY cat", "df.groupby('cat')"],
            ["JOIN", "JOIN ON clave", "pd.merge(a, b, on='clave')"],
            ["Valores únicos", "SELECT DISTINCT cat", "df['cat'].unique()"],
          ],
        },
        {
          kind: "codecell",
          caption: "Misma consulta en Pandas y SQL (en este caso solo Pandas)",
          code: `import pandas as pd
import io

# Dataset
csv = """region,producto,cantidad
Norte,Tornillo,1500
Sur,Martillo,80
Norte,Cemento,60
Sur,Foco,300
Este,Cable,400
Norte,Brocha,120
"""
df = pd.read_csv(io.StringIO(csv))

# Pandas: agrupar por región y sumar cantidad
resumen = df.groupby('region')['cantidad'].sum().sort_values(ascending=False)
print("Pandas groupby:")
print(resumen)

# Equivalente SQL:
# SELECT region, SUM(cantidad) AS total
# FROM df
# GROUP BY region
# ORDER BY total DESC`,
        },
      ],
    },
    {
      id: "mini-sql",
      title: "Mini-proyecto: Base de datos de la empresa",
      blocks: [
        {
          kind: "text",
          title: "Consultas reales sobre la BD",
          body: "Vas a responder 5 preguntas de negocio sobre la base de datos completa (empleados + productos + ventas). Cada pregunta se resuelve con una consulta SQL en el visor inferior. Tómate tu tiempo para escribir la consulta, ejecutarla y comparar con la solución. Estas son consultas típicas que un analista industrial recibe cada semana.",
        },
        {
          kind: "visualization",
          component: "SqlQueryVisualizer",
          props: {
            initialQuery:
              "-- Pregunta 1: ¿Cuál es el producto más vendido (por cantidad total)?\\nSELECT p.nombre, SUM(v.cantidad) AS total FROM ventas v JOIN productos p ON v.producto_id = p.producto_id GROUP BY p.nombre ORDER BY total DESC LIMIT 5;",
          },
        },
        {
          kind: "challenge",
          id: "ventas-empleado-mes",
          context:
            "Tienes las tablas `ventas(venta_id, producto_id, empleado_id, cantidad, fecha, region)` y `empleados(empleado_id, nombre, departamento, ...)`.",
          objetivo:
            "Escribe una consulta SQL (en el visor de arriba) que devuelva los 5 empleados con más ventas registradas (por número de transacciones, no por cantidad). Muestra nombre, departamento y número de ventas.",
          hints: [
            "JOIN ventas con empleados por empleado_id.",
            "GROUP BY e.nombre, e.departamento, COUNT(*) AS n_ventas.",
            "ORDER BY n_ventas DESC LIMIT 5.",
          ],
          solution: `SELECT e.nombre, e.departamento, COUNT(*) AS n_ventas
FROM ventas v
JOIN empleados e ON v.empleado_id = e.empleado_id
GROUP BY e.nombre, e.departamento
ORDER BY n_ventas DESC
LIMIT 5;`,
        },
      ],
    },
  ],
};
