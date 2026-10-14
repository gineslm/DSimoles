/* CaptureRow · 7.8 Datos · HF: 2 Entidad - Fila Captura
   Una foto del historial de un seguimiento: fecha y resultado del análisis con su forma de riesgo. */
(function () {
  var NS = window.DSimoles, h = NS.h;
  NS.css('capture-row', [
    '.dsm-crow{display:flex;align-items:stretch;gap:var(--ds-space-3);width:100%;padding:var(--ds-space-1);border:var(--ds-border-width-thin) solid var(--ds-color-border-subtle);border-radius:var(--ds-radius-card);background:var(--ds-color-bg-surface);box-shadow:var(--ds-elevation-interactive);text-align:left;color:var(--ds-color-text-primary);cursor:pointer;text-decoration:none}',
    '.dsm-crow .dsm-thumb{border-radius:calc(var(--ds-radius-card) - var(--ds-space-1))}',
    '.dsm-crow:hover,.dsm-crow.is-hover{background-image:linear-gradient(var(--ds-color-surface-hover),var(--ds-color-surface-hover))}',
    '.dsm-crow:active,.dsm-crow.is-pressed{background-image:linear-gradient(var(--ds-color-surface-pressed),var(--ds-color-surface-pressed))}',
    '.dsm-crow__body{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center;gap:var(--ds-space-half);padding-block:var(--ds-space-1)}',
    '.dsm-crow__date{font:var(--ds-type-label)}',
    '.dsm-crow__end{align-self:center;padding-right:var(--ds-space-2)}'
  ].join('\n'));

  NS.CaptureRow = function CaptureRow(p) {
    var cls = NS.cx('dsm-root dsm-reset dsm-focus dsm-crow', NS.state(p.demoState));
    var kids = [
      h(NS.Thumb, { key: 't', src: p.image, size: 'sm' }),
      h('span', { key: 'b', className: 'dsm-crow__body' },
        h('span', { className: 'dsm-crow__date' }, p.date),
        h(NS.RiskBadge, { level: p.level || 'low', label: p.result, size: 'inline' })),
      h('span', { key: 'e', className: 'dsm-crow__end dsm-chevron' }, h(NS.Icon, { name: 'chevron_right', size: 'md' }))
    ];
    if (p.href) return h('a', { className: cls, href: p.href, onClick: p.onClick }, kids);
    return h('button', { type: 'button', className: cls, onClick: p.onClick }, kids);
  };
})();
