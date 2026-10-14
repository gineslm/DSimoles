/* Disclosure · 7.7 Revelado y superposición · HF: «Ampliar información» / «Datos de la captura» (details nativo)
   Tonos: brand (enlace de marca y panel tint), neutral (etiqueta secundaria y panel con borde), risk-high (panel de riesgo alto). */
(function () {
  var NS = window.DSimoles, h = NS.h;
  NS.css('disclosure', [
    '.dsm-disc{display:flex;flex-direction:column}',
    '.dsm-disc>summary{list-style:none;display:inline-flex;align-items:center;gap:var(--ds-space-1);align-self:flex-start;min-height:var(--ds-size-icon-lg);font:var(--ds-type-ui);letter-spacing:var(--ds-type-ui-tracking);text-transform:uppercase;cursor:pointer;padding-inline-end:var(--ds-space-1);border-radius:var(--ds-radius-xs);color:var(--ds-color-link-default)}',
    '.dsm-disc>summary::-webkit-details-marker{display:none}',
    '.dsm-disc>summary:hover,.dsm-disc>summary.is-hover{text-decoration:underline;text-underline-offset:3px}',
    '.dsm-disc__chev{transition:transform .15s ease}',
    '.dsm-disc[open] .dsm-disc__chev{transform:rotate(90deg)}',
    '@media (prefers-reduced-motion:reduce){.dsm-disc__chev{transition:none}}',
    '.dsm-disc__panel{margin-top:var(--ds-space-2);padding:var(--ds-space-3) var(--ds-space-4);border-radius:var(--ds-radius-card);background:var(--ds-color-bg-tint);font:var(--ds-type-caption);color:var(--ds-color-text-body)}',
    '.dsm-disc--neutral>summary{color:var(--ds-color-text-secondary)}',
    '.dsm-disc--neutral .dsm-disc__panel{background:var(--ds-color-bg-surface);border:var(--ds-border-width-thin) solid var(--ds-color-border-subtle)}',
    '.dsm-disc--risk-high>summary{color:var(--ds-color-risk-high-text)}',
    '.dsm-disc--risk-high .dsm-disc__panel{background:var(--ds-color-risk-high-tint);border:var(--ds-border-width-thin) solid var(--ds-component-disclosure-risk-border);color:var(--ds-color-risk-high-body)}'
  ].join('\n'));

  NS.Disclosure = function Disclosure(p) {
    var tone = p.tone || 'brand';
    var content = p.children;
    if (!content && p.rows) content = h(NS.DescriptionList, { rows: p.rows, tone: tone === 'risk-high' ? 'risk-high' : 'default' });
    return h('details', { className: NS.cx('dsm-root dsm-disc', 'dsm-disc--' + tone), open: p.open ? true : undefined },
      h('summary', { className: NS.cx('dsm-focus dsm-target', NS.state(p.demoState)) },
        h(NS.Icon, { name: 'chevron_right', size: 'xs', className: 'dsm-disc__chev' }),
        h('span', null, p.label || 'Ampliar información')),
      h('div', { className: 'dsm-disc__panel' }, content));
  };
})();
