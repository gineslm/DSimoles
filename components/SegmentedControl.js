/* SegmentedControl · 7.2 Entrada y selección · HF: «Imagen fija / Comparar» en 2 Entidad - Captura Detalle
   Grupo radio compacto para cambiar la vista de un mismo contenido. */
(function () {
  var NS = window.DSimoles, h = NS.h, R = window.React;
  NS.css('segmented', [
    '.dsm-seg{display:inline-flex;gap:var(--ds-space-half);padding:var(--ds-space-half);border-radius:var(--ds-radius-pill);background:var(--ds-color-bg-surface);box-shadow:var(--ds-elevation-interactive)}',
    '.dsm-seg__opt{display:inline-flex;align-items:center;min-height:var(--ds-size-control-xs);padding:var(--ds-space-1) var(--ds-space-3);border-radius:var(--ds-radius-pill);font:var(--ds-type-ui);letter-spacing:var(--ds-type-ui-tracking);text-transform:uppercase;color:var(--ds-color-text-secondary);cursor:pointer}',
    '.dsm-seg__opt:hover,.dsm-seg__opt.is-hover{background-image:linear-gradient(var(--ds-color-surface-hover),var(--ds-color-surface-hover));color:var(--ds-color-text-primary)}',
    '.dsm-seg__opt[aria-checked="true"]{background:var(--ds-color-action-primary);color:var(--ds-color-text-inverse)}'
  ].join('\n'));

  NS.SegmentedControl = function SegmentedControl(p) {
    var opts = NS.list(p.options);
    var v = NS.useControlled(p.value, p.defaultValue || opts[0], p.onChange);
    var refs = R.useRef([]);
    var sel = Math.max(0, opts.indexOf(v[0]));
    var move = function (i) { var n = (i + opts.length) % opts.length; v[1](opts[n]); if (refs.current[n]) refs.current[n].focus(); };
    return h('div', { role: 'radiogroup', 'aria-label': p.label, className: 'dsm-root dsm-seg' },
      opts.map(function (o, i) {
        return h('button', {
          key: o, type: 'button', role: 'radio', 'aria-checked': i === sel, tabIndex: i === sel ? 0 : -1,
          ref: function (el) { refs.current[i] = el; },
          className: NS.cx('dsm-reset dsm-focus dsm-target dsm-seg__opt', p.demoIndex === i && NS.state(p.demoState)),
          onClick: function () { v[1](o); },
          onKeyDown: function (e) {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); move(i + 1); }
            else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); move(i - 1); }
          }
        }, o);
      }));
  };
})();
