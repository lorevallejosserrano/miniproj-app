const screens = {
    inicio: document.getElementById('screen-inicio'),
    proyectos: document.getElementById('screen-proyectos'),
    mapa: document.getElementById('screen-mapa'),
    ide: document.getElementById('screen-ide')
};


function showScreen(screenName){
    Object.values(screens).forEach(screen => {
        screen.style.display = 'none';
    });

    screens[screenName].style.display = 'block';
}

function updateBreadcrumb(ruta) {
  const breadcrumb = document.getElementById('breadcrumb');

  breadcrumb.innerHTML = ruta.map(item => {
    return `<span class="crumb" data-screen="${item.screen}">${item.label}</span>`;
  }).join(' > ');
}

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('crumb')) {
    const screen = e.target.dataset.screen;
    showScreen(screen);
  }
});