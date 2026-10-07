/* ============================================
   NAURA — inicio.js
   Carga los productos marcados como favoritos
   desde Google Sheets.
   ============================================ */

document.addEventListener('DOMContentLoaded', async () => {

  const contenedor = document.getElementById('productos-favoritos');
  const estado = document.getElementById('estado-favoritos');

  if (!contenedor) return;

  try {

    // Traemos todos los productos disponibles
    const productos = await obtenerProductos();
 console.log('PRODUCTOS:', productos);
    // Dejamos solamente los marcados como favorito = si
 const favoritos = productos.filter(
  producto => normalizarTexto(producto.favorito) === 'si'
);


    // Si no hay favoritos
    if (favoritos.length === 0) {

      estado.textContent =
        'Todavía no hay productos destacados.';

      return;
    }


    // Quitamos "Cargando productos..."
    estado.remove();


    // Creamos las tarjetas
    contenedor.innerHTML = favoritos
  .map(producto => {

    return `
      <a
        href="producto-detalle.html?id=${producto.id}"
        class="tarjeta-producto"
      >

        <img
          src="${producto.imagen}"
          alt="${producto.nombre}"
        >

        <h3>${producto.nombre}</h3>

        <p>$ ${producto.precio}</p>

      </a>
    `;

  })
  .join('');


  } catch (error) {

    console.error(
      'Error al cargar los favoritos:',
      error
    );

    estado.textContent =
      'No se pudieron cargar los productos.';

  }

});


/* ============================================
   NORMALIZAR TEXTO
   ============================================ */

function normalizarTexto(texto) {

  return String(texto || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

}