/* StatusChip · 7.4 Presentación · HF: 1 Base - Chip Estado */
(function () {
  var NS = window.DSimoles, h = NS.h;
  var TONES = {
    'risk-high': ['--ds-color-risk-high-tint', '--ds-color-risk-high-text'],
    'risk-medium': ['--ds-color-risk-medium-tint', '--ds-color-risk-medium-text'],
    'risk-low': ['--ds-color-risk-low-tint', '--ds-color-risk-low-text'],
    'not-assessable': ['--ds-color-not-assessable-tint', '--ds-color-not-assessable-text'],
    upcoming: ['--ds-color-brand-tint', '--ds-color-brand-text'],
    overdue: ['--ds-color-action-alert', '--ds-color-text-inverse'],
    neutral: ['--ds-color-chip-neutral-bg', '--ds-color-text-body'],
    'on-fill': ['--ds-color-bg-surface', '--ds-color-text-primary']
  };
  var css = ['.dsm-chip{display:inline-flex;align-items:center;gap:var(--ds-space-1);width:fit-content;max-width:100%;padding:var(--ds-space-1) var(--ds-space-2);border-radius:var(--ds-radius-pill);font:var(--ds-type-ui);letter-spacing:var(--ds-type-ui-tracking);text-transform:uppercase}'];
  Object.keys(TONES).forEach(function (k) { css.push('.dsm-chip--' + k + '{background:var(' + TONES[k][0] + ');color:var(' + TONES[k][1] + ')}'); });
  NS.css('status-chip', css.join('\n'));
  NS.STATUS_TONES = Object.keys(TONES);

  NS.StatusChip = function StatusChip(p) {
    var tone = TONES[p.tone] ? p.tone : 'neutral';
    var style = p.color ? { color: p.color } : undefined;
    return h('span', { className: NS.cx('dsm-root dsm-chip', 'dsm-chip--' + tone), style: style }, p.label != null ? p.label : p.children);
  };
})();
