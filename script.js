const RESIDUOS = [
  { e: '🍎', n: 'manzana',           t: 'organico' },
  { e: '🍌', n: 'cáscara de banano', t: 'organico' },
  { e: '🥕', n: 'zanahoria',         t: 'organico' },
  { e: '🥚', n: 'cáscara de huevo',  t: 'organico' },
  {e: '🍓​', n: 'fresa',  t: 'organico' },
  { e: '🫐', n: 'arandanos',  t: 'organico' },
  { e: '​🍋‍🟩​', n: 'limon seco como mi ex',  t: 'organico' },
  { e: '🍾', n: 'botella de vidrio', t: 'vidrio' },
  { e: '🫙', n: 'frasco de vidrio',  t: 'vidrio' },
  { e: '🥃', n: 'vaso de vidrio',    t: 'vidrio' },
  { e: '🥤', n: 'vaso de plástico',  t: 'plastico' },
  { e: '🥫', n: 'lata',              t: 'plastico' },
  { e: '🧴', n: 'envase de plástico', t: 'plastico' },
  { e: '🍼', n: 'biberon vacio',    t: 'plastico' },

];

const suelo = document.getElementById('suelo');
const estado = document.getElementById('estado');
const botes = [...document.querySelectorAll('.bote')];
let restantes = 0;

function mensaje(texto, clase = '') {
  estado.textContent = texto;
  estado.className = 'estado ' + clase;
}

function iniciar() {
  suelo.innerHTML = '';
  botes.forEach(b => b.querySelector('.contador').textContent = '0');
  restantes = RESIDUOS.length;
  mensaje('Arrastra cada residuo al bote correcto.');

  const ancho = suelo.clientWidth - 64;
  const alto = suelo.clientHeight - 64;

  RESIDUOS.forEach(r => {
    const el = document.createElement('div');
    el.className = 'basura';
    el.textContent = r.e;
    el.title = r.n;
    el.style.left = Math.random() * ancho + 'px';
    el.style.top = Math.random() * alto + 'px';
    el.style.transform = `rotate(${Math.random() * 60 - 30}deg)`;
    activarArrastre(el, r);
    suelo.appendChild(el);
  });
}

function boteBajo(x, y) {
  return botes.find(b => {
    const r = b.getBoundingClientRect();
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  });
}

function activarArrastre(el, residuo) {
  let dx = 0, dy = 0, inicioX = 0, inicioY = 0;

  el.addEventListener('pointerdown', e => {
    el.setPointerCapture(e.pointerId);
    el.classList.remove('volver', 'mal');
    el.classList.add('arrastrando');
    inicioX = el.offsetLeft;
    inicioY = el.offsetTop;
    const s = suelo.getBoundingClientRect();
    dx = e.clientX - s.left - el.offsetLeft;
    dy = e.clientY - s.top - el.offsetTop;
    el.style.transform = '';
  });

  el.addEventListener('pointermove', e => {
    if (!el.classList.contains('arrastrando')) return;
    const s = suelo.getBoundingClientRect();
    el.style.left = (e.clientX - s.left - dx) + 'px';
    el.style.top = (e.clientY - s.top - dy) + 'px';
    botes.forEach(b => b.classList.remove('encima'));
    const b = boteBajo(e.clientX, e.clientY);
    if (b) b.classList.add('encima');
  });

  el.addEventListener('pointerup', e => {
    if (!el.classList.contains('arrastrando')) return;
    el.classList.remove('arrastrando');
    botes.forEach(b => b.classList.remove('encima'));
    const bote = boteBajo(e.clientX, e.clientY);

    if (!bote) return; // lo soltó en el suelo: se queda ahí

    if (bote.dataset.tipo === residuo.t) {
      // Bote correcto: suma y desaparece
      const c = bote.querySelector('.contador');
      c.textContent = +c.textContent + 1;
      el.classList.add('fuera');
      setTimeout(() => el.remove(), 250);
      restantes--;
      mensaje(
        restantes ? '¡Bien! ' + residuo.n + ' va ahí.' : '¡Listo! Todo quedó bien separado. 🎉',
        'bien'
      );
    } else {
      mensaje('Ese no: ' + residuo.n + ' no va en ese bote.', 'mal');
      el.classList.add('volver', 'mal');
      el.style.left = inicioX + 'px';
      el.style.top = inicioY + 'px';
    }
  });
}

document.getElementById('reiniciar').addEventListener('click', iniciar);
iniciar();