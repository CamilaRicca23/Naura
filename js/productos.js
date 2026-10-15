
/* ============================================
   NAURA — PRODUCTOS.JS
   Listado, tarjetas y filtros de productos

   Requiere sheets.js
   ============================================ */


/* ============================================
   1. VARIABLES
   ============================================ */

let todosLosProductos = [];


/* ============================================
   2. INICIALIZACIÓN
   ============================================ */

document.addEventListener('DOMContentLoaded', async () => {
  const mensajeEstado = document.getElementById('estado-productos');
  const botonesFiltro = document.querySelectorAll('.filtro-boton');

  try {
    // Obtener productos desde Google Sheets
    todosLosProductos = await obtenerProductos();

    if (todosLosProductos.length === 0) {
      mensajeEstado.textContent = 'Todavía no hay productos cargados.';
      return;
    }

    // Ocultar mensaje de carga
    mensajeEstado.remove();

    // Mostrar Accesorios al ingresar
    filtrarProductos('accesorios');

  } catch (error) {
    console.error('Error al cargar productos:', error);

    mensajeEstado.textContent =
      'No se pudieron cargar los productos. Intentá de nuevo más tarde.';
  }

  // Configurar botones de filtro
  botonesFiltro.forEach(boton => {
    boton.addEventListener('click', () => {
      const categoria = boton.dataset.categoria;

      // Actualizar botón activo
      botonesFiltro.forEach(b => {
        b.classList.remove('filtro-boton--activo');
      });

      boton.classList.add('filtro-boton--activo');

      // Mostrar productos filtrados
      filtrarProductos(categoria);
    });
  });
});


/* ============================================
   3. FILTRADO DE PRODUCTOS
   ============================================ */

function filtrarProductos(categoria) {
  const categoriaNormalizada = normalizarTexto(categoria);

  const productosFiltrados =
    categoriaNormalizada === 'todos'
      ? todosLosProductos
      : todosLosProductos.filter(producto =>
          normalizarTexto(producto.categoria) === categoriaNormalizada
        );

  renderizarProductos(productosFiltrados);
}


/* ============================================
   4. RENDERIZADO DE PRODUCTOS
   ============================================ */

function renderizarProductos(productos) {
  const contenedor = document.getElementById('grilla-productos');

  if (!contenedor) {
    return;
  }

  if (productos.length === 0) {
    contenedor.innerHTML = `
      <p class="destacados__vacio">
        No hay productos en esta categoría todavía.
      </p>
    `;
    return;
  }

  contenedor.innerHTML = productos
    .map(crearTarjetaProducto)
    .join('');
}


/* ============================================
   5. TARJETAS DE PRODUCTOS
   ============================================ */

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


/* ============================================
   6. FUNCIONES AUXILIARES
   ============================================ */

/**
 * Normaliza textos para comparar categorías.
 * Elimina mayúsculas, espacios y tildes.
 */
function normalizarTexto(texto) {
  return String(texto || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}
