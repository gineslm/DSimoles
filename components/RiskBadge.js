/* RiskBadge · 9.1 (iMoles) · HF: 1 Base - Insignia Riesgo
   md 28 / sm 24: hexágono relleno con texto blanco. inline: sin fondo, texto del color de riesgo (filas y tarjetas). */
(function () {
  var NS = window.DSimoles, h = NS.h, R = window.React;
  NS.css('risk-badge', [
    '.dsm-risk{position:relative;display:inline-flex;align-items:center;width:fit-content;max-width:100%;color:var(--ds-color-text-inverse)}',
    '.dsm-risk--md{padding-block:6px}' /* 6 + 16 + 6 = 28 (size.control.xs) */,
    '.dsm-risk--sm{padding-block:var(--ds-space-1)}',
    '.dsm-risk__shape{position:absolute;inset:0;width:100%;height:100%;overflow:visible}',
    '.dsm-risk__content{position:relative;display:flex;align-items:center;gap:var(--ds-space-2);font:var(--ds-type-ui);letter-spacing:var(--ds-type-ui-tracking);text-transform:uppercase}',
    '.dsm-risk--inline .dsm-risk__content{font:var(--ds-type-small);text-transform:none;letter-spacing:normal}'
  ].join('\n'));

  function norm(v) { var l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l]; }
  function rounded(pts, radius) {
    var d = '', n = pts.length;
    for (var i = 0; i < n; i++) {
      var pr = pts[(i - 1 + n) % n], c = pts[i], nx = pts[(i + 1) % n];
      var v1 = norm([c[0] - pr[0], c[1] - pr[1]]), v2 = norm([nx[0] - c[0], nx[1] - c[1]]);
      var r = Math.min(radius, Math.hypot(c[0] - pr[0], c[1] - pr[1]) / 2, Math.hypot(nx[0] - c[0], nx[1] - c[1]) / 2);
      var a = [c[0] - v1[0] * r, c[1] - v1[1] * r], b = [c[0] + v2[0] * r, c[1] + v2[1] * r];
      d += (i === 0 ? 'M ' : 'L ') + a[0] + ' ' + a[1] + ' Q ' + c[0] + ' ' + c[1] + ' ' + b[0] + ' ' + b[1] + ' ';
    }
    return d + 'Z';
  }
  var tipRatio = null;
  function tip() {
    if (tipRatio == null) tipRatio = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ds-component-risk-badge-tip')) || 0.3372;
    return tipRatio;
  }
  function px(name, fb) { return parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || fb; }

  NS.RiskBadge = function RiskBadge(p) {
    var level = NS.RISK[p.level] ? p.level : 'high';
    var size = p.size || 'md';
    var inline = size === 'inline';
    var ref = R.useRef(null);
    var st = R.useState({ w: 220, h: size === 'sm' ? 24 : 28 });
    var box = st[0], setBox = st[1];
    R.useLayoutEffect(function () {
      if (inline || !ref.current) return;
      var el = ref.current;
      var m = function () {
        var r = el.getBoundingClientRect();
        if (!r.width || !r.height) return;
        setBox(function (b) { return (Math.abs(r.width - b.w) > 0.5 || Math.abs(r.height - b.h) > 0.5) ? { w: r.width, h: r.height } : b; });
      };
      m();
      var ro = new ResizeObserver(m); ro.observe(el);
      return function () { ro.disconnect(); };
    }, [inline]);
    var fill = NS.riskVar(level, 'fill');
    var label = p.label != null ? p.label : NS.RISK[level].label;
    var glyph = inline ? 14 : px(size === 'sm' ? '--ds-component-risk-glyph-sm' : '--ds-component-risk-glyph-md', 16);
    var style = inline ? { color: NS.riskVar(level, 'text') } : { paddingInline: Math.round(box.h * tip() + (size === 'sm' ? 6 : 8)) + 'px' };
    var t = box.h * tip();
    var pts = [[t, 0], [box.w - t, 0], [box.w, box.h / 2], [box.w - t, box.h], [t, box.h], [0, box.h / 2]];
    return h('span', { ref: ref, className: NS.cx('dsm-root dsm-risk', 'dsm-risk--' + size), style: style },
      inline ? null : h('svg', { className: 'dsm-risk__shape', preserveAspectRatio: 'none', 'aria-hidden': 'true', focusable: 'false' }, h('path', { d: rounded(pts, 4), fill: fill })),
      h('span', { className: 'dsm-risk__content' },
        h(NS.RiskGlyph, { level: level, size: glyph, cutout: inline ? 'var(--ds-color-bg-surface)' : fill }),
        h('span', null, label)));
  };
})();
