
/* ============================================
   NAURA — PRODUCTO-DETALLE.JS
   Información, galería, entrega y WhatsApp

   Requiere sheets.js
   ============================================ */


/* ============================================
   1. INICIALIZACIÓN
   ============================================ */

document.addEventListener('DOMContentLoaded', async () => {
  const estado = document.getElementById('estado-detalle');
  const detalle = document.getElementById('producto-detalle');

  // Obtener ID desde la URL
  const parametros = new URLSearchParams(window.location.search);
  const idProducto = parametros.get('id');

  if (!idProducto) {
    estado.textContent = 'No se encontró el producto.';
    return;
  }

  try {
    // Obtener productos desde Google Sheets
    const productos = await obtenerProductos();

    // Buscar el producto seleccionado
    const producto = productos.find(p =>
      String(p.id).trim() === idProducto.trim()
    );

    if (!producto) {
      estado.textContent = 'El producto no está disponible.';
      return;
    }

    // Configurar las secciones del detalle
    mostrarInformacionProducto(producto);
    configurarGaleria(producto);
    configurarEntrega(producto);
    configurarWhatsApp(producto);

    // Mostrar producto y quitar mensaje de carga
    estado.remove();
    detalle.hidden = false;

    // Actualizar título de la pestaña
    document.title = `${producto.nombre} — NAURA`;

  } catch (error) {
    console.error('Error al cargar el producto:', error);

    estado.textContent =
      'No se pudo cargar el producto. Intentá nuevamente.';
  }
});


/* ============================================
   2. INFORMACIÓN DEL PRODUCTO
   ============================================ */

function mostrarInformacionProducto(producto) {
  document.getElementById('producto-nombre').textContent =
    producto.nombre;

  document.getElementById('producto-categoria').textContent =
    producto.categoria || 'NAURA';

  document.getElementById('producto-precio').textContent =
    obtenerPrecioProducto(producto);

  document.getElementById('producto-descripcion').textContent =
    producto.descripcion || '';
}


/* ============================================
   3. GALERÍA DE IMÁGENES
   ============================================ */

function configurarGaleria(producto) {
  const galeria = document.getElementById('galeria-producto');
  const ventana = galeria.parentElement;

  const botonAnterior = document.getElementById('galeria-anterior');
  const botonSiguiente = document.getElementById('galeria-siguiente');

  // Obtener únicamente las imágenes disponibles
  const imagenes = [
    producto.imagen,
    producto.imagen2,
    producto.imagen3,
    producto.imagen4
  ].filter(imagen => imagen && imagen.trim() !== '');

  // Producto sin imágenes
  if (imagenes.length === 0) {
    galeria.innerHTML = `
      <div class="galeria-producto__slide">
        <div class="galeria-producto__sin-imagen">
          Imagen no disponible
        </div>
      </div>
    `;

    botonAnterior.hidden = true;
    botonSiguiente.hidden = true;
    return;
  }

  // Crear galería
  galeria.innerHTML = imagenes
    .map((imagen, indice) => `
      <div class="galeria-producto__slide">
        <img
          src="${imagen}"
          alt="${producto.nombre} - imagen ${indice + 1}"
        >
      </div>
    `)
    .join('');

  // Mostrar flechas únicamente si hay varias imágenes
  const tieneVariasImagenes = imagenes.length > 1;

  botonAnterior.hidden = !tieneVariasImagenes;
  botonSiguiente.hidden = !tieneVariasImagenes;

  if (!tieneVariasImagenes) {
    return;
  }

  // Navegación mediante flechas
  botonAnterior.addEventListener('click', () => {
    desplazarGaleria(ventana, -1);
  });

  botonSiguiente.addEventListener('click', () => {
    desplazarGaleria(ventana, 1);
  });
}


/* ============================================
   4. NAVEGACIÓN DE GALERÍA
   ============================================ */

/**
 * Desplaza la galería una imagen hacia
 * adelante o hacia atrás.
 */
function desplazarGaleria(ventana, direccion) {
  ventana.scrollBy({
    left: ventana.clientWidth * direccion,
    behavior: 'smooth'
  });
}


/* ============================================
   5. INFORMACIÓN DE ENTREGA
   ============================================ */

function configurarEntrega(producto) {
  const elementoEntrega =
    document.getElementById('producto-entrega');

  const entrega = normalizarTexto(producto.entrega);

  // Entrega inmediata
  if (entrega === 'inmediata') {
    elementoEntrega.textContent =
      'Disponible para entrega inmediata.';
    return;
  }

  // Entrega con plazo específico
  if (producto.entrega) {
    elementoEntrega.textContent =
      `Tiempo estimado de entrega: ${producto.entrega}.`;
    return;
  }

  // Sin información de entrega
  elementoEntrega.textContent =
    'Consultanos por disponibilidad.';
}


/* ============================================
   6. CONSULTA POR WHATSAPP
   ============================================ */

function configurarWhatsApp(producto) {
  const boton = document.getElementById('boton-whatsapp');

  const telefono = '59892066916';

  const mensaje =
    `Hola! Quería consultar por el producto ${producto.nombre}.`;

  boton.href =
    `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
}
