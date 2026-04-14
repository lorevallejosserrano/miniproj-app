let proyectoActual = null;
let etapaActual = null;
let etapasCompletadas = JSON.parse(localStorage.getItem('etapasCompletadas')) || [];

const btnComenzar = document.getElementById('btn-comenzar');
const btnReset = document.getElementById('btn-reset');
const proyectos = document.querySelectorAll('.btn-proyecto');
const etapas = document.querySelectorAll('.btn-etapa');

const btnEjecutar = document.getElementById('btn-ejecutar');
const btnValidar = document.getElementById('btn-validar');
const btnVolver = document.getElementById('btn-volver');

const editorHTML = document.getElementById('editor-html');
const editorCSS = document.getElementById('editor-css');
const editorJS = document.getElementById('editor-js');
const preview = document.getElementById('preview');
const instruccion = document.getElementById('instruccion');
const resultado = document.getElementById('resultado');

const projectProgressFill = document.getElementById('project-progress-fill');
const projectProgressValue = document.getElementById('project-progress-value');

updateBreadcrumb([
  { label: 'Inicio', screen: 'inicio' }
]);

actualizarProyectos();

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

function actualizarProyectos() {
  const proyecto1 = document.querySelector('.btn-proyecto[data-id="1"]');
  const proyecto2 = document.querySelector('.btn-proyecto[data-id="2"]');

  if (!proyecto1 || !proyecto2) {
    return;
  }

  const proyecto1Completo = etapasCompletadas.length === etapas.length;
  const proyecto1EnCurso = etapasCompletadas.length > 0 && !proyecto1Completo;

  proyecto1.classList.remove('btn-proyecto-activo', 'btn-proyecto-bloqueado', 'btn-proyecto-en-curso');
  proyecto2.classList.remove('btn-proyecto-activo', 'btn-proyecto-bloqueado', 'btn-proyecto-en-curso');

  proyecto1.disabled = false;

  if (proyecto1EnCurso) {
    proyecto1.classList.add('btn-proyecto-en-curso');
  } else {
    proyecto1.classList.add('btn-proyecto-activo');
  }

  if (proyecto1Completo) {
    proyecto2.disabled = false;
    proyecto2.classList.add('btn-proyecto-activo');
  } else {
    proyecto2.disabled = true;
    proyecto2.classList.add('btn-proyecto-bloqueado');
  }
}

proyectos.forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.disabled) {
      return;
    }

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

  actualizarProgresoProyecto();
  actualizarProyectos();
}

function actualizarProgresoProyecto() {
  const totalEtapas = etapas.length;
  const etapasResueltas = etapasCompletadas.length;
  const porcentaje = totalEtapas === 0 ? 0 : Math.round((etapasResueltas / totalEtapas) * 100);

  projectProgressFill.style.width = `${porcentaje}%`;
  projectProgressValue.textContent = `${porcentaje}%`;
}

etapas.forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.disabled) {
      return;
    }

    etapaActual = btn.dataset.id;

    const ejercicio = exercises[etapaActual];
    instruccion.textContent = ejercicio.instruccion;

    editorHTML.value = '';
    editorCSS.value = '';
    editorJS.value = '';

    editorHTML.placeholder = ejercicio.placeholderHTML || 'Escribe aquí tu HTML';
    editorCSS.placeholder = ejercicio.placeholderCSS || 'Escribe aquí tu CSS';
    editorJS.placeholder = ejercicio.placeholderJS || 'Escribe aquí tu JavaScript';

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

btnVolver.addEventListener('click', () => {
  actualizarEtapas();

  showScreen('mapa');
  updateBreadcrumb([
    { label: 'Inicio', screen: 'inicio' },
    { label: 'Miniproyectos', screen: 'proyectos' },
    { label: `Proyecto ${proyectoActual}`, screen: 'mapa' }
  ]);
});

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