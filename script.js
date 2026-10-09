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
  const TURN_MS = 5000;              // tiempo por turno en Geografía en Cadena
  const PAUSE_OK_MS = 1500;          // cartel de "¡CORRECTO!" entre turnos
  const PAUSE_OUT_MS = 2600;         // cartel de eliminación entre turnos
  const ELIMINATE_ON_INVALID = true; // true: un país inválido, repetido o con otra letra elimina.
                                     // false: solo muestra el error y deja seguir hasta que se acabe el tiempo.
  const MIN_PLAYERS = 2;
  const MAX_PLAYERS = 8;
  const MAX_NAME_LENGTH = 14;

  /* ==========================================================
     DATOS: PAÍSES (193 de la ONU + Palestina + Vaticano)
     [nombre, código ISO para la bandera, [otros nombres válidos]]
     ========================================================== */
  const COUNTRY_DATA = [
    // Europa
    ['Albania', 'AL'], ['Alemania', 'DE'], ['Andorra', 'AD'], ['Austria', 'AT'], ['Bélgica', 'BE'],
    ['Bielorrusia', 'BY', ['Belarús']], ['Bosnia y Herzegovina', 'BA', ['Bosnia']], ['Bulgaria', 'BG'],
    ['Croacia', 'HR'], ['Chipre', 'CY'], ['Chequia', 'CZ', ['República Checa']], ['Dinamarca', 'DK'],
    ['Eslovaquia', 'SK'], ['Eslovenia', 'SI'], ['España', 'ES'], ['Estonia', 'EE'], ['Finlandia', 'FI'],
    ['Francia', 'FR'], ['Grecia', 'GR'], ['Hungría', 'HU'], ['Irlanda', 'IE'], ['Islandia', 'IS'],
    ['Italia', 'IT'], ['Letonia', 'LV'], ['Liechtenstein', 'LI'], ['Lituania', 'LT'], ['Luxemburgo', 'LU'],
    ['Macedonia del Norte', 'MK', ['Macedonia']], ['Malta', 'MT'], ['Moldavia', 'MD', ['Moldova']],
    ['Mónaco', 'MC'], ['Montenegro', 'ME'], ['Noruega', 'NO'], ['Países Bajos', 'NL', ['Holanda']],
    ['Polonia', 'PL'], ['Portugal', 'PT'], ['Reino Unido', 'GB'], ['Rumania', 'RO'], ['Rusia', 'RU'],
    ['San Marino', 'SM'], ['Serbia', 'RS'], ['Suecia', 'SE'], ['Suiza', 'CH'], ['Ucrania', 'UA'],
    ['Vaticano', 'VA', ['Ciudad del Vaticano']],

    // África
    ['Argelia', 'DZ'], ['Angola', 'AO'], ['Benín', 'BJ'], ['Botsuana', 'BW', ['Botswana']],
    ['Burkina Faso', 'BF'], ['Burundi', 'BI'], ['Cabo Verde', 'CV'], ['Camerún', 'CM'], ['Chad', 'TD'],
    ['Comoras', 'KM'], ['República del Congo', 'CG', ['Congo']], ['República Democrática del Congo', 'CD'],
    ['Costa de Marfil', 'CI'], ['Egipto', 'EG'], ['Eritrea', 'ER'], ['Esuatini', 'SZ', ['Suazilandia']],
    ['Etiopía', 'ET'], ['Gabón', 'GA'], ['Gambia', 'GM'], ['Ghana', 'GH'], ['Guinea', 'GN'],
    ['Guinea-Bisáu', 'GW', ['Guinea-Bissau']], ['Guinea Ecuatorial', 'GQ'], ['Kenia', 'KE', ['Kenya']],
    ['Lesoto', 'LS', ['Lesotho']], ['Liberia', 'LR'], ['Libia', 'LY'], ['Madagascar', 'MG'],
    ['Malaui', 'MW', ['Malawi']], ['Malí', 'ML'], ['Marruecos', 'MA'], ['Mauricio', 'MU', ['Mauritius']],
    ['Mauritania', 'MR'], ['Mozambique', 'MZ'], ['Namibia', 'NA'], ['Níger', 'NE'], ['Nigeria', 'NG'],
    ['República Centroafricana', 'CF'], ['Ruanda', 'RW', ['Rwanda']], ['Santo Tomé y Príncipe', 'ST'],
    ['Senegal', 'SN'], ['Seychelles', 'SC'], ['Sierra Leona', 'SL'], ['Somalia', 'SO'], ['Sudáfrica', 'ZA'],
    ['Sudán', 'SD'], ['Sudán del Sur', 'SS'], ['Tanzania', 'TZ'], ['Togo', 'TG'], ['Túnez', 'TN'],
    ['Uganda', 'UG'], ['Yibuti', 'DJ', ['Djibouti']], ['Zambia', 'ZM'], ['Zimbabue', 'ZW', ['Zimbabwe']],

    // Asia
    ['Afganistán', 'AF'], ['Arabia Saudita', 'SA', ['Arabia Saudí']], ['Armenia', 'AM'],
    ['Azerbaiyán', 'AZ', ['Azerbaiján']], ['Baréin', 'BH', ['Bahréin']], ['Bangladés', 'BD', ['Bangladesh']],
    ['Bután', 'BT'], ['Birmania', 'MM', ['Myanmar']], ['Brunéi', 'BN'], ['Camboya', 'KH'],
    ['Catar', 'QA', ['Qatar']], ['China', 'CN'], ['Corea del Norte', 'KP'], ['Corea del Sur', 'KR'],
    ['Emiratos Árabes Unidos', 'AE'], ['Filipinas', 'PH'], ['Georgia', 'GE'], ['India', 'IN'],
    ['Indonesia', 'ID'], ['Irak', 'IQ'], ['Irán', 'IR'], ['Israel', 'IL'], ['Japón', 'JP'],
    ['Jordania', 'JO'], ['Kazajistán', 'KZ', ['Kazajstán']], ['Kirguistán', 'KG', ['Kirguizistán']],
    ['Kuwait', 'KW'], ['Laos', 'LA'], ['Líbano', 'LB'], ['Malasia', 'MY'], ['Maldivas', 'MV'],
    ['Mongolia', 'MN'], ['Nepal', 'NP'], ['Omán', 'OM'], ['Pakistán', 'PK'], ['Palestina', 'PS'],
    ['Singapur', 'SG'], ['Siria', 'SY'], ['Sri Lanka', 'LK'], ['Tailandia', 'TH'], ['Tayikistán', 'TJ'],
    ['Timor Oriental', 'TL', ['Timor-Leste']], ['Turkmenistán', 'TM'], ['Turquía', 'TR'],
    ['Uzbekistán', 'UZ'], ['Vietnam', 'VN'], ['Yemen', 'YE'],

    // América
    ['Antigua y Barbuda', 'AG'], ['Argentina', 'AR'], ['Bahamas', 'BS'], ['Barbados', 'BB'],
    ['Belice', 'BZ'], ['Bolivia', 'BO'], ['Brasil', 'BR'], ['Canadá', 'CA'], ['Chile', 'CL'],
    ['Colombia', 'CO'], ['Costa Rica', 'CR'], ['Cuba', 'CU'], ['Dominica', 'DM'], ['Ecuador', 'EC'],
    ['El Salvador', 'SV'], ['Estados Unidos', 'US'], ['Granada', 'GD'], ['Guatemala', 'GT'],
    ['Guyana', 'GY'], ['Haití', 'HT'], ['Honduras', 'HN'], ['Jamaica', 'JM'], ['México', 'MX', ['Méjico']],
    ['Nicaragua', 'NI'], ['Panamá', 'PA'], ['Paraguay', 'PY'], ['Perú', 'PE'], ['República Dominicana', 'DO'],
    ['San Cristóbal y Nieves', 'KN'], ['San Vicente y las Granadinas', 'VC'], ['Santa Lucía', 'LC'],
    ['Surinam', 'SR', ['Suriname']], ['Trinidad y Tobago', 'TT'], ['Uruguay', 'UY'], ['Venezuela', 'VE'],

    // Oceanía
    ['Australia', 'AU'], ['Fiyi', 'FJ', ['Fiji']], ['Islas Marshall', 'MH'], ['Islas Salomón', 'SB'],
    ['Kiribati', 'KI'], ['Micronesia', 'FM'], ['Nauru', 'NR'], ['Nueva Zelanda', 'NZ'],
    ['Palaos', 'PW', ['Palau']], ['Papúa Nueva Guinea', 'PG'], ['Samoa', 'WS'], ['Tonga', 'TO'],
    ['Tuvalu', 'TV'], ['Vanuatu', 'VU']
  ];

  /* ==========================================================
     DATOS: DESAFÍOS DE PAÍS INFILTRADO
     Son exactamente los 10 ejemplos del PDF "pais_infiltrado_10_ejemplos".
     others: los 4 países que comparten algo / intruder: el que no encaja
     why: la explicación del PDF, que se muestra después de confirmar
     ========================================================== */
  const CHALLENGES = [
    { category: 'Países de América del Sur',
      others: ['Argentina', 'Brasil', 'Chile', 'Perú'], intruder: 'Francia',
      why: 'Los otros 4 países están en América del Sur.' },
    { category: 'Idioma oficial: español',
      others: ['España', 'México', 'Argentina', 'Colombia'], intruder: 'Japón',
      why: 'Los otros 4 tienen el español como idioma oficial.' },
    { category: 'Países de Europa',
      others: ['Italia', 'Francia', 'Alemania', 'España'], intruder: 'China',
      why: 'Los otros 4 están en Europa.' },
    { category: 'Países de América del Norte o el Caribe',
      others: ['Canadá', 'Estados Unidos', 'México', 'Cuba'], intruder: 'Egipto',
      why: 'Los otros 4 están en América del Norte o el Caribe.' },
    { category: 'Países de Asia',
      others: ['Japón', 'China', 'Corea del Sur', 'Tailandia'], intruder: 'Portugal',
      why: 'Los otros 4 están en Asia.' },
    // El PDF dice "Los otros 4 limitan con Argentina", pero Argentina es uno de esos 4 y no limita
    // consigo misma. La respuesta (Australia) es la misma; se corrigió solo la explicación.
    { category: 'Países de América del Sur',
      others: ['Argentina', 'Brasil', 'Uruguay', 'Paraguay'], intruder: 'Australia',
      why: 'Los otros 4 están en América del Sur.' },
    { category: 'Países de Europa',
      others: ['España', 'Portugal', 'Francia', 'Italia'], intruder: 'Brasil',
      why: 'Los otros 4 están en Europa.' },
    { category: 'Países de África',
      others: ['Egipto', 'Marruecos', 'Argelia', 'Túnez'], intruder: 'Noruega',
      why: 'Los otros 4 están en África.' },
    { category: 'Países de América del Norte o el Caribe',
      others: ['Estados Unidos', 'Canadá', 'México', 'Cuba'], intruder: 'Brasil',
      why: 'Los otros 4 están en América del Norte o el Caribe.' },
    { category: 'Países de Oceanía',
      others: ['Australia', 'Nueva Zelanda', 'Fiyi', 'Papúa Nueva Guinea'], intruder: 'Alemania',
      why: 'Los otros 4 son países de Oceanía.' }
  ];

  /* ==========================================================
     UTILIDADES DE TEXTO
     ========================================================== */

  // minúsculas, sin tildes, sin signos, espacios normalizados
  function norm(text) {
    return String(text)
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  function lettersOnly(text) {
    return norm(text).replace(/[^a-z]/g, '');
  }

  function firstLetter(name) {
    return lettersOnly(name).charAt(0).toUpperCase();
  }

  function lastLetter(name) {
    const s = lettersOnly(name);
    return s.charAt(s.length - 1).toUpperCase();
  }

  function flagEmoji(iso) {
    return String.fromCodePoint.apply(null, iso.split('').map(function (ch) {
      return 0x1F1E6 + ch.charCodeAt(0) - 65;
    }));
  }

  function randomInt(n) {
    if (window.crypto && typeof window.crypto.getRandomValues === 'function') {
      const a = new Uint32Array(1);
      window.crypto.getRandomValues(a);
      return a[0] % n;
    }
    return Math.floor(Math.random() * n);
  }

  function shuffle(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = randomInt(i + 1);
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function now() {
    return (window.performance && typeof window.performance.now === 'function')
      ? window.performance.now()
      : Date.now();
  }

  function pluralPaises(n) {
    return n + (n === 1 ? ' país' : ' países');
  }

  /* ---------- Países: índices de búsqueda ---------- */

  const countries = COUNTRY_DATA.map(function (row, id) {
    const names = [row[0]].concat(row[2] || []);
    return {
      id: id,
      name: row[0],
      iso: row[1],
      flag: flagEmoji(row[1]),
      names: names,
      starts: new Set(names.map(firstLetter))
    };
  });

  const byNorm = new Map();   // nombre normalizado -> { country, name }
  const byName = new Map();   // nombre exacto -> country
  countries.forEach(function (c) {
    byName.set(c.name, c);
    c.names.forEach(function (n) { byNorm.set(norm(n), { country: c, name: n }); });
  });

  function findCountry(text) {
    return byNorm.get(norm(text)) || null;
  }

  function hasAvailable(letter, used) {
    return countries.some(function (c) { return !used.has(c.id) && c.starts.has(letter); });
  }

  /* ==========================================================
     ESTADO (solo en memoria de esta pestaña)
     ========================================================== */
  const state = {
    inf: null,     // partida de País Infiltrado
    chain: null,   // partida de Geografía en Cadena
    setupCount: 0, // cantidad elegida en la pantalla de configuración
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
      try { node.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) { /* nada */ }
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
      if (kind === 'ok') {
        tone(ctx, 660, t, 0.14, 'triangle', 0.22);
        tone(ctx, 880, t + 0.12, 0.2, 'triangle', 0.22);
      } else if (kind === 'bad') {
        tone(ctx, 240, t, 0.18, 'sawtooth', 0.14);
        tone(ctx, 170, t + 0.16, 0.3, 'sawtooth', 0.14);
      } else if (kind === 'timeout') {
        tone(ctx, 440, t, 0.18, 'square', 0.12);
        tone(ctx, 330, t + 0.2, 0.18, 'square', 0.12);
        tone(ctx, 220, t + 0.4, 0.4, 'square', 0.12);
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
  function stopChainTimers(g) {
    if (!g) { return; }
    g.token += 1; // invalida cualquier callback pendiente
    if (g.timeoutId !== null) { clearTimeout(g.timeoutId); g.timeoutId = null; }
    if (g.tickId !== null) { clearInterval(g.tickId); g.tickId = null; }
    if (g.pauseId !== null) { clearTimeout(g.pauseId); g.pauseId = null; }
  }

  function wipeAllGames() {
    stopChainTimers(state.chain);
    state.chain = null;
    state.inf = null;
    state.setupCount = 0;

    // vaciar todo lo que se haya dibujado
    clear($('inf-options'));
    clear($('players-list'));
    clear($('chain-list'));
    clear($('names-list'));
    $('inf-confirm').hidden = true;
    $('inf-result').hidden = true;
    $('feedback').hidden = true;
    $('answer-input').value = '';
    $('hint').hidden = true;
    $('names-error').hidden = true;
    $('names-form').hidden = true;
    $('winner-name').textContent = '';
    $('winner-chain').textContent = '';
    Array.prototype.forEach.call(document.querySelectorAll('.count-btn'), function (b) {
      b.setAttribute('aria-pressed', 'false');
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
      queue: shuffle(CHALLENGES),   // orden aleatorio, cada desafío una sola vez
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
    const options = shuffle(ch.others.map(function (n) { return byName.get(n); }).concat([intruder]));
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
      const flag = makeEl('span', 'opt-flag', c.flag);
      flag.setAttribute('aria-hidden', 'true');
      b.appendChild(flag);
      b.appendChild(makeEl('span', 'opt-name', c.name));
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
    $('inf-result-answer').textContent = 'El país infiltrado era ' + cur.intruder.name + '\u00a0' + cur.intruder.flag;
    const pick = $('inf-result-pick');
    if (correct) {
      pick.hidden = true;
      pick.textContent = '';
    } else {
      pick.hidden = false;
      pick.textContent = 'Elegiste ' + chosen.name + '\u00a0' + chosen.flag + '.';
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
     ========================================================== */

  /* ---------- Configuración ---------- */

  function openChainSetup() {
    wipeAllGames();
    showScreen('screen-chain-setup');
    focusHeading('chain-setup-title');
  }

  function selectCount(n) {
    state.setupCount = n;
    Array.prototype.forEach.call(document.querySelectorAll('.count-btn'), function (b) {
      b.setAttribute('aria-pressed', Number(b.getAttribute('data-count')) === n ? 'true' : 'false');
    });

    const list = $('names-list');
    const previous = Array.prototype.map.call(list.querySelectorAll('input'), function (i) { return i.value; });
    clear(list);
    for (let k = 1; k <= n; k++) {
      const row = makeEl('div', 'name-row');
      const label = makeEl('label', '', 'Jugador ' + k + ':');
      const input = makeEl('input');
      input.type = 'text';
      input.id = 'name-' + k;
      input.maxLength = MAX_NAME_LENGTH;
      input.placeholder = 'Nombre';
      input.autocomplete = 'off';
      input.setAttribute('autocapitalize', 'words');
      input.setAttribute('autocorrect', 'off');
      input.spellcheck = false;
      input.setAttribute('enterkeyhint', k === n ? 'done' : 'next');
      input.value = previous[k - 1] || '';
      label.setAttribute('for', input.id);
      row.appendChild(label);
      row.appendChild(input);
      list.appendChild(row);
    }
    $('names-error').hidden = true;
    $('names-form').hidden = false;
    scrollIntoViewSoft($('names-form'));
  }

  function collectNames() {
    return Array.prototype.map.call($('names-list').querySelectorAll('input'), function (input, i) {
      const clean = input.value.replace(/\s+/g, ' ').trim();
      return clean || ('Jugador ' + (i + 1));
    });
  }

  function onStartSubmit(e) {
    e.preventDefault();
    const n = state.setupCount;
    if (n < MIN_PLAYERS || n > MAX_PLAYERS) { return; }
    const names = collectNames();
    const seen = new Set();
    for (let i = 0; i < names.length; i++) {
      const key = norm(names[i]) || names[i].toLowerCase();
      if (seen.has(key)) {
        const err = $('names-error');
        err.textContent = 'Hay nombres repetidos. Cambiá alguno para continuar.';
        err.hidden = false;
        return;
      }
      seen.add(key);
    }
    startChainGame(names);
  }

  /* ---------- Partida ---------- */

  function startChainGame(names) {
    stopChainTimers(state.chain);
    state.chain = {
      players: names.map(function (n) { return { name: n, alive: true }; }),
      turn: 0,
      chain: [],            // [{ name, flag }]
      used: new Set(),      // ids de países ya dichos
      letter: null,         // letra pedida (null = cualquier país)
      freeReason: null,     // 'first' | 'exhausted'
      exhaustedLetter: null,
      phase: 'turn',        // 'turn' | 'between' | 'over'
      deadline: 0,
      token: 0,
      timeoutId: null,
      tickId: null,
      pauseId: null
    };
    $('timer-ring').style.setProperty('--turn', TURN_MS + 'ms');
    showScreen('screen-chain');
    beginTurn();
  }

  function nextAlive(g, from) {
    const n = g.players.length;
    for (let i = 1; i <= n; i++) {
      const idx = (from + i) % n;
      if (g.players[idx].alive) { return idx; }
    }
    return from;
  }

  function aliveCount(g) {
    return g.players.filter(function (p) { return p.alive; }).length;
  }

  function computeLetter(g) {
    g.exhaustedLetter = null;
    if (g.chain.length === 0) {
      g.freeReason = 'first';
      return null;
    }
    const letter = lastLetter(g.chain[g.chain.length - 1].name);
    if (hasAvailable(letter, g.used)) {
      g.freeReason = null;
      return letter;
    }
    // ya no queda ningún país con esa letra: el turno es libre
    g.freeReason = 'exhausted';
    g.exhaustedLetter = letter;
    return null;
  }

  function renderPlayers(g) {
    const ul = $('players-list');
    clear(ul);
    g.players.forEach(function (p, i) {
      const li = makeEl('li', p.alive ? '' : 'is-out');
      li.appendChild(icon(p.alive ? 'alive' : 'out', 'p-status'));
      li.appendChild(makeEl('span', 'p-name', p.name));
      if (!p.alive) {
        li.appendChild(document.createTextNode(' — Eliminado'));
      } else if (g.phase === 'turn' && i === g.turn) {
        li.classList.add('is-turn');
        li.setAttribute('aria-current', 'true');
        li.appendChild(makeEl('span', 'p-turn', 'Turno'));
      }
      ul.appendChild(li);
    });
  }

  function renderChain(g) {
    const box = $('chain-list');
    clear(box);
    $('chain-count').textContent = pluralPaises(g.chain.length);
    if (g.chain.length === 0) {
      box.appendChild(makeEl('span', 'chain-empty', 'Todavía no hay países. ¡Que arranque la cadena!'));
      return;
    }
    g.chain.forEach(function (item, i) {
      if (i > 0) {
        box.appendChild(document.createTextNode(' '));
        box.appendChild(icon('arrow', 'chain-arrow'));
        box.appendChild(document.createTextNode(' '));
      }
      box.appendChild(makeEl('span', 'chain-item' + (i === g.chain.length - 1 ? ' is-last' : ''),
        item.flag + ' ' + item.name));
    });
    box.scrollTop = box.scrollHeight;
  }

  function renderTurn(g) {
    $('turn-name').textContent = g.players[g.turn].name;
    const letterEl = $('turn-letter');
    const prompt = $('turn-prompt');
    if (g.letter) {
      prompt.textContent = 'Decí un país que empiece con:';
      letterEl.textContent = g.letter;
      letterEl.classList.remove('is-free');
    } else {
      prompt.textContent = g.freeReason === 'exhausted'
        ? 'Ya no quedan países con la ' + g.exhaustedLetter + '. ¡Decí cualquier país!'
        : 'Decí cualquier país para empezar la cadena:';
      letterEl.textContent = '?';
      letterEl.classList.add('is-free');
    }
    renderPlayers(g);
    renderChain(g);
  }

  function showHint(msg) {
    const h = $('hint');
    h.textContent = msg;
    h.hidden = false;
  }

  function hideHint() {
    const h = $('hint');
    h.hidden = true;
    h.textContent = '';
  }

  function restartRing() {
    const ring = $('timer-ring');
    ring.classList.remove('idle', 'danger', 'run');
    void ring.getBoundingClientRect();
    ring.classList.add('run');
  }

  function updateTimer(g) {
    if (g.phase !== 'turn') { return; }
    const remaining = Math.max(0, g.deadline - now());
    const secs = Math.ceil(remaining / 1000);
    const num = $('timer-num');
    const text = String(secs);
    if (num.textContent !== text) { num.textContent = text; }
    $('timer-ring').classList.toggle('danger', remaining <= 2000);
  }

  function beginTurn() {
    const g = state.chain;
    if (!g) { return; }
    stopChainTimers(g);
    g.phase = 'turn';
    g.letter = computeLetter(g);

    $('feedback').hidden = true;
    hideHint();
    const input = $('answer-input');
    input.value = '';
    renderTurn(g);

    g.deadline = now() + TURN_MS;
    $('timer-num').textContent = String(Math.ceil(TURN_MS / 1000));
    restartRing();

    const token = g.token;
    g.timeoutId = setTimeout(function () {
      if (state.chain === g && g.token === token && g.phase === 'turn') { onTimeout(g); }
    }, TURN_MS);
    g.tickId = setInterval(function () {
      if (state.chain === g && g.token === token) { updateTimer(g); }
    }, 100);

    // El campo queda siempre enfocado: así el teclado del celular no se cierra entre turnos.
    input.focus();
  }

  // detail puede ser texto o un nodo (por ejemplo, ícono + texto)
  function showFeedback(bad, iconName, title, detail) {
    const fb = $('feedback');
    fb.classList.toggle('is-bad', bad);
    $('fb-icon-use').setAttribute('href', '#i-' + iconName);
    $('fb-title').textContent = title;
    const d = $('fb-detail');
    clear(d);
    if (typeof detail === 'string') { d.textContent = detail; } else { d.appendChild(detail); }
    fb.hidden = false;
  }

  function endTurnTimers(g) {
    // frena el reloj del turno pero deja vivo el estado de la partida
    if (g.timeoutId !== null) { clearTimeout(g.timeoutId); g.timeoutId = null; }
    if (g.tickId !== null) { clearInterval(g.tickId); g.tickId = null; }
    g.token += 1;
    const ring = $('timer-ring');
    ring.classList.remove('run', 'danger');
    ring.classList.add('idle');
  }

  function schedule(g, ms, fn) {
    const token = g.token;
    g.pauseId = setTimeout(function () {
      g.pauseId = null;
      if (state.chain === g && g.token === token) { fn(); }
    }, ms);
  }

  function onTimeout(g) {
    eliminateCurrent(g, 'timeout', '');
  }

  function eliminateCurrent(g, kind, message) {
    endTurnTimers(g);
    g.phase = 'between';
    const player = g.players[g.turn];
    player.alive = false;
    playSound(kind === 'timeout' ? 'timeout' : 'bad');

    if (kind === 'timeout') {
      showFeedback(true, 'clock', '¡TIEMPO!', iconText('x', 'Jugador eliminado: ' + player.name));
    } else {
      showFeedback(true, 'x', message, iconText('x', 'Jugador eliminado: ' + player.name));
    }
    renderPlayers(g);

    if (aliveCount(g) <= 1) {
      g.phase = 'over';
      schedule(g, PAUSE_OUT_MS, function () { showWinner(g); });
    } else {
      g.turn = nextAlive(g, g.turn);
      schedule(g, PAUSE_OUT_MS, beginTurn);
    }
  }

  function acceptAnswer(g, hit) {
    endTurnTimers(g);
    g.phase = 'between';
    g.chain.push({ name: hit.name, flag: hit.country.flag });
    g.used.add(hit.country.id);
    playSound('ok');

    const previous = g.turn;
    g.turn = nextAlive(g, previous);
    const nextName = g.players[g.turn].name;
    showFeedback(false, 'check', '¡CORRECTO!', hit.country.flag + ' ' + hit.name + '\nSigue: ' + nextName);
    renderPlayers(g);
    renderChain(g);
    schedule(g, PAUSE_OK_MS, beginTurn);
  }

  function validateAnswer(g, raw) {
    const hit = findCountry(raw);
    if (!hit) { return { ok: false, message: 'Ese lugar no es un país.' }; }
    if (g.letter && firstLetter(hit.name) !== g.letter) {
      return { ok: false, message: 'La respuesta debe comenzar con ' + g.letter + '.' };
    }
    if (g.used.has(hit.country.id)) { return { ok: false, message: 'Ese país ya fue utilizado.' }; }
    return { ok: true, hit: hit };
  }

  function onAnswerSubmit(e) {
    e.preventDefault();
    const g = state.chain;
    if (!g || g.phase !== 'turn') { return; }

    // Pasados los 5 segundos ya no se acepta nada, aunque el reloj aún no haya saltado.
    if (now() >= g.deadline) {
      onTimeout(g);
      return;
    }

    const input = $('answer-input');
    const raw = input.value;
    if (!raw.trim()) {
      showHint('Escribí un país antes de confirmar.');
      input.focus();
      return;
    }

    const res = validateAnswer(g, raw);
    if (res.ok) {
      hideHint();
      acceptAnswer(g, res.hit);
    } else if (ELIMINATE_ON_INVALID) {
      eliminateCurrent(g, 'invalid', res.message);
    } else {
      showHint(res.message);
      playSound('bad');
      input.select();
    }
  }

  function showWinner(g) {
    const winner = g.players.filter(function (p) { return p.alive; })[0] || g.players[g.turn];
    stopChainTimers(g);
    $('winner-name').textContent = winner.name;
    $('winner-chain').textContent = 'Cadena final: ' + pluralPaises(g.chain.length) + '.';
    $('feedback').hidden = true;
    $('answer-input').blur();
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

    Array.prototype.forEach.call(document.querySelectorAll('.count-btn'), function (b) {
      b.addEventListener('click', function () { selectCount(Number(b.getAttribute('data-count'))); });
    });
    $('names-form').addEventListener('submit', onStartSubmit);
    $('answer-form').addEventListener('submit', onAnswerSubmit);
    $('chain-again').addEventListener('click', openChainSetup);
    $('chain-end-home').addEventListener('click', goHome);

    $('btn-sound').addEventListener('click', function () {
      state.soundOn = !state.soundOn;
      renderSoundButton();
      if (state.soundOn) { playSound('ok'); }
    });

    // Los navegadores de celular exigen un toque del usuario para activar el audio.
    document.addEventListener('click', function () { getAudio(); }, true);

    // Si el navegador restaura la página desde su memoria (botón "atrás"), se vuelve a empezar de cero.
    window.addEventListener('pageshow', function (ev) {
      if (ev.persisted) { goHome(); }
    });

    showScreen('screen-home');
  }

  init();
})();
