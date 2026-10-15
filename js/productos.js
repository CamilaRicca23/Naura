/* ============================================
   NAURA — productos.js
   Renderiza la grilla de productos y permite
   filtrarlos por categoría (Cuero / Accesorios).
   ============================================ */

let todosLosProductos = [];

document.addEventListener('DOMContentLoaded', () => {
  const mensajeEstado = document.getElementById('estado-productos');
  const botonesFiltro = document.querySelectorAll('.filtro-boton');

  obtenerProductos()
    .then(productos => {
      todosLosProductos = productos;

      if (productos.length === 0) {
        mensajeEstado.textContent = 'Todavía no hay productos cargados.';
        return;
      }

      mensajeEstado.remove();
      const accesorios = todosLosProductos.filter(
        producto => normalizarTexto(producto.categoria) === 'accesorios'
      );

      renderizarProductos(accesorios);
    })
    .catch(error => {
      console.error('Error al cargar productos:', error);
      mensajeEstado.textContent = 'No se pudieron cargar los productos. Intentá de nuevo más tarde.';
    });

  botonesFiltro.forEach(boton => {
    boton.addEventListener('click', () => {
      botonesFiltro.forEach(b => b.classList.remove('filtro-boton--activo'));
      boton.classList.add('filtro-boton--activo');

      const categoriaElegida = boton.dataset.categoria;
      const productosFiltrados =
        categoriaElegida === 'todos'
          ? todosLosProductos
          : todosLosProductos.filter(
            p => normalizarTexto(p.categoria) === categoriaElegida
          );

      renderizarProductos(productosFiltrados);
    });
  });
});

function renderizarProductos(productos) {
  const contenedor = document.getElementById('grilla-productos');

  if (productos.length === 0) {
    contenedor.innerHTML = '<p class="destacados__vacio">No hay productos en esta categoría todavía.</p>';
    return;
  }

  contenedor.innerHTML = productos.map(crearTarjetaProducto).join('');
}
function obtenerPrecioProducto(producto) {

  const precioDesde = String(producto.precio || '').trim();
  const precioHasta = String(producto.precio_hasta || '').trim();

  if (precioDesde && precioHasta) {
    return ` $${precioDesde} -  $${precioHasta}`;
  }

  if (precioDesde) {
    return `$ ${precioDesde}`;
  }

  return 'Consultar precio';
}

function crearTarjetaProducto(producto) {
  return `
    <a href="producto-detalle.html?id=${producto.id}" class="tarjeta-producto">
      <img src="${producto.imagen}" alt="${producto.nombre}">
      <h3>${producto.nombre}</h3>
      <p> ${obtenerPrecioProducto(producto)}</p>
    </a>
  `;
}

function normalizarTexto(texto) {
  return String(texto || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}