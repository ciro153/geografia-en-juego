# Geografía en Juego

Dos juegos de geografía para celular, en una página estática (HTML + CSS + JavaScript puros).
Cuesta **$0**, no usa servidor, base de datos, cuentas ni almacenamiento, y **cada persona que entra juega su propia partida**.

- **País Infiltrado**: 1 jugador, 10 desafíos. Son los 10 ejemplos del PDF con sus respuestas: cuatro países tienen algo en común y uno es el infiltrado.
- **Geografía en Cadena**: 2 jugadores por turnos, 10 desafíos. Hay que unir dos países pasando por países que compartan frontera, sin pasar de 5 países. **No hay reloj.**

Los dos juegos tienen **siempre los mismos 10 desafíos, en el mismo orden**. No hay nada al azar: todos los celulares ven exactamente lo mismo.

Diseño: colores **azules y beige**, íconos propios en SVG (nada de emojis) y banderas de cada país como único elemento "emoji".

## Archivos

```text
geografia-en-juego/
├── index.html        la página
├── style.css         el diseño (los colores azul y beige están al principio, en :root)
├── script.js         los dos juegos, los países, las fronteras y los desafíos
├── assets/
│   └── favicon.svg   ícono de la pestaña
├── DESAFIOS.md       los 10 desafíos de cada juego, con sus respuestas
├── README.md         este archivo
└── .nojekyll         (opcional) le dice a GitHub Pages que no procese los archivos
```

Para probarla en tu computadora sin publicar nada: descomprimí la carpeta y abrí `index.html` con doble clic.

---

## 1. Publicarla gratis en GitHub Pages

1. **Descomprimí el zip.** GitHub no descomprime archivos: hay que subir los archivos sueltos.
2. Entrá a <https://github.com> y creá una cuenta gratuita (si ya tenés, iniciá sesión).
3. Tocá el **+** de arriba a la derecha y elegí **New repository**.
   - **Repository name:** `geografia-en-juego`
   - Dejalo en **Public** (GitHub Pages gratis necesita repositorio público).
   - No marques ninguna casilla de README ni .gitignore.
   - Tocá **Create repository**.
4. En la página del repositorio vacío tocá el enlace **uploading an existing file**.
5. **Arrastrá** a esa página los archivos de la carpeta descomprimida: `index.html`, `style.css`, `script.js` y la carpeta `assets` (también `README.md` y `DESAFIOS.md` si querés).
   - Si tu navegador no deja arrastrar la carpeta `assets`, subí lo demás y después usá **Add file** y después **Create new file**, escribí `assets/favicon.svg` como nombre y pegá el contenido del archivo. El ícono es opcional: el juego funciona igual sin él.
6. Abajo tocá **Commit changes**.
7. Andá a **Settings** (pestaña de arriba del repositorio) y después a **Pages** (menú de la izquierda).
8. En **Build and deployment**, en **Source**, elegí **Deploy from a branch**. En **Branch** elegí `main` y la carpeta `/ (root)`. Tocá **Save**.
9. Esperá entre 1 y 3 minutos y recargá esa misma pantalla.

## 2. Obtener la URL pública

Cuando termina, arriba de la pantalla **Settings > Pages** aparece el cartel *"Your site is live at …"* con la dirección:

```text
https://TU-USUARIO.github.io/geografia-en-juego/
```

Copiala, abrila en el celular y comprobá que se vea la pantalla **GEOGRAFÍA EN JUEGO**. Esa es la URL que va en el QR.

*Alternativas igual de gratis:* en **Netlify** alcanza con arrastrar la carpeta a <https://app.netlify.com/drop>; en **Vercel** se importa el repositorio de GitHub sin configurar nada (es un sitio estático, sin build).

## 3. Convertir la URL en un código QR

Usá un generador de **QR estático** (sin registro y sin vencimiento) y pegá la URL completa.

- Evitá los QR **"dinámicos"** de prueba gratuita: pasan por un servicio intermedio y suelen dejar de funcionar al vencer la prueba.
- Descargalo en **PNG de buena resolución** (o SVG) y probalo antes de imprimir.
- Si lo imprimís: mínimo 3 × 3 cm, con margen blanco alrededor y bien contrastado.

## 4. Probar el QR (lista de control)

1. Escaneá el QR con la cámara de un celular: debe abrir **GEOGRAFÍA EN JUEGO**.
2. Jugá unos desafíos de País Infiltrado y una partida corta de Geografía en Cadena, con nombres reconocibles (por ejemplo "Zoilo").
3. Con **otro celular** (celular B), escaneá **el mismo QR**: tiene que abrir la portada, con el desafío 1 y sin ningún nombre ni país del celular A.
4. Probá en iPhone y en Android, con datos móviles y con wifi.
5. Repetí el paso 3 mientras el celular A sigue en medio de una partida: el celular B tiene que empezar igual de limpio.

---

## 5. Cómo funcionan las sesiones independientes

- **No hay servidor que guarde partidas.** La página es solo tres archivos estáticos que cada celular descarga. Un celular no tiene ningún camino para hablar con otro.
- **El estado vive únicamente en la memoria de la pestaña.** Los nombres de los jugadores, la cadena que están armando, los puntajes y en qué desafío van están en una variable de JavaScript dentro de `script.js`. Cuando se cierra o recarga la pestaña, esa memoria desaparece.
- **No se usa ningún almacenamiento.** El código no usa `localStorage`, `sessionStorage`, cookies, IndexedDB ni service workers, así que no queda nada para que otra persona lo herede, ni siquiera en el mismo celular.
- **No se envía nada a ningún lado.** La página declara una política de seguridad (`connect-src 'none'`) que hace que el navegador bloquee `fetch`, `XMLHttpRequest`, `WebSocket` y `sendBeacon`. Durante el juego solo se descargan los archivos de la página al abrirla.
- **El mismo QR no comparte nada:** abrir la misma URL en otro celular, en otra pestaña o mil veces más descarga una copia nueva que arranca en la portada.
- Si el navegador restaura una pestaña vieja desde su memoria (botón "atrás"), la página detecta ese caso y vuelve a la portada. Tocar **Inicio** también borra todo.

Un detalle honesto: como la página es estática, las respuestas de los desafíos viajan dentro de `script.js`. La pantalla nunca las muestra antes de confirmar, pero alguien que abra el código fuente con herramientas de desarrollador las podría leer.

## 6. Ajustes rápidos (arriba de `script.js`)

| Ajuste | Valor actual | Para qué sirve |
|---|---|---|
| `MAX_CHAIN` | `5` | Cuántos países puede tener una cadena, contando los dos de las puntas. Con 5, en el medio entran 3. |
| `CHAIN_PLAYERS` | `2` | Cuántos jugadores juegan Geografía en Cadena. |
| `MAX_NAME_LENGTH` | `14` | Largo máximo de los nombres. |

Los desafíos de los dos juegos y cómo editarlos están en `DESAFIOS.md`.

## 7. Cosas para tener en cuenta

- **Siempre lo mismo:** los 10 desafíos de cada juego salen siempre en el mismo orden y, en País Infiltrado, con los 5 países en el mismo orden que en la tarjeta del PDF. "Jugar de nuevo" empieza otra vez desde el desafío 1.
- **El infiltrado casi siempre va último.** Así vienen las tarjetas del PDF: en 9 de las 10 el infiltrado es el quinto de la lista. Quien juegue dos veces, o mire el celular de al lado, puede adivinar por la posición. Si querés evitarlo, cambiá el orden de `options` en `script.js` (la respuesta no cambia: es `intruder`).
- **Fronteras:** son las de la lista `LIMITES` en `script.js`. No se cuenta España-Marruecos (Ceuta y Melilla), porque en un mapa escolar aparecen separados por el estrecho de Gibraltar. Cuba está declarada como isla, sin fronteras.
- **Vale cualquier cadena correcta**, no solo la que trae el juego. Varios desafíos tienen más de 20 soluciones distintas.
- **Ejemplo 6 del PDF:** la explicación original decía "Los otros 4 limitan con Argentina", pero Argentina es uno de los 4 países que se muestran. Se cambió solo esa frase por "Los otros 4 están en América del Sur." La respuesta (Australia) no cambia.
- **Correcto e incorrecto** se distinguen por el ícono (tilde / cruz), por el texto y por el color (azul / beige oscuro), no por rojo y verde.
- **Banderas:** son los únicos emojis de la página; todo lo demás son íconos SVG. En iPhone, Android y Mac se ven como banderas. En Windows (Chrome/Edge) aparecen como dos letras (por ejemplo "AR"); el juego funciona igual.
