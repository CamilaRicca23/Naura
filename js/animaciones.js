/* ============================================
   NAURA — animaciones.js
   Hace que los elementos con clase "reveal"
   aparezcan (fade + slide) cuando entran
   en la pantalla al hacer scroll.
   Usa IntersectionObserver, nativo del navegador.
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const elementos = document.querySelectorAll('.reveal');

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach(entrada => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('reveal--visible');
          observador.unobserve(entrada.target); // se anima una sola vez
        }
      });
    },
    { threshold: 0.15 } // se activa cuando el 15% del elemento es visible
  );

  elementos.forEach(el => observador.observe(el));
});

/* ============================================
   INTRO NAURA
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  const intro = document.getElementById('intro-naura');

  if (!intro) return;

  // Evita scroll mientras se reproduce la intro
  document.body.classList.add('intro-activa');

  // Esperamos a que aparezca NAURA
  setTimeout(() => {

    intro.classList.add('intro-naura--salir');

  }, 1900);


  // Eliminamos completamente la intro
  setTimeout(() => {

    intro.remove();

    document.body.classList.remove('intro-activa');

  }, 3100);

});
/* ============================================
   INTRO NAURA
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  const intro = document.getElementById('intro-naura');

  if (!intro) return;

  // Bloqueamos el scroll mientras está la presentación
  document.body.classList.add('intro-activa');


  // Después de mostrar el logo comenzamos la salida
  setTimeout(() => {

    intro.classList.add('intro-naura--salir');

  }, 2200);


  // Cuando terminó la animación,
  // eliminamos completamente la intro
  setTimeout(() => {

    intro.remove();

    document.body.classList.remove('intro-activa');

  }, 3400);

});