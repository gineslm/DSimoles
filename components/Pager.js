/* Pager · 7.5 Navegación · HF: 1 Base - Paginador (carrusel de pendientes del inicio, 2.1)
   «1/3» visible; anunciado como «{unit} n de N». Botones de size.pager-dot (28), icono 16. AA. */
(function () {
  var NS = window.DSimoles, h = NS.h;
  NS.css('pager', [
    '.dsm-pager{display:inline-flex;align-items:center;gap:var(--ds-space-3)}',
    '.dsm-pager__count{font:var(--ds-type-ui);font-variant-numeric:tabular-nums;color:var(--ds-color-text-secondary)}',
    '.dsm-pager__btn{display:inline-flex;align-items:center;justify-content:center;width:var(--ds-size-pager-dot);height:var(--ds-size-pager-dot);border-radius:var(--ds-radius-pill);cursor:pointer;background:var(--ds-color-chip-neutral-bg);color:var(--ds-color-text-body)}',
    '.dsm-pager__btn:hover,.dsm-pager__btn.is-hover{background-image:linear-gradient(var(--ds-color-surface-pressed),var(--ds-color-surface-pressed))}',
    '.dsm-pager__btn--next{background:var(--ds-color-action-primary);color:var(--ds-color-text-inverse)}',
    '.dsm-pager__btn--next:hover,.dsm-pager__btn--next.is-hover{background:var(--ds-color-action-primary-hover)}',
    '.dsm-pager__btn[aria-disabled="true"]{background:var(--ds-color-bg-tint);color:var(--ds-color-text-disabled);cursor:default}'
  ].join('\n'));

  NS.Pager = function Pager(p) {
    var total = Math.max(1, Number(p.total) || 1);
    var v = NS.useControlled(p.current != null ? Number(p.current) : undefined, Number(p.defaultCurrent) || 1, p.onChange);
    var cur = Math.min(total, Math.max(1, v[0]));
    var unit = p.unit || 'Paso';
    var btn = function (dir) {
      var dis = dir < 0 ? cur <= 1 : cur >= total;
      return h('button', {
        type: 'button',
        className: NS.cx('dsm-reset dsm-focus dsm-target dsm-pager__btn', dir > 0 && 'dsm-pager__btn--next', p.demoState && dir > 0 && NS.state(p.demoState)),
        'aria-label': dir < 0 ? 'Anterior' : 'Siguiente', 'aria-disabled': dis || undefined,
        onClick: function () { if (!dis) v[1](cur + dir); }
      }, h(NS.Icon, { name: dir < 0 ? 'chevron_left' : 'chevron_right', size: 'xs' }));
    };
    return h('div', { className: 'dsm-root dsm-pager', role: 'group', 'aria-label': p.label || 'Paginación' },
      h('span', { className: 'dsm-pager__count', 'aria-hidden': 'true' }, cur + '/' + total),
      h('span', { className: 'dsm-sr', 'aria-live': 'polite' }, unit + ' ' + cur + ' de ' + total),
      btn(-1), btn(1));
  };
})();
