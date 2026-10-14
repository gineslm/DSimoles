/* FilterChips · 7.2 Entrada y selección · HF: 1 Base - Filtro Lista (Mis seguimientos, 2.2)
   Filtro de selección única sobre una lista. Botones con aria-pressed (la HF usaba tablist, pero no hay paneles de tabs). */
(function () {
  var NS = window.DSimoles, h = NS.h;
  NS.css('filter-chips', [
    '.dsm-filters{display:flex;flex-wrap:wrap;gap:var(--ds-space-2)}',
    '.dsm-filter{display:inline-flex;align-items:center;gap:var(--ds-space-1);min-height:var(--ds-size-control-xs);padding:var(--ds-space-1) var(--ds-space-3);border:var(--ds-border-width-thin) solid var(--ds-color-border-control);border-radius:var(--ds-radius-pill);background:var(--ds-color-bg-surface);font:var(--ds-type-ui);letter-spacing:var(--ds-type-ui-tracking);text-transform:uppercase;color:var(--ds-color-text-body);cursor:pointer}',
    '.dsm-filter:hover,.dsm-filter.is-hover{background-image:linear-gradient(var(--ds-color-surface-hover),var(--ds-color-surface-hover));border-color:var(--ds-color-border-control-hover)}',
    '.dsm-filter:active,.dsm-filter.is-pressed{background-image:linear-gradient(var(--ds-color-surface-pressed),var(--ds-color-surface-pressed))}',
    '.dsm-filter[aria-pressed="true"]{background:var(--ds-color-action-primary);border-color:var(--ds-color-action-primary);color:var(--ds-color-text-inverse)}'
  ].join('\n'));

  NS.FilterChips = function FilterChips(p) {
    var opts = NS.list(p.options);
    var v = NS.useControlled(p.value, p.defaultValue || opts[0], p.onChange);
    return h('div', { role: 'group', 'aria-label': p.label || 'Filtrar', className: 'dsm-root dsm-filters' },
      opts.map(function (o, i) {
        var on = o === v[0];
        return h('button', {
          key: o, type: 'button', 'aria-pressed': on,
          className: NS.cx('dsm-reset dsm-focus dsm-target dsm-filter', p.demoIndex === i && NS.state(p.demoState)),
          onClick: function () { v[1](o); }
        }, on ? h(NS.Icon, { name: 'check', size: 'xs' }) : null, o);
      }));
  };
})();
