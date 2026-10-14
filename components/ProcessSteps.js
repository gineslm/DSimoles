/* ProcessSteps y ProgressBar · 7.6 Feedback · HF: 1 Base - Pasos Proceso (análisis en el dispositivo, 4.5)
   steps: "Texto::done|current|pending | …". Cada paso dice su estado en texto oculto; la barra es un progressbar con nombre. */
(function () {
  var NS = window.DSimoles, h = NS.h;
  NS.css('process-steps', [
    '.dsm-steps{display:flex;flex-direction:column;gap:var(--ds-space-4)}',
    '.dsm-steps__title{margin:0;font:var(--ds-type-title);color:var(--ds-color-text-primary)}',
    '.dsm-steps__list{display:flex;flex-direction:column;gap:var(--ds-space-2);margin:0;padding:0;list-style:none}',
    '.dsm-steps__item{display:flex;justify-content:space-between;align-items:center;gap:var(--ds-space-3);font:var(--ds-type-body);color:var(--ds-color-text-body)}',
    '.dsm-steps__item--current{font-weight:500;color:var(--ds-color-text-primary)}',
    '.dsm-steps__mark{flex-shrink:0;color:var(--ds-color-brand-primary)}',
    '.dsm-steps__dots{flex-shrink:0;font:var(--ds-type-label);color:var(--ds-color-text-primary)}',
    '.dsm-steps__note{margin:0;font:var(--ds-type-caption);color:var(--ds-color-text-body)}',
    '.dsm-progress{position:relative;height:var(--ds-size-progress);border-radius:var(--ds-radius-pill);background:var(--ds-color-border-subtle);overflow:hidden}',
    '.dsm-progress__fill{position:absolute;inset:0 auto 0 0;border-radius:var(--ds-radius-pill);background:var(--ds-color-brand-primary)}'
  ].join('\n'));

  NS.ProgressBar = function ProgressBar(p) {
    var v = Math.max(0, Math.min(100, Number(p.value) || 0));
    return h('div', { className: 'dsm-root dsm-progress', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': v, 'aria-label': p.label },
      h('div', { className: 'dsm-progress__fill', style: { width: v + '%' } }));
  };

  var SR = { done: 'completado', current: 'en curso', pending: 'pendiente' };
  NS.ProcessSteps = function ProcessSteps(p) {
    var steps = NS.list(p.steps).map(function (s) { var f = NS.fields(s); return { text: f[0], st: SR[f[1]] ? f[1] : 'pending' }; });
    var done = steps.filter(function (s) { return s.st === 'done'; }).length + steps.filter(function (s) { return s.st === 'current'; }).length * 0.5;
    var pct = p.progress != null ? Number(p.progress) : Math.round(done / (steps.length || 1) * 100);
    var Tag = 'h' + (p.headingLevel || 2);
    return h('div', { className: 'dsm-root dsm-steps' },
      p.title ? h(Tag, { className: 'dsm-steps__title' }, p.title) : null,
      h('ol', { className: 'dsm-steps__list' }, steps.map(function (s, i) {
        return h('li', { key: i, className: NS.cx('dsm-steps__item', s.st === 'current' && 'dsm-steps__item--current'), 'aria-current': s.st === 'current' ? 'step' : undefined },
          h('span', null, s.text, h('span', { className: 'dsm-sr' }, ' (' + SR[s.st] + ')')),
          s.st === 'done' ? h(NS.Icon, { name: 'check', size: 'xs', className: 'dsm-steps__mark' }) : (s.st === 'current' ? h('span', { className: 'dsm-steps__dots', 'aria-hidden': 'true' }, '···') : null));
      })),
      h(NS.ProgressBar, { value: pct, label: p.title || 'Progreso' }),
      p.note ? h('p', { className: 'dsm-steps__note' }, p.note) : null);
  };
})();
