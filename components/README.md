# components/

Librería de componentes de DSimoles, extraída de la HF de la app de paciente · iMoles (`diseno-imoles/1 Base` y `2 Entidad`).

- Un archivo `.js` por componente. Cada uno se registra en `window.DSimoles` y añade su CSS, que solo usa `var(--ds-*)`.
- `core.js`: utilidades comunes, `Icon` (Vis-Icon), `Spinner` (Fb-Spinner), `Thumb` y `RiskGlyph` (este último, de iMoles). Va antes que cualquier componente.
- `tokens.css`: tokens de componente (`--ds-component-*`) propuestos donde la capa de roles no llega. Están pendientes de revisión.
- Dependencias: React (`assets/_runtime/`) y `assets/visuals/tokens.css`.

## Uso en una página de sección

```html
<link rel="stylesheet" href="../../assets/visuals/tokens.css">
<link rel="stylesheet" href="../../components/tokens.css">
<script src="../../assets/_runtime/react.production.min.js"></script>
<script src="../../assets/_runtime/react-dom.production.min.js"></script>
<script src="../../components/core.js"></script>
<script src="../../components/Button.js"></script>
<script src="./support.js"></script>
…
<x-import component-from-global-scope="DSimoles.Button" variant="primary" label="Continuar" hint-size="auto,44px"></x-import>
```

Las props de lista (`options`, `items`, `rows`, `steps`) admiten un array o un texto separado por `|`, con los campos de cada elemento separados por `::`. `demo-state` (hover, pressed, focus) solo sirve para documentar los estados.

## Dependencias entre componentes

| Componente | Necesita |
| --- | --- |
| IconButton (alias temporal de Act-Button) | Button |
| Pager | Button |
| ListRow / ListGroup | Button |
| OptionsMenu | Button |
| FollowUpHeader (iMoles) | OptionsMenu, Button |
| TextField | Field |
| TextArea | Field, TextField |
| Select | Field, TextField |
| ProcessSteps | ProgressBar |
| Disclosure | DescriptionList (si usa `rows`) |
| ActionCard (iMoles) | StatusChip, RiskBadge, Disclosure, DescriptionList |
| AnalysisSummary (iMoles) | RiskBadge, Disclosure, DescriptionList |
| FollowUpCard (iMoles) | RiskBadge, StatusChip |
| CaptureRow (iMoles) | RiskBadge |

## Cambios de la auditoría (2026-10-15)

- Act-Button unifica Button e IconButton. `IconButton.js` queda como alias temporal (clear, solo icono; tamaños lg→md, md→sm). `variant="alert"` es alias de `destructive`. El ancho por defecto pasa a `auto`.
- ChoiceList se retira; lo sustituye Select (`Select.js`).
- Nuevos: `Chip.js` (Vis-Chip), `TextArea.js` (Form-TextArea), `Select.js` (Form-Select), `ProgressBar.js` (Fb-ProgressBar, antes dentro de ProcessSteps).
- Los componentes base solo usan tonos semánticos genéricos (`status-*`); los tonos de riesgo quedan en los componentes de iMoles.
- Los nombres de la documentación llevan prefijo de familia (Act-, Form-, Data-, Nav-, Fb-, Ovl-, Vis-); en el código siguen sin prefijo (`DSimoles.Button`).

La documentación de cada componente está en `sections/components/`.
