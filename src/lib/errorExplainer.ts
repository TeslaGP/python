// Maps Python tracebacks and exception types to friendly Spanish explanations.
//
// V2: each explanation now includes a *progressive hint sequence* — three
// hints of increasing specificity that match the same progression as the
// ExerciseCard hints: conceptual → técnica → código. The Console component
// shows the diagnostic first, then offers a "Pedir pista" button that reveals
// these hints one by one. This makes errors into a guided learning moment,
// not just a "you were wrong" message.

export interface ProgressiveHint {
  level: "conceptual" | "tecnica" | "codigo";
  text: string;
}

export interface ExplainedError {
  errorType: string;
  location?: string;
  expected?: string;
  received?: string;
  why: string;
  fix: string;
  rawTraceback: string;
  // V2: hints the student can reveal one at a time.
  hints?: ProgressiveHint[];
}

interface ErrorPattern {
  match: RegExp;
  type: string;
  expected?: string;
  received?: (m: RegExpMatchArray) => string;
  why: string;
  fix: string;
  hints?: (m: RegExpMatchArray) => ProgressiveHint[];
}

const PATTERNS: ErrorPattern[] = [
  {
    match: /^NameError: name '([^']+)' is not defined/,
    type: "NameError",
    received: (m) => `El nombre \`${m[1]}\` no existe.`,
    why: "Estás usando un nombre que Python no reconoce. Puede que la variable no haya sido definida aún, que tenga un error tipográfico, o que estés intentando usar algo de un módulo que no has importado.",
    fix: "Revisa el nombre. ¿Lo definiste antes? ¿Lo escribiste exactamente igual (incluidas mayúsculas)? Si esperabas que fuera una función de NumPy o Pandas, asegúrate de haber hecho `import numpy as np` o `import pandas as pd` y de usar el prefijo correcto (`np.`, `pd.`).",
    hints: (m) => [
      {
        level: "conceptual",
        text: `En Python, todo nombre que usas tiene que haber sido *definido* antes en una celda anterior o en la celda actual. Si \`${m[1]}\` no fue definido, Python no sabe qué quieres decir con ese nombre.`,
      },
      {
        level: "tecnica",
        text: "Comprueba con `dir()` (sin argumentos) qué nombres existen ahora mismo en tu espacio. Si no ves el nombre ahí, no está definido. Revisa también mayúsculas/minúsculas: `Ventas` y `ventas` son dos variables distintas.",
      },
      {
        level: "codigo",
        text: `Si esperabas que \`${m[1]}\` viniera de un módulo (NumPy, Pandas, math), importa el módulo primero: \`import numpy as np\` y luego usa \`np.${m[1]}\`. Si lo esperabas como variable, asígnalo antes: \`${m[1]} = <valor>\`.`,
      },
    ],
  },
  {
    match: /^KeyError: (.+)$/,
    type: "KeyError",
    expected: "Una clave existente en el diccionario o en las columnas del DataFrame.",
    received: (m) => `La clave ${m[1]} no existe.`,
    why: "Estás intentando acceder a una columna de un DataFrame o a una clave de un diccionario que no está presente. Es uno de los errores más comunes al trabajar con datos.",
    fix: "Si es un DataFrame, ejecuta `df.columns` para ver los nombres reales de las columnas. Fíjate si hay diferencias de mayúsculas, espacios o tildes. Si esperabas otra columna, revisa el paso anterior donde se creó o cargó el DataFrame.",
    hints: (m) => [
      {
        level: "conceptual",
        text: "Un `KeyError` significa: 'me pediste una llave que no está en el diccionario'. En DataFrames, las 'llaves' son los nombres de las columnas. Si el nombre no coincide exactamente, Python no la encuentra.",
      },
      {
        level: "tecnica",
        text: "Antes de acceder a una columna, lista las columnas disponibles con `print(df.columns.tolist())`. Compara con el nombre que usaste. Cuidado con espacios al inicio/final (`'Ventas'` vs `'Ventas '`).",
      },
      {
        level: "codigo",
        text: `Si el nombre real es ligeramente distinto, renómbralo:\n\ndf = df.rename(columns={"nombre_viejo": "${m[1].replace(/['"]/g, "")}"})\n\nO accede con el nombre correcto: df["nombre_real"].`,
      },
    ],
  },
  {
    match: /^IndexError: list index out of range/,
    type: "IndexError",
    expected: "Un índice entre 0 y `len(lista) - 1`.",
    received: "Un índice fuera del rango de la lista.",
    why: "Pediste una posición de una lista que no existe. En Python, las listas se indexan desde 0, así que el último elemento válido está en `len(lista) - 1`.",
    fix: "Antes de acceder por índice, comprueba la longitud con `len(lista)`. Si recorres la lista en un bucle, usa `for x in lista` en lugar de índices cuando sea posible.",
  },
  {
    match: /^TypeError: unsupported operand type\(s\) for (.+)$/,
    type: "TypeError",
    expected: "Dos operandos del mismo tipo o de tipos compatibles.",
    received: (m) => `Operandos incompatibles: ${m[1]}.`,
    why: "Estás intentando operar con tipos que no se llevan entre sí, por ejemplo sumar un número a una cadena de texto, o comparar tipos distintos con operadores que no lo permiten.",
    fix: "Convierte explícitamente los tipos con `str(...)`, `int(...)`, `float(...)`. Si vienen de un DataFrame, recuerda que una columna de un DataFrame es una Series; usa `.values` o conviértela a lista si necesitas operaciones específicas.",
  },
  {
    match: /^TypeError: '([^']+)' object is not subscriptable/,
    type: "TypeError",
    expected: "Un objeto indexable (lista, tupla, diccionario, cadena, Serie).",
    received: (m) => `Un objeto de tipo \`${m[1]}\` que no se puede indexar con \`[...]\`.`,
    why: "Intentaste hacer `objeto[...]` sobre algo que no soporta esa operación. Por ejemplo, indexar un número o un None.",
    fix: "Comprueba el tipo con `type(objeto)`. Si esperabas una lista y obtuviste otra cosa, revisa la función que lo produjo: quizás devolvió None o un valor escalar.",
  },
  {
    match: /^ValueError: (.+)$/,
    type: "ValueError",
    expected: "Un valor del tipo correcto y con la forma esperada.",
    received: (m) => m[1],
    why: "El tipo del dato es correcto, pero el valor concreto no tiene sentido para la operación. Por ejemplo, pasar una lista de longitudes distintas a una función que espera columnas alineadas.",
    fix: "Lee con cuidado el mensaje: suele decir exactamente qué condición falló. Comprueba las dimensiones con `.shape`, o revisa si hay valores nulos o duplicados que provoquen la inconsistencia.",
  },
  {
    match: /^ZeroDivisionError: .+/,
    type: "ZeroDivisionError",
    expected: "Un divisor distinto de cero.",
    received: "División por cero.",
    why: "Estás dividiendo por cero, lo que matemáticamente no está definido.",
    fix: "Antes de dividir, verifica que el denominador no sea cero. Si trabajas con columnas de un DataFrame, usa `df.replace(0, np.nan)` o filtra las filas donde el denominador sea cero.",
  },
  {
    match: /^AttributeError: '([^']+)' object has no attribute '([^']+)'/,
    type: "AttributeError",
    expected: "El nombre de un método o atributo que existe en ese tipo.",
    received: (m) => `El tipo \`${m[1]}\` no tiene el atributo \`${m[2]}\`.`,
    why: "Llamaste a un método o atributo que no existe en ese objeto. Muy frecuente al confundir una lista con un DataFrame, o una Series con un array de NumPy.",
    fix: "Verifica el tipo con `type(objeto)` y revisa qué métodos soporta. Para DataFrames prueba `dir(df)` o consulta la documentación de Pandas. A veces es solo un error tipográfico en el nombre del método.",
  },
  {
    match: /^SyntaxError: (.+)$/,
    type: "SyntaxError",
    expected: "Código Python sintácticamente válido.",
    received: (m) => m[1],
    why: "Python no pudo interpretar tu código porque hay un error de sintaxis: paréntesis sin cerrar, dos puntos faltantes, comillas sin cerrar, etc.",
    fix: "Revisa la línea indicada. Casi siempre falta un paréntesis, una comilla, o los dos puntos `:` al final de un `if`/`for`/`def`. El propio mensaje suele apuntar al símbolo problemático.",
    hints: (m) => [
      {
        level: "conceptual",
        text: "Python es estricto con la sintaxis. Cada `(` debe cerrarse con `)`, cada `\"` con `\"`, cada `:` abre un bloque que debe estar indentado. Si falta uno, el intérprete se detiene.",
      },
      {
        level: "tecnica",
        text: "Mira la línea exacta del error (suele estar en el mensaje). Cuenta paréntesis, corchetes y comillas antes y después. Comprueba también que cada `if`, `for`, `while`, `def` termina en `:`.",
      },
      {
        level: "codigo",
        text: `Mensaje reportado: ${m[1]}. Patrón típico de corrección: si faltan paréntesis, ciérralos. Si falta \`:\`, añádelo. Si hay una comilla sin cerrar, ciérrala con la misma comilla de apertura.`,
      },
    ],
  },
  {
    match: /^IndentationError: (.+)$/,
    type: "IndentationError",
    expected: "Bloques indentados de manera consistente (4 espacios por nivel).",
    received: (m) => m[1],
    why: "Python usa la indentación para saber qué instrucciones pertenecen a cada bloque. Mezclar espacios y tabuladores, o no indentar después de un `:`, provoca este error.",
    fix: "Asegúrate de usar siempre 4 espacios (no tabuladores) por nivel. Después de cada línea que termine en `:` (if, for, while, def, class) debes indentar el bloque siguiente.",
    hints: (m) => [
      {
        level: "conceptual",
        text: "A diferencia de otros lenguajes que usan `{ }`, Python usa la indentación para agrupar instrucciones. Si indentas de forma inconsistente, Python no sabe qué pertenece a qué bloque.",
      },
      {
        level: "tecnica",
        text: "Regla práctica: 4 espacios por nivel de profundidad. Después de `if x > 5:` (que termina en `:`), la siguiente línea DEBE estar indentada 4 espacios. Cuando el bloque termina, vuelves al nivel anterior.",
      },
      {
        level: "codigo",
        text: `Mensaje: ${m[1]}. Si el error dice 'unexpected indent', quitaste 4 espacios de más. Si dice 'expected an indented block', olvidaste indentar después de un \`:\`.`,
      },
    ],
  },
  {
    match: /^ModuleNotFoundError: No module named '([^']+)'/,
    type: "ModuleNotFoundError",
    expected: "Un módulo disponible en el entorno.",
    received: (m) => `Módulo \`${m[1]}\` no encontrado.`,
    why: "Estás intentando importar un módulo que no está cargado en el entorno Pyodide. En este laboratorio los paquetes científicos principales (numpy, pandas, matplotlib, scipy) ya están precargados.",
    fix: "Revisa el nombre del módulo. Si es un paquete de terceros que no está precargado (por ejemplo scikit-learn), no estará disponible. En ese caso, usa micropip o busca una alternativa con NumPy/Pandas puros.",
  },
  {
    match: /^ImportError: (.+)$/,
    type: "ImportError",
    expected: "Un submódulo o nombre válido dentro del paquete.",
    received: (m) => m[1],
    why: "El paquete existe pero el nombre que intentas importar de él no se encuentra.",
    fix: "Revisa el nombre del submódulo. Por ejemplo, `from scipy import stats` sí funciona, pero `from scipy import estadistica` no. Consulta la documentación del paquete.",
  },
  {
    match: /^TypeError: \(\) takes (.+)$/,
    type: "TypeError",
    expected: "Número correcto de argumentos.",
    received: (m) => `Número de argumentos incorrecto: ${m[1]}.`,
    why: "Llamaste a una función con un número de argumentos que no coincide con su definición.",
    fix: "Revisa la firma de la función. ¿Tiene argumentos por defecto? ¿Estás pasando argumentos de más o de menos?",
  },
  {
    match: /^FileNotFoundError: .+/,
    type: "FileNotFoundError",
    expected: "Un archivo existente en el sistema.",
    received: "Un archivo que no existe.",
    why: "En este laboratorio no hay sistema de archivos real. Si intentas abrir un archivo con `open(...)` o `pd.read_csv('archivo.csv')` fallará, porque los datos viven en memoria.",
    fix: "En lugar de un archivo, usa una cadena CSV en memoria con `pd.read_csv(io.StringIO(csv_str))`. Los datasets del laboratorio ya vienen preparados como cadenas CSV.",
  },
];

export function explainError(traceback: string): ExplainedError {
  // Find the last line containing the actual exception (after the "Traceback..." preamble).
  const lines = traceback.trim().split("\n");
  let exceptionLine = "";
  let locationLine = "";
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();
    if (line && !line.startsWith("Traceback") && !line.startsWith("File")) {
      exceptionLine = line;
      break;
    }
  }
  // Look for a File "..." line near the bottom to extract location.
  for (let i = lines.length - 1; i >= 0; i--) {
    const m = lines[i].match(/File ["<]([^">]+)[">], line (\d+)/);
    if (m) {
      locationLine = `${m[1]}:${m[2]}`;
      break;
    }
  }

  for (const p of PATTERNS) {
    const m = exceptionLine.match(p.match);
    if (m) {
      return {
        errorType: p.type,
        location: locationLine || undefined,
        expected: p.expected,
        received: p.received ? p.received(m) : exceptionLine,
        why: p.why,
        fix: p.fix,
        rawTraceback: traceback,
        hints: p.hints ? p.hints(m) : undefined,
      };
    }
  }

  // Fallback: show the exception class if we can extract it.
  const typeMatch = exceptionLine.match(/^([A-Za-z_]+Error|[A-Za-z_]+Exception):/);
  return {
    errorType: typeMatch ? typeMatch[1] : "Error",
    location: locationLine || undefined,
    expected: undefined,
    received: exceptionLine,
    why: "Se produjo un error durante la ejecución. Revisa el mensaje y el contexto de la línea indicada.",
    fix: "Lee el mensaje del error con calma. Si menciona un tipo o un nombre, búscalo en tu código. A veces basta con imprimir las variables justo antes de la línea problemática para entender qué ocurre.",
    rawTraceback: traceback,
  };
}
