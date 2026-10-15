
/* ============================================
   NAURA — INICIO.JS
   Carga los productos favoritos en el inicio
   ============================================ */

async function cargarFavoritos() {
  const contenedor = document.getElementById('productos-favoritos');
  const estado = document.getElementById('estado-favoritos');

  if (!contenedor) return;

  try {
    // Obtener productos desde Google Sheets
    const productos = await obtenerProductos();

    // Filtrar los productos marcados como favoritos
    const favoritos = productos.filter(producto =>
      normalizarTexto(producto.favorito) === 'si'
    );

    // Mostrar mensaje si no hay favoritos
    if (favoritos.length === 0) {
      contenedor.innerHTML = `
        <p class="destacados__vacio">
          Todavía no hay productos favoritos.
        </p>
      `;

      if (estado) estado.textContent = '';
      return;
    }

    // Crear las tarjetas de favoritos
    contenedor.innerHTML = favoritos
      .map(producto => crearTarjetaProducto(producto))
      .join('');

    // Ocultar el mensaje de carga
    if (estado) estado.textContent = '';

  } catch (error) {
    console.error('Error al cargar favoritos:', error);

    if (estado) {
      estado.textContent =
        'No se pudieron cargar los productos favoritos.';
    }
  }
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', cargarFavoritos);
