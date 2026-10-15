/* Ovl-Accordion · 7.21 (antes Ovl-Disclosure; renombrado por el owner el 2026-10-15; DSimoles.Disclosure queda como alias) · HF: «Ampliar información» / «Datos de la captura» (details nativo)
   Muestra u oculta contenido secundario; label obligatorio. El estado abierto/cerrado lo anuncia el elemento nativo.
   Cápsula (única variante desde el 2026-10-15; se retira la variante con línea): cápsula con borde a todo el ancho del contenedor,
   como una fila de lista que se despliega. Icono y etiqueta ocupan el resumen; abierto, el contenido queda dentro de la misma cápsula.
   Hover y pressed pintan todo el resumen; el anillo de foco lo rodea sin separación.
   size (2026-10-15): md (por defecto; alto 44, size.control.md · AAA 2.5.5) | sm (alto 36, size.control.sm · AA 2.5.8).
   Tonos: brand (etiqueta de marca), neutral (etiqueta secundaria), error (etiqueta y borde de error; risk-high es alias temporal). */
(function () {
  var NS = window.DSimoles, h = NS.h;
  NS.css('disclosure', [
    '.dsm-disc{display:flex;flex-direction:column;border:var(--ds-border-width-thin) solid var(--ds-color-border-subtle);border-radius:var(--ds-radius-card);background:var(--ds-color-bg-surface)}',
    '.dsm-disc>summary{list-style:none;display:flex;align-items:center;gap:var(--ds-space-1);min-height:var(--ds-size-control-md);padding:var(--ds-space-2) var(--ds-space-4);padding-inline-start:var(--ds-space-3);border-radius:calc(var(--ds-radius-card) - var(--ds-border-width-thin));font:var(--ds-type-ui);letter-spacing:var(--ds-type-ui-tracking);text-transform:uppercase;cursor:pointer;color:var(--ds-color-link-default)}',
    '.dsm-disc>summary::-webkit-details-marker{display:none}',
    '.dsm-disc[open]>summary{border-end-start-radius:0;border-end-end-radius:0}',
    '.dsm-disc>summary:hover,.dsm-disc>summary.is-hover{background:var(--ds-color-surface-hover)}',
    '.dsm-disc>summary:active,.dsm-disc>summary.is-pressed{background:var(--ds-color-surface-pressed)}',
    '.dsm-disc>summary.dsm-focus:focus-visible,.dsm-disc>summary.dsm-focus.is-focus{outline-offset:0}',
    '.dsm-disc__label{flex:1;min-width:0}',
    '.dsm-disc__chev{transition:transform .15s ease}',
    '.dsm-disc[open] .dsm-disc__chev{transform:rotate(90deg)}',
    '@media (prefers-reduced-motion:reduce){.dsm-disc__chev{transition:none}}',
    '.dsm-disc__panel{padding:0 var(--ds-space-4) var(--ds-space-3);font:var(--ds-type-caption);color:var(--ds-color-text-body)}',
    '.dsm-disc--sm>summary{min-height:var(--ds-size-control-sm);padding:var(--ds-space-1) var(--ds-space-3);padding-inline-start:var(--ds-space-2)}',
    '.dsm-disc--sm .dsm-disc__panel{padding:0 var(--ds-space-3) var(--ds-space-2)}',
    '.dsm-disc--neutral>summary{color:var(--ds-color-text-secondary)}',
    '.dsm-disc--error{border-color:var(--ds-color-status-error-text)}',
    '.dsm-disc--error>summary{color:var(--ds-color-status-error-text)}',
    '.dsm-disc--error .dsm-disc__panel{color:var(--ds-color-status-error-body)}'
  ].join('\n'));

  NS.Accordion = function Accordion(p) {
    var tone = p.tone === 'risk-high' ? 'error' : (p.tone || 'brand');
    var content = p.children;
    if (!content && p.rows) content = h(NS.DescriptionList, { rows: p.rows, tone: tone === 'error' ? 'error' : 'default' });
    return h('details', { className: NS.cx('dsm-root dsm-disc', 'dsm-disc--' + tone, p.size === 'sm' && 'dsm-disc--sm'), open: p.open ? true : undefined },
      h('summary', { className: NS.cx('dsm-focus dsm-target', NS.state(p.demoState)) },
        h(NS.Icon, { name: 'chevron_right', size: 'xs', className: 'dsm-disc__chev' }),
        h('span', { className: 'dsm-disc__label' }, p.label || 'Más información')),
      h('div', { className: 'dsm-disc__panel' }, content));
  };
  NS.Disclosure = NS.Accordion;
})();
