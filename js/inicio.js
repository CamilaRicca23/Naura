
/* ============================================
   6. FUNCIONES COMPARTIDAS
   ============================================ */

/**
 * Normaliza textos para comparar valores
 * de Google Sheets.
 */
function normalizarTexto(texto) {
  return String(texto || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}


/**
 * Genera una tarjeta de producto reutilizable
 * en Inicio y Productos.
 */
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
