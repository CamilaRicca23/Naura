
/* ============================================
   NAURA — COMPONENTS.JS
   Carga del header y footer reutilizables
   ============================================ */


/* ============================================
   1. CARGAR COMPONENTE HTML
   ============================================ */

/**
 * Obtiene un archivo HTML y lo inserta
 * dentro del contenedor correspondiente.
 */
async function cargarComponente(ruta, idContenedor) {
  const contenedor = document.getElementById(idContenedor);

  if (!contenedor) {
    return;
  }

  try {
    const respuesta = await fetch(ruta);

    if (!respuesta.ok) {
      throw new Error(
        `No se pudo cargar ${ruta}: ${respuesta.status}`
      );
    }

    const html = await respuesta.text();

    contenedor.innerHTML = html;

    return contenedor;

  } catch (error) {
    console.error(`Error al cargar ${ruta}:`, error);
  }
}


/* ============================================
   2. CARGAR HEADER
   ============================================ */

async function cargarHeader() {
  await cargarComponente(
    'components/header.html',
    'header-placeholder'
  );
}


/* ============================================
   3. CARGAR FOOTER
   ============================================ */

async function cargarFooter() {
  const footer = await cargarComponente(
    'components/footer.html',
    'footer-placeholder'
  );

  if (!footer) {
    return;
  }

  // Actualizar año automáticamente
  const elementoAnio = footer.querySelector('#anio');

  if (elementoAnio) {
    elementoAnio.textContent = new Date().getFullYear();
  }
}


/* ============================================
   4. INICIALIZACIÓN
   ============================================ */

cargarHeader();
cargarFooter();
