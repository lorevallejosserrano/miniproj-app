let proyectoActual = null;
let etapaActual = null;
let etapasCompletadas = JSON.parse(localStorage.getItem('etapasCompletadas')) || [];

const btnComenzar = document.getElementById('btn-comenzar');

const btnReset = document.getElementById('btn-reset');

updateBreadcrumb([
  { label: 'Inicio', screen: 'inicio' }
]);

btnComenzar.addEventListener('click', () => {
  showScreen('proyectos');
  updateBreadcrumb([
    { label: 'Inicio', screen: 'inicio' },
    { label: 'Miniproyectos', screen: 'proyectos' }
  ]);
});

btnReset.addEventListener('click', () => {
  const confirmar = confirm('¿Seguro que quieres reiniciar tu progreso?');

  if (!confirmar) {
    return;
  }

  etapasCompletadas = [];
  localStorage.removeItem('etapasCompletadas');
  proyectoActual = null;
  etapaActual = null;
  resultado.textContent = '';

  actualizarEtapas();

  showScreen('proyectos');
  updateBreadcrumb([
    { label: 'Inicio', screen: 'inicio' },
    { label: 'Miniproyectos', screen: 'proyectos' }
  ]);
});

const proyectos = document.querySelectorAll('.btn-proyecto');

proyectos.forEach(btn => {
  btn.addEventListener('click', () => {
    proyectoActual = btn.dataset.id;
    actualizarEtapas();
    showScreen('mapa');
    updateBreadcrumb([
      { label: 'Inicio', screen: 'inicio' },
      { label: 'Miniproyectos', screen: 'proyectos' },
      { label: `Proyecto ${proyectoActual}`, screen: 'mapa' }
    ]);
  });
});

const etapas = document.querySelectorAll('.btn-etapa');

function actualizarEtapas() {
  etapas.forEach(btn => {
    const id = btn.dataset.id;

    btn.classList.remove('bloqueada', 'completada');

    if (etapasCompletadas.includes(id)) {
      btn.classList.add('completada');
    }

    if (id === '1' || etapasCompletadas.includes((id - 1).toString())) {
      btn.disabled = false;
    } else {
      btn.disabled = true;
      btn.classList.add('bloqueada');
    }
  });
}

etapas.forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.disabled) {
      return;
    }

    etapaActual = btn.dataset.id;

    const ejercicio = exercises[etapaActual];
    instruccion.textContent = ejercicio.instruccion;

    editorHTML.value = ejercicio.codigoInicial;
    editorCSS.value = '';
    editorJS.value = '';
    resultado.textContent = '';

    showScreen('ide');

    updateBreadcrumb([
      { label: 'Inicio', screen: 'inicio' },
      { label: 'Miniproyectos', screen: 'proyectos' },
      { label: `Proyecto ${proyectoActual}`, screen: 'mapa' },
      { label: `Etapa ${btn.dataset.id}`, screen: 'ide' }
    ]);
  });
});

const btnEjecutar = document.getElementById('btn-ejecutar');
const editorHTML = document.getElementById('editor-html');
const editorCSS = document.getElementById('editor-css');
const editorJS = document.getElementById('editor-js');
const preview = document.getElementById('preview');
const instruccion = document.getElementById('instruccion');

function ejecutarCodigo() {
  const codigoHTML = editorHTML.value;
  const codigoCSS = editorCSS.value;
  const codigoJS = editorJS.value;

  preview.srcdoc = `
    <html>
      <head>
        <style>${codigoCSS}</style>
      </head>
      <body>
        ${codigoHTML}
        <script>${codigoJS}<\/script>
      </body>
    </html>
  `;
}

btnEjecutar.addEventListener('click', () => {
  ejecutarCodigo();
});

const btnVolver = document.getElementById('btn-volver');

btnVolver.addEventListener('click', () => {
  actualizarEtapas();
  showScreen('mapa');
  updateBreadcrumb([
    { label: 'Inicio', screen: 'inicio' },
    { label: 'Miniproyectos', screen: 'proyectos' },
    { label: `Proyecto ${proyectoActual}`, screen: 'mapa' }
  ]);
});

const btnValidar = document.getElementById('btn-validar');

const resultado = document.getElementById('resultado');

btnValidar.addEventListener('click', () => {
  ejecutarCodigo();

  preview.onload = () => {
    const doc = preview.contentDocument;
    const ejercicio = exercises[etapaActual];

    if (ejercicio.validar(doc)) {
      resultado.textContent = 'Correcto';
      resultado.style.color = 'green';

      if (!etapasCompletadas.includes(etapaActual)) {
        etapasCompletadas.push(etapaActual);
      }

      localStorage.setItem('etapasCompletadas', JSON.stringify(etapasCompletadas));
      actualizarEtapas();

    } else {
      resultado.textContent = 'Incorrecto';
      resultado.style.color = 'red';
    }
  };
});