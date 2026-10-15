
/* ============================================
   NAURA — SHEETS.JS
   Carga y preparación de productos desde
   Google Sheets
   ============================================ */


/* ============================================
   1. CONFIGURACIÓN
   ============================================ */

const URL_HOJA_PRODUCTOS =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vT2rXZ_9OKfzEku8kgDGuNfyneVQvbRG4zT3MRXYYCHlgjvptgWIY_pdV4VafoIjwyRJ3tiC4hn4l3y/pub?output=csv';


/* ============================================
   2. LECTURA DEL CSV
   ============================================ */

/**
 * Divide el CSV en filas y columnas.
 * Respeta comas, saltos de línea y comillas
 * dentro de las celdas.
 */
function dividirCSV(textoCSV) {
  const filas = [];
  let filaActual = [];
  let valorActual = '';
  let dentroDeComillas = false;

  const texto = textoCSV.replace(/^\uFEFF/, '');

  for (let i = 0; i < texto.length; i++) {
    const caracter = texto[i];

    if (caracter === '"') {
      if (dentroDeComillas && texto[i + 1] === '"') {
        valorActual += '"';
        i++;
      } else {
        dentroDeComillas = !dentroDeComillas;
      }

    } else if (caracter === ',' && !dentroDeComillas) {
      filaActual.push(valorActual);
      valorActual = '';

    } else if (
      (caracter === '\n' || caracter === '\r') &&
      !dentroDeComillas
    ) {
      if (caracter === '\r' && texto[i + 1] === '\n') {
        i++;
      }

      filaActual.push(valorActual);

      if (filaActual.some(valor => valor.trim() !== '')) {
        filas.push(filaActual);
      }

      filaActual = [];
      valorActual = '';

    } else {
      valorActual += caracter;
    }
  }

  filaActual.push(valorActual);

  if (filaActual.some(valor => valor.trim() !== '')) {
    filas.push(filaActual);
  }

  return filas;
}


/**
 * Convierte las filas del CSV en objetos.
 * La primera fila contiene los encabezados.
 */
function parsearCSV(textoCSV) {
  const filas = dividirCSV(textoCSV);

  if (filas.length === 0) {
    return [];
  }

  const encabezados = filas[0].map(encabezado =>
    encabezado.trim().toLowerCase()
  );

  return filas.slice(1).map(valores => {
    const producto = {};

    encabezados.forEach((encabezado, indice) => {
      producto[encabezado] = (valores[indice] || '').trim();
    });

    return producto;
  });
}


/* ============================================
   3. IMÁGENES DE GOOGLE DRIVE
   ============================================ */

/**
 * Convierte enlaces compartidos de Drive
 * en enlaces utilizables para imágenes.
 */
function convertirLinkDrive(linkDrive) {
  if (!linkDrive) {
    return '';
  }

  const link = String(linkDrive).trim();

  const enlaceArchivo = link.match(
    /drive\.google\.com\/file\/d\/([^/?#]+)/
  );

  const enlaceConId = link.match(
    /[?&]id=([^&#]+)/
  );

  const id = enlaceArchivo?.[1] || enlaceConId?.[1];

  if (!id) {
    return link;
  }

  return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
}


/* ============================================
   4. OBTENER PRODUCTOS
   ============================================ */

/**
 * Obtiene los productos disponibles y
 * prepara sus imágenes.
 */
async function obtenerProductos() {
  const respuesta = await fetch(URL_HOJA_PRODUCTOS);

  if (!respuesta.ok) {
    throw new Error('No se pudo leer la hoja de productos');
  }

  const textoCSV = await respuesta.text();
  const productos = parsearCSV(textoCSV);

  return productos
    .filter(producto =>
      producto.disponible?.trim().toLowerCase() === 'si'
    )
    .map(producto => ({
      ...producto,

      imagen: convertirLinkDrive(producto.imagen),
      imagen2: convertirLinkDrive(producto.imagen2),
      imagen3: convertirLinkDrive(producto.imagen3),
      imagen4: convertirLinkDrive(producto.imagen4)
    }));
}


/* ============================================
   5. FORMATO DE PRECIOS
   ============================================ */

/**
 * Devuelve el precio de un producto.
 * Admite precio único, rango o sin precio.
 */
function obtenerPrecioProducto(producto) {
  const limpiarPrecio = valor =>
    String(valor ?? '').replace(/\$/g, '').trim();

  const desde = limpiarPrecio(producto.precio);
  const hasta = limpiarPrecio(producto.precio_hasta);

  if (!desde) {
    return 'Consultar precio';
  }

  if (hasta) {
    return `$ ${desde} - $ ${hasta}`;
  }

  return `$ ${desde}`;
}

/* ============================================
   FUNCIONES COMPARTIDAS
   ============================================ */

// Normalizar textos de Google Sheets
function normalizarTexto(texto) {
  return String(texto || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}


// Crear tarjetas de productos
function crearTarjetaProducto(producto) {
  return `
    <a
      href="producto-detalle.html?id=${encodeURIComponent(producto.id)}"
      class="tarjeta-producto"
    >
      <img
        src="${producto.imagen}"
        alt="${producto.nombre}"
        loading="lazy"
      >

      <h3>${producto.nombre}</h3>

      <p>${obtenerPrecioProducto(producto)}</p>
    </a>
  `;
}
