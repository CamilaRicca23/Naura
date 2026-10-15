
/* ============================================
   NAURA — sobrenaura.js
   Formas de pago y copiado de cuentas
   ============================================ */

const cuentasBancarias = [
  {
    banco: 'ITAU',
    logo: 'img/itau-logo.jpg',
    numero: '7858970',
    info: 'Cuenta en pesos',
    titular: 'Evelyn Ricca'
  },
  {
    banco: 'BROU',
    logo: 'img/brou-logo.jpg',
    numero: '110156357-00001',
    info: 'Caja de ahorro en pesos',
    titular: 'Evelyn Ricca'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  mostrarCuentasBancarias();
});

function mostrarCuentasBancarias() {
  const contenedor = document.getElementById('lista-bancos');

  if (!contenedor) return;

  contenedor.innerHTML = cuentasBancarias.map((cuenta, index) => {
    const tieneNumero = cuenta.numero.trim() !== '';

    return `
      <article class="sobre-naura__banco">

        <div class="sobre-naura__banco-identidad">
          <img
            src="${cuenta.logo}"
            alt="Logo de ${cuenta.banco}"
            class="sobre-naura__banco-logo"
          >

          <div>
            <h3>${cuenta.banco}</h3>
            ${cuenta.titular
        ? `<p>Titular: ${cuenta.titular}</p>`
        : ''}
          </div>
        </div>

        <div class="sobre-naura__banco-cuenta">
          <div>
            <span class="sobre-naura__banco-etiqueta">
              Número de cuenta
            </span>

            <p class="sobre-naura__banco-numero">
              ${cuenta.numero}
            </p>
            <p class="sobre-naura__banco-info">
               ${cuenta.info}
            </p>

          </div>

          <button
            type="button"
            class="sobre-naura__copiar"
            data-indice="${index}"
            ${tieneNumero ? '' : 'disabled'}
          >
            Copiar cuenta
          </button>
        </div>

      </article>
    `;
  }).join('');

  contenedor.querySelectorAll('.sobre-naura__copiar')
    .forEach(boton => {
      boton.addEventListener('click', async () => {
        const indice = Number(boton.dataset.indice);
        const numero = cuentasBancarias[indice].numero;

        if (!numero) return;

        try {
          await copiarTexto(numero);

          boton.textContent = '¡Copiado!';

          setTimeout(() => {
            boton.textContent = 'Copiar cuenta';
          }, 2000);

        } catch (error) {
          console.error('No se pudo copiar:', error);
          boton.textContent = 'No se pudo copiar';
        }
      });
    });
}

async function copiarTexto(texto) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(texto);
    return;
  }

  const campo = document.createElement('textarea');
  campo.value = texto;
  campo.style.position = 'fixed';
  campo.style.opacity = '0';

  document.body.appendChild(campo);
  campo.select();

  const copiado = document.execCommand('copy');
  campo.remove();

  if (!copiado) {
    throw new Error('No se pudo copiar el número');
  }
}
