# Discrepancias entre el DS y el prototipo de iMoles

Diferencias entre lo que define DSimoles y lo que muestra el prototipo de iMoles (HF), ordenadas por sección. Sirve para revisar y corregir el prototipo. Las páginas del DS ya no las muestran: exponen los componentes de forma agnóstica.

Las correcciones de color (1.1) están en la página 10.x Publicación y migración y en las tasks de `implementation.publishing-and-migration`.

## 1.2 Tipografía · valores fuera de escala
| Observado en el prototipo | Pasa a |
| --- | --- |
| 10, 11 px | type.ui (12) |
| 12.5, 13.5 px | type.small (13) o type.caption (14) |
| 15 px | type.body (16) |
| 18 px | type.label (16) |
| 20, 22 px | type.result (21) |
| 26 px | type.title (24) |
| Peso 300 a 15–16 px | 400 |
| Tracking .03 · .04 · .06 · .1 · .12 · .14em | .05em (type.ui) |
| 27 y 40 px (h1, display) | Solo en la documentación, no en la app |
| 19, 23, 25 px | type.result (21) o type.title (24) |
| body 300 15/1.45 | type.body 400 16/1.2 |

## 1.3 Espaciado · valores fuera de escala
| Observado en el prototipo | Pasa a |
| --- | --- |
| 5, 6 px | space.1 (4) o space.2 (8) |
| 9, 10 px | space.2 (8) o space.3 (12) |
| 13, 14 px | space.3 (12) o space.4 (16) |
| 18, 22 px | space.5 (20) o space.6 (24) |
| 30 px | space.7 (32) |
| Chip 3 / 9 | 4 / 8 |
| Campo 13 / 14 | 12 / 16 |

## 1.4 Dimensiones
- --imoles-control-height-sm (46 px) pasa a size.control.md (44). Escala de controles: lg 52 · md 44 · sm 36 · xs 28.
- IconButton de 36 a size.icon-button.md (40), con área táctil de 44.

## 1.6 Forma · valores fuera de escala
| Observado en el prototipo | Pasa a |
| --- | --- |
| 18 px · --imoles-radius-note (paneles de documentación) | radius.card (14) |
| 16 px · --imoles-radius-card (tarjetas, filas) | radius.card (14) |
| 14 px · --imoles-radius-btn (botones) | radius.button (6) |
| 14 px · campos y opciones | radius.field (10) |
| 36 px · --imoles-radius-phone | Marco del dispositivo, no la interfaz: sin token |

## 1.7 Elevación · valores fuera de escala
| Observado en el prototipo | Pasa a |
| --- | --- |
| Tinta rgba(18,48,43,…) en --imoles-shadow-interactive y -solid | color.neutral.950 en elevation.interactive y -solid |
| 0 12px 28px -8px rgba(18,48,43,.28) · menú de opciones | elevation.overlay (sin decidir) |
| 0 1px 4px rgba(0,0,0,.15) · etiqueta sobre foto | Sin token: decidir si es elevation.overlay o se elimina |

## 1.8 Opacidad · valores fuera de escala
| Observado en el prototipo | Pasa a |
| --- | --- |
| opacity .14 · Captura Detalle | Sin token: segundo valor pendiente |
| rgba(255,255,255,.92) y rgba(255,255,255,.14) · capas sobre foto | Sin token: segundo valor pendiente |

## 7.1 Button
- primario-alerta pasa a alert y se reserva para pedir cita presencial con riesgo alto.
- secundario-marca y secundario se unifican en secondary, con el aspecto de secundario-marca: borde de 2 px de action.primary y texto brand.text.
- Borde del secondary de 1.5 a 2 px y alto de 46 a size.control.md (44).
- Se añaden hover, pressed, focus, disabled y loading, que la HF no tenía.
- role="button" en un div pasa a ser un `<button>` real.
- Sin uso en la HF: grupo de botones (en la HF se apilan en una columna, sin componente que los agrupe) y botón con acción secundaria (split button).

## 7.2 IconButton
- Objetivo de 36 a 44 px con el área táctil invisible.
- El span con aria-label pasa a ser un `<button>`.

## 7.10 Icon
- Tamaños 16 y 26 de la HF pasan a sm (18) y lg (24).
- Se carga el subconjunto local; la HF usaba Google Fonts.
- El menú de opciones de la HF usa edit y archive, que no están en el subconjunto.

## 7.14 BackLink
- On-dark de #B8C7C4 a component.on-dark.text (neutral.200).
- role="link" en un div pasa a ser un enlace o un botón real.
- Sin uso en la HF: breadcrumbs (la jerarquía tiene dos niveles), tabs (los filtros de 2.2 son FilterChips), navegación lateral (la app es solo móvil) y paginación de listas (las listas son cortas).

## 7.15 BottomNav
- Etiqueta de 10 a 12 px.
- Inactivo de muted a text.secondary para llegar a 4.5:1.
- Se añade la pastilla del activo: en la HF el activo solo cambiaba de color.
- Perfil no navegaba en la HF y no está diseñado.

## 7.16 Pager
- Se anuncia «Paso n de N».
- Área táctil de 28 a 44 px sin cambiar el tamaño visible.

## 7.17 Spinner
- La HF no tiene esperas con spinner: el componente se extrapoló para Button loading.

## 7.19 ProcessSteps
- Pasos de 300 15 a type.body.
- Radio de la barra de 3 a radius.pill.

## 7.20 Disclosure
- Se añade el chevron: la HF solo tenía la etiqueta.
- Etiqueta de 11 a 12 px.
- Sin uso en la HF: accordion (el Disclosure suelto cubre los usos), tooltip y popover (en móvil no hay hover), diálogo (hará falta para confirmar archivar o eliminar; existe opacity.scrim) y panel lateral u hoja inferior (2.2b muestra la información de la primera foto en pantalla completa).

## 7.21 OptionsMenu
- Sombra a mano a component.menu.elevation (elevation.overlay sin decidir).
- Texto de 400 15 a type.body.
- Se añaden el teclado y la devolución del foco.
- Archivar es una acción destructiva y necesita confirmación; la HF no la tiene.

## 8.1 RiskBadge
- sm de 10 a 12 px (nada por debajo de 12).
- Intermedio con un único relleno amber.600 (4.77:1), como en la acción.
- No evaluable pasa al morado (status.unknown).

## 8.2 SummaryCard
- Acento de 3 a 4 px (border.width.heavy).
- Etiqueta de 10 a 12 px; valor de 500 15 a type.label.
