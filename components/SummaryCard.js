/* SummaryCard · 7.4 Presentación · HF: 1 Base - Card Resumen
   Acento lateral de 4 px (border.width.heavy): correcto porque lleva etiqueta (visuals.borders). */
(function () {
  var NS = window.DSimoles, h = NS.h;
  NS.css('summary-card', [
    '.dsm-summary{display:flex;flex-direction:column;gap:var(--ds-space-half);padding-left:var(--ds-space-3);border-left:var(--ds-border-width-heavy) solid var(--ds-color-brand-primary)}',
    '.dsm-summary__label{font:var(--ds-type-ui);letter-spacing:var(--ds-type-ui-tracking);text-transform:uppercase;color:var(--ds-color-text-secondary)}',
    '.dsm-summary__value{font:var(--ds-type-label);color:var(--ds-color-text-primary)}',
    '.dsm-summary__detail{font:var(--ds-type-caption);color:var(--ds-color-text-secondary)}'
  ].join('\n'));

  NS.SummaryCard = function SummaryCard(p) {
    return h('div', { className: 'dsm-root dsm-summary' },
      h('span', { className: 'dsm-summary__label' }, p.label || 'Resumen'),
      h('span', { className: 'dsm-summary__value' }, p.value),
      p.detail ? h('span', { className: 'dsm-summary__detail' }, p.detail) : null);
  };
})();
