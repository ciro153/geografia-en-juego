# Desafíos de País Infiltrado

Son **10 desafíos**, exactamente los 10 ejemplos del PDF `pais_infiltrado_10_ejemplos.pdf`, con sus respuestas.
En cada uno se muestran 5 países: cuatro comparten una característica y uno es el infiltrado.
El juego los mezcla al azar en cada partida y no repite ninguno dentro de la misma partida. Al terminar los 10 se muestra el puntaje final.

| # (ejemplo del PDF) | Los 4 países que encajan | Infiltrado (respuesta) | Explicación que ve el jugador |
|---|---|---|---|
| 1 | Argentina, Brasil, Chile, Perú | **Francia** | Los otros 4 países están en América del Sur. |
| 2 | España, México, Argentina, Colombia | **Japón** | Los otros 4 tienen el español como idioma oficial. |
| 3 | Italia, Francia, Alemania, España | **China** | Los otros 4 están en Europa. |
| 4 | Canadá, Estados Unidos, México, Cuba | **Egipto** | Los otros 4 están en América del Norte o el Caribe. |
| 5 | Japón, China, Corea del Sur, Tailandia | **Portugal** | Los otros 4 están en Asia. |
| 6 | Argentina, Brasil, Uruguay, Paraguay | **Australia** | Los otros 4 están en América del Sur. (*) |
| 7 | España, Portugal, Francia, Italia | **Brasil** | Los otros 4 están en Europa. |
| 8 | Egipto, Marruecos, Argelia, Túnez | **Noruega** | Los otros 4 están en África. |
| 9 | Estados Unidos, Canadá, México, Cuba | **Brasil** | Los otros 4 están en América del Norte o el Caribe. |
| 10 | Australia, Nueva Zelanda, Fiyi, Papúa Nueva Guinea | **Alemania** | Los otros 4 son países de Oceanía. |

(*) **Único cambio respecto del PDF:** en el ejemplo 6 el PDF decía "Los otros 4 limitan con Argentina", pero Argentina es uno de los 4 países que se muestran. Se cambió solo la explicación por "Los otros 4 están en América del Sur." La respuesta (Australia) es la misma que en el PDF.

## Cómo editarlos

Los desafíos están al principio de `script.js`, en la lista `CHALLENGES`. Cada uno tiene este formato:

```js
{ category: 'Países de Europa', others: ['Italia','Francia','Alemania','España'], intruder: 'China', why: 'Los otros 4 están en Europa.' }
```

- `others`: los 4 países que comparten algo (escribilos exactamente como figuran en la lista de países del juego).
- `intruder`: el país infiltrado.
- `why`: la explicación que se muestra después de confirmar.
- `category`: nota interna, no se muestra en pantalla.

Si cambiás la cantidad de desafíos, el juego se adapta solo ("Desafío 3 de N").
