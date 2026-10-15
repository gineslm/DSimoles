/* Nav-Pager · 7.8 · HF: 1 Base - Paginador
   Anterior / siguiente dentro de una secuencia corta de elementos. No es paginación de resultados.
   label (qué se recorre) y unit (singular) obligatorios. «n/N» visible, oculto al lector; anuncio en vivo «{unit} n de N».
   Botones: Act-Button xs solo icono (anterior secondary, siguiente primary). No es circular: en los bordes, aria-disabled. Requiere Button.js. */
(function () {
  var NS = window.DSimoles, h = NS.h;
  NS.css('pager', [
    '.dsm-pager{display:inline-flex;align-items:center;gap:var(--ds-space-3)}',
    '.dsm-pager__count{font:var(--ds-type-ui);font-variant-numeric:tabular-nums;color:var(--ds-color-text-secondary)}',
    '.dsm-pager__btns{display:inline-flex;gap:var(--ds-space-2)}'
  ].join('\n'));
  var warned = false;

  NS.Pager = function Pager(p) {
    if ((!p.label || !p.unit) && !warned) { warned = true; console.warn('DSimoles.Pager: label y unit son obligatorios.'); }
    var total = Math.max(1, Number(p.total) || 1);
    var v = NS.useControlled(p.current != null ? Number(p.current) : undefined, Number(p.defaultCurrent) || 1, p.onChange);
    var cur = Math.min(total, Math.max(1, v[0]));
    var btn = function (dir) {
      var dis = dir < 0 ? cur <= 1 : cur >= total;
      return h(NS.Button, {
        key: dir, size: 'xs', iconOnly: true, variant: dir < 0 ? 'secondary' : 'primary',
        icon: dir < 0 ? 'chevron_left' : 'chevron_right', label: dir < 0 ? 'Anterior' : 'Siguiente',
        disabled: dis, demoState: dir > 0 ? p.demoState : undefined,
        onClick: function () { v[1](cur + dir); }
      });
    };
    return h('div', { className: 'dsm-root dsm-pager', role: 'group', 'aria-label': p.label },
      h('span', { className: 'dsm-pager__count', 'aria-hidden': 'true' }, cur + '/' + total),
      h('span', { className: 'dsm-sr', 'aria-live': 'polite' }, (p.unit || '') + ' ' + cur + ' de ' + total),
      h('span', { className: 'dsm-pager__btns' }, btn(-1), btn(1)));
  };
})();
