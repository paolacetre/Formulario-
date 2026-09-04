import * as XLSX from "xlsx";

const nombresColumna = {
  codigo: ["codigo", "codigo ocupacion", "codigo de ocupacion", "code"],
  nombre: ["nombre", "nombre ocupacion", "nombre de ocupacion", "ocupacion"],
  descripcion: ["descripcion", "description"],
  clasificacion: ["clasificacion", "classification"],
  nivel: ["nivel"],
  areaDesempeno: ["area desempeno", "area de desempeno"],
  funciones: ["funcion", "funciones"],
  habilidades: ["habilidad", "habilidades"],
  conocimientos: ["conocimiento", "conocimientos"],
  denominaciones: ["denominacion", "denominaciones"],
  relaciones: ["relacion", "relaciones"],
};

const nombresHoja = {
  funciones: ["funcion", "funciones"],
  habilidades: ["habilidad", "habilidades"],
  conocimientos: ["conocimiento", "conocimientos"],
  denominaciones: ["denominacion", "denominaciones"],
  relaciones: ["relacion", "relaciones"],
};

const normalizar = (valor) => String(valor ?? "")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .trim()
  .toLocaleLowerCase()
  .replace(/[^a-z0-9]+/g, " ")
  .trim();

function encontrarColumna(encabezados, alternativas) {
  const alternativasNormalizadas = alternativas.map(normalizar);
  return encabezados.find((encabezado) => {
    const encabezadoNormalizado = normalizar(encabezado);
    return alternativasNormalizadas.some((alternativa) =>
      encabezadoNormalizado === alternativa || encabezadoNormalizado.includes(alternativa),
    );
  });
}

function leerValor(fila, columna) {
  return columna ? String(fila[columna] ?? "").trim() : "";
}

function leerLista(fila, columna) {
  return leerValor(fila, columna)
    .split(/\r?\n|;|\|/)
    .map((elemento) => elemento.trim())
    .filter(Boolean);
}

function normalizarCodigo(valor) {
  return String(valor ?? "").toLocaleLowerCase().replace(/[^a-z0-9]/g, "");
}

function encontrarHoja(libro, tipo) {
  return libro.SheetNames.find((nombre) => {
    const nombreNormalizado = normalizar(nombre);
    return nombresHoja[tipo].some((alternativa) =>
      nombreNormalizado.includes(normalizar(alternativa)),
    );
  });
}

function leerRelaciones(libro, tipo) {
  const nombreHoja = encontrarHoja(libro, tipo);
  if (!nombreHoja) return new Map();

  const filas = XLSX.utils.sheet_to_json(libro.Sheets[nombreHoja], { defval: "" });
  if (filas.length === 0) return new Map();

  const encabezados = Object.keys(filas[0]);
  const columnaCodigo = encontrarColumna(encabezados, nombresColumna.codigo);
  const columnaDescripcion = encontrarColumna(encabezados, [
    "descripcion",
    "descripción",
    "description",
    tipo,
    "nombre",
    "detalle",
  ]);
  const relaciones = new Map();

  filas.forEach((fila) => {
    const codigo = leerValor(fila, columnaCodigo || encabezados[0]);
    const descripcion = leerValor(
      fila,
      columnaDescripcion || encabezados[1] || encabezados[0],
    );
    if (!codigo || !descripcion) return;

    const clave = normalizarCodigo(codigo);
    const elementos = relaciones.get(clave) || [];
    elementos.push({ codigo, descripcion });
    relaciones.set(clave, elementos);
  });

  return relaciones;
}

export async function procesarArchivoExcel(archivo) {
  const contenido = await archivo.arrayBuffer();
  const libro = XLSX.read(contenido, { type: "array" });
  const hoja = libro.Sheets[libro.SheetNames[0]];
  const filas = XLSX.utils.sheet_to_json(hoja, { defval: "" });
  const encabezados = filas.length > 0 ? Object.keys(filas[0]) : [];
  const columnas = Object.fromEntries(
    Object.entries(nombresColumna).map(([campo, alternativas]) => [
      campo,
      encontrarColumna(encabezados, alternativas),
    ]),
  );
  const errores = [];
  const ocupaciones = [];
  const relacionesPorTipo = Object.fromEntries(
    Object.keys(nombresHoja).map((tipo) => [tipo, leerRelaciones(libro, tipo)]),
  );

  if (!columnas.codigo || !columnas.nombre) {
    return {
      ocupaciones: [],
      errores: ["El archivo debe incluir columnas reconocibles de código y nombre."],
      total: filas.length,
    };
  }

  filas.forEach((fila, indice) => {
    const codigo = leerValor(fila, columnas.codigo);
    const nombre = leerValor(fila, columnas.nombre);

    if (!codigo || !nombre) {
      errores.push(`Fila ${indice + 2}: código y nombre son obligatorios.`);
      return;
    }

    ocupaciones.push({
      id: `excel-${indice + 1}-${codigo}`,
      codigo,
      nombre,
      descripcion: leerValor(fila, columnas.descripcion) || "Descripción no disponible.",
      clasificacion: leerValor(fila, columnas.clasificacion) || "No especificada",
      nivel: leerValor(fila, columnas.nivel),
      areaDesempeno: leerValor(fila, columnas.areaDesempeno),
      funciones: relacionesPorTipo.funciones.get(normalizarCodigo(codigo)) || leerLista(fila, columnas.funciones),
      habilidades: relacionesPorTipo.habilidades.get(normalizarCodigo(codigo)) || leerLista(fila, columnas.habilidades),
      conocimientos: relacionesPorTipo.conocimientos.get(normalizarCodigo(codigo)) || leerLista(fila, columnas.conocimientos),
      denominaciones: relacionesPorTipo.denominaciones.get(normalizarCodigo(codigo)) || leerLista(fila, columnas.denominaciones),
      relaciones: relacionesPorTipo.relaciones.get(normalizarCodigo(codigo)) || leerLista(fila, columnas.relaciones),
    });
  });

  return { ocupaciones, errores, total: filas.length };
}
