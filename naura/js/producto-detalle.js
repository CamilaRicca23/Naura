document.addEventListener('DOMContentLoaded', async () => {

  const estado = document.getElementById('estado-detalle');
  const detalle = document.getElementById('producto-detalle');


  /* ============================================
     OBTENER ID DEL PRODUCTO DESDE LA URL
     ============================================ */

  const parametros = new URLSearchParams(window.location.search);

  const idProducto = parametros.get('id');


  if (!idProducto) {

    estado.textContent = 'No se encontró el producto.';

    return;

  }


  try {

    /* ============================================
       OBTENER PRODUCTOS
       ============================================ */

    const productos = await obtenerProductos();


    /* ============================================
       BUSCAR PRODUCTO
       ============================================ */

    const producto = productos.find(
      p => String(p.id).trim() === String(idProducto).trim()
    );


    if (!producto) {

      estado.textContent = 'El producto no está disponible.';

      return;

    }


    /* ============================================
       INFORMACIÓN DEL PRODUCTO
       ============================================ */

    document.getElementById('producto-nombre')
      .textContent = producto.nombre;


    document.getElementById('producto-categoria')
      .textContent = producto.categoria || 'NAURA';


    document.getElementById('producto-precio')
      .textContent = obtenerPrecioProducto(producto);


    document.getElementById('producto-descripcion')
      .textContent = producto.descripcion || '';


    /* ============================================
       GALERÍA DE IMÁGENES
       ============================================ */

    configurarGaleria(producto);


    /* ============================================
       ENTREGA
       ============================================ */

    configurarEntrega(producto);


    /* ============================================
       WHATSAPP
       ============================================ */

    configurarWhatsApp(producto);


    /* ============================================
       MOSTRAR PRODUCTO
       ============================================ */

    estado.remove();

    detalle.hidden = false;


    /* Título de la pestaña */

    document.title =
      `${producto.nombre} — NAURA`;


  } catch (error) {

    console.error(
      'Error al cargar el producto:',
      error
    );

    estado.textContent =
      'No se pudo cargar el producto. Intentá nuevamente.';

  }

});


/* ============================================
   GALERÍA
   ============================================ */

function configurarGaleria(producto) {

  const galeria =
    document.getElementById('galeria-producto');

  const ventana =
    galeria.parentElement;

  const botonAnterior =
    document.getElementById('galeria-anterior');

  const botonSiguiente =
    document.getElementById('galeria-siguiente');


  /* Obtener únicamente las imágenes cargadas */

  const imagenes = [
    producto.imagen,
    producto.imagen2,
    producto.imagen3,
    producto.imagen4
  ].filter(
    imagen => imagen && imagen.trim() !== ''
  );


  /* Si no hay imágenes */

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


  /* Crear las imágenes */

  galeria.innerHTML = imagenes
    .map((imagen, index) => `
      <div class="galeria-producto__slide">

        <img
          src="${imagen}"
          alt="${producto.nombre} - imagen ${index + 1}"
        >

      </div>
    `)
    .join('');


  /* Si hay una sola imagen no necesitamos flechas */

  if (imagenes.length === 1) {

    botonAnterior.hidden = true;
    botonSiguiente.hidden = true;

    return;

  }


  /* ============================================
     FLECHA ANTERIOR
     ============================================ */

  botonAnterior.addEventListener('click', () => {

    ventana.scrollBy({

      left: -ventana.clientWidth,

      behavior: 'smooth'

    });

  });


  /* ============================================
     FLECHA SIGUIENTE
     ============================================ */

  botonSiguiente.addEventListener('click', () => {

    ventana.scrollBy({

      left: ventana.clientWidth,

      behavior: 'smooth'

    });

  });

}


/* ============================================
   PRECIO
   ============================================ */

function obtenerPrecioProducto(producto) {

  const precioDesde =
    String(producto.precio || '').trim();

  const precioHasta =
    String(producto.precio_hasta || '').trim();


  /* Precio desde - hasta */

  if (precioDesde && precioHasta) {

    return `$ ${precioDesde} - $ ${precioHasta}`;

  }


  /* Precio único */

  if (precioDesde) {

    return `$ ${precioDesde}`;

  }


  return 'Consultar precio';

}


/* ============================================
   ENTREGA
   ============================================ */

function configurarEntrega(producto) {

  const elementoEntrega =
    document.getElementById('producto-entrega');


  const entrega =
    normalizarTexto(producto.entrega);


  if (entrega === 'inmediata') {

    elementoEntrega.textContent =
      'Disponible para entrega inmediata.';

    return;

  }


  if (producto.entrega) {

    elementoEntrega.textContent =
      `Tiempo estimado de entrega: ${producto.entrega}.`;

    return;

  }


  elementoEntrega.textContent =
    'Consultanos por disponibilidad.';

}


/* ============================================
   WHATSAPP
   ============================================ */

function configurarWhatsApp(producto) {

  const boton =
    document.getElementById('boton-whatsapp');


  const telefono =
    '59892066916';


  const mensaje =
    `Hola! Quería consultar por el producto ${producto.nombre}.`;


  const urlWhatsApp =
    `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;


  boton.href = urlWhatsApp;

}


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