# Los desafíos de los dos juegos

Los dos juegos tienen **10 desafíos fijos**, siempre en el mismo orden (del 1 al 10) y siempre iguales
en cualquier celular. No hay nada al azar.

---

## 1. País Infiltrado

Son exactamente los 10 ejemplos del PDF `pais_infiltrado_10_ejemplos.pdf`, con sus respuestas.
En cada uno se muestran 5 países: cuatro comparten una característica y uno es el infiltrado.
Los 5 países salen en el mismo orden que en la tarjeta del PDF. Al terminar los 10 se muestra el puntaje.

| # (ejemplo del PDF) | Los 5 países, en el orden en que se muestran | Infiltrado (respuesta) | Explicación que ve el jugador |
|---|---|---|---|
| 1 | Argentina, Brasil, Chile, Perú, Francia | **Francia** | Los otros 4 países están en América del Sur. |
| 2 | España, México, Argentina, Colombia, Japón | **Japón** | Los otros 4 tienen el español como idioma oficial. |
| 3 | Italia, Francia, Alemania, España, China | **China** | Los otros 4 están en Europa. |
| 4 | Canadá, Estados Unidos, México, Cuba, Egipto | **Egipto** | Los otros 4 están en América del Norte o el Caribe. |
| 5 | Japón, China, Corea del Sur, Tailandia, Portugal | **Portugal** | Los otros 4 están en Asia. |
| 6 | Argentina, Brasil, Uruguay, Paraguay, Australia | **Australia** | Los otros 4 están en América del Sur. (*) |
| 7 | España, Portugal, Francia, Italia, Brasil | **Brasil** | Los otros 4 están en Europa. |
| 8 | Egipto, Marruecos, Argelia, Túnez, Noruega | **Noruega** | Los otros 4 están en África. |
| 9 | Estados Unidos, Canadá, México, Brasil, Cuba | **Brasil** | Los otros 4 están en América del Norte o el Caribe. |
| 10 | Australia, Nueva Zelanda, Fiyi, Papúa Nueva Guinea, Alemania | **Alemania** | Los otros 4 son países de Oceanía. |

(*) **Único cambio respecto del PDF:** en el ejemplo 6 el PDF decía "Los otros 4 limitan con Argentina",
pero Argentina es uno de los 4 países que se muestran. Se cambió solo la explicación por
"Los otros 4 están en América del Sur." La respuesta (Australia) es la misma que en el PDF.

### Cómo editarlos

Están al principio de `script.js`, en la lista `CHALLENGES`:

```js
{ options: ['Italia', 'Francia', 'Alemania', 'España', 'China'], intruder: 'China',
  why: 'Los otros 4 están en Europa.' }
```

- `options`: los 5 países, en el orden en que se muestran.
- `intruder`: la respuesta. Tiene que ser uno de los 5.
- `why`: la explicación que aparece después de confirmar.

---

## 2. Geografía en Cadena

Dos jugadores, por turnos, sin reloj. Hay que unir los dos países de las puntas pasando por países
que **compartan frontera**. La cadena entera no puede tener más de **5 países** contando las puntas,
así que en el medio entran hasta 3.

Los jugadores se turnan: el jugador 1 resuelve los desafíos 1, 3, 5, 7 y 9; el jugador 2, los pares.
Gana quien acierta más; si empatan, se muestra EMPATE.

| # | Hay que unir | Países para tocar (8) | Cadena más corta | Cadenas válidas en total |
|---|---|---|---|---|
| 1 | Argentina → Perú | Bolivia, Chile, Brasil, Uruguay, Paraguay, Ecuador, Colombia, México | Argentina → Chile → Perú  //  Argentina → Bolivia → Perú  //  (y 1 más) | 23 |
| 2 | España → Alemania | Francia, Portugal, Italia, Suiza, Bélgica, Austria, Polonia, Marruecos | España → Francia → Alemania | 6 |
| 3 | Chile → Brasil | Argentina, Bolivia, Perú, Uruguay, Paraguay, Ecuador, Colombia, Venezuela | Chile → Argentina → Brasil  //  Chile → Bolivia → Brasil  //  (y 1 más) | 22 |
| 4 | Egipto → Argelia | Libia, Sudán, Chad, Níger, Túnez, Marruecos, Malí, Etiopía | Egipto → Libia → Argelia | 10 |
| 5 | Estados Unidos → Guatemala | México, Canadá, Belice, Cuba, Honduras, El Salvador, Nicaragua, Panamá | Estados Unidos → México → Guatemala | 2 |
| 6 | Uruguay → Perú | Brasil, Argentina, Bolivia, Chile, Paraguay, Colombia, Ecuador, Venezuela | Uruguay → Brasil → Perú | 19 |
| 7 | Portugal → Italia | España, Francia, Suiza, Austria, Alemania, Marruecos, Grecia, Bélgica | Portugal → España → Francia → Italia | 2 |
| 8 | Nepal → Irán | India, Pakistán, China, Afganistán, Bangladés, Irak, Turquía, Arabia Saudita | Nepal → India → Pakistán → Irán  //  Nepal → China → Pakistán → Irán  //  (y 1 más) | 9 |
| 9 | Marruecos → Egipto | Argelia, Libia, Túnez, Níger, Malí, Chad, Sudán, Mauritania | Marruecos → Argelia → Libia → Egipto | 5 |
| 10 | Chile → Venezuela | Perú, Colombia, Bolivia, Brasil, Argentina, Ecuador, Paraguay, Guyana | Chile → Argentina → Brasil → Venezuela  //  Chile → Bolivia → Brasil → Venezuela  //  (y 2 más) | 19 |

**Vale cualquier cadena correcta**, no solo la más corta. La última columna muestra cuántas cadenas
distintas acepta cada desafío (contando las de hasta 5 países). Entre las 8 opciones siempre hay
algunas que no sirven: por ejemplo Cuba, que es una isla y no limita con nadie.

### Cómo editarlos

En `script.js`, en la lista `LINKS`:

```js
{ from: 'Argentina', to: 'Perú',
  options: ['Bolivia', 'Chile', 'Brasil', 'Uruguay', 'Paraguay', 'Ecuador', 'Colombia', 'México'],
  solution: ['Argentina', 'Bolivia', 'Perú'] }
```

- `from` y `to`: los dos países de las puntas. No tienen que limitar entre sí (sería trivial).
- `options`: los 8 países que se pueden tocar. No incluyas `from` ni `to`.
- `solution`: una cadena correcta. Es la que se muestra cuando la respuesta está mal.

**Importante:** las fronteras están en la lista `LIMITES` de `script.js` (79 pares entre
52 países). Si usás un país nuevo en un desafío, agregá también sus fronteras ahí, porque si no
el juego va a creer que ese país no limita con nadie.

Dos aclaraciones sobre los datos de fronteras:

- **No** se cuenta España-Marruecos (Ceuta y Melilla), porque en un mapa escolar esos dos países
  aparecen separados por el estrecho de Gibraltar.
- Cuba figura en la lista `SIN_LIMITES`: es una isla y no limita con ningún país.
