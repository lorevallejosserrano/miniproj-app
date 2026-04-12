const exercises = {
  1: {
    titulo: 'Etapa 1',
    instruccion: 'Crea un h1 que diga Hola',
    codigoInicial: '<!-- escribe un h1 aquí -->',
    validar: (doc) => {
      const h1 = doc.querySelector('h1');
      return h1 && h1.textContent === 'Hola';
    }
  },
  2: {
    titulo: 'Etapa 2',
    instruccion: 'Crea un párrafo que diga Mundo',
    codigoInicial: '<!-- escribe un párrafo aquí -->',
    validar: (doc) => {
      const p = doc.querySelector('p');
      return p && p.textContent === 'Mundo';
    }
  }
};