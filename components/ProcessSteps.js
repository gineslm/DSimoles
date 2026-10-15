/* Fb-ProcessSteps · 7.19 · HF: 1 Base - Pasos Proceso. Requiere ProgressBar.js.
   Avance de un proceso por pasos con nombre (de segundos a pocos minutos).
   steps: "Texto::done|current|pending|error | …". Cada paso dice su estado en texto oculto.
   Al cambiar el paso en curso se anuncia «Paso n de N: texto» (polite). error: icono, «(error)» y barra en tono error;
   el reintento va en un Fb-InlineAlert debajo (children). */
(function () {
  var NS = window.DSimoles, h = NS.h, R = window.React;
  NS.css('process-steps', [
    '.dsm-steps{display:flex;flex-direction:column;gap:var(--ds-space-4)}',
    '.dsm-steps__title{margin:0;font:var(--ds-type-title);color:var(--ds-color-text-primary)}',
    '.dsm-steps__list{display:flex;flex-direction:column;gap:var(--ds-space-2);margin:0;padding:0;list-style:none}',
    '.dsm-steps__item{display:flex;justify-content:space-between;align-items:center;gap:var(--ds-space-3);font:var(--ds-type-body);color:var(--ds-color-text-body)}',
    '.dsm-steps__item--current{font-weight:500;color:var(--ds-color-text-primary)}',
    '.dsm-steps__item--error{font-weight:500;color:var(--ds-color-status-error-text)}',
    '.dsm-steps__mark{flex-shrink:0;color:var(--ds-color-brand-primary)}',
    '.dsm-steps__mark--error{color:var(--ds-color-status-error-text)}',
    '.dsm-steps__dots{flex-shrink:0;font:var(--ds-type-label);color:var(--ds-color-text-primary)}',
    '.dsm-steps__note{margin:0;font:var(--ds-type-caption);color:var(--ds-color-text-body)}'
  ].join('\n'));

  var SR = { done: 'completado', current: 'en curso', pending: 'pendiente', error: 'error' };
  NS.ProcessSteps = function ProcessSteps(p) {
    var steps = NS.list(p.steps).map(function (s) { var f = NS.fields(s); return { text: f[0], st: SR[f[1]] ? f[1] : 'pending' }; });
    var curIdx = -1;
    steps.forEach(function (s, i) { if (curIdx < 0 && (s.st === 'current' || s.st === 'error')) curIdx = i; });
    var failed = curIdx >= 0 && steps[curIdx].st === 'error';
    var done = steps.filter(function (s) { return s.st === 'done'; }).length + (curIdx >= 0 && !failed ? 0.5 : 0);
    var pct = p.progress != null ? Number(p.progress) : Math.round(done / (steps.length || 1) * 100);
    var announce = curIdx >= 0 ? 'Paso ' + (curIdx + 1) + ' de ' + steps.length + ': ' + steps[curIdx].text + (failed ? ' (error)' : '') : '';
    var first = R.useRef(true), live = R.useState('');
    R.useEffect(function () { if (first.current) { first.current = false; return; } live[1](announce); }, [announce]);
    var Tag = 'h' + (p.headingLevel || 2);
    return h('div', { className: 'dsm-root dsm-steps' },
      p.title ? h(Tag, { className: 'dsm-steps__title' }, p.title) : null,
      h('ol', { className: 'dsm-steps__list' }, steps.map(function (s, i) {
        return h('li', { key: i, className: NS.cx('dsm-steps__item', s.st === 'current' && 'dsm-steps__item--current', s.st === 'error' && 'dsm-steps__item--error'), 'aria-current': i === curIdx ? 'step' : undefined },
          h('span', null, s.text, h('span', { className: 'dsm-sr' }, ' (' + SR[s.st] + ')')),
          s.st === 'done' ? h(NS.Icon, { name: 'check', size: 'xs', className: 'dsm-steps__mark' })
            : s.st === 'error' ? h(NS.Icon, { name: 'error', size: 'xs', className: 'dsm-steps__mark dsm-steps__mark--error' })
            : (s.st === 'current' ? h('span', { className: 'dsm-steps__dots', 'aria-hidden': 'true' }, '···') : null));
      })),
      h(NS.ProgressBar, { value: pct, label: p.title || p.label || 'Progreso', tone: failed ? 'error' : undefined }),
      h('span', { className: 'dsm-sr', 'aria-live': 'polite' }, live[0]),
      p.note ? h('p', { className: 'dsm-steps__note' }, p.note) : null,
      p.children || null);
  };
})();
