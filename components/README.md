# components/

Librería de componentes de DSimoles, extraída de la HF de la app de paciente · iMoles (`diseno-imoles/1 Base` y `2 Entidad`).

- Un archivo `.js` por componente. Cada uno se registra en `window.DSimoles` y añade su CSS, que solo usa `var(--ds-*)`.
- `core.js`: utilidades comunes, `Icon`, `Spinner`, `RiskGlyph` y `Thumb`. Va antes que cualquier componente.
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
<x-import component-from-global-scope="DSimoles.Button" variant="primary" label="Continuar" hint-size="100%,52px"></x-import>
```

Las props de lista (`options`, `items`, `rows`, `steps`) admiten un array o un texto separado por `|`, con los campos de cada elemento separados por `::`. `demo-state` (hover, pressed, focus) solo sirve para documentar los estados.

## Dependencias entre componentes

| Componente | Necesita |
| --- | --- |
| ActionCard | StatusChip, RiskBadge, Disclosure, DescriptionList |
| AnalysisSummary | RiskBadge, Disclosure, DescriptionList |
| FollowUpCard | RiskBadge, StatusChip |
| FollowUpHeader | OptionsMenu, IconButton |
| OptionsMenu | IconButton |
| ListRow | Button |
| CaptureRow | RiskBadge |
| TextField | Field |
| Disclosure | DescriptionList (si usa `rows`) |

La documentación de cada componente está en `sections/components/`.
