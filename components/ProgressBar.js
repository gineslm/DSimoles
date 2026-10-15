/* Fb-ProgressBar · 7.18 · entrada propia desde el 2026-10-15 (antes dentro de ProcessSteps.js).
   Avance cuantificable de una operación: value 0–100, label obligatorio, texto visible opcional (showValue: «45 %»).
   Sin modo indeterminado: para eso está Fb-Spinner. */
(function () {
  var NS = window.DSimoles, h = NS.h;
  NS.css('progress-bar', [
    '.dsm-progress-wrap{display:flex;align-items:center;gap:var(--ds-space-3)}',
    '.dsm-progress{position:relative;flex:1;height:var(--ds-size-progress);border-radius:var(--ds-radius-pill);background:var(--ds-color-border-subtle);overflow:hidden}',
    '.dsm-progress__fill{position:absolute;inset:0 auto 0 0;border-radius:var(--ds-radius-pill);background:var(--ds-color-brand-primary)}',
    '.dsm-progress--error .dsm-progress__fill{background:var(--ds-color-status-error-fill)}',
    '.dsm-progress__value{flex-shrink:0;font:var(--ds-type-small);font-variant-numeric:tabular-nums;color:var(--ds-color-text-secondary)}'
  ].join('\n'));

  NS.ProgressBar = function ProgressBar(p) {
    var v = Math.max(0, Math.min(100, Math.round(Number(p.value) || 0)));
    var bar = h('div', { className: NS.cx('dsm-root dsm-progress', p.tone === 'error' && 'dsm-progress--error'), role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': v, 'aria-label': p.label },
      h('div', { className: 'dsm-progress__fill', style: { width: v + '%' } }));
    if (!p.showValue) return bar;
    return h('div', { className: 'dsm-root dsm-progress-wrap' }, bar, h('span', { className: 'dsm-progress__value', 'aria-hidden': 'true' }, v + ' %'));
  };
})();
