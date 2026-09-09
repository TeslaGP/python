// Industrial engineering datasets, exposed as CSV strings and Python literals.
// These are used by module content (CodeCells, exercises, projects).

// 10-row sales dataset — used widely across pandas, eda, statistics modules.
export const ventasDatasetCsv = `producto,categoria,precio,cantidad,fecha,region
Tornillo M6,Ferretería,0.15,1500,2024-01-05,Norte
Martillo,Ferretería,12.5,80,2024-01-07,Sur
Pintura Blanca 4L,Pintura,45.0,40,2024-01-09,Norte
Brocha 2",Pintura,8.9,120,2024-01-12,Este
Tubo PVC 2m,Plomería,7.3,200,2024-01-15,Oeste
Cemento 25kg,Construcción,95.0,60,2024-01-18,Norte
Cable 12 AWG,Eléctrico,3.2,400,2024-01-22,Sur
Foco LED 9W,Eléctrico,4.5,300,2024-01-25,Este
Llave Inglesa,Ferretería,38.0,25,2024-01-28,Oeste
Silicona,Pintura,6.8,180,2024-01-30,Norte
`;

// Inventory dataset — 50 rows for ABC analysis, reorder point, etc.
export const inventarioDatasetCsv = (() => {
  const rows: string[] = ["sku,descripcion,categoria,stock,costo,demanda_anual"];
  const cats = ["Ferretería", "Pintura", "Plomería", "Construcción", "Eléctrico"];
  const baseDesc = [
    "Tornillo", "Martillo", "Pintura", "Brocha", "Tubo", "Cemento",
    "Cable", "Foco", "Llave", "Silicona", "Clavo", "Tuerca",
    "Arandela", "Destornillador", "Cinta", "Pegamento", "Lija", "Cinta métrica",
    "Nivel", "Sierra",
  ];
  let seed = 42;
  const rng = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 1; i <= 50; i++) {
    const desc = baseDesc[(i - 1) % baseDesc.length] + " " + (Math.floor((i - 1) / baseDesc.length) + 1);
    const cat = cats[Math.floor(rng() * cats.length)];
    const stock = Math.floor(rng() * 500) + 5;
    const costo = Math.round(rng() * 100 * 100) / 100;
    const demanda = Math.floor(rng() * 5000) + 100;
    rows.push(`SKU-${1000 + i},${desc},${cat},${stock},${costo},${demanda}`);
  }
  return rows.join("\n") + "\n";
})();

// Production dataset — 100 rows: fecha, linea, producto, unidades, tiempo_ciclo, defectos
export const produccionDatasetCsv = (() => {
  const rows: string[] = ["fecha,linea,producto,unidades,tiempo_ciclo,defectos"];
  const lineas = ["L1", "L2", "L3"];
  const productos = ["Producto A", "Producto B", "Producto C"];
  let seed = 7;
  const rng = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  let d = new Date("2024-03-01");
  for (let i = 0; i < 100; i++) {
    const date = d.toISOString().slice(0, 10);
    const linea = lineas[i % 3];
    const producto = productos[Math.floor(rng() * 3)];
    const unidades = Math.floor(rng() * 200) + 100;
    const tc = Math.round((4 + rng() * 6) * 10) / 10;
    const defectos = Math.floor(rng() * 12);
    rows.push(`${date},${linea},${producto},${unidades},${tc},${defectos}`);
    if (i % 3 === 2) d.setDate(d.getDate() + 1);
  }
  return rows.join("\n") + "\n";
})();

// Customers dataset — 50 rows
export const clientesDatasetCsv = (() => {
  const rows: string[] = ["cliente_id,region,segmento,fecha_registro"];
  const regiones = ["Norte", "Sur", "Este", "Oeste"];
  const segmentos = ["Industrial", "Comercial", "Residencial"];
  let seed = 123;
  const rng = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 1; i <= 50; i++) {
    const region = regiones[Math.floor(rng() * 4)];
    const seg = segmentos[Math.floor(rng() * 3)];
    const y = 2020 + Math.floor(rng() * 5);
    const m = 1 + Math.floor(rng() * 12);
    const day = 1 + Math.floor(rng() * 28);
    rows.push(`C${1000 + i},${region},${seg},${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
  }
  return rows.join("\n") + "\n";
})();

// SQL employees dataset (30 rows)
export const empleadosSqlCsv = (() => {
  const rows: string[] = ["empleado_id,nombre,departamento,salario,fecha_contratacion"];
  const nombres = ["Ana López", "Carlos Ruiz", "María García", "Juan Pérez", "Lucía Torres",
    "Pedro Martín", "Sofía Díaz", "Diego Fernández", "Elena Vargas", "Luis Ramírez",
    "Patricia Soto", "Andrés Mora", "Carmen Ríos", "Roberto León", "Isabel Cruz",
    "Fernando Ortega", "Marta Gil", "Ricardo Paz", "Beatriz Núñez", "Tomás Herrera",
    "Raquel Aguilar", "Óscar Castro", "Natalia Vega", "Manuel Ibarra", "Pilar Romero",
    "Hugo Medina", "Silvia Reyes", "Adrián Flores", "Gema Cabrera", "Pablo Santos"];
  const deptos = ["Producción", "Calidad", "Logística", "Mantenimiento", "Administración"];
  let seed = 99;
  const rng = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 1; i <= 30; i++) {
    const nombre = nombres[i - 1];
    const dep = deptos[Math.floor(rng() * 5)];
    const salario = Math.round((1500 + rng() * 2500) * 100) / 100;
    const y = 2018 + Math.floor(rng() * 7);
    const m = 1 + Math.floor(rng() * 12);
    const day = 1 + Math.floor(rng() * 28);
    rows.push(`E${200 + i},${nombre},${dep},${salario},${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
  }
  return rows.join("\n") + "\n";
})();

// SQL products dataset (40 rows)
export const productosSqlCsv = (() => {
  const rows: string[] = ["producto_id,nombre,categoria,precio,stock"];
  const cats = ["Ferretería", "Pintura", "Plomería", "Construcción", "Eléctrico"];
  const nombres = ["Tornillo", "Martillo", "Pintura", "Brocha", "Tubo", "Cemento",
    "Cable", "Foco", "Llave", "Silicona", "Clavo", "Tuerca", "Arandela", "Destornillador"];
  let seed = 17;
  const rng = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 1; i <= 40; i++) {
    const nombre = nombres[(i - 1) % nombres.length] + " M" + i;
    const cat = cats[(i - 1) % 5];
    const precio = Math.round((rng() * 100 + 1) * 100) / 100;
    const stock = Math.floor(rng() * 500);
    rows.push(`P${300 + i},${nombre},${cat},${precio},${stock}`);
  }
  return rows.join("\n") + "\n";
})();

// SQL sales dataset (200 rows) — references products + employees
export const ventasSqlCsv = (() => {
  const rows: string[] = ["venta_id,producto_id,empleado_id,cantidad,fecha,region"];
  const regiones = ["Norte", "Sur", "Este", "Oeste"];
  let seed = 2024;
  const rng = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const start = new Date("2024-01-01");
  for (let i = 1; i <= 200; i++) {
    const pid = `P${300 + 1 + Math.floor(rng() * 40)}`;
    const eid = `E${200 + 1 + Math.floor(rng() * 30)}`;
    const cant = Math.floor(rng() * 20) + 1;
    const offset = Math.floor(rng() * 270);
    const d = new Date(start);
    d.setDate(d.getDate() + offset);
    const fecha = d.toISOString().slice(0, 10);
    const region = regiones[Math.floor(rng() * 4)];
    rows.push(`V${5000 + i},${pid},${eid},${cant},${fecha},${region}`);
  }
  return rows.join("\n") + "\n";
})();

// Big analyst dataset — 500 rows for the data-analysis-project module.
export const analistaDatasetCsv = (() => {
  const rows: string[] = [
    "venta_id,fecha,producto,categoria,cliente_id,region,costo,precio,cantidad,canal",
  ];
  const productos = [
    ["Tornillo M6", "Ferretería"],
    ["Martillo", "Ferretería"],
    ["Pintura Blanca 4L", "Pintura"],
    ["Brocha 2\"", "Pintura"],
    ["Tubo PVC 2m", "Plomería"],
    ["Cemento 25kg", "Construcción"],
    ["Cable 12 AWG", "Eléctrico"],
    ["Foco LED 9W", "Eléctrico"],
    ["Llave Inglesa", "Ferretería"],
    ["Silicona", "Pintura"],
  ];
  const regiones = ["Norte", "Sur", "Este", "Oeste"];
  const canales = ["Tienda", "Online", "Distribuidor"];
  let seed = 7777;
  const rng = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const start = new Date("2023-01-01");
  for (let i = 1; i <= 500; i++) {
    const [prod, cat] = productos[Math.floor(rng() * productos.length)];
    const cid = `C${1000 + Math.floor(rng() * 50)}`;
    const region = regiones[Math.floor(rng() * regiones.length)];
    const canal = canales[Math.floor(rng() * canales.length)];
    const costoBase = (rng() * 60 + 5);
    const precio = Math.round((costoBase * (1.4 + rng() * 0.8)) * 100) / 100;
    const costo = Math.round(costoBase * 100) / 100;
    const cantidad = Math.floor(rng() * 50) + 1;
    const offset = Math.floor(rng() * 730);
    const d = new Date(start);
    d.setDate(d.getDate() + offset);
    const fecha = d.toISOString().slice(0, 10);
    rows.push(`V${8000 + i},${fecha},${prod},${cat},${cid},${region},${costo},${precio},${cantidad},${canal}`);
  }
  return rows.join("\n") + "\n";
})();

// Helper that returns a Python snippet to build a DataFrame from a CSV string.
export function csvToDataFrameLoader(varName: string, csv: string): string {
  const escaped = csv.replace(/\\/g, "\\\\").replace(/"""/g, '\\"\\"\\"');
  return [
    `import io as _io`,
    `${varName}_csv = """${escaped}"""`,
    `${varName} = pd.read_csv(_io.StringIO(${varName}_csv))`,
  ].join("\n");
}

// Industrial seed SQL for the SQL module (3 tables).
export function sqlSeedSql(): string {
  return `
CREATE TABLE empleados (empleado_id TEXT PRIMARY KEY, nombre TEXT, departamento TEXT, salario REAL, fecha_contratacion TEXT);
CREATE TABLE productos (producto_id TEXT PRIMARY KEY, nombre TEXT, categoria TEXT, precio REAL, stock INTEGER);
CREATE TABLE ventas (venta_id TEXT PRIMARY KEY, producto_id TEXT, empleado_id TEXT, cantidad INTEGER, fecha TEXT, region TEXT);

${toSqlInserts("empleados", empleadosSqlCsv)}
${toSqlInserts("productos", productosSqlCsv)}
${toSqlInserts("ventas", ventasSqlCsv)}
`;
}

// Convert a CSV string into a list of SQL INSERT statements.
export function toSqlInserts(tableName: string, csv: string): string {
  const lines = csv.trim().split("\n");
  const header = lines[0].split(",");
  const stmts: string[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split(",");
    const values = cells
      .map((c) => {
        const trimmed = c.trim();
        if (trimmed !== "" && /^\d+(\.\d+)?$/.test(trimmed)) {
          return trimmed;
        }
        return `'${c.replace(/'/g, "''")}'`;
      })
      .join(", ");
    stmts.push(
      `INSERT INTO ${tableName} (${header.join(", ")}) VALUES (${values});`,
    );
  }
  return stmts.join("\n");
}
