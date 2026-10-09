/* ==========================================================
   Geografía en Juego — script.js
   JavaScript puro, sin librerías, sin red, sin almacenamiento.

   CÓMO SE MANTIENE CADA PARTIDA INDEPENDIENTE
   - Todo el estado vive en la variable `state`, dentro de esta función
     autoejecutable. Existe solo en la memoria de esta pestaña.
   - No se usa localStorage, sessionStorage, cookies, IndexedDB, fetch,
     XMLHttpRequest, WebSocket ni nada que guarde o envíe datos.
   - Cada celular descarga su propia copia de la página y arranca desde cero.
     Al recargar, cerrar la pestaña o tocar "Inicio", todo se borra.
   ========================================================== */
(function () {
  'use strict';

  /* ---------- Ajustes ---------- */
  const MAX_CHAIN = 5;          // países por conexión, contando los dos de las puntas
  const CHAIN_PLAYERS = 2;      // jugadores de Geografía en Cadena
  const MAX_NAME_LENGTH = 14;

  const MAX_MIDDLE = MAX_CHAIN - 2;   // países que se pueden poner en el medio

  /* ==========================================================
     DATOS: PAÍSES
     [nombre, código ISO de dos letras, que es lo que dibuja la bandera]
     Están solo los países que usan los dos juegos. Si agregás un desafío con
     un país nuevo, agregalo también acá (y, si es de Cadena, sus fronteras).
     ========================================================== */
  const COUNTRY_DATA = [
    ['Afganistán', 'AF'], ['Alemania', 'DE'], ['Arabia Saudita', 'SA'], ['Argelia', 'DZ'],
    ['Argentina', 'AR'], ['Australia', 'AU'], ['Austria', 'AT'], ['Bangladés', 'BD'],
    ['Bélgica', 'BE'], ['Belice', 'BZ'], ['Bolivia', 'BO'], ['Brasil', 'BR'],
    ['Canadá', 'CA'], ['Chad', 'TD'], ['Chile', 'CL'], ['China', 'CN'],
    ['Colombia', 'CO'], ['Corea del Sur', 'KR'], ['Costa Rica', 'CR'], ['Cuba', 'CU'],
    ['Ecuador', 'EC'], ['Egipto', 'EG'], ['El Salvador', 'SV'], ['España', 'ES'],
    ['Estados Unidos', 'US'], ['Etiopía', 'ET'], ['Fiyi', 'FJ'], ['Francia', 'FR'],
    ['Grecia', 'GR'], ['Guatemala', 'GT'], ['Guyana', 'GY'], ['Honduras', 'HN'],
    ['India', 'IN'], ['Irak', 'IQ'], ['Irán', 'IR'], ['Italia', 'IT'],
    ['Japón', 'JP'], ['Libia', 'LY'], ['Malí', 'ML'], ['Marruecos', 'MA'],
    ['Mauritania', 'MR'], ['México', 'MX'], ['Nepal', 'NP'], ['Nicaragua', 'NI'],
    ['Níger', 'NE'], ['Noruega', 'NO'], ['Nueva Zelanda', 'NZ'], ['Pakistán', 'PK'],
    ['Panamá', 'PA'], ['Papúa Nueva Guinea', 'PG'], ['Paraguay', 'PY'], ['Perú', 'PE'],
    ['Polonia', 'PL'], ['Portugal', 'PT'], ['Sudán', 'SD'], ['Suiza', 'CH'],
    ['Tailandia', 'TH'], ['Túnez', 'TN'], ['Turquía', 'TR'], ['Uruguay', 'UY'],
    ['Venezuela', 'VE']
  ];

  /* ==========================================================
     JUEGO 1 — DESAFÍOS DE PAÍS INFILTRADO
     Son exactamente los 10 ejemplos del PDF "pais_infiltrado_10_ejemplos", siempre en este
     orden (ejemplo 1, 2, ... 10) y con los 5 países en el mismo orden que en cada tarjeta.
     options:  los 5 países, tal cual figuran en la tarjeta
     intruder: la respuesta (uno de los 5)
     why:      la explicación del PDF, que se muestra después de confirmar
     ========================================================== */
  const CHALLENGES = [
    // Ejemplo 1
    { options: ['Argentina', 'Brasil', 'Chile', 'Perú', 'Francia'], intruder: 'Francia',
      why: 'Los otros 4 países están en América del Sur.' },
    // Ejemplo 2
    { options: ['España', 'México', 'Argentina', 'Colombia', 'Japón'], intruder: 'Japón',
      why: 'Los otros 4 tienen el español como idioma oficial.' },
    // Ejemplo 3
    { options: ['Italia', 'Francia', 'Alemania', 'España', 'China'], intruder: 'China',
      why: 'Los otros 4 están en Europa.' },
    // Ejemplo 4
    { options: ['Canadá', 'Estados Unidos', 'México', 'Cuba', 'Egipto'], intruder: 'Egipto',
      why: 'Los otros 4 están en América del Norte o el Caribe.' },
    // Ejemplo 5
    { options: ['Japón', 'China', 'Corea del Sur', 'Tailandia', 'Portugal'], intruder: 'Portugal',
      why: 'Los otros 4 están en Asia.' },
    // Ejemplo 6. El PDF dice "Los otros 4 limitan con Argentina", pero Argentina es uno de esos 4 y no
    // limita consigo misma. La respuesta (Australia) es la misma; se corrigió solo la explicación.
    { options: ['Argentina', 'Brasil', 'Uruguay', 'Paraguay', 'Australia'], intruder: 'Australia',
      why: 'Los otros 4 están en América del Sur.' },
    // Ejemplo 7
    { options: ['España', 'Portugal', 'Francia', 'Italia', 'Brasil'], intruder: 'Brasil',
      why: 'Los otros 4 están en Europa.' },
    // Ejemplo 8
    { options: ['Egipto', 'Marruecos', 'Argelia', 'Túnez', 'Noruega'], intruder: 'Noruega',
      why: 'Los otros 4 están en África.' },
    // Ejemplo 9
    { options: ['Estados Unidos', 'Canadá', 'México', 'Brasil', 'Cuba'], intruder: 'Brasil',
      why: 'Los otros 4 están en América del Norte o el Caribe.' },
    // Ejemplo 10
    { options: ['Australia', 'Nueva Zelanda', 'Fiyi', 'Papúa Nueva Guinea', 'Alemania'], intruder: 'Alemania',
      why: 'Los otros 4 son países de Oceanía.' }
  ];

  /* ==========================================================
     JUEGO 2 — GEOGRAFÍA EN CADENA

     LIMITES: pares de países que comparten frontera terrestre. Se escriben una
     sola vez y el juego los usa en los dos sentidos.
     Nota: NO se incluye España-Marruecos (Ceuta y Melilla), porque en un mapa
     escolar esos dos países aparecen separados por el estrecho de Gibraltar.
     ========================================================== */
  const LIMITES = [
    // América del Sur
    ['Argentina', 'Chile'], ['Argentina', 'Bolivia'], ['Argentina', 'Paraguay'],
    ['Argentina', 'Brasil'], ['Argentina', 'Uruguay'],
    ['Chile', 'Bolivia'], ['Chile', 'Perú'],
    ['Bolivia', 'Perú'], ['Bolivia', 'Brasil'], ['Bolivia', 'Paraguay'],
    ['Perú', 'Brasil'], ['Perú', 'Colombia'], ['Perú', 'Ecuador'],
    ['Brasil', 'Colombia'], ['Brasil', 'Venezuela'], ['Brasil', 'Guyana'],
    ['Brasil', 'Uruguay'], ['Brasil', 'Paraguay'],
    ['Colombia', 'Ecuador'], ['Colombia', 'Venezuela'], ['Colombia', 'Panamá'],
    ['Venezuela', 'Guyana'],
    // América del Norte y Central
    ['Canadá', 'Estados Unidos'], ['Estados Unidos', 'México'],
    ['México', 'Guatemala'], ['México', 'Belice'],
    ['Guatemala', 'Belice'], ['Guatemala', 'Honduras'], ['Guatemala', 'El Salvador'],
    ['Honduras', 'El Salvador'], ['Honduras', 'Nicaragua'],
    ['Nicaragua', 'Costa Rica'], ['Costa Rica', 'Panamá'],
    // Europa
    ['España', 'Portugal'], ['España', 'Francia'],
    ['Francia', 'Bélgica'], ['Francia', 'Alemania'], ['Francia', 'Suiza'], ['Francia', 'Italia'],
    ['Alemania', 'Bélgica'], ['Alemania', 'Suiza'], ['Alemania', 'Austria'], ['Alemania', 'Polonia'],
    ['Italia', 'Suiza'], ['Italia', 'Austria'], ['Suiza', 'Austria'],
    ['Grecia', 'Turquía'],
    // África
    ['Marruecos', 'Argelia'], ['Marruecos', 'Mauritania'],
    ['Argelia', 'Túnez'], ['Argelia', 'Libia'], ['Argelia', 'Níger'],
    ['Argelia', 'Malí'], ['Argelia', 'Mauritania'],
    ['Túnez', 'Libia'],
    ['Libia', 'Níger'], ['Libia', 'Chad'], ['Libia', 'Sudán'], ['Libia', 'Egipto'],
    ['Egipto', 'Sudán'], ['Sudán', 'Chad'], ['Sudán', 'Etiopía'],
    ['Chad', 'Níger'], ['Níger', 'Malí'], ['Malí', 'Mauritania'],
    // Asia
    ['India', 'Pakistán'], ['India', 'China'], ['India', 'Nepal'], ['India', 'Bangladés'],
    ['Pakistán', 'China'], ['Pakistán', 'Afganistán'], ['Pakistán', 'Irán'],
    ['Irán', 'Afganistán'], ['Irán', 'Irak'], ['Irán', 'Turquía'],
    ['Afganistán', 'China'], ['China', 'Nepal'],
    ['Irak', 'Turquía'], ['Irak', 'Arabia Saudita']
  ];

  // Países que aparecen en el juego y no tienen NINGÚN límite terrestre (son islas).
  // Se declaran aparte para que se vea que no es un dato que falta.
  const SIN_LIMITES = ['Cuba'];

  /* Los 10 desafíos de Geografía en Cadena, siempre en este orden.
     from / to: los dos países de las puntas
     options:   los 8 países que se pueden tocar (incluye algunos que no sirven)
     solution:  una solución posible, la que se muestra si la respuesta está mal */
  const LINKS = [
    { from: 'Argentina', to: 'Perú',
      options: ['Bolivia', 'Chile', 'Brasil', 'Uruguay', 'Paraguay', 'Ecuador', 'Colombia', 'México'],
      solution: ['Argentina', 'Bolivia', 'Perú'] },
    { from: 'España', to: 'Alemania',
      options: ['Francia', 'Portugal', 'Italia', 'Suiza', 'Bélgica', 'Austria', 'Polonia', 'Marruecos'],
      solution: ['España', 'Francia', 'Alemania'] },
    { from: 'Chile', to: 'Brasil',
      options: ['Argentina', 'Bolivia', 'Perú', 'Uruguay', 'Paraguay', 'Ecuador', 'Colombia', 'Venezuela'],
      solution: ['Chile', 'Argentina', 'Brasil'] },
    { from: 'Egipto', to: 'Argelia',
      options: ['Libia', 'Sudán', 'Chad', 'Níger', 'Túnez', 'Marruecos', 'Malí', 'Etiopía'],
      solution: ['Egipto', 'Libia', 'Argelia'] },
    { from: 'Estados Unidos', to: 'Guatemala',
      options: ['México', 'Canadá', 'Belice', 'Cuba', 'Honduras', 'El Salvador', 'Nicaragua', 'Panamá'],
      solution: ['Estados Unidos', 'México', 'Guatemala'] },
    { from: 'Uruguay', to: 'Perú',
      options: ['Brasil', 'Argentina', 'Bolivia', 'Chile', 'Paraguay', 'Colombia', 'Ecuador', 'Venezuela'],
      solution: ['Uruguay', 'Brasil', 'Perú'] },
    { from: 'Portugal', to: 'Italia',
      options: ['España', 'Francia', 'Suiza', 'Austria', 'Alemania', 'Marruecos', 'Grecia', 'Bélgica'],
      solution: ['Portugal', 'España', 'Francia', 'Italia'] },
    { from: 'Nepal', to: 'Irán',
      options: ['India', 'Pakistán', 'China', 'Afganistán', 'Bangladés', 'Irak', 'Turquía', 'Arabia Saudita'],
      solution: ['Nepal', 'India', 'Pakistán', 'Irán'] },
    { from: 'Marruecos', to: 'Egipto',
      options: ['Argelia', 'Libia', 'Túnez', 'Níger', 'Malí', 'Chad', 'Sudán', 'Mauritania'],
      solution: ['Marruecos', 'Argelia', 'Libia', 'Egipto'] },
    { from: 'Chile', to: 'Venezuela',
      options: ['Perú', 'Colombia', 'Bolivia', 'Brasil', 'Argentina', 'Ecuador', 'Paraguay', 'Guyana'],
      solution: ['Chile', 'Perú', 'Colombia', 'Venezuela'] }
  ];

  /* ==========================================================
     UTILIDADES
     ========================================================== */

  function flagEmoji(iso) {
    return String.fromCodePoint.apply(null, iso.split('').map(function (ch) {
      return 0x1F1E6 + ch.charCodeAt(0) - 65;
    }));
  }

  // minúsculas, sin tildes, sin signos: solo para comparar nombres de jugadores
  function norm(text) {
    return String(text)
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  function pluralPaises(n) {
    return n + (n === 1 ? ' país' : ' países');
  }

  /* ---------- Índice de países y de fronteras ---------- */

  const countries = COUNTRY_DATA.map(function (row, id) {
    return { id: id, name: row[0], iso: row[1], flag: flagEmoji(row[1]) };
  });

  const byName = new Map();
  countries.forEach(function (c) { byName.set(c.name, c); });

  const vecinos = new Map();
  LIMITES.forEach(function (par) {
    [[par[0], par[1]], [par[1], par[0]]].forEach(function (p) {
      if (!vecinos.has(p[0])) { vecinos.set(p[0], new Set()); }
      vecinos.get(p[0]).add(p[1]);
    });
  });

  function limita(a, b) {
    return vecinos.has(a) && vecinos.get(a).has(b);
  }

  /* ==========================================================
     ESTADO (solo en memoria de esta pestaña)
     ========================================================== */
  const state = {
    inf: null,     // partida de País Infiltrado
    chain: null,   // partida de Geografía en Cadena
    soundOn: true
  };

  /* ==========================================================
     DOM
     ========================================================== */
  function $(id) { return document.getElementById(id); }

  function clear(node) {
    while (node.firstChild) { node.removeChild(node.firstChild); }
  }

  function makeEl(tag, className, text) {
    const e = document.createElement(tag);
    if (className) { e.className = className; }
    if (text !== undefined) { e.textContent = text; }
    return e;
  }

  const SVG_NS = 'http://www.w3.org/2000/svg';

  // Crea un ícono SVG que reutiliza un símbolo definido en index.html
  function icon(name, extraClass) {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', 'icon' + (extraClass ? ' ' + extraClass : ''));
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    const use = document.createElementNS(SVG_NS, 'use');
    use.setAttribute('href', '#i-' + name);
    svg.appendChild(use);
    return svg;
  }

  // Ícono + texto en un mismo elemento
  function iconText(name, text, className) {
    const wrap = makeEl('span', className || 'icon-text');
    wrap.appendChild(icon(name));
    wrap.appendChild(makeEl('span', '', text));
    return wrap;
  }

  // Bandera + nombre, como se muestra en cualquier botón o ficha de país
  function countryLabel(parent, c, flagClass, nameClass) {
    const flag = makeEl('span', flagClass, c.flag);
    flag.setAttribute('aria-hidden', 'true');
    parent.appendChild(flag);
    parent.appendChild(makeEl('span', nameClass, c.name));
    return parent;
  }

  const SCREENS = ['screen-home', 'screen-rules', 'screen-inf', 'screen-inf-end',
                   'screen-chain-setup', 'screen-chain', 'screen-chain-end'];

  function showScreen(id) {
    SCREENS.forEach(function (s) { $(s).hidden = (s !== id); });
    $('btn-home').hidden = (id === 'screen-home');
    try { window.scrollTo(0, 0); } catch (e) { /* sin scroll */ }
    const target = $(id);
    // reiniciar la animación de entrada
    target.style.animation = 'none';
    void target.offsetWidth;
    target.style.animation = '';
  }

  function focusHeading(id) {
    const h = $(id);
    if (h && typeof h.focus === 'function') {
      try { h.focus({ preventScroll: true }); } catch (e) { h.focus(); }
    }
  }

  function scrollIntoViewSoft(node) {
    if (node && typeof node.scrollIntoView === 'function') {
      // sin animación: si la pantalla se mueve mientras alguien toca, el dedo cae en otro botón
      try { node.scrollIntoView({ block: 'nearest' }); } catch (e) { /* nada */ }
    }
  }

  /* ==========================================================
     SONIDO (Web Audio API, sin archivos)
     ========================================================== */
  let audioCtx = null;

  function getAudio() {
    if (!state.soundOn) { return null; }
    try {
      if (!audioCtx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) { return null; }
        audioCtx = new AC();
      }
      if (audioCtx.state === 'suspended' && typeof audioCtx.resume === 'function') {
        audioCtx.resume();
      }
      return audioCtx;
    } catch (e) {
      return null;
    }
  }

  function tone(ctx, freq, start, dur, type, vol) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(vol, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + dur + 0.05);
  }

  function playSound(kind) {
    const ctx = getAudio();
    if (!ctx) { return; }
    try {
      const t = ctx.currentTime;
      if (kind === 'tap') {
        tone(ctx, 520, t, 0.07, 'triangle', 0.12);
      } else if (kind === 'ok') {
        tone(ctx, 660, t, 0.14, 'triangle', 0.22);
        tone(ctx, 880, t + 0.12, 0.2, 'triangle', 0.22);
      } else if (kind === 'bad') {
        tone(ctx, 240, t, 0.18, 'sawtooth', 0.14);
        tone(ctx, 170, t + 0.16, 0.3, 'sawtooth', 0.14);
      } else if (kind === 'win') {
        [523, 659, 784, 1047, 1319].forEach(function (f, i) {
          tone(ctx, f, t + i * 0.13, 0.28, 'triangle', 0.22);
        });
      }
    } catch (e) { /* el sonido nunca debe romper el juego */ }
  }

  function renderSoundButton() {
    $('sound-label').textContent = state.soundOn ? 'Sonido: ON' : 'Sonido: OFF';
    $('sound-use').setAttribute('href', state.soundOn ? '#i-volume' : '#i-volume-off');
    $('btn-sound').setAttribute('aria-pressed', state.soundOn ? 'true' : 'false');
  }

  /* ==========================================================
     NAVEGACIÓN
     ========================================================== */
  function wipeAllGames() {
    state.chain = null;
    state.inf = null;

    // vaciar todo lo que se haya dibujado
    clear($('inf-options'));
    clear($('chain-build'));
    clear($('chain-options'));
    clear($('names-list'));
    $('inf-confirm').hidden = true;
    $('inf-result').hidden = true;
    $('chain-result').hidden = true;
    $('chain-result-solution').hidden = true;
    $('chain-result-why').hidden = true;
    $('names-error').hidden = true;
    // no debe quedar ni un nombre ni un país de la partida anterior en la página
    ['chain-hint', 'turn-name', 'link-from', 'link-from-flag', 'link-to', 'link-to-flag',
     'chain-result-chain', 'chain-result-why', 'chain-result-solution-text',
     'chain-result-title-text', 'winner-name', 'winner-scores', 'winner-sub'
    ].forEach(function (id) { $(id).textContent = ''; });
    ['score-1', 'score-2'].forEach(function (id) {
      clear($(id));
      $(id).classList.remove('is-turn');
    });
  }

  function goHome() {
    wipeAllGames();
    showScreen('screen-home');
  }

  /* ==========================================================
     JUEGO 1 — PAÍS INFILTRADO
     ========================================================== */

  function startInfiltrado() {
    wipeAllGames();
    state.inf = {
      queue: CHALLENGES.slice(),    // siempre el mismo orden: ejemplo 1, 2, ... 10
      pos: 0,
      score: 0,
      current: null
    };
    showScreen('screen-inf');
    prepareChallenge();
    focusHeading('inf-title');
  }

  function prepareChallenge() {
    const g = state.inf;
    const ch = g.queue[g.pos];
    const intruder = byName.get(ch.intruder);
    const options = ch.options.map(function (n) { return byName.get(n); });   // mismo orden que la tarjeta
    g.current = { challenge: ch, intruder: intruder, options: options, selected: null, locked: false };
    renderChallenge();
  }

  function renderChallenge() {
    const g = state.inf;
    const cur = g.current;

    $('inf-progress').textContent = 'Desafío ' + (g.pos + 1) + ' de ' + g.queue.length;
    $('inf-score').textContent = String(g.score);

    const box = $('inf-options');
    clear(box);
    cur.options.forEach(function (c, i) {
      const b = makeEl('button', 'opt');
      b.type = 'button';
      b.setAttribute('aria-pressed', 'false');
      countryLabel(b, c, 'opt-flag', 'opt-name');
      b.addEventListener('click', function () { selectOption(i); });
      box.appendChild(b);
    });

    $('inf-confirm').hidden = true;
    $('inf-result').hidden = true;
    try { window.scrollTo(0, 0); } catch (e) { /* nada */ }
  }

  function optionButtons() {
    return Array.prototype.slice.call($('inf-options').querySelectorAll('.opt'));
  }

  function selectOption(i) {
    const g = state.inf;
    if (!g || !g.current || g.current.locked) { return; }
    g.current.selected = i;
    optionButtons().forEach(function (b, k) {
      b.setAttribute('aria-pressed', k === i ? 'true' : 'false');
    });
    const c = g.current.options[i];
    $('inf-chosen').textContent = 'Elegiste ' + c.flag + ' ' + c.name + '.';
    $('inf-confirm').hidden = false;
  }

  function confirmAnswer() {
    const g = state.inf;
    if (!g || !g.current) { return; }
    const cur = g.current;
    if (cur.locked || cur.selected === null) { return; }
    cur.locked = true;

    const chosen = cur.options[cur.selected];
    const correct = chosen.id === cur.intruder.id;
    if (correct) { g.score += 1; }

    optionButtons().forEach(function (b, k) {
      const c = cur.options[k];
      b.disabled = true;
      if (c.id === cur.intruder.id) {
        b.classList.add('is-intruder');
        b.appendChild(iconText('check', 'Infiltrado', 'tag'));
      } else if (k === cur.selected) {
        b.classList.add('is-wrong');
        b.appendChild(iconText('x', 'Tu respuesta', 'tag tag--wrong'));
      } else {
        b.classList.add('is-dim');
      }
    });

    const result = $('inf-result');
    result.classList.toggle('result--ok', correct);
    result.classList.toggle('result--bad', !correct);
    $('inf-result-use').setAttribute('href', correct ? '#i-check' : '#i-x');
    $('inf-result-title-text').textContent = correct ? '¡CORRECTO!' : 'INCORRECTO';
    $('inf-result-answer').textContent = 'El país infiltrado era ' + cur.intruder.name + ' ' + cur.intruder.flag;
    const pick = $('inf-result-pick');
    if (correct) {
      pick.hidden = true;
      pick.textContent = '';
    } else {
      pick.hidden = false;
      pick.textContent = 'Elegiste ' + chosen.name + ' ' + chosen.flag + '.';
    }
    $('inf-result-why').textContent = cur.challenge.why;
    $('inf-next').textContent = (g.pos + 1 >= g.queue.length) ? 'VER RESULTADO' : 'SIGUIENTE DESAFÍO';
    $('inf-score').textContent = String(g.score);

    $('inf-confirm').hidden = true;
    result.hidden = false;
    playSound(correct ? 'ok' : 'bad');
    scrollIntoViewSoft(result);
  }

  function nextChallenge() {
    const g = state.inf;
    if (!g || !g.current || !g.current.locked) { return; }
    g.pos += 1;
    if (g.pos >= g.queue.length) {
      $('inf-end-score').textContent = 'Acertaste ' + g.score + ' de ' + g.queue.length + '.';
      showScreen('screen-inf-end');
      focusHeading('inf-end-title');
      playSound('win');
    } else {
      prepareChallenge();
    }
  }

  /* ==========================================================
     JUEGO 2 — GEOGRAFÍA EN CADENA
     Hay que unir dos países pasando por países que se toquen entre sí.
     Sin reloj: cada jugador se toma el tiempo que quiera.
     ========================================================== */

  /* ---------- Configuración ---------- */

  function openChainSetup() {
    wipeAllGames();
    const box = $('names-list');
    clear(box);
    for (let i = 1; i <= CHAIN_PLAYERS; i++) {
      const row = makeEl('div', 'name-row');
      const label = makeEl('label', '', 'Jugador ' + i + ':');
      label.setAttribute('for', 'name-' + i);
      const input = makeEl('input');
      input.type = 'text';
      input.id = 'name-' + i;
      input.maxLength = MAX_NAME_LENGTH;
      input.placeholder = 'Nombre';
      input.autocomplete = 'off';
      input.setAttribute('autocorrect', 'off');
      input.setAttribute('autocapitalize', 'words');
      input.setAttribute('spellcheck', 'false');
      row.appendChild(label);
      row.appendChild(input);
      box.appendChild(row);
    }
    showScreen('screen-chain-setup');
    focusHeading('chain-setup-title');
  }

  function onStartSubmit(ev) {
    ev.preventDefault();
    const names = [];
    for (let i = 1; i <= CHAIN_PLAYERS; i++) {
      const v = $('name-' + i).value.trim().slice(0, MAX_NAME_LENGTH);
      names.push(v || ('Jugador ' + i));
    }
    const err = $('names-error');
    if (norm(names[0]) === norm(names[1])) {
      err.textContent = 'Los dos jugadores tienen el mismo nombre. Cambiá uno.';
      err.hidden = false;
      return;
    }
    err.hidden = true;
    startChain(names);
  }

  function startChain(names) {
    state.chain = {
      players: names.map(function (n) { return { name: n, score: 0 }; }),
      queue: LINKS.slice(),   // siempre el mismo orden: desafío 1, 2, ... 10
      pos: 0,
      middle: [],             // países elegidos para el medio de la cadena
      locked: false
    };
    showScreen('screen-chain');
    renderChainAll();
    focusHeading('chain-title');
  }

  /* ---------- Dibujo ---------- */

  function currentLink() {
    const g = state.chain;
    return g ? g.queue[g.pos] : null;
  }

  function currentPlayer() {
    const g = state.chain;
    return g ? g.players[g.pos % g.players.length] : null;
  }

  function renderChainAll() {
    const g = state.chain;
    const link = currentLink();

    $('chain-progress').textContent = 'Desafío ' + (g.pos + 1) + ' de ' + g.queue.length;
    g.players.forEach(function (p, i) {
      const chip = $('score-' + (i + 1));
      clear(chip);
      chip.appendChild(makeEl('span', 'score-name', p.name));
      chip.appendChild(makeEl('span', 'score-num', String(p.score)));
      chip.classList.toggle('is-turn', i === g.pos % g.players.length);
    });

    $('turn-name').textContent = currentPlayer().name;

    const from = byName.get(link.from);
    const to = byName.get(link.to);
    $('link-from-flag').textContent = from.flag;
    $('link-from').textContent = from.name;
    $('link-to-flag').textContent = to.flag;
    $('link-to').textContent = to.name;

    $('chain-result').hidden = true;
    renderBuild();
    renderChainOptions();
    try { window.scrollTo(0, 0); } catch (e) { /* nada */ }
  }

  function renderBuild() {
    const g = state.chain;
    const link = currentLink();
    const box = $('chain-build');
    clear(box);

    const step = function (node, first) {
      if (first) { box.appendChild(node); return; }
      const wrap = makeEl('span', 'build-step');
      wrap.appendChild(icon('arrow', 'build-arrow'));
      wrap.appendChild(node);
      box.appendChild(wrap);
    };

    const fixed = function (c) {
      const el = makeEl('span', 'piece piece--fixed');
      countryLabel(el, c, 'piece-flag', 'piece-name');
      return el;
    };

    step(fixed(byName.get(link.from)), true);
    g.middle.forEach(function (name, i) {
      const c = byName.get(name);
      if (g.locked) {
        const el = makeEl('span', 'piece');
        countryLabel(el, c, 'piece-flag', 'piece-name');
        step(el);
      } else {
        const b = makeEl('button', 'piece piece--pick');
        b.type = 'button';
        b.setAttribute('aria-label', 'Sacar ' + c.name + ' de la cadena');
        countryLabel(b, c, 'piece-flag', 'piece-name');
        b.appendChild(icon('x', 'piece-x'));
        b.addEventListener('click', function () { removeFromChain(i); });
        step(b);
      }
    });
    if (!g.locked && g.middle.length < MAX_MIDDLE) {
      const slot = makeEl('span', 'piece piece--slot');
      slot.appendChild(icon('plus'));
      step(slot);
    }
    step(fixed(byName.get(link.to)));

    const quedan = MAX_MIDDLE - g.middle.length;
    if (g.locked) {
      $('chain-hint').textContent = '';
    } else if (g.middle.length === 0) {
      $('chain-hint').textContent = 'Elegí abajo los países del medio. Podés poner hasta ' + MAX_MIDDLE + '.';
    } else if (quedan > 0) {
      $('chain-hint').textContent = 'Podés agregar ' + quedan + ' más. Tocá un país de tu cadena para sacarlo.';
    } else {
      $('chain-hint').textContent = 'Llegaste al máximo de ' + MAX_MIDDLE + '. Tocá un país de tu cadena para sacarlo.';
    }
  }

  function renderChainOptions() {
    const g = state.chain;
    const link = currentLink();
    const box = $('chain-options');
    clear(box);
    link.options.forEach(function (name) {
      const c = byName.get(name);
      const b = makeEl('button', 'pick');
      b.type = 'button';
      const used = g.middle.indexOf(name) !== -1;
      b.disabled = g.locked || used || g.middle.length >= MAX_MIDDLE;
      if (used) { b.classList.add('is-used'); }
      countryLabel(b, c, 'pick-flag', 'pick-name');
      b.addEventListener('click', function () { addToChain(name); });
      box.appendChild(b);
    });
    $('chain-confirm-btn').disabled = g.locked;
  }

  /* ---------- Jugar ---------- */

  function addToChain(name) {
    const g = state.chain;
    if (!g || g.locked) { return; }
    if (g.middle.length >= MAX_MIDDLE) { return; }
    if (g.middle.indexOf(name) !== -1) { return; }
    g.middle.push(name);
    playSound('tap');
    renderBuild();
    renderChainOptions();
  }

  function removeFromChain(i) {
    const g = state.chain;
    if (!g || g.locked) { return; }
    g.middle.splice(i, 1);
    renderBuild();
    renderChainOptions();
  }

  // Revisa la cadena completa y devuelve por qué falla, si falla
  function checkChain(full) {
    if (full.length > MAX_CHAIN) {
      return { ok: false, why: 'La cadena no puede tener más de ' + MAX_CHAIN + ' países.' };
    }
    for (let i = 0; i < full.length - 1; i++) {
      if (!limita(full[i], full[i + 1])) {
        return { ok: false, why: full[i] + ' no limita con ' + full[i + 1] + '.' };
      }
    }
    return { ok: true, why: '' };
  }

  function chainText(names) {
    return names.join(' → ');
  }

  function confirmChain() {
    const g = state.chain;
    if (!g || g.locked) { return; }
    const link = currentLink();
    const full = [link.from].concat(g.middle, [link.to]);
    const res = checkChain(full);
    g.locked = true;
    if (res.ok) { currentPlayer().score += 1; }

    const result = $('chain-result');
    result.classList.toggle('result--ok', res.ok);
    result.classList.toggle('result--bad', !res.ok);
    $('chain-result-use').setAttribute('href', res.ok ? '#i-check' : '#i-x');
    $('chain-result-title-text').textContent = res.ok ? '¡CORRECTO!' : 'INCORRECTO';
    $('chain-result-chain').textContent = chainText(full) + '  (' + pluralPaises(full.length) + ')';

    const why = $('chain-result-why');
    const sol = $('chain-result-solution');
    if (res.ok) {
      why.hidden = true;
      why.textContent = '';
      sol.hidden = true;
    } else {
      why.hidden = false;
      why.textContent = res.why;
      sol.hidden = false;
      $('chain-result-solution-text').textContent = chainText(link.solution);
    }
    $('chain-next').textContent = (g.pos + 1 >= g.queue.length) ? 'VER RESULTADO' : 'SIGUIENTE DESAFÍO';

    renderBuild();
    renderChainOptions();
    renderScores();
    result.hidden = false;
    playSound(res.ok ? 'ok' : 'bad');
    scrollIntoViewSoft(result);
  }

  function renderScores() {
    const g = state.chain;
    g.players.forEach(function (p, i) {
      const chip = $('score-' + (i + 1));
      clear(chip);
      chip.appendChild(makeEl('span', 'score-name', p.name));
      chip.appendChild(makeEl('span', 'score-num', String(p.score)));
    });
  }

  function nextLink() {
    const g = state.chain;
    if (!g || !g.locked) { return; }
    g.pos += 1;
    g.middle = [];
    g.locked = false;
    if (g.pos >= g.queue.length) {
      finishChain();
    } else {
      renderChainAll();
    }
  }

  function finishChain() {
    const g = state.chain;
    const a = g.players[0];
    const b = g.players[1];
    const tie = a.score === b.score;
    const winner = a.score > b.score ? a : b;

    $('winner-title').textContent = tie ? '¡EMPATE!' : '¡TENEMOS GANADOR!';
    $('winner-name').textContent = tie ? '' : winner.name;
    $('winner-row').hidden = tie;
    $('winner-scores').textContent = a.name + ' ' + a.score + '  —  ' + b.name + ' ' + b.score;
    $('winner-sub').textContent = tie
      ? 'Los dos resolvieron la misma cantidad.'
      : '¡Ganaste Geografía en Cadena!';
    showScreen('screen-chain-end');
    focusHeading('winner-title');
    playSound('win');
  }

  /* ==========================================================
     ARRANQUE
     ========================================================== */
  function init() {
    renderSoundButton();

    $('go-inf').addEventListener('click', startInfiltrado);
    $('go-chain').addEventListener('click', openChainSetup);
    $('go-rules').addEventListener('click', function () {
      showScreen('screen-rules');
      focusHeading('rules-title');
    });
    $('rules-back').addEventListener('click', goHome);
    $('btn-home').addEventListener('click', goHome);

    $('inf-confirm-btn').addEventListener('click', confirmAnswer);
    $('inf-next').addEventListener('click', nextChallenge);
    $('inf-again').addEventListener('click', startInfiltrado);
    $('inf-end-home').addEventListener('click', goHome);

    $('names-form').addEventListener('submit', onStartSubmit);
    $('chain-confirm-btn').addEventListener('click', confirmChain);
    $('chain-next').addEventListener('click', nextLink);
    $('chain-again').addEventListener('click', openChainSetup);
    $('chain-end-home').addEventListener('click', goHome);

    $('btn-sound').addEventListener('click', function () {
      state.soundOn = !state.soundOn;
      renderSoundButton();
      if (state.soundOn) { playSound('ok'); }
    });

    // el navegador necesita un toque del usuario para dejar sonar
    document.addEventListener('click', function () { getAudio(); }, true);

    // si el navegador restaura la pestaña desde su memoria, volvemos a la portada
    window.addEventListener('pageshow', function (ev) {
      if (ev && ev.persisted) { goHome(); }
    });

    showScreen('screen-home');
  }

  init();
})();
