
/* ============================================
   NAURA — ANIMACIONES.JS
   Scroll reveal e intro de marca
   ============================================ */


/* ============================================
   1. INICIALIZACIÓN
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  configurarScrollReveal();
  configurarIntroNaura();
});


/* ============================================
   2. SCROLL REVEAL
   ============================================ */

/**
 * Muestra los elementos cuando entran
 * en la pantalla al hacer scroll.
 */
function configurarScrollReveal() {
  const elementos = document.querySelectorAll('.reveal');

  if (elementos.length === 0) {
    return;
  }

  // Respetar preferencia de movimiento reducido
  const movimientoReducido = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  // Mostrar directamente si no se pueden usar animaciones
  if (movimientoReducido || !('IntersectionObserver' in window)) {
    elementos.forEach(elemento => {
      elemento.classList.add('reveal--visible');
    });
    return;
  }

  // Observar cuándo aparece cada elemento
  const observador = new IntersectionObserver(
    entradas => {
      entradas.forEach(entrada => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('reveal--visible');

          // Animar solamente una vez
          observador.unobserve(entrada.target);
        }
      });
    },
    {
      threshold: 0.15
    }
  );

  elementos.forEach(elemento => {
    observador.observe(elemento);
  });
}


/* ============================================
   3. INTRO NAURA
   ============================================ */

/**
 * Controla la presentación inicial de la marca.
 * Solo se ejecuta si existe #intro-naura.
 */
function configurarIntroNaura() {
  const intro = document.getElementById('intro-naura');

  if (!intro) {
    return;
  }

  const movimientoReducido = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  // Omitir la intro si se prefiere reducir movimiento
  if (movimientoReducido) {
    intro.remove();
    document.body.classList.remove('intro-activa');
    return;
  }

  // Bloquear scroll durante la presentación
  document.body.classList.add('intro-activa');

  // Comenzar salida después de 2,2 segundos
  setTimeout(() => {
    intro.classList.add('intro-naura--salir');
  }, 2200);

  // Eliminar intro al finalizar
  setTimeout(() => {
    intro.remove();
    document.body.classList.remove('intro-activa');
  }, 1800);
}
