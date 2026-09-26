/* ============================================
   NAURA — components.js
   Inyecta el header y footer reutilizables
   en cada página que tenga los placeholders:
   <div id="header-placeholder"></div>
   <div id="footer-placeholder"></div>
   ============================================ */

// Cargar el header
fetch('components/header.html')
  .then(respuesta => respuesta.text())
  .then(html => {
    document.getElementById('header-placeholder').innerHTML = html;
  })
  .catch(error => console.error('Error cargando el header:', error));

// Cargar el footer
fetch('components/footer.html')
  .then(respuesta => respuesta.text())
  .then(html => {
    document.getElementById('footer-placeholder').innerHTML = html;

    // Una vez que el footer está en el DOM, completar el año actual
    const elementoAnio = document.getElementById('anio');
    if (elementoAnio) {
      elementoAnio.textContent = new Date().getFullYear();
    }
  })
  .catch(error => console.error('Error cargando el footer:', error));