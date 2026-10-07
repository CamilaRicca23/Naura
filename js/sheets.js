/* ============================================
   NAURA — sheets.js
   Lee una Google Sheet publicada como CSV
   y la convierte en un array de objetos JS.
   Reutilizable para productos, y en el futuro
   para cualquier otra hoja (ej. testimonios).
   ============================================ */

// TODO: reemplazar por la URL real de tu hoja publicada como CSV
const URL_HOJA_PRODUCTOS = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT2rXZ_9OKfzEku8kgDGuNfyneVQvbRG4zT3MRXYYCHlgjvptgWIY_pdV4VafoIjwyRJ3tiC4hn4l3y/pub?output=csv';

/**
 * Convierte texto CSV en un array de objetos.
 * La primera fila del CSV se usa como nombres de columna (keys).
 * Soporta valores con comas dentro de comillas (ej: "Bolso, mediano").
 */
function parsearCSV(textoCSV) {
  const filas = textoCSV.trim().split('\n');
  const encabezados = dividirFilaCSV(filas[0]).map(h => h.trim().toLowerCase());

  return filas.slice(1).map(fila => {
    const valores = dividirFilaCSV(fila);
    const objeto = {};
    encabezados.forEach((encabezado, i) => {
      objeto[encabezado] = (valores[i] || '').trim();
    });
    return objeto;
  });
}

/**
 * Divide una fila de CSV en sus valores, respetando comillas.
 */
function dividirFilaCSV(fila) {
  const resultado = [];
  let valorActual = '';
  let dentroDeComillas = false;

  for (let i = 0; i < fila.length; i++) {
    const char = fila[i];

    if (char === '"') {
      dentroDeComillas = !dentroDeComillas;
    } else if (char === ',' && !dentroDeComillas) {
      resultado.push(valorActual);
      valorActual = '';
    } else {
      valorActual += char;
    }
  }
  resultado.push(valorActual);
  return resultado;
}

/**
 * Convierte un link normal de "Compartir" de Google Drive
 * en un link directo que funciona como src de una imagen.
 */
function convertirLinkDrive(linkDrive) {
  if (!linkDrive) return '';
  const match = linkDrive.match(/\/d\/(.+?)\//);
  if (match && match[1]) {
    return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
  }
  return linkDrive;
}

/**
 * Trae y parsea los productos desde la Google Sheet.
 * Devuelve una Promise con el array de productos ya listo para usar.
 */
function obtenerProductos() {

  return fetch(URL_HOJA_PRODUCTOS)

    .then(respuesta => {

      if (!respuesta.ok) {
        throw new Error('No se pudo leer la hoja de productos');
      }

      return respuesta.text();

    })

    .then(textoCSV => parsearCSV(textoCSV))

    .then(productos =>
      productos

        // Solo productos disponibles
        .filter(
          p =>
            p.disponible &&
            p.disponible.toLowerCase() === 'si'
        )

        // Convertimos todas las imágenes de Drive
        .map(p => ({
          ...p,

          imagen: convertirLinkDrive(p.imagen),
          imagen2: convertirLinkDrive(p.imagen2),
          imagen3: convertirLinkDrive(p.imagen3),
          imagen4: convertirLinkDrive(p.imagen4)

        }))
    );

}

function obtenerPrecioProducto(producto) {

  const desde = producto.precio;
  const hasta = producto.precio_hasta;

  if (desde && hasta) {
    return `$ ${desde} - $ ${hasta}`;
  }

  return `$ ${desde}`;
}