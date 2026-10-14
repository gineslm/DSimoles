/* DSimoles · núcleo de la librería de componentes.
   Requiere React (assets/_runtime/) y los tokens (assets/visuals/tokens.css + components/tokens.css).
   Cada componente se registra en window.DSimoles y trae su propio CSS, que solo usa var(--ds-*).
   Props de lista: array o texto separado por «|»; los campos de cada elemento se separan con «::». */
(function () {
  var R = window.React;
  var h = R.createElement;
  var NS = (window.DSimoles = window.DSimoles || {});
  var injected = {};
  var n = 0;

  NS.h = h;
  NS.css = function (id, text) {
    if (injected[id]) return;
    injected[id] = true;
    var s = document.createElement('style');
    s.setAttribute('data-dsimoles', id);
    s.textContent = text;
    document.head.appendChild(s);
  };
  NS.cx = function () { return [].slice.call(arguments).filter(Boolean).join(' '); };
  NS.list = function (v) {
    if (Array.isArray(v)) return v;
    return String(v == null ? '' : v).split('|').map(function (s) { return s.trim(); }).filter(Boolean);
  };
  NS.fields = function (s) { return String(s).split('::').map(function (x) { return x.trim(); }); };
  NS.state = function (s) { return s ? 'is-' + s : ''; };
  NS.useId = function (p) {
    var ref = R.useRef(null);
    if (!ref.current) ref.current = (p || 'dsm') + '-' + (++n);
    return ref.current;
  };
  NS.useControlled = function (value, defaultValue, onChange) {
    var st = R.useState(defaultValue);
    var controlled = value !== undefined;
    var current = controlled ? value : st[0];
    var set = function (v) { if (!controlled) st[1](v); if (onChange) onChange(v); };
    return [current, set];
  };

  NS.css('core', [
    '.dsm-root,.dsm-root *{box-sizing:border-box}',
    '.dsm-sr{position:absolute!important;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}',
    '.dsm-focus:focus{outline:none}',
    '.dsm-focus:focus-visible,.dsm-focus.is-focus{outline:var(--ds-focus-ring-width) solid var(--ds-color-focus-ring);outline-offset:var(--ds-focus-ring-offset)}',
    '.dsm-target{position:relative}',
    '.dsm-target::after{content:"";position:absolute;left:50%;top:50%;width:max(100%,var(--ds-size-target-min));height:max(100%,var(--ds-size-target-min));transform:translate(-50%,-50%)}',
    '.dsm-reset{appearance:none;-webkit-appearance:none;margin:0;border:0;background:none;font:inherit;color:inherit;text-align:inherit;-webkit-tap-highlight-color:transparent}',
    '.dsm-icon{font-family:var(--ds-type-family-icon);font-weight:400;font-style:normal;line-height:1;letter-spacing:normal;text-transform:none;white-space:nowrap;direction:ltr;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;-webkit-font-feature-settings:"liga";font-feature-settings:"liga";-webkit-font-smoothing:antialiased}',
    '.dsm-icon--xs{font-size:var(--ds-size-icon-xs);width:var(--ds-size-icon-xs);height:var(--ds-size-icon-xs)}',
    '.dsm-icon--sm{font-size:var(--ds-size-icon-sm);width:var(--ds-size-icon-sm);height:var(--ds-size-icon-sm)}',
    '.dsm-icon--md{font-size:var(--ds-size-icon-md);width:var(--ds-size-icon-md);height:var(--ds-size-icon-md)}',
    '.dsm-icon--lg{font-size:var(--ds-size-icon-lg);width:var(--ds-size-icon-lg);height:var(--ds-size-icon-lg)}',
    '.dsm-spinner{display:inline-block;flex-shrink:0;width:var(--ds-size-icon-xs);height:var(--ds-size-icon-xs);border:var(--ds-border-width-thick) solid currentColor;border-right-color:transparent;border-radius:var(--ds-radius-pill);animation:dsm-spin .9s linear infinite}',
    '@keyframes dsm-spin{to{transform:rotate(360deg)}}',
    '@media (prefers-reduced-motion:reduce){.dsm-spinner{animation:none;border-right-color:currentColor;opacity:.6}}',
    '.dsm-thumb{display:block;flex-shrink:0;align-self:stretch;overflow:hidden;background:var(--ds-component-thumb-placeholder);border-radius:var(--ds-component-thumb-radius-inner)}',
    '.dsm-thumb--lg{width:var(--ds-size-thumb-lg);min-height:var(--ds-size-thumb-lg)}',
    '.dsm-thumb--sm{width:var(--ds-size-thumb-sm);min-height:var(--ds-size-thumb-sm)}',
    '.dsm-thumb img{display:block;width:100%;height:100%;object-fit:cover}',
    '.dsm-chevron{color:var(--ds-color-icon-inactive);align-self:center}'
  ].join('\n'));

  /* Thumb · miniatura de la foto de una marca; decorativa (el texto de la fila identifica la marca). */
  NS.Thumb = function Thumb(p) {
    return h('span', { className: NS.cx('dsm-thumb', 'dsm-thumb--' + (p.size || 'lg')), 'aria-hidden': 'true' },
      p.src ? h('img', { src: p.src, alt: '' }) : null);
  };

  /* Icon · Material Symbols Rounded (subconjunto de tokens.css). Decorativo salvo que lleve label. */
  NS.ICONS = ['add', 'arrow_back', 'check', 'chevron_left', 'chevron_right', 'home', 'info', 'more_vert', 'person', 'photo_camera', 'view_list'];
  NS.Icon = function Icon(p) {
    var size = p.size || 'md';
    var a = p.label ? { role: 'img', 'aria-label': p.label } : { 'aria-hidden': 'true' };
    return h('span', Object.assign({ className: NS.cx('dsm-icon', 'dsm-icon--' + size, p.className), style: p.style }, a), p.name);
  };

  NS.Spinner = function Spinner(p) {
    return h('span', { className: NS.cx('dsm-spinner', p.className), 'aria-hidden': 'true' });
  };

  /* RiskGlyph · forma propia de cada nivel de riesgo (la forma no depende del color). */
  NS.RISK = {
    high: { label: 'Riesgo alto', key: 'high' },
    medium: { label: 'Riesgo intermedio', key: 'medium' },
    low: { label: 'Riesgo bajo', key: 'low' },
    'not-assessable': { label: 'No evaluable', key: 'not-assessable' }
  };
  NS.riskVar = function (level, part) {
    var base = level === 'not-assessable' ? '--ds-color-not-assessable-' : '--ds-color-risk-' + (level || 'high') + '-';
    return 'var(' + base + part + ')';
  };
  NS.RiskGlyph = function RiskGlyph(p) {
    var s = p.size || 16;
    var common = { width: s, height: s, viewBox: '0 0 24 24', 'aria-hidden': 'true', focusable: 'false', style: { flexShrink: 0, display: 'block' } };
    var lv = p.level || 'high';
    if (lv === 'high') return h('svg', Object.assign({ fill: 'currentColor' }, common), h('path', { d: 'M12 3 L22 20 L2 20 Z' }));
    if (lv === 'medium') return h('svg', Object.assign({ fill: 'currentColor' }, common), h('path', { d: 'M12 2 L22 12 L12 22 L2 12 Z' }));
    if (lv === 'low') return h('svg', Object.assign({ fill: 'currentColor' }, common), h('circle', { cx: 12, cy: 12, r: 10 }));
    var cut = p.cutout || 'var(--ds-color-bg-surface)';
    return h('svg', Object.assign({ fill: 'none' }, common),
      h('circle', { cx: 12, cy: 12, r: 10, fill: 'currentColor' }),
      h('path', { d: 'M9.5 9.3a2.6 2.6 0 1 1 3.7 2.3c-.8.4-1.2.9-1.2 1.8', stroke: cut, strokeWidth: 2.4, strokeLinecap: 'round' }),
      h('circle', { cx: 12, cy: 16.8, r: 1.2, fill: cut }));
  };
})();
